import type { Disaster, DisasterType, ScoringFactors } from "@/types/disaster";

export interface DisasterFixture {
  id: string;
  type: DisasterType;
  title: string;
  location: { lat: number; lng: number; description: string };
  source_name: string;
  source_reference: string | null;
  /** Minutes before the seed reference time. */
  occurred_offset_minutes: number;
  status: Disaster["status"];
  scoring_factors: ScoringFactors;
  mitigation_steps: string[];
}

/**
 * Simulation fixtures only. Locations are representative coordinates and are
 * not real events; every record carries `is_simulation: true`.
 */
export const disasterFixtures: DisasterFixture[] = [
  {
    id: "sim-earthquake-001",
    type: "earthquake",
    title: "Simulasi Gempa Pesisir Jawa Timur",
    location: { lat: -7.250445, lng: 112.768845, description: "Wilayah pesisir Jawa Timur" },
    source_name: "Fixture Simulasi SiagaNusantara",
    source_reference: "sim-fixture-earthquake-001",
    occurred_offset_minutes: 45,
    status: "monitoring",
    scoring_factors: {
      scale: 92,
      population_density: 88,
      vital_infrastructure: 74,
      weather_risk: 45,
      community_reports: 68,
    },
    mitigation_steps: [
      "Periksa struktur bangunan dan jauhkan dari dinding yang retak.",
      "Siapkan jalur evakuasi menuju area terbuka.",
      "Hubungi petugas kebakaran dan puskesmas terdekat.",
    ],
  },
  {
    id: "sim-flood-002",
    type: "flood",
    title: "Simulasi Banjir Genangan Urban",
    location: { lat: -6.208763, lng: 106.845596, description: "Kawasan padat Jakarta Pusat" },
    source_name: "Fixture Simulasi SiagaNusantara",
    source_reference: "sim-fixture-flood-002",
    occurred_offset_minutes: 120,
    status: "monitoring",
    scoring_factors: {
      scale: 60,
      population_density: 95,
      vital_infrastructure: 70,
      weather_risk: 85,
      community_reports: 78,
    },
    mitigation_steps: [
      "Pindahkan warga ke tempat yang lebih tinggi.",
      "Pastikan saluran air dan pompa pengering berfungsi.",
      "Cek kondisi listrik dan hindari genangan air.",
    ],
  },
  {
    id: "sim-forest-fire-003",
    type: "forest_fire",
    title: "Simulasi Kebakaran Hutan Area Periphery",
    location: { lat: -1.6805, lng: 113.3801, description: "Wilayah hutan Kalimantan Tengah" },
    source_name: "Fixture Simulasi SiagaNusantara",
    source_reference: "sim-fixture-forest-fire-003",
    occurred_offset_minutes: 300,
    status: "monitoring",
    scoring_factors: {
      scale: 45,
      population_density: 22,
      vital_infrastructure: 30,
      weather_risk: 55,
      community_reports: 35,
    },
    mitigation_steps: [
      "Pantau arah angin dan titik api terdekat.",
      "Hindari area hutan dan gunakan masker saat asap pekat.",
      "Siapkan posko uwaga dan jalur evakuasi.",
    ],
  },
  {
    id: "sim-landslide-004",
    type: "landslide",
    title: "Simulasi Longsor Lereng",
    location: { lat: -6.9175, lng: 107.6191, description: "Lereng barat Bandung" },
    source_name: "Fixture Simulasi SiagaNusantara",
    source_reference: "sim-fixture-landslide-004",
    occurred_offset_minutes: 75,
    status: "monitoring",
    scoring_factors: {
      scale: 55,
      population_density: 48,
      vital_infrastructure: 52,
      weather_risk: null,
      community_reports: 60,
    },
    mitigation_steps: [
      "Hindari area lereng dan tebing yang retak.",
      "Siapkan jalur evakuasi menuju area aman.",
      "Periksa kondisi drainase dan saluran air lokal.",
    ],
  },
  {
    id: "sim-flood-005",
    type: "flood",
    title: "Simulasi Banjir dengan Data Terbatas",
    location: { lat: -3.7928, lng: 114.4706, description: "Daerah aliran sungai Kalimantan Selatan" },
    source_name: "Fixture Simulasi SiagaNusantara",
    source_reference: "sim-fixture-flood-005",
    occurred_offset_minutes: 240,
    status: "monitoring",
    scoring_factors: {
      scale: 30,
      population_density: null,
      vital_infrastructure: null,
      weather_risk: null,
      community_reports: 25,
    },
    mitigation_steps: [
      "Pantau tinggi air di sekitar bantaran sungai.",
      "Siapkan tempat pengungsian sederhana di dekat lokasi.",
      "Sebarkan informasi melalui kanal resmi desa dan kecamatan.",
    ],
  },
  {
    id: "sim-earthquake-006",
    type: "earthquake",
    title: "Simulasi Gempa Minor Tanpa Rincian Data",
    location: { lat: 1.4921, lng: 124.8391, description: "Perairan Kepulauan Sulawesi Utara" },
    source_name: "Fixture Simulasi SiagaNusantara",
    source_reference: "sim-fixture-earthquake-006",
    occurred_offset_minutes: 15,
    status: "monitoring",
    scoring_factors: {
      scale: null,
      population_density: null,
      vital_infrastructure: null,
      weather_risk: null,
      community_reports: null,
    },
    mitigation_steps: [
      "Pantau informasi berikutnya dari kanal resmi.",
      "Jauhi area pesisir dan cari ruang terbuka.",
      "Siapkan komunikasi darurat di lingkungan sekitar.",
    ],
  },
];
