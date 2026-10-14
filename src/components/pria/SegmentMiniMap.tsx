import type { Segment } from "@/data/pria";
import { segmentProvinces } from "@/data/census";
import { MAP_VIEWBOX, kashmirShape, provinceShapes } from "@/data/pakistan-geo";
import { cn } from "@/lib/utils";

/** Decorative outline of Pakistan with the segment's provinces glowing. */
export function SegmentMiniMap({ segment, className }: { segment: Segment; className?: string }) {
  const inSegment = new Set<string>(segmentProvinces[segment.id]);
  const glow = `drop-shadow(0 0 10px ${segment.color}) drop-shadow(0 0 22px color-mix(in srgb, ${segment.color} 60%, transparent))`;
  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      aria-hidden="true"
      className={cn("pointer-events-none w-auto", className)}
      style={{ aspectRatio: `${MAP_VIEWBOX.width} / ${MAP_VIEWBOX.height}` }}
    >
      <g fill="rgba(4,12,16,0.6)" stroke="rgba(255,255,255,0.45)" strokeWidth={2.5} strokeLinejoin="round">
        {provinceShapes.map((s) => (
          <path key={s.id} d={s.d} />
        ))}
        <path d={kashmirShape.d} fillRule="evenodd" />
      </g>
      <g
        fill={segment.color}
        fillOpacity={0.55}
        stroke={`color-mix(in srgb, ${segment.color} 45%, white)`}
        strokeWidth={3}
        strokeLinejoin="round"
        style={{ filter: glow }}
        className="motion-safe:animate-soft-pulse"
      >
        {provinceShapes
          .filter((s) => inSegment.has(s.id))
          .map((s) => (
            <path key={s.id} d={s.d} />
          ))}
        {segment.id === "mountain" && <path d={kashmirShape.d} fillRule="evenodd" />}
      </g>
    </svg>
  );
}
