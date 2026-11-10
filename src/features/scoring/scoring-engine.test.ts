import { describe, expect, it } from "vitest";
import {
  buildAnalysis,
  buildNarrative,
  calculateUrgencyScore,
  ENGINE_VERSION,
} from "@/features/scoring/scoring-engine";
import { classifySeverity } from "@/features/scoring/severity";
import { FACTOR_WEIGHTS } from "@/features/scoring/factor-weights";
import type { ScoringFactors } from "@/types/disaster";

const complete: ScoringFactors = {
  scale: 80,
  population_density: 60,
  vital_infrastructure: 50,
  weather_risk: 40,
  community_reports: 30,
};

function factorMap(result: ReturnType<typeof calculateUrgencyScore>) {
  return Object.fromEntries(
    result.factor_breakdown.map((factor) => [factor.key, factor]),
  );
}

describe("calculateUrgencyScore", () => {
  it("applies the documented weights for complete data", () => {
    // 80*0.25 + 60*0.25 + 50*0.20 + 40*0.15 + 30*0.15 = 55.5 -> 56
    const result = calculateUrgencyScore(complete);
    expect(result.urgency_score).toBe(56);
    expect(result.severity).toBe("waspada");
    expect(result.data_completeness).toBe(100);
    expect(result.is_provisional).toBe(false);
  });

  it("keeps the score inside the 0..100 range", () => {
    const highest = calculateUrgencyScore({
      scale: 100,
      population_density: 100,
      vital_infrastructure: 100,
      weather_risk: 100,
      community_reports: 100,
    });
    expect(highest.urgency_score).toBe(100);
    expect(highest.severity).toBe("kritis");

    const lowest = calculateUrgencyScore({
      scale: 0,
      population_density: 0,
      vital_infrastructure: 0,
      weather_risk: 0,
      community_reports: 0,
    });
    expect(lowest.urgency_score).toBe(0);
    expect(lowest.severity).toBe("rendah");
  });

  it("renormalises over the available weight when a factor is missing", () => {
    // Missing community_reports (weight 0.15).
    // sum(value*weight) = 51 ; available weight = 0.85 ; 51 / 0.85 = 60
    const result = calculateUrgencyScore({ ...complete, community_reports: null });
    expect(result.urgency_score).toBe(60);
    expect(result.data_completeness).toBe(85);
    expect(result.is_provisional).toBe(true);

    const factors = factorMap(result);
    expect(factors.community_reports.value).toBeNull();
    expect(factors.community_reports.contribution).toBeNull();
    expect(factors.scale.contribution).toBeCloseTo((80 * 0.25) / 0.85, 4);
  });

  it("never invents values for missing factors", () => {
    const result = calculateUrgencyScore({
      scale: 50,
      population_density: null,
      vital_infrastructure: null,
      weather_risk: null,
      community_reports: null,
    });

    const factors = factorMap(result);
    expect(factors.population_density.value).toBeNull();
    expect(factors.vital_infrastructure.value).toBeNull();
    expect(factors.weather_risk.value).toBeNull();
    expect(factors.community_reports.value).toBeNull();
    expect(result.data_completeness).toBe(25);
    expect(result.is_provisional).toBe(true);
  });

  it("returns a null score when every factor is missing", () => {
    const result = calculateUrgencyScore({
      scale: null,
      population_density: null,
      vital_infrastructure: null,
      weather_risk: null,
      community_reports: null,
    });

    expect(result.urgency_score).toBeNull();
    expect(result.severity).toBe("belum_dinilai");
    expect(result.data_completeness).toBe(0);
    expect(result.is_provisional).toBe(true);
    expect(result.factor_breakdown).toHaveLength(5);
    expect(result.factor_breakdown.every((f) => f.contribution === null)).toBe(true);
  });

  it("rejects invalid and non-finite factor values", () => {
    expect(() => calculateUrgencyScore({ ...complete, scale: 120 })).toThrow();
    expect(() => calculateUrgencyScore({ ...complete, scale: -5 })).toThrow();
    expect(() =>
      calculateUrgencyScore({ ...complete, scale: Number.NaN }),
    ).toThrow();
    expect(() =>
      calculateUrgencyScore({ ...complete, scale: Number.POSITIVE_INFINITY }),
    ).toThrow();
  });

  it("is deterministic for identical input", () => {
    const first = calculateUrgencyScore(complete);
    const second = calculateUrgencyScore(complete);
    expect(second).toEqual(first);
  });

  it("exposes weights that sum to one", () => {
    const total = Object.values(FACTOR_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    expect(total).toBeCloseTo(1, 10);
  });
});

describe("classifySeverity", () => {
  it("maps score bands to severity labels", () => {
    expect(classifySeverity(0)).toBe("rendah");
    expect(classifySeverity(39)).toBe("rendah");
    expect(classifySeverity(40)).toBe("waspada");
    expect(classifySeverity(69)).toBe("waspada");
    expect(classifySeverity(70)).toBe("kritis");
    expect(classifySeverity(100)).toBe("kritis");
    expect(classifySeverity(null)).toBe("belum_dinilai");
  });
});

describe("buildNarrative", () => {
  const disaster = {
    type: "flood" as const,
    location: { lat: -6.2, lng: 106.8, description: "Kawasan simulasi Jakarta" },
    scoring_factors: complete,
  };

  it("mentions severity, the dominant factor, and completeness", () => {
    const result = calculateUrgencyScore(complete);
    const narrative = buildNarrative(disaster, result);

    expect(narrative).toContain("banjir");
    expect(narrative).toContain("Kawasan simulasi Jakarta");
    expect(narrative).toContain("56");
    expect(narrative).toContain("waspada");
    expect(narrative).toContain("skala kejadian");
    expect(narrative).toContain("Kelengkapan data 100%");
    expect(narrative).toContain("simulasi lokal");
  });

  it("lists missing factors for a provisional score", () => {
    const result = calculateUrgencyScore({ ...complete, weather_risk: null });
    const narrative = buildNarrative(disaster, result);

    expect(narrative).toContain("sementara");
    expect(narrative).toContain("risiko cuaca susulan");
    expect(narrative).toContain("kelengkapan data 85%");
  });

  it("explains an unscoreable disaster without inventing factors", () => {
    const result = calculateUrgencyScore({
      scale: null,
      population_density: null,
      vital_infrastructure: null,
      weather_risk: null,
      community_reports: null,
    });
    const narrative = buildNarrative(disaster, result);

    expect(narrative).toContain("belum dapat dinilai");
    expect(narrative).toContain("Kelengkapan data 0%");
    expect(narrative).not.toContain("skor urgensi");
  });
});

describe("buildAnalysis", () => {
  it("produces a complete analysis payload", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const analysis = buildAnalysis(
      {
        id: "sim-flood-002",
        type: "flood",
        location: { lat: -6.2, lng: 106.8, description: "Kawasan simulasi Jakarta" },
        scoring_factors: complete,
      },
      now,
    );

    expect(analysis.disaster_id).toBe("sim-flood-002");
    expect(analysis.urgency_score).toBe(56);
    expect(analysis.severity).toBe("waspada");
    expect(analysis.factor_breakdown).toHaveLength(5);
    expect(analysis.data_completeness).toBe(100);
    expect(analysis.is_provisional).toBe(false);
    expect(analysis.calculated_at).toBe("2026-01-01T00:00:00.000Z");
    expect(analysis.engine_version).toBe(ENGINE_VERSION);
    expect(analysis.human_readable_analysis.length).toBeGreaterThan(0);
  });
});
