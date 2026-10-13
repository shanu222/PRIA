"use client";

import * as React from "react";
import { northRoutes, routeEdges, routeNodes, type NorthRoute } from "@/data/northern-routes";
import { cn } from "@/lib/utils";

const nodeById = Object.fromEntries(routeNodes.map((n) => [n.id, n]));

function onPath(route: NorthRoute, a: string, b: string) {
  for (let i = 0; i < route.path.length - 1; i++) {
    const x = route.path[i];
    const y = route.path[i + 1];
    if ((x === a && y === b) || (x === b && y === a)) return true;
  }
  return false;
}

export function NorthernRoutes() {
  const [activeId, setActiveId] = React.useState(northRoutes[0].id);
  const active = northRoutes.find((r) => r.id === activeId) ?? northRoutes[0];
  const regions = ["Gilgit-Baltistan", "North Khyber Pakhtunkhwa", "Azad Jammu & Kashmir"] as const;

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] seg-text">Infrastructure corridors</p>
        <h3 className="mt-1 font-heading text-xl font-bold">Preferred routes to northern sites</h3>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Choose a site. The highlighted line is the national or valley road that serves it. Visitor buildings stay on
          that corridor and out of the river, fault and outburst zones already listed for this segment.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="overflow-hidden rounded-2xl border-2 border-[color-mix(in_srgb,var(--seg)_28%,hsl(var(--border)))] bg-[color-mix(in_srgb,var(--seg)_5%,hsl(var(--card)))]">
          <svg viewBox="0 0 640 440" className="h-auto w-full" role="img" aria-label="Schematic of roads to northern Pakistan sites">
            <rect width="640" height="440" fill="transparent" />
            {routeEdges.map((edge) => {
              const a = nodeById[edge.a];
              const b = nodeById[edge.b];
              const hot = onPath(active, edge.a, edge.b);
              return (
                <line
                  key={`${edge.a}-${edge.b}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={hot ? "var(--seg-strong)" : "hsl(var(--muted-foreground))"}
                  strokeOpacity={hot ? 1 : 0.35}
                  strokeWidth={hot ? 4 : 1.5}
                  strokeDasharray={edge.seasonal ? "6 6" : undefined}
                  strokeLinecap="round"
                />
              );
            })}
            {routeNodes.map((node) => {
              const hot = active.path.includes(node.id);
              const destination = active.path[active.path.length - 1] === node.id;
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={destination ? 8 : hot ? 5.5 : 3.5}
                    fill={hot ? "var(--seg-strong)" : "hsl(var(--card))"}
                    stroke={hot ? "var(--seg-strong)" : "hsl(var(--muted-foreground))"}
                    strokeWidth="1.5"
                  />
                  <text
                    x={node.x + 10}
                    y={node.y + 4}
                    fontSize="11"
                    fontWeight={hot ? 700 : 500}
                    fill="currentColor"
                    className={hot ? "fill-foreground" : "fill-muted-foreground"}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="border-t px-4 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Schematic, not a survey. The dashed link is Babusar, summer only. Roads: N-35 Karakoram Highway, N-15,
            N-95, N-45 through the Lowari Tunnel, the Gilgit–Skardu road and the Neelum valley road.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex max-h-[280px] flex-col gap-3 overflow-auto pr-1 xl:max-h-[420px]">
            {regions.map((region) => (
              <div key={region}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{region}</p>
                <div className="flex flex-col gap-1">
                  {northRoutes
                    .filter((r) => r.region === region)
                    .map((route) => {
                      const isActive = route.id === active.id;
                      return (
                        <button
                          key={route.id}
                          type="button"
                          onClick={() => setActiveId(route.id)}
                          aria-pressed={isActive}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-left transition-colors",
                            isActive
                              ? "border-[var(--seg)] bg-[color-mix(in_srgb,var(--seg)_10%,transparent)]"
                              : "border-transparent hover:bg-muted",
                          )}
                        >
                          <span className="block text-sm font-semibold">{route.site}</span>
                          <span className="block text-xs text-muted-foreground">{route.road}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <article className="rounded-2xl border-2 border-[color-mix(in_srgb,var(--seg)_25%,hsl(var(--border)))] bg-card p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] seg-text">{active.region}</p>
        <h4 className="mt-1 font-heading text-lg font-bold">{active.site}</h4>
        <p className="mt-1 text-sm font-medium">{active.road}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Use this infrastructure</dt>
            <dd className="mt-1 text-sm leading-relaxed">
              {active.infrastructure.map((item) => (
                <span key={item} className="mt-1 block">
                  {item}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Do not build here</dt>
            <dd className="mt-1 text-sm leading-relaxed">{active.limit}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">When the road is the route</dt>
            <dd className="mt-1 text-sm leading-relaxed">{active.season}</dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
