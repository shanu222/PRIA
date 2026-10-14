import type { Metadata } from "next";
import { Droplet } from "lucide-react";
import { getPage, needs } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/pria/Motion";
import { TopoPattern } from "@/components/pria/TopoPattern";

const page = getPage("needs");
export const metadata: Metadata = { title: page.title, description: page.description };

const waterNeeds = new Set(["water-recycling", "water-storage"]);

const NEED_PHOTOS: Record<string, string> = {
  "climate-exposure": "/segments/coastal.jpg",
  "social-imperatives": "/split/urban.jpg",
  "vertical-solutions": "/banners/outlook.jpg",
  "water-recycling": "/segments/riverine-plains.jpg",
  "water-storage": "/segments/mountain.jpg",
};

export default function NeedsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <div data-demo="needs">
      <Stagger className="grid gap-5 md:grid-cols-2">
        {needs.map((n, i) => {
          const water = waterNeeds.has(n.id);
          const wide = i === needs.length - 1;
          return (
            <StaggerItem key={n.id} className={cn(wide && "md:col-span-2")}>
              <article
                id={n.id}
                className={cn(
                  "card-pro card-pro-lift group relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl bg-card p-7 sm:p-8",
                )}
                style={water ? ({ "--tone": "#0e7490", "--tone-2": "#2563eb" } as React.CSSProperties) : undefined}
              >
                {NEED_PHOTOS[n.id] && (
                  <img
                    src={NEED_PHOTOS[n.id]}
                    alt=""
                    className="pointer-events-none absolute inset-y-0 right-0 h-full w-[46%] object-cover opacity-35 transition-transform duration-700 group-hover:scale-105"
                    style={{ maskImage: "linear-gradient(to right, transparent, #000 45%)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 45%)" }}
                  />
                )}
                <TopoPattern
                  className={cn(
                    "opacity-0 transition-opacity duration-500 group-hover:opacity-[0.1]",
                    water ? "text-water" : "text-[hsl(var(--topo-stroke))]",
                  )}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "tone-icon flex h-14 w-14 items-center justify-center rounded-2xl",
                    )}
                  >
                    <Icon name={n.icon} className="h-7 w-7" />
                  </span>
                  <span
                    className="font-heading text-4xl font-extrabold uppercase text-muted-foreground/30"
                    aria-hidden="true"
                  >
                    {n.code}
                  </span>
                </div>
                <h2 className="relative mt-6 text-balance text-xl font-bold leading-snug sm:text-2xl">
                  <span className="sr-only">{n.code}. </span>
                  {n.title}
                </h2>
                {n.chips && (
                  <ul className="relative mt-6 flex flex-wrap gap-2" aria-label="Water storage options">
                    {n.chips.map((chip) => (
                      <li
                        key={chip}
                        className="inline-flex items-center gap-1.5 rounded-full border border-water/25 bg-cyan-50 px-3.5 py-1.5 text-sm font-medium text-water dark:bg-cyan-500/10"
                      >
                        <Droplet className="h-3.5 w-3.5" aria-hidden />
                        {chip}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
      </div>
    </div>
  );
}
