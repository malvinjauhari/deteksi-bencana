/**
 * Safe localStorage adapter.
 *
 * Every read validates and falls back to a default; every write reports
 * success or failure so the UI can tell the user when persistence is
 * unavailable (private mode, quota, disabled storage).
 */
export interface SafeStorage {
  readString(key: string): string | null;
  writeString(key: string, value: string): boolean;
  readJson<T>(key: string, parse: (raw: unknown) => T | null): T | null;
  writeJson(key: string, value: unknown): boolean;
  remove(key: string): boolean;
}

export function createSafeStorage(storage?: Storage): SafeStorage {
  const target = () => storage ?? window.localStorage;

  return {
    readString(key) {
      try {
        return target().getItem(key);
      } catch {
        return null;
      }
    },
    writeString(key, value) {
      try {
        target().setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    readJson(key, parse) {
      try {
        const raw = target().getItem(key);
        if (raw === null) return null;
        return parse(JSON.parse(raw));
      } catch {
        return null;
      }
    },
    writeJson(key, value) {
      try {
        target().setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        target().removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  };
}

export const safeStorage = createSafeStorage();
