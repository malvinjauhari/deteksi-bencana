import { safeStorage, type SafeStorage } from "@/lib/storage/safe-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";

export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

export function readTheme(storage?: SafeStorage): Theme {
  const value = storage?.readString(STORAGE_KEYS.theme) ?? null;
  return isTheme(value) ? value : "system";
}

export function writeTheme(theme: Theme, storage?: SafeStorage): boolean {
  return (storage ?? safeStorage).writeString(STORAGE_KEYS.theme, theme);
}
