import { lazy, Suspense } from "react";
import { StatusState } from "@/components/ui/status-state";
import type { DisasterListItem } from "@/features/disasters/disaster-service";

const DisasterMap = lazy(() =>
  import("@/features/disaster-map/disaster-map").then((module) => ({
    default: module.DisasterMap,
  })),
);

export function DisasterMapPanel({ items }: { items: DisasterListItem[] }) {
  return (
    <Suspense
      fallback={
        <StatusState
          status="loading"
          title="Memuat peta"
          description="Menyiapkan peta lokal. Daftar kejadian dan analisis tetap dapat digunakan."
        />
      }
    >
      <DisasterMap items={items} />
    </Suspense>
  );
}
