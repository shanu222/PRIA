"use client";

import * as React from "react";
import { modelBuilds, systemPlate } from "@/data/construction-methods";
import { modelsForSegment } from "@/data/drim";
import type { Segment } from "@/data/pria";
import { cn } from "@/lib/utils";

/** Build sequence for each DRIM model suited to this segment. */
export function SegmentConstruction({ segment }: { segment: Segment }) {
  const models = modelsForSegment(segment.id).filter((m) => modelBuilds[m.slug]);
  const [slug, setSlug] = React.useState(models[0]?.slug ?? "");
  const model = models.find((m) => m.slug === slug) ?? models[0];
  if (!model) return null;
  const build = modelBuilds[model.slug];
  const plate = systemPlate[model.system];

  return (
    <div className="mt-8 flex flex-col gap-4 border-t pt-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] seg-text">DRIM build sequence</p>
        <h3 className="mt-1 font-heading text-xl font-bold">How each model for this segment is built</h3>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {models.length} models suited to {segment.shortTitle.toLowerCase()} regions. The sequence follows that
          model&apos;s materials and the rules on this page: tied bands, a light roof, drainage, and a dry floor in
          flood country. It is a method for builders, not a substitute for a design checked at the site.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {models.map((item) => {
          const isActive = item.slug === model.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSlug(item.slug)}
              aria-pressed={isActive}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition-colors",
                isActive
                  ? "border-[var(--seg)] bg-[var(--seg-strong)] text-white"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <figure className="overflow-hidden rounded-2xl border bg-card">
          <img src={plate.src} alt={plate.caption} className="aspect-video w-full object-cover" />
          <figcaption className="px-4 py-3 text-xs leading-relaxed text-muted-foreground">{plate.caption}</figcaption>
        </figure>
        <div>
          <h4 className="font-heading text-lg font-bold">{model.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{build.principle}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Materials: {model.materials.join(" · ")}
          </p>
          <ol className="mt-4 flex flex-col gap-3">
            {build.steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--seg)_12%,transparent)] text-xs font-bold seg-text"
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
