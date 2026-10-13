import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { modelsForSegment } from "@/data/drim";
import type { Segment } from "@/data/pria";
import { DrimCard } from "./DrimCard";

/** DRIM models whose suitable regions fall in a segment. */
export function DrimStrip({ segment, compact = false }: { segment: Segment; compact?: boolean }) {
  const models = modelsForSegment(segment.id);
  if (models.length === 0) return null;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] seg-text">NDMA DRIM</p>
          <h3 className={compact ? "mt-1 text-base font-bold" : "mt-1.5 text-2xl font-bold"}>
            {models.length} resilient house models suited to {segment.shortTitle.toLowerCase()} regions
          </h3>
        </div>
        <Link
          href={`/drim?segment=${segment.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[color-mix(in_srgb,var(--seg)_35%,transparent)] px-3 py-1.5 text-sm font-semibold seg-text transition-all hover:-translate-y-px hover:border-[var(--seg)] hover:shadow-soft"
        >
          All DRIM models
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <ul className={compact ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
        {models.map((m) => (
          <li key={m.slug}>
            <DrimCard model={m} />
          </li>
        ))}
      </ul>
    </div>
  );
}
