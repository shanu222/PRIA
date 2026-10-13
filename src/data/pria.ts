/**
 * PRIA — single source of content for the portal.
 *
 * Every string shown in the UI (other than generic UI labels) comes from this file and
 * reflects the PRIA concept document. Sections the document leaves blank are marked
 * `status: "pending"` with empty `items` / `null` cells; components render a "Content Pending"
 * state from that, so filling data here replaces the pending UI automatically.
 */

import { national, provinces, type ProvinceCensus } from "./census";
import { getProvinceOutlook } from "./outlook";
import { baselineRecommendations } from "./recommendations";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ContentStatus = "available" | "pending" | "provisional";

/** Name of a lucide-react icon, resolved by `src/lib/icons.tsx`. */
export type IconName = string;

export type RecommendationItem = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
};

export type SubSection = {
  id: string;
  code: string;
  title: string;
  icon: IconName;
  status: ContentStatus;
  items: RecommendationItem[];
};

export type InfraCategory = {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  icon: IconName;
  subSections: SubSection[];
};

export type SegmentId = "mountain" | "riverine-plains" | "desert-arid" | "coastal";

export type Segment = {
  id: SegmentId;
  slug: SegmentId;
  number: 1 | 2 | 3 | 4;
  title: string;
  shortTitle: string;
  regions: string[];
  color: string;
  /** Darker shade of `color` with AA contrast for text on light surfaces. */
  colorStrong: string;
  icon: IconName;
  categories: InfraCategory[];
};

export type Stat = {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  note?: string;
  status: ContentStatus;
  /** Render the value without thousands separators (e.g. years). */
  plain?: boolean;
  decimals?: number;
  source?: string;
};

export type InfoItem = {
  id: string;
  code?: string;
  title: string;
  icon: IconName;
};

export type NavGroupId = "overview" | "national-context" | "framework" | "segments" | "solutions" | "summary";

export type PageMeta = {
  id: string;
  href: string;
  title: string;
  navLabel: string;
  group: NavGroupId;
  eyebrow: string;
  description: string;
  icon: IconName;
  /** Segment pages carry their segment colour into the shell. */
  segmentId?: SegmentId;
};

export type TableColumn = { id: string; label: string };

export type PendingTable = {
  id: string;
  title: string;
  caption: string;
  rowHeader: string;
  columns: TableColumn[];
  rows: { region: string; cells: Record<string, string | null> }[];
  status: ContentStatus;
};

export type TextBlock = {
  id: string;
  title: string;
  status: ContentStatus;
  paragraphs: string[];
};

/* -------------------------------------------------------------------------- */
/*                                    Site                                    */
/* -------------------------------------------------------------------------- */

export const site = {
  name: "Pakistan Resilient Infrastructure Atlas",
  shortName: "PRIA",
  organisation: "National Disaster Management Authority, Pakistan",
  organisationShort: "NDMA",
  tagline:
    "Identifying Pakistan's resilient infrastructure geometry for the next 20 years, towards 2047, using Digital Twins, AI models and spatial choreography.",
  vision: "Vision 2047",
  closingLine: "Pakistan Paindabaad",
  logo: "/ndma-logo.png",
} as const;

export const regions = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory",
] as const;

/* -------------------------------------------------------------------------- */
/*                         Infrastructure category template                   */
/* -------------------------------------------------------------------------- */

type SubSectionTemplate = Omit<SubSection, "status" | "items">;

const residentialSubSections: SubSectionTemplate[] = [
  { id: "material-options", code: "a", title: "Material Options", icon: "Layers" },
  { id: "design-options", code: "b", title: "Design Options (DRIM)", icon: "PenTool" },
  {
    id: "construction-methodology",
    code: "c",
    title: "Construction Methodology Alterations",
    icon: "HardHat",
  },
  { id: "no-go-areas", code: "d", title: "No Go Areas: Protected Flow Zones", icon: "Ban" },
  { id: "tourism-templates", code: "e", title: "Tourism Sites Related Templates", icon: "TreePalm" },
  { id: "maintenance", code: "f", title: "Regular Maintenance Solutions", icon: "Wrench" },
  {
    id: "e-infra-audit",
    code: "g",
    title: "E-Infra Audit: Periodic Needs, Format, Agencies",
    icon: "ClipboardCheck",
  },
  { id: "other-subjects", code: "h", title: "Other Subjects", icon: "Ellipsis" },
];

const standardSubSections: SubSectionTemplate[] = [
  { id: "material-options", code: "a", title: "Material Options", icon: "Layers" },
  { id: "design-options", code: "b", title: "Design Options (DRIM)", icon: "PenTool" },
  { id: "construction-methodologies", code: "c", title: "Construction Methodologies", icon: "HardHat" },
];

type CategoryTemplate = Omit<InfraCategory, "subSections"> & { subSections: SubSectionTemplate[] };

const categoryTemplates: CategoryTemplate[] = [
  {
    id: "residential",
    number: 1,
    title: "Residential Recommendations",
    shortTitle: "Residential",
    icon: "House",
    subSections: residentialSubSections,
  },
  {
    id: "commercial",
    number: 2,
    title: "Commercial Infra Recommendations",
    shortTitle: "Commercial",
    icon: "Store",
    subSections: standardSubSections,
  },
  {
    id: "communication",
    number: 3,
    title: "Communication Infra Recommendations",
    shortTitle: "Communication",
    icon: "RadioTower",
    subSections: standardSubSections,
  },
  {
    id: "strategic",
    number: 4,
    title: "Strategic Infra Recommendations",
    shortTitle: "Strategic",
    icon: "ShieldCheck",
    subSections: standardSubSections,
  },
  {
    id: "private-sector",
    number: 5,
    title: "Private Sector Recommendations",
    shortTitle: "Private Sector",
    icon: "Briefcase",
    subSections: standardSubSections,
  },
  {
    id: "industrial",
    number: 6,
    title: "Industrial Infra Recommendations",
    shortTitle: "Industrial",
    icon: "Factory",
    subSections: standardSubSections,
  },
];

/**
 * Recommendation content per segment → category → sub-section.
 * Add items here when the document provides them, e.g.
 * `mountain: { residential: { "material-options": [{ id: "m1", title: "..." }] } }`.
 */
export type RecommendationContent = Partial<
  Record<string, Partial<Record<string, Partial<Record<string, RecommendationItem[]>>>>>
>;

const recommendationContent: RecommendationContent = baselineRecommendations;

function buildCategories(segmentId: SegmentId, content: RecommendationContent): InfraCategory[] {
  return categoryTemplates.map((category) => ({
    ...category,
    subSections: category.subSections.map((sub) => {
      const items = content[segmentId]?.[category.id]?.[sub.id] ?? [];
      return { ...sub, items, status: items.length > 0 ? "available" : "pending" };
    }),
  }));
}

export const infraCategories = categoryTemplates.map(({ subSections, ...rest }) => ({
  ...rest,
  subSectionCount: subSections.length,
}));

/* -------------------------------------------------------------------------- */
/*                               Regional segments                            */
/* -------------------------------------------------------------------------- */

type SegmentBase = Omit<Segment, "categories">;

const segmentBases: SegmentBase[] = [
  {
    id: "mountain",
    slug: "mountain",
    number: 1,
    title: "Mountain Regions",
    shortTitle: "Mountain",
    regions: ["Gilgit-Baltistan", "North Khyber Pakhtunkhwa", "Azad Jammu & Kashmir"],
    color: "#3B82F6",
    colorStrong: "#1D4ED8",
    icon: "Mountain",
  },
  {
    id: "riverine-plains",
    slug: "riverine-plains",
    number: 2,
    title: "Riverine & Plains Regions",
    shortTitle: "Riverine & Plains",
    regions: ["Punjab", "South Khyber Pakhtunkhwa", "North Sindh"],
    color: "#16A34A",
    colorStrong: "#15803D",
    icon: "Waves",
  },
  {
    id: "desert-arid",
    slug: "desert-arid",
    number: 3,
    title: "Desert, Semi-Desert & Arid Regions",
    shortTitle: "Desert & Arid",
    regions: ["South Punjab", "Sindh", "Balochistan"],
    color: "#D97706",
    colorStrong: "#B45309",
    icon: "Sun",
  },
  {
    id: "coastal",
    slug: "coastal",
    number: 4,
    title: "Coastal Regions",
    shortTitle: "Coastal",
    regions: ["South Sindh", "Balochistan"],
    color: "#0891B2",
    colorStrong: "#0E7490",
    icon: "Anchor",
  },
];

/** Builds the segments, preferring `content` over the local recommendations for each sub-section. */
export function buildSegments(content: RecommendationContent = {}): Segment[] {
  return segmentBases.map((base) => ({
    ...base,
    categories: buildCategories(base.id, {
      ...recommendationContent,
      [base.id]: mergeSegmentContent(recommendationContent[base.id], content[base.id]),
    }),
  }));
}

function mergeSegmentContent(
  local: RecommendationContent[string],
  remote: RecommendationContent[string],
): RecommendationContent[string] {
  if (!remote) return local;
  const merged: NonNullable<RecommendationContent[string]> = { ...local };
  for (const [categoryId, subs] of Object.entries(remote)) {
    merged[categoryId] = { ...local?.[categoryId], ...subs };
  }
  return merged;
}

export const segments: Segment[] = buildSegments();

export function getSegment(slug: string): Segment | undefined {
  return segments.find((s) => s.slug === slug);
}

export function getCategory(segment: Segment, categoryId: string): InfraCategory | undefined {
  return segment.categories.find((c) => c.id === categoryId);
}

export function categoryStatus(category: InfraCategory): ContentStatus {
  return category.subSections.some((s) => s.items.length > 0) ? "available" : "pending";
}

export function segmentStatus(segment: Segment): ContentStatus {
  return segment.categories.some((c) => categoryStatus(c) === "available") ? "available" : "pending";
}

/* -------------------------------------------------------------------------- */
/*                                  Navigation                                */
/* -------------------------------------------------------------------------- */

export const navGroups: { id: NavGroupId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "national-context", label: "National Context" },
  { id: "framework", label: "Framework" },
  { id: "segments", label: "Regional Segments" },
  { id: "solutions", label: "Resilient Models" },
  { id: "summary", label: "Summary" },
];

/** Pages in document order. Drives the sidebar, breadcrumbs, Prev / Next and search. */
export const pages: PageMeta[] = [
  {
    id: "home",
    href: "/",
    title: "PRIA Overview",
    navLabel: "Home",
    group: "overview",
    eyebrow: "Overview",
    description: site.tagline,
    icon: "House",
  },
  {
    id: "landscape",
    href: "/landscape",
    title: "Infrastructural Landscape",
    navLabel: "Infrastructural Landscape",
    group: "national-context",
    eyebrow: "National Context",
    description: "Population, types of infrastructure and the residential split.",
    icon: "Map",
  },
  {
    id: "outlook",
    href: "/outlook",
    title: "Growth Outlook 2047",
    navLabel: "Growth Outlook 2047",
    group: "national-context",
    eyebrow: "National Context",
    description: "Population, buildings, housing need and built-up growth from 2026 to 2047, nationally and by province.",
    icon: "TrendingUp",
  },
  {
    id: "observations",
    href: "/observations",
    title: "Observations",
    navLabel: "Observations",
    group: "national-context",
    eyebrow: "National Context",
    description: "Key observations on the state of growth and planning.",
    icon: "Eye",
  },
  {
    id: "challenges",
    href: "/challenges",
    title: "Challenges",
    navLabel: "Challenges",
    group: "national-context",
    eyebrow: "National Context",
    description: "The pressures shaping infrastructure needs in the coming years.",
    icon: "TriangleAlert",
  },
  {
    id: "hazards",
    href: "/hazards",
    title: "Hazards & Disasters",
    navLabel: "Hazards & Disasters",
    group: "national-context",
    eyebrow: "National Context",
    description: "Recorded disasters, hazard exposure and housing vulnerability across Pakistan.",
    icon: "Activity",
  },
  {
    id: "cities",
    href: "/cities",
    title: "City Evidence",
    navLabel: "City Evidence",
    group: "national-context",
    eyebrow: "National Context",
    description:
      "Search a city and read the infrastructure problems that published papers and official assessments actually report for it.",
    icon: "BookOpen",
  },
  {
    id: "resources",
    href: "/resources",
    title: "Resource Observations",
    navLabel: "Resource Observations",
    group: "national-context",
    eyebrow: "National Context",
    description: "Gaps in capacity, standards, materials and controls.",
    icon: "Inbox",
  },
  {
    id: "needs",
    href: "/needs",
    title: "Needs",
    navLabel: "Needs",
    group: "framework",
    eyebrow: "Framework",
    description: "The requirements that drive resilient infrastructure.",
    icon: "Target",
  },
  {
    id: "scope",
    href: "/scope",
    title: "PRIA Scope",
    navLabel: "PRIA Scope",
    group: "framework",
    eyebrow: "Framework",
    description: "What the Pakistan Resilient Infrastructure Atlas sets out to do.",
    icon: "ListChecks",
  },
  {
    id: "stakeholders",
    href: "/stakeholders",
    title: "Key Stakeholders & Users",
    navLabel: "Stakeholders & Users",
    group: "framework",
    eyebrow: "Framework",
    description: "Policy and execution tiers of PRIA stakeholders and users.",
    icon: "Users",
  },
  {
    id: "segments",
    href: "/segments",
    title: "Regional Segments",
    navLabel: "All Segments",
    group: "segments",
    eyebrow: "Regional Segments",
    description: "Four resilience segments, each with six infrastructure categories.",
    icon: "LayoutGrid",
  },
  ...segments.map<PageMeta>((s) => ({
    id: `segment-${s.slug}`,
    href: `/segments/${s.slug}`,
    title: `Segment ${s.number}: ${s.title}`,
    navLabel: `Segment ${s.number} ${s.shortTitle}`,
    group: "segments",
    eyebrow: `Regional Segment ${s.number}`,
    description: s.regions.join(" · "),
    icon: s.icon,
    segmentId: s.id,
  })),
  {
    id: "drim",
    href: "/drim",
    title: "Disaster Resilient Infrastructure Models",
    navLabel: "DRIM Models",
    group: "solutions",
    eyebrow: "Resilient Models",
    description:
      "NDMA's full-scale resilient house models, with their features, materials and the provinces and regions each one suits.",
    icon: "HousePlus",
  },
  {
    id: "ndma-role",
    href: "/summary/ndma-role",
    title: "Role of NDMA",
    navLabel: "Role of NDMA",
    group: "summary",
    eyebrow: "Summary",
    description: "The role of the National Disaster Management Authority in PRIA.",
    icon: "Landmark",
  },
  {
    id: "responsibilities",
    href: "/summary/responsibilities",
    title: "Responsibilities of National Stakeholders & Area Governments",
    navLabel: "Stakeholder Responsibilities",
    group: "summary",
    eyebrow: "Summary",
    description: "Responsibilities of national stakeholders and area governments.",
    icon: "HeartHandshake",
  },
  {
    id: "conclusion",
    href: "/summary/conclusion",
    title: "Conclusion",
    navLabel: "Conclusion",
    group: "summary",
    eyebrow: "Summary",
    description: "Concluding remarks of the PRIA concept.",
    icon: "BookOpen",
  },
  {
    id: "end-state",
    href: "/summary/end-state",
    title: "Desired End State",
    navLabel: "Desired End State",
    group: "summary",
    eyebrow: "Summary",
    description: "The desired end state for Pakistan's resilient infrastructure.",
    icon: "Flag",
  },
];

export function getPage(id: string): PageMeta {
  const page = pages.find((p) => p.id === id);
  if (!page) throw new Error(`Unknown page id: ${id}`);
  return page;
}

/* -------------------------------------------------------------------------- */
/*                                    Home                                    */
/* -------------------------------------------------------------------------- */

export const home = {
  hero: {
    eyebrow: site.organisation,
    title: site.name,
    subtitle: site.tagline,
    primaryCta: { label: "Explore Regional Segments", href: "/segments" },
    secondaryCta: { label: "View PRIA Scope", href: "/scope" },
  },
  stats: [
    { id: "population", label: "Population (2026)", value: 255, suffix: " Mn", status: "available" },
    { id: "houses", label: "Houses needed", value: 31, suffix: " Mn", status: "available" },
    {
      id: "horizon",
      label: "Horizon",
      value: 2047,
      note: "Pakistan at 100 years",
      status: "available",
      plain: true,
    },
    { id: "segments", label: "Regional Segments", value: 4, status: "available" },
    { id: "categories", label: "Infrastructure Categories", value: 6, status: "available" },
  ] satisfies Stat[],
  glanceLinks: [
    { pageId: "landscape" },
    { pageId: "challenges" },
    { pageId: "needs" },
    { pageId: "scope" },
    { pageId: "stakeholders" },
    {
      pageId: "ndma-role",
      title: "Summary",
      description: "Role of NDMA, stakeholder responsibilities, conclusion and desired end state.",
    },
  ] as { pageId: string; title?: string; description?: string }[],
  roadmap: [
    { id: "national-context", label: "National Context", href: "/landscape" },
    { id: "needs", label: "Needs", href: "/needs" },
    { id: "scope", label: "Scope", href: "/scope" },
    { id: "stakeholders", label: "Stakeholders", href: "/stakeholders" },
    { id: "segments", label: "Regional Segments", href: "/segments" },
    { id: "summary", label: "Summary", href: "/summary/ndma-role" },
  ],
};

/* -------------------------------------------------------------------------- */
/*                          Infrastructural landscape                         */
/* -------------------------------------------------------------------------- */

const pendingCells = (columns: TableColumn[]) =>
  Object.fromEntries(columns.map((c) => [c.id, null])) as Record<string, string | null>;

const landscapeColumns: TableColumn[] = [
  { id: "residential-urban", label: "Residential (Urban)" },
  { id: "residential-rural", label: "Residential (Rural)" },
  { id: "commercial", label: "Commercial" },
  { id: "strategic", label: "Strategic" },
  { id: "communication", label: "Communication" },
  { id: "misc", label: "Misc" },
];

export const landscape = {
  population: {
    id: "population",
    label: "Population (2026)",
    value: 255,
    suffix: " Mn",
    status: "available",
  } satisfies Stat,
  infrastructureTypes: [
    { id: "residential", title: "Residential", icon: "House" },
    { id: "commercial", title: "Commercial", icon: "Store" },
    { id: "strategic", title: "Strategic", icon: "Shield" },
    { id: "communication", title: "Communication", icon: "RadioTower" },
    { id: "misc", title: "Misc", icon: "Shapes" },
  ] satisfies InfoItem[],
  /** Share of housing units, Census 2023 (PBS National Census Report, Table 5.2). */
  residentialSplit: [
    { id: "urban", label: "Urban", value: national.householdsUrbanPct, status: "available" as ContentStatus },
    { id: "rural", label: "Rural", value: national.householdsRuralPct, status: "available" as ContentStatus },
  ],
  censusStats: [
    {
      id: "census-population",
      label: "Population (Census 2023)",
      value: national.populationTotal / 1_000_000,
      suffix: " Mn",
      decimals: 2,
      note: "Incl. AJK & Gilgit-Baltistan",
      status: "available",
      source: "PBS",
    },
    {
      id: "housing-units",
      label: "Housing units",
      value: national.households / 1_000_000,
      suffix: " Mn",
      decimals: 2,
      note: "Up from 31.92 Mn in 2017",
      status: "available",
      source: "PBS",
    },
    {
      id: "pacca",
      label: "Pacca houses",
      value: national.paccaPct,
      suffix: "%",
      decimals: 1,
      note: `${national.kachaPct}% kacha, ${national.semiPaccaPct}% semi-pacca`,
      status: "available",
      source: "PBS",
    },
    {
      id: "single-room",
      label: "Single-room homes",
      value: national.singleRoomPct,
      suffix: "%",
      decimals: 1,
      note: `Average household: ${national.householdSize} persons`,
      status: "available",
      source: "PBS",
    },
  ] satisfies Stat[],
  provinceTable: {
    id: "province-breakdown",
    title: "Province & Region Breakdown",
    caption: "Infrastructure by type across provinces and regions.",
    rowHeader: "Province / Region",
    columns: landscapeColumns,
    rows: regions.map((region) => ({ region, cells: pendingCells(landscapeColumns) })),
    status: "pending",
  } satisfies PendingTable,
};

/* -------------------------------------------------------------------------- */
/*                                Observations                                */
/* -------------------------------------------------------------------------- */

export const observations = {
  items: [
    { id: "fragmented-growth", code: "1", title: "Fragmented growth", icon: "Puzzle" },
    { id: "over-saturated", code: "2", title: "Over-saturated few urbans", icon: "Building2" },
    { id: "reducing-land", code: "3", title: "Reducing land", icon: "Shrink" },
    { id: "encroachments", code: "4", title: "Encroachments", icon: "Fence" },
    { id: "no-spatial-planning", code: "5", title: "No formal spatial planning", icon: "MapPinOff" },
  ] satisfies InfoItem[],
  trajectory: {
    id: "population-trajectory",
    code: "6",
    title: "Population trajectory: next 20 years",
    icon: "TrendingUp",
    from: { year: 2026, label: "Today" },
    to: { year: 2047, label: "Pakistan 100 years old" },
  },
};

/* -------------------------------------------------------------------------- */
/*                                 Challenges                                 */
/* -------------------------------------------------------------------------- */

function housingStatus(p?: ProvinceCensus): string | null {
  if (!p) return null;
  const pop = `${(p.population / 1_000_000).toFixed(2)} Mn people`;
  if (!p.households) return `${pop} (Census 2023)`;
  return `${pop}; ${(p.households / 1_000_000).toFixed(2)} Mn housing units; ${p.paccaPct}% pacca, ${p.kachaPct}% kacha`;
}

const byName = (name: string) => provinces.find((p) => p.name === name);

function projectedNeed(name: string): string | null {
  const census = byName(name);
  const o = census ? getProvinceOutlook(census.id) : undefined;
  if (!o) return null;
  const mn = (n: number) => (n / 1_000_000).toFixed(2);
  return `${o.pop2047.toFixed(2)} Mn people (${o.pop2026.toFixed(2)} Mn in 2026); buildings ${mn(o.buildings2026)} → ${mn(o.buildings2047)} Mn; built-up ${o.coverage2026}% → ${o.coverage2047}% of area`;
}

const regionOutlook: Record<string, Record<string, string | null>> = {
  Punjab: {
    "current-status": housingStatus(byName("Punjab")),
    "key-challenge":
      "Riverine floods on the Indus, Jhelum, Chenab, Ravi and Sutlej and hill torrents from the Koh-e-Suleman (223 deaths in 2022); urban flooding, heat and smog in fast-growing cities.",
  },
  Sindh: {
    "current-status": housingStatus(byName("Sindh")),
    "key-challenge":
      "Worst hit in 2022 (799 deaths); 61% of rural houses are kacha and 50% of homes have a single room; extreme heat (2015 heatwave) and cyclone and surge exposure on the coast.",
  },
  "Khyber Pakhtunkhwa": {
    "current-status": housingStatus(byName("Khyber Pakhtunkhwa")),
    "key-challenge":
      "Flash floods and landslides (309 deaths and 326,897 houses damaged in 2022), GLOF risk in the north and high seismic hazard in Hazara and Malakand.",
  },
  Balochistan: {
    "current-status": housingStatus(byName("Balochistan")),
    "key-challenge":
      "Least durable housing stock (61% mud or unbaked-brick walls); 426,897 houses damaged and 336 deaths in 2022; drought and extreme heat (53.7 °C at Turbat, 2017).",
  },
  "Gilgit-Baltistan": {
    "current-status": housingStatus(byName("Gilgit-Baltistan")),
    "key-challenge":
      "Glacial lake outburst floods (3,044 glacial lakes in GB and KP, 33 hazardous), landslides that cut the Karakoram Highway, and seismic hazard.",
  },
  "Azad Jammu & Kashmir": {
    "current-status": housingStatus(byName("Azad Jammu & Kashmir")),
    "key-challenge":
      "Epicentre of the 2005 Mw 7.6 earthquake (33,724 deaths in Muzaffarabad district alone); landslides and flash floods in the Neelum and Jhelum valleys.",
  },
  "Islamabad Capital Territory": {
    "current-status": housingStatus(byName("Islamabad Capital Territory")),
    "key-challenge":
      "Highest density in the country (2,609 persons per km²) and the largest share of structures under construction (6.56%), putting pressure on land, drainage and building control.",
  },
};

const projectedColumns: TableColumn[] = [
  { id: "current-status", label: "Current Status" },
  { id: "projected-need", label: "Projected Need (2047)" },
  { id: "key-challenge", label: "Key Challenge" },
];

export const challenges = {
  growingNeeds: {
    id: "growing-needs",
    title: "Growing needs",
    icon: "HousePlus",
    stat: { value: 31, suffix: " Mn", label: "houses to be built in the coming years" },
  },
  items: [
    { id: "shrinking-land", title: "Shrinking available land", icon: "Shrink" },
    {
      id: "water-food",
      title: "Increasing water stress & acute food security",
      icon: "Droplets",
    },
    { id: "unemployment", title: "Unemployment-related indifference", icon: "UserX" },
    {
      id: "strategic-capacity",
      title: "Lack of strategic infrastructure development capacity",
      icon: "Construction",
    },
    {
      id: "tourism-zones",
      title: "High-priced tourism zones lacking any planned growth & development",
      icon: "TreePalm",
    },
  ] satisfies InfoItem[],
  projectedTable: {
    id: "projected-breakdown",
    title: "Projected Province & Region Outlook",
    caption:
      "Current status (PBS Census 2023), projected 2047 population, buildings and built-up coverage (PRIA GHSL and Open Buildings series) and key challenge per province and region.",
    rowHeader: "Province / Region",
    columns: projectedColumns,
    rows: regions.map((region) => ({
      region,
      cells: { ...pendingCells(projectedColumns), ...regionOutlook[region], "projected-need": projectedNeed(region) },
    })),
    status: "available",
  } satisfies PendingTable,
};

/* -------------------------------------------------------------------------- */
/*                            Resource observations                           */
/* -------------------------------------------------------------------------- */

export const resourceObservations: InfoItem[] = [
  { id: "design-capacities", title: "Mediocre design capacities", icon: "PencilRuler" },
  { id: "standard-of-works", title: "Poor standard of works (no highly skilled HR)", icon: "HardHat" },
  {
    id: "no-training",
    title: "No formal institutional training for builders, contractors and artisans",
    icon: "GraduationCap",
  },
  {
    id: "corruption-materials",
    title: "Corruption and lack of affordable resilient materials",
    icon: "Scale",
  },
  { id: "quality-control", title: "Poor quality control & laws monitoring system", icon: "ClipboardX" },
  { id: "best-practices", title: "Violation of best practices", icon: "Ban" },
  {
    id: "encroachment-controls",
    title: "No encroachment controls by building control authorities",
    icon: "ShieldOff",
  },
  {
    id: "global-marvels",
    title: "Hardly any infrastructure equivalent to global marvels",
    icon: "Landmark",
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Needs                                   */
/* -------------------------------------------------------------------------- */

export const needs: (InfoItem & { chips?: string[] })[] = [
  {
    id: "climate-exposure",
    code: "a",
    title: "Climate & natural disaster exposure–driven requirements",
    icon: "CloudLightning",
  },
  { id: "social-imperatives", code: "b", title: "Social imperatives", icon: "Users" },
  {
    id: "vertical-solutions",
    code: "c",
    title: "Lesser spaces push for vertical solutions rather than expanding areas",
    icon: "ArrowUpFromLine",
  },
  {
    id: "water-recycling",
    code: "d",
    title:
      "Water scarcity drives repeated recycling & reuse, including modern rainwater harvesting systems embedded in all types of infrastructure",
    icon: "Recycle",
  },
  {
    id: "water-storage",
    code: "e",
    title: "Innovative plans to add water storage beyond dams",
    icon: "Droplets",
    chips: ["Wetlands", "Glacial basins", "Hill torrent basins", "Coastal harvest belts", "Desalination"],
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Scope                                   */
/* -------------------------------------------------------------------------- */

export type ScopeGroupId = "planning" | "methods" | "institutions" | "finance";

export const scopeGroups: { id: ScopeGroupId; label: string; range: string }[] = [
  { id: "planning", label: "Planning", range: "a–d" },
  { id: "methods", label: "Methods & Standards", range: "e–h" },
  { id: "institutions", label: "Institutions", range: "i" },
  { id: "finance", label: "Finance & Risk", range: "j–k" },
];

export const scope: (InfoItem & { group: ScopeGroupId })[] = [
  {
    id: "geometry",
    code: "a",
    group: "planning",
    icon: "BrainCircuit",
    title:
      "Identify specific infrastructure geometry for the next 20 years (2047) using Digital Twins, AI Models and spatial choreography",
  },
  {
    id: "saturation",
    code: "b",
    group: "planning",
    icon: "Gauge",
    title: "Determine saturation thresholds of major urban areas",
  },
  {
    id: "smaller-towns",
    code: "c",
    group: "planning",
    icon: "Sprout",
    title: "Add smaller towns close to new wetlands (where additional agriculture space is also possible)",
  },
  { id: "new-areas", code: "d", group: "planning", icon: "MapPinPlus", title: "Suggest new areas" },
  {
    id: "best-practices",
    code: "e",
    group: "methods",
    icon: "Globe",
    title: "Global best practices (AI-driven academic resources customized for Pakistan)",
  },
  {
    id: "innovative-methods",
    code: "f",
    group: "methods",
    icon: "Lightbulb",
    title: "Innovative, cost-effective and efficient methods",
  },
  {
    id: "cultural",
    code: "g",
    group: "methods",
    icon: "HeartHandshake",
    title: "Culturally acceptable solutions",
  },
  {
    id: "local-materials",
    code: "h",
    group: "methods",
    icon: "Boxes",
    title: "Maximized use of local materials",
  },
  {
    id: "federal-institutes",
    code: "i",
    group: "institutions",
    icon: "School",
    title:
      "Establishment of Federal Institutes: formal development of builders, contractors, on-site infrastructure subject matter experts, related industries, protected sites for raw materials",
  },
  {
    id: "inbuilt-resilience",
    code: "j",
    group: "finance",
    icon: "Wallet",
    title:
      "Solutions for regular development initiatives with inbuilt resilience, or creating financial space to make ongoing works more resilient",
  },
  {
    id: "loss-margin",
    code: "k",
    group: "finance",
    icon: "Umbrella",
    title: "Keep a margin for infrastructure destruction losses due to potential recurring natural disasters",
  },
];

/* -------------------------------------------------------------------------- */
/*                                Stakeholders                                */
/* -------------------------------------------------------------------------- */

export type StakeholderTierData = {
  id: string;
  title: string;
  icon: IconName;
  members: InfoItem[];
};

export const stakeholders = {
  flow: [
    { id: "ndma", label: "NDMA (PRIA)", icon: "Landmark" },
    { id: "policy", label: "Policy Tier", icon: "Scale" },
    { id: "execution", label: "Execution Tier", icon: "HardHat" },
  ],
  tiers: [
    {
      id: "policy",
      title: "Policy Tier",
      icon: "Scale",
      members: [
        { id: "housing", title: "Federal Ministry of Housing", icon: "Landmark" },
        { id: "planning", title: "Federal Ministry of Planning", icon: "Landmark" },
        { id: "finance", title: "Federal Ministry of Finance", icon: "Landmark" },
        { id: "ipc", title: "Federal Ministry of Inter Provincial Coordination", icon: "Landmark" },
        { id: "provincial", title: "Provincial Governments", icon: "Building" },
        { id: "ajk", title: "Government of AJ&K", icon: "Flag" },
        { id: "gb", title: "Government of GB", icon: "Flag" },
      ],
    },
    {
      id: "execution",
      title: "Execution Tier",
      icon: "HardHat",
      members: [
        { id: "academia", title: "Academia related to infrastructure education", icon: "GraduationCap" },
        { id: "designers", title: "National designer groups & organisations", icon: "PenTool" },
        { id: "architects", title: "National architects", icon: "DraftingCompass" },
        {
          id: "lea",
          title: "Law enforcement agencies (for encroachment controls)",
          icon: "ShieldCheck",
        },
        { id: "private", title: "Private sector", icon: "Briefcase" },
        { id: "providers", title: "Goods & materials provider associations", icon: "Truck" },
        { id: "quarries", title: "Raw material quarry sites", icon: "Pickaxe" },
      ],
    },
  ] satisfies StakeholderTierData[],
};

/* -------------------------------------------------------------------------- */
/*                                   Summary                                  */
/* -------------------------------------------------------------------------- */

export const summary: Record<"ndma-role" | "responsibilities" | "conclusion" | "end-state", TextBlock> = {
  "ndma-role": {
    id: "ndma-role",
    title: "Role of NDMA",
    status: "available",
    paragraphs: [
      "The National Disaster Management Authority is the lead federal agency for disaster management in Pakistan under the National Disaster Management Act, 2010. It is the executive arm of the National Disaster Management Commission, chaired by the Prime Minister, and works through the Provincial Disaster Management Authorities, the State Disaster Management Authority in Azad Jammu & Kashmir, the Gilgit-Baltistan Disaster Management Authority and the District Disaster Management Authorities.",
      "Under the Act, NDMA prepares the National Disaster Management Plan, lays down guidelines for federal ministries, provincial governments and their authorities, and coordinates preparedness, response and recovery. PRIA extends that mandate from responding to disasters to shaping what is built, so that the 2.29 million houses, 13,115 km of roads and 439 bridges damaged in the 2022 floods are not exposed in the same way again.",
      "Within PRIA, NDMA sits at the head of the stakeholder chain, ahead of the Policy Tier and the Execution Tier. It owns the atlas, sets the hazard-informed recommendations for each of the four regional segments and six infrastructure categories, defines the no-go areas and protected flow zones, and runs the periodic E-Infra Audit that checks whether recommendations are being applied on the ground.",
      "NDMA also anchors the data behind PRIA: Census 2023 housing statistics, hazard and damage records from past disasters, and the Digital Twin and AI models used to identify Pakistan's infrastructure geometry towards 2047.",
    ],
  },
  responsibilities: {
    id: "responsibilities",
    title: "Responsibilities of National Stakeholders & Area Governments",
    status: "available",
    paragraphs: [
      "Policy Tier. The Federal Ministries of Housing, Planning, Finance and Inter Provincial Coordination translate PRIA into national housing policy, the development programme, financing windows and inter-provincial agreements. Provincial Governments, the Government of AJ&K and the Government of GB adopt PRIA's segment recommendations into their building by-laws, land-use plans and annual development programmes, and enforce no-go areas through their building control authorities.",
      "Execution Tier. Academia builds the curricula and training for resilient design and construction; national designer groups and architects turn the recommendations into approved design templates; the private sector, goods and materials provider associations and raw-material quarry sites supply tested, affordable resilient materials; and law enforcement agencies support building control authorities in removing and preventing encroachments on protected flow zones.",
      "Area governments carry the day-to-day responsibility: issuing permits only against PRIA-compliant designs, maintaining drains, embankments and slopes before each monsoon and winter, keeping registers of the housing stock, and reporting through the E-Infra Audit so that NDMA can update the atlas.",
      "All stakeholders share responsibility for data: using Census 2023 housing figures, hazard maps and post-disaster damage assessments as the common baseline, so that federal, provincial and district plans describe the same Pakistan.",
    ],
  },
  conclusion: {
    id: "conclusion",
    title: "Conclusion",
    status: "available",
    paragraphs: [
      "Pakistan's population reached 241.5 million in the four provinces and ICT at the 2023 Census, growing at 2.55% a year, and the country counted 38.3 million housing units, one in five of them kacha. Growth has been fragmented, a few cities are over-saturated, land is shrinking and there is no formal spatial planning. At the same time, the 2005 earthquake, the 2010 and 2022 floods, the 2015 heatwave and Cyclone Biparjoy in 2023 have shown how exposed that growth is.",
      "PRIA responds by dividing the country into four regional resilience segments (Mountain, Riverine & Plains, Desert & Arid, and Coastal) and setting recommendations for six infrastructure categories in each, from material options and DRIM design options to construction methods, no-go areas, maintenance and periodic audit.",
      "Resilience will come less from new dams and embankments alone than from millions of everyday decisions about where and how houses, markets, roads and networks are built. PRIA gives those decisions a common, hazard-informed reference for the next twenty years.",
    ],
  },
  "end-state": {
    id: "end-state",
    title: "Desired End State",
    status: "available",
    paragraphs: [
      "By 2047, when Pakistan turns 100, every new building and infrastructure project is planned against the hazards of its regional segment and built to its PRIA recommendations, using Digital Twins and AI models to place growth where land, water and safety allow.",
      "Major urban areas grow within known saturation thresholds, while new and smaller towns develop near new wetlands and agricultural land. Vertical solutions replace sprawl, and protected flow zones along rivers, hill torrents, glacial outburst paths and the coast stay free of construction.",
      "Kacha and unsafe housing has been replaced or retrofitted with culturally acceptable, cost-effective designs that make the most of local materials. Water is harvested, stored and reused in every type of infrastructure, and storage extends beyond dams to wetlands, glacial and hill-torrent basins, coastal harvest belts and desalination.",
      "Federal institutes train builders, contractors and on-site experts; standards are enforced by building control authorities; development budgets carry inbuilt resilience and a margin for recurring disaster losses; and the E-Infra Audit keeps the atlas current, so that the next flood, earthquake or cyclone finds Pakistan prepared.",
    ],
  },
};
