import type { Metadata } from "next";
import { Building2, Building, House, Info, TrendingUp, Users } from "lucide-react";
import { getPage, type Stat } from "@/data/pria";
import {
  buildCapacityScenario as scenario,
  fastestDistricts,
  housingSeries,
  outlookHeadlines as h,
  outlookSources as src,
  provinceOutlook,
  urbanRural as ur,
} from "@/data/outlook";
import { PageHeader, SectionHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/pria/DataTable";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { BuildingsHousingChart, CoverageChart, DistrictChart, PopulationChart } from "@/components/pria/OutlookCharts";
import { ProvinceOutlookMap } from "@/components/pria/ProvinceOutlookMap";
import { StatTile } from "@/components/pria/StatTile";

const page = getPage("outlook");
export const metadata: Metadata = { title: page.title, description: page.description };

const headline: Stat[] = [
  { id: "pop", label: "Population 2047", value: 386, suffix: " Mn", note: "From 255 Mn in 2026", status: "available" },
  { id: "buildings", label: "Buildings 2047", value: 75.3, decimals: 2, suffix: " Mn", note: `+${h.buildingIncreasePct}% on 2026`, status: "available" },
  { id: "units", label: "Residential units required 2047", value: 60.56, decimals: 2, suffix: " Mn", note: "+20.37 Mn since 2026", status: "available" },
  { id: "urban", label: "Urban share 2047", value: ur.urbanShare2047, decimals: 2, suffix: "%", note: `${ur.y2023.urbanShare}% in 2023`, status: "available" },
  { id: "coverage", label: "Built-up area 2047", value: 1.538, decimals: 3, suffix: "%", note: `×${h.coverageMultiple2047} of 2020 coverage`, status: "available" },
];

const fmt = (n: number) => n.toLocaleString("en-US");
const mn2 = (n: number) => `${(n / 1_000_000).toFixed(2)} Mn`;

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border-2 bg-card p-5 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-lift sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function Source({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[11px] text-muted-foreground">Source: {children}.</p>;
}

function Fact({ icon: I, value, label }: { icon: typeof Users; value: string; label: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border-2 bg-muted/30 p-4 transition-colors hover:border-primary/40 hover:bg-primary-tint/50">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <I className="h-4 w-4" aria-hidden />
      </span>
      <span>
        <span className="block font-heading text-xl font-bold">{value}</span>
        <span className="block text-sm text-muted-foreground">{label}</span>
      </span>
    </li>
  );
}

export default function OutlookPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <section aria-label="Headline figures">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {headline.map((s, i) => (
            <StaggerItem key={s.id} className={i === headline.length - 1 ? "col-span-2 md:col-span-1" : undefined}>
              <StatTile stat={s} emphasis={i === 0} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-labelledby="population">
        <SectionHeader
          id="population"
          eyebrow="Population"
          title="Growing about 2% a year to 386 million"
          description="National population, GHSL live-map series. 2020 is a raw GHSL estimate; the data has no values for 2021–2025."
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Reveal>
            <Panel>
              <PopulationChart />
              <Source>{src.ghsl}</Source>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="grid h-full gap-3">
              <Fact icon={TrendingUp} value={`${h.popCagr2026to2047}% / yr`} label="Compound growth 2026→2047" />
              <Fact icon={Users} value="+131 Mn" label="More people by 2047 than in 2026 (255 → 386 Mn)" />
              <Fact icon={TrendingUp} value={`${h.popCagr2020to2047}% / yr`} label="Compound growth 2020→2047 (234.99 → 386 Mn)" />
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="provinces" className="scroll-mt-24">
        <SectionHeader
          id="provinces"
          eyebrow="By province"
          title="Where growth and building will concentrate"
          description="Choose a measure, then hover or select a province. Punjab and Sindh hold about 78% of the population in both 2026 and 2047."
        />
        <Reveal>
          <ProvinceOutlookMap />
        </Reveal>
        <Reveal className="mt-6">
          <DataTable
            title="Provincial outlook, 2026 and 2047"
            caption="Population (GHSL), share of national population, building count and built-up coverage of land area."
            source={`${src.ghsl}; ${src.buildingsProvince}`}
            columns={[
              { id: "name", label: "Province / region" },
              { id: "p26", label: "Pop. 2026", numeric: true },
              { id: "p47", label: "Pop. 2047", numeric: true },
              { id: "s47", label: "Share 2047", numeric: true },
              { id: "b26", label: "Buildings 2026", numeric: true },
              { id: "b47", label: "Buildings 2047", numeric: true },
              { id: "c26", label: "Built-up 2026", numeric: true },
              { id: "c47", label: "Built-up 2047", numeric: true },
              { id: "cg", label: "Built-up growth", numeric: true },
            ]}
            rows={provinceOutlook.map((p) => ({
              name: p.name,
              p26: `${p.pop2026.toFixed(2)} Mn`,
              p47: `${p.pop2047.toFixed(2)} Mn`,
              s47: `${p.share2047}%`,
              b26: fmt(p.buildings2026),
              b47: fmt(p.buildings2047),
              c26: `${p.coverage2026}%`,
              c47: `${p.coverage2047}%`,
              cg: `${p.coverageGrowth}% / yr`,
            }))}
          />
        </Reveal>
      </section>

      <section aria-labelledby="housing">
        <SectionHeader
          id="housing"
          eyebrow="Buildings & housing"
          title="Building stock nearly doubles by 2047"
          description={`Buildings grow a steady ${h.buildingGrowth}% a year. Residential units required are population ÷ 6.5 persons per unit.`}
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Reveal>
            <Panel>
              <BuildingsHousingChart />
              <Source>
                {src.buildingsNational}; {src.reference}
              </Source>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <DataTable
              title="Residential units required"
              source={src.reference}
              highlightLast
              columns={[
                { id: "year", label: "Year" },
                { id: "units", label: "Units required", numeric: true },
                { id: "add", label: "Additional since 2026", numeric: true },
              ]}
              rows={housingSeries.map((r) => ({
                year: String(r.year),
                units: fmt(r.units),
                add: r.additional ? `+${fmt(r.additional)}` : "Base year",
              }))}
            />
          </Reveal>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          <Fact icon={Building2} value={`${h.buildingsInclAjkGb2026} → ${h.buildingsInclAjkGb2047} Mn`} label="Buildings incl. AJK & GB, 2026 → 2047" />
          <Fact icon={House} value="≈ 0.97 Mn / yr" label="Average additional residential units needed, 2026–2047" />
          <Fact icon={Building} value={mn2(2_159_913)} label="Buildings added in 2047 alone" />
        </ul>

        <Reveal className="mt-6">
          <div className="rounded-2xl border-2 border-dashed border-amber-500/60 bg-gradient-to-br from-amber-50 to-card p-5 dark:from-amber-500/10 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold">Build-capacity scenario</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
                <Info className="h-3.5 w-3.5" aria-hidden />
                Planning assumption, not portal data
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              If about {fmt(scenario.neededPerYear)} units are needed every year but only {fmt(scenario.builtPerYear)} are built, the{" "}
              {fmt(scenario.shortfallPerYear)}-unit annual gap compounds over the {scenario.years} years to 2047.
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Cumulative need", fmt(scenario.cumulativeNeed)],
                ["Cumulative delivery", fmt(scenario.cumulativeDelivery)],
                ["Backlog by 2047", fmt(scenario.cumulativeShortfall)],
              ].map(([k, v], i) => (
                <div key={k} className={`rounded-xl border-2 bg-card p-4 ${i === 2 ? "border-amber-500" : ""}`}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className={`mt-1 font-heading text-2xl font-bold ${i === 2 ? "text-amber-700 dark:text-amber-400" : ""}`}>{v} units</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="urban">
        <SectionHeader
          id="urban"
          eyebrow="Urbanisation"
          title="Urban population growing twice as fast as rural"
          description="Urban and rural population including Azad Kashmir; Gilgit-Baltistan has no split after 2017."
        />
        <Stagger className="grid gap-4 md:grid-cols-3">
          {[
            { year: "2017", d: ur.y2017 },
            { year: "2023", d: ur.y2023 },
          ].map(({ year, d }) => (
            <StaggerItem key={year}>
              <Panel className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{year}</p>
                <p className="mt-1 font-heading text-3xl font-bold">{d.urbanShare}% urban</p>
                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <span className="bg-[#0E7490]" style={{ width: `${d.urbanShare}%` }} />
                  <span className="flex-1 bg-[#0B5D3B]" />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Urban</dt>
                  <dd className="text-right font-semibold">{d.urban} Mn</dd>
                  <dt className="text-muted-foreground">Rural</dt>
                  <dd className="text-right font-semibold">{d.rural} Mn</dd>
                  <dt className="text-muted-foreground">Total (incl. AJK)</dt>
                  <dd className="text-right font-semibold">{d.total} Mn</dd>
                </dl>
              </Panel>
            </StaggerItem>
          ))}
          <StaggerItem>
            <Panel className="h-full border-primary/40 bg-gradient-to-br from-primary-tint to-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-accent-foreground">2047 projection</p>
              <p className="mt-1 font-heading text-3xl font-bold">{ur.urbanShare2047}% urban</p>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <span className="bg-[#0E7490]" style={{ width: `${ur.urbanShare2047}%` }} />
                <span className="flex-1 bg-[#0B5D3B]" />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Urban</dt>
                <dd className="text-right font-semibold">≈ {ur.urban2047} Mn</dd>
                <dt className="text-muted-foreground">Rural</dt>
                <dd className="text-right font-semibold">≈ {ur.rural2047} Mn</dd>
                <dt className="text-muted-foreground">Growth 2017→23</dt>
                <dd className="text-right font-semibold">
                  {ur.urbanCagr}% vs {ur.ruralCagr}%
                </dd>
              </dl>
            </Panel>
          </StaggerItem>
        </Stagger>
        <Source>
          {src.urbanRural}; {src.reference}
        </Source>
      </section>

      <section aria-labelledby="coverage">
        <SectionHeader
          id="coverage"
          eyebrow="Built-up coverage"
          title={`Built-up land more than doubles: ×${h.coverageMultiple2047} by 2047`}
          description={`Built footprint as a share of total land area, growing ${h.builtCagr2020to2047}% a year from 2020 to 2047.`}
        />
        <Reveal>
          <Panel>
            <CoverageChart />
            <Source>{src.ghsl}</Source>
          </Panel>
        </Reveal>
      </section>

      <section aria-labelledby="districts">
        <SectionHeader
          id="districts"
          eyebrow="Districts"
          title="The districts that will grow the most"
          description="Top 15 districts by 2047 population, and the fastest-growing large districts."
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Reveal>
            <Panel>
              <DistrictChart />
              <Source>{src.ghsl}</Source>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <Panel className="h-full">
              <h3 className="font-bold">Fastest-growing large districts</h3>
              <p className="text-sm text-muted-foreground">Population change 2026 → 2047</p>
              <ol className="mt-4 flex flex-col gap-2">
                {fastestDistricts.map((d, i) => (
                  <li key={d.name} className="group rounded-xl border-2 border-transparent p-2 transition-all hover:border-primary/40 hover:bg-primary-tint/50">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-tint font-heading text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground dark:text-accent-foreground">
                          {i + 1}
                        </span>
                        <span className="font-semibold">{d.name}</span>
                        <span className="text-xs text-muted-foreground">{d.province}</span>
                      </span>
                      <span className="font-heading font-bold tabular-nums text-primary dark:text-accent-foreground">+{d.growth}%</span>
                    </div>
                    <span className="mt-1.5 block h-1.5 rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-gradient-to-r from-[#0E7490] to-[#0B5D3B]" style={{ width: `${(d.growth / 110.6) * 100}%` }} />
                    </span>
                  </li>
                ))}
              </ol>
              <Source>{src.ghsl}</Source>
            </Panel>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
