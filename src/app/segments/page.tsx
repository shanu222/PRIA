import type { Metadata } from "next";
import { getPage } from "@/data/pria";
import { getPriaContent } from "@/data/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/pria/Motion";
import { SegmentCard } from "@/components/pria/SegmentCard";
import { SegmentCompareMatrix } from "@/components/pria/SegmentCompareMatrix";
import { SegmentsHubView } from "@/components/pria/SegmentsHubView";

const page = getPage("segments");
export const metadata: Metadata = { title: page.title, description: page.description };

export default async function SegmentsPage() {
  const { segments } = await getPriaContent();
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <PageHeader
        demo="intro"
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        icon={page.icon}
        aside={
          <ul className="flex gap-2" aria-label="Segment colours">
            {segments.map((s) => (
              <li
                key={s.id}
                className="flex h-10 w-10 items-center justify-center rounded-xl font-heading text-sm font-bold text-white shadow-soft"
                style={{ background: s.colorStrong }}
                title={s.title}
              >
                <span className="sr-only">Segment </span>
                {s.number}
              </li>
            ))}
          </ul>
        }
      />
      <SegmentsHubView
        cards={
          <Stagger className="grid gap-6 md:grid-cols-2">
            {segments.map((s) => (
              <StaggerItem key={s.id}>
                <SegmentCard segment={s} />
              </StaggerItem>
            ))}
          </Stagger>
        }
        compare={<SegmentCompareMatrix segments={segments} />}
      />
    </div>
  );
}
