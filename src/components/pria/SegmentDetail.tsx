import Link from "next/link";
import { ArrowUpRight, ChevronRight, Layers, MapPin } from "lucide-react";
import { categoryStatus, segments, type InfraCategory, type Segment } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { CategoryTabs } from "./CategoryTabs";
import { Reveal } from "./Motion";
import { RegionChips, segmentStyle } from "./SegmentCard";
import { StatusBadge } from "./StatusBadge";
import { SubSectionPanel } from "./SubSectionPanel";
import { TopoPattern } from "./TopoPattern";

function SegmentHero({ segment }: { segment: Segment }) {
  return (
    <header
      className="relative overflow-hidden rounded-2xl px-6 py-10 text-white shadow-lift sm:px-10 sm:py-12"
      style={{ background: `linear-gradient(135deg, ${segment.colorStrong} 0%, ${segment.color} 70%, ${segment.color} 100%)` }}
    >
      <TopoPattern className="text-white opacity-25" />
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
              <li aria-current="page" className="text-white">
                Segment {segment.number}
              </li>
            </ol>
          </nav>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
            {segment.title}
          </h1>
          <RegionChips regions={segment.regions} onDark className="mt-5" />
        </div>
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
          <Icon name={segment.icon} className="h-10 w-10" />
        </span>
      </div>
    </header>
  );
}

function SegmentRail({ segment, activeCategoryId }: { segment: Segment; activeCategoryId: string }) {
  const others = segments.filter((s) => s.id !== segment.id);
  return (
    <aside aria-label="In this segment" className="flex flex-col gap-4">
      <div className="rounded-xl border bg-card p-5 shadow-soft">
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
      <div className="rounded-xl border bg-card p-5 shadow-soft">
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
      <CategoryTabs segment={segment} activeId={category.id} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Reveal key={category.id} className="min-w-0">
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
            <StatusBadge status={status} label={status === "pending" ? "Recommendations pending" : undefined} />
          </div>
          <SubSectionPanel key={`${segment.id}-${category.id}`} segment={segment} category={category} />
        </Reveal>
        <div className="hidden xl:block">
          <div className="sticky top-24">
            <SegmentRail segment={segment} activeCategoryId={category.id} />
          </div>
        </div>
      </div>

      <div className="xl:hidden">
        <SegmentRail segment={segment} activeCategoryId={category.id} />
      </div>
    </div>
  );
}
