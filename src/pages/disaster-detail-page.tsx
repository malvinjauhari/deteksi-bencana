import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusState } from "@/components/ui/status-state";
import { ScoreBreakdown } from "@/features/scoring/score-breakdown";
import { DisasterMapPanel } from "@/features/disaster-map/disaster-map-panel";
import { SeverityBadge } from "@/features/scoring/severity-badge";
import {
  getDisasterDetail,
  StorageUnavailableError,
  type DisasterDetail,
} from "@/features/disasters/disaster-service";
import { DISASTER_TYPE_LABELS } from "@/features/scoring/factor-weights";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; detail: DisasterDetail }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "storage-unavailable"; message: string };

const typeLabel: Record<string, string> = {
  earthquake: "Gempa Bumi",
  flood: "Banjir",
  forest_fire: "Kebakaran Hutan",
  landslide: "Longsor",
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak diketahui";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function DisasterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    async function load() {
      if (!id) {
        setState({ status: "not-found" });
        return;
      }

      setState({ status: "loading" });
      try {
        const detail = await getDisasterDetail(id);
        if (!active) return;
        setState(detail ? { status: "ready", detail } : { status: "not-found" });
      } catch (error) {
        if (!active) return;
        if (error instanceof StorageUnavailableError) {
          setState({ status: "storage-unavailable", message: error.message });
          return;
        }
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Analisis tidak dapat dimuat karena kesalahan tak dikenal.",
        });
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <section
      aria-labelledby="detail-title"
      className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40"
    >
      <Button asChild variant="ghost" className="-ml-4">
        <Link to="/dashboard">Kembali ke dashboard</Link>
      </Button>

      {state.status === "loading" && (
        <>
          <h1 id="detail-title" className="mt-6 font-serif text-4xl font-semibold sm:text-5xl">
            Detail bencana
          </h1>
          <StatusState
            className="mt-8 text-left"
            status="loading"
            title="Memuat analisis lokal"
            description="Mengambil fixture simulasi dan menghitung ulang skor urgensi di perangkat ini."
          />
        </>
      )}

      {state.status === "not-found" && (
        <>
          <h1 id="detail-title" className="mt-6 font-serif text-4xl font-semibold sm:text-5xl">
            Detail bencana
          </h1>
          <StatusState
            className="mt-8 text-left"
            status="empty"
            title="Kejadian tidak ditemukan"
            description={`ID ${id ?? "tidak diketahui"} tidak tersedia dalam data simulasi lokal.`}
            action={
              <Button asChild variant="secondary">
                <Link to="/dashboard">Lihat semua kejadian</Link>
              </Button>
            }
          />
        </>
      )}

      {state.status === "storage-unavailable" && (
        <>
          <h1 id="detail-title" className="mt-6 font-serif text-4xl font-semibold sm:text-5xl">
            Detail bencana
          </h1>
          <StatusState
            className="mt-8 text-left"
            status="error"
            title="Penyimpanan lokal tidak tersedia"
            description={state.message}
          />
        </>
      )}

      {state.status === "error" && (
        <>
          <h1 id="detail-title" className="mt-6 font-serif text-4xl font-semibold sm:text-5xl">
            Detail bencana
          </h1>
          <StatusState
            className="mt-8 text-left"
            status="error"
            title="Analisis tidak dapat dimuat"
            description={state.message}
          />
        </>
      )}

      {state.status === "ready" && (
        <ReadyDetail detail={state.detail} />
      )}
    </section>
  );
}

function ReadyDetail({ detail }: { detail: DisasterDetail }) {
  const { disaster, analysis } = detail;

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline">Data simulasi</Badge>
        <Badge variant="outline">
          {typeLabel[disaster.type] ?? DISASTER_TYPE_LABELS[disaster.type]}
        </Badge>
        <SeverityBadge severity={analysis.severity} />
        {analysis.is_provisional && <Badge variant="warning">Skor Sementara</Badge>}
      </div>

      <h1 id="detail-title" className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">
        {disaster.title}
      </h1>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface-muted p-4">
          <dt className="text-xs text-muted-foreground">Skor urgensi</dt>
          <dd className="mt-1 font-serif text-3xl font-semibold tabular-nums">
            {analysis.urgency_score ?? "Belum dinilai"}
          </dd>
        </div>
        <div className="rounded-2xl bg-surface-muted p-4">
          <dt className="text-xs text-muted-foreground">Kelengkapan data</dt>
          <dd className="mt-1 font-serif text-3xl font-semibold tabular-nums">
            {analysis.data_completeness}%
          </dd>
        </div>
        <div className="rounded-2xl bg-surface-muted p-4">
          <dt className="text-xs text-muted-foreground">Waktu kejadian</dt>
          <dd className="mt-1 text-sm font-medium">
            {formatTimestamp(disaster.occurred_at)} UTC
          </dd>
        </div>
      </dl>

      <Card className="mt-8 shadow-none">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Ringkasan analisis</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            {analysis.human_readable_analysis}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Lokasi: {disaster.location.description} ({disaster.location.lat.toFixed(4)},
            {" "}
            {disaster.location.lng.toFixed(4)}) · Sumber simulasi:{" "}
            {disaster.source_name}
          </p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <DisasterMapPanel items={[{ disaster, analysis }]} />
      </div>

      <div className="mt-8">
        <ScoreBreakdown analysis={analysis} />
      </div>

      <Card className="mt-8 shadow-none">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Langkah mitigasi</h2>
          <ol className="mt-4 space-y-3">
            {disaster.mitigation_steps.map((step, index) => (
              <li key={step} className="flex gap-3 leading-7">
                <span className="font-serif text-lg text-info">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Versi mesin skor {analysis.engine_version}. Angka simulasi lokal, bukan
        peringatan dini resmi.
      </p>
    </>
  );
}
