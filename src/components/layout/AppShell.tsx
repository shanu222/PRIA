"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { site } from "@/data/pria";
import { Sidebar, SidebarBrand, SidebarNav } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "./CommandMenu";
import { PrevNext } from "./PrevNext";

const STORAGE_KEY = "pria.sidebar.collapsed";

export function AppShell({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  React.useEffect(() => setMobileOpen(false), [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      window.localStorage.setItem(STORAGE_KEY, c ? "0" : "1");
      return !c;
    });
  };

  return (
    <div className="flex min-h-screen">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetTitle className="sr-only">{site.shortName} navigation</SheetTitle>
          <SheetDescription className="sr-only">Navigate the sections of {site.name}</SheetDescription>
          <div className="flex h-16 items-center border-b px-4">
            <SidebarBrand mode="full" />
          </div>
          <ScrollArea className="flex-1">
            <SidebarNav mode="full" onNavigate={() => setMobileOpen(false)} />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMobileOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
        <main id="main" className="flex-1 px-4 pb-4 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          {children}
          <PrevNext />
        </main>
        {footer}
      </div>

      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
