"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { InfraCategory, Segment, SubSection } from "@/data/pria";
import { getIcon, Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ContentPending } from "./ContentPending";
import { StatusBadge } from "./StatusBadge";

function SubSectionBody({ sub, segment }: { sub: SubSection; segment: Segment }) {
  if (sub.items.length === 0) {
    return <ContentPending title={sub.title} icon={getIcon(sub.icon)} accent={segment.color} />;
  }
  return (
    <ul className="grid gap-3">
      {sub.items.map((item) => (
        <li key={item.id} className="rounded-xl border bg-card p-5 shadow-soft">
          <h4 className="font-semibold">{item.title}</h4>
          {item.description && <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function SubSectionHeading({ sub, as: Heading = "h3" }: { sub: SubSection; as?: "h3" | "span" }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--seg)_12%,transparent)] seg-text">
        <Icon name={sub.icon} className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sub-section {sub.code}
        </span>
        <Heading className="block font-heading text-base font-semibold leading-snug">{sub.title}</Heading>
      </span>
    </div>
  );
}

export function SubSectionPanel({ segment, category }: { segment: Segment; category: InfraCategory }) {
  const [activeId, setActiveId] = React.useState(category.subSections[0]?.id);
  const active = category.subSections.find((s) => s.id === activeId) ?? category.subSections[0];

  return (
    <>
      {/* Desktop: mini-nav + content */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav aria-label={`${category.shortTitle} sub-sections`} className="self-start rounded-xl border bg-card p-2 shadow-soft">
          <ul className="flex flex-col gap-0.5">
            {category.subSections.map((sub) => {
              const isActive = sub.id === active.id;
              return (
                <li key={sub.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(sub.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-[color-mix(in_srgb,var(--seg)_10%,transparent)] text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`subnav-indicator-${category.id}`}
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--seg)]"
                      />
                    )}
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold uppercase",
                        isActive ? "bg-[var(--seg-strong)] text-white" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {sub.code}
                    </span>
                    <span className="flex-1 leading-snug">{sub.title}</span>
                    {sub.items.length > 0 && (
                      <span className="text-xs tabular-nums text-muted-foreground">{sub.items.length}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-live="polite" className="min-w-0 rounded-xl border bg-card p-6 shadow-soft">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-5">
                <SubSectionHeading sub={active} />
                <StatusBadge status={active.status} />
              </div>
              <SubSectionBody sub={active} segment={segment} />
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {/* Mobile / tablet: accordion */}
      <Accordion
        type="single"
        collapsible
        defaultValue={category.subSections[0]?.id}
        className="rounded-xl border bg-card px-4 shadow-soft lg:hidden"
      >
        {category.subSections.map((sub) => (
          <AccordionItem key={sub.id} value={sub.id} className="last:border-b-0">
            <AccordionTrigger className="gap-3 hover:no-underline">
              <SubSectionHeading sub={sub} as="span" />
            </AccordionTrigger>
            <AccordionContent>
              <SubSectionBody sub={sub} segment={segment} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
