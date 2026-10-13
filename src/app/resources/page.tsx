import type { Metadata } from "next";
import { getPage, resourceObservations } from "@/data/pria";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/pria/InsightCard";
import { Stagger, StaggerItem } from "@/components/pria/Motion";

const page = getPage("resources");
export const metadata: Metadata = { title: page.title, description: page.description };

export default function ResourcesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />
      <div data-demo="gaps">
      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {resourceObservations.map((r, i) => (
          <StaggerItem key={r.id}>
            <InsightCard id={r.id} code={String(i + 1)} title={r.title} icon={r.icon} tone="warning" />
          </StaggerItem>
        ))}
      </Stagger>
      </div>
    </div>
  );
}
