"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scope, scopeGroups, type ScopeGroupId } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Filter = ScopeGroupId | "all";

export function ScopeTimeline() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const visible = filter === "all" ? scope : scope.filter((s) => s.group === filter);

  const chips: { id: Filter; label: string; range?: string; count: number }[] = [
    { id: "all", label: "All", count: scope.length },
    ...scopeGroups.map((g) => ({ ...g, count: scope.filter((s) => s.group === g.id).length })),
  ];

  return (
    <div>
      <div role="group" aria-label="Filter scope items" className="mb-8 flex flex-wrap gap-2">
        {chips.map((chip) => {
          const active = filter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(chip.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {chip.label}
              {chip.range && (
                <span className={cn("text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground/80")}>
                  ({chip.range})
                </span>
              )}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                  active ? "bg-white/20" : "bg-muted",
                )}
              >
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} of {scope.length} scope items
      </p>

      <ol className="relative">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[22px] top-6 w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:left-[27px]"
        />
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item) => {
            const group = scopeGroups.find((g) => g.id === item.group)!;
            return (
              <motion.li
                key={item.id}
                id={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex scroll-mt-24 gap-4 pb-4 sm:gap-6"
              >
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-card font-heading text-sm font-bold uppercase text-primary shadow-soft dark:text-accent-foreground sm:h-14 sm:w-14 sm:text-base">
                  {item.code}
                </span>
                <div className="card-pro card-pro-lift group relative flex flex-1 items-start gap-4 overflow-hidden rounded-xl bg-card p-5">
                  <img
                    src={
                      {
                        planning: "/glance/scope.jpg",
                        methods: "/construction/timber.jpg",
                        institutions: "/glance/stakeholders.jpg",
                        finance: "/glance/needs.jpg",
                      }[item.group]
                    }
                    alt=""
                    className="pointer-events-none absolute inset-y-0 right-0 h-full w-2/5 object-cover opacity-25"
                    style={{ maskImage: "linear-gradient(to right, transparent, #000 40%)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 40%)" }}
                  />
                  <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary dark:text-accent-foreground sm:flex">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </p>
                    <p className="mt-1 font-medium leading-relaxed text-foreground">{item.title}</p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}
