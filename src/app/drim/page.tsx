import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { provinces } from "@/data/census";
import { drimHazards, drimModels, drimSource, drimSystems, modelsForProvince } from "@/data/drim";
import { getPage } from "@/data/pria";
import { PageHeader, SectionHeader } from "@/components/layout/PageHeader";
import { DrimExplorer } from "@/components/pria/DrimExplorer";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { StatTile } from "@/components/pria/StatTile";

const page = getPage("drim");
export const metadata: Metadata = { title: page.title, description: page.description };

const stats = [
  { id: "models", label: "Resilient house models", value: drimModels.length, status: "available" as const },
  { id: "regions", label: "Provinces & regions covered", value: provinces.length, status: "available" as const },
  { id: "hazards", label: "Hazard types addressed", value: Object.keys(drimHazards).length, status: "available" as const },
  { id: "systems", label: "Construction systems", value: Object.keys(drimSystems).length, status: "available" as const },
];

export default function DrimPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <section aria-label="DRIM at a glance">
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StaggerItem key={s.id}>
              <StatTile stat={s} emphasis={i === 0} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-labelledby="explore">
        <SectionHeader
          id="explore"
          eyebrow="Explore the models"
          title="Find the right model for a region"
          description="Filter by province, segment, hazard or construction system. Open any model for its photo, display board and PDF."
        />
        <Suspense fallback={<div className="h-[640px] animate-pulse rounded-2xl border-2 bg-muted/40" />}>
          <DrimExplorer />
        </Suspense>
      </section>

      <section aria-labelledby="by-province">
        <SectionHeader
          id="by-province"
          eyebrow="By province"
          title="Models suited to each province and region"
          description="Based on the suitable regions listed on each NDMA model board."
        />
        <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {provinces.map((p) => {
            const models = modelsForProvince(p.id);
            return (
              <StaggerItem key={p.id}>
                <article className="flex h-full flex-col rounded-2xl border-2 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="flex items-center gap-2 font-heading text-lg font-bold">
                      <MapPin className="h-4 w-4 text-primary dark:text-accent-foreground" aria-hidden />
                      {p.name}
                    </h3>
                    <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-bold text-primary dark:text-accent-foreground">
                      {models.length} models
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-col gap-1">
                    {models.map((m) => (
                      <li key={m.slug}>
                        <Link
                          href={`/drim/${m.slug}`}
                          className="group -mx-2 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-primary-tint hover:text-primary dark:hover:text-accent-foreground"
                        >
                          <span>{m.title}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/drim?province=${p.id}#explore`}
                    className="mt-auto pt-4 text-xs font-semibold text-primary hover:underline dark:text-accent-foreground"
                  >
                    Show on map
                  </Link>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <Reveal>
        <p className="text-xs text-muted-foreground">Source: {drimSource}.</p>
      </Reveal>
    </div>
  );
}
