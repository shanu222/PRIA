import type { Stat } from "@/data/pria";
import { cn } from "@/lib/utils";
import { CountUp } from "./Motion";
import { StatusBadge } from "./StatusBadge";

export function StatTile({
  stat,
  className,
  emphasis = false,
}: {
  stat: Stat;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift",
        emphasis && "border-primary/25 bg-gradient-to-br from-primary-tint to-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
        {stat.status !== "available" && <StatusBadge status={stat.status} />}
      </div>
      <div className="mt-4">
        <p className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-[2.6rem]">
          <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} plain={stat.plain} />
        </p>
        {stat.note && <p className="mt-1 text-sm text-muted-foreground">{stat.note}</p>}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100"
      />
    </div>
  );
}
