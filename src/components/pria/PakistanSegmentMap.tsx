"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { segments, type SegmentId } from "@/data/pria";
import { getProvince, segmentProvinces } from "@/data/census";
import { cn } from "@/lib/utils";
import { MapSourceNote, PakistanMap, provinceColor } from "./PakistanMap";

/** Marker position of each segment, in map coordinates. */
const MARKERS: Record<SegmentId, [number, number]> = {
  mountain: [860, 150],
  "riverine-plains": [700, 480],
  "desert-arid": [170, 650],
  coastal: [250, 778],
};

/**
 * Provinces of Pakistan highlighted by regional resilience segment. Segments span parts of
 * provinces (e.g. north and south KP), so a province can belong to more than one segment.
 */
export function PakistanSegmentMap({
  activeId,
  onActiveChange,
  className,
}: {
  activeId?: SegmentId | null;
  onActiveChange?: (id: SegmentId | null) => void;
  className?: string;
}) {
  const router = useRouter();
  const [localActive, setLocalActive] = React.useState<SegmentId | null>(null);
  const [province, setProvince] = React.useState<string | null>(null);
  const active = activeId !== undefined ? activeId : localActive;
  const setActive = (id: SegmentId | null) => {
    setLocalActive(id);
    onActiveChange?.(id);
  };

  const activeSegment = segments.find((s) => s.id === active);
  const hoveredProvince = province ? getProvince(province) : undefined;
  const provinceSegments = province
    ? segments.filter((s) => segmentProvinces[s.id].includes(province as never))
    : [];

  return (
    <figure className={cn("relative", className)}>
      <PakistanMap
        ariaLabel="Map of Pakistan's provinces and territories by regional resilience segment"
        activeId={province}
        onActiveChange={setProvince}
        fills={(id) => {
          if (activeSegment) {
            const inSegment = segmentProvinces[activeSegment.id].includes(id as never);
            return inSegment
              ? { fill: activeSegment.color, opacity: 0.82, hoverFill: activeSegment.colorStrong }
              : { fill: "hsl(var(--muted-foreground))", opacity: 0.12 };
          }
          return { fill: provinceColor(id).base, opacity: 0.72 };
        }}
        labelFor={(p) =>
          `${p.name}: ${segments
            .filter((s) => segmentProvinces[s.id].includes(p.id))
            .map((s) => `Segment ${s.number}`)
            .join(", ")}`
        }
      >
        {segments.map((s) => {
          const [x, y] = MARKERS[s.id];
          const isActive = active === s.id;
          return (
            <g
              key={s.id}
              role="link"
              tabIndex={0}
              aria-label={`Open Segment ${s.number}: ${s.title}`}
              transform={`translate(${x} ${y})`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setActive(s.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.id)}
              onBlur={() => setActive(null)}
              onClick={() => router.push(`/segments/${s.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/segments/${s.slug}`);
                }
              }}
            >
              <circle r={isActive ? 40 : 32} fill={s.color} fillOpacity={0.25} style={{ transition: "r 200ms" }} />
              <circle r="24" fill={s.colorStrong} stroke="#fff" strokeWidth="4" />
              <text textAnchor="middle" dominantBaseline="central" fontSize="24" fontWeight="800" fill="#fff">
                {s.number}
              </text>
            </g>
          );
        })}
      </PakistanMap>

      <div
        aria-live="polite"
        className="pointer-events-none absolute left-2 top-2 max-w-[60%] rounded-lg border bg-card/95 px-3 py-2 text-xs shadow-soft backdrop-blur"
      >
        {activeSegment ? (
          <>
            <p className="font-semibold" style={{ color: activeSegment.colorStrong }}>
              Segment {activeSegment.number}: {activeSegment.shortTitle}
            </p>
            <p className="mt-0.5 text-muted-foreground">{activeSegment.regions.join(" · ")}</p>
          </>
        ) : hoveredProvince ? (
          <>
            <p className="font-semibold">{hoveredProvince.name}</p>
            <p className="mt-0.5 text-muted-foreground">
              {fmtPopulation(hoveredProvince.population)} people ·{" "}
              {provinceSegments.map((s) => `Segment ${s.number}`).join(", ")}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">Hover a province or a numbered segment</p>
        )}
      </div>
      <figcaption>
        <MapSourceNote className="mt-3" />
      </figcaption>
    </figure>
  );
}

function fmtPopulation(n: number) {
  return `${(n / 1_000_000).toFixed(1)} Mn`;
}
