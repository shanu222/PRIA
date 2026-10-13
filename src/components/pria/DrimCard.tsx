import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { drimHazards, drimMedia, drimSystems, type DrimModel } from "@/data/drim";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { MediaImage } from "./MediaImage";

export function HazardChip({
  hazard,
  solid = false,
  className,
}: {
  hazard: keyof typeof drimHazards;
  /** White chip for dark backgrounds. */
  solid?: boolean;
  className?: string;
}) {
  const h = drimHazards[hazard];
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}
      style={{
        color: h.color,
        borderColor: solid ? "transparent" : `color-mix(in srgb, ${h.color} 35%, transparent)`,
        background: solid ? "#fff" : `color-mix(in srgb, ${h.color} 8%, transparent)`,
      }}
    >
      <Icon name={h.icon} className="h-3 w-3" />
      {h.label}
    </span>
  );
}

export function DrimCard({ model, index, className }: { model: DrimModel; index?: number; className?: string }) {
  const regions = model.regions.map((r) => r.label);
  const tone = drimHazards[model.hazards[0]].color;
  return (
    <Link
      href={`/drim/${model.slug}`}
      style={{ "--tone": tone, "--tone-2": "#0e7490" } as React.CSSProperties}
      className={cn(
        "card-pro card-pro-lift group flex h-full flex-col overflow-hidden rounded-2xl bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative">
        <MediaImage
          src={drimMedia.thumb(model.slug)}
          alt={`${model.title} demonstration model`}
          className="aspect-[4/3]"
          imgClassName="group-hover:scale-[1.06]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        {index !== undefined && (
          <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-0.5 font-heading text-xs font-bold text-[#0B5D3B] shadow-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
          {drimSystems[model.system]}
        </span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0B5D3B] opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-base font-bold leading-snug transition-colors group-hover:text-[var(--tone)] dark:group-hover:text-foreground">
          {model.title}
        </h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {model.hazards.map((h) => (
            <HazardChip key={h} hazard={h} />
          ))}
        </div>
        <p className="mt-auto flex items-start gap-1.5 pt-4 text-xs text-muted-foreground">
          <MapPin className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-2">{regions.join(" · ")}</span>
        </p>
      </div>
    </Link>
  );
}
