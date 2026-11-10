# Data Contracts

Kontrak kanonis diimplementasikan sebagai tipe TypeScript bersama. Nilai di bawah adalah contoh, bukan data bencana nyata.

```ts
type DisasterType = "earthquake" | "flood" | "forest_fire" | "landslide";
type DisasterStatus = "monitoring" | "campaign";
type Severity = "rendah" | "waspada" | "kritis" | "belum_dinilai";
type UserRole = "AWAM" | "WARGA_LOKAL" | "NGO_RELAWAN" | "OTORITAS";
type ScoreFactor = number | null; // finite, 0..100

type ScoringFactors = {
  scale: ScoreFactor;
  population_density: ScoreFactor;
  vital_infrastructure: ScoreFactor;
  weather_risk: ScoreFactor;
  community_reports: ScoreFactor;
};

type Disaster = {
  id: string;
  type: DisasterType;
  title: string;
  location: { lat: number; lng: number; description: string };
  source_name: string;
  source_reference: string | null;
  occurred_at: string; // ISO 8601 UTC
  status: DisasterStatus;
  total_vote_weight: number;
  voter_count: number;
  scoring_factors: ScoringFactors;
  mitigation_steps: string[];
  is_simulation: true;
  created_at: string;
  updated_at: string;
};

type Analysis = {
  disaster_id: string;
  urgency_score: number | null;
  severity: Severity;
  factor_breakdown: Array<{
    key: keyof ScoringFactors;
    value: ScoreFactor;
    weight: number;
    contribution: number | null;
  }>;
  human_readable_analysis: string;
  data_completeness: number; // 0..100 berdasarkan bobot tersedia
  is_provisional: boolean;
  calculated_at: string;
  engine_version: string;
};

type DemoUser = {
  id: string;
  display_name: string;
  role: UserRole;
  weight: 0 | 1 | 2 | 3;
  is_demo: true;
};

type Vote = {
  id: string;
  disaster_id: string;
  demo_user_id: string;
  weight: 1 | 2 | 3;
  created_at: string;
};
```

## Contoh View Model

```json
{
  "id": "sim-earthquake-001",
  "type": "earthquake",
  "title": "Simulasi Gempa Pesisir",
  "location": { "lat": -7.250445, "lng": 112.768845, "description": "Lokasi simulasi" },
  "urgency_score": 85,
  "severity": "kritis",
  "data_completeness": 100,
  "is_provisional": false,
  "human_readable_analysis": "Skor simulasi tinggi karena skala kejadian dan kepadatan penduduk.",
  "total_vote_weight": 5,
  "voter_count": 2,
  "status": "campaign",
  "is_simulation": true
}
```

Timestamp menggunakan UTC pada storage dan diformat di lapisan UI. Field yang dulu bernama `votes_count` diganti oleh `total_vote_weight` dan `voter_count` agar jumlah orang berbeda dari total bobot.
