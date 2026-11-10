import { describe, expect, it } from "vitest";
import {
  analysisSchema,
  demoUserSchema,
  disasterFiltersSchema,
  disasterSchema,
  scoreFactorSchema,
  scoringFactorsSchema,
  voteSchema,
} from "@/lib/validation/schemas";
import { disasterFixtures } from "@/lib/db/fixtures/disasters";
import { demoUserFixtures } from "@/lib/db/fixtures/demo-users";

describe("scoreFactorSchema", () => {
  it("accepts values inside 0..100 and null", () => {
    expect(scoreFactorSchema.safeParse(0).success).toBe(true);
    expect(scoreFactorSchema.safeParse(100).success).toBe(true);
    expect(scoreFactorSchema.safeParse(42.5).success).toBe(true);
    expect(scoreFactorSchema.safeParse(null).success).toBe(true);
  });

  it("rejects out-of-range and non-finite values", () => {
    expect(scoreFactorSchema.safeParse(-1).success).toBe(false);
    expect(scoreFactorSchema.safeParse(101).success).toBe(false);
    expect(scoreFactorSchema.safeParse(Number.NaN).success).toBe(false);
    expect(scoreFactorSchema.safeParse(Number.POSITIVE_INFINITY).success).toBe(false);
    expect(scoreFactorSchema.safeParse("50").success).toBe(false);
  });
});

describe("scoringFactorsSchema", () => {
  it("requires exactly the five known factors", () => {
    const result = scoringFactorsSchema.safeParse({
      scale: 10,
      population_density: 10,
      vital_infrastructure: 10,
      weather_risk: 10,
      community_reports: 10,
    });
    expect(result.success).toBe(true);

    const missing = scoringFactorsSchema.safeParse({ scale: 10 });
    expect(missing.success).toBe(false);
  });
});

describe("disasterSchema", () => {
  it("accepts every simulation fixture shape", () => {
    for (const fixture of disasterFixtures) {
      const parsed = disasterSchema.safeParse({
        id: fixture.id,
        type: fixture.type,
        title: fixture.title,
        location: fixture.location,
        source_name: fixture.source_name,
        source_reference: fixture.source_reference,
        occurred_at: "2026-01-01T00:00:00.000Z",
        status: fixture.status,
        total_vote_weight: 0,
        voter_count: 0,
        scoring_factors: fixture.scoring_factors,
        mitigation_steps: fixture.mitigation_steps,
        is_simulation: true,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      });
      expect(parsed.success, fixture.id).toBe(true);
    }
  });

  it("rejects out-of-range coordinates and non-simulation records", () => {
    const base = {
      id: "x",
      type: "flood",
      title: "Judul",
      location: { lat: 0, lng: 0, description: "Lokasi" },
      source_name: "Sumber",
      source_reference: null,
      occurred_at: "2026-01-01T00:00:00.000Z",
      status: "monitoring",
      total_vote_weight: 0,
      voter_count: 0,
      scoring_factors: {
        scale: 1,
        population_density: 1,
        vital_infrastructure: 1,
        weather_risk: 1,
        community_reports: 1,
      },
      mitigation_steps: ["Langkah"],
      is_simulation: true,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };

    expect(
      disasterSchema.safeParse({
        ...base,
        location: { ...base.location, lat: 120 },
      }).success,
    ).toBe(false);
    expect(
      disasterSchema.safeParse({
        ...base,
        location: { ...base.location, lng: -220 },
      }).success,
    ).toBe(false);
    expect(disasterSchema.safeParse({ ...base, is_simulation: false }).success).toBe(
      false,
    );
    expect(disasterSchema.safeParse({ ...base, type: "tsunami" }).success).toBe(false);
    expect(disasterSchema.safeParse({ ...base, status: "archived" }).success).toBe(
      false,
    );
  });
});

describe("analysisSchema", () => {
  it("rejects a breakdown that is not five factors", () => {
    const base = {
      disaster_id: "sim-flood-002",
      urgency_score: 61,
      severity: "waspada",
      factor_breakdown: [],
      human_readable_analysis: "Narasi simulasi.",
      data_completeness: 100,
      is_provisional: false,
      calculated_at: "2026-01-01T00:00:00.000Z",
      engine_version: "1.0.0",
    };
    expect(analysisSchema.safeParse(base).success).toBe(false);
  });

  it("accepts a null score with the unassessed severity", () => {
    const result = analysisSchema.safeParse({
      disaster_id: "sim-earthquake-006",
      urgency_score: null,
      severity: "belum_dinilai",
      factor_breakdown: [
        { key: "scale", value: null, weight: 0.25, contribution: null },
        { key: "population_density", value: null, weight: 0.25, contribution: null },
        { key: "vital_infrastructure", value: null, weight: 0.2, contribution: null },
        { key: "weather_risk", value: null, weight: 0.15, contribution: null },
        { key: "community_reports", value: null, weight: 0.15, contribution: null },
      ],
      human_readable_analysis: "Narasi simulasi.",
      data_completeness: 0,
      is_provisional: true,
      calculated_at: "2026-01-01T00:00:00.000Z",
      engine_version: "1.0.0",
    });
    expect(result.success).toBe(true);
  });
});

describe("demoUserSchema and voteSchema", () => {
  it("accepts every demo profile fixture", () => {
    for (const user of demoUserFixtures) {
      expect(demoUserSchema.safeParse(user).success, user.id).toBe(true);
    }
  });

  it("rejects a non-demo profile and an out-of-range vote weight", () => {
    expect(
      demoUserSchema.safeParse({ ...demoUserFixtures[0], is_demo: false }).success,
    ).toBe(false);
    expect(
      demoUserSchema.safeParse({ ...demoUserFixtures[0], weight: 4 }).success,
    ).toBe(false);

    const vote = {
      id: "vote-1",
      disaster_id: "sim-flood-002",
      demo_user_id: "demo-user-warga",
      weight: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    };
    expect(voteSchema.safeParse(vote).success).toBe(true);
    expect(voteSchema.safeParse({ ...vote, weight: 0 }).success).toBe(false);
    expect(voteSchema.safeParse({ ...vote, weight: 4 }).success).toBe(false);
  });
});

describe("disasterFiltersSchema", () => {
  it("accepts valid filters and rejects unknown values", () => {
    expect(
      disasterFiltersSchema.safeParse({
        query: "banjir",
        type: "flood",
        status: "monitoring",
        sort: "urgency_desc",
      }).success,
    ).toBe(true);

    expect(
      disasterFiltersSchema.safeParse({
        query: "",
        type: "all",
        status: "all",
        sort: "urgency_desc",
      }).success,
    ).toBe(true);

    expect(
      disasterFiltersSchema.safeParse({
        query: "",
        type: "tsunami",
        status: "all",
        sort: "urgency_desc",
      }).success,
    ).toBe(false);

    expect(
      disasterFiltersSchema.safeParse({
        query: "",
        type: "all",
        status: "all",
        sort: "random",
      }).success,
    ).toBe(false);
  });
});
