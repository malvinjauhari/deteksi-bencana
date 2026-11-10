import { FACTOR_LABELS } from "@/features/scoring/factor-weights";
import { SeverityBadge } from "@/features/scoring/severity-badge";
import type { Analysis } from "@/types/disaster";

/**
 * Shows every factor with its value, weight, and contribution so the score can
 * be audited. Missing factors are displayed as unavailable, never as zero.
 */
export function ScoreBreakdown({ analysis }: { analysis: Analysis }) {
  return (
    <section aria-labelledby="score-breakdown-title" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="score-breakdown-title" className="text-xl font-semibold">
          Rincian skor
        </h2>
        <SeverityBadge severity={analysis.severity} />
      </div>

      <p className="text-sm text-muted-foreground">
        Bobot faktor mengikuti model tetap 25/25/20/15/15. Faktor yang tidak
        tersedia tidak diestimasi dan membuat skor ditandai sementara.
      </p>

      <ul className="space-y-3">
        {analysis.factor_breakdown.map((factor) => (
          <li key={factor.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-medium">{FACTOR_LABELS[factor.key]}</span>
              <span className="text-sm tabular-nums text-muted-foreground">
                {factor.value === null
                  ? "Data tidak tersedia"
                  : `${factor.value} / 100 · bobot ${Math.round(factor.weight * 100)}%`}
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-muted"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-info"
                style={{ width: `${factor.contribution ?? 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground">
        Kelengkapan data {analysis.data_completeness}%.
        {analysis.is_provisional
          ? " Skor bersifat sementara sampai seluruh faktor tersedia."
          : " Seluruh faktor tersedia."}
      </p>
    </section>
  );
}
