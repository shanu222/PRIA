"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const INTRO_SRC = "/pria-intro.mp4";
export const INTRO_POSTER = "/pria-intro-poster.jpg";

export function HomeIntro({ className }: { className?: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const start = () => {
      void video.play().catch(() => undefined);
    };
    start();
    video.addEventListener("loadeddata", start);
    return () => video.removeEventListener("loadeddata", start);
  }, []);

  return (
    <figure className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-[1.4rem] bg-black p-[3px] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.65)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_120deg,#99f6e4,#fbbf24,#2dd4bf,#fde68a,#99f6e4)] motion-safe:animate-[spin_10s_linear_infinite]"
        />
        <div className="relative overflow-hidden rounded-[1.25rem] bg-black">
          <video
            ref={videoRef}
            src={INTRO_SRC}
            poster={INTRO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="PRIA introduction, playing silently"
            className="aspect-video w-full bg-cover object-cover"
            style={{ backgroundImage: `url(${INTRO_POSTER})` }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">Introduction</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
