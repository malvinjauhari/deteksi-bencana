import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
});

type MediaListener = (event: MediaQueryListEvent) => void;
const mediaListeners = new Set<MediaListener>();
const mediaQueryList = {
  matches: false,
  media: "(prefers-color-scheme: dark)",
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn((_event: string, listener: MediaListener) => mediaListeners.add(listener)),
  removeEventListener: vi.fn((_event: string, listener: MediaListener) => mediaListeners.delete(listener)),
  dispatchEvent: vi.fn(),
};

window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockReturnValue(mediaQueryList),
});

export function setSystemDarkMode(matches: boolean) {
  mediaQueryList.matches = matches;
  const event = { matches, media: mediaQueryList.media } as MediaQueryListEvent;
  mediaListeners.forEach((listener) => listener(event));
}
