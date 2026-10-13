import Link from "next/link";
import { ArrowRight, ArrowUpRight, ListChecks } from "lucide-react";
import { getPage, home, observations, site } from "@/data/pria";
import { disasterTimeline } from "@/data/hazards";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { SegmentExplorer } from "@/components/pria/SegmentExplorer";
import { StatTile } from "@/components/pria/StatTile";
import { TopoPattern } from "@/components/pria/TopoPattern";
import { LogoEmblem } from "@/components/layout/Logo";
import { DrimCard } from "@/components/pria/DrimCard";
import { drimModels } from "@/data/drim";

export default function HomePage() {
  const { hero, stats, glanceLinks, roadmap } = home;
  const { from, to } = observations.trajectory;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 sm:gap-20">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[1.7rem] p-[3px] shadow-[0_24px_60px_-28px_rgba(13,148,136,0.65)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_90deg,#99f6e4,#2dd4bf,#fbbf24,#22d3ee,#5eead4,#99f6e4)] motion-safe:animate-[spin_8s_linear_infinite]"
        />
        <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-[#042f2e] px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-14">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_0%,#0f766e_0%,transparent_52%),radial-gradient(80%_80%_at_0%_100%,#115e59_0%,transparent_58%),linear-gradient(145deg,#042f2e_0%,#0f766e_55%,#134e4a_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl motion-safe:animate-glow-pulse"
        />
        <TopoPattern className="-z-10 text-white opacity-[0.14]" />
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <LogoEmblem className="mb-6 h-16 w-16 lg:hidden" />
            <Reveal>
              <p className="relative inline-flex overflow-hidden rounded-full p-[2px] shadow-[0_8px_18px_-8px_rgba(217,119,6,0.85)]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_90deg,#fde68a,#f97316,#fef3c7,#fbbf24,#fde68a)] motion-safe:animate-[spin_3.5s_linear_infinite]"
                />
                <span className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#fde68a] via-[#fbbf24] to-[#d97706] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#431407] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_3px_0_#b45309]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b45309] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" aria-hidden />
                  {hero.eyebrow}
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">{hero.subtitle}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="onDark">
                  <Link href={hero.primaryCta.href}>
                    {hero.primaryCta.label}
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outlineOnDark">
                  <Link href={hero.secondaryCta.href}>
                    <ListChecks />
                    {hero.secondaryCta.label}
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="hidden lg:block">
            <div className="relative mx-auto aspect-square w-full max-w-[340px]" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={
                    i % 2 === 0
                      ? "absolute rounded-full border border-dashed border-teal-100/35 motion-safe:animate-[spin_28s_linear_infinite]"
                      : "absolute rounded-full border border-dashed border-amber-200/30 motion-safe:animate-[spin_36s_linear_infinite_reverse]"
                  }
                  style={{ inset: `${i * 12}%` }}
                />
              ))}
              <LogoEmblem className="absolute inset-[30%]" />
              <span className="absolute left-1/2 top-[6%] -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-center text-xs font-bold ring-1 ring-white/25 backdrop-blur">
                {to.year} · {site.vision}
              </span>
              <span className="absolute left-[6%] top-[46%] rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
                {from.year}
              </span>
              <span className="absolute bottom-[8%] right-[2%] max-w-[9rem] rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#115e59] shadow-lg">
                {to.label}
              </span>
            </div>
          </Reveal>
        </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Key figures" className="-mt-8 sm:-mt-10">
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat, i) => (
            <StaggerItem key={stat.id} className={i === stats.length - 1 ? "col-span-2 md:col-span-1" : undefined}>
              <StatTile stat={stat} emphasis={i < 2} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* At a glance */}
      <section aria-labelledby="glance-title">
        <SectionHeader
          id="glance-title"
          eyebrow="Explore"
          title="PRIA at a glance"
          description="Navigate the concept from national context to the desired end state."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {glanceLinks.map((link) => {
            const page = getPage(link.pageId);
            return (
              <StaggerItem key={link.pageId}>
                <Link
                  href={page.href}
                  className="card-pro card-pro-lift group flex h-full flex-col rounded-xl bg-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <span className="tone-icon flex h-11 w-11 items-center justify-center rounded-xl">
                      <Icon name={page.icon} className="h-5 w-5" />
                    </span>
                    <ArrowUpRight
                      className="tone-text h-5 w-5 opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                  <p className="tone-text mt-5 text-[11px] font-semibold uppercase tracking-wider">
                    {page.eyebrow}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{link.title ?? page.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{link.description ?? page.description}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Segments preview */}
      <section aria-labelledby="segments-title">
        <SectionHeader
          id="segments-title"
          eyebrow="Regional Segments"
          title="Four resilience segments, north to south"
          description="Hover a zone to highlight its segment; select it to open the segment."
          action={
            <Button asChild variant="outline">
              <Link href="/segments">
                All segments
                <ArrowRight />
              </Link>
            </Button>
          }
        />
        <Reveal>
          <SegmentExplorer />
        </Reveal>
      </section>

      {/* DRIM */}
      <section aria-labelledby="drim-title">
        <SectionHeader
          id="drim-title"
          eyebrow="Resilient models"
          title="NDMA's disaster resilient house models"
          description={`${drimModels.length} full-scale models for earthquakes, floods, landslides and extreme heat and cold, each matched to the provinces it suits.`}
          action={
            <Button asChild variant="outline">
              <Link href="/drim">
                Explore all models
                <ArrowRight />
              </Link>
            </Button>
          }
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["loh-kaat-timber-house-structure", "elevated-flood-resilient-house-structure", "floating-amphibious-structure", "geogrid-reinforced-retaining-wall-structure"].map((slug) => {
            const model = drimModels.find((m) => m.slug === slug)!;
            return (
              <StaggerItem key={slug}>
                <DrimCard model={model} />
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Disasters */}
      <section aria-labelledby="disasters-title">
        <SectionHeader
          id="disasters-title"
          eyebrow="Why resilience"
          title="Lessons from recent disasters"
          description="Recorded losses that show what PRIA is designed to prevent."
          action={
            <Button asChild variant="outline">
              <Link href="/hazards">
                Hazards & disasters
                <ArrowRight />
              </Link>
            </Button>
          }
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {disasterTimeline.map((event) => {
            const lead = event.facts[0];
            return (
              <StaggerItem key={event.id}>
                <Link
                  href={`/hazards#${event.id}`}
                  className="card-pro card-pro-lift group flex h-full flex-col rounded-xl bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="tone-text font-heading text-2xl font-extrabold">{event.year}</span>
                    <span className="tone-icon flex h-9 w-9 items-center justify-center rounded-lg">
                      <Icon name={event.icon} className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug">{event.title}</h3>
                  {lead && (
                    <p className="mt-auto pt-4">
                      <span className="block font-heading text-xl font-bold">{lead.value}</span>
                      <span className="block text-xs text-muted-foreground">{lead.label}</span>
                    </p>
                  )}
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Roadmap */}
      <section aria-labelledby="roadmap-title">
        <SectionHeader
          id="roadmap-title"
          eyebrow="Document roadmap"
          title="How PRIA is structured"
          description="Follow the concept in the order it is presented."
        />
        <Reveal>
          <ol data-tones="" className="relative grid gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
            <span
              aria-hidden="true"
              className="absolute left-[8.33%] right-[8.33%] top-6 hidden h-1 rounded-full bg-gradient-to-r from-[#047857] via-[#4338ca] to-[#be123c] opacity-60 lg:block"
            />
            {roadmap.map((step, i) => (
              <li key={step.id} className="relative">
                <Link
                  href={step.href}
                  className="group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lift lg:flex-col lg:border-0 lg:bg-transparent lg:p-2 lg:text-center lg:shadow-none lg:hover:shadow-none"
                >
                  <span className="tone-icon relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--tone)] bg-card font-heading text-base font-bold shadow-soft">
                    {i + 1}
                  </span>
                  <span className="font-heading text-sm font-semibold transition-colors group-hover:text-[var(--tone)]">
                    {step.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
    </div>
  );
}
