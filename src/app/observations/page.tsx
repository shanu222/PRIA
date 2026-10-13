import type { Metadata } from "next";
import { getPage, observations, site } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/pria/InsightCard";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { TopoPattern } from "@/components/pria/TopoPattern";

const page = getPage("observations");
export const metadata: Metadata = { title: page.title, description: page.description };

export default function ObservationsPage() {
  const t = observations.trajectory;
  const span = t.to.year - t.from.year;
  const ticks = Array.from({ length: span / 7 + 1 }, (_, i) => t.from.year + i * 7);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <div data-demo="cards">
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {observations.items.map((o) => (
          <StaggerItem key={o.id}>
            <InsightCard id={o.id} code={o.code} title={o.title} icon={o.icon} />
          </StaggerItem>
        ))}
      </Stagger>
      </div>

      <Reveal>
        <article
          data-demo="trajectory"
          id={t.id}
          className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary-tint via-card to-card p-6 shadow-soft sm:p-10"
        >
          <TopoPattern className="text-[hsl(var(--topo-stroke))] opacity-[0.12]" />
          <div className="relative flex flex-col gap-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Icon name={t.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-accent-foreground">
                    Observation {t.code}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{t.title}</h2>
                </div>
              </div>
              <span className="font-heading text-3xl font-extrabold text-primary/60 dark:text-accent-foreground/60" aria-hidden>
                0{t.code}
              </span>
            </div>

            <div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-heading text-3xl font-extrabold sm:text-4xl">{t.from.year}</p>
                  <p className="text-sm text-muted-foreground">{t.from.label}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-3xl font-extrabold text-primary dark:text-accent-foreground sm:text-4xl">
                    {t.to.year}
                  </p>
                  <p className="text-sm font-medium text-foreground">{t.to.label}</p>
                </div>
              </div>
              <div
                className="relative mt-5 h-3 rounded-full bg-muted"
                role="img"
                aria-label={`Timeline from ${t.from.year} to ${t.to.year}: ${span} years`}
              >
                <div className="absolute inset-y-0 left-0 w-full origin-left animate-in rounded-full bg-gradient-to-r from-water via-primary to-primary duration-1000 slide-in-from-left-full" />
                {ticks.map((year) => (
                  <span
                    key={year}
                    aria-hidden="true"
                    className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-card bg-primary shadow"
                    style={{ left: `${((year - t.from.year) / span) * 100}%` }}
                  />
                ))}
              </div>
              <div className="relative mt-3 hidden h-4 text-xs text-muted-foreground sm:block" aria-hidden="true">
                {ticks.map((year) => (
                  <span
                    key={year}
                    className="absolute -translate-x-1/2 tabular-nums first:translate-x-0 last:-translate-x-full"
                    style={{ left: `${((year - t.from.year) / span) * 100}%` }}
                  >
                    {year}
                  </span>
                ))}
              </div>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-semibold text-primary dark:text-accent-foreground">
                {span} years · {site.vision}
              </p>
            </div>
          </div>
        </article>
      </Reveal>
    </div>
  );
}
