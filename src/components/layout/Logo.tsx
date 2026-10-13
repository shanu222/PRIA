"use client";

import * as React from "react";
import { site } from "@/data/pria";
import { cn } from "@/lib/utils";

/** NDMA emblem from `/public/ndma-logo.png`, with a monogram fallback until the file is added. */
export function LogoMark({ className }: { className?: string }) {
  const [failed, setFailed] = React.useState(false);
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={site.logo}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={cn("shrink-0 rounded-xl bg-white object-contain p-0.5", className)}
    />
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
