import type { Severity } from "@/types/disaster";

export const SEVERITY_THRESHOLDS = {
  kritis: 70,
  waspada: 40,
} as const;

export const SEVERITY_LABELS: Record<Severity, string> = {
  rendah: "rendah",
  waspada: "waspada",
  kritis: "kritis",
  belum_dinilai: "belum dinilai",
};

/**
 * Severity bands from docs/DISASTER.md:
 * 0-39 rendah, 40-69 waspada, 70-100 kritis, null belum_dinilai.
 */
export function classifySeverity(score: number | null): Severity {
  if (score === null) return "belum_dinilai";
  if (score >= SEVERITY_THRESHOLDS.kritis) return "kritis";
  if (score >= SEVERITY_THRESHOLDS.waspada) return "waspada";
  return "rendah";
}
