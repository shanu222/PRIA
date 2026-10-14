import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { challenges, getPage, observations, resourceObservations, segments, site } from "@/data/pria";
import { getPriaContent } from "@/data/content";
import { disasterTimeline } from "@/data/hazards";
import { buildingSeries, housingSeries, populationSeries } from "@/data/outlook";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeader } from "@/components/layout/PageHeader";
import { HazardProfile } from "@/components/pria/HazardProfile";
import { InsightCard } from "@/components/pria/InsightCard";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { ProvinceTable } from "@/components/pria/ProvinceTable";
import { segmentStyle } from "@/components/pria/SegmentCard";
import { TopoPattern } from "@/components/pria/TopoPattern";

const page = getPage("situation");
export const metadata: Metadata = { title: page.title, description: page.description };

const sections = [
  { id: "observations", label: "Growth patterns", icon: "Eye" },
  { id: "challenges", label: "Pressures to 2047", icon: "TriangleAlert" },
  { id: "hazards", label: "Hazards & disasters", icon: "Activity" },
  { id: "capacity", label: "Capacity gaps", icon: "HardHat" },
];

const at = <T extends { year: number }>(series: T[], year: number) => series.find((s) => s.year === year)!;

const FROM = 2026;
const TO = 2047;

const horizon = [
  {
    id: "population",
    label: "Population",
    from: at(populationSeries, FROM).pop,
    to: at(populationSeries, TO).pop,
    decimals: 0,
    source: "GHSL population series",
  },
  {
    id: "buildings",
    label: "Buildings",
    from: at(buildingSeries, FROM).buildings / 1_000_000,
    to: at(buildingSeries, TO).buildings / 1_000_000,
    decimals: 1,
    source: "Open Buildings model",
  },
];

const additionalUnits = (at(housingSeries, TO).additional ?? 0) / 1_000_000;

const timelineValues = new Set(disasterTimeline.flatMap((e) => e.facts.map((f) => f.value)));

const eyebrow = (index: number, text: string) => `${String(index).padStart(2, "0")} · ${text}`;

export default async function SituationPage() {
  const { projectedTable } = await getPriaContent();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon}>
        <nav aria-label="On this page" className="mt-7">
          <ol className="flex flex-wrap gap-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary dark:hover:text-accent-foreground"
                >
                  <span className="font-heading text-xs font-bold tabular-nums text-primary dark:text-accent-foreground">
                    0{i + 1}
                  </span>
                  <Icon name={s.icon} className="h-3.5 w-3.5 text-muted-foreground" />
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHeader>

      <section data-demo="observations" aria-labelledby="observations" className="scroll-mt-24">
        <SectionHeader
          id="observations"
          eyebrow={eyebrow(1, "Observations")}
          title="How Pakistan has grown"
          description="The pattern of building and land use that the rest of the atlas responds to."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {observations.items.map((o) => (
            <StaggerItem key={o.id}>
              <InsightCard id={o.id} code={o.code} title={o.title} icon={o.icon} image={o.image} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-labelledby="challenges" className="scroll-mt-24">
        <SectionHeader
          id="challenges"
          eyebrow={eyebrow(2, "Challenges")}
          title="Pressures on the next two decades"
          description={`What the country has to accommodate between ${FROM} and ${TO}, and the pressures that make it harder.`}
        />
        <div className="flex flex-col gap-4">
          <Reveal>
            <article
              data-demo="horizon"
              id="horizon-2047"
              className="relative scroll-mt-24 overflow-hidden rounded-2xl bg-gradient-to-br from-[#063521] to-[#0B5D3B] p-7 text-white shadow-lift sm:p-9"
            >
              <TopoPattern className="text-white opacity-[0.14]" />
              <div className="relative flex flex-col gap-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                      <Icon name="TrendingUp" className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-bold">
                      {FROM} → {TO}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                    {TO - FROM} years · {site.vision}
                  </span>
                </div>
                <dl className="grid gap-4 md:grid-cols-3">
                  {horizon.map((h) => (
                    <div key={h.id} className="rounded-xl bg-white/[0.07] p-5 ring-1 ring-white/15">
                      <dt className="text-sm text-white/75">{h.label}</dt>
                      <dd className="mt-2">
                        <span className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                          <CountUp value={h.to} decimals={h.decimals} suffix=" Mn" />
                        </span>
                        <span className="mt-1 block text-sm text-white/80">
                          by {TO}, from {h.from.toFixed(h.decimals)} Mn in {FROM}
                        </span>
                        <span className="mt-3 block text-[10px] font-medium uppercase tracking-wider text-white/60">
                          {h.source}
                        </span>
                      </dd>
                    </div>
                  ))}
                  <div className="rounded-xl bg-white/[0.07] p-5 ring-1 ring-white/15">
                    <dt className="text-sm text-white/75">Additional homes required</dt>
                    <dd className="mt-2">
                      <span className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp value={additionalUnits} decimals={1} suffix=" Mn" />
                      </span>
                      <span className="mt-1 block text-sm text-white/80">residential units over {FROM} levels</span>
                      <span className="mt-3 block text-[10px] font-medium uppercase tracking-wider text-white/60">
                        Population ÷ 6.5 persons per unit
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          </Reveal>
          <div data-demo="pressures">
            <Stagger className="grid gap-4 sm:grid-cols-3">
              {challenges.items.map((c) => (
                <StaggerItem key={c.id}>
                  <InsightCard id={c.id} title={c.title} icon={c.icon} tone="water" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div data-demo="outlook" className="mt-6">
            <h3 id={projectedTable.id} className="mb-4 scroll-mt-24 text-lg font-bold">
              {projectedTable.title}
            </h3>
            <Reveal>
              <ProvinceTable table={projectedTable} />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="hazards" className="scroll-mt-24">
        <SectionHeader
          id="hazards"
          eyebrow={eyebrow(3, "Hazards & Disasters")}
          title="Two decades of disasters that shaped PRIA"
          description="Each event exposed a different weakness in how and where Pakistan builds."
        />
        <ol
          data-demo="timeline"
          data-tones=""
          className="relative flex flex-col gap-5 border-l-2 border-dashed border-primary/30 pl-6 sm:pl-10"
        >
          {disasterTimeline.map((event) => (
            <li key={event.id} id={event.id} className="relative scroll-mt-24">
              <span
                aria-hidden="true"
                className="absolute -left-[38px] top-6 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--tone)] to-[var(--tone-2)] text-white shadow-[0_6px_14px_-6px_var(--tone)] ring-4 ring-background sm:-left-[54px]"
              >
                <Icon name={event.icon} className="h-3.5 w-3.5" />
              </span>
              <Reveal>
                <article className="card-pro group rounded-2xl bg-card p-6">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="tone-text font-heading text-3xl font-extrabold">{event.year}</span>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">{event.summary}</p>
                  <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {event.facts.map((f) => (
                      <div
                        key={f.label}
                        className="rounded-xl border-2 border-[color-mix(in_srgb,var(--tone)_22%,transparent)] bg-[color-mix(in_srgb,var(--tone)_6%,hsl(var(--card)))] p-4 transition-colors hover:border-[var(--tone)]"
                      >
                        <dt className="sr-only">{f.label}</dt>
                        <dd>
                          <span className="tone-text block font-heading text-2xl font-bold">{f.value}</span>
                          <span className="mt-0.5 block text-sm text-muted-foreground">{f.label}</span>
                          <span className="mt-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                            {f.source}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        <div data-demo="profiles" className="mt-12">
          <h3 id="profiles" className="scroll-mt-24 text-lg font-bold">
            Hazard profile of each segment
          </h3>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">
            The hazards each segment&apos;s recommendations are designed against.
          </p>
          <Stagger className="grid gap-5 lg:grid-cols-2">
            {segments.map((s) => (
              <StaggerItem key={s.id}>
                <div style={segmentStyle(s)} className="h-full">
                  <HazardProfile segment={s} withLink omitValues={timelineValues} />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal>
          <div
            data-demo="vulnerable"
            className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-primary/25 bg-gradient-to-r from-primary-tint to-card p-6 sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="text-lg font-bold">Where housing is most vulnerable</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Compare pacca and kacha housing, density and urban share by province on the interactive map.
              </p>
            </div>
            <Button asChild>
              <Link href="/landscape#province-map">
                Open the map
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      <section data-demo="gaps" aria-labelledby="capacity" className="scroll-mt-24">
        <SectionHeader
          id="capacity"
          eyebrow={eyebrow(4, "Resource Observations")}
          title="Capacity gaps in how Pakistan builds"
          description="Design, skills, materials and controls that decide whether a sound recommendation survives on site."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceObservations.map((r, i) => (
            <StaggerItem key={r.id}>
              <InsightCard id={r.id} code={String(i + 1)} title={r.title} icon={r.icon} tone="warning" />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
