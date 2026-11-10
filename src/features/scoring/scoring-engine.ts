import {
  FACTOR_KEYS,
  FACTOR_LABELS,
  FACTOR_WEIGHTS,
  DISASTER_TYPE_LABELS,
} from "@/features/scoring/factor-weights";
import { classifySeverity, SEVERITY_LABELS } from "@/features/scoring/severity";
import { scoringFactorsSchema } from "@/lib/validation/schemas";
import type {
  Analysis,
  Disaster,
  FactorBreakdown,
  ScoringFactors,
} from "@/types/disaster";

export const ENGINE_VERSION = "1.0.0";

export interface ScoringResult {
  urgency_score: number | null;
  severity: Severity;
  factor_breakdown: FactorBreakdown[];
  data_completeness: number;
  is_provisional: boolean;
}

type Severity = ReturnType<typeof classifySeverity>;

/**
 * Deterministic weighted scoring.
 *
 * Complete data: score = round(sum(value * weight)).
 * Missing data: missing factors are never invented. The score is renormalised
 * over the available weight, flagged as provisional, and the completeness
 * percentage is reported. When every factor is missing the score is null.
 */
export function calculateUrgencyScore(input: ScoringFactors): ScoringResult {
  const parsed = scoringFactorsSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(
      `Faktor skor tidak valid: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
    );
  }

  const factors = parsed.data;
  const available = FACTOR_KEYS.filter((key) => factors[key] !== null);
  const availableWeight = available.reduce(
    (total, key) => total + FACTOR_WEIGHTS[key],
    0,
  );
  const dataCompleteness = Math.round(availableWeight * 100);
  const isProvisional = available.length < FACTOR_KEYS.length;

  const rawContributions = FACTOR_KEYS.map((key) => {
    const value = factors[key];
    if (value === null) return null;
    return (value * FACTOR_WEIGHTS[key]) / availableWeight;
  });

  const factorBreakdown: FactorBreakdown[] = FACTOR_KEYS.map((key, index) => {
    const value = factors[key];
    const raw = rawContributions[index];
    return {
      key,
      value,
      weight: FACTOR_WEIGHTS[key],
      contribution: raw === null ? null : round(raw),
    };
  });

  if (available.length === 0) {
    return {
      urgency_score: null,
      severity: "belum_dinilai",
      factor_breakdown: factorBreakdown,
      data_completeness: 0,
      is_provisional: true,
    };
  }

  // Sum the unrounded contributions so the score matches the documented
  // formula exactly; rounding happens once, at the end.
  let raw = 0;
  for (const contribution of rawContributions) {
    if (contribution !== null) raw += contribution;
  }
  const urgencyScore = clamp(Math.round(raw), 0, 100);

  return {
    urgency_score: urgencyScore,
    severity: classifySeverity(urgencyScore),
    factor_breakdown: factorBreakdown,
    data_completeness: dataCompleteness,
    is_provisional: isProvisional,
  };
}

/**
 * Human-readable narrative built from templates.
 * No LLM is involved; the text only restates computed values.
 */
export function buildNarrative(
  disaster: Pick<Disaster, "type" | "location" | "scoring_factors">,
  result: ScoringResult,
): string {
  const typeLabel = DISASTER_TYPE_LABELS[disaster.type] ?? disaster.type;
  const location = disaster.location.description;

  if (result.urgency_score === null) {
    return `Simulasi ${typeLabel} di ${location} belum dapat dinilai karena kelima faktor data belum tersedia. `
      + "Kelengkapan data 0%.";
  }

  const severityLabel = SEVERITY_LABELS[result.severity];
  const leading = `Simulasi ${typeLabel} di ${location} memiliki skor urgensi ${result.urgency_score} dari 100 dengan status ${severityLabel}.`;

  const scored = result.factor_breakdown
    .filter((factor) => factor.value !== null)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const dominant = scored[0];
  const dominantText = dominant
    ? ` Faktor tertinggi yang tersedia adalah ${FACTOR_LABELS[dominant.key]} (${dominant.value} dari 100).`
    : "";

  const missing = result.factor_breakdown
    .filter((factor) => factor.value === null)
    .map((factor) => FACTOR_LABELS[factor.key]);

  const completenessText = result.is_provisional
    ? ` Skor bersifat sementara: kelengkapan data ${result.data_completeness}% dengan ${missing.join(" dan ")} belum tersedia.`
    : ` Kelengkapan data 100% dari kelima faktor simulasi.`;

  return `${leading}${dominantText}${completenessText} `
    + "Seluruh angka merupakan simulasi lokal dan bukan peringatan dini resmi.";
}

export function buildAnalysis(
  disaster: Pick<Disaster, "id" | "type" | "location" | "scoring_factors">,
  now: Date = new Date(),
): Analysis {
  const result = calculateUrgencyScore(disaster.scoring_factors);

  return {
    disaster_id: disaster.id,
    urgency_score: result.urgency_score,
    severity: result.severity,
    factor_breakdown: result.factor_breakdown,
    human_readable_analysis: buildNarrative(disaster, result),
    data_completeness: result.data_completeness,
    is_provisional: result.is_provisional,
    calculated_at: now.toISOString(),
    engine_version: ENGINE_VERSION,
  };
}

function round(value: number) {
  return Math.round(value * 10_000) / 10_000;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
