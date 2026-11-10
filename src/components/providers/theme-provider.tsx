import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "@/hooks/use-theme";
import {
  readTheme,
  writeTheme,
  type Theme,
} from "@/lib/storage/preferences";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? "#151a18" : "#f7f8f5");
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readTheme());
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme);
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    applyTheme(theme);
  }, [theme, systemTheme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(getSystemTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: (nextTheme: Theme) => {
          setThemeState(nextTheme);
          setPersistenceAvailable(writeTheme(nextTheme));
        },
        persistenceAvailable,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
