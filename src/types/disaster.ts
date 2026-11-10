export type DisasterType =
  | "earthquake"
  | "flood"
  | "forest_fire"
  | "landslide";

export type DisasterStatus = "monitoring" | "campaign";
export type Severity = "rendah" | "waspada" | "kritis" | "belum_dinilai";
export type UserRole =
  | "AWAM"
  | "WARGA_LOKAL"
  | "NGO_RELAWAN"
  | "OTORITAS";
export type ScoreFactor = number | null;

export interface ScoringFactors {
  scale: ScoreFactor;
  population_density: ScoreFactor;
  vital_infrastructure: ScoreFactor;
  weather_risk: ScoreFactor;
  community_reports: ScoreFactor;
}

export interface Disaster {
  id: string;
  type: DisasterType;
  title: string;
  location: { lat: number; lng: number; description: string };
  source_name: string;
  source_reference: string | null;
  occurred_at: string;
  status: DisasterStatus;
  total_vote_weight: number;
  voter_count: number;
  scoring_factors: ScoringFactors;
  mitigation_steps: string[];
  is_simulation: true;
  created_at: string;
  updated_at: string;
}
