import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type InsightTone = "default" | "warning" | "water";

/** Fixed tones override the grid's cycling palette. */
const toneVars: Record<InsightTone, React.CSSProperties | undefined> = {
  default: undefined,
  warning: { "--tone": "#b45309", "--tone-2": "#dc2626" } as React.CSSProperties,
  water: { "--tone": "#0e7490", "--tone-2": "#2563eb" } as React.CSSProperties,
};

export function InsightCard({
  id,
  code,
  title,
  icon,
  tone = "default",
  className,
  children,
}: {
  id?: string;
  code?: string;
  title: string;
  icon: string;
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
      <div className="flex items-start justify-between gap-4">
        <span className="tone-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        {code && (
          <span className="tone-text font-heading text-2xl font-extrabold tabular-nums opacity-60" aria-hidden="true">
            {code.length === 1 && /\d/.test(code) ? `0${code}` : code}
          </span>
        )}
      </div>
      <h3 className="mt-5 text-base font-semibold leading-snug sm:text-[1.05rem]">
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
