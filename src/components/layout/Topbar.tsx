"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles } from "lucide-react";
import { site } from "@/data/pria";
import { getBreadcrumbs } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "./Logo";

export function Topbar({ onOpenMenu, onOpenSearch }: { onOpenMenu: () => void; onOpenSearch: () => void }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const [isMac, setIsMac] = React.useState(false);
  React.useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMenu} aria-label="Open navigation menu">
        <Menu />
      </Button>
      <Link href="/" className="flex items-center gap-2 md:hidden" aria-label={`${site.shortName} home`}>
        <LogoMark className="h-8 w-8" />
        <span className="font-heading text-base font-extrabold">{site.shortName}</span>
      </Link>

      <Breadcrumb className="hidden min-w-0 flex-1 md:block">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((crumb, i) => (
            <React.Fragment key={`${crumb.label}-${i}`}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="min-w-0">
                {crumb.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href} className="truncate">
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search PRIA"
          aria-keyshortcuts="Control+K Meta+K"
          className="flex h-9 items-center gap-2 rounded-lg border bg-card px-2.5 text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-44 sm:px-3 xl:w-64"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Search PRIA…</span>
          <kbd className="ml-auto hidden items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 font-sans text-[11px] font-medium sm:flex">
            {isMac ? "⌘" : "Ctrl"} K
          </kbd>
        </button>
        <ThemeToggle />
        <span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary-tint px-3 py-1 text-xs font-semibold text-primary dark:text-accent-foreground sm:inline-flex">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {site.vision}
        </span>
      </div>
    </header>
  );
}
