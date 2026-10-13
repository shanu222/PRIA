"use client";

import * as React from "react";
import type { ProvinceId } from "@/data/census";
import { PakistanMap } from "./PakistanMap";

/** Highlights the provinces a DRIM model is suited to. */
export function DrimRegionMap({ provinces, title }: { provinces: ProvinceId[]; title: string }) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const suited = new Set<string>(provinces);
  return (
    <PakistanMap
      ariaLabel={`Provinces where the ${title} is suitable`}
      activeId={hovered && suited.has(hovered) ? hovered : null}
      onActiveChange={setHovered}
      labelFor={(p) => `${p.name}: ${suited.has(p.id) ? "suitable" : "not listed"}`}
      fills={(id) =>
        suited.has(id)
          ? { fill: "#B45309", opacity: hovered === id ? 1 : 0.85 }
          : { fill: "hsl(var(--muted-foreground))", opacity: 0.12 }
      }
    />
  );
}
