import type { Metadata } from "next";
import { getPage, landscape } from "@/data/pria";
import { getPriaContent } from "@/data/content";
import { PageHeader, SectionHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/pria/InsightCard";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { ProvinceTable } from "@/components/pria/ProvinceTable";
import { ResidentialDonut } from "@/components/pria/ResidentialDonut";
import { StatTile } from "@/components/pria/StatTile";

const page = getPage("landscape");
export const metadata: Metadata = { title: page.title, description: page.description };

export default async function LandscapePage() {
  const { provinceTable } = await getPriaContent();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        icon={page.icon}
        aside={
          <div className="w-full min-w-[240px] lg:w-64">
            <StatTile stat={landscape.population} emphasis />
          </div>
        }
      />

      <section aria-labelledby="types" className="scroll-mt-24">
        <SectionHeader id="types" eyebrow="Classification" title="Types of Infrastructure" />
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {landscape.infrastructureTypes.map((t) => (
            <StaggerItem key={t.id}>
              <InsightCard id={`type-${t.id}`} title={t.title} icon={t.icon} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-labelledby="residential-split" className="scroll-mt-24">
        <SectionHeader id="residential-split" eyebrow="Residential" title="Urban and rural split" />
        <Reveal>
          <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
            <ResidentialDonut data={landscape.residentialSplit} />
          </div>
        </Reveal>
      </section>

      <section aria-label="Province and region breakdown">
        <SectionHeader eyebrow="By province & region" title={provinceTable.title} />
        <Reveal>
          <ProvinceTable table={provinceTable} />
        </Reveal>
      </section>
    </div>
  );
}
