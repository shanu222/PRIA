"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { MAP_VIEWBOX, kashmirShape, provinceShapes } from "@/data/pakistan-geo";
import { fmtInt, getProvince, type ProvinceCensus } from "@/data/census";
import { cn } from "@/lib/utils";

const LABELS: Record<string, { text: string; at?: [number, number] }> = {
  balochistan: { text: "Balochistan" },
  sindh: { text: "Sindh" },
  punjab: { text: "Punjab" },
  "khyber-pakhtunkhwa": { text: "Khyber Pakhtunkhwa", at: [549, 271] },
  "gilgit-baltistan": { text: "Gilgit-Baltistan" },
  "azad-kashmir": { text: "AJK", at: [742, 236] },
  islamabad: { text: "ICT", at: [724, 280] },
};

/** Identity colour of each province and territory, with a deeper shade for hover. */
export const PROVINCE_COLORS: Record<string, { base: string; hover: string }> = {
  punjab: { base: "#22C55E", hover: "#15803D" },
  sindh: { base: "#38BDF8", hover: "#0369A1" },
  "khyber-pakhtunkhwa": { base: "#A78BFA", hover: "#6D28D9" },
  balochistan: { base: "#FBBF24", hover: "#D97706" },
  "gilgit-baltistan": { base: "#2DD4BF", hover: "#0F766E" },
  "azad-kashmir": { base: "#F472B6", hover: "#BE185D" },
  islamabad: { base: "#F87171", hover: "#B91C1C" },
  kashmir: { base: "#FB923C", hover: "#C2410C" },
};

/** Legend for maps that shade each province's own colour by value. */
export const SHADE_LEGEND = `linear-gradient(90deg, ${["#22C55E", "#38BDF8", "#A78BFA", "#F472B6", "#FBBF24"]
  .map((c, i, all) => `color-mix(in srgb, ${c} ${30 + (70 * i) / (all.length - 1)}%, transparent)`)
  .join(", ")})`;

export const provinceColor = (id: string) => PROVINCE_COLORS[id] ?? { base: "#94A3B8", hover: "#475569" };

export type ProvinceFill = { fill: string; opacity?: number; stroke?: string; strokeWidth?: number; hoverFill?: string };

/**
 * Province outlines of Pakistan with hover / focus handling. Fills are supplied by the caller,
 * so the same map drives segment highlighting and census choropleths.
 */
export function PakistanMap({
  fills,
  activeId,
  onActiveChange,
  onSelect,
  labelFor,
  ariaLabel,
  children,
  className,
}: {
  fills: (id: string) => ProvinceFill;
  activeId?: string | null;
  onActiveChange?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  labelFor?: (province: ProvinceCensus) => string;
  ariaLabel: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [hoverId, setHoverId] = React.useState<string | null>(null);
  const ordered = React.useMemo(
    () => [...provinceShapes].sort((a, b) => Number(a.id === activeId) - Number(b.id === activeId)),
    [activeId],
  );
  const enter = (id: string) => {
    setHoverId(id);
    onActiveChange?.(id);
  };
  const leave = () => {
    setHoverId(null);
    onActiveChange?.(null);
  };
  const kashmir = provinceColor("kashmir");

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      className={cn("h-auto w-full select-none", className)}
      role="group"
      aria-label={ariaLabel}
    >
      <defs>
        <filter id="pk-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.22" />
        </filter>
        <filter id="pk-glow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#065F46" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer boundary: a wide stroke under every shape; the opaque base hides its inner half. */}
      <g aria-hidden="true" pointerEvents="none" filter="url(#pk-glow)">
        {[...provinceShapes.map((s) => s.d), kashmirShape.d].map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            fill="none"
            stroke="hsl(var(--map-outline))"
            strokeWidth={11}
            strokeLinejoin="round"
            className="pk-outline"
          />
        ))}
      </g>
      <g aria-hidden="true" pointerEvents="none">
        {[...provinceShapes.map((s) => s.d), kashmirShape.d].map((d, i) => (
          <path key={i} d={d} fill="hsl(var(--card))" fillRule="evenodd" />
        ))}
      </g>

      <path
        d={kashmirShape.d}
        fill={hoverId === "kashmir" ? kashmir.hover : kashmir.base}
        fillOpacity={hoverId === "kashmir" ? 0.85 : 0.45}
        stroke="hsl(var(--card))"
        strokeWidth={2}
        strokeLinejoin="round"
        fillRule="evenodd"
        className="pk-province transition-[fill,fill-opacity] duration-200"
        onMouseEnter={() => setHoverId("kashmir")}
        onMouseLeave={() => setHoverId(null)}
        aria-hidden
      />
      {ordered.map((shape, i) => {
        const province = getProvince(shape.id);
        const f = fills(shape.id);
        const isActive = activeId === shape.id;
        const isHovered = hoverId === shape.id;
        return (
          <path
            key={shape.id}
            d={shape.d}
            fill={isHovered ? (f.hoverFill ?? provinceColor(shape.id).hover) : f.fill}
            fillOpacity={isHovered ? 1 : (f.opacity ?? 1)}
            stroke={f.stroke ?? "hsl(var(--card))"}
            strokeWidth={isActive || isHovered ? 3.5 : (f.strokeWidth ?? 2)}
            strokeLinejoin="round"
            filter={isActive || isHovered ? "url(#pk-shadow)" : undefined}
            tabIndex={0}
            role={onSelect ? "button" : "img"}
            aria-label={province ? (labelFor ? labelFor(province) : province.name) : shape.id}
            style={{ animationDelay: `${i * 70}ms` }}
            className="pk-province cursor-pointer outline-none transition-[fill,fill-opacity,stroke-width] duration-200 focus-visible:stroke-[hsl(var(--ring))]"
            onMouseEnter={() => enter(shape.id)}
            onMouseLeave={leave}
            onFocus={() => enter(shape.id)}
            onBlur={leave}
            onClick={() => onSelect?.(shape.id)}
            onKeyDown={(e) => {
              if (onSelect && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect(shape.id);
              }
            }}
          />
        );
      })}
      <g pointerEvents="none" aria-hidden="true">
        {provinceShapes.map((shape) => {
          const label = LABELS[shape.id];
          const [x, y] = label?.at ?? shape.centroid;
          return (
            <text
              key={shape.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={shape.id === "islamabad" || shape.id === "azad-kashmir" ? 18 : 22}
              fontWeight={700}
              className="fill-foreground/75 font-heading"
              style={{ paintOrder: "stroke", stroke: "hsl(var(--card))", strokeWidth: 4, strokeOpacity: 0.8 }}
            >
              {label?.text}
            </text>
          );
        })}
        <text
          x={kashmirShape.label[0]}
          y={kashmirShape.label[1]}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={20}
          fontWeight={700}
          className="fill-foreground/75 font-heading"
          style={{ paintOrder: "stroke", stroke: "hsl(var(--card))", strokeWidth: 4, strokeOpacity: 0.8 }}
        >
          Kashmir
        </text>
      </g>
      {children}
    </svg>
  );
}

export function MapSourceNote({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground", className)}>
      <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
      Boundaries are indicative (geoBoundaries, public domain); the Survey of Pakistan is the authority for official
      boundaries. Jammu & Kashmir is disputed territory, its final status to be decided in line with the relevant UN
      Security Council resolutions.
    </p>
  );
}

export function ProvinceFacts({ province }: { province: ProvinceCensus }) {
  const rows: [string, string | undefined][] = [
    ["Population", fmtInt(province.population)],
    ["Area", province.areaKm2 ? `${fmtInt(province.areaKm2)} km²` : undefined],
    ["Density", province.density ? `${fmtInt(Math.round(province.density))} / km²` : undefined],
    ["Urban share", province.urbanPct !== undefined ? `${province.urbanPct}%` : undefined],
    ["Housing units", province.households ? fmtInt(province.households) : undefined],
    ["Pacca houses", province.paccaPct !== undefined ? `${province.paccaPct}%` : undefined],
    ["Kacha houses", province.kachaPct !== undefined ? `${province.kachaPct}%` : undefined],
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      {rows
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => (
          <React.Fragment key={k}>
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-semibold tabular-nums">{v}</dd>
          </React.Fragment>
        ))}
    </dl>
  );
}
