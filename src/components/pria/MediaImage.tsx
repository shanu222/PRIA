"use client";

import * as React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Image streamed from R2 through `/media/*`, with a shimmer while loading and a fallback on failure. */
export function MediaImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [state, setState] = React.useState<"loading" | "ready" | "error">("loading");
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    setState("loading");
    const img = ref.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? "ready" : "error");
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {state === "loading" && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/60 to-muted" />
      )}
      {state === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="h-6 w-6" aria-hidden />
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={cn(
            "h-full w-full object-cover transition-[opacity,transform] duration-500",
            state === "ready" ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
