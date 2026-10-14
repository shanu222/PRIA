import { provinces } from "@/data/census";
import { evidenceSources } from "@/data/city-evidence";
import { drimHazards, drimModels, drimSystems, getDrimModel } from "@/data/drim";
import { outlookHeadlines } from "@/data/outlook";
import { getCategory, getSegment, site, type InfraCategory, type Segment, type SubSection } from "@/data/pria";

export type DemoStep = {
  id: string;
  title: string;
  gist: string;
  script: string;
  prepare?: () => void | boolean | Promise<void>;
};

const demoCarryKey = "__priaDemoCarry";

export function markDemoCarry(on: boolean) {
  if (typeof window === "undefined") return;
  (window as unknown as Record<string, boolean>)[demoCarryKey] = on;
}

export function demoCarryOn() {
  if (typeof window === "undefined") return false;
  return Boolean((window as unknown as Record<string, boolean>)[demoCarryKey]);
}

const HOME: DemoStep[] = [
  {
    id: "hero",
    title: "The atlas",
    gist: "A national guide for where and how Pakistan should build.",
    script:
      "This is the front door of the atlas. PRIA is not a catalogue of buildings. It tells the National Disaster Management Authority where growth should go, and how it should be built, so that Vision 2047 is safer than the last twenty years.",
  },
  {
    id: "figures",
    title: "The scale",
    gist: "The size of the task, before any design begins.",
    script:
      "Hold these figures as the reason the atlas exists. About 255 million people, and about 31 million houses still needed, cannot be planned as one uniform country. That is why PRIA reads Pakistan as four grounds and six kinds of infrastructure, and looks ahead to 2047.",
  },
  {
    id: "glance",
    title: "The path",
    gist: "How a visitor should move through the portal.",
    script:
      "Read the portal in this order. Begin with the national picture, then the pressures and the needs, then what the atlas will actually do and who must carry it. The summary at the end is NDMA’s role in that chain, not a separate essay.",
  },
  {
    id: "segments",
    title: "Four grounds",
    gist: "One country, four different ways of building.",
    script:
      "A house that stands in the mountains can fail on a flood plain, and a coastal house can fail in the desert. The mountain ground is open here so you can see the idea. Recommendations follow the land. They are not one national template.",
    prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segment", { detail: "mountain" })),
  },
  {
    id: "models",
    title: "How to build",
    gist: "A way of building, once the ground is known.",
    script:
      "These are NDMA’s full-scale house models. They are working answers, not illustrations. Each model is a way of standing up to a real hazard, and it is offered only for the provinces where that way of building belongs.",
  },
  {
    id: "disasters",
    title: "Why resilience",
    gist: "The record the recommendations have to answer.",
    script:
      "The atlas is a response to disasters Pakistan has already lived through. The 2005 earthquake, the Indus floods, the 2015 heat, the 2022 floods, and Cyclone Biparjoy. The aim is simple. Do not rebuild in the same danger.",
  },
  {
    id: "roadmap",
    title: "How to use it",
    gist: "From the national picture to a decision on the ground.",
    script:
      "If you keep one thing from this page, keep the order. National context, then needs and scope, then the people who must act, then the four segments, and finally the summary. That is how PRIA is meant to be used.",
  },
];

const STATIC: Record<string, DemoStep[]> = {
  "/": HOME,
  "/landscape": [
    {
      id: "intro",
      title: "The national picture",
      gist: "Who lives where, and what kind of stock they live in.",
      script:
        "Before the atlas recommends anything, it has to know the country it is advising. This page is that baseline. Population, the kinds of infrastructure, and whether housing is urban or rural.",
    },
    {
      id: "census",
      title: "Census 2023",
      gist: "The official count the rest of the portal stands on.",
      script:
        "These are Census 2023 figures from the Pakistan Bureau of Statistics. Treat them as the common facts. Later pages argue from this count, they do not invent another one.",
    },
    {
      id: "types",
      title: "What counts as infrastructure",
      gist: "Five kinds of stock, so the atlas can speak precisely.",
      script:
        "PRIA does not say infrastructure and mean only houses. Residential, commercial, strategic, communication, and the rest are separated here, because a hazard that ruins a home can also cut a road or a market.",
    },
    {
      id: "map",
      title: "Provinces side by side",
      gist: "Density and housing quality, compared rather than listed.",
      script:
        "Use the map to see difference, not just location. Pick a measure, then a province, and the rest of Pakistan becomes the comparison. That is how uneven the stock really is.",
    },
    {
      id: "split",
      title: "Urban and rural",
      gist: "Most of the housing story is still outside the big cities.",
      script:
        "About 38.29 million housing units, split between urban and rural. The point is not the chart. The point is that a national building rule written only for large cities will miss most of the stock.",
    },
    {
      id: "housing",
      title: "Province by province",
      gist: "The same census, read as a table you can compare.",
      script:
        "This table is the census broken out by province. Use it when a national total is too blunt, and you need to see which province carries the weaker housing.",
    },
  ],
  "/outlook": [
    {
      id: "intro",
      title: "Toward 2047",
      gist: "The country the atlas is planning for, not the country of today.",
      script:
        "The landscape page is the present. This page is the horizon. Population, buildings, housing need and built-up land, out to 2047, for the country and for each province.",
    },
    {
      id: "headlines",
      title: "The shift",
      gist: "From about 255 million people to about 386 million.",
      script:
        "Read the headlines as one movement. About 255 million people in 2026, about 386 million by 2047, with more buildings, more homes required, and a larger urban share. The atlas exists to place that growth safely.",
    },
    {
      id: "population",
      title: "The pace",
      gist: "Roughly 2 percent a year, compounded to 2047.",
      script:
        "Growth near 2 percent a year sounds modest until you carry it to 2047. This chart is that compounding. It is why waiting to plan is itself a risk.",
    },
    {
      id: "provinces",
      title: "Where it concentrates",
      gist: "Growth will not arrive evenly.",
      script:
        "The national total hides the real planning problem. Some provinces take much more of the people and the new buildings. Recommendations have to follow that concentration, not an even spread.",
    },
    {
      id: "housing",
      title: "Homes and buildings",
      gist: "The stock nearly doubles, and the homes have to keep up.",
      script:
        "Buildings and the homes inside them are not the same demand. The stock nearly doubles by 2047, and beside that sits the number of residential units still required. Both have to be sited against hazard, not only against land price.",
    },
    {
      id: "urban",
      title: "The urban pull",
      gist: "Cities are growing about twice as fast as the countryside.",
      script:
        "Urban population is growing about twice as fast as rural population. That is the pressure behind saturation, vertical building, and the search for new towns near safer land.",
    },
    {
      id: "coverage",
      title: "Land under buildings",
      gist: "Built-up land more than doubles.",
      script: `Built-up coverage in 2047 is about ${outlookHeadlines.coverageMultiple2047} times the 2020 figure. More ground under buildings means less room to place the next town badly.`,
    },
    {
      id: "districts",
      title: "The fastest districts",
      gist: "The places that will feel the growth first.",
      script:
        "These are the districts expected to grow the most. They are where the atlas has to be specific. A national average will not protect them.",
    },
  ],
  "/situation": [
    {
      id: "intro",
      title: "The situation, in one place",
      gist: "Growth, pressure, hazard and capacity, read together.",
      script:
        "This page is the diagnosis. It sets out how Pakistan has grown, what the next two decades will demand, the disasters already on record, and the gaps in how the country builds. The needs and the scope that follow answer this page.",
    },
    {
      id: "observations",
      title: "Five patterns",
      gist: "Scattered growth, a few overloaded cities, and no spatial plan.",
      script:
        "Taken together, these are one failure. Growth has been fragmented. A few cities are over-saturated. Land for housing and farming is shrinking. Encroachment takes the gaps, including natural flow paths. And there is no formal spatial plan holding the pieces together.",
    },
    {
      id: "horizon",
      title: "The years ahead",
      gist: "About 255 million people in 2026, about 386 million by 2047.",
      script:
        "From 2026 to 2047 is the window in which those patterns either harden or get redirected. The population series reaches about 386 million, the building stock nearly doubles, and about 20 million more homes are required than today.",
    },
    {
      id: "pressures",
      title: "The pressures",
      gist: "Water, livelihoods, and tourism growth without a plan.",
      script:
        "Three pressures make that growth harder to place safely. Water stress and food insecurity, unemployment and low incomes that leave little to spend on a safer house, and high-value tourism zones growing without planned development.",
    },
    {
      id: "outlook",
      title: "Pressure by province",
      gist: "The same challenge, weighed differently in each province.",
      script:
        "A national challenge is not felt the same way in every province. This outlook sets the 2047 population, buildings and built-up land against the local pressure, so the response can be local too.",
    },
    {
      id: "timeline",
      title: "Two decades",
      gist: "Each disaster exposed a different mistake in where or how we built.",
      script:
        "Walk the years as a lesson, not a memorial. The 2005 earthquake, the Indus floods, the 2015 heat, the 2022 floods, and Cyclone Biparjoy each broke a different weakness. The atlas is written so the next event does not repeat that weakness.",
    },
    {
      id: "profiles",
      title: "Hazard follows the ground",
      gist: "Each segment is defined by the danger it must resist.",
      script:
        "The four segments are not administrative regions. Each one is a hazard profile. The recommendations on that ground exist because of the dangers shown here.",
    },
    {
      id: "vulnerable",
      title: "Where housing is weakest",
      gist: "Pacca and kacha stock tell you where the next loss will concentrate.",
      script:
        "Hazard is only half the loss. The other half is the quality of the house that meets it. The landscape map compares pacca and kacha housing, density and urban share, so vulnerability is visible by province.",
    },
    {
      id: "gaps",
      title: "Where the chain is weak",
      gist: "From the drawing board to the inspector on site.",
      script:
        "The last question is whether the country can build well. Read these as one chain. Limited design capacity, uneven workmanship, little formal training, scarce affordable resilient materials, and weak quality control. A model house does not survive that chain on its own.",
    },
  ],
  "/research": [
    {
      id: "intro",
      title: "Evidence, city by city",
      gist: "Papers first. The atlas does not invent a city’s problems.",
      script:
        "This bank is how PRIA stays honest about a city. The full map of Pakistan is here so you can choose a place and read only what published papers and official records actually say about it.",
    },
    {
      id: "map",
      title: "Choose a city",
      gist: "A click opens the studies. It does not declare a new town.",
      script:
        "Search or click a city. Marks for indicated new towns appear only after that choice, and they are planning hints off the hazard line. They are not notified townships, and they are not named as if they already exist.",
    },
    {
      id: "findings",
      title: "What the papers allow",
      gist: "Problems and remedies come from the same sources.",
      script:
        "Lahore is open as the example. Read the problems as what the papers report. Read the solutions only where those same papers state a remedy. If a source records damage and offers no fix, it stays out of the solutions.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-city", { detail: "lahore" })),
    },
    {
      id: "library",
      title: "The closed list",
      gist: "If it is not in this library, it is not on the page.",
      script: `The bank holds ${evidenceSources.length} sources. That list is the boundary. Nothing above it was added to make a city look more studied than it is.`,
    },
  ],
  "/needs": [
    {
      id: "intro",
      title: "What the atlas must answer",
      gist: "The requirements, once the pressures are accepted.",
      script:
        "Needs are the brief. Not a wish list. The conditions any resilient infrastructure in Pakistan now has to satisfy.",
    },
    {
      id: "needs",
      title: "The brief",
      gist: "Hazard, people, land, and water, in that order of pressure.",
      script:
        "Four demands sit underneath the atlas. Build for the hazard. Meet the social need. Go upward where land is gone. And treat water as something to harvest, reuse and store, including beyond dams, in wetlands, glacial basins, hill torrents, coastal belts and desalination.",
    },
  ],
  "/scope": [
    {
      id: "intro",
      title: "What PRIA will do",
      gist: "The assignment, not the background.",
      script:
        "Scope is the job description of the atlas. Everything before this page explains why. This page says what PRIA is actually obliged to produce.",
    },
    {
      id: "scope",
      title: "The assignment",
      gist: "Plan the geometry, set the methods, name the institutions, and fund the risk.",
      script:
        "Four groups of work. Planning, including the geometry of infrastructure toward 2047 and the saturation of big cities. Methods and standards. The institutions that must hold them. And finance that expects disaster, instead of being surprised by it.",
    },
  ],
  "/stakeholders": [
    {
      id: "intro",
      title: "Who has to act",
      gist: "An atlas changes nothing until someone is responsible for it.",
      script:
        "PRIA is not a document that sits with NDMA alone. This page names the chain from the authority that owns the atlas to the ministries, provinces and builders who have to use it.",
    },
    {
      id: "flow",
      title: "The chain",
      gist: "NDMA sets it. Policy adopts it. Execution builds it.",
      script:
        "Follow the arrows as accountability. NDMA holds the atlas. The Policy Tier turns it into programmes and by-laws. The Execution Tier has to make it physical, in materials, designs and controls.",
    },
    {
      id: "tiers",
      title: "Policy and execution",
      gist: "Federal, provincial, and the people who actually build.",
      script:
        "Policy is the federal ministries, the provinces, and the governments of AJ&K and Gilgit-Baltistan. Execution is academia, designers, architects, suppliers, quarries, and the agencies that stop encroachment. Miss either tier and the atlas stays a drawing.",
    },
  ],
  "/segments": [
    {
      id: "intro",
      title: "The four grounds",
      gist: "The working heart of the atlas.",
      script:
        "This is where the national story becomes a place. Four segments, and inside each one the same six kinds of infrastructure, so a mountain road and a coastal road are judged by different dangers.",
    },
    {
      id: "board",
      title: "Open a ground",
      gist: "Each card is a different Pakistan.",
      script:
        "Choose a segment to go inside it. Mountain, riverine and plains, desert and arid, and the coast. The colour is a reminder that the recommendation changes when the ground changes.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segments-view", { detail: "cards" })),
    },
    {
      id: "board",
      title: "The same six questions",
      gist: "Compare the grounds without losing the categories.",
      script:
        "The compare view asks the same six questions of every segment. Homes, markets, communications, strategic works, the private sector, and industry. That is how you see what must differ, and what can be shared.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segments-view", { detail: "compare" })),
    },
  ],
  "/drim": [
    {
      id: "intro",
      title: "Models, not slogans",
      gist: "NDMA’s house designs, tied to a place and a hazard.",
      script:
        "DRIM is the practical shelf of the atlas. These are NDMA’s disaster resilient house models. A model earns its place by the hazard it resists and the provinces where it belongs.",
    },
    {
      id: "glance",
      title: "The shelf",
      gist: `${drimModels.length} models, across ${provinces.length} provinces and regions.`,
      script: `${drimModels.length} house models, covering ${provinces.length} provinces and regions, ${Object.keys(drimHazards).length} kinds of hazard, and ${Object.keys(drimSystems).length} ways of building. The number matters less than the match. The right model for the right ground.`,
    },
    {
      id: "explore",
      title: "Find the match",
      gist: "Filter until the model fits the place you are planning.",
      script:
        "Do not browse this as a gallery. Filter by province, segment, hazard or construction system until the set is the one a planner in that place could actually use. Then open the board, the photograph and the PDF.",
    },
    {
      id: "provinces",
      title: "Suitability",
      gist: "A model is recommended only where its board says it belongs.",
      script:
        "Each province is paired with the models whose boards name it. That pairing is the discipline. A clever structure for the mountains is not automatically a gift to the coast.",
    },
  ],
  "/summary/ndma-role": [
    {
      id: "intro",
      title: "Why NDMA holds the atlas",
      gist: "The authority already charged with disaster is charged with what gets built.",
      script:
        "NDMA is the lead federal agency for disaster management under the Act of 2010. PRIA extends that duty. From responding after a disaster, to shaping what is built before the next one.",
    },
    {
      id: "body",
      title: "The work inside PRIA",
      gist: "Own the atlas, set the recommendations, and audit whether they are used.",
      script:
        "Inside this portal, NDMA sits at the head of the chain. It sets the hazard-informed recommendations for four segments and six categories, defines where not to build, and runs the E-Infra Audit so the advice is checked on the ground.",
    },
  ],
  "/summary/responsibilities": [
    {
      id: "intro",
      title: "Responsibility after the atlas",
      gist: "A recommendation is unfinished until an institution adopts it.",
      script:
        "This page divides the work the atlas cannot do alone. National stakeholders set the rules. Area governments live with them every day.",
    },
    {
      id: "body",
      title: "Three layers of duty",
      gist: "Policy writes it. Execution supplies it. The district enforces it.",
      script:
        "The Policy Tier turns PRIA into housing policy, plans and by-laws. The Execution Tier trains people, designs the templates, and supplies materials that can pass a test. Area governments issue the permits and report back through the E-Infra Audit.",
    },
  ],
  "/summary/conclusion": [
    {
      id: "intro",
      title: "The argument, closed",
      gist: "Exposure is already measured. The atlas is the shared answer.",
      script:
        "The conclusion does not add a new topic. It ties the census, the pattern of growth, and the disasters already on record into one reason for having a single atlas.",
    },
    {
      id: "body",
      title: "One reference",
      gist: "Everyday building decisions, against one hazard-informed standard.",
      script:
        "The 2023 Census counted 38.3 million housing units, about one in five of them kacha. PRIA’s answer is four segments and six categories, so a house, a market or a road is judged by the danger of its ground, not by habit.",
    },
  ],
  "/summary/end-state": [
    {
      id: "vision",
      title: site.vision,
      gist: "The year the atlas is building toward.",
      script: `${site.vision} is not a slogan on this page. It is the date by which the way Pakistan builds should have changed. ${site.closingLine}.`,
    },
    {
      id: "intro",
      title: "The country we are aiming at",
      gist: "Every new project, planned against the hazard of its own ground.",
      script:
        "The desired end state is practical. By 2047, a new building or infrastructure project is planned against the hazards of its segment, and built to that segment’s recommendations.",
    },
    {
      id: "body",
      title: "What changed",
      gist: "Thresholds, clear flow zones, safer houses, and an audit that stays current.",
      script:
        "Cities grow inside known limits. Protected flow zones stay clear. Unsafe housing is replaced with local, affordable designs. And the E-Infra Audit keeps the atlas current, so the next flood or earthquake meets a country that prepared.",
    },
  ],
};

function openCategory(segment: Segment, category: InfraCategory) {
  return () =>
    new Promise<void>((resolve) => {
      const href = `/segments/${segment.slug}/${category.id}`;
      if (typeof window === "undefined" || window.location.pathname === href) {
        resolve();
        return;
      }
      markDemoCarry(true);
      document.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)?.click();
      const started = Date.now();
      const tick = () => {
        if (window.location.pathname === href || Date.now() - started > 5000) {
          window.setTimeout(resolve, 350);
          return;
        }
        window.setTimeout(tick, 50);
      };
      tick();
    });
}

function openSub(id: string) {
  return () => {
    window.dispatchEvent(new CustomEvent("pria-demo-sub", { detail: id }));
  };
}

function categoryScript(category: InfraCategory, segment: Segment) {
  const ground = segment.shortTitle;
  const lines: Record<string, { gist: string; script: string }> = {
    residential: {
      gist: "Homes, and the house models that belong only here.",
      script: `Homes are the first question on the ${ground} ground. The hazard decides the house, and the DRIM models are the house answers. The other categories are not houses, and they do not borrow these models.`,
    },
    commercial: {
      gist: "Markets and workplaces, where a failure fills a street.",
      script: `Commerce on the ${ground} ground is the market and the workplace, not a house. The same hazard applies, but a failure gathers a street of people. Materials, design and construction are asked again for that public life.`,
    },
    communication: {
      gist: "How the ground stays connected when a road fails.",
      script: `Communication is how the ${ground} ground stays linked when a road, a bridge or a cable is lost. The question is a second path and a link that survives, not another building type.`,
    },
    strategic: {
      gist: "The road, bridge, port or line the rest depends on.",
      script: `Strategic infrastructure is what the rest of the ${ground} ground depends on: the road, the bridge, the embankment, the port or the power line. If it fails, the other categories cannot be reached or protected.`,
    },
    "private-sector": {
      gist: "Whether the people who build will follow the hazard.",
      script: `The private sector is who actually builds on the ${ground} ground. The question is whether approval, materials and site practice will follow the hazard, or quietly set it aside.`,
    },
    industrial: {
      gist: "Plant and estates that must not spread a failure.",
      script: `Industry is the plant, the mine or the estate on the ${ground} ground. It has to sit where this ground can bear it, and a failure must not spread into water, homes or the coast.`,
    },
  };
  return (
    lines[category.id] ?? {
      gist: `${category.shortTitle} on this ground.`,
      script: `${category.shortTitle} is one of the six questions asked of the ${ground} ground. It is the same question the other grounds answer, for a different kind of infrastructure.`,
    }
  );
}

function subScript(sub: SubSection, category: InfraCategory, segment: Segment) {
  const ground = segment.shortTitle;
  const kind = category.shortTitle.toLowerCase();
  if (sub.id === "material-options") {
    return {
      gist: "What it should be made of, because of this hazard.",
      script: `Materials are the first decision for ${kind} on the ${ground} ground. They are chosen because of the hazard, not because they are familiar. A material that is right on another ground is not automatically right here.`,
    };
  }
  if (sub.id === "design-options") {
    return category.id === "residential"
      ? {
          gist: "The house form, including the DRIM models.",
          script: `Design for homes is where the DRIM models belong. They show a house that fits the ${ground} ground. The point is how it behaves under the hazard, not a style of building.`,
        }
      : {
          gist: "Layout and structure, not a borrowed house model.",
          script: `Design for ${kind} is not a house model. DRIM belongs to homes. Here, design means the layout and the structure that let this infrastructure survive the ${ground} hazard. The picture is that idea.`,
        };
  }
  if (sub.id === "construction-methodology" || sub.id === "construction-methodologies") {
    return {
      gist: "How the work on site has to change.",
      script: `Construction is how the work on site has to change for ${kind} on the ${ground} ground. A correct drawing still fails if the build ignores the hazard. This is the method, not a second design.`,
    };
  }
  if (sub.id === "no-go-areas") {
    return {
      gist: "Where this ground must not be built on.",
      script: `No-go areas are the protected places on the ${ground} ground. They are not spare land. Homes, and anything else, stay out of the paths the hazard already uses.`,
    };
  }
  if (sub.id === "tourism-templates") {
    return {
      gist: "Visitor places follow the same limits.",
      script: `Tourism does not get a lighter rule. Visitor places on the ${ground} ground follow the same limits as the rest of the segment. A guest house in the path of the hazard is still a building in that path.`,
    };
  }
  if (sub.id === "maintenance") {
    return {
      gist: "What keeps the recommendation true after handover.",
      script: `Maintenance is what keeps the recommendation alive after handover. Without it, a sound design on the ${ground} ground becomes the next failure.`,
    };
  }
  if (sub.id === "e-infra-audit") {
    return {
      gist: "The periodic check, and who should make it.",
      script: `The audit is the periodic look at ${kind} on the ${ground} ground: what to inspect, in what form, and which agency should do it. It is how the atlas stays honest after the project is built.`,
    };
  }
  return {
    gist: "What still belongs here, outside the other headings.",
    script: `Other subjects are the remainder that still belongs to the ${ground} ground and does not fit the headings above. They are part of the brief, not an appendix to skip.`,
  };
}

function optionSteps(segment: Segment): DemoStep[] {
  return segment.categories.flatMap((category) => {
    const introduced = categoryScript(category, segment);
    const categoryStep: DemoStep = {
      id: "tabs",
      title: category.shortTitle,
      gist: introduced.gist,
      script: introduced.script,
      prepare: openCategory(segment, category),
    };
    const subs = category.subSections.map((sub) => {
      const spoken = subScript(sub, category, segment);
      return {
        id: "content",
        title: sub.title,
        gist: spoken.gist,
        script: spoken.script,
        prepare: openSub(sub.id),
      };
    });
    return [categoryStep, ...subs];
  });
}

function segmentSteps(slug: string, categoryId?: string): DemoStep[] {
  const segment = getSegment(slug);
  if (!segment) return [];
  const category = categoryId ? getCategory(segment, categoryId) : segment.categories[0];
  if (!category) return [];
  const regions = segment.regions.join(", ");
  return [
    {
      id: "hero",
      title: segment.shortTitle,
      gist: `A ground of its own: ${regions}.`,
      script: `Segment ${segment.number} is ${segment.title}. It is separated because ${regions} do not share the dangers of the other three grounds. What is safe there is not automatically safe anywhere else in the atlas.`,
    },
    {
      id: "tabs",
      title: "The six questions",
      gist: `This ground, open on ${category.shortTitle.toLowerCase()}.`,
      script: `Every segment is asked the same six questions, from homes to industry, so the grounds stay comparable. This page is answering ${category.title}. Change category when you want the same ground, and a different kind of infrastructure.`,
    },
    {
      id: "content",
      title: category.shortTitle,
      gist: "Materials, design, method, and the limit on where to build.",
      script: `Read ${category.shortTitle.toLowerCase()} for ${segment.shortTitle} as a build brief. Materials and design, then how construction should change, where not to build, and the maintenance and audit that keep the advice alive. If a sub-section is still empty, the portal says so. It does not invent a recommendation.`,
    },
    ...optionSteps(segment),
    {
      id: "hazards",
      title: "Why these rules",
      gist: "The danger comes before the detail.",
      script: `These recommendations exist because of the hazards on the ${segment.shortTitle} ground. If you skip this profile, the materials and the no-go areas above it look arbitrary. They are not.`,
    },
    {
      id: "models",
      title: "A house that fits",
      gist: "DRIM models filtered to this ground.",
      script: `Below the written advice are the NDMA house models that suit ${segment.shortTitle}. Open one when you want the board, the features and the materials, rather than the planning note alone.`,
    },
  ];
}

function modelSteps(slug: string): DemoStep[] {
  const model = getDrimModel(slug);
  if (!model) return [];
  const hazards = model.hazards.map((hazard) => drimHazards[hazard].label).join(" and ");
  const regions = model.regions.map((region) => region.label).join(", ");
  const system = drimSystems[model.system];
  return [
    {
      id: "intro",
      title: model.title,
      gist: `${system}, for ${hazards.toLowerCase()}.`,
      script: `${model.title} is one answer from the NDMA boards, not a universal house. The system is ${system}. It is meant to stand up to ${hazards.toLowerCase()}. Use it where that danger is the one you are designing for.`,
    },
    {
      id: "viewer",
      title: "The board",
      gist: "Photograph, display board, and the PDF behind them.",
      script: `This is the model as NDMA published it. The photograph and the board are the quick read. The PDF is the document to keep. Trust the board over a summary.`,
    },
    {
      id: "regions",
      title: "Where it belongs",
      gist: "Suitable only for the regions named on the board.",
      script: `The board places ${model.title} in ${regions}. Outside those regions, treat it as a reference, not a recommendation. The map is there so the fit is geographic, not just a list of names.`,
    },
    {
      id: "features",
      title: "What makes it resilient",
      gist: "The features are the reason this model was chosen.",
      script: `These are the salient features on the board for ${model.title}. They are the behaviour that matters in ${hazards.toLowerCase()}, not a style of house.`,
    },
    {
      id: "materials",
      title: "What it is built from",
      gist: "Specified materials, so the model can be costed and checked.",
      script: `The materials are part of the recommendation. They tell a builder and a building-control office what ${model.title} actually requires, as stated on the NDMA boards.`,
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
