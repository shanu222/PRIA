"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { getProvinceOutlook, outlookSources, provinceOutlook, type ProvinceOutlook } from "@/data/outlook";
import { cn } from "@/lib/utils";
import { MapSourceNote, PakistanMap, SHADE_LEGEND, provinceColor } from "./PakistanMap";

type Metric = {
  id: string;
  label: string;
  color: string;
  value: (p: ProvinceOutlook) => number;
  format: (v: number) => string;
  log?: boolean;
  source: string;
};

const pct = (v: number) => `${v.toFixed(1)}%`;

const METRICS: Metric[] = [
  { id: "pop2047", label: "Population 2047", color: "#0B5D3B", value: (p) => p.pop2047, format: (v) => `${v.toFixed(2)} Mn`, log: true, source: outlookSources.ghsl },
  {
    id: "popGrowth",
    label: "Population growth 2026–47",
    color: "#15803D",
    value: (p) => ((p.pop2047 - p.pop2026) / p.pop2026) * 100,
    format: pct,
    source: outlookSources.ghsl,
  },
  {
    id: "buildGrowth",
    label: "Building growth 2026–47",
    color: "#0E7490",
    value: (p) => ((p.buildings2047 - p.buildings2026) / p.buildings2026) * 100,
    format: pct,
    source: outlookSources.buildingsProvince,
  },
  { id: "coverage", label: "Built-up % of area 2047", color: "#B45309", value: (p) => p.coverage2047, format: (v) => `${v.toFixed(3)}%`, log: true, source: outlookSources.ghsl },
  { id: "coverageGrowth", label: "Built-up growth / yr", color: "#DC2626", value: (p) => p.coverageGrowth, format: (v) => `${v.toFixed(2)}%`, source: outlookSources.ghsl },
];

function Facts({ p }: { p: ProvinceOutlook }) {
  const mn = (n: number) => `${(n / 1_000_000).toFixed(2)} Mn`;
  const rows: [string, string][] = [
    ["Population 2026", `${p.pop2026.toFixed(2)} Mn`],
    ["Population 2047", `${p.pop2047.toFixed(2)} Mn`],
    ["National share 2047", `${p.share2047}%`],
    ["Buildings 2026", mn(p.buildings2026)],
    ["Buildings 2047", mn(p.buildings2047)],
    ["Built-up 2026 → 2047", `${p.coverage2026}% → ${p.coverage2047}%`],
    ["Share of built-up area 2026", `${p.builtShare2026}%`],
  ];
  if (p.urban2017 !== undefined) rows.push(["Urban share 2017 → 2047", `${p.urban2017}% → ${p.urban2047}%`]);
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="text-right font-semibold tabular-nums">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

export function ProvinceOutlookMap() {
  const [metricId, setMetricId] = React.useState(METRICS[0].id);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState("punjab");
  const metric = METRICS.find((m) => m.id === metricId)!;

  const scale = (v: number) => (metric.log ? Math.log10(v) : v);
  const values = provinceOutlook.map((p) => scale(metric.value(p)));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const shade01 = (v: number) => (scale(v) - min) / (max - min || 1);
  const shade = (v: number) => 0.18 + 0.82 * shade01(v);

  const focus = getProvinceOutlook(hovered ?? selected)!;
  const ranked = [...provinceOutlook].sort((a, b) => metric.value(b) - metric.value(a));

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
          activeId={hovered ?? selected}
          onActiveChange={setHovered}
          onSelect={setSelected}
          labelFor={(p) => {
            const o = getProvinceOutlook(p.id);
            return o ? `${p.name}: ${metric.format(metric.value(o))}` : p.name;
          }}
          fills={(id) => {
            const o = getProvinceOutlook(id);
            return o
              ? { fill: provinceColor(id).base, opacity: 0.3 + 0.7 * shade01(metric.value(o)) }
              : { fill: "hsl(var(--muted-foreground))", opacity: 0.14 };
          }}
        />
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>Lighter = lower</span>
          <span aria-hidden="true" className="h-2 flex-1 rounded-full" style={{ background: SHADE_LEGEND }} />
          <span>Deeper = higher</span>
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
            <Facts p={focus} />
          </div>
        </div>
        <div className="card-pro rounded-2xl bg-card p-5" style={{ "--tone": "#4338ca", "--tone-2": "#7c3aed" } as React.CSSProperties}>
          <h3 className="text-sm font-semibold">Ranking: {metric.label}</h3>
          <ol className="mt-3 flex flex-col gap-1.5">
            {ranked.map((p) => {
              const v = metric.value(p);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(p.id)}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "w-full rounded-lg border-2 px-3 py-1.5 text-left text-sm transition-all hover:border-[var(--m)] hover:shadow-soft",
                      (hovered ?? selected) === p.id ? "border-[var(--m)] bg-muted/40" : "border-transparent",
                    )}
                    style={{ "--m": metric.color } as React.CSSProperties}
                  >
                    <span className="flex justify-between gap-3">
                      <span className="font-medium">{p.name}</span>
                      <span className="font-semibold tabular-nums">{metric.format(v)}</span>
                    </span>
                    <span className="mt-1 block h-1.5 rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${Math.max(6, shade(v) * 100)}%`, background: metric.color }}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[11px] text-muted-foreground">Source: {metric.source}.</p>
        </div>
      </div>
    </div>
  );
}
