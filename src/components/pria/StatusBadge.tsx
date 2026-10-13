import { CircleCheck, Hourglass, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ContentStatus } from "@/data/pria";
import { cn } from "@/lib/utils";

const config: Record<ContentStatus, { label: string; variant: "pending" | "provisional" | "tint"; Icon: typeof Info }> = {
  pending: { label: "Awaiting input", variant: "pending", Icon: Hourglass },
  provisional: { label: "Provisional", variant: "provisional", Icon: Info },
  available: { label: "Published", variant: "tint", Icon: CircleCheck },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: ContentStatus;
  label?: string;
  className?: string;
}) {
  const { label: defaultLabel, variant, Icon } = config[status];
  return (
    <Badge variant={variant} className={cn("whitespace-nowrap", className)}>
      <Icon aria-hidden="true" />
      {label ?? defaultLabel}
    </Badge>
  );
}
