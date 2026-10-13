import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, segments } from "@/data/pria";
import { getContentSegment } from "@/data/content";
import { SegmentDetail } from "@/components/pria/SegmentDetail";

type Params = { segment: string; category: string };

export function generateStaticParams(): Params[] {
  return segments.flatMap((s) => s.categories.map((c) => ({ segment: s.slug, category: c.id })));
}

async function resolve(params: Promise<Params>) {
  const p = await params;
  const segment = await getContentSegment(p.segment);
  const category = segment ? getCategory(segment, p.category) : undefined;
  return { segment, category };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { segment, category } = await resolve(params);
  if (!segment || !category) return {};
  return {
    title: `${category.title} · Segment ${segment.number}: ${segment.shortTitle}`,
    description: `${category.title} for ${segment.title}.`,
  };
}

export default async function SegmentCategoryPage({ params }: { params: Promise<Params> }) {
  const { segment, category } = await resolve(params);
  if (!segment || !category) notFound();
  return <SegmentDetail segment={segment} category={category} />;
}
