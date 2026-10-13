import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type InsightTone = "default" | "warning" | "water";

const toneStyles: Record<InsightTone, { card: string; icon: string; code: string }> = {
  default: {
    card: "hover:border-primary/45",
    icon: "bg-primary-tint text-primary dark:text-accent-foreground",
    code: "text-primary/70 dark:text-accent-foreground/70",
  },
  warning: {
    card: "border-amber-200/70 bg-gradient-to-b from-amber-50/60 to-card hover:border-amber-400/70 dark:border-amber-500/15 dark:from-amber-500/[0.06]",
    icon: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    code: "text-amber-800/70 dark:text-amber-300/70",
  },
  water: {
    card: "hover:border-water/50",
    icon: "bg-cyan-50 text-water dark:bg-cyan-500/10",
    code: "text-water/70",
  },
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
  const t = toneStyles[tone];
  return (
    <article
      id={id}
      className={cn(
        "group relative flex h-full scroll-mt-24 flex-col rounded-xl border-2 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        t.card,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            t.icon,
          )}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
        {code && (
          <span className={cn("font-heading text-2xl font-extrabold tabular-nums", t.code)} aria-hidden="true">
            {code.length === 1 && /\d/.test(code) ? `0${code}` : code}
          </span>
        )}
      </div>
      <h3 className="mt-5 text-base font-semibold leading-snug sm:text-[1.05rem]">
        {code && <span className="sr-only">{code}. </span>}
        {title}
      </h3>
      {children}
    </article>
  );
}
