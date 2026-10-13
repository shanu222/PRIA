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
        "card-pro card-pro-lift group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-card p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider tone-text">{stat.label}</p>
        {stat.status !== "available" && <StatusBadge status={stat.status} />}
      </div>
      <div className="mt-4">
        <p
          className={cn(
            "font-heading text-4xl font-bold tracking-tight sm:text-[2.6rem]",
            emphasis ? "text-gradient-brand" : "text-foreground",
          )}
        >
          <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} plain={stat.plain} decimals={stat.decimals} />
        </p>
        {stat.note && <p className="mt-1 text-sm text-muted-foreground">{stat.note}</p>}
      </div>
      <div
        aria-hidden="true"
        className="tone-bar absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
      />
    </div>
  );
}
