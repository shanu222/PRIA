import type { Metadata } from "next";
import { getPage } from "@/data/pria";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScopeTimeline } from "@/components/pria/ScopeTimeline";

const page = getPage("scope");
export const metadata: Metadata = { title: page.title, description: page.description };

export default function ScopePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <PageHeader demo="intro" eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />
      <div data-demo="scope" className="mx-auto w-full max-w-4xl">
        <ScopeTimeline />
      </div>
    </div>
  );
}
