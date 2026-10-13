"use client";

import * as React from "react";
import Link from "next/link";
import type { Segment } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Route-backed tabs: each category has its own URL under the segment. */
export function CategoryTabs({ segment, activeId }: { segment: Segment; activeId: string }) {
  const activeRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  return (
    <nav aria-label="Infrastructure categories" className="relative">
      <ul className="-mx-1 flex gap-1 overflow-x-auto rounded-xl border bg-card p-1.5 shadow-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {segment.categories.map((c) => {
          const isActive = c.id === activeId;
          return (
            <li key={c.id} className="shrink-0">
              <Link
                ref={isActive ? activeRef : undefined}
                href={`/segments/${segment.slug}/${c.id}`}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-[var(--seg-strong)] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold",
                    isActive ? "bg-white/20" : "bg-muted",
                  )}
                >
                  {c.number}
                </span>
                <Icon name={c.icon} className="h-4 w-4" />
                {c.shortTitle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
