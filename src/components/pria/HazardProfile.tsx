import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Segment } from "@/data/pria";
import { segmentProfiles } from "@/data/hazards";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Hazards and key facts for a segment. Expects `--seg` / `--seg-strong` from `segmentStyle`. */
export function HazardProfile({
  segment,
  withLink = false,
  className,
}: {
  segment: Segment;
  withLink?: boolean;
  className?: string;
}) {
  const profile = segmentProfiles[segment.id];
  return (
    <article
      className={cn(
        "card-pro card-pro-lift group flex h-full flex-col rounded-2xl bg-card p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: segment.colorStrong }}>
            <Icon name={segment.icon} className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider seg-text">Segment {segment.number}</p>
            <h3 className="font-heading text-lg font-bold leading-tight">{segment.title}</h3>
          </div>
        </div>
        {withLink && (
          <Link
            href={`/segments/${segment.slug}`}
            aria-label={`Open Segment ${segment.number}: ${segment.title}`}
            className="rounded-lg border p-2 text-muted-foreground transition-colors hover:border-[var(--seg)] hover:text-[var(--seg)]"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Hazards">
        {profile.hazards.map((h) => (
          <li
            key={h.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--seg)_35%,transparent)] bg-[color-mix(in_srgb,var(--seg)_9%,transparent)] px-3 py-1 text-xs font-semibold seg-text"
          >
            <Icon name={h.icon} className="h-3.5 w-3.5" />
            {h.label}
          </li>
        ))}
      </ul>

      <dl className="mt-5 grid flex-1 gap-3 sm:grid-cols-2">
        {profile.facts.map((f) => (
          <div
            key={f.label}
            className="rounded-xl border-2 border-[color-mix(in_srgb,var(--seg)_20%,transparent)] bg-[color-mix(in_srgb,var(--seg)_5%,hsl(var(--card)))] p-4 transition-colors hover:border-[var(--seg)]"
          >
            <dt className="sr-only">{f.label}</dt>
            <dd>
              <span className="block font-heading text-xl font-bold seg-text">{f.value}</span>
              <span className="mt-0.5 block text-sm text-foreground/80">{f.label}</span>
              <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{f.source}</span>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
