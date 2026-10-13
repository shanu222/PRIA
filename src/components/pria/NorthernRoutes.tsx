"use client";

import * as React from "react";
import { routeLines } from "@/data/route-lines";
import {
  corridorEdges,
  lineForPath,
  northRoutes,
  placeById,
  routeNodes,
  routesBetween,
  type RouteGroup,
} from "@/data/northern-routes";
import { loadRouteWeather, type RouteReport } from "@/lib/route-weather";
import { cn } from "@/lib/utils";
import { RouteGisMap } from "./RouteGisMap";

const GROUPS: RouteGroup[] = ["Capital", "Gilgit-Baltistan", "North Khyber Pakhtunkhwa", "Azad Jammu & Kashmir"];

function toLatLng(line: [number, number][]) {
  return line.map(([lon, lat]) => [lat, lon] as [number, number]);
}

export function NorthernRoutes() {
  const [start, setStart] = React.useState("islamabad");
  const [end, setEnd] = React.useState("hunza");
  const [focus, setFocus] = React.useState(0);
  const [basemap, setBasemap] = React.useState<"topo" | "imagery">("topo");
  const [weatherStatus, setWeatherStatus] = React.useState<"idle" | "loading" | "ready" | "error">("idle");
  const [reports, setReports] = React.useState<RouteReport[]>([]);
  const [bestIndex, setBestIndex] = React.useState<number | null>(null);
  const [weatherReason, setWeatherReason] = React.useState("");

  const paths = React.useMemo(() => routesBetween(start, end), [start, end]);
  const active = paths[focus] ?? paths[0];
  const origin = placeById(start);
  const destination = placeById(end);
  const site = northRoutes.find((route) => route.id === end);

  const network = React.useMemo(
    () => corridorEdges.map((edge) => toLatLng(routeLines[edge.id] ?? [])),
    [],
  );
  const drawn = React.useMemo(
    () =>
      paths.map((path, index) => ({
        positions: toLatLng(lineForPath(path.nodes)),
        seasonal: path.seasonal,
        active: index === (paths[focus] ? focus : 0),
      })),
    [paths, focus],
  );
  const stops = React.useMemo(() => {
    const ids = new Set<string>();
    for (const path of paths) for (const id of path.nodes) ids.add(id);
    ids.delete(start);
    ids.delete(end);
    return [...ids].map((id) => placeById(id)).filter((place) => place != null);
  }, [paths, start, end]);

  React.useEffect(() => {
    if (paths.length === 0) {
      setWeatherStatus("idle");
      setReports([]);
      setBestIndex(null);
      setWeatherReason("");
      return;
    }
    const controller = new AbortController();
    setWeatherStatus("loading");
    const lines = paths.map((path) => lineForPath(path.nodes));
    loadRouteWeather(
      lines,
      paths.map((path) => path.seasonal),
      controller.signal,
    )
      .then((result) => {
        setReports(result.reports);
        setBestIndex(result.best);
        setWeatherReason(result.reason);
        setWeatherStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setReports([]);
        setBestIndex(null);
        setWeatherReason("");
        setWeatherStatus("error");
      });
    return () => controller.abort();
  }, [paths]);

  const chooseDestination = (id: string) => {
    setStart("islamabad");
    setEnd(id);
    setFocus(0);
  };

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] seg-text">Infrastructure corridors</p>
        <h3 className="mt-1 font-heading text-xl font-bold">Corridors from Islamabad</h3>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Choose a destination to draw every highway in this library from Islamabad, or set both ends. The lines follow
          the mapped roads. Live weather is read along each road, and the calmer corridor is marked for this moment.
          Babusar is dashed and is a summer link only. This is the infrastructure corridor, not a live travel bulletin.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="overflow-hidden rounded-2xl border-2 border-[color-mix(in_srgb,var(--seg)_28%,hsl(var(--border)))] bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Survey base map</p>
            <div className="flex rounded-full border bg-muted/60 p-0.5 text-xs font-semibold">
              <button
                type="button"
                aria-pressed={basemap === "topo"}
                onClick={() => setBasemap("topo")}
                className={cn("rounded-full px-3 py-1", basemap === "topo" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
              >
                Topographic
              </button>
              <button
                type="button"
                aria-pressed={basemap === "imagery"}
                onClick={() => setBasemap("imagery")}
                className={cn("rounded-full px-3 py-1", basemap === "imagery" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
              >
                Satellite
              </button>
            </div>
          </div>
          <RouteGisMap
            network={network}
            paths={drawn}
            origin={origin ? { name: origin.name, lat: origin.lat, lon: origin.lon } : null}
            destination={destination ? { name: destination.name, lat: destination.lat, lon: destination.lon } : null}
            stops={stops.map((place) => ({ name: place.name, lat: place.lat, lon: place.lon }))}
            basemap={basemap}
          />
          <p className="border-t px-4 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Blue is the start and teal is the destination. A teal line is a year-round highway. An amber dashed line is
            Babusar, summer only. Roads: N-35, N-15, N-95, the Swat Expressway, N-45 through the Lowari Tunnel, the
            Murree–Kohala highway, the Gilgit–Skardu road, the Gilgit–Ghizer road and the Neelum valley road.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              From
              <select
                value={start}
                onChange={(event) => {
                  setStart(event.target.value);
                  setFocus(0);
                }}
                className="rounded-xl border bg-card px-3 py-2 text-sm font-semibold normal-case tracking-normal text-foreground"
              >
                {GROUPS.map((group) => (
                  <optgroup key={group} label={group}>
                    {routeNodes
                      .filter((node) => node.group === group)
                      .map((node) => (
                        <option key={node.id} value={node.id} disabled={node.id === end}>
                          {node.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              To
              <select
                value={end}
                onChange={(event) => {
                  setEnd(event.target.value);
                  setFocus(0);
                }}
                className="rounded-xl border bg-card px-3 py-2 text-sm font-semibold normal-case tracking-normal text-foreground"
              >
                {GROUPS.map((group) => (
                  <optgroup key={group} label={group}>
                    {routeNodes
                      .filter((node) => node.group === group)
                      .map((node) => (
                        <option key={node.id} value={node.id} disabled={node.id === start}>
                          {node.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            {weatherStatus === "loading" && paths.length > 0 && (
              <p className="text-xs text-muted-foreground">Reading weather along each road…</p>
            )}
            {weatherStatus === "error" && (
              <p className="text-xs text-muted-foreground">Live weather did not load. The corridors are unchanged.</p>
            )}
            {weatherStatus === "ready" && paths.length > 1 && bestIndex != null && (
              <p className="rounded-xl border border-emerald-700/25 bg-emerald-700/10 px-3 py-2 text-sm leading-relaxed">
                <span className="font-semibold">Best for this moment: </span>
                {paths[bestIndex]?.seasonal ? "Summer corridor" : "Year-round corridor"} {bestIndex + 1}. {weatherReason}
              </p>
            )}
            {paths.length === 0 ? (
              <p className="rounded-xl border bg-card px-3 py-2 text-sm text-muted-foreground">
                No corridor in this library joins {origin?.name} and {destination?.name}.
              </p>
            ) : (
              paths.map((path, index) => {
                const names = path.nodes.map((id) => placeById(id)?.name ?? id).join(" → ");
                const isActive = index === (active ? paths.indexOf(active) : 0);
                const report = reports.find((item) => item.index === index);
                const isBest = weatherStatus === "ready" && paths.length > 1 && index === bestIndex;
                return (
                  <button
                    key={`${path.label}-${index}`}
                    type="button"
                    onClick={() => setFocus(index)}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left",
                      isActive
                        ? "border-[var(--seg)] bg-[color-mix(in_srgb,var(--seg)_10%,transparent)]"
                        : "border-transparent hover:bg-muted",
                    )}
                  >
                    <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      {path.seasonal ? "Summer corridor" : "Year-round corridor"}
                      {paths.length > 1 ? ` ${index + 1}` : ""}
                      {isBest && (
                        <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Best for now
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{path.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{names}</span>
                    {report && <span className="mt-1 block text-xs font-medium leading-relaxed">{report.summary}</span>}
                  </button>
                );
              })
            )}
            {weatherStatus === "ready" && (
              <p className="text-[11px] text-muted-foreground">Weather along the roads from Open-Meteo, for this moment.</p>
            )}
          </div>

          <div className="flex max-h-[240px] flex-col gap-3 overflow-auto pr-1">
            {GROUPS.filter((group) => group !== "Capital").map((group) => (
              <div key={group}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
                <div className="flex flex-col gap-1">
                  {northRoutes
                    .filter((route) => route.region === group)
                    .map((route) => {
                      const isActive = end === route.id && start === "islamabad";
                      return (
                        <button
                          key={route.id}
                          type="button"
                          onClick={() => chooseDestination(route.id)}
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

      {site && (
        <article className="rounded-2xl border-2 border-[color-mix(in_srgb,var(--seg)_25%,hsl(var(--border)))] bg-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] seg-text">{site.region}</p>
          <h4 className="mt-1 font-heading text-lg font-bold">{site.site}</h4>
          <p className="mt-1 text-sm font-medium">{active?.label ?? site.road}</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Use this infrastructure</dt>
              <dd className="mt-1 text-sm leading-relaxed">
                {site.infrastructure.map((item) => (
                  <span key={item} className="mt-1 block">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Do not build here</dt>
              <dd className="mt-1 text-sm leading-relaxed">{site.limit}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">When the road is the route</dt>
              <dd className="mt-1 text-sm leading-relaxed">{site.season}</dd>
            </div>
          </dl>
        </article>
      )}
    </div>
  );
}
