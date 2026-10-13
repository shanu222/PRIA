"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { getProvince } from "@/data/census";
import {
  evidenceFor,
  getEvidenceCity,
  getSource,
  matchCities,
  type CityFinding,
  type CityRecord,
  type EvidenceScope,
} from "@/data/city-evidence";
import { getSegment } from "@/data/pria";
import { cn } from "@/lib/utils";

const FEATURED = ["karachi", "lahore", "peshawar", "quetta", "islamabad", "gupis"];

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

  const choose = (city: CityRecord) => {
    setQuery(city.name);
    setOpen(false);
    router.replace(`/cities?city=${city.id}`, { scroll: false });
  };

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
        <div className="flex flex-col gap-8">
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

          {view.direct.length === 0 && (
            <p className={cn("rounded-2xl border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground")}>
              No paper in this library studies {view.city.name} by name. Provincial and national assessments are shown
              below, and they are labelled as such.
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
        </div>
      )}
    </div>
  );
}
