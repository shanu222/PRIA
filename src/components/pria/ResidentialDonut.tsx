"use client";

import * as React from "react";
import { Building2, House } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { national } from "@/data/census";
import type { ContentStatus } from "@/data/pria";
import { cn } from "@/lib/utils";
import { CountUp } from "./Motion";
import { StatusBadge } from "./StatusBadge";

type Slice = { id: string; label: string; value: number; status: ContentStatus };

const COLORS: Record<string, string> = {
  urban: "#38bdf8",
  rural: "#34d399",
};

const PHOTOS: Record<string, string> = {
  urban: "/split/urban.jpg",
  rural: "/split/rural.jpg",
};

const ICONS: Record<string, typeof House> = {
  urban: Building2,
  rural: House,
};

const totalMn = national.households / 1_000_000;

export function ResidentialDonut({ data }: { data: Slice[] }) {
  const [active, setActive] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const reduce = useReducedMotion();
  React.useEffect(() => setMounted(true), []);

  const summary = data.map((d) => `${d.label} ${d.value}%${d.status === "provisional" ? " (provisional)" : ""}`).join(", ");

  return (
    <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,240px)_1fr]">
      <figure className="relative mx-auto aspect-square w-full max-w-[240px]" aria-label={`Residential split: ${summary}`}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="68%"
                outerRadius="100%"
                paddingAngle={3}
                cornerRadius={8}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                onMouseEnter={(_, i) => setActive(data[i]?.id ?? null)}
                onMouseLeave={() => setActive(null)}
                isAnimationActive={!reduce}
                animationDuration={900}
              >
                {data.map((d) => (
                  <Cell
                    key={d.id}
                    fill={COLORS[d.id] ?? "hsl(var(--muted-foreground))"}
                    opacity={active && active !== d.id ? 0.35 : 1}
                    style={{ transition: "opacity 200ms", outline: "none" }}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                content={({ active: a, payload }) =>
                  a && payload?.[0] ? (
                    <div className="rounded-md border bg-popover px-3 py-1.5 text-xs font-medium shadow-md">
                      {String(payload[0].name)}: {String(payload[0].value)}%
                    </div>
                  ) : null
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        <figcaption className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Residential</span>
          <span className="font-heading text-2xl font-bold text-white">Split</span>
          <span className="mt-0.5 text-xs text-white/70">{totalMn.toFixed(2)} Mn</span>
          <span className="text-[11px] text-white/50">Housing units</span>
        </figcaption>
        {data.map((d) => (
          <span
            key={d.id}
            className={cn(
              "pointer-events-none absolute rounded-full border px-2.5 py-1 text-xs font-bold text-white shadow-lg backdrop-blur",
              d.id === "urban" ? "right-0 top-6" : "bottom-8 left-0",
            )}
            style={{
              borderColor: COLORS[d.id],
              background: `color-mix(in srgb, ${COLORS[d.id]} 28%, rgba(4,18,26,0.8))`,
              boxShadow: `0 0 16px -4px ${COLORS[d.id]}`,
            }}
          >
            {d.value.toFixed(1)}%
          </span>
        ))}
      </figure>

      <ul className="flex flex-col gap-3">
        {data.map((d) => {
          const Icon = ICONS[d.id] ?? House;
          const units = ((totalMn * d.value) / 100).toFixed(2);
          return (
            <li
              key={d.id}
              onMouseEnter={() => setActive(d.id)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                "group relative isolate flex items-center justify-between gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-white transition-all duration-300",
                active === d.id && "-translate-y-0.5",
              )}
              style={{
                borderColor: `color-mix(in srgb, ${COLORS[d.id] ?? "#34d399"} 55%, transparent)`,
                boxShadow: active === d.id ? `0 0 24px -8px ${COLORS[d.id]}` : undefined,
              }}
            >
              {PHOTOS[d.id] && (
                <img
                  src={PHOTOS[d.id]}
                  alt=""
                  className="absolute inset-y-0 right-0 -z-10 h-full w-[70%] object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ maskImage: "linear-gradient(to right, transparent, #000 45%)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 45%)" }}
                />
              )}
              <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06141b] via-[#06141b]/80 to-transparent" />
              <span className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur"
                  style={{ color: COLORS[d.id], boxShadow: `0 0 16px -6px ${COLORS[d.id]}` }}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold">{d.label}</span>
                  <span className="block text-xs text-white/65">Housing units in {d.label.toLowerCase()} areas</span>
                  {d.status === "provisional" && <StatusBadge status="provisional" />}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-heading text-3xl font-bold" style={{ color: COLORS[d.id], textShadow: `0 0 16px ${COLORS[d.id]}` }}>
                  <CountUp value={d.value} suffix="%" decimals={1} />
                </span>
                <span className="block text-xs text-white/65">(≈ {units} Mn units)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
