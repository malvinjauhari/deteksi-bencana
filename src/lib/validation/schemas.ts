import { z } from "zod";

export const disasterTypeSchema = z.enum([
  "earthquake",
  "flood",
  "forest_fire",
  "landslide",
]);

export const disasterStatusSchema = z.enum(["monitoring", "campaign"]);
export const severitySchema = z.enum([
  "rendah",
  "waspada",
  "kritis",
  "belum_dinilai",
]);
export const userRoleSchema = z.enum([
  "AWAM",
  "WARGA_LOKAL",
  "NGO_RELAWAN",
  "OTORITAS",
]);

/** Score factor: finite number within 0..100, or null when unavailable. */
export const scoreFactorSchema = z
  .number()
  .finite()
  .min(0)
  .max(100)
  .nullable();

export const scoringFactorsSchema = z.object({
  scale: scoreFactorSchema,
  population_density: scoreFactorSchema,
  vital_infrastructure: scoreFactorSchema,
  weather_risk: scoreFactorSchema,
  community_reports: scoreFactorSchema,
});

export const locationSchema = z.object({
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  description: z.string().min(1).max(120),
});

export const disasterSchema = z.object({
  id: z.string().min(1),
  type: disasterTypeSchema,
  title: z.string().min(1).max(160),
  location: locationSchema,
  source_name: z.string().min(1).max(120),
  source_reference: z.string().max(200).nullable(),
  occurred_at: z.iso.datetime(),
  status: disasterStatusSchema,
  total_vote_weight: z.number().finite().min(0),
  voter_count: z.number().finite().int().min(0),
  scoring_factors: scoringFactorsSchema,
  mitigation_steps: z.array(z.string().min(1).max(240)).max(12),
  is_simulation: z.literal(true),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const factorBreakdownSchema = z.object({
  key: z.enum([
    "scale",
    "population_density",
    "vital_infrastructure",
    "weather_risk",
    "community_reports",
  ]),
  value: scoreFactorSchema,
  weight: z.number().finite().min(0).max(1),
  contribution: z.number().finite().min(0).max(100).nullable(),
});

export const analysisSchema = z.object({
  disaster_id: z.string().min(1),
  urgency_score: z.number().finite().int().min(0).max(100).nullable(),
  severity: severitySchema,
  factor_breakdown: z.array(factorBreakdownSchema).length(5),
  human_readable_analysis: z.string().min(1),
  data_completeness: z.number().finite().min(0).max(100),
  is_provisional: z.boolean(),
  calculated_at: z.iso.datetime(),
  engine_version: z.string().min(1),
});

export const demoUserSchema = z.object({
  id: z.string().min(1),
  display_name: z.string().min(1).max(80),
  role: userRoleSchema,
  weight: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  is_demo: z.literal(true),
});

export const voteSchema = z.object({
  id: z.string().min(1),
  disaster_id: z.string().min(1),
  demo_user_id: z.string().min(1),
  weight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  created_at: z.iso.datetime(),
});

export const disasterSortSchema = z.enum([
  "urgency_desc",
  "urgency_asc",
  "occurred_desc",
  "occurred_asc",
]);

export const disasterFiltersSchema = z.object({
  query: z.string().max(120),
  type: z.union([disasterTypeSchema, z.literal("all")]),
  status: z.union([disasterStatusSchema, z.literal("all")]),
  sort: disasterSortSchema,
});

export type DisasterInput = z.input<typeof disasterSchema>;
export type AnalysisInput = z.input<typeof analysisSchema>;
export type DemoUserInput = z.input<typeof demoUserSchema>;
export type VoteInput = z.input<typeof voteSchema>;
