import { provinces } from "@/data/census";
import { evidenceSources } from "@/data/city-evidence";
import { drimHazards, drimModels, drimSystems, getDrimModel } from "@/data/drim";
import { outlookHeadlines } from "@/data/outlook";
import { getCategory, getSegment, site } from "@/data/pria";

export type DemoStep = {
  id: string;
  title: string;
  script: string;
  prepare?: () => void;
};

const HOME: DemoStep[] = [
  {
    id: "hero",
    title: "The atlas",
    script:
      "This is the Pakistan Resilient Infrastructure Atlas, prepared for the National Disaster Management Authority. It sets where and how Pakistan should build, through Vision 2047.",
  },
  {
    id: "figures",
    title: "The scale",
    script:
      "These figures frame the work. About 255 million people in 2026. About 31 million houses still needed. The horizon is 2047, when Pakistan turns one hundred. The country is read as four regional segments and six kinds of infrastructure.",
  },
  {
    id: "glance",
    title: "The path through the portal",
    script:
      "At a glance, the portal moves from the national picture, to the challenges and needs, to the scope and the stakeholders, and on to the summary of NDMA’s role.",
  },
  {
    id: "segments",
    title: "Four grounds",
    script:
      "Pakistan is divided into four grounds. The mountain segment is selected here. Then riverine and plains, desert and arid, and the coast. A house that is safe on one ground can fail on another.",
    prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segment", { detail: "mountain" })),
  },
  {
    id: "models",
    title: "How to build",
    script:
      "NDMA’s disaster resilient house models show how to build for earthquakes, floods, landslides, and extreme heat and cold. Each model is matched to the provinces it suits.",
  },
  {
    id: "disasters",
    title: "Why resilience",
    script:
      "The atlas is shaped by recorded disasters. The 2005 earthquake, the Indus floods, the 2015 heatwave, the 2022 floods, and Cyclone Biparjoy. The aim is to avoid building back into the same hazard.",
  },
  {
    id: "roadmap",
    title: "How the portal is organised",
    script:
      "Follow the portal in this order. National context, needs, scope, stakeholders, the regional segments, and the summary. That is the path through PRIA.",
  },
];

const STATIC: Record<string, DemoStep[]> = {
  "/": HOME,
  "/landscape": [
    {
      id: "intro",
      title: "Infrastructural landscape",
      script:
        "The infrastructural landscape. Population, the types of infrastructure, and how housing is split between urban and rural Pakistan.",
    },
    {
      id: "census",
      title: "Census 2023",
      script: "Census 2023 at a glance. Population and housing for the country, from the Pakistan Bureau of Statistics.",
    },
    {
      id: "types",
      title: "Types of infrastructure",
      script: "Infrastructure is read here as residential, commercial, strategic, communication, and miscellaneous.",
    },
    {
      id: "map",
      title: "Provinces",
      script:
        "The map compares provinces by density and housing quality. Choose a measure, then a province, to set it against the rest of Pakistan.",
    },
    {
      id: "split",
      title: "Urban and rural",
      script: "The urban and rural share of about 38.29 million housing units, Census 2023.",
    },
    {
      id: "housing",
      title: "Housing by province",
      script: "Housing and built stock, province by province, from the census tables on this page.",
    },
  ],
  "/outlook": [
    {
      id: "intro",
      title: "Growth outlook",
      script: "Growth outlook to 2047. Population, buildings, housing need and built-up land, for the country and by province.",
    },
    {
      id: "headlines",
      title: "Headline figures",
      script:
        "By 2047 the outlook reads about 386 million people, up from 255 million in 2026, with the housing stock and the urban share rising alongside.",
    },
    {
      id: "population",
      title: "Population",
      script: "National population, growing about 2 percent a year, toward 386 million in 2047.",
    },
    {
      id: "provinces",
      title: "Where growth concentrates",
      script: "Provincial outlook for 2026 and 2047. This is where population and building are expected to concentrate.",
    },
    {
      id: "housing",
      title: "Buildings and homes",
      script: "Building stock nearly doubles by 2047. Beside it, the residential units required over the same years.",
    },
    {
      id: "urban",
      title: "Urban and rural",
      script: "Urban population is growing about twice as fast as rural population.",
    },
    {
      id: "coverage",
      title: "Built-up land",
      script: `Built-up land more than doubles. Coverage in 2047 is about ${outlookHeadlines.coverageMultiple2047} times the 2020 figure.`,
    },
    {
      id: "districts",
      title: "Fastest districts",
      script: "The districts expected to grow the most over this horizon.",
    },
  ],
  "/observations": [
    {
      id: "intro",
      title: "Observations",
      script: "Key observations on growth and planning, before the atlas turns to challenges and needs.",
    },
    {
      id: "cards",
      title: "Five observations",
      script:
        "Fragmented growth. A few cities over-saturated. Land reducing. Encroachments. And no formal spatial planning.",
    },
    {
      id: "trajectory",
      title: "Population trajectory",
      script: "The sixth observation is the population trajectory, from 2026 to 2047, when Pakistan turns one hundred.",
    },
  ],
  "/challenges": [
    {
      id: "intro",
      title: "Challenges",
      script: "The pressures that shape what Pakistan has to build in the coming years.",
    },
    {
      id: "pressures",
      title: "The pressures",
      script:
        "About 31 million houses still to be built. Beside that: shrinking land, water stress and food security, unemployment, thin strategic capacity, and tourism zones without a plan.",
    },
    {
      id: "outlook",
      title: "Towards 2047",
      script: "The projected province and region outlook sets those pressures against population, buildings and built-up land in 2047.",
    },
  ],
  "/hazards": [
    {
      id: "intro",
      title: "Hazards and disasters",
      script: "Recorded disasters, hazard exposure, and where housing is most vulnerable.",
    },
    {
      id: "timeline",
      title: "Two decades",
      script:
        "The Kashmir earthquake of 2005, the Indus floods, the 2015 heatwave, the 2022 floods, and Cyclone Biparjoy. Each one exposed a different weakness in how and where Pakistan builds.",
    },
    {
      id: "profiles",
      title: "By segment",
      script: "Each regional segment carries its own hazard profile. The recommendations on that ground are written against these hazards.",
    },
    {
      id: "vulnerable",
      title: "Vulnerable housing",
      script: "Where housing is most vulnerable. Pacca and kacha stock, density and urban share are compared on the landscape map.",
    },
  ],
  "/research": [
    {
      id: "intro",
      title: "Infra Research Bank",
      script:
        "The infrastructure research bank. The full map of Pakistan. Choose a city to read problems and remedies from the cited papers.",
    },
    {
      id: "map",
      title: "The map",
      script:
        "Search or click a city. The marks for indicated new towns appear only after a city is chosen. They are planning indications, not notified townships.",
    },
    {
      id: "findings",
      title: "Papers on this city",
      script:
        "Lahore is open as an example. Problems come from the stored papers. Solutions are shown only where those same papers state a remedy.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-city", { detail: "lahore" })),
    },
    {
      id: "library",
      title: "Evidence library",
      script: `The library holds ${evidenceSources.length} sources. Nothing on this page is added beyond that list.`,
    },
  ],
  "/resources": [
    {
      id: "intro",
      title: "Resource observations",
      script: "Gaps in capacity, standards, materials and controls.",
    },
    {
      id: "gaps",
      title: "The gaps",
      script:
        "Design capacity, the standard of works, training, materials, quality control, best practice, encroachment control, and how little of the stock matches a global standard.",
    },
  ],
  "/needs": [
    {
      id: "intro",
      title: "Needs",
      script: "The requirements that drive resilient infrastructure.",
    },
    {
      id: "needs",
      title: "What the atlas has to answer",
      script:
        "Climate and disaster exposure. Social imperatives. Vertical building where land is short. Water recycling and rainwater harvesting. And storage beyond dams: wetlands, glacial basins, hill torrents, coastal harvest belts and desalination.",
    },
  ],
  "/scope": [
    {
      id: "intro",
      title: "PRIA scope",
      script: "What the Pakistan Resilient Infrastructure Atlas sets out to do.",
    },
    {
      id: "scope",
      title: "The scope",
      script:
        "Planning, methods and standards, institutions, and finance and risk. Geometry toward 2047, saturation of the big cities, smaller towns, and the rules for how work is funded and checked.",
    },
  ],
  "/stakeholders": [
    {
      id: "intro",
      title: "Stakeholders",
      script: "Who carries PRIA, from national policy down to the people who build.",
    },
    {
      id: "flow",
      title: "The chain",
      script: "NDMA holds the atlas. It passes to the Policy Tier, and then to the Execution Tier.",
    },
    {
      id: "tiers",
      title: "Policy and execution",
      script:
        "Policy is the federal ministries, the provinces, and the governments of AJ&K and Gilgit-Baltistan. Execution is academia, designers, architects, materials, quarries, and encroachment control.",
    },
  ],
  "/segments": [
    {
      id: "intro",
      title: "Regional segments",
      script: "Four resilience segments. Each one holds six infrastructure categories.",
    },
    {
      id: "board",
      title: "The four segments",
      script: "Open a segment to read its categories. Mountain, riverine and plains, desert and arid, and the coast.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segments-view", { detail: "cards" })),
    },
    {
      id: "board",
      title: "Compare",
      script: "The compare view sets all four segments against the same six categories.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segments-view", { detail: "compare" })),
    },
  ],
  "/drim": [
    {
      id: "intro",
      title: "Resilient models",
      script: "NDMA’s disaster resilient infrastructure models. Full-scale house models, with the provinces and hazards each one suits.",
    },
    {
      id: "glance",
      title: "At a glance",
      script: `${drimModels.length} house models, ${provinces.length} provinces and regions, ${Object.keys(drimHazards).length} hazard types, and ${Object.keys(drimSystems).length} construction systems.`,
    },
    {
      id: "explore",
      title: "Find a model",
      script: "Filter by province, segment, hazard or construction system. Open any model for its photograph, display board and PDF.",
    },
    {
      id: "provinces",
      title: "By province",
      script: "The models suited to each province and region, taken from the suitable regions on each NDMA board.",
    },
  ],
  "/summary/ndma-role": [
    {
      id: "intro",
      title: "Role of NDMA",
      script:
        "The National Disaster Management Authority is the lead federal agency for disaster management under the National Disaster Management Act, 2010.",
    },
    {
      id: "body",
      title: "What NDMA carries in PRIA",
      script:
        "NDMA prepares the National Disaster Management Plan and coordinates preparedness, response and recovery. In this atlas it sets the recommendations for four segments and six categories, and runs the periodic E-Infra Audit.",
    },
  ],
  "/summary/responsibilities": [
    {
      id: "intro",
      title: "Stakeholder responsibilities",
      script: "What national stakeholders and area governments are responsible for once the atlas is set.",
    },
    {
      id: "body",
      title: "Policy, execution, and the ground",
      script:
        "The Policy Tier turns PRIA into housing policy, plans and by-laws. The Execution Tier covers training, design, materials and encroachment control. Area governments issue permits and report through the E-Infra Audit.",
    },
  ],
  "/summary/conclusion": [
    {
      id: "intro",
      title: "Conclusion",
      script: "The closing of the PRIA concept.",
    },
    {
      id: "body",
      title: "One reference for building",
      script:
        "The 2023 Census counted 38.3 million housing units, about one in five of them kacha. PRIA answers with four regional segments and six infrastructure categories, so everyday decisions about houses, markets and roads share one hazard-informed reference.",
    },
  ],
  "/summary/end-state": [
    {
      id: "vision",
      title: site.vision,
      script: `${site.vision}. ${site.closingLine}.`,
    },
    {
      id: "intro",
      title: "Desired end state",
      script:
        "By 2047, every new building and infrastructure project is planned against the hazards of its regional segment and built to its PRIA recommendations.",
    },
    {
      id: "body",
      title: "What that looks like",
      script:
        "Cities grow inside known saturation thresholds. Protected flow zones stay free of construction. Unsafe housing is replaced with local, cost-effective designs, and the E-Infra Audit keeps the atlas current.",
    },
  ],
};

function segmentSteps(slug: string, categoryId?: string): DemoStep[] {
  const segment = getSegment(slug);
  if (!segment) return [];
  const category = categoryId ? getCategory(segment, categoryId) : segment.categories[0];
  if (!category) return [];
  return [
    {
      id: "hero",
      title: segment.shortTitle,
      script: `Segment ${segment.number}, ${segment.title}. It covers ${segment.regions.join(", ")}.`,
    },
    {
      id: "tabs",
      title: "Six categories",
      script: `Each segment holds six kinds of infrastructure. This page is open on ${category.title}.`,
    },
    {
      id: "content",
      title: category.shortTitle,
      script: `${category.title} for the ${segment.shortTitle} segment. The sub-sections run from materials and design through construction, limits, and the checks that keep the recommendation current.`,
    },
    {
      id: "hazards",
      title: "Hazard profile",
      script: `The hazards these ${segment.shortTitle} recommendations are written against.`,
    },
    {
      id: "models",
      title: "Resilient houses",
      script: `Disaster resilient house models that suit ${segment.shortTitle}. Open one for its board, features and materials.`,
    },
  ];
}

function modelSteps(slug: string): DemoStep[] {
  const model = getDrimModel(slug);
  if (!model) return [];
  const hazards = model.hazards.map((hazard) => drimHazards[hazard].label).join(", ");
  const regions = model.regions.map((region) => region.label).join(", ");
  return [
    {
      id: "intro",
      title: model.title,
      script: `${model.title}. ${drimSystems[model.system]}. It is built against ${hazards}.`,
    },
    {
      id: "viewer",
      title: "The model",
      script: `The photograph, the display board and the PDF for ${model.title}.`,
    },
    {
      id: "regions",
      title: "Where it suits",
      script: `Suitable regions on the board: ${regions}.`,
    },
    {
      id: "features",
      title: "Salient features",
      script: `The salient features listed for ${model.title}.`,
    },
    {
      id: "materials",
      title: "Materials",
      script: `Materials specified for this model, from the NDMA display boards.`,
    },
  ];
}

export function stepsForPath(pathname: string): DemoStep[] {
  if (STATIC[pathname]) return STATIC[pathname];
  const category = pathname.match(/^\/segments\/([^/]+)\/([^/]+)$/);
  if (category) return segmentSteps(category[1], category[2]);
  const segment = pathname.match(/^\/segments\/([^/]+)$/);
  if (segment) return segmentSteps(segment[1]);
  const model = pathname.match(/^\/drim\/([^/]+)$/);
  if (model) return modelSteps(model[1]);
  return [];
}
