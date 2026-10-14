import type { Metadata } from "next";
import { getPage, landscape } from "@/data/pria";
import { getPriaContent } from "@/data/content";
import { censusSource, housingTable } from "@/data/census";
import { PageHeader, SectionHeader } from "@/components/layout/PageHeader";
import { GLOW_ORDER, GlowStatTile, GlowTypeCard } from "@/components/pria/GlowCard";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { ProvinceCensusMap } from "@/components/pria/ProvinceCensusMap";
import { ProvinceTable } from "@/components/pria/ProvinceTable";
import { ResidentialDonut } from "@/components/pria/ResidentialDonut";
const page = getPage("landscape");
export const metadata: Metadata = { title: page.title, description: page.description };

export default async function LandscapePage() {
  const { provinceTable } = await getPriaContent();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <PageHeader
        demo="intro"
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        icon={page.icon}
        aside={
          <div className="w-full min-w-[240px] lg:w-64">
            <GlowStatTile stat={landscape.population} color="emerald" icon="Users" progress={35} />
          </div>
        }
      />

      <section data-demo="census" aria-labelledby="census" className="scroll-mt-24">
        <SectionHeader
          id="census"
          eyebrow="Census 2023"
          title="Population and housing at a glance"
          description={`${censusSource.label}.`}
        />
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {landscape.censusStats.map((s, i) => (
            <StaggerItem key={s.id}>
              <GlowStatTile stat={s} color={GLOW_ORDER[i % GLOW_ORDER.length]} image={`/cards/${s.id}.jpg`} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section data-demo="types" aria-labelledby="types" className="scroll-mt-24">
        <SectionHeader id="types" eyebrow="Classification" title="Types of Infrastructure" />
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {landscape.infrastructureTypes.map((t, i) => (
            <StaggerItem key={t.id}>
              <GlowTypeCard
                id={`type-${t.id}`}
                title={t.title}
                icon={t.icon}
                color={GLOW_ORDER[i % GLOW_ORDER.length]}
                image={`/cards/${t.id}.jpg`}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section data-demo="map" aria-labelledby="province-map" className="scroll-mt-24">
        <SectionHeader
          id="province-map"
          eyebrow="Interactive map"
          title="Provinces by density and housing quality"
          description="Choose a measure, then hover or select a province to compare it with the rest of Pakistan."
        />
        <Reveal>
          <ProvinceCensusMap />
        </Reveal>
      </section>

      <section data-demo="split" aria-labelledby="residential-split" className="scroll-mt-24">
        <SectionHeader
          id="residential-split"
          eyebrow="Residential"
          title="Urban and rural split"
          description="Share of the 38.29 million housing units in urban and rural areas, Census 2023."
        />
        <Reveal>
          <div className="rounded-2xl border border-emerald-400/35 bg-[linear-gradient(160deg,#04231d,#071417)] p-5 shadow-[0_0_32px_-14px_#34d399] sm:p-7">
            <ResidentialDonut data={landscape.residentialSplit} />
          </div>
        </Reveal>
      </section>

      <section data-demo="housing" aria-label="Housing and built stock by province">
        <SectionHeader eyebrow="By province" title={housingTable.title} />
        <Reveal>
          <ProvinceTable table={housingTable} />
        </Reveal>
      </section>

      {provinceTable.status === "available" && (
        <section aria-label="Province and region breakdown">
          <SectionHeader eyebrow="By province & region" title={provinceTable.title} />
          <Reveal>
            <ProvinceTable table={provinceTable} />
          </Reveal>
        </section>
      )}
    </div>
  );
}
