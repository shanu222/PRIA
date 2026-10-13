import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSegment, segments } from "@/data/pria";
import { getContentSegment } from "@/data/content";
import { SegmentDetail } from "@/components/pria/SegmentDetail";

type Params = { segment: string };

export function generateStaticParams(): Params[] {
  return segments.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const segment = getSegment((await params).segment);
  if (!segment) return {};
  return {
    title: `Segment ${segment.number}: ${segment.title}`,
    description: segment.regions.join(" · "),
  };
}

export default async function SegmentPage({ params }: { params: Promise<Params> }) {
  const segment = await getContentSegment((await params).segment);
  if (!segment) notFound();
  return <SegmentDetail segment={segment} category={segment.categories[0]} />;
}
