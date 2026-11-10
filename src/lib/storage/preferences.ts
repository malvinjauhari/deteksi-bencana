/**
 * Preference storage entry point.
 *
 * Theme preferences live in a separate module so the landing page does not
 * pull the validation library into its initial bundle.
 */
export {
  isTheme,
  readTheme,
  themes,
  writeTheme,
  type Theme,
} from "@/lib/storage/theme-preferences";
export {
  DEFAULT_FILTERS,
  readActiveDemoProfileId,
  readFilters,
  writeActiveDemoProfileId,
  writeFilters,
} from "@/lib/storage/filter-preferences";
export { STORAGE_KEYS } from "@/lib/storage/storage-keys";
