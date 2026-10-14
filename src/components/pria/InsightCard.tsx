import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type InsightTone = "default" | "warning" | "water";

/** Fixed tones override the grid's cycling palette. */
const toneVars: Record<InsightTone, React.CSSProperties | undefined> = {
  default: undefined,
  warning: { "--tone": "#b45309", "--tone-2": "#dc2626" } as React.CSSProperties,
  water: { "--tone": "#0e7490", "--tone-2": "#2563eb" } as React.CSSProperties,
};

const codeLabel = (code: string) => (code.length === 1 && /\d/.test(code) ? `0${code}` : code);

export function InsightCard({
  id,
  code,
  title,
  icon,
  image,
  tone = "default",
  className,
  children,
}: {
  id?: string;
  code?: string;
  title: string;
  icon: string;
  /** Decorative photo shown above the title; the title carries the meaning. */
  image?: string;
  tone?: InsightTone;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <article
      id={id}
      style={toneVars[tone]}
      className={cn(
        "card-pro card-pro-lift group relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl bg-card p-6",
        className,
      )}
    >
      {image && (
        <div className="relative -mx-6 -mt-6 mb-5 aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/20" />
          {code && (
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-0.5 font-heading text-sm font-bold tabular-nums text-white ring-1 ring-white/30 backdrop-blur-sm"
            >
              {codeLabel(code)}
            </span>
          )}
        </div>
      )}
      {image ? (
        <span className="relative z-10 -mt-11 mb-1 inline-flex w-fit rounded-[14px] bg-card p-1 shadow-md">
          <span className="tone-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <Icon name={icon} className="h-5 w-5" />
          </span>
        </span>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <span className="tone-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <Icon name={icon} className="h-5 w-5" />
          </span>
          {code && (
            <span className="tone-text font-heading text-2xl font-extrabold tabular-nums opacity-60" aria-hidden="true">
              {codeLabel(code)}
            </span>
          )}
        </div>
      )}
      <h3 className={cn("text-base font-semibold leading-snug sm:text-[1.05rem]", image ? "mt-3" : "mt-5")}>
        {code && <span className="sr-only">{code}. </span>}
        {title}
      </h3>
      {children}
      <span
        aria-hidden="true"
        className="tone-bar absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
      />
    </article>
  );
}
