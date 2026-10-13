import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPage, segments } from "@/data/pria";
import { disasterTimeline } from "@/data/hazards";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeader } from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { HazardProfile } from "@/components/pria/HazardProfile";
import { segmentStyle } from "@/components/pria/SegmentCard";

const page = getPage("hazards");
export const metadata: Metadata = { title: page.title, description: page.description };

export default function HazardsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <section data-demo="timeline" aria-labelledby="timeline">
        <SectionHeader
          id="timeline"
          eyebrow="Recorded disasters"
          title="Two decades of disasters that shaped PRIA"
          description="Each event exposed a different weakness in how and where Pakistan builds."
        />
        <ol data-tones="" className="relative flex flex-col gap-5 border-l-2 border-dashed border-primary/30 pl-6 sm:pl-10">
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
      </section>

      <section data-demo="profiles" aria-labelledby="profiles">
        <SectionHeader
          id="profiles"
          eyebrow="By regional segment"
          title="Hazard profile of each segment"
          description="The hazards each segment's recommendations are designed against."
        />
        <Stagger className="grid gap-5 lg:grid-cols-2">
          {segments.map((s) => (
            <StaggerItem key={s.id}>
              <div style={segmentStyle(s)} className="h-full">
                <HazardProfile segment={s} withLink />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal>
        <div data-demo="vulnerable" className="flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-primary/25 bg-gradient-to-r from-primary-tint to-card p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Where housing is most vulnerable</h2>
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
    </div>
  );
}
