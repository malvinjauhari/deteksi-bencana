import type { DemoUser } from "@/types/disaster";

/**
 * Demo profiles are fictional. Organisation names are deliberately generic so
 * no real institution is implied or affiliated.
 */
export const demoUserFixtures: DemoUser[] = [
  {
    id: "demo-user-otoritas",
    display_name: "Unit Otoritas Simulasi",
    role: "OTORITAS",
    weight: 3,
    is_demo: true,
  },
  {
    id: "demo-user-relawan",
    display_name: "Relawan Kemanasan Simulasi",
    role: "NGO_RELAWAN",
    weight: 2,
    is_demo: true,
  },
  {
    id: "demo-user-warga",
    display_name: "Warga Setempat Simulasi",
    role: "WARGA_LOKAL",
    weight: 1,
    is_demo: true,
  },
  {
    id: "demo-user-awam",
    display_name: "Pengunjung Simulasi",
    role: "AWAM",
    weight: 0,
    is_demo: true,
  },
];
