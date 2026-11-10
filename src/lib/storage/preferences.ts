export const THEME_STORAGE_KEY = "siaga.theme";
export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

export function readTheme(storage?: Storage): Theme {
  try {
    const value = (storage ?? window.localStorage).getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : "system";
  } catch {
    return "system";
  }
}

export function writeTheme(theme: Theme, storage?: Storage): boolean {
  try {
    (storage ?? window.localStorage).setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
}
