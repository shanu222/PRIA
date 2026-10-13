import type { Metadata } from "next";
import { Suspense } from "react";
import { getPage } from "@/data/pria";
import { evidenceSources } from "@/data/city-evidence";
import { PageHeader } from "@/components/layout/PageHeader";
import { CityEvidence } from "@/components/pria/CityEvidence";

const page = getPage("cities");
export const metadata: Metadata = { title: page.title, description: page.description };

export default function CitiesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12">
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />
      <Suspense fallback={<div className="h-14 animate-pulse rounded-2xl bg-muted" />}>
        <CityEvidence />
      </Suspense>
      <section aria-label="Evidence library" className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">Evidence library</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {evidenceSources.length} sources are stored with the portal data. Each city result above is drawn only from
            this list. Journal papers are linked by DOI. Official assessments are linked to the publishing authority.
          </p>
        </div>
        <ol data-tones className="grid gap-3">
          {evidenceSources.map((source, index) => (
            <li key={source.id} className="card-pro px-4 py-3 text-sm leading-relaxed">
              <span className="mr-2 font-semibold tabular-nums text-muted-foreground">{index + 1}.</span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-[var(--tone,#047857)] underline-offset-2"
              >
                {source.authors} ({source.year})
              </a>
              . {source.title}. <span className="italic">{source.venue}</span>
              {source.doi ? `. https://doi.org/${source.doi}` : `. ${source.url}`}.
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {source.kind === "journal" ? "Journal" : "Official"}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
