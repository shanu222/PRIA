"use client";

import * as React from "react";
import { segments, type SegmentId } from "@/data/pria";
import { PakistanSegmentMap } from "./PakistanSegmentMap";
import { SegmentCardCompact } from "./SegmentCard";

export function SegmentExplorer() {
  const [active, setActive] = React.useState<SegmentId | null>(null);
  React.useEffect(() => {
    const onPick = (event: Event) => {
      const id = (event as CustomEvent<SegmentId | null>).detail;
      setActive(id);
    };
    window.addEventListener("pria-demo-segment", onPick);
    return () => window.removeEventListener("pria-demo-segment", onPick);
  }, []);
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="rounded-2xl border-2 bg-gradient-to-br from-primary-tint/60 via-card to-card p-4 shadow-soft transition-colors hover:border-primary/35 sm:p-6">
        <PakistanSegmentMap activeId={active} onActiveChange={setActive} className="mx-auto max-w-xl" />
      </div>
      <ul className="flex flex-col gap-3">
        {segments.map((s) => (
          <li key={s.id}>
            <SegmentCardCompact
              segment={s}
              highlighted={active === s.id}
              onHover={(on) => setActive(on ? s.id : null)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
