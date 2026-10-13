import {
  challenges,
  landscape,
  needs,
  observations,
  pages,
  resourceObservations,
  scope,
  segments,
  stakeholders,
} from "@/data/pria";
import { housingTable } from "@/data/census";
import { disasterTimeline } from "@/data/hazards";
import { drimHazards, drimModels, drimSystems } from "@/data/drim";

export type SearchEntry = {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: string;
  keywords: string[];
  color?: string;
};

export type SearchGroup = { id: string; heading: string; entries: SearchEntry[] };

function anchor(pageId: string, id: string) {
  const page = pages.find((p) => p.id === pageId)!;
  return { href: `${page.href}#${id}`, hint: page.navLabel };
}

export function buildSearchIndex(): SearchGroup[] {
  const pageEntries: SearchEntry[] = pages.map((p) => ({
    id: `page-${p.id}`,
    label: p.title,
    hint: p.eyebrow,
    href: p.href,
    icon: p.icon,
    keywords: [p.navLabel, p.eyebrow],
    color: p.segmentId ? segments.find((s) => s.id === p.segmentId)?.color : undefined,
  }));

  const segmentEntries: SearchEntry[] = segments.map((s) => ({
    id: `segment-${s.slug}`,
    label: `Segment ${s.number}: ${s.title}`,
    hint: s.regions.join(", "),
    href: `/segments/${s.slug}`,
    icon: s.icon,
    keywords: s.regions,
    color: s.color,
  }));

  const categoryEntries: SearchEntry[] = segments.flatMap((s) =>
    s.categories.map((c) => ({
      id: `category-${s.slug}-${c.id}`,
      label: c.title,
      hint: `Segment ${s.number} · ${s.shortTitle}`,
      href: `/segments/${s.slug}/${c.id}`,
      icon: c.icon,
      keywords: [c.shortTitle, s.title, ...c.subSections.map((sub) => sub.title)],
      color: s.color,
    })),
  );

  const sectionEntries: SearchEntry[] = [
    { ...anchor("landscape", "types"), id: "sec-types", label: "Types of Infrastructure", icon: "Shapes", keywords: landscape.infrastructureTypes.map((t) => t.title) },
    { ...anchor("landscape", "residential-split"), id: "sec-split", label: "Residential split: Urban / Rural", icon: "House", keywords: ["urban", "rural", "census", "housing units"] },
    { ...anchor("landscape", "province-map"), id: "sec-map", label: "Pakistan map: provinces & housing", icon: "Map", keywords: ["map", "province", "census", "pacca", "kacha", "density"] },
    { ...anchor("landscape", housingTable.id), id: "sec-housing", label: housingTable.title, icon: "House", keywords: ["census", "housing", "pacca", "kacha", "province", "table"] },
    { ...anchor("challenges", challenges.projectedTable.id), id: "sec-projected", label: challenges.projectedTable.title, icon: "Map", keywords: ["province", "region", "2047", "table"] },
    { ...anchor("outlook", "population"), id: "sec-pop-2047", label: "Population projection 2026–2047", icon: "TrendingUp", keywords: ["population", "growth", "GHSL", "2047", "projection"] },
    { ...anchor("outlook", "provinces"), id: "sec-prov-2047", label: "Provincial outlook map 2047", icon: "Map", keywords: ["province", "buildings", "built-up", "2047", "map"] },
    { ...anchor("outlook", "housing"), id: "sec-housing-2047", label: "Buildings & residential units required", icon: "Building2", keywords: ["housing", "units", "buildings", "backlog", "scenario"] },
    { ...anchor("outlook", "districts"), id: "sec-districts", label: "Fastest-growing districts", icon: "TrendingUp", keywords: ["district", "Lahore", "Karachi", "Faisalabad", "Malir"] },
    { ...anchor("stakeholders", "flow"), id: "sec-flow", label: "NDMA (PRIA) → Policy Tier → Execution Tier", icon: "Users", keywords: ["flow", "tiers"] },
    { ...anchor("segments", "compare"), id: "sec-compare", label: "Compare segments × categories", icon: "LayoutGrid", keywords: ["matrix", "compare"] },
  ];

  const recommendationEntries: SearchEntry[] = segments.flatMap((s) =>
    s.categories.flatMap((c) =>
      c.subSections.flatMap((sub) =>
        sub.items.map((item) => ({
          id: `rec-${s.slug}-${c.id}-${sub.id}-${item.id}`,
          label: item.title,
          hint: `${s.shortTitle} · ${c.shortTitle} · ${sub.title}`,
          href: `/segments/${s.slug}/${c.id}`,
          icon: sub.icon,
          keywords: [...(item.tags ?? []), s.shortTitle, c.shortTitle],
          color: s.color,
        })),
      ),
    ),
  );

  const contentEntries: SearchEntry[] = [
    ...disasterTimeline.map((d) => ({
      ...anchor("hazards", d.id),
      id: `hz-${d.id}`,
      label: `${d.year}: ${d.title}`,
      icon: d.icon,
      keywords: ["disaster", "hazard", String(d.year)],
    })),
    ...[...observations.items, observations.trajectory].map((o) => ({
      ...anchor("observations", o.id),
      id: `obs-${o.id}`,
      label: o.title,
      icon: o.icon,
      keywords: ["observation"],
    })),
    ...[challenges.growingNeeds, ...challenges.items].map((c) => ({
      ...anchor("challenges", c.id),
      id: `chl-${c.id}`,
      label: c.title,
      icon: c.icon,
      keywords: ["challenge"],
    })),
    ...resourceObservations.map((r) => ({
      ...anchor("resources", r.id),
      id: `res-${r.id}`,
      label: r.title,
      icon: r.icon,
      keywords: ["resource"],
    })),
    ...needs.map((n) => ({
      ...anchor("needs", n.id),
      id: `need-${n.id}`,
      label: n.title,
      icon: n.icon,
      keywords: ["need", ...(n.chips ?? [])],
    })),
    ...scope.map((s) => ({
      ...anchor("scope", s.id),
      id: `scope-${s.id}`,
      label: s.title,
      icon: s.icon,
      keywords: ["scope"],
    })),
    ...stakeholders.tiers.flatMap((t) =>
      t.members.map((m) => ({
        ...anchor("stakeholders", m.id),
        id: `stk-${m.id}`,
        label: m.title,
        hint: t.title,
        icon: m.icon,
        keywords: ["stakeholder", t.title],
      })),
    ),
  ];

  const drimEntries: SearchEntry[] = drimModels.map((m) => ({
    id: `drim-${m.slug}`,
    label: m.title,
    hint: m.regions.map((r) => r.label).join(", "),
    href: `/drim/${m.slug}`,
    icon: "HousePlus",
    keywords: ["DRIM", "model", "house", drimSystems[m.system], ...m.hazards.map((h) => drimHazards[h].label), ...m.materials],
  }));

  return [
    { id: "pages", heading: "Pages", entries: pageEntries },
    { id: "drim", heading: "DRIM Resilient Models", entries: drimEntries },
    { id: "segments", heading: "Regional Segments", entries: segmentEntries },
    { id: "categories", heading: "Infrastructure Categories", entries: categoryEntries },
    { id: "sections", heading: "Sections", entries: sectionEntries },
    { id: "content", heading: "Content", entries: contentEntries },
    { id: "recommendations", heading: "Recommendations", entries: recommendationEntries },
  ];
}
