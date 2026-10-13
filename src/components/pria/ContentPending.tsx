import { FileClock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

export function ContentPending({
  title,
  message = "Recommendations for this section will be published here",
  icon: IconCmp = FileClock,
  accent,
  size = "default",
  className,
}: {
  title: string;
  message?: string;
  icon?: LucideIcon;
  /** Optional hex colour used for the icon halo (e.g. a segment colour). */
  accent?: string;
  size?: "default" | "lg";
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "relative overflow-hidden rounded-xl border border-dashed bg-card/60 text-center",
        size === "lg" ? "px-6 py-16 sm:py-20" : "px-6 py-12",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.07),transparent_70%)]"
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="relative mb-5">
          <div
            aria-hidden="true"
            className="absolute inset-0 -m-3 rounded-full opacity-15 blur-md"
            style={{ background: accent ?? "hsl(var(--primary))" }}
          />
          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-card shadow-soft"
            style={accent ? { color: accent } : undefined}
          >
            <IconCmp className={cn("h-6 w-6", !accent && "text-primary")} aria-hidden="true" />
          </div>
        </div>
        <StatusBadge status="pending" className="mb-3" />
        <h3 className={cn("font-semibold", size === "lg" ? "text-xl sm:text-2xl" : "text-lg")}>{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
