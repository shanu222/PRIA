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
    { ...anchor("landscape", "residential-split"), id: "sec-split", label: "Residential split: Urban / Rural", icon: "House", keywords: ["urban", "rural", "36%", "64%"] },
    { ...anchor("landscape", landscape.provinceTable.id), id: "sec-province", label: landscape.provinceTable.title, icon: "Map", keywords: ["province", "region", "table"] },
    { ...anchor("challenges", challenges.projectedTable.id), id: "sec-projected", label: challenges.projectedTable.title, icon: "Map", keywords: ["province", "region", "2047", "table"] },
    { ...anchor("stakeholders", "flow"), id: "sec-flow", label: "NDMA (PRIA) → Policy Tier → Execution Tier", icon: "Users", keywords: ["flow", "tiers"] },
    { ...anchor("segments", "compare"), id: "sec-compare", label: "Compare segments × categories", icon: "LayoutGrid", keywords: ["matrix", "compare"] },
  ];

  const contentEntries: SearchEntry[] = [
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

  return [
    { id: "pages", heading: "Pages", entries: pageEntries },
    { id: "segments", heading: "Regional Segments", entries: segmentEntries },
    { id: "categories", heading: "Infrastructure Categories", entries: categoryEntries },
    { id: "sections", heading: "Sections", entries: sectionEntries },
    { id: "content", heading: "Content", entries: contentEntries },
  ];
}
