import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setSystemDarkMode } from "@/test/setup";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  isTheme,
  readTheme,
  STORAGE_KEYS,
  writeTheme,
} from "@/lib/storage/preferences";

const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

function renderTheme() {
  return render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
}

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  setSystemDarkMode(false);
  vi.restoreAllMocks();
});

describe("theme preferences", () => {
  it("validates supported values and rejects corrupt storage", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("blue")).toBe(false);
    localStorage.setItem(THEME_STORAGE_KEY, "invalid");
    expect(readTheme()).toBe("system");
  });

  it("persists and applies the selected dark theme", async () => {
    const user = userEvent.setup();
    renderTheme();
    await user.click(screen.getByRole("button", { name: "Tema gelap" }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByRole("button", { name: "Tema gelap" })).toHaveAttribute("aria-pressed", "true");
  });

  it("follows operating-system theme changes in system mode", () => {
    renderTheme();
    expect(document.documentElement).not.toHaveClass("dark");
    act(() => setSystemDarkMode(true));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("uses system mode and safely handles storage failures", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Denied", "SecurityError");
    });
    expect(writeTheme("light")).toBe(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Denied", "SecurityError");
    });
    expect(readTheme()).toBe("system");
    renderTheme();
    expect(screen.getByRole("button", { name: "Tema sistem" })).toHaveAttribute("aria-pressed", "true");
  });
});
