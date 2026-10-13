"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ContentStatus } from "@/data/pria";
import { cn } from "@/lib/utils";
import { CountUp } from "./Motion";
import { StatusBadge } from "./StatusBadge";

type Slice = { id: string; label: string; value: number; status: ContentStatus };

const COLORS: Record<string, string> = {
  urban: "hsl(var(--water))",
  rural: "hsl(var(--primary))",
};

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
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Residential</span>
          <span className="font-heading text-2xl font-bold">Split</span>
        </figcaption>
      </figure>

      <ul className="flex flex-col gap-3">
        {data.map((d) => (
          <li
            key={d.id}
            onMouseEnter={() => setActive(d.id)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-all",
              active === d.id && "border-primary/40 shadow-soft",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full"
                style={{ background: COLORS[d.id] ?? "hsl(var(--muted-foreground))" }}
              />
              <span className="font-medium">{d.label}</span>
              {d.status === "provisional" && <StatusBadge status="provisional" />}
            </div>
            <span className="font-heading text-3xl font-bold">
              <CountUp value={d.value} suffix="%" decimals={Number.isInteger(d.value) ? 0 : 1} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
