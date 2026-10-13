"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { segments, type SegmentId } from "@/data/pria";
import { cn } from "@/lib/utils";

/**
 * Abstract zone diagram of the four resilience segments, arranged north to south.
 * It deliberately does not trace national or provincial boundaries; replace this
 * component with the official Survey of Pakistan map while keeping the same props.
 */
const ZONES: Record<SegmentId, { d: string; label: [number, number] }> = {
  mountain: {
    d: "M150 30 C210 8 300 14 360 45 C388 62 382 106 350 126 C302 152 242 140 196 150 C166 156 140 140 134 114 C127 80 120 46 150 30 Z",
    label: [258, 86],
  },
  "riverine-plains": {
    d: "M196 162 C246 152 310 152 336 172 C356 192 330 232 300 257 C270 287 240 310 206 320 C180 327 160 310 166 285 C172 255 150 225 160 196 C166 176 178 165 196 162 Z",
    label: [250, 236],
  },
  "desert-arid": {
    d: "M40 182 C80 162 128 170 148 200 C160 230 156 270 168 300 C180 332 230 336 262 322 C287 312 302 332 292 356 C280 382 230 392 180 392 C130 392 80 390 50 370 C24 350 20 300 25 260 C28 225 20 196 40 182 Z",
    label: [96, 290],
  },
  coastal: {
    d: "M40 402 C100 412 170 410 230 405 C270 402 300 397 320 407 C331 414 326 430 306 434 C250 444 160 446 90 442 C60 440 35 432 32 420 C30 412 33 405 40 402 Z",
    label: [178, 424],
  },
};

const PEAKS = [
  [175, 70, 14],
  [205, 58, 18],
  [300, 60, 16],
  [330, 80, 12],
] as const;

export function PakistanSegmentMap({
  activeId,
  onActiveChange,
  className,
}: {
  activeId?: SegmentId | null;
  onActiveChange?: (id: SegmentId | null) => void;
  className?: string;
}) {
  const router = useRouter();
  const [localActive, setLocalActive] = React.useState<SegmentId | null>(null);
  const active = activeId !== undefined ? activeId : localActive;
  const setActive = (id: SegmentId | null) => {
    setLocalActive(id);
    onActiveChange?.(id);
  };

  return (
    <figure className={cn("relative", className)}>
      <svg
        viewBox="0 0 400 470"
        className="h-auto w-full"
        role="group"
        aria-label="Schematic diagram of Pakistan's four regional resilience segments. Not to scale."
      >
        <defs>
          <pattern id="seg-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" />
          </pattern>
          <filter id="seg-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Sea lines below the coastal band */}
        <g className="text-water" aria-hidden="true">
          {[452, 460].map((y) => (
            <path
              key={y}
              d={`M20 ${y} q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0`}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />
          ))}
        </g>

        {segments.map((s) => {
          const zone = ZONES[s.id];
          const isActive = active === s.id;
          const dim = active && !isActive;
          return (
            <g
              key={s.id}
              role="link"
              tabIndex={0}
              aria-label={`Segment ${s.number}: ${s.title}. ${s.regions.join(", ")}`}
              onMouseEnter={() => setActive(s.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.id)}
              onBlur={() => setActive(null)}
              onClick={() => router.push(`/segments/${s.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/segments/${s.slug}`);
                }
              }}
              className="cursor-pointer outline-none [&:focus-visible>path.zone]:stroke-[3]"
              style={{ transition: "opacity 250ms" }}
              opacity={dim ? 0.4 : 1}
            >
              <path
                className="zone"
                d={zone.d}
                fill={s.color}
                fillOpacity={isActive ? 0.42 : 0.22}
                stroke={s.color}
                strokeWidth={isActive ? 2.5 : 1.5}
                filter={isActive ? "url(#seg-shadow)" : undefined}
                style={{ transition: "fill-opacity 250ms, stroke-width 250ms" }}
              />
              <path d={zone.d} fill="url(#seg-hatch)" className="text-foreground" pointerEvents="none" />
              {s.id === "mountain" &&
                PEAKS.map(([x, y, h], i) => (
                  <path
                    key={i}
                    d={`M${x - h * 0.8} ${y + h * 0.6} L${x} ${y - h * 0.5} L${x + h * 0.8} ${y + h * 0.6}`}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeOpacity="0.8"
                    pointerEvents="none"
                  />
                ))}
              {s.id === "riverine-plains" && (
                <path
                  d="M290 170 C270 200 230 210 225 240 C220 270 200 290 190 312"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.8"
                  pointerEvents="none"
                />
              )}
              <g pointerEvents="none" transform={`translate(${zone.label[0]} ${zone.label[1]})`}>
                <circle r="15" fill={s.color} />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="13"
                  fontWeight="700"
                  fill="#fff"
                  className="font-heading"
                >
                  {s.number}
                </text>
              </g>
            </g>
          );
        })}

        <g transform="translate(40 50)" className="text-muted-foreground" aria-hidden="true">
          <circle r="16" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <path d="M0 -11 L4 2 L0 0 L-4 2 Z" fill="currentColor" />
          <text y="-22" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">
            N
          </text>
        </g>
      </svg>
      <figcaption className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Compass className="h-3.5 w-3.5" aria-hidden />
        Schematic. Not to scale.
      </figcaption>
    </figure>
  );
}
