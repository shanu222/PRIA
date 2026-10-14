"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, RotateCcw, SearchX } from "lucide-react";
import { getProvince, provinces, type ProvinceId } from "@/data/census";
import {
  drimHazards,
  drimModels,
  drimSystems,
  modelsForProvince,
  type DrimHazard,
  type DrimModel,
  type DrimSystem,
} from "@/data/drim";
import { segments, type SegmentId } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { DrimCard } from "./DrimCard";
import { MapSourceNote, PakistanMap, SHADE_LEGEND, provinceColor } from "./PakistanMap";

type Filters = {
  province: ProvinceId | null;
  segment: SegmentId | null;
  hazard: DrimHazard | null;
  system: DrimSystem | null;
};

const MAP_COLOR = "#0B5D3B";

function matches(m: DrimModel, f: Filters): boolean {
  if (f.province && !m.regions.some((r) => r.province === f.province)) return false;
  if (f.segment && !m.regions.some((r) => r.segment === f.segment)) return false;
  if (f.hazard && !m.hazards.includes(f.hazard)) return false;
  if (f.system && m.system !== f.system) return false;
  return true;
}

function Pill({
  active,
  onClick,
  color = MAP_COLOR,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{ "--pill": color, background: active ? color : undefined } as React.CSSProperties}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-transparent text-white shadow-md"
          : "border-border bg-card text-muted-foreground hover:border-[var(--pill)] hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function DrimExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const hazard = params.get("hazard");
  const system = params.get("system");
  const filters: Filters = {
    province: (provinces.find((p) => p.id === params.get("province"))?.id as ProvinceId | undefined) ?? null,
    segment: segments.find((s) => s.id === params.get("segment"))?.id ?? null,
    hazard: hazard && hazard in drimHazards ? (hazard as DrimHazard) : null,
    system: system && system in drimSystems ? (system as DrimSystem) : null,
  };
  const [hovered, setHovered] = React.useState<string | null>(null);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || filters[key] === value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const reset = () => router.replace(pathname, { scroll: false });

  const results = drimModels.filter((m) => matches(m, filters));
  const counts = Object.fromEntries(provinces.map((p) => [p.id, modelsForProvince(p.id).length]));
  const maxCount = Math.max(...Object.values(counts));
  const focusId = hovered ?? filters.province;
  const focus = focusId ? getProvince(focusId) : undefined;
  const anyFilter = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="rounded-2xl border-2 bg-gradient-to-br from-primary-tint/60 via-card to-card p-4 shadow-soft sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Select a province to see the models suited to it</h2>
            <span aria-live="polite" className="text-xs font-semibold text-primary dark:text-accent-foreground">
              {focus ? `${focus.name}: ${counts[focus.id]} models` : `${drimModels.length} models`}
            </span>
          </div>
          <PakistanMap
            ariaLabel="Map of Pakistan shaded by the number of DRIM models suited to each province"
            activeId={focusId}
            onActiveChange={setHovered}
            onSelect={(id) => setFilter("province", id as ProvinceId)}
            labelFor={(p) => `${p.name}: ${counts[p.id]} suitable models`}
            fills={(id) => {
              const color = provinceColor(id);
              return filters.province === id
                ? { fill: color.hover, opacity: 1 }
                : { fill: color.base, opacity: 0.3 + 0.65 * (counts[id] / maxCount) };
            }}
          />
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Lighter = fewer</span>
            <span aria-hidden="true" className="h-2 flex-1 rounded-full" style={{ background: SHADE_LEGEND }} />
            <span>Deeper = more models</span>
          </div>
          <MapSourceNote className="mt-3" />
        </div>

        <div className="card-pro flex flex-col gap-5 rounded-2xl bg-card p-5 sm:p-6">
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Province / region</legend>
            <div className="flex flex-wrap gap-2">
              {provinces.map((p) => (
                <Pill key={p.id} active={filters.province === p.id} onClick={() => setFilter("province", p.id)} color="#B45309">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {p.name}
                  <span className="tabular-nums opacity-70">{counts[p.id]}</span>
                </Pill>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Regional segment</legend>
            <div className="flex flex-wrap gap-2">
              {segments.map((s) => (
                <Pill key={s.id} active={filters.segment === s.id} onClick={() => setFilter("segment", s.id)} color={s.colorStrong}>
                  <Icon name={s.icon} className="h-3 w-3" />
                  {s.shortTitle}
                </Pill>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Hazard addressed</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(drimHazards) as DrimHazard[]).map((h) => (
                <Pill key={h} active={filters.hazard === h} onClick={() => setFilter("hazard", h)} color={drimHazards[h].color}>
                  <Icon name={drimHazards[h].icon} className="h-3 w-3" />
                  {drimHazards[h].label}
                </Pill>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Construction system</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(drimSystems) as DrimSystem[]).map((s) => (
                <Pill key={s} active={filters.system === s} onClick={() => setFilter("system", s)}>
                  {drimSystems[s]}
                </Pill>
              ))}
            </div>
          </fieldset>
          <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
            <p aria-live="polite" className="text-sm">
              <span className="font-heading text-2xl font-bold text-primary dark:text-accent-foreground">{results.length}</span>{" "}
              <span className="text-muted-foreground">of {drimModels.length} models match</span>
            </p>
            <button
              type="button"
              onClick={reset}
              disabled={!anyFilter}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-px hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="font-semibold">No model matches all of these filters</p>
          <button type="button" onClick={reset} className="text-sm font-semibold text-primary hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((m) => (
              <motion.li
                key={m.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
              >
                <DrimCard model={m} index={drimModels.indexOf(m)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
