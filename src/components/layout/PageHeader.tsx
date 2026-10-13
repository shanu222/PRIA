import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { TopoPattern } from "@/components/pria/TopoPattern";

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  children,
  aside,
  className,
  demo,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
  demo?: string;
}) {
  return (
    <header
      data-demo={demo}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary-tint via-card to-card px-6 py-10 shadow-soft sm:px-10 sm:py-12",
        className,
      )}
    >
      <TopoPattern className="text-[hsl(var(--topo-stroke))] opacity-[0.16] dark:opacity-[0.12]" />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-accent-foreground">
            {icon && (
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <Icon name={icon} className="h-3.5 w-3.5" />
              </span>
            )}
            {eyebrow}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {description && <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p>}
          {children}
        </div>
        {aside && <div className="relative shrink-0">{aside}</div>}
      </div>
    </header>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  id,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-accent-foreground">
          {eyebrow}
        </p>
        <h2 id={id} className="mt-1.5 scroll-mt-24 text-2xl font-bold sm:text-[1.65rem]">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
