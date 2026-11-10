import { useEffect } from "react";
import { ScrollRestoration, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";

export function RootLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return (
    <>
      <AppShell />
      <ScrollRestoration />
    </>
  );
}
