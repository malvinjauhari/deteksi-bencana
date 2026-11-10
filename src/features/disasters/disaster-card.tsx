import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DISASTER_TYPE_LABELS } from "@/features/scoring/factor-weights";
import { SeverityBadge } from "@/features/scoring/severity-badge";
import type { DisasterListItem } from "@/features/disasters/disaster-service";

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
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function DisasterCard({ item }: { item: DisasterListItem }) {
  const { disaster, analysis } = item;

  return (
    <Card className="h-full shadow-none transition-shadow hover:shadow-soft">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-info">
              {typeLabel[disaster.type] ?? DISASTER_TYPE_LABELS[disaster.type]}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-snug">
              {disaster.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {disaster.location.description} · {formatTimestamp(disaster.occurred_at)} UTC
            </p>
          </div>
          {analysis && <SeverityBadge severity={analysis.severity} />}
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-muted px-4 py-3">
            <dt className="text-xs text-muted-foreground">Skor urgensi</dt>
            <dd className="mt-1 font-serif text-2xl font-semibold tabular-nums">
              {analysis?.urgency_score ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-muted px-4 py-3">
            <dt className="text-xs text-muted-foreground">Kelengkapan data</dt>
            <dd className="mt-1 font-serif text-2xl font-semibold tabular-nums">
              {analysis?.data_completeness ?? 0}%
            </dd>
          </div>
          <div className="col-span-2 rounded-xl bg-surface-muted px-4 py-3 sm:col-span-1">
            <dt className="text-xs text-muted-foreground">Status</dt>
            <dd className="mt-1">
              {analysis?.is_provisional ? (
                <Badge variant="warning">Skor Sementara</Badge>
              ) : (
                <Badge variant="info">Skor Final</Badge>
              )}
            </dd>
          </div>
        </dl>

        {analysis && (
          <p className="text-sm leading-6 text-muted-foreground">
            {analysis.human_readable_analysis}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-xs text-muted-foreground">
            {disaster.is_simulation ? "Data simulasi" : "Data lokal"}
          </span>
          <Button asChild size="sm" variant="secondary">
            <Link to={`/disasters/${disaster.id}`}>Lihat analisis</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
