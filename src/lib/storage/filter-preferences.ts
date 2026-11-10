import { safeStorage, type SafeStorage } from "@/lib/storage/safe-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import { disasterFiltersSchema } from "@/lib/validation/schemas";
import type { DisasterFilters } from "@/types/disaster";

export const DEFAULT_FILTERS: DisasterFilters = {
  query: "",
  type: "all",
  status: "all",
  sort: "urgency_desc",
};

export function readFilters(storage?: SafeStorage): DisasterFilters {
  const value = storage?.readJson(STORAGE_KEYS.filters, (raw) => raw) ?? null;
  const parsed = disasterFiltersSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_FILTERS;
}

export function writeFilters(
  filters: DisasterFilters,
  storage?: SafeStorage,
): boolean {
  return (storage ?? safeStorage).writeJson(STORAGE_KEYS.filters, filters);
}

export function readActiveDemoProfileId(storage?: SafeStorage): string | null {
  return storage?.readString(STORAGE_KEYS.activeDemoProfileId) ?? null;
}

export function writeActiveDemoProfileId(
  id: string | null,
  storage?: SafeStorage,
): boolean {
  const target = storage ?? safeStorage;
  if (id === null) return target.remove(STORAGE_KEYS.activeDemoProfileId);
  return target.writeString(STORAGE_KEYS.activeDemoProfileId, id);
}
