import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "min-h-11 w-full rounded-xl border bg-surface px-4 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
