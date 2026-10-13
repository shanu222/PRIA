/**
 * NDMA Disaster Resilient Infrastructure Models (DRIM): full-scale demonstration houses.
 *
 * Text is transcribed from the NDMA model display boards (one PDF per model). Photos, boards
 * and PDFs are stored in Cloudflare R2 under `drim/` and served by the PRIA API at `/assets/*`,
 * which the portal proxies as `/media/*`.
 */
import type { ProvinceId } from "./census";
import type { SegmentId } from "./pria";

export type DrimHazard = "earthquake" | "flood" | "landslide" | "heat-cold";

export const drimHazards: Record<DrimHazard, { label: string; icon: string; color: string }> = {
  earthquake: { label: "Earthquake", icon: "Activity", color: "#B45309" },
  flood: { label: "Flood", icon: "Waves", color: "#0E7490" },
  landslide: { label: "Landslide & slope failure", icon: "Mountain", color: "#7C3AED" },
  "heat-cold": { label: "Heat & cold", icon: "Thermometer", color: "#DC2626" },
};

export type DrimSystem = "timber-bamboo" | "masonry" | "earth" | "light-frame" | "elevated" | "slope";

export const drimSystems: Record<DrimSystem, string> = {
  "timber-bamboo": "Timber & bamboo frame",
  masonry: "Reinforced masonry",
  earth: "Earth construction",
  "light-frame": "Light steel & prefabricated",
  elevated: "Flood-elevated",
  slope: "Slope protection",
};

export type DrimRegion = { label: string; province: ProvinceId; segment?: SegmentId };

export type DrimModel = {
  slug: string;
  title: string;
  system: DrimSystem;
  hazards: DrimHazard[];
  features: string[];
  materials: string[];
  /** "Suitable regions" exactly as listed on the board, mapped to provinces and PRIA segments. */
  regions: DrimRegion[];
  /** Original photo is low resolution. */
  lowResPhoto?: boolean;
};

const hillyKP: DrimRegion = { label: "Upper Khyber Pakhtunkhwa (hilly)", province: "khyber-pakhtunkhwa", segment: "mountain" };
const hillyAJK: DrimRegion = { label: "Azad Jammu & Kashmir (hilly)", province: "azad-kashmir", segment: "mountain" };
const hillyGB: DrimRegion = { label: "Gilgit-Baltistan (hilly)", province: "gilgit-baltistan", segment: "mountain" };
const plainsKP: DrimRegion = { label: "Khyber Pakhtunkhwa plains", province: "khyber-pakhtunkhwa", segment: "riverine-plains" };
const plainsPunjab: DrimRegion = { label: "Punjab plains", province: "punjab", segment: "riverine-plains" };
const plainsSindh: DrimRegion = { label: "Sindh plains", province: "sindh", segment: "riverine-plains" };
const northernPunjab: DrimRegion = { label: "Northern Punjab", province: "punjab" };

export const drimModels: DrimModel[] = [
  {
    slug: "loh-kaat-timber-house-structure",
    title: "Loh-Kaat Timber House",
    system: "timber-bamboo",
    hazards: ["earthquake", "heat-cold"],
    features: [
      "Timber frame improves earthquake resistance",
      "Flexible wooden bands reduce wall cracking",
      "Use of timber reduces overall structural weight",
      "Cost-effective, uses local materials",
      "Good thermal performance maintains temperature",
    ],
    materials: ["Timber bands (kaat)", "Mud mortar on walls", "Wooden beams & columns", "Wood / CGI roof structure"],
    regions: [hillyKP, hillyAJK, hillyGB],
  },
  {
    slug: "timber-frame-lath-plaster",
    title: "Timber Frame with Lath & Plaster",
    system: "timber-bamboo",
    hazards: ["earthquake", "heat-cold"],
    features: [
      "Timber frame improves earthquake resistance",
      "Flexible wooden laths reduce wall cracking",
      "Cost-effective, uses locally available material",
      "Good thermal performance in cold climates",
      "Lightweight frame, rapid construction technique",
    ],
    materials: ["Timber laths", "Cement mortar on walls", "Wooden beams & columns", "CGI sheet roof structure"],
    regions: [hillyKP, hillyAJK, hillyGB],
  },
  {
    slug: "bamboo-frame-wattle-daub",
    title: "Bamboo Frame with Wattle & Daub",
    system: "timber-bamboo",
    hazards: ["earthquake", "heat-cold"],
    features: [
      "Cost-effective and locally available materials",
      "Flexible structure with good earthquake performance",
      "Lightweight system reduces seismic forces",
      "Environment-friendly with a low carbon footprint",
      "Good thermal insulation, easy repair and maintenance",
    ],
    materials: ["Bamboo pole frame", "Split bamboo strips (wattle)", "Mud mixed with straw (daub)", "Wooden strip roof"],
    regions: [
      { label: "Northern Azad Jammu & Kashmir", province: "azad-kashmir", segment: "mountain" },
      hillyGB,
      { label: "Balochistan plains", province: "balochistan", segment: "desert-arid" },
    ],
  },
  {
    slug: "cement-bamboo-frame-structure",
    title: "Cement Bamboo Frame Structure",
    system: "timber-bamboo",
    hazards: ["earthquake"],
    features: [
      "Improved earthquake resistance from a lightweight frame",
      "Crack control with wire-mesh reinforcement",
      "Cost-effective and suitable for low-income housing",
      "Uses locally available bamboo with an enhanced lifespan",
      "Faster construction than brick masonry",
    ],
    materials: ["Bamboo structural frame", "Wire mesh", "Cement plaster", "CGI roof sheets"],
    regions: [plainsKP, plainsSindh],
  },
  {
    slug: "confined-concrete-block-masonry-structure",
    title: "Confined Concrete Block Masonry",
    system: "masonry",
    hazards: ["earthquake"],
    features: [
      "Higher lateral resistance against seismic loads",
      "Improved seismic performance",
      "Higher structural stability and strength",
      "Better crack control",
      "Suitable for low to mid-rise buildings",
    ],
    materials: ["Solid concrete blocks", "Cement-sand mortar", "Reinforced concrete tie columns & bands"],
    regions: [{ ...hillyKP, label: "Khyber Pakhtunkhwa (hilly)" }, hillyAJK, hillyGB, northernPunjab],
  },
  {
    slug: "interlocking-brick-masonry-structure",
    title: "Interlocking Brick Masonry",
    system: "masonry",
    hazards: ["earthquake"],
    features: [
      "Reduced mortar usage (hollow bricks)",
      "Improved seismic performance (bands and rebars)",
      "Cost-effective, locally available materials",
      "Better load distribution",
      "Faster construction",
    ],
    materials: ["Cement-sand mortar", "Hollow bricks", "Steel rebars (12 mm)", "Concrete plinth, lintel & roof bands"],
    regions: [plainsPunjab, plainsSindh, plainsKP],
  },
  {
    slug: "rat-trap-bond-masonry-structure",
    title: "Rat-Trap Bond Masonry",
    system: "masonry",
    hazards: ["heat-cold"],
    features: [
      "Bricks placed on edge, forming a cavity",
      "15–25% brick saving compared with a conventional bond",
      "Reduced cement and mortar consumption",
      "Improved thermal insulation",
      "Lighter wall weight",
    ],
    materials: [
      "Burnt clay bricks",
      "Cement mortar, sand",
      "Steel bars with concrete in the cavity (where seismic reinforcement is needed)",
      "RCC lintel & roof bands",
    ],
    regions: [plainsPunjab, plainsSindh, plainsKP],
  },
  {
    slug: "fly-ash-masonry-structure",
    title: "Fly Ash Masonry",
    system: "masonry",
    hazards: ["heat-cold"],
    features: [
      "Recycled-material bricks of uniform size",
      "High compressive strength and durability",
      "Better thermal performance than clay brick",
      "Uses fly ash, an industrial by-product",
      "Cost-effective construction",
    ],
    materials: ["Fly ash bricks", "Cement mortar", "Reinforced concrete bands & lintels"],
    regions: [plainsSindh, { label: "Punjab (industrial zones)", province: "punjab", segment: "riverine-plains" }, plainsKP],
  },
  {
    slug: "earthbag-masonry-structure",
    title: "Earthbag Masonry",
    system: "earth",
    hazards: ["earthquake", "heat-cold"],
    features: [
      "Uses locally available soil or stone dust",
      "Excellent earthquake resistance",
      "Simple materials reduce construction cost",
      "Eco-friendly, low-carbon construction technique",
      "Good thermal insulation maintains indoor temperatures",
    ],
    materials: ["Polypropylene bags", "Compacted local soil", "Steel bars between layers", "RC lintels & bands"],
    regions: [{ ...hillyKP, label: "Khyber Pakhtunkhwa (hilly)" }, hillyAJK, hillyGB],
  },
  {
    slug: "reinforced-adobe-brick-structure",
    title: "Reinforced Adobe Brick",
    system: "earth",
    hazards: ["earthquake", "heat-cold"],
    features: [
      "Improved strength with cement or lime stabilisation",
      "Reinforcement controls cracking during earthquakes",
      "Good thermal performance reduces indoor heat",
      "Simple construction that local labour can execute",
      "Bricks made from local materials",
    ],
    materials: ["Stabilised adobe bricks", "Cement / lime stabilisation", "Wire mesh reinforcement", "RCC bands & lintels"],
    regions: [hillyAJK, hillyGB, { label: "Khyber Pakhtunkhwa seismic areas", province: "khyber-pakhtunkhwa", segment: "mountain" }],
  },
  {
    slug: "light-gauge-steel-house-structure",
    title: "Light Gauge Steel House",
    system: "light-frame",
    hazards: ["earthquake"],
    features: [
      "High strength-to-weight ratio, lightweight overall",
      "Rapid construction with steel sections",
      "Good earthquake performance due to ductility",
      "Termite-proof and rot-resistant structure",
      "Easy to expand, modify or repair",
    ],
    materials: ["Galvanised steel sections", "PVC sheathing", "Lightweight roofing sheets"],
    regions: [hillyAJK, hillyGB, { label: "Khyber Pakhtunkhwa (hilly & plains)", province: "khyber-pakhtunkhwa", segment: "mountain" }],
    lowResPhoto: true,
  },
  {
    slug: "pre-fabricated-house-structure",
    title: "Pre-Fabricated House",
    system: "light-frame",
    hazards: ["earthquake"],
    features: [
      "Lightweight structure improves seismic performance",
      "Minimal site labour, rapid construction",
      "Easy to transport, assemble and modify",
      "Sustainable, cost-effective, disaster-resilient design",
    ],
    materials: ["Precast sandwich panels", "Insulated wall & roof panels"],
    regions: [hillyAJK, northernPunjab, { ...hillyKP, label: "Khyber Pakhtunkhwa (hilly)" }],
  },
  {
    slug: "elevated-flood-resilient-house-structure",
    title: "Elevated Flood Resilient House",
    system: "elevated",
    hazards: ["flood"],
    features: [
      "Elevated design significantly reduces damage during seasonal flooding",
      "Strong columns provide stability and protect the structure from water impact",
      "Raised flooring improves airflow and prevents dampness",
    ],
    materials: [
      "RCC columns and slab",
      "Timber, brick masonry or lightweight panels",
      "Corrosion- and moisture-resistant materials",
    ],
    regions: [
      { label: "Riverine Sindh", province: "sindh", segment: "riverine-plains" },
      { label: "Riverine Punjab", province: "punjab", segment: "riverine-plains" },
      { label: "Coastal Sindh", province: "sindh", segment: "coastal" },
    ],
  },
  {
    slug: "raised-plinth-flood-resilient-house",
    title: "Raised Plinth Flood Resilient House",
    system: "elevated",
    hazards: ["flood"],
    features: [
      "House built on an elevated plinth foundation",
      "Protects living areas from floodwater entry",
      "Strong foundation resists water pressure",
      "Damp-proof flooring prevents moisture damage",
    ],
    materials: ["Concrete bricks", "Wooden structure", "Waterproofing materials on the raised plinth"],
    regions: [
      plainsKP,
      { label: "South Punjab plains", province: "punjab", segment: "riverine-plains" },
      { label: "Balochistan plains", province: "balochistan", segment: "desert-arid" },
    ],
  },
  {
    slug: "floating-amphibious-structure",
    title: "Floating Amphibious Structure",
    system: "elevated",
    hazards: ["flood"],
    features: [
      "Structure rises automatically as the water level increases",
      "Minimises permanent flood damage",
      "Lightweight superstructure reduces load on the system",
      "Damp-proof flooring prevents moisture",
    ],
    materials: [
      "Sealed plastic drums (buoyancy)",
      "Timber or lightweight bamboo superstructure",
      "Steel frame or RC frame",
    ],
    regions: [
      { label: "Sindh (flood-prone areas)", province: "sindh", segment: "riverine-plains" },
      { label: "South Punjab", province: "punjab", segment: "riverine-plains" },
      { label: "Coastal Balochistan", province: "balochistan", segment: "coastal" },
    ],
  },
  {
    slug: "geogrid-reinforced-retaining-wall-structure",
    title: "Geogrid Reinforced Retaining Wall",
    system: "slope",
    hazards: ["landslide"],
    features: [
      "Reinforced-soil structure using geogrid reinforcement",
      "Prevents soil erosion and slope failure",
      "Quick and easy construction",
      "Cost-effective compared with conventional concrete retaining walls",
      "Strong slope stabilisation",
    ],
    materials: ["Geogrid reinforcement", "Granular backfill soil", "Compacted soil layers", "Drainage pipes"],
    regions: [hillyKP, hillyAJK, hillyGB],
  },
];

export const drimSource = "NDMA Disaster Resilient Infrastructure Models (DRIM), model display boards";

export const drimMedia = {
  photo: (slug: string) => `/media/drim/images/${slug}.jpg`,
  thumb: (slug: string) => `/media/drim/thumbs/${slug}.jpg`,
  poster: (slug: string) => `/media/drim/posters/${slug}.jpg`,
  pdf: (slug: string) => `/media/drim/pdfs/${slug}.pdf`,
  download: (slug: string) => `/media/drim/pdfs/${slug}.pdf?download`,
};

export function getDrimModel(slug: string): DrimModel | undefined {
  return drimModels.find((m) => m.slug === slug);
}

export function modelProvinces(model: DrimModel): ProvinceId[] {
  return [...new Set(model.regions.map((r) => r.province))];
}

export function modelSegments(model: DrimModel): SegmentId[] {
  return [...new Set(model.regions.map((r) => r.segment).filter((s): s is SegmentId => Boolean(s)))];
}

export function modelsForProvince(province: ProvinceId): DrimModel[] {
  return drimModels.filter((m) => m.regions.some((r) => r.province === province));
}

export function modelsForSegment(segment: SegmentId): DrimModel[] {
  return drimModels.filter((m) => m.regions.some((r) => r.segment === segment));
}
