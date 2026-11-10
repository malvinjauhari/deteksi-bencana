import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * LazyMotion keeps the animation runtime out of the initial bundle.
 * Use the `m` component from `@/components/motion/motion` instead of `motion`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
