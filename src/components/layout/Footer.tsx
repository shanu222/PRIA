import { site } from "@/data/pria";
import { TopoPattern } from "@/components/pria/TopoPattern";

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t bg-card">
      <TopoPattern className="text-[hsl(var(--topo-stroke))] opacity-[0.07]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{site.organisation}</span>
          <span aria-hidden="true"> · </span>
          <span className="block sm:inline">
            {site.name} ({site.shortName})
          </span>
        </p>
        <p className="font-heading text-base font-bold tracking-tight text-primary dark:text-accent-foreground">
          {site.closingLine}
        </p>
      </div>
    </footer>
  );
}
