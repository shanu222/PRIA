"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { navGroups, pages, segments, site } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { matchPage } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LogoMark, Wordmark } from "./Logo";

/**
 * `full`: always labelled (mobile sheet).
 * `responsive`: icon rail on tablet, labelled on desktop.
 * `rail`: icon rail at every size (user collapsed).
 */
export type SidebarMode = "full" | "responsive" | "rail";

const labelClass: Record<SidebarMode, string> = {
  full: "",
  responsive: "sr-only lg:not-sr-only",
  rail: "sr-only",
};

/** Desktop-first so the labelled sidebar renders collapsed sections without a flash. */
function useIsLargeScreen() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(min-width: 1024px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

export function SidebarNav({ mode, onNavigate }: { mode: SidebarMode; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = matchPage(pathname);
  const activeGroup = active?.group;
  const isLarge = useIsLargeScreen();
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(activeGroup ? [activeGroup] : []));
  const [trackedGroup, setTrackedGroup] = useState(activeGroup);

  if (activeGroup && activeGroup !== trackedGroup) {
    setTrackedGroup(activeGroup);
    setOpen((current) => {
      const next = new Set(current);
      next.add(activeGroup);
      return next;
    });
  }

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <nav aria-label="Primary" className="flex flex-col gap-2 px-3 py-4">
      {navGroups.map((group) => {
        const items = pages.filter((p) => p.group === group.id);
        const isOpen = open.has(group.id);
        const containsActive = items.some((page) => page.id === active?.id);
        const headingsVisible = mode === "full" || (mode === "responsive" && isLarge);
        const showItems = !headingsVisible || isOpen;
        return (
          <div key={group.id}>
            {headingsVisible ? (
              <button
                type="button"
                onClick={() => toggle(group.id)}
                aria-expanded={isOpen}
                aria-controls={`nav-group-${group.id}`}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  containsActive && "text-foreground",
                )}
              >
                <span>{group.label}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>
            ) : (
              <p className="sr-only">{group.label}</p>
            )}
            <div
              aria-hidden="true"
              className={cn(
                "mx-auto my-2 h-px w-8 bg-border",
                mode === "full" && "hidden",
                mode === "responsive" && "lg:hidden",
              )}
            />
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                showItems ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
            <ul id={`nav-group-${group.id}`} inert={!showItems} className="flex min-h-0 flex-col gap-0.5 overflow-hidden">
              {items.map((page) => {
                const isActive = active?.id === page.id;
                const segment = page.segmentId ? segments.find((s) => s.id === page.segmentId) : undefined;
                const link = (
                  <Link
                    href={page.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      isActive && "bg-primary-tint text-primary hover:bg-primary-tint hover:text-primary dark:text-accent-foreground",
                      mode === "rail" && "justify-center px-0",
                      mode === "responsive" && "justify-center px-0 lg:justify-start lg:px-3",
                    )}
                    style={segment ? ({ "--seg": segment.color } as CSSProperties) : undefined}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                      />
                    )}
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
                        segment && "text-[var(--seg)]",
                      )}
                    >
                      <Icon name={page.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <span className={cn("truncate", labelClass[mode])}>{page.navLabel}</span>
                  </Link>
                );
                return (
                  <li key={page.id}>
                    {mode === "full" ? (
                      link
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right" className={cn(mode === "responsive" && "lg:hidden")}>
                          {page.navLabel}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </li>
                );
              })}
            </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function SidebarBrand({ mode }: { mode: SidebarMode }) {
  return (
    <Link
      href="/"
      aria-label={`${site.shortName} home`}
      className={cn(
        "flex items-center gap-3 rounded-lg px-1 py-1",
        mode === "rail" && "justify-center",
        mode === "responsive" && "justify-center lg:justify-start",
      )}
    >
      <LogoMark swivel className="h-10 w-10" />
      <Wordmark className={cn(mode === "rail" && "hidden", mode === "responsive" && "hidden lg:flex")} />
    </Link>
  );
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const mode: SidebarMode = collapsed ? "rail" : "responsive";
  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r bg-card/80 backdrop-blur-xl transition-[width] duration-300 md:flex",
        collapsed ? "w-[76px]" : "w-[76px] lg:w-[272px]",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <SidebarBrand mode={mode} />
      </div>
      <ScrollArea className="flex-1">
        <SidebarNav mode={mode} />
      </ScrollArea>
      <div className="hidden border-t p-3 lg:block">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
