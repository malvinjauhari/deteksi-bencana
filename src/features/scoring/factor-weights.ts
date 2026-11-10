import type { FactorKey } from "@/types/disaster";

/**
 * Weight model from docs/DISASTER.md.
 * Weights sum to 1.0 so a complete factor set yields a 0..100 score directly.
 */
export const FACTOR_WEIGHTS: Record<FactorKey, number> = {
  scale: 0.25,
  population_density: 0.25,
  vital_infrastructure: 0.2,
  weather_risk: 0.15,
  community_reports: 0.15,
};

export const FACTOR_KEYS = Object.keys(FACTOR_WEIGHTS) as FactorKey[];

export const FACTOR_LABELS: Record<FactorKey, string> = {
  scale: "skala kejadian",
  population_density: "kepadatan penduduk",
  vital_infrastructure: "dampak pada fasilitas vital",
  weather_risk: "risiko cuaca susulan",
  community_reports: "laporan awal komunitas",
};

export const DISASTER_TYPE_LABELS: Record<string, string> = {
  earthquake: "gempa bumi",
  flood: "banjir",
  forest_fire: "kebakaran hutan",
  landslide: "landslide",
};
