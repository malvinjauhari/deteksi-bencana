import { ThemeProvider } from "@/components/providers/theme-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>{children}</MotionProvider>
    </ThemeProvider>
  );
}
