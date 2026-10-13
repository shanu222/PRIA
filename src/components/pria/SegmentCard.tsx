import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers, MapPin } from "lucide-react";
import { segmentStatus, type Segment } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { TopoPattern } from "./TopoPattern";

export function segmentStyle(segment: Segment): CSSProperties {
  return { "--seg": segment.color, "--seg-strong": segment.colorStrong } as CSSProperties;
}

export function RegionChips({ regions, className, onDark }: { regions: string[]; className?: string; onDark?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Regions">
      {regions.map((r) => (
        <li
          key={r}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
            onDark
              ? "border-white/25 bg-white/10 text-white backdrop-blur"
              : "border-[color-mix(in_srgb,var(--seg)_30%,transparent)] bg-[color-mix(in_srgb,var(--seg)_9%,transparent)] seg-text",
          )}
        >
          <MapPin className="h-3 w-3" aria-hidden />
          {r}
        </li>
      ))}
    </ul>
  );
}

/** Compact card used next to the schematic map on Home. */
export function SegmentCardCompact({
  segment,
  highlighted,
  onHover,
}: {
  segment: Segment;
  highlighted?: boolean;
  onHover?: (active: boolean) => void;
}) {
  return (
    <Link
      href={`/segments/${segment.slug}`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
      style={segmentStyle(segment)}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-xl border bg-card p-4 pl-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--seg)] hover:shadow-lift",
        highlighted && "-translate-y-0.5 border-[var(--seg)] shadow-lift",
      )}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-[var(--seg)]" />
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--seg)_12%,transparent)] seg-text">
        <Icon name={segment.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider seg-text">Segment {segment.number}</span>
        <span className="block font-heading font-semibold leading-snug">{segment.title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{segment.regions.join(" · ")}</span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--seg)]"
        aria-hidden
      />
    </Link>
  );
}

/** Large card used on the Regional Segments hub. */
export function SegmentCard({ segment }: { segment: Segment }) {
  const status = segmentStatus(segment);
  return (
    <article
      style={segmentStyle(segment)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-[var(--seg)] hover:shadow-lift"
    >
      <div
        className="relative overflow-hidden px-6 pb-6 pt-7 text-white"
        style={{ background: `linear-gradient(135deg, ${segment.colorStrong} 0%, ${segment.color} 100%)` }}
      >
        <TopoPattern className="text-white opacity-25" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">Segment {segment.number}</p>
            <h3 className="mt-2 text-balance text-xl font-bold leading-tight sm:text-2xl">{segment.title}</h3>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur transition-transform duration-300 group-hover:scale-105">
            <Icon name={segment.icon} className="h-7 w-7" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <RegionChips regions={segment.regions} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Layers className="h-4 w-4" aria-hidden />
            {segment.categories.length} infrastructure categories
          </span>
          <StatusBadge status={status} label={status === "pending" ? "Recommendations pending" : "Recommendations published"} />
        </div>
        <Button
          asChild
          className="mt-auto w-full bg-[var(--seg-strong)] text-white hover:bg-[var(--seg-strong)] hover:brightness-110 dark:bg-[var(--seg-strong)] dark:text-white"
        >
          <Link href={`/segments/${segment.slug}`}>
            Open Segment
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
