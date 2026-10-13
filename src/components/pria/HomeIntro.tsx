"use client";

import { cn } from "@/lib/utils";

export const INTRO_SRC = "/pria-intro.mp4";

export function HomeIntro({ className }: { className?: string }) {
  return (
    <figure className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-[1.4rem] bg-black p-[3px] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.65)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_120deg,#99f6e4,#fbbf24,#2dd4bf,#fde68a,#99f6e4)] motion-safe:animate-[spin_10s_linear_infinite]"
        />
        <div className="relative overflow-hidden rounded-[1.25rem] bg-black">
          <video
            src={INTRO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="PRIA introduction, playing silently"
            className="aspect-video w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">Introduction</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
