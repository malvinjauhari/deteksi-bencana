import { lazy, Suspense } from "react";
import { StatusState } from "@/components/ui/status-state";

// The dashboard and detail pages pull in IndexedDB (Dexie) and the validation
// layer. They are loaded on demand so the landing page stays lightweight.
const DashboardPage = lazy(() =>
  import("@/pages/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  })),
);
const DisasterDetailPage = lazy(() =>
  import("@/pages/disaster-detail-page").then((module) => ({
    default: module.DisasterDetailPage,
  })),
);

export function RouteFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 sm:px-6 sm:pt-40">
      <StatusState
        status="loading"
        title="Memuat halaman"
        description="Menyiapkan modul data lokal untuk tampilan ini."
      />
    </div>
  );
}

export function DashboardRouteElement() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <DashboardPage />
    </Suspense>
  );
}

export function DisasterDetailRouteElement() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <DisasterDetailPage />
    </Suspense>
  );
}
