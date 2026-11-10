import { Badge } from "@/components/ui/badge";
import { severityLabel, severityVariant } from "@/features/scoring/severity-labels";
import type { Severity } from "@/types/disaster";

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  return (
    <Badge variant={severityVariant[severity]} className={className}>
      {severityLabel[severity]}
    </Badge>
  );
}
