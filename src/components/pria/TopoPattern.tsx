import { cn } from "@/lib/utils";

type Peak = { cx: number; cy: number; base: number; rings: number; step: number; seed: number };

const PEAKS: Peak[] = [
  { cx: 180, cy: 140, base: 18, rings: 9, step: 22, seed: 1.3 },
  { cx: 720, cy: 90, base: 14, rings: 8, step: 24, seed: 2.7 },
  { cx: 1080, cy: 330, base: 20, rings: 10, step: 21, seed: 4.1 },
  { cx: 460, cy: 420, base: 12, rings: 7, step: 26, seed: 5.9 },
  { cx: 1320, cy: 40, base: 16, rings: 6, step: 25, seed: 7.2 },
];

function ringPath(peak: Peak, ring: number): string {
  const steps = 72;
  const r0 = peak.base + ring * peak.step;
  const points: [number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble =
      Math.sin(t * 3 + peak.seed + ring * 0.35) * (4 + ring * 1.6) +
      Math.cos(t * 2 - peak.seed * 1.7) * (3 + ring * 1.2) +
      Math.sin(t * 5 + ring * 0.6) * 1.5;
    const r = r0 + wobble;
    points.push([peak.cx + Math.cos(t) * r * 1.25, peak.cy + Math.sin(t) * r * 0.85]);
  }
  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  return `${d} Z`;
}

const PATHS = PEAKS.flatMap((peak) =>
  Array.from({ length: peak.rings }, (_, ring) => ({ d: ringPath(peak, ring), major: ring % 4 === 3 })),
);

/** Decorative topographic contour background. Inherits colour from `currentColor`. */
export function TopoPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1440 520"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {PATHS.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.major ? 1.25 : 0.75}
          strokeOpacity={p.major ? 0.9 : 0.55}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
