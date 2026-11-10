import type { Severity } from "@/types/disaster";

export const severityVariant: Record<
  Severity,
  "critical" | "warning" | "info" | "outline"
> = {
  kritis: "critical",
  waspada: "warning",
  rendah: "info",
  belum_dinilai: "outline",
};

export const severityLabel: Record<Severity, string> = {
  kritis: "Kritis",
  waspada: "Waspada",
  rendah: "Rendah",
  belum_dinilai: "Belum Dinilai",
};
