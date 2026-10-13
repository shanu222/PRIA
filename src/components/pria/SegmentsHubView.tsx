"use client";

import * as React from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SegmentsHubView({ cards, compare }: { cards: React.ReactNode; compare: React.ReactNode }) {
  const [view, setView] = React.useState("cards");

  React.useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#compare") setView("compare");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  React.useEffect(() => {
    const onDemo = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      if (next === "cards" || next === "compare") setView(next);
    };
    window.addEventListener("pria-demo-segments-view", onDemo);
    return () => window.removeEventListener("pria-demo-segments-view", onDemo);
  }, []);

  return (
    <Tabs value={view} onValueChange={setView} id="compare" data-demo="board" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {view === "cards" ? "Open a segment to explore its infrastructure categories." : "4 segments × 6 infrastructure categories."}
        </p>
        <TabsList aria-label="Segments view" className="self-start">
          <TabsTrigger value="cards">
            <LayoutGrid className="h-4 w-4" aria-hidden />
            Cards
          </TabsTrigger>
          <TabsTrigger value="compare">
            <Table2 className="h-4 w-4" aria-hidden />
            Compare
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="cards" className="mt-0">
        {cards}
      </TabsContent>
      <TabsContent value="compare" className="mt-0">
        {compare}
      </TabsContent>
    </Tabs>
  );
}
