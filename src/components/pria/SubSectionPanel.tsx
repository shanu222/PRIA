"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { InfraCategory, Segment, SubSection } from "@/data/pria";
import { getIcon, Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContentPending } from "./ContentPending";
import { DrimStrip } from "./DrimStrip";
import { NorthernRoutes } from "./NorthernRoutes";
import { SegmentConstruction } from "./SegmentConstruction";
import { StatusBadge } from "./StatusBadge";
import { recommendationPhoto, segChip, segGlass, segTile } from "./segment-ui";

function SubSectionBody({
  sub,
  segment,
  category,
}: {
  sub: SubSection;
  segment: Segment;
  category: InfraCategory;
}) {
  const showDrim = category.id === "residential" && sub.id === "design-options";
  const showRoutes = sub.id === "tourism-templates";
  const showBuild = category.id === "residential" && sub.id === "construction-methodology";
  const sketchKind =
    category.id !== "residential" && sub.id === "design-options"
      ? "design"
      : category.id !== "residential" && sub.id === "construction-methodologies"
        ? "build"
        : null;
  if (sub.items.length === 0 && !showDrim && !showRoutes && !showBuild && !sketchKind) {
    return <ContentPending title={sub.title} icon={getIcon(sub.icon)} accent={segment.color} />;
  }
  return (
    <div className="flex flex-col gap-8">
      {sketchKind && (
        <figure className="overflow-hidden rounded-2xl border-2 border-[color-mix(in_srgb,var(--seg)_25%,hsl(var(--border)))] bg-card shadow-soft">
          <img
            src={`/infra/${segment.id}-${category.id}-${sketchKind}.jpg`}
            alt={`${segment.shortTitle} ${category.shortTitle}: ${sub.title}`}
            className="aspect-video w-full object-cover"
          />
          <figcaption className="border-t px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
            {sketchKind === "design" ? "Design options for this segment" : "Construction methodology for this segment"}
            <span aria-hidden="true"> · </span>
            {category.shortTitle}
          </figcaption>
        </figure>
      )}
      {showDrim && <DrimStrip segment={segment} compact />}
      {sub.items.length > 0 && (
        <ItemList sub={sub} segment={segment} category={category} subIndex={category.subSections.indexOf(sub)} />
      )}
      {showRoutes && <NorthernRoutes key={segment.id} segmentId={segment.id} />}
      {showBuild && <SegmentConstruction segment={segment} />}
    </div>
  );
}

function ItemList({
  sub,
  segment,
  category,
  subIndex,
}: {
  sub: SubSection;
  segment: Segment;
  category: InfraCategory;
  subIndex: number;
}) {
  return (
    <ul className="grid gap-3.5">
      {sub.items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            segTile,
            "group relative grid overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--seg)] hover:shadow-[0_0_28px_-10px_var(--seg)] sm:grid-cols-[minmax(0,1fr)_11rem] md:grid-cols-[minmax(0,1fr)_13rem]",
          )}
        >
          <div className="relative order-2 flex gap-4 p-4 sm:order-1 sm:p-5">
            <span
              aria-hidden="true"
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold transition-transform duration-300 group-hover:scale-110",
                segChip,
              )}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <h4 className="font-semibold leading-snug">{item.title}</h4>
              {item.description && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--seg)_45%,transparent)] bg-[color-mix(in_srgb,var(--seg)_12%,transparent)] px-2.5 py-0.5 text-xs font-semibold seg-text shadow-[0_0_10px_-6px_var(--seg)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative order-1 aspect-[16/7] overflow-hidden sm:order-2 sm:m-3 sm:ml-0 sm:aspect-auto sm:rounded-xl sm:border sm:border-[color-mix(in_srgb,var(--seg)_30%,transparent)]">
            <img
              src={recommendationPhoto(segment, category, subIndex, i)}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span
              aria-hidden="true"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-white/30 bg-black/45 text-white backdrop-blur transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[var(--seg-strong)]"
            >
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

function SubSectionHeading({ sub, as: Heading = "h3" }: { sub: SubSection; as?: "h3" | "span" }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--seg)_50%,transparent)] bg-[color-mix(in_srgb,var(--seg)_16%,transparent)] seg-text shadow-[0_0_18px_-4px_var(--seg),inset_0_1px_0_rgba(255,255,255,0.15)]">
        <Icon name={sub.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Sub-section {sub.code}
        </span>
        <Heading className="block font-heading text-lg font-bold leading-snug">{sub.title}</Heading>
      </span>
    </div>
  );
}

export function SubSectionPanel({ segment, category }: { segment: Segment; category: InfraCategory }) {
  const [activeId, setActiveId] = React.useState(category.subSections[0]?.id);
  const active = category.subSections.find((s) => s.id === activeId) ?? category.subSections[0];

  React.useEffect(() => {
    const onOpen = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (category.subSections.some((sub) => sub.id === id)) setActiveId(id);
    };
    window.addEventListener("pria-demo-sub", onOpen);
    return () => window.removeEventListener("pria-demo-sub", onOpen);
  }, [category.subSections]);

  return (
    <>
      {/* Desktop: mini-nav + content */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav aria-label={`${category.shortTitle} sub-sections`} className={cn(segGlass, "self-start p-2.5")}>
          <ul className="flex flex-col gap-1.5">
            {category.subSections.map((sub) => {
              const isActive = sub.id === active.id;
              return (
                <li key={sub.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(sub.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative isolate flex w-full items-center gap-2.5 overflow-hidden rounded-xl border px-2.5 py-2.5 text-left text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--seg)]",
                      isActive
                        ? "border-[var(--seg)] text-foreground shadow-[0_0_22px_-8px_var(--seg),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        : "border-[color-mix(in_srgb,var(--seg)_16%,hsl(var(--border)))] bg-[color-mix(in_srgb,var(--seg)_3%,hsl(var(--card)))] text-muted-foreground hover:translate-x-0.5 hover:border-[color-mix(in_srgb,var(--seg)_50%,transparent)] hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`subnav-indicator-${category.id}`}
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-[color-mix(in_srgb,var(--seg)_28%,transparent)] to-[color-mix(in_srgb,var(--seg)_6%,transparent)]"
                      />
                    )}
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase transition-transform duration-200 group-hover:scale-105",
                        isActive ? segChip : "border bg-muted text-muted-foreground",
                      )}
                    >
                      {sub.code}
                    </span>
                    <Icon
                      name={sub.icon}
                      className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "seg-text" : "opacity-70")}
                    />
                    <span className="flex-1 leading-snug">{sub.title}</span>
                    {sub.items.length > 0 && (
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">{sub.items.length}</span>
                    )}
                    <ChevronRight
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
                        isActive ? "seg-text" : "opacity-50",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-live="polite" className={cn(segGlass, "min-w-0 p-6")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--seg)_22%,hsl(var(--border)))] pb-5">
                <SubSectionHeading sub={active} />
                <StatusBadge
                  status={active.status}
                  className={cn(
                    active.status === "available" &&
                      "border-[color-mix(in_srgb,var(--seg)_55%,transparent)] bg-[color-mix(in_srgb,var(--seg)_14%,transparent)] px-3 py-1 text-[color-mix(in_srgb,var(--seg)_65%,hsl(var(--foreground)))] shadow-[0_0_16px_-6px_var(--seg)]",
                  )}
                />
              </div>
              <SubSectionBody sub={active} segment={segment} category={category} />
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {/* Mobile / tablet: accordion */}
      <Accordion
        type="single"
        collapsible
        value={activeId}
        onValueChange={(value) => {
          if (value) setActiveId(value);
        }}
        className={cn(segGlass, "px-4 lg:hidden")}
      >
        {category.subSections.map((sub) => (
          <AccordionItem key={sub.id} value={sub.id} className="last:border-b-0">
            <AccordionTrigger className="gap-3 hover:no-underline">
              <SubSectionHeading sub={sub} as="span" />
            </AccordionTrigger>
            <AccordionContent>
              <SubSectionBody sub={sub} segment={segment} category={category} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
