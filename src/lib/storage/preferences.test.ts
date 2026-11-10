import { describe, expect, it, vi } from "vitest";
import { createSafeStorage } from "@/lib/storage/safe-storage";
import {
  DEFAULT_FILTERS,
  isTheme,
  readActiveDemoProfileId,
  readFilters,
  readTheme,
  STORAGE_KEYS,
  writeActiveDemoProfileId,
  writeFilters,
  writeTheme,
} from "@/lib/storage/preferences";

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
    clear: () => map.clear(),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size;
    },
  } satisfies Storage;
}

describe("createSafeStorage", () => {
  it("reads and writes plain strings", () => {
    const storage = createSafeStorage(createMemoryStorage());
    expect(storage.writeString("k", "v")).toBe(true);
    expect(storage.readString("k")).toBe("v");
    expect(storage.readString("missing")).toBeNull();
  });

  it("round-trips JSON values", () => {
    const storage = createSafeStorage(createMemoryStorage());
    expect(storage.writeJson("k", { a: 1 })).toBe(true);
    expect(storage.readJson("k", (raw) => raw)).toEqual({ a: 1 });
  });

  it("returns null for malformed JSON instead of throwing", () => {
    const memory = createMemoryStorage();
    memory.setItem("broken", "{not json");
    const storage = createSafeStorage(memory);
    expect(storage.readJson("broken", (raw) => raw)).toBeNull();
  });

  it("removes stored values", () => {
    const storage = createSafeStorage(createMemoryStorage());
    storage.writeString("k", "v");
    expect(storage.remove("k")).toBe(true);
    expect(storage.readString("k")).toBeNull();
  });

  it("reports failure instead of throwing when the store is unavailable", () => {
    const failing = {
      getItem: () => {
        throw new DOMException("Denied", "SecurityError");
      },
      setItem: () => {
        throw new DOMException("Denied", "SecurityError");
      },
      removeItem: () => {
        throw new DOMException("Denied", "SecurityError");
      },
    } as unknown as Storage;

    const storage = createSafeStorage(failing);
    expect(storage.readString("k")).toBeNull();
    expect(storage.writeString("k", "v")).toBe(false);
    expect(storage.writeJson("k", { a: 1 })).toBe(false);
    expect(storage.readJson("k", (raw) => raw)).toBeNull();
    expect(storage.remove("k")).toBe(false);
  });
});

describe("preferences", () => {
  it("validates theme values", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("falls back to system when the stored theme is corrupt", () => {
    const memory = createMemoryStorage();
    memory.setItem(STORAGE_KEYS.theme, "neon");
    const storage = createSafeStorage(memory);
    expect(readTheme(storage)).toBe("system");
  });

  it("persists and reads the selected theme", () => {
    const memory = createMemoryStorage();
    const storage = createSafeStorage(memory);
    expect(writeTheme("dark", storage)).toBe(true);
    expect(memory.getItem(STORAGE_KEYS.theme)).toBe("dark");
    expect(readTheme(storage)).toBe("dark");
  });

  it("falls back to default filters when the stored value is invalid", () => {
    const memory = createMemoryStorage();
    memory.setItem(STORAGE_KEYS.filters, JSON.stringify({ query: "x" }));
    const storage = createSafeStorage(memory);
    expect(readFilters(storage)).toEqual(DEFAULT_FILTERS);
  });

  it("persists and reads filters", () => {
    const memory = createMemoryStorage();
    const storage = createSafeStorage(memory);
    const filters = { ...DEFAULT_FILTERS, query: "banjir", type: "flood" as const };
    expect(writeFilters(filters, storage)).toBe(true);
    expect(readFilters(storage)).toEqual(filters);
  });

  it("stores and clears the active demo profile id", () => {
    const memory = createMemoryStorage();
    const storage = createSafeStorage(memory);
    expect(readActiveDemoProfileId(storage)).toBeNull();
    expect(writeActiveDemoProfileId("demo-user-warga", storage)).toBe(true);
    expect(readActiveDemoProfileId(storage)).toBe("demo-user-warga");
    expect(writeActiveDemoProfileId(null, storage)).toBe(true);
    expect(readActiveDemoProfileId(storage)).toBeNull();
  });

  it("uses the browser localStorage by default", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem");
    writeTheme("light");
    expect(spy).toHaveBeenCalledWith(STORAGE_KEYS.theme, "light");
    spy.mockRestore();
  });
});
