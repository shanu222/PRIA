"use client";

import * as React from "react";
import { site } from "@/data/pria";
import { cn } from "@/lib/utils";

/**
 * NDMA emblem from `/public/ndma-logo.png`, with a monogram fallback if it fails to load.
 * `swivel` rocks the emblem around its vertical axis; hovering gives it a full turn.
 */
export function LogoMark({ className, swivel = false }: { className?: string; swivel?: boolean }) {
  const [failed, setFailed] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B5D3B] to-[#0E7490] font-heading text-xs font-bold tracking-wide text-white shadow-sm",
          className,
        )}
      >
        {site.organisationShort}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 [transform-style:preserve-3d]", className)}
      onMouseEnter={() => swivel && setSpinning(true)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={site.logo}
        alt=""
        onError={() => setFailed(true)}
        onAnimationEnd={() => setSpinning(false)}
        className={cn(
          "h-full w-full rounded-full bg-white object-contain p-0.5 shadow-sm [backface-visibility:visible]",
          swivel && (spinning ? "animate-swivel-spin" : "motion-safe:animate-swivel"),
        )}
      />
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex min-w-0 flex-col leading-none", className)}>
      <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">{site.shortName}</span>
      <span className="mt-1 truncate text-[11px] font-medium text-muted-foreground">
        {site.organisationShort} · Pakistan
      </span>
    </span>
  );
}

/** Large emblem for hero areas: swivelling logo with a soft pulsing halo. */
export function LogoEmblem({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex items-center justify-center", className)}>
      <span aria-hidden="true" className="absolute inset-[-14%] rounded-full bg-emerald-300/40 blur-2xl motion-safe:animate-glow-pulse" />
      <span aria-hidden="true" className="absolute inset-[-5%] rounded-full border-2 border-white/30" />
      <LogoMark swivel className="relative h-full w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]" />
    </span>
  );
}
