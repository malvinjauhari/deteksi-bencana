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

export type FactorKey = keyof ScoringFactors;

export interface FactorBreakdown {
  key: FactorKey;
  value: ScoreFactor;
  weight: number;
  contribution: number | null;
}

export interface Analysis {
  disaster_id: string;
  urgency_score: number | null;
  severity: Severity;
  factor_breakdown: FactorBreakdown[];
  human_readable_analysis: string;
  data_completeness: number;
  is_provisional: boolean;
  calculated_at: string;
  engine_version: string;
}

export type VoteWeight = 1 | 2 | 3;

export interface DemoUser {
  id: string;
  display_name: string;
  role: UserRole;
  weight: 0 | VoteWeight;
  is_demo: true;
}

export interface Vote {
  id: string;
  disaster_id: string;
  demo_user_id: string;
  weight: VoteWeight;
  created_at: string;
}

export interface MetadataRecord {
  key: string;
  value: string | number | boolean | null;
  updated_at: string;
}

export type DisasterSort =
  | "urgency_desc"
  | "urgency_asc"
  | "occurred_desc"
  | "occurred_asc";

export interface DisasterFilters {
  query: string;
  type: DisasterType | "all";
  status: DisasterStatus | "all";
  sort: DisasterSort;
}
