"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { censusSource, getProvince, provinces, type ProvinceCensus } from "@/data/census";
import { cn } from "@/lib/utils";
import { MapSourceNote, PakistanMap, ProvinceFacts, SHADE_LEGEND, provinceColor } from "./PakistanMap";

type Metric = {
  id: string;
  label: string;
  unit: string;
  color: string;
  value: (p: ProvinceCensus) => number | undefined;
  /** Density spans two orders of magnitude, so it is shaded on a log scale. */
  log?: boolean;
};

const METRICS: Metric[] = [
  { id: "density", label: "Population density", unit: "/ km²", color: "#0B5D3B", value: (p) => p.density, log: true },
  { id: "pacca", label: "Pacca houses", unit: "%", color: "#16A34A", value: (p) => p.paccaPct },
  { id: "kacha", label: "Kacha houses", unit: "%", color: "#D97706", value: (p) => p.kachaPct },
  { id: "urban", label: "Urban share", unit: "%", color: "#0E7490", value: (p) => p.urbanPct },
];

export function ProvinceCensusMap() {
  const [metricId, setMetricId] = React.useState(METRICS[0].id);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string>("punjab");
  const metric = METRICS.find((m) => m.id === metricId)!;

  const values = provinces.map((p) => metric.value(p)).filter((v): v is number => v !== undefined);
  const scale = (v: number) => (metric.log ? Math.log10(v) : v);
  const min = Math.min(...values.map(scale));
  const max = Math.max(...values.map(scale));
  const shade01 = (v: number) => (scale(v) - min) / (max - min || 1);
  const shade = (v: number) => 0.18 + 0.82 * shade01(v);

  const focusId = hovered ?? selected;
  const focus = getProvince(focusId)!;
  const ranked = [...provinces]
    .filter((p) => metric.value(p) !== undefined)
    .sort((a, b) => metric.value(b)! - metric.value(a)!);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="card-pro rounded-2xl bg-card p-4 sm:p-6">
        <div role="radiogroup" aria-label="Map metric" className="mb-4 flex flex-wrap gap-2">
          {METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={m.id === metricId}
              onClick={() => setMetricId(m.id)}
              className={cn(
                "rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5",
                m.id === metricId
                  ? "border-transparent text-white shadow-md"
                  : "border-border bg-card text-muted-foreground hover:border-[var(--m)] hover:text-foreground",
              )}
              style={{ "--m": m.color, background: m.id === metricId ? m.color : undefined } as React.CSSProperties}
            >
              {m.label}
            </button>
          ))}
        </div>
        <PakistanMap
          ariaLabel={`Map of Pakistan shaded by ${metric.label.toLowerCase()}`}
          activeId={focusId}
          onActiveChange={setHovered}
          onSelect={setSelected}
          labelFor={(p) => {
            const v = metric.value(p);
            return `${p.name}: ${v === undefined ? "no housing data" : `${v.toLocaleString("en-US")}${metric.unit}`}`;
          }}
          fills={(id) => {
            const v = metric.value(getProvince(id)!);
            return v === undefined
              ? { fill: "hsl(var(--muted-foreground))", opacity: 0.14 }
              : { fill: provinceColor(id).base, opacity: 0.3 + 0.7 * shade01(v) };
          }}
        />
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>Lighter = lower</span>
          <span aria-hidden="true" className="h-2 flex-1 rounded-full" style={{ background: SHADE_LEGEND }} />
          <span>Deeper = higher</span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/20" /> No PBS housing data
          </span>
        </div>
        <MapSourceNote className="mt-3" />
      </div>

      <div className="flex flex-col gap-4">
        <div aria-live="polite" className="card-pro rounded-2xl bg-card p-5" style={{ "--tone": metric.color, "--tone-2": "#0e7490" } as React.CSSProperties}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: metric.color }}>
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {hovered ? "Hovered" : "Selected"} province
          </p>
          <h3 className="mt-1 text-xl font-bold">{focus.name}</h3>
          <div className="mt-4">
            <ProvinceFacts province={focus} />
          </div>
          {!focus.households && (
            <p className="mt-3 text-xs text-muted-foreground">
              PBS publishes the population for AJK and Gilgit-Baltistan within the national total; housing tables cover the four
              provinces and ICT.
            </p>
          )}
        </div>
        <div className="card-pro rounded-2xl bg-card p-5" style={{ "--tone": "#4338ca", "--tone-2": "#7c3aed" } as React.CSSProperties}>
          <h3 className="text-sm font-semibold">Ranking: {metric.label}</h3>
          <ol className="mt-3 flex flex-col gap-2">
            {ranked.map((p) => {
              const v = metric.value(p)!;
              const width = `${Math.max(6, shade(v) * 100)}%`;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(p.id)}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-left text-sm transition-all hover:border-[var(--m)] hover:shadow-soft",
                      focusId === p.id ? "border-[var(--m)] bg-muted/40" : "border-transparent",
                    )}
                    style={{ "--m": metric.color } as React.CSSProperties}
                  >
                    <span className="flex justify-between gap-3">
                      <span className="font-medium">{p.name}</span>
                      <span className="font-semibold tabular-nums">
                        {v.toLocaleString("en-US")}
                        {metric.unit === "%" ? "%" : ` ${metric.unit}`}
                      </span>
                    </span>
                    <span className="mt-1.5 block h-1.5 rounded-full bg-muted">
                      <span className="block h-full rounded-full" style={{ width, background: metric.color }} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Source: July 2026 projected population and refined housing counts. Urban share remains {censusSource.label}.
          </p>
        </div>
      </div>
    </div>
  );
}
