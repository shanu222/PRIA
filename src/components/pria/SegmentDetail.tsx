import Link from "next/link";
import { ArrowUpRight, ChevronRight, Layers, MapPin } from "lucide-react";
import { categoryStatus, segments, type InfraCategory, type Segment } from "@/data/pria";
import { segmentProvinces } from "@/data/census";
import { MAP_VIEWBOX, kashmirShape, provinceShapes } from "@/data/pakistan-geo";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { CategoryTabs } from "./CategoryTabs";
import { DrimStrip } from "./DrimStrip";
import { HazardProfile } from "./HazardProfile";
import { Reveal } from "./Motion";
import { segmentStyle } from "./SegmentCard";
import { StatusBadge } from "./StatusBadge";
import { SubSectionPanel } from "./SubSectionPanel";
import { TopoPattern } from "./TopoPattern";

const HERO_IMAGE_FADE = "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 22%, #000 45%)";

function SegmentMiniMap({ segment, className }: { segment: Segment; className?: string }) {
  const inSegment = new Set<string>(segmentProvinces[segment.id]);
  const glow = `drop-shadow(0 0 10px ${segment.color}) drop-shadow(0 0 22px color-mix(in srgb, ${segment.color} 60%, transparent))`;
  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      aria-hidden="true"
      className={cn("pointer-events-none w-auto", className)}
      style={{ aspectRatio: `${MAP_VIEWBOX.width} / ${MAP_VIEWBOX.height}` }}
    >
      <g fill="rgba(4,12,16,0.6)" stroke="rgba(255,255,255,0.45)" strokeWidth={2.5} strokeLinejoin="round">
        {provinceShapes.map((s) => (
          <path key={s.id} d={s.d} />
        ))}
        <path d={kashmirShape.d} fillRule="evenodd" />
      </g>
      <g
        fill={segment.color}
        fillOpacity={0.55}
        stroke={`color-mix(in srgb, ${segment.color} 45%, white)`}
        strokeWidth={3}
        strokeLinejoin="round"
        style={{ filter: glow }}
        className="motion-safe:animate-soft-pulse"
      >
        {provinceShapes
          .filter((s) => inSegment.has(s.id))
          .map((s) => (
            <path key={s.id} d={s.d} />
          ))}
        {segment.id === "mountain" && <path d={kashmirShape.d} fillRule="evenodd" />}
      </g>
    </svg>
  );
}

function SegmentHero({ segment }: { segment: Segment }) {
  const light = `color-mix(in srgb, ${segment.color} 55%, white)`;
  return (
    <header
      data-demo="hero"
      className="group relative isolate min-h-[15rem] overflow-hidden rounded-2xl border text-white transition-shadow duration-500 sm:min-h-[16.5rem]"
      style={{
        borderColor: `color-mix(in srgb, ${segment.color} 70%, transparent)`,
        background: `linear-gradient(135deg, color-mix(in srgb, ${segment.colorStrong} 55%, #04121a) 0%, #06141b 60%)`,
        boxShadow: `0 0 0 1px color-mix(in srgb, ${segment.color} 30%, transparent), 0 0 34px -10px ${segment.color}, 0 24px 50px -28px ${segment.colorStrong}, inset 0 1px 0 rgba(255,255,255,0.14)`,
      }}
    >
      <img
        src={`/segments/${segment.slug}.jpg`}
        alt=""
        className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105 sm:w-[80%]"
        style={{ maskImage: HERO_IMAGE_FADE, WebkitMaskImage: HERO_IMAGE_FADE }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(90deg, color-mix(in srgb, ${segment.colorStrong} 45%, #04121a) 0%, color-mix(in srgb, ${segment.colorStrong} 25%, rgba(4,18,26,0.7)) 38%, transparent 62%), linear-gradient(270deg, rgba(4,14,20,0.78) 0%, rgba(4,14,20,0.45) 28%, transparent 45%)`,
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/35 sm:hidden" />
      <TopoPattern className="-z-10 text-white opacity-[0.12]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${light}, transparent)` }}
      />

      <SegmentMiniMap
        segment={segment}
        className="absolute right-24 top-1/2 -z-10 hidden h-[96%] -translate-y-1/2 opacity-95 transition-transform duration-700 group-hover:scale-[1.03] lg:block xl:right-28"
      />

      <div className="relative flex h-full min-h-[inherit] items-center justify-between gap-6 px-6 py-8 sm:px-10">
        <div className="max-w-2xl">
          <nav aria-label="Segment breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
              <li>
                <Link href="/segments" className="rounded hover:text-white hover:underline">
                  Regional Segments
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="font-bold" style={{ color: light }}>
                Segment {segment.number}
              </li>
            </ol>
          </nav>
          <h1
            className="mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
          >
            {segment.title}
          </h1>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Regions">
            {segment.regions.map((r) => (
              <li
                key={r}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  borderColor: `color-mix(in srgb, ${segment.color} 65%, transparent)`,
                  background: `color-mix(in srgb, ${segment.colorStrong} 40%, rgba(4,18,26,0.55))`,
                  boxShadow: `0 0 14px -4px ${segment.color}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                }}
              >
                <MapPin className="h-3.5 w-3.5" style={{ color: light }} aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <span
          className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center self-end rounded-2xl border backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1 sm:h-20 sm:w-20 sm:self-center"
          style={{
            borderColor: "rgba(255,255,255,0.3)",
            background: `color-mix(in srgb, ${segment.color} 30%, rgba(255,255,255,0.08))`,
            boxShadow: `0 0 24px -6px ${segment.color}, inset 0 1px 0 rgba(255,255,255,0.35)`,
          }}
        >
          <Icon name={segment.icon} className="h-8 w-8 sm:h-10 sm:w-10" />
        </span>
      </div>
    </header>
  );
}

function SegmentRail({
  segment,
  activeCategoryId,
  className,
}: {
  segment: Segment;
  activeCategoryId: string;
  className?: string;
}) {
  const others = segments.filter((s) => s.id !== segment.id);
  return (
    <aside aria-label="In this segment" className={cn("flex flex-col gap-4", className)}>
      <div className="card-pro rounded-xl bg-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">In this segment</h2>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Regions</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {segment.regions.map((r) => (
            <li key={r} className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 seg-text" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {segment.categories.length} Categories
        </p>
        <ul className="mt-2 flex flex-col gap-0.5">
          {segment.categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/segments/${segment.slug}/${c.id}`}
                scroll={false}
                aria-current={c.id === activeCategoryId ? "page" : undefined}
                className={cn(
                  "-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                  c.id === activeCategoryId ? "font-semibold seg-text" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon name={c.icon} className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate">{c.shortTitle}</span>
                <span className="rounded bg-muted px-1.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {c.subSections.length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-pro rounded-xl bg-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Other segments</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {others.map((s) => (
            <li key={s.id}>
              <Link
                href={`/segments/${s.slug}`}
                style={segmentStyle(s)}
                className="group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all hover:border-[var(--seg)] hover:shadow-soft"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white"
                  style={{ background: s.colorStrong }}
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider seg-text">
                    Segment {s.number}
                  </span>
                  <span className="block truncate text-sm font-medium">{s.shortTitle}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[var(--seg)]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function SegmentDetail({ segment, category }: { segment: Segment; category: InfraCategory }) {
  const status = categoryStatus(category);
  return (
    <div style={segmentStyle(segment)} className="mx-auto flex max-w-7xl flex-col gap-6">
      <SegmentHero segment={segment} />
      <div data-demo="tabs">
        <CategoryTabs segment={segment} activeId={category.id} />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_280px]">
        <Reveal key={category.id} className="min-w-0">
          <div data-demo="content">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] seg-text">
                Infrastructure Category {category.number}
              </p>
              <h2 className="mt-1.5 text-2xl font-bold sm:text-[1.65rem]">{category.title}</h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" aria-hidden />
                {category.subSections.length} sub-sections
              </p>
            </div>
            <StatusBadge
              status={status}
              label={
                status === "pending"
                  ? "Recommendations pending"
                  : `${category.subSections.reduce((n, s) => n + s.items.length, 0)} recommendations`
              }
            />
          </div>
          <SubSectionPanel key={`${segment.id}-${category.id}`} segment={segment} category={category} />
          </div>
        </Reveal>
        <div className="hidden 2xl:block">
          <div className="sticky top-24">
            <SegmentRail segment={segment} activeCategoryId={category.id} />
          </div>
        </div>
      </div>

      <div className="2xl:hidden">
        <SegmentRail segment={segment} activeCategoryId={category.id} className="md:grid md:grid-cols-2 md:items-start" />
      </div>

      <section data-demo="hazards" aria-labelledby="segment-hazards" className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] seg-text">Why these recommendations</p>
        <h2 id="segment-hazards" className="mb-4 mt-1.5 text-2xl font-bold">
          Hazard profile
        </h2>
        <HazardProfile segment={segment} />
      </section>

      <section data-demo="models" aria-label="DRIM resilient house models" className="mt-4">
        <DrimStrip segment={segment} />
      </section>
    </div>
  );
}
