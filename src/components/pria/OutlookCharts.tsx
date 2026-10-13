"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildingSeries, coverageSeries, housingSeries, populationSeries, topDistricts } from "@/data/outlook";
import { cn } from "@/lib/utils";

const GREEN = "#059669";
const TEAL = "#0891B2";
const AMBER = "#D97706";
const INDIGO = "#4F46E5";
const ROSE = "#E11D48";
const axis = { stroke: "hsl(var(--muted-foreground))", fontSize: 12 };
const grid = { stroke: "hsl(var(--border))", strokeDasharray: "4 6" };

function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

function ChartFrame({ label, height = 320, className, children }: { label: string; height?: number; className?: string; children: React.ReactNode }) {
  const mounted = useMounted();
  return (
    <figure aria-label={label} className={cn("w-full", className)} style={{ height }}>
      {mounted ? children : <div className="h-full w-full animate-pulse rounded-xl bg-muted/50" />}
    </figure>
  );
}

function TooltipBox({ title, rows }: { title: string; rows: [string, string, string?][] }) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-[#047857]/30 bg-popover text-xs shadow-lift">
      <p className="bg-gradient-to-r from-[#047857] to-[#0e7490] px-3 py-1.5 font-heading text-sm font-bold text-white">{title}</p>
      <div className="flex flex-col gap-1 px-3 py-2">
      {rows.map(([k, v, color]) => (
        <p key={k} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
            {k}
          </span>
          <span className="font-semibold tabular-nums">{v}</span>
        </p>
      ))}
      </div>
    </div>
  );
}

const mn = (n: number) => `${(n / 1_000_000).toFixed(2)} Mn`;

export function PopulationChart() {
  const animate = !useReducedMotion();
  return (
    <ChartFrame label="National population 2020 and 2026 to 2047, in millions">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={populationSeries} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="pop-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity={0.5} />
              <stop offset="60%" stopColor={TEAL} stopOpacity={0.14} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="pop-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={GREEN} />
              <stop offset="55%" stopColor={TEAL} />
              <stop offset="100%" stopColor={INDIGO} />
            </linearGradient>
          </defs>
          <CartesianGrid {...grid} vertical={false} />
          <XAxis dataKey="year" type="number" domain={[2020, 2047]} ticks={[2020, 2026, 2030, 2035, 2040, 2047]} tick={axis} tickLine={false} axisLine={false} />
          <YAxis domain={[200, 400]} tick={axis} tickLine={false} axisLine={false} unit=" M" width={60} />
          <Tooltip
            cursor={{ stroke: GREEN, strokeDasharray: "4 4" }}
            content={({ active, payload }) => {
              const d = active && payload?.[0]?.payload;
              if (!d) return null;
              return (
                <TooltipBox
                  title={String(d.year)}
                  rows={[
                    ["Population", `${d.pop.toFixed(2)} Mn`, GREEN],
                    ...(d.growth !== undefined ? ([["Annual growth", `${d.growth.toFixed(2)}%`]] as [string, string][]) : []),
                  ]}
                />
              );
            }}
          />
          <Area type="monotone" dataKey="pop" stroke="url(#pop-stroke)" strokeWidth={3.5} fill="url(#pop-fill)" dot={{ r: 3, fill: "#fff", stroke: GREEN, strokeWidth: 2 }} activeDot={{ r: 7, fill: GREEN, stroke: "#fff", strokeWidth: 3 }} isAnimationActive={animate} animationDuration={1200} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function CoverageChart() {
  const animate = !useReducedMotion();
  return (
    <ChartFrame label="Building coverage as a percentage of Pakistan's land area, 2020 to 2050">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={coverageSeries} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="cov-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ROSE} stopOpacity={0.4} />
              <stop offset="50%" stopColor={AMBER} stopOpacity={0.18} />
              <stop offset="100%" stopColor={AMBER} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="cov-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={AMBER} />
              <stop offset="100%" stopColor={ROSE} />
            </linearGradient>
          </defs>
          <CartesianGrid {...grid} vertical={false} />
          <XAxis dataKey="year" type="number" domain={[2020, 2050]} ticks={[2020, 2026, 2030, 2035, 2040, 2047, 2050]} tick={axis} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 1.8]} tick={axis} tickLine={false} axisLine={false} unit="%" width={52} />
          <Tooltip
            cursor={{ stroke: AMBER, strokeDasharray: "4 4" }}
            content={({ active, payload }) => {
              const d = active && payload?.[0]?.payload;
              if (!d) return null;
              return (
                <TooltipBox
                  title={String(d.year)}
                  rows={[
                    ["Coverage of land area", `${d.pct.toFixed(3)}%`, AMBER],
                    ["Built footprint", `${d.km2.toLocaleString("en-US")} km²`],
                  ]}
                />
              );
            }}
          />
          <Area type="monotone" dataKey="pct" stroke="url(#cov-stroke)" strokeWidth={3.5} fill="url(#cov-fill)" dot={{ r: 3, fill: "#fff", stroke: AMBER, strokeWidth: 2 }} activeDot={{ r: 7, fill: ROSE, stroke: "#fff", strokeWidth: 3 }} isAnimationActive={animate} animationDuration={1200} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function BuildingsHousingChart() {
  const animate = !useReducedMotion();
  const data = buildingSeries.map((b) => ({
    year: b.year,
    buildings: b.buildings / 1_000_000,
    units: (housingSeries.find((h) => h.year === b.year)?.units ?? 0) / 1_000_000,
  }));
  return (
    <ChartFrame label="Building count and residential units required, 2026 to 2047, in millions">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="bld-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
          </defs>
          <CartesianGrid {...grid} vertical={false} />
          <XAxis dataKey="year" tick={axis} tickLine={false} axisLine={false} />
          <YAxis tick={axis} tickLine={false} axisLine={false} unit=" M" width={56} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
            content={({ active, payload }) => {
              const d = active && payload?.[0]?.payload;
              if (!d) return null;
              const b = buildingSeries.find((x) => x.year === d.year)!;
              const h = housingSeries.find((x) => x.year === d.year)!;
              return (
                <TooltipBox
                  title={String(d.year)}
                  rows={[
                    ["Buildings", mn(b.buildings), TEAL],
                    ["Residential units required", mn(h.units), INDIGO],
                    ...(h.additional ? ([["Additional units since 2026", `+${mn(h.additional)}`]] as [string, string][]) : []),
                  ]}
                />
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
          <Bar dataKey="buildings" name="Buildings" fill="url(#bld-bar)" radius={[8, 8, 0, 0]} maxBarSize={42} isAnimationActive={animate} animationDuration={1000} />
          <Line dataKey="units" name="Residential units required" stroke={INDIGO} strokeWidth={3.5} dot={{ r: 4, fill: "#fff", stroke: INDIGO, strokeWidth: 2.5 }} activeDot={{ r: 7, fill: INDIGO, stroke: "#fff", strokeWidth: 3 }} isAnimationActive={animate} animationDuration={1200} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function DistrictChart() {
  const animate = !useReducedMotion();
  const data = topDistricts.map((d) => ({ ...d, p26: d.pop2026 / 1_000_000, p47: d.pop2047 / 1_000_000 }));
  return (
    <ChartFrame label="Top 15 districts by 2047 population, 2026 and 2047" height={560}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barCategoryGap={6}>
          <defs>
            <linearGradient id="dst-26" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor={TEAL} />
            </linearGradient>
            <linearGradient id="dst-47" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          <CartesianGrid {...grid} horizontal={false} />
          <XAxis type="number" tick={axis} tickLine={false} axisLine={false} unit=" M" />
          <YAxis type="category" dataKey="name" tick={{ ...axis, fill: "hsl(var(--foreground))" }} tickLine={false} axisLine={false} width={112} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
            content={({ active, payload }) => {
              const d = active && payload?.[0]?.payload;
              if (!d) return null;
              return (
                <TooltipBox
                  title={`${d.name}, ${d.province}`}
                  rows={[
                    ["2026", d.pop2026.toLocaleString("en-US"), TEAL],
                    ["2047", d.pop2047.toLocaleString("en-US"), GREEN],
                    ["Change", `+${d.change.toLocaleString("en-US")} (${d.growth}%)`],
                  ]}
                />
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
          <Bar dataKey="p26" name="2026" fill="url(#dst-26)" radius={[0, 6, 6, 0]} isAnimationActive={animate} animationDuration={900} />
          <Bar dataKey="p47" name="2047" fill="url(#dst-47)" radius={[0, 6, 6, 0]} isAnimationActive={animate} animationDuration={1100} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
