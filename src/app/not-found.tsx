import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { site } from "@/data/pria";
import { Button } from "@/components/ui/button";
import { TopoPattern } from "@/components/pria/TopoPattern";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary-tint via-card to-card px-6 py-20 text-center shadow-soft sm:py-28">
        <TopoPattern className="text-[hsl(var(--topo-stroke))] opacity-20" />
        <div className="relative mx-auto max-w-lg">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-card text-primary shadow-soft dark:text-accent-foreground">
            <Compass className="h-7 w-7" aria-hidden />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-accent-foreground">
            Error 404
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">This location is not on the atlas</h1>
          <p className="mt-3 text-muted-foreground">
            The page you are looking for does not exist in the {site.name}.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/">
              <ArrowLeft />
              Back to {site.shortName} Home
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
