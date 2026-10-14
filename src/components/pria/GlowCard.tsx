import type { Stat } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { CountUp } from "./Motion";
import { StatusBadge } from "./StatusBadge";

export type GlowColor = "emerald" | "sky" | "violet" | "amber" | "rose";

const GLOW: Record<GlowColor, { c: string; c2: string; text: string; bg: string }> = {
  emerald: { c: "#34d399", c2: "#10b981", text: "#6ee7b7", bg: "#04231d" },
  sky: { c: "#38bdf8", c2: "#0ea5e9", text: "#7dd3fc", bg: "#04192b" },
  violet: { c: "#a78bfa", c2: "#7c3aed", text: "#c4b5fd", bg: "#150f33" },
  amber: { c: "#fbbf24", c2: "#f59e0b", text: "#fcd34d", bg: "#271a05" },
  rose: { c: "#fb7185", c2: "#e11d48", text: "#fda4af", bg: "#2a0b15" },
};

export const GLOW_ORDER: GlowColor[] = ["emerald", "sky", "violet", "amber", "rose"];

const IMAGE_FADE = "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 35%, #000 70%)";

function glowStyle(color: GlowColor): React.CSSProperties {
  const g = GLOW[color];
  return {
    "--glow": g.c,
    "--glow-2": g.c2,
    borderColor: `color-mix(in srgb, ${g.c} 75%, transparent)`,
    background: `radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, ${g.c} 22%, transparent) 0%, transparent 55%), linear-gradient(160deg, ${g.bg} 0%, #071417 100%)`,
    boxShadow: `0 0 0 1px color-mix(in srgb, ${g.c} 25%, transparent), 0 0 22px -6px ${g.c}, inset 0 1px 0 rgba(255,255,255,0.12)`,
  } as React.CSSProperties;
}

function GlowShell({
  color,
  image,
  art,
  className,
  children,
}: {
  color: GlowColor;
  image?: string;
  art?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={glowStyle(color)}
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_34px_-4px_var(--glow)]",
        className,
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-y-0 right-0 -z-10 h-full w-[70%] object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ maskImage: IMAGE_FADE, WebkitMaskImage: IMAGE_FADE }}
        />
      )}
      {art && (
        <Icon
          name={art}
          strokeWidth={1.25}
          className="pointer-events-none absolute -right-3 -top-3 -z-10 h-28 w-28 opacity-25 transition-transform duration-500 group-hover:scale-110"
          style={{ color: GLOW[color].c }}
        />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/50 to-transparent"
      />
      {children}
    </div>
  );
}

function GlowIcon({ name, color }: { name: string; color: GlowColor }) {
  const g = GLOW[color];
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/15 backdrop-blur-sm"
      style={{
        color: g.text,
        background: `color-mix(in srgb, ${g.c} 18%, rgba(0,0,0,0.35))`,
        boxShadow: `0 0 16px -4px ${g.c}`,
      }}
    >
      <Icon name={name} className="h-5 w-5" />
    </span>
  );
}

/** Dark neon stat card with optional photo or icon art and a progress bar. */
export function GlowStatTile({
  stat,
  color,
  icon,
  image,
  art,
  progress,
  className,
}: {
  stat: Stat;
  color: GlowColor;
  icon?: string;
  image?: string;
  art?: string;
  progress?: number;
  className?: string;
}) {
  const g = GLOW[color];
  return (
    <GlowShell color={color} image={image} art={art} className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        {icon && <GlowIcon name={icon} color={color} />}
        {stat.status !== "available" && <StatusBadge status={stat.status} />}
      </div>
      <p className={cn("text-xs font-semibold uppercase tracking-wider text-white/85", icon && "mt-4")}>{stat.label}</p>
      <p
        className="mt-1.5 font-heading text-4xl font-bold tracking-tight sm:text-[2.6rem]"
        style={{ color: g.text, textShadow: `0 0 18px color-mix(in srgb, ${g.c} 55%, transparent)` }}
      >
        <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} plain={stat.plain} decimals={stat.decimals} />
      </p>
      {stat.note && <p className="mt-1 text-sm text-white/75">{stat.note}</p>}
      {progress !== undefined && (
        <div className="mt-auto pt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-700 group-hover:!w-full"
              style={{
                width: `${Math.max(0, Math.min(100, progress))}%`,
                background: `linear-gradient(90deg, ${g.c2}, ${g.c})`,
                boxShadow: `0 0 10px ${g.c}`,
              }}
            />
          </div>
        </div>
      )}
    </GlowShell>
  );
}

/** Dark neon tile with a photo, an icon and a short title. */
export function GlowTypeCard({
  id,
  title,
  icon,
  color,
  image,
  className,
}: {
  id?: string;
  title: string;
  icon: string;
  color: GlowColor;
  image?: string;
  className?: string;
}) {
  return (
    <article id={id} className="h-full scroll-mt-24">
      <GlowShell color={color} image={image} className={cn("min-h-[8.5rem] justify-between p-5", className)}>
        <GlowIcon name={icon} color={color} />
        <h3 className="mt-6 text-base font-semibold leading-snug drop-shadow sm:text-[1.05rem]">{title}</h3>
      </GlowShell>
    </article>
  );
}
