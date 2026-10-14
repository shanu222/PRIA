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
import { GLOW_ORDER, GlowStatTile } from "@/components/pria/GlowCard";

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

const TONES = {
  emerald: ["#047857", "#0d9488"],
  teal: ["#0e7490", "#2563eb"],
  indigo: ["#4338ca", "#7c3aed"],
  amber: ["#b45309", "#ea580c"],
} as const;

function Panel({
  children,
  className = "",
  tone,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: keyof typeof TONES;
}) {
  const style = tone ? ({ "--tone": TONES[tone][0], "--tone-2": TONES[tone][1] } as React.CSSProperties) : undefined;
  return (
    <div style={style} className={`card-pro group rounded-2xl bg-card p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function Source({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[11px] text-muted-foreground">Source: {children}.</p>;
}

const FACT_COLORS = {
  emerald: "#34d399",
  sky: "#38bdf8",
  violet: "#a78bfa",
  amber: "#fbbf24",
} as const;

function Fact({
  icon: I,
  value,
  label,
  note,
  color = "emerald",
}: {
  icon: typeof Users;
  value: string;
  label: string;
  note?: string;
  color?: keyof typeof FACT_COLORS;
}) {
  const c = FACT_COLORS[color];
  return (
    <li
      className="group flex h-full items-start gap-3 rounded-2xl border p-4 text-white transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        borderColor: `color-mix(in srgb, ${c} 55%, transparent)`,
        background: `radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, ${c} 22%, transparent), transparent 55%), linear-gradient(160deg, color-mix(in srgb, ${c} 16%, #071417), #071417)`,
        boxShadow: `0 0 22px -12px ${c}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ color: c, background: `color-mix(in srgb, ${c} 16%, transparent)`, boxShadow: `0 0 14px -4px ${c}` }}
      >
        <I className="h-4 w-4" aria-hidden />
      </span>
      <span>
        <span className="block font-heading text-xl font-bold" style={{ color: c, textShadow: `0 0 14px color-mix(in srgb, ${c} 50%, transparent)` }}>
          {value}
        </span>
        <span className="mt-0.5 block text-sm font-medium text-white/90">{label}</span>
        {note && <span className="mt-1 block text-xs leading-relaxed text-white/60">{note}</span>}
      </span>
    </li>
  );
}

function Band({
  id,
  eyebrow,
  title,
  highlight,
  description,
  image,
  accent = "#34d399",
}: {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  accent?: string;
}) {
  const at = title.indexOf(highlight);
  const before = at >= 0 ? title.slice(0, at) : title;
  const after = at >= 0 ? title.slice(at + highlight.length) : "";
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 px-1 py-1">
      <img
        src={image}
        alt=""
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[46%] object-cover opacity-80"
        style={{ maskImage: "linear-gradient(to right, transparent, #000 40%)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 40%)" }}
      />
      <div className="relative max-w-3xl px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
          {eyebrow}
        </p>
        <h2 id={id} className="mt-1.5 scroll-mt-24 text-2xl font-extrabold leading-tight sm:text-[1.85rem]">
          {before}
          {at >= 0 && (
            <span style={{ color: accent, textShadow: `0 0 18px color-mix(in srgb, ${accent} 55%, transparent)` }}>{highlight}</span>
          )}
          {after}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>
    </div>
  );
}

export default function OutlookPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <section data-demo="headlines" aria-label="Headline figures">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {headline.map((s, i) => (
            <StaggerItem key={s.id} className={i === headline.length - 1 ? "col-span-2 md:col-span-1" : undefined}>
              <GlowStatTile stat={s} color={GLOW_ORDER[i % GLOW_ORDER.length]} progress={28 + i * 12} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section data-demo="population" aria-labelledby="population">
        <Band
          id="population"
          eyebrow="Population"
          title="Growing about 2% a year to 386 million"
          highlight="386 million"
          accent="#22d3ee"
          image="/banners/outlook.jpg"
          description="National population, GHSL live-map series. 2020 is a raw GHSL estimate; the data has no values for 2021–2025."
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Reveal>
            <Panel tone="emerald">
              <PopulationChart />
              <Source>{src.ghsl}</Source>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <ul data-tones="" className="grid h-full gap-3">
              <Fact color="emerald" icon={TrendingUp} value={`${h.popCagr2026to2047}% / yr`} label="Compound growth 2026 → 2047" note="Population is projected to grow at an average of 1.99% annually." />
              <Fact color="sky" icon={Users} value="+131 Mn" label="More people by 2047 than in 2026" note="Population is expected to increase from 255 Mn in 2026 to 386 Mn in 2047." />
              <Fact color="violet" icon={TrendingUp} value={`${h.popCagr2020to2047}% / yr`} label="Compound growth 2020 → 2047" note="Long-term growth rate based on 2020 (234.99 Mn) to 2047 (386 Mn)." />
            </ul>
          </Reveal>
        </div>
      </section>

      <section data-demo="provinces" aria-labelledby="provinces" className="scroll-mt-24">
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

      <section data-demo="housing" aria-labelledby="housing">
        <Band
          id="housing"
          eyebrow="Buildings & housing"
          title="Building stock nearly doubles by 2047"
          highlight="2047"
          accent="#38bdf8"
          image="/banners/outlook.jpg"
          description={`Buildings grow a steady ${h.buildingGrowth}% a year. Residential units required are population ÷ 6.5 persons per unit.`}
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Reveal>
            <Panel tone="teal">
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
        <ul data-tones="" className="mt-6 grid gap-3 sm:grid-cols-3">
          <Fact color="emerald" icon={Building2} value={`+${h.buildingGrowth}% / yr`} label="Average building growth rate" />
          <Fact color="sky" icon={House} value="+20.37 Mn" label="Additional units needed by 2047 (vs 2026)" />
          <Fact color="violet" icon={Users} value="≈ 6.5 persons" label="Residential units required per unit" />
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
                ["Cumulative need", fmt(scenario.cumulativeNeed), "#047857", "#0d9488"],
                ["Cumulative delivery", fmt(scenario.cumulativeDelivery), "#0e7490", "#2563eb"],
                ["Backlog by 2047", fmt(scenario.cumulativeShortfall), "#b45309", "#dc2626"],
              ].map(([k, v, tone, tone2]) => (
                <div
                  key={k}
                  className="card-pro card-pro-lift rounded-xl bg-card p-4"
                  style={{ "--tone": tone, "--tone-2": tone2 } as React.CSSProperties}
                >
                  <dt className="tone-text text-xs font-semibold uppercase tracking-wider">{k}</dt>
                  <dd className="tone-gradient-text mt-1 font-heading text-2xl font-bold">{v} units</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      <section data-demo="urban" aria-labelledby="urban">
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
            <Panel tone="indigo" className="h-full">
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

      <section data-demo="coverage" aria-labelledby="coverage">
        <Band
          id="coverage"
          eyebrow="Built-up coverage"
          title={`Built-up land more than doubles: ×${h.coverageMultiple2047} by 2047`}
          highlight={`×${h.coverageMultiple2047} by 2047`}
          accent="#fbbf24"
          image="/banners/outlook.jpg"
          description={`Built footprint as a share of total land area, growing ${h.builtCagr2020to2047}% a year from 2020 to 2047.`}
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Reveal>
            <Panel tone="amber">
              <CoverageChart />
              <Source>{src.ghsl}</Source>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="grid h-full gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Fact color="amber" icon={TrendingUp} value={`${h.builtCagr2020to2047}% / yr`} label="Average annual growth rate" note="Built footprint, 2020 → 2047." />
              <Fact color="sky" icon={Building} value={`×${h.coverageMultiple2047}`} label="Increase in built-up land" note="From 2020 to 2047." />
              <Fact color="violet" icon={Building2} value="0.71% → 1.54%" label="Built-up land share" note="2020 versus 2047, from the GHSL series." />
              <Fact color="emerald" icon={House} value={`+${h.builtCagr2020to2047}% / yr`} label="Built footprint growth" note="As a share of total land area." />
            </ul>
          </Reveal>
        </div>
      </section>

      <section data-demo="districts" aria-labelledby="districts">
        <Band
          id="districts"
          eyebrow="Districts"
          title="The districts that will grow the most"
          highlight="grow the most"
          accent="#34d399"
          image="/segments/riverine-plains.jpg"
          description="Top 15 districts by 2047 population, and the fastest-growing large districts."
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Reveal>
            <Panel tone="indigo">
              <DistrictChart />
              <Source>{src.ghsl}</Source>
            </Panel>
          </Reveal>
          <Reveal delay={0.08}>
            <Panel tone="teal" className="h-full">
              <h3 className="font-bold">Fastest-growing large districts</h3>
              <p className="text-sm text-muted-foreground">Population change 2026 → 2047</p>
              <ol className="mt-4 flex flex-col gap-2">
                {fastestDistricts.map((d, i) => (
                  <li key={d.name} className="group rounded-xl border border-transparent p-2 transition-all hover:border-emerald-400/40 hover:bg-emerald-400/5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 font-heading text-xs font-bold text-[#04231d] shadow-[0_0_12px_-2px_#34d399]">
                          {i + 1}
                        </span>
                        <span className="font-semibold">{d.name}</span>
                        <span className="text-xs text-muted-foreground">{d.province}</span>
                      </span>
                      <span className="font-heading font-bold tabular-nums text-emerald-300">+{d.growth}%</span>
                    </div>
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
                      <span className="block h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 shadow-[0_0_10px_#34d399]" style={{ width: `${(d.growth / 110.6) * 100}%` }} />
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
