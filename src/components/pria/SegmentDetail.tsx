import Link from "next/link";
import { ArrowUpRight, ChevronRight, Layers, MapPin } from "lucide-react";
import { categoryStatus, segments, type InfraCategory, type Segment } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { CategoryTabs } from "./CategoryTabs";
import { DrimStrip } from "./DrimStrip";
import { HazardProfile } from "./HazardProfile";
import { Reveal } from "./Motion";
import { segmentStyle } from "./SegmentCard";
import { SegmentMiniMap } from "./SegmentMiniMap";
import { categoryPhoto, segChip, segGlass } from "./segment-ui";
import { StatusBadge } from "./StatusBadge";
import { SubSectionPanel } from "./SubSectionPanel";
import { TopoPattern } from "./TopoPattern";

const HERO_IMAGE_FADE = "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 22%, #000 45%)";
const OTHER_SEGMENT_FADE = "linear-gradient(to right, transparent 0%, #000 55%)";
const CATEGORY_PHOTO_FADE =
  "linear-gradient(to right, transparent 0%, #000 35%), linear-gradient(to top, transparent 0%, #000 45%)";

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
      <div className={cn(segGlass, "relative overflow-hidden p-5")}>
        <SegmentMiniMap segment={segment} className="absolute -right-4 top-6 h-32 opacity-90" />
        <h2 className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
          <MapPin className="h-4 w-4 seg-text" aria-hidden />
          In this segment
        </h2>
        <p className="relative mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Regions</p>
        <ul className="relative mt-2 flex flex-col gap-2">
          {segment.regions.map((r) => (
            <li key={r} className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 shrink-0 seg-text drop-shadow-[0_0_6px_var(--seg)]" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
        <div className="relative my-4 h-px bg-gradient-to-r from-[color-mix(in_srgb,var(--seg)_45%,transparent)] to-transparent" />
        <p className="relative text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {segment.categories.length} Categories
        </p>
        <ul className="relative mt-2 flex flex-col gap-1">
          {segment.categories.map((c) => {
            const isActive = c.id === activeCategoryId;
            return (
              <li key={c.id}>
                <Link
                  href={`/segments/${segment.slug}/${c.id}`}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group -mx-2 flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-sm transition-all duration-200 hover:translate-x-0.5 hover:bg-[color-mix(in_srgb,var(--seg)_8%,transparent)]",
                    isActive
                      ? "border-[color-mix(in_srgb,var(--seg)_40%,transparent)] bg-[color-mix(in_srgb,var(--seg)_14%,transparent)] font-semibold seg-text shadow-[0_0_16px_-8px_var(--seg)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon name={c.icon} className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{c.shortTitle}</span>
                  <span
                    className={cn(
                      "min-w-6 rounded-md px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums",
                      isActive ? "bg-[var(--seg-strong)] text-white" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {c.subSections.length}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={cn(segGlass, "p-5")}>
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
          <Layers className="h-4 w-4 seg-text" aria-hidden />
          Other segments
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5">
          {others.map((s) => (
            <li key={s.id}>
              <Link
                href={`/segments/${s.slug}`}
                style={segmentStyle(s)}
                className="group relative isolate flex items-center gap-3 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--seg)_55%,transparent)] bg-[#06141b] px-3 py-2.5 text-white shadow-[0_0_18px_-8px_var(--seg)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--seg)] hover:shadow-[0_0_26px_-6px_var(--seg)]"
              >
                <img
                  src={`/segments/${s.slug}.jpg`}
                  alt=""
                  loading="lazy"
                  className="absolute inset-y-0 right-0 -z-10 h-full w-[75%] object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ maskImage: OTHER_SEGMENT_FADE, WebkitMaskImage: OTHER_SEGMENT_FADE }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-[color-mix(in_srgb,var(--seg-strong)_45%,#06141b)] via-[color-mix(in_srgb,var(--seg-strong)_20%,rgba(6,20,27,0.6))] to-transparent"
                />
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", segChip)}>
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_srgb,var(--seg)_60%,white)]">
                    Segment {s.number}
                  </span>
                  <span className="block truncate text-sm font-semibold drop-shadow">{s.shortTitle}</span>
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/25 bg-black/35 backdrop-blur transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
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
          <div className="group/cat relative isolate mb-5 overflow-hidden rounded-2xl">
            <img
              src={categoryPhoto(segment, category)}
              alt=""
              className="absolute inset-y-0 right-0 -z-10 hidden h-full w-[58%] object-cover opacity-90 transition-transform duration-[1.6s] ease-out group-hover/cat:scale-105 sm:block"
              style={{ maskImage: CATEGORY_PHOTO_FADE, WebkitMaskImage: CATEGORY_PHOTO_FADE, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
            />
            <div className="flex min-h-[7.5rem] flex-wrap items-end justify-between gap-3 py-2 sm:min-h-[9rem]">
              <div className="relative pl-4">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-0 w-1 rounded-full bg-gradient-to-b from-[var(--seg)] to-[var(--seg-strong)] shadow-[0_0_12px_var(--seg)]"
                />
                <p className="text-xs font-bold uppercase tracking-[0.22em] seg-text">
                  Infrastructure Category {category.number}
                </p>
                <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight drop-shadow-sm sm:text-[2rem]">{category.title}</h2>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Layers className="h-4 w-4 seg-text" aria-hidden />
                  {category.subSections.length} sub-sections
                </p>
              </div>
              <StatusBadge
                status={status}
                className="border-[color-mix(in_srgb,var(--seg)_55%,transparent)] bg-[color-mix(in_srgb,var(--seg)_16%,hsl(var(--card)))] px-3 py-1 text-[color-mix(in_srgb,var(--seg)_65%,hsl(var(--foreground)))] shadow-[0_0_18px_-6px_var(--seg)] backdrop-blur"
                label={
                  status === "pending"
                    ? "Recommendations pending"
                    : `${category.subSections.reduce((n, s) => n + s.items.length, 0)} recommendations`
                }
              />
            </div>
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
