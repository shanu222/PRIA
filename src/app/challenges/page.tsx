import type { Metadata } from "next";
import { challenges, getPage } from "@/data/pria";
import { getPriaContent } from "@/data/content";
import { Icon } from "@/lib/icons";
import { PageHeader, SectionHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/pria/InsightCard";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { ProvinceTable } from "@/components/pria/ProvinceTable";
import { TopoPattern } from "@/components/pria/TopoPattern";

const page = getPage("challenges");
export const metadata: Metadata = { title: page.title, description: page.description };

export default async function ChallengesPage() {
  const { projectedTable } = await getPriaContent();
  const g = challenges.growingNeeds;
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />

      <section aria-label="Challenges" className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:row-span-2">
          <article
            id={g.id}
            className="relative flex h-full scroll-mt-24 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#063521] to-[#0B5D3B] p-7 text-white shadow-lift sm:p-8"
          >
            <TopoPattern className="text-white opacity-[0.14]" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Icon name={g.icon} className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold">{g.title}</h2>
            </div>
            <div className="relative mt-12">
              <p className="font-heading text-6xl font-extrabold tracking-tight sm:text-7xl">
                <CountUp value={g.stat.value} suffix={g.stat.suffix} />
              </p>
              <p className="mt-2 max-w-xs text-lg text-white/85">{g.stat.label}</p>
            </div>
          </article>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {challenges.items.map((c) => (
            <StaggerItem key={c.id}>
              <InsightCard id={c.id} title={c.title} icon={c.icon} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-label="Projected province and region outlook">
        <SectionHeader eyebrow="Towards 2047" title={projectedTable.title} />
        <Reveal>
          <ProvinceTable table={projectedTable} />
        </Reveal>
      </section>
    </div>
  );
}
