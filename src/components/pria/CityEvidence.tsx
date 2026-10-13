"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { getProvince, type ProvinceId } from "@/data/census";
import { cityCoords } from "@/data/city-coords";
import {
  evidenceCities,
  evidenceFor,
  getEvidenceCity,
  getSource,
  matchCities,
  type CityFinding,
  type CityRecord,
  type EvidenceScope,
} from "@/data/city-evidence";
import { findingRemedies } from "@/data/city-remedies";
import { indicatedTowns } from "@/data/new-towns";
import { projectLonLat } from "@/data/pakistan-geo";
import { getSegment } from "@/data/pria";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PakistanMap } from "./PakistanMap";

const FEATURED = ["karachi", "lahore", "peshawar", "quetta", "islamabad", "gupis"];

const PRIMARY_CITY: Record<ProvinceId, string> = {
  punjab: "lahore",
  sindh: "karachi",
  "khyber-pakhtunkhwa": "peshawar",
  balochistan: "quetta",
  islamabad: "islamabad",
  "azad-kashmir": "muzaffarabad",
  "gilgit-baltistan": "gilgit",
};

const SCOPE_LABEL: Record<EvidenceScope, string> = {
  city: "This city",
  province: "Provincial total",
  region: "Regional context",
  national: "National assessment",
};

function FindingCard({ finding }: { finding: CityFinding }) {
  const source = getSource(finding.sourceId);
  return (
    <article className="card-pro flex h-full flex-col p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tone,#047857)]">
        {SCOPE_LABEL[finding.scope]}
      </p>
      <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{finding.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{finding.summary}</p>
      {source && (
        <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground underline decoration-[var(--tone,#047857)] underline-offset-2 hover:text-[var(--tone,#047857)]"
          >
            {source.authors} ({source.year})
          </a>
          . {source.title}. <span className="italic">{source.venue}</span>
          {source.doi ? `. https://doi.org/${source.doi}` : ""}.
        </p>
      )}
    </article>
  );
}

function FindingGroup({ title, note, items }: { title: string; note?: string; items: CityFinding[] }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      </div>
      <div data-tones className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <FindingCard key={item.id} finding={item} />
        ))}
      </div>
    </section>
  );
}

export function CityEvidence() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = getEvidenceCity(params.get("city") ?? "");
  const [query, setQuery] = React.useState(selected?.name ?? "");
  const [open, setOpen] = React.useState(false);
  const matches = matchCities(query);
  const view = selected ? evidenceFor(selected) : null;
  const segment = selected ? getSegment(selected.segment) : undefined;
  const province = selected ? getProvince(selected.province) : undefined;

  React.useEffect(() => {
    setQuery(selected?.name ?? "");
  }, [selected?.id, selected?.name]);

  React.useEffect(() => {
    const onDemo = (event: Event) => {
      const id = (event as CustomEvent<string | null>).detail;
      const city = id ? getEvidenceCity(id) : undefined;
      if (!city) return;
      setQuery(city.name);
      setOpen(false);
      router.replace(`/research?city=${city.id}`, { scroll: false });
    };
    window.addEventListener("pria-demo-city", onDemo);
    return () => window.removeEventListener("pria-demo-city", onDemo);
  }, [router]);

  const choose = (city: CityRecord) => {
    setQuery(city.name);
    setOpen(false);
    router.replace(`/research?city=${city.id}`, { scroll: false });
  };

  const towns = selected ? indicatedTowns(selected) : [];
  const remedies = view
    ? [...view.direct, ...view.provincial, ...view.regional, ...view.national].filter((item) => findingRemedies[item.id])
    : [];

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <label htmlFor="city-evidence-search" className="sr-only">
          Search a city of Pakistan
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id="city-evidence-search"
          value={query}
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls="city-evidence-list"
          aria-autocomplete="list"
          placeholder="Search a city, for example Lahore, Gwadar or Muzaffarabad"
          className="h-14 w-full rounded-2xl border bg-card pl-11 pr-4 text-base shadow-soft outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matches[0]) {
              e.preventDefault();
              choose(matches[0]);
            }
            if (e.key === "Escape") setOpen(false);
          }}
        />
        {open && query.trim().length >= 2 && (
          <ul
            id="city-evidence-list"
            role="listbox"
            className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border bg-card p-1 shadow-lift"
          >
            {matches.length === 0 ? (
              <li className="px-3 py-3 text-sm text-muted-foreground">No city by that name is in the index.</li>
            ) : (
              matches.slice(0, 8).map((city) => (
                <li key={city.id}>
                  <button
                    type="button"
                    role="option"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-muted"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(city)}
                  >
                    <span className="font-semibold">{city.name}</span>
                    <span className="text-muted-foreground">{getProvince(city.province)?.name}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div data-demo="map" className="overflow-hidden rounded-2xl border bg-card p-3 shadow-soft sm:p-4">
        <PakistanMap
          ariaLabel="Map of Pakistan. Select a city to read its evidence."
          fills={() => ({ fill: "hsl(var(--primary))", opacity: 0.16, strokeWidth: 1.5 })}
          activeId={selected?.province}
          onSelect={(provinceId) => {
            const city = getEvidenceCity(PRIMARY_CITY[provinceId as ProvinceId] ?? "");
            if (city) choose(city);
          }}
        >
          {towns.map((town) => {
            const [x, y] = projectLonLat(town.lon, town.lat);
            return (
              <g key={town.id} transform={`translate(${x} ${y})`} pointerEvents="none">
                <rect x={-6} y={-6} width={12} height={12} rx={2} transform="rotate(45)" fill="#b45309" stroke="#fff" strokeWidth={1.5} />
              </g>
            );
          })}
          {evidenceCities.map((city) => {
            const coord = cityCoords[city.id];
            if (!coord) return null;
            const [x, y] = projectLonLat(coord[0], coord[1]);
            const isSelected = city.id === selected?.id;
            return (
              <g
                key={city.id}
                transform={`translate(${x} ${y})`}
                className="cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  choose(city);
                }}
              >
                <circle r={isSelected ? 11 : 5} fill={isSelected ? "#0f766e" : "#115e59"} stroke="#fff" strokeWidth={isSelected ? 2 : 1} />
                {isSelected && (
                  <text y={-16} textAnchor="middle" fontSize={16} fontWeight={700} fill="currentColor">
                    {city.name}
                  </text>
                )}
              </g>
            );
          })}
        </PakistanMap>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#115e59]" /> City
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#b45309]" /> Indicated new town
          </span>
          <span>Click a city or a province. New-town marks appear once a city is chosen. They are planning indications, not notified sites.</span>
        </p>
      </div>

      {!selected && (
        <div>
          <p className="text-sm text-muted-foreground">Or open a city that already has a study in the library.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FEATURED.map((id) => {
              const city = getEvidenceCity(id);
              if (!city) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => choose(city)}
                  className="rounded-full border bg-card px-3 py-1.5 text-sm font-semibold shadow-soft hover:border-primary"
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view && (
        <div data-demo="findings" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight">{view.city.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {province?.name}
                {segment ? ` · ${segment.shortTitle}` : ""}
                {" · "}
                {view.direct.length} city {view.direct.length === 1 ? "study" : "studies"}
              </p>
            </div>
            {segment && (
              <Link href={`/segments/${segment.slug}`} className="text-sm font-semibold text-primary hover:underline">
                Open Segment {segment.number}: {segment.shortTitle}
              </Link>
            )}
          </div>

          <Tabs defaultValue="problems">
            <TabsList className="h-auto flex-wrap justify-start">
              <TabsTrigger value="problems">Problems in the papers</TabsTrigger>
              <TabsTrigger value="solutions">Solutions in those papers</TabsTrigger>
              <TabsTrigger value="towns">Indicated new towns</TabsTrigger>
            </TabsList>
            <TabsContent value="problems" forceMount className="mt-4 flex flex-col gap-8 data-[state=inactive]:hidden">
              {view.direct.length === 0 && (
                <p className="rounded-2xl border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  No paper in this library studies {view.city.name} by name. Provincial and national assessments are
                  shown below, and they are labelled as such.
                </p>
              )}
              <FindingGroup title="Reported for this city" items={view.direct} />
              <FindingGroup
                title="Reported for the province"
                note="These figures cover the whole province. They are not a count for this city alone."
                items={view.provincial}
              />
              <FindingGroup
                title="Regional context"
                note="Shown because the source describes the wider region. It is not a measurement taken in this city."
                items={view.regional}
              />
              <FindingGroup title="National assessment" items={view.national} />
            </TabsContent>
            <TabsContent value="solutions" forceMount className="mt-4 data-[state=inactive]:hidden">
              {remedies.length === 0 ? (
                <p className="rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
                  The sources for {view.city.name} record damage or exposure. None of them states a remedy.
                </p>
              ) : (
                <div data-tones className="grid gap-4 lg:grid-cols-2">
                  {remedies.map((item) => {
                    const source = getSource(item.sourceId);
                    return (
                      <article key={item.id} className="card-pro flex h-full flex-col p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tone,#047857)]">
                          {SCOPE_LABEL[item.scope]}
                        </p>
                        <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{item.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{findingRemedies[item.id]}</p>
                        {source && (
                          <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-2">
                              {source.authors} ({source.year})
                            </a>
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="towns" forceMount className="mt-4 flex flex-col gap-4 data-[state=inactive]:hidden">
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Two sites are marked on the map beside {view.city.name}. Each one is placed off the hazard this portal
                already uses for that kind of ground: river channels, the Lai, a subsiding valley centre, an outburst
                fan, or the coastal setback. The house types are the DRIM models already suited to this segment.
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                {towns.map((town) => (
                  <article key={town.id} className="rounded-2xl border bg-card p-5 shadow-soft">
                    <h3 className="font-heading text-lg font-bold">{town.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{town.why}</p>
                    <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                      {town.rules.map((rule) => (
                        <li key={rule} className="flex gap-2">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                    {town.models.length > 0 && (
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        Suited models: {town.models.join(" · ")}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
