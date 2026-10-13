import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronRight, MapPin, Package } from "lucide-react";
import {
  drimModels,
  drimSource,
  drimSystems,
  getDrimModel,
  modelProvinces,
  modelSegments,
} from "@/data/drim";
import { segments } from "@/data/pria";
import { Icon } from "@/lib/icons";
import { HazardChip } from "@/components/pria/DrimCard";
import { DrimRegionMap } from "@/components/pria/DrimRegionMap";
import { DrimViewer } from "@/components/pria/DrimViewer";
import { Reveal, Stagger, StaggerItem } from "@/components/pria/Motion";
import { MapSourceNote } from "@/components/pria/PakistanMap";
import { segmentStyle } from "@/components/pria/SegmentCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return drimModels.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = getDrimModel((await params).slug);
  if (!model) return {};
  return { title: model.title, description: `${model.features[0]}. Suitable for ${model.regions.map((r) => r.label).join(", ")}.` };
}

export default async function DrimModelPage({ params }: Props) {
  const model = getDrimModel((await params).slug);
  if (!model) notFound();

  const index = drimModels.indexOf(model);
  const prev = drimModels[(index - 1 + drimModels.length) % drimModels.length];
  const next = drimModels[(index + 1) % drimModels.length];
  const modelSegs = segments.filter((s) => modelSegments(model).includes(s.id));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <header data-demo="intro" className="relative overflow-hidden rounded-3xl bg-[#07402A] px-6 py-10 text-white shadow-lift sm:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(110%_90%_at_100%_0%,#B45309_0%,transparent_50%),radial-gradient(90%_80%_at_0%_100%,#0E7490_0%,transparent_60%),linear-gradient(135deg,#063521,#0B5D3B)] opacity-90"
        />
        <div className="relative">
          <nav aria-label="Model breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              <li>
                <Link href="/drim" className="rounded hover:text-white hover:underline">
                  DRIM models
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="text-white">
                Model {String(index + 1).padStart(2, "0")} of {drimModels.length}
              </li>
            </ol>
          </nav>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{model.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/30 backdrop-blur">
              {drimSystems[model.system]}
            </span>
            {model.hazards.map((h) => (
              <HazardChip key={h} hazard={h} solid className="px-2.5 py-1 text-xs" />
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Reveal className="min-w-0">
          <div data-demo="viewer">
            <DrimViewer model={model} />
          </div>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col gap-5">
            <section
              data-demo="regions"
              aria-labelledby="regions"
              style={{ "--tone": "#b45309", "--tone-2": "#ea580c" } as React.CSSProperties}
              className="card-pro rounded-2xl bg-card p-5"
            >
            <h2 id="regions" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <MapPin className="h-4 w-4" aria-hidden />
              Suitable regions
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {model.regions.map((r) => (
                <li
                  key={r.label}
                  className="rounded-full border border-amber-600/30 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200"
                >
                  {r.label}
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-4 max-w-sm">
              <DrimRegionMap provinces={modelProvinces(model)} title={model.title} />
            </div>
            <MapSourceNote className="mt-2" />
          </section>

          {modelSegs.length > 0 && (
            <section
              aria-labelledby="segments"
              style={{ "--tone": "#4338ca", "--tone-2": "#0e7490" } as React.CSSProperties}
              className="card-pro rounded-2xl bg-card p-5"
            >
              <h2 id="segments" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                PRIA segments
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {modelSegs.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/segments/${s.slug}/residential`}
                      style={segmentStyle(s)}
                      className="group flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-all hover:-translate-y-px hover:border-[var(--seg)] hover:shadow-soft"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: s.colorStrong }}>
                        <Icon name={s.icon} className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-sm font-semibold">
                        Segment {s.number}: {s.shortTitle}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--seg)]" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section data-demo="features" aria-labelledby="features">
          <h2 id="features" className="mb-4 text-2xl font-bold">
            Salient features
          </h2>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {model.features.map((f, i) => (
              <StaggerItem key={f}>
                <div className="card-pro card-pro-lift group flex h-full gap-3 rounded-xl bg-card p-4">
                  <span className="tone-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-heading text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium leading-relaxed">{f}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section data-demo="materials" aria-labelledby="materials">
          <h2 id="materials" className="mb-4 text-2xl font-bold">
            Materials
          </h2>
          <Reveal>
            <ul className="card-pro flex flex-col gap-2 rounded-2xl bg-card p-5">
              {model.materials.map((m) => (
                <li key={m} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#047857] to-[#0e7490] text-white">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          </Reveal>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5" aria-hidden />
            Source: {drimSource}.
          </p>
        </section>
      </div>

      <nav aria-label="Other models" data-tones="" className="grid gap-3 sm:grid-cols-2">
        {[
          { m: prev, label: "Previous model", Icon: ArrowLeft, align: "" },
          { m: next, label: "Next model", Icon: ArrowRight, align: "sm:text-right sm:flex-row-reverse" },
        ].map(({ m, label, Icon: Arrow, align }) => (
          <Link
            key={label}
            href={`/drim/${m.slug}`}
            className={`card-pro card-pro-lift group flex items-center gap-3 rounded-xl bg-card p-4 ${align}`}
          >
            <span className="tone-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Arrow className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
              <span className="block truncate font-semibold">{m.title}</span>
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
