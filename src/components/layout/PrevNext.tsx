"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPrevNext } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function PrevNext() {
  const pathname = usePathname();
  const { prev, next } = getPrevNext(pathname);
  if (!prev && !next) return null;

  const base =
    "group flex flex-1 flex-col gap-1 rounded-xl border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <nav aria-label="Document pages" className="mx-auto mt-16 flex max-w-7xl flex-col gap-4 sm:flex-row">
      {prev ? (
        <Link href={prev.href} className={base}>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            Previous
          </span>
          <span className="font-heading font-semibold text-foreground group-hover:text-primary dark:group-hover:text-accent-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link href={next.href} className={cn(base, "sm:items-end sm:text-right")}>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Next
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
          <span className="font-heading font-semibold text-foreground group-hover:text-primary dark:group-hover:text-accent-foreground">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
