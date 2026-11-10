/**
 * localStorage keys owned by the application.
 * Kept dependency-free so any module can import it without pulling in
 * validation libraries.
 */
export const STORAGE_KEYS = {
  theme: "siaga.theme",
  filters: "siaga.filters",
  activeDemoProfileId: "siaga.demo.activeProfileId",
} as const;
