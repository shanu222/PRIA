import { site, summary, getPage } from "@/data/pria";
import { getPriaContent } from "@/data/content";
import { getIcon } from "@/lib/icons";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentPending } from "./ContentPending";
import { Reveal } from "./Motion";
import { TopoPattern } from "./TopoPattern";

export async function SummaryPage({ id, visionBanner = false }: { id: keyof typeof summary; visionBanner?: boolean }) {
  const page = getPage(id);
  const block = (await getPriaContent()).summary[id];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      {visionBanner && (
        <Reveal>
          <div className="relative flex items-center justify-between gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-[#063521] via-[#0B5D3B] to-[#0E7490] px-6 py-4 text-white shadow-soft">
            <TopoPattern className="text-white opacity-[0.15]" />
            <p className="relative font-heading text-sm font-semibold uppercase tracking-[0.18em]">{site.vision}</p>
            <p className="relative text-sm text-white/85">{site.closingLine}</p>
          </div>
        </Reveal>
      )}

      <PageHeader eyebrow={page.eyebrow} title={block.title} icon={page.icon} />

      <Reveal>
        <article className="card-pro rounded-2xl bg-card p-6 sm:p-10">
          {block.paragraphs.length > 0 ? (
            <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
              {block.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <ContentPending
              size="lg"
              title={block.title}
              icon={getIcon(page.icon)}
              message="Content for this section will be published here"
            />
          )}
        </article>
      </Reveal>
    </div>
  );
}
