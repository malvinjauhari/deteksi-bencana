import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface StatusStateProps {
  status: "loading" | "empty" | "error";
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function StatusState({ status, title, description, action, className }: StatusStateProps) {
  const Icon = status === "loading" ? LoaderCircle : status === "error" ? AlertCircle : Inbox;

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className={cn("rounded-card border border-dashed bg-surface p-8 text-center", className)}
    >
      <Icon
        className={cn("mx-auto size-8 text-muted-foreground", status === "loading" && "animate-spin")}
        aria-hidden="true"
      />
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
