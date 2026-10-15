import { national, provinces } from "@/data/census";
import { evidenceSources } from "@/data/city-evidence";
import { drimHazards, drimModels, drimSystems, getDrimModel } from "@/data/drim";
import { segmentProfiles } from "@/data/hazards";
import { outlookHeadlines } from "@/data/outlook";
import { getCategory, getSegment, site, type InfraCategory, type Segment, type SubSection } from "@/data/pria";

const mn = (value: number) => (value / 1_000_000).toFixed(2).replace(/\.00$/, "");
const housingMn = mn(national.households);

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
      "Pakistan's infrastructure is exposed to earthquakes, floods, heat, drought and coastal storms, and much of it was built without a shared plan for those dangers. P.R.I.A., the Pakistan Resilient Infrastructure Atlas, gives N.D.M.A. and its partners one place to see where people live, how the stock is growing toward Vision 2047, and which way of building fits each kind of ground. Planners can use it to place new housing, roads and services where the hazard is understood, and to compare options before money is committed.",
  },
  {
    id: "figures",
    title: "The scale",
    gist: "The size of the task, before any design begins.",
    script:
      "The overview uses a 2026 population of about 255 million, and a housing task of about 31 million houses. Those figures are planning scale, separate from the 2023 census count of people and existing homes. Growth at that scale changes demand for housing, water, drainage, transport and public services at the same time. The atlas divides the country into four regional segments and six kinds of infrastructure, so a national total can be turned into a local decision by 2047.",
  },
  {
    id: "glance",
    title: "The path",
    gist: "How a visitor should move through the portal.",
    script:
      "Each part of the atlas answers a planning question. The landscape records who lives where and what the stock is made of. The outlook projects growth to 2047. The situation analysis sets that growth against disasters and weak building capacity. Needs and scope state what resilient infrastructure must do, and the stakeholder pages name who has to carry it into policy, design and construction. Together they support evidence-based choices, from a national programme down to a site.",
  },
  {
    id: "segments",
    title: "Four grounds",
    gist: "One country, four different ways of building.",
    script:
      "Pakistan does not face one hazard. Mountain districts live with earthquakes, landslides and glacial-lake floods. River plains live with river floods and hill torrents. Arid districts live with extreme heat and drought. The coast lives with cyclones, storm surge and erosion. A structure sized for one of those dangers can fail under another. The four segments let engineers and local agencies match materials, siting and maintenance to the ground they are actually building on.",
    prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segment", { detail: "mountain" })),
  },
  {
    id: "models",
    title: "How to build",
    gist: "A way of building, once the ground is known.",
    script:
      "The D.R.I.M. models are N.D.M.A. house designs for named hazards and named regions. A designer or a housing programme can open a model to see the structural system, the materials, and the provinces where that board says the model belongs. Use a model where its hazard is the one on the site. Outside those regions, keep it as a reference while you look for the model matched to the local danger.",
  },
  {
    id: "disasters",
    title: "Why resilience",
    gist: "The record the recommendations have to answer.",
    script:
      "The 2005 earthquake, the Indus floods, the 2015 heatwave, the 2022 monsoon floods and Cyclone Biparjoy each damaged houses, roads or services in a different way. In 2022, N.D.M.A. recorded 2.29 million houses damaged or destroyed, about 13,000 kilometres of roads, and 439 bridges. Those losses show why siting and construction standards matter before the next event. The atlas is meant to help agencies avoid rebuilding the same exposure.",
  },
  {
    id: "roadmap",
    title: "How to use it",
    gist: "From the national picture to a decision on the ground.",
    script:
      "Use the atlas in the same order a project decision is made. Start with the people and the stock, then the growth and the hazards, then the requirements and the institutions that must act, then the segment that matches the site. The summary states how N.D.M.A., federal and provincial bodies, and area governments share that work through to 2047.",
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
        "Safe infrastructure starts from a reliable picture of who lives where, and what is already built. This landscape is that baseline for Pakistan. It brings together the July 2026 population and refined housing counts, the 2023 census stock, and the urban and rural split. Agencies can use it to see which provinces carry dense population, weaker housing, or a larger rural share, before a project location is chosen.",
    },
    {
      id: "census",
      title: "Population and housing",
      gist: "The baseline the rest of the portal stands on.",
      script:
        `Population for the four provinces and Islamabad is the July 2026 projection, and housing durability is the refined count from the same workbook. Azad Jammu and Kashmir and Gilgit-Baltistan stay on the 2023 census. Together, the national population is about ${mn(national.populationTotal)} million. Housing tables for the provinces and Islamabad count about ${housingMn} million housing units, with an average household size of ${national.householdSize}. About ${national.paccaPct} percent of houses are pucca, the permanent stock, and about ${national.kachaPct} percent are kutcha, the temporary stock. Treat these as the verified baseline. The outlook toward 2047 is a separate projection, and it is labelled separately from this baseline.`,
    },
    {
      id: "types",
      title: "What counts as infrastructure",
      gist: "Five kinds of stock, so the atlas can speak precisely.",
      script:
        "A flood or earthquake rarely damages only houses. It can close a market, cut a road, or stop a clinic from working. The atlas therefore separates residential, commercial, strategic, communication and other stock. That split lets a planner see which assets are exposed together, and which intervention protects homes, access and services at the same time.",
    },
    {
      id: "map",
      title: "Provinces side by side",
      gist: "Density and housing quality, compared across provinces.",
      script:
        "National averages hide large differences between provinces. Choose population density, urban share, or housing quality, then select a province to compare it with the rest of the country. A high share of kutcha or single-room housing means the next flood or earthquake will damage more homes there. Provincial governments can use that comparison to decide where safer-housing programmes and building control need to come first.",
    },
    {
      id: "split",
      title: "Urban and rural",
      gist: "Most of the housing story is still outside the big cities.",
      script:
        `Of about ${housingMn} million housing units, about ${national.householdsRuralPct} percent are rural and about ${national.householdsUrbanPct} percent are urban, using the Census 2023 urban and rural shares. Most of the stock, and much of the weaker construction, sits outside the largest cities. A building standard written only for urban apartments will miss the rural majority. Housing policy, rural development and disaster programmes need both sides of this split when they estimate materials, skills and inspection capacity.`,
    },
    {
      id: "housing",
      title: "Province by province",
      gist: "The same census, read as a table you can compare.",
      script:
        "This table breaks the baseline into provinces, so a national percentage can be traced to the place that carries it. Compare pucca and kutcha shares, household size and urban population when you set a provincial housing target or a reconstruction budget. A province with a higher kutcha share has more homes likely to fail under flood, heat or shaking, and that is where durable materials and trained masons change the loss.",
    },
  ],
  "/outlook": [
    {
      id: "intro",
      title: "Toward 2047",
      gist: "Population, buildings and land use, projected to 2047.",
      script:
        "Population growth changes housing demand, water supply, drainage, transport, energy and public services together. This outlook carries the national and provincial series forward to 2047, using the Global Human Settlement population series and the Open Buildings model. These are projections, not census counts. Planners can use them to test whether today's roads, housing programmes and urban boundaries are sized for the country they will be serving.",
    },
    {
      id: "headlines",
      title: "The shift",
      gist: "From about 255 million people to about 386 million.",
      script:
        `The settlement series moves from about 255 million people in 2026 to about 386 million in 2047. That is a compound rate of about ${outlookHeadlines.popCagr2026to2047} percent a year over those years. Building counts that include Azad Kashmir and Gilgit-Baltistan rise from about ${outlookHeadlines.buildingsInclAjkGb2026} million to about ${outlookHeadlines.buildingsInclAjkGb2047} million. More people mean more demand for homes, water, schools, clinics and streets. The value of the projection is to place that growth on safer land, and in structures that match the local hazard.`,
    },
    {
      id: "population",
      title: "The pace",
      gist: "Roughly 2 percent a year, compounded to 2047.",
      script:
        `From 2020 to 2047 the long-run population rate in this series is about ${outlookHeadlines.popCagr2020to2047} percent a year, and from 2026 to 2047 it is about ${outlookHeadlines.popCagr2026to2047} percent. Compounded from 2026 to 2047, that pace adds about 131 million people. Each year's delay adds households that will need water connections, drainage, transport and a building plot. Use the chart to time investment, and remember the years 2021 to 2025 are not in this series.`,
    },
    {
      id: "provinces",
      title: "Where it concentrates",
      gist: "Growth will not arrive evenly.",
      script:
        "Punjab and Sindh together hold about 74 percent of the projected population in 2026 and about 78 percent in 2047, so most new housing, water and transport demand stays in those two provinces. Other regions still grow, and some, such as Islamabad and Khyber Pakhtunkhwa, add buildings quickly relative to their size. Select a province and a measure to see where people, buildings and built-up land concentrate. Investment and building codes should follow that concentration, with a design that fits the segment the province sits in.",
    },
    {
      id: "housing",
      title: "Homes and buildings",
      gist: "The stock nearly doubles, and the homes have to keep up.",
      script:
        `Building counts and homes answer different planning questions. Counts that include Azad Kashmir and Gilgit-Baltistan rise from about ${outlookHeadlines.buildingsInclAjkGb2026} million in 2026 to about ${outlookHeadlines.buildingsInclAjkGb2047} million in 2047, about ${outlookHeadlines.buildingGrowth} percent a year. In the census-area series, about 2.16 million buildings are added in the year 2047. Residential units required are estimated as population divided by 6.5 people per unit, rising by about 20 million units from 2026 to 2047. The build-capacity bars are a planning assumption: 500 thousand units needed a year, 300 thousand built, and a gap of 200 thousand. Keep that scenario labelled as an assumption. Use the projection to size land, materials and hazard-safe sites.`,
    },
    {
      id: "urban",
      title: "The urban pull",
      gist: "Cities are growing about twice as fast as the countryside.",
      script:
        "Urban population in this series grows at about 3.65 percent a year, and rural population at about 1.86 percent, so cities are growing about twice as fast as the countryside. The urban share moves from about 36 percent in 2017, to about 39 percent in the 2023 census, to a projected 49 percent by 2047. That shift loads water supply, drainage, transport and public services inside existing cities, and it pushes development onto nearby land. Planners can use the shares to test saturation, vertical building, and whether a new town sits on safer ground with room for services.",
    },
    {
      id: "coverage",
      title: "Land under buildings",
      gist: "Built-up land more than doubles.",
      script: `Built-up land in the Global Human Settlement series grows from about 0.71 percent of national land in 2020 to about 1.54 percent in 2047, roughly ${outlookHeadlines.coverageMultiple2047} times the 2020 footprint, at about ${outlookHeadlines.builtCagr2020to2047} percent a year. More ground under buildings means more roofs, more runoff, and less room to keep flood paths and service corridors clear. Use the coverage trend to protect drainage lines and farmland while the next town is still being sited.`,
    },
    {
      id: "districts",
      title: "The fastest districts",
      gist: "The places that will feel the growth first.",
      script:
        "The district list shows where the 2047 population concentrates, and which large districts grow fastest in this projection. Lahore, Faisalabad and the other large Punjab districts carry the biggest populations, while places such as Malir, Gujrat and Sheikhupura show some of the highest growth rates. A fast-growing district will feel pressure first on housing plots, water, drainage and roads. Provincial and district agencies can use the ranking to prioritise hazard-aware plans where the increase is largest, and to treat the figures as projections from the settlement series.",
    },
  ],
  "/situation": [
    {
      id: "intro",
      title: "The situation, in one place",
      gist: "Growth, pressure, hazard and capacity, read together.",
      script:
        "Situation analysis joins four facts that have to be planned together: how settlements have spread, what the next two decades add to demand, which hazards have already caused loss, and where design, skills and materials are too weak to build safely. It is the diagnosis behind the needs and the scope. Decision makers can use it to explain why a project should change its site, its standard, or its budget for resilience.",
    },
    {
      id: "observations",
      title: "Five patterns",
      gist: "Scattered growth, a few overloaded cities, and no spatial plan.",
      script:
        "The observations describe a pattern already visible on the ground. Growth has broken into scattered pieces. A few cities are carrying more people and services than their land and networks can hold. Land for housing and farming is being used up. Encroachment closes the gaps that water and access need, including natural flow paths. There is no single spatial plan holding those choices together. The practical result is more exposure: homes and roads in the path of the next flood, and services that cannot be extended in an orderly way.",
    },
    {
      id: "horizon",
      title: "The years ahead",
      gist: "About 255 million people in 2026, about 386 million by 2047.",
      script:
        "From 2026 to 2047 is the planning window for Vision 2047. In the settlement series, population reaches about 386 million. Building counts that include Azad Kashmir and Gilgit-Baltistan rise from about 42.8 million to about 79.5 million. Residential units, estimated at 6.5 people per unit, require about 20 million more homes than in 2026. Those are projections. If scattered growth and blocked drainage continue through that window, the new stock inherits today's exposure. The series is there so agencies can redirect land and building standards while the growth is still ahead of them.",
    },
    {
      id: "pressures",
      title: "The pressures",
      gist: "Water, livelihoods, and tourism growth without a plan.",
      script:
        "Three pressures make that growth harder to place safely. Water stress and food insecurity mean housing and farming are competing for the same land and the same supply. Low incomes and unemployment leave households with little to spend on a safer structure, so the cheapest, weaker build continues. High-value tourism zones are expanding without a development plan, which puts visitors and new buildings into hazard paths. Programmes that ignore income, water and tourism will under-estimate both the demand and the constraint.",
    },
    {
      id: "outlook",
      title: "Pressure by province",
      gist: "The same challenge, weighed differently in each province.",
      script:
        "The same national pressure lands differently in each province. This table sets the 2023 census baseline beside the 2047 projections for population, buildings and built-up land, and names the local challenge. A province can be growing quickly, short of durable housing, or both. Provincial governments can use their row to argue for a local standard and a local budget, while keeping the national projection as the shared source.",
    },
    {
      id: "timeline",
      title: "Two decades",
      gist: "Each disaster exposed a different mistake in where or how we built.",
      script:
        "Each event on this timeline exposed a different weakness in where or how Pakistan builds. The 2005 earthquake showed how heavy, untied masonry fails. The Indus floods and the 2022 monsoon showed how homes, roads and bridges sit in flood paths. The 2015 heatwave showed what happens when power, water and building design cannot cope with extreme temperature. Cyclone Biparjoy showed the value of moving people off an exposed coast before landfall. Use the record to identify which assets are in harm's way, and which resilience measure answers that specific hazard.",
    },
    {
      id: "profiles",
      title: "Hazard follows the ground",
      gist: "Each segment is defined by the danger it must resist.",
      script:
        "The four segments follow hazard, not a provincial boundary. Mountain ground is defined by earthquakes, landslides, avalanches and glacial-lake outburst floods. Riverine and plains ground is defined by river floods, hill torrents, urban flooding and heat. Desert and arid ground is defined by extreme heat, drought and flash floods in dry channels. The coast is defined by cyclones, storm surge, erosion and the tsunami risk of the Makran coast. Recommendations for materials and no-go areas come from these profiles. Read the profile before you apply a design, so the measure matches the danger.",
    },
    {
      id: "vulnerable",
      title: "Where housing is weakest",
      gist: "Pacca and kacha stock tell you where the next loss will concentrate.",
      script:
        "Loss depends on the hazard and on the building that meets it. The baseline shows large differences in pucca and kutcha housing, density and urban share. Balochistan, for example, has about 59.0 percent kutcha houses, and about 61 percent of homes have mud or unbaked-brick walls. Those homes are more likely to fail in flood or heavy rain. Use the provincial comparison to see where vulnerability concentrates, and to aim safer materials and inspection at the weaker stock.",
    },
    {
      id: "gaps",
      title: "Where the chain is weak",
      gist: "From the drawing board to the inspector on site.",
      script:
        "A sound drawing still fails if the country cannot build it. The gaps run along one chain: limited design capacity, uneven workmanship, little formal training for builders and artisans, scarce affordable resilient materials, weak quality control, and few projects benchmarked to a recognised standard. Housing agencies and training institutes can use this list to see which link to fund. A model house reduces loss only when design, materials, skills and inspection are in place together.",
    },
  ],
  "/research": [
    {
      id: "intro",
      title: "Evidence, city by city",
      gist: "Papers first. The atlas does not invent a city’s problems.",
      script:
        "City decisions need evidence that can be traced. This research bank lets you select a place and read only what published papers and official records say about its infrastructure problems and, where the same sources state one, its remedies. It does not fill a gap with a generated finding. Planners and researchers can use it to see which problems are documented, and where the evidence is still too thin for a firm recommendation.",
    },
    {
      id: "map",
      title: "Choose a city",
      gist: "A click opens the studies. It does not declare a new town.",
      script:
        "Search or select a city to open its studies. Marks for indicated new towns appear only after that choice. They are planning hints, placed off the hazard line, for discussion of where additional growth might sit. They are not notified townships, and they should not be read as towns that already exist. Use the map to connect a documented urban problem with a possible direction for growth, and then check land, water and hazard before anyone treats the hint as a site.",
    },
    {
      id: "findings",
      title: "What the papers allow",
      gist: "Problems and remedies come from the same sources.",
      script:
        "Lahore is open as the worked example. Problems listed here are what the papers and records report for that city: exposure, service gaps, or damage that those sources document. A solution appears only when the same body of sources states a remedy. If a paper records damage and offers no fix, the bank leaves the solution empty. Treat that empty list as a limit of the evidence, and use the cited problems to decide what still needs study before a project claims to solve them.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-city", { detail: "lahore" })),
    },
    {
      id: "library",
      title: "The closed list",
      gist: "If it is not in this library, it is not on the page.",
      script: `The library holds ${evidenceSources.length} sources. That list is the boundary of what the bank will say about a city. A city with few sources is less studied in this collection, and the atlas does not add material to make it look otherwise. Researchers can use the library to check the citation behind a finding before it is carried into a plan.`,
    },
  ],
  "/needs": [
    {
      id: "intro",
      title: "What the atlas must answer",
      gist: "The requirements, once the pressures are accepted.",
      script:
        "Needs are the conditions any new infrastructure in Pakistan now has to meet if it is to last. They follow from climate exposure, social demand, scarce land, and scarce water. Ministries and designers can use this brief to test a proposal: does it answer the hazard, the people who will rely on it, the lack of open land, and the need to collect, reuse and store water?",
    },
    {
      id: "needs",
      title: "The brief",
      gist: "Hazard, people, land, and water, in that order of pressure.",
      script:
        "Five requirements shape the brief. Infrastructure has to be driven by climate and disaster exposure, so the design starts from the hazard on the site. It has to meet social needs, including housing that people can actually afford and reach. Where open land is running out, the response shifts upward, into vertical solutions, so that services can be extended without spreading further into flood paths and farmland. Water scarcity calls for recycling and reuse, including rainwater harvesting built into the infrastructure itself. Storage beyond large dams includes wetlands, glacial basins, hill-torrent basins, coastal harvest belts and desalination. A project can be scored against these requirements before it is approved.",
    },
  ],
  "/scope": [
    {
      id: "intro",
      title: "What PRIA will do",
      gist: "The work the atlas is assigned to produce.",
      script:
        "Scope states what the atlas is assigned to produce for Vision 2047. The earlier pages explain the pressure. This page lists the work: the geometry of infrastructure, the methods and standards, the institutions that hold them, and finance that expects disaster. Partners can use it to see which product they are responsible for, and to tell a completed analysis from a task that is still assigned.",
    },
    {
      id: "scope",
      title: "The assignment",
      gist: "Plan the geometry, set the methods, name the institutions, and fund the risk.",
      script:
        "The assignment falls into four groups. Planning covers the geometry of infrastructure through 2047, using digital twins, artificial-intelligence models and spatial analysis, plus the saturation thresholds of major cities, smaller towns near new wetlands, and suggested new areas. Those planning products are the task. Where the portal has not yet published a finished geometry or a named new town, treat the item as assigned work, not as a completed finding. Methods cover global practice adapted for Pakistan, cost-effective construction, culturally acceptable solutions, and local materials. Institutions name the bodies that must hold the standards. Finance and risk cover funding that plans for disaster loss in advance. Use the groups to brief a ministry on its part of the atlas.",
    },
  ],
  "/stakeholders": [
    {
      id: "intro",
      title: "Who has to act",
      gist: "An atlas changes nothing until someone is responsible for it.",
      script:
        "An atlas changes construction only when institutions use it. N.D.M.A. holds P.R.I.A. Federal ministries, provinces, Azad Jammu and Kashmir, Gilgit-Baltistan, designers, suppliers and local regulators have to carry it into programmes, by-laws and sites. This page names that chain so each actor can see where their duty starts.",
    },
    {
      id: "flow",
      title: "The chain",
      gist: "NDMA sets it. Policy adopts it. Execution builds it.",
      script:
        "Accountability runs in one direction. N.D.M.A. holds the atlas and sets the hazard-informed reference. The policy tier turns that reference into programmes, plans and by-laws. The execution tier makes it physical: designs, materials, trained workers and controls on encroachment. If a tier is missing, the recommendation stays on the page and the next flood or earthquake meets the old stock.",
    },
    {
      id: "tiers",
      title: "Policy and execution",
      gist: "Federal, provincial, and the people who actually build.",
      script:
        "The policy tier includes the federal ministries, the provincial governments, and the governments of Azad Jammu and Kashmir and Gilgit-Baltistan. They adopt the atlas in housing policy, land rules and building control. The execution tier includes academia, designers, architects, material suppliers, quarries, and the agencies that keep flow paths clear of encroachment. A planner can use these lists to see who must be in the room before a standard can be issued and then built.",
    },
  ],
  "/segments": [
    {
      id: "intro",
      title: "The four grounds",
      gist: "The working heart of the atlas.",
      script:
        "Regional segments turn the national picture into a place. There are four grounds: mountain, riverine and plains, desert and arid, and coastal. Inside each one, the atlas asks the same six questions, from homes to industry, so a road, a market or a house can be compared across grounds and still be designed for the local hazard. Open a segment when the project site is known.",
    },
    {
      id: "board",
      title: "Open a ground",
      gist: "Each card is a different Pakistan.",
      script:
        "Each card is a different planning problem. Mountain regions cover Gilgit-Baltistan, northern Khyber Pakhtunkhwa, and Azad Jammu and Kashmir. Riverine and plains cover Punjab, southern Khyber Pakhtunkhwa and northern Sindh. Desert and arid ground covers southern Punjab, Sindh and Balochistan. The coast covers southern Sindh and coastal Balochistan. Choose the card that contains the site. The recommendations inside follow that ground's hazards.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segments-view", { detail: "cards" })),
    },
    {
      id: "board",
      title: "The same six questions",
      gist: "Compare the grounds without losing the categories.",
      script:
        "The compare view lines up homes, markets, communications, strategic works, the private sector and industry across all four grounds. Use it to see which responses have to differ because the hazard differs, and which methods, such as inspection or maintenance, can be shared. A national standard that survives this comparison is specific where the danger is specific, and common where the duty is the same.",
      prepare: () => window.dispatchEvent(new CustomEvent("pria-demo-segments-view", { detail: "compare" })),
    },
  ],
  "/drim": [
    {
      id: "intro",
      title: "Models, not slogans",
      gist: "NDMA’s house designs, tied to a place and a hazard.",
      script:
        "D.R.I.M. is the shelf of disaster-resilient house models published by N.D.M.A. Each model is a way of building that is meant to stand up to a stated hazard, in the provinces and regions named on its board. Housing programmes, architects and building-control offices can use the shelf to shortlist a house that fits the site, and then open the board, the photograph and the P.D.F. before specifying it.",
    },
    {
      id: "glance",
      title: "The shelf",
      gist: `${drimModels.length} models, across ${provinces.length} provinces and regions.`,
      script: `The shelf holds ${drimModels.length} house models, across ${provinces.length} provinces and regions, ${Object.keys(drimHazards).length} kinds of hazard, and ${Object.keys(drimSystems).length} construction systems. The count shows the range. The useful step is the match: the hazard on the site, the region named on the board, and a system the local builders can actually construct and maintain.`,
    },
    {
      id: "explore",
      title: "Find the match",
      gist: "Filter until the model fits the place you are planning.",
      script:
        "Filter by province, segment, hazard or construction system until the set is one a planner in that place could specify. Then open the model. The board states the features and materials. The photograph shows the built form. The P.D.F. is the document to keep on the project file. Filtering first avoids applying a flood house in an earthquake zone, or an earthquake house on a storm-surge coast, unless the board itself allows that region.",
    },
    {
      id: "provinces",
      title: "Suitability",
      gist: "A model is recommended only where its board says it belongs.",
      script:
        "Each province is paired with the models whose boards name it. That pairing is the suitability test. A structure developed for mountain earthquakes answers a different problem from a house raised against flood or surge. Use the province list to confirm that the model you want is recommended for the region you are designing, and keep other models as references.",
    },
  ],
  "/summary/ndma-role": [
    {
      id: "intro",
      title: "Why NDMA holds the atlas",
      gist: "The authority already charged with disaster is charged with what gets built.",
      script:
        "Under the National Disaster Management Act of 2010, N.D.M.A. is the lead federal agency for disaster management. It prepares the national plan, guides ministries and provinces, and coordinates preparedness, response and recovery. P.R.I.A. extends that duty from work after a disaster to the standards for what is built before the next one. The 2022 floods damaged or destroyed 2.29 million houses and a large share of roads and bridges. The role of the authority is to help the country avoid repeating that exposure.",
    },
    {
      id: "body",
      title: "The work inside PRIA",
      gist: "Own the atlas, set the recommendations, and audit whether they are used.",
      script:
        "Inside the atlas, N.D.M.A. sets the hazard-informed recommendations for four segments and six categories of infrastructure. It defines protected flow zones, where building should stay clear of the paths water and debris already use. It also owns the E infra audit, the periodic check of whether a completed project still follows the recommendation. Provinces and project agencies can use that structure to know which advice is national, and which inspection should report back.",
    },
  ],
  "/summary/responsibilities": [
    {
      id: "intro",
      title: "Responsibility after the atlas",
      gist: "A recommendation is unfinished until an institution adopts it.",
      script:
        "A recommendation is unfinished until an institution adopts it and a local office enforces it. National stakeholders set housing policy, standards and supply. Area governments issue permits, control encroachment and live with the result after every monsoon and every earthquake. This page divides that work so each level can see its own duty.",
    },
    {
      id: "body",
      title: "Three layers of duty",
      gist: "Policy writes it. Execution supplies it. The district enforces it.",
      script:
        "The policy tier turns the atlas into housing policy, spatial plans and by-laws. The execution tier trains builders, prepares design templates, and supplies materials that can pass a test. Area governments issue the permits and report compliance through the E infra audit. Use the three layers to assign a budget and a responsible office, so a standard written in Islamabad is the standard inspected on the site.",
    },
  ],
  "/summary/conclusion": [
    {
      id: "intro",
      title: "The argument, closed",
      gist: "Exposure is already measured. The atlas is the shared answer.",
      script:
        "The conclusion draws the census, the pattern of growth, and the disasters already on record into one case for a shared atlas. Everyday decisions about a house, a market, a road or a drain are where resilience is won or lost. P.R.I.A. gives those decisions a common, hazard-informed reference for the next twenty years.",
    },
    {
      id: "body",
      title: "One reference",
      gist: "Everyday building decisions, against one hazard-informed standard.",
      script:
        `The refined housing count is about ${housingMn} million units, and about ${national.kachaPct} percent of them are kutcha. That temporary stock, together with scattered growth and the losses already recorded, is why a single habit of building is not enough. The atlas answers with four segments and six categories, so a house, a market or a road is judged by the hazard of its own ground. Agencies can use that structure to replace a generic design with one that fits the site.`,
    },
  ],
  "/summary/end-state": [
    {
      id: "vision",
      title: site.vision,
      gist: "The year the atlas is building toward.",
      script: `${site.vision} is the planning horizon of the atlas. By that year, the way Pakistan sites and builds infrastructure should have changed, using the evidence in this portal. ${site.closingLine}.`,
    },
    {
      id: "intro",
      title: "The country we are aiming at",
      gist: "Every new project, planned against the hazard of its own ground.",
      script:
        "The desired end state is practical. By 2047, a new building or infrastructure project is planned against the hazards of its segment, and built to that segment's recommendations. Population, services and risk are considered together, so housing demand, water, drainage and access are sized for the projected community, on land the hazard profile allows.",
    },
    {
      id: "body",
      title: "What changed",
      gist: "Thresholds, clear flow zones, safer houses, and an audit that stays current.",
      script:
        "In that end state, cities grow inside known saturation limits. Protected flow zones stay clear of houses and encroachments. Unsafe housing is replaced with local, affordable designs that match the hazard. The E infra audit keeps the record current, so the next flood, earthquake or cyclone meets stock and institutions that were prepared. Treat this as the aim of the atlas, and use the data pages to measure how far a province still is from it.",
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

function hazardPhrase(segment: Segment) {
  const labels = segmentProfiles[segment.id]?.hazards.map((hazard) => hazard.label.toLowerCase().replace(/&/g, "and")) ?? [];
  if (labels.length === 0) return "the hazards recorded for this ground";
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function categoryScript(category: InfraCategory, segment: Segment) {
  const ground = segment.shortTitle;
  const hazards = hazardPhrase(segment);
  const lines: Record<string, { gist: string; script: string }> = {
    residential: {
      gist: "Homes that have to survive this ground's hazards.",
      script: `Housing is where most people meet ${hazards} on the ${ground} ground. The house has to remain standing, and it has to stay affordable to build and repair. D.R.I.M. models are the house forms matched to this kind of danger. Housing departments, designers and building control can use this category to choose a form, a material and a site rule before a scheme is approved.`,
    },
    commercial: {
      gist: "Markets and workplaces that gather many people at once.",
      script: `Markets, shops and workplaces on the ${ground} ground face ${hazards}, and they gather many people in one place. A failure during business hours puts a street of people at risk and can cut off local incomes. Use this category to set materials, layout and construction so a commercial building can be evacuated safely, and can return to use after the event.`,
    },
    communication: {
      gist: "Links that keep the ground reachable in a disaster.",
      script: `Communication infrastructure is how the ${ground} ground stays reachable when ${hazards} damage a road, a bridge or a cable. Relief, clinics and markets all depend on that link. Engineers can use this category to plan a second path, a crossing that survives the hazard, and a repair method that restores access quickly.`,
    },
    strategic: {
      gist: "The works the rest of the ground depends on.",
      script: `Strategic works on the ${ground} ground include the roads, bridges, embankments, ports and power lines that homes and services depend on. They face ${hazards}. If they fail, help cannot arrive and everyday systems stop. Agencies can use this category to identify exposed assets, compare protection options, and put the structures that serve the most people first.`,
    },
    "private-sector": {
      gist: "How approval and site practice carry the standard into the build.",
      script: `Most construction on the ${ground} ground is carried out by private builders, owners and suppliers. Their approvals, materials and site practice decide whether the response to ${hazards} is actually built. Regulators can use this category to see which checks, material standards and inspection points keep ordinary projects aligned with the hazard.`,
    },
    industrial: {
      gist: "Plant and estates that must not spread a failure.",
      script: `Industry on the ${ground} ground includes plants, mines and estates. They have to sit where the land can bear ${hazards}, and a failure has to stay contained so it does not spread into water supplies, homes or neighbouring land. Licensing and planning authorities can use this category to compare sites and to set containment, drainage and shutdown measures before an estate is approved.`,
    },
  };
  return (
    lines[category.id] ?? {
      gist: `${category.shortTitle} for this ground's hazards.`,
      script: `${category.title} applies the ${ground} hazards, ${hazards}, to this class of infrastructure. Use it to see how exposure, design and maintenance change for this asset type, and to keep the response comparable with the same asset on the other grounds.`,
    }
  );
}

function guidanceLine(sub: SubSection) {
  if (sub.status !== "available" || sub.items.length === 0) {
    return " This subsection is still pending. The atlas has no recommendation to apply here yet, so a project should wait for published guidance before treating ordinary local practice as approved.";
  }
  return " The items shown are planning guidance drawn from established practice in Pakistan, including the building code and post-disaster housing guidance where those sources are named. Confirm the note on each item before it is written into a specification.";
}

function subScript(sub: SubSection, category: InfraCategory, segment: Segment) {
  const ground = segment.shortTitle;
  const kind = category.shortTitle.toLowerCase();
  const hazards = hazardPhrase(segment);
  const tail = guidanceLine(sub);
  if (sub.id === "material-options") {
    return {
      gist: "Materials chosen for the way this hazard acts.",
      script: `Material choice decides whether ${kind} on the ${ground} ground survives ${hazards}. The right material resists the local danger, can be maintained locally, and stays within reach of the households or agencies who must pay for it. Compare the listed options by durability under that hazard, by local supply, and by the standard named on the item.${tail}`,
    };
  }
  if (sub.id === "design-options") {
    return category.id === "residential"
      ? {
          gist: "House forms, including the D.R.I.M. models, for this hazard.",
          script: `Design for homes on the ${ground} ground sets the plan, the structure and the D.R.I.M. models that fit ${hazards}. Look at how the house behaves under that hazard: how it is tied together, how water or debris passes, and how people get out. Designers can use these options to select a form before the drawing is submitted for approval.${tail}`,
        }
      : {
          gist: "Layout and structure for this class of infrastructure.",
          script: `Design for ${kind} on the ${ground} ground sets the layout and the structure that let this asset survive ${hazards}. Judge each option by exposure, by the people or services that depend on it, and by whether it can be built with the skills available locally. House models stay with residential design. Here the question is the performance of this infrastructure.${tail}`,
        };
  }
  if (sub.id === "construction-methodology" || sub.id === "construction-methodologies") {
    return {
      gist: "Site method that keeps the design intact.",
      script: `Construction methodology is how ${kind} on the ${ground} ground is actually built under the pressure of ${hazards}. Bands, drainage, foundations and sequencing matter because a correct drawing fails when the site ignores them. Supervisors can use these steps to inspect the work at the stages where a mistake becomes permanent.${tail}`,
    };
  }
  if (sub.id === "no-go-areas") {
    return {
      gist: "Places the hazard already uses, kept clear of building.",
      script: `Protected flow zones on the ${ground} ground are the paths already used by ${hazards}. Keeping homes and other works out of those paths reduces loss more reliably than a stronger building in the wrong place. Land-use authorities can use this guidance to hold drainage lines, debris fans, floodplains and surge zones clear when permits are issued.${tail}`,
    };
  }
  if (sub.id === "tourism-templates") {
    return {
      gist: "Visitor facilities held to the same hazard limits.",
      script: `Tourism on the ${ground} ground brings visitors into the same ${hazards} that residents face. Guest facilities need the same siting limits, materials and escape routes as other buildings, because a crowded seasonal site can multiply the loss. Tourism and local authorities can use these templates to set that standard before a site is leased or expanded.${tail}`,
    };
  }
  if (sub.id === "maintenance") {
    return {
      gist: "The upkeep that keeps a resilient design working.",
      script: `Maintenance is what keeps a ${kind} recommendation on the ${ground} ground effective after handover. Drains block, ties loosen, and protective elements weather. Without a funded routine, the next occurrence of ${hazards} meets a weakened structure. Owners and local agencies can use this list to assign tasks, seasons and responsibility for upkeep.${tail}`,
    };
  }
  if (sub.id === "e-infra-audit") {
    return {
      gist: "A periodic check of what was built, and by whom.",
      script: `The E infra audit is the periodic check of ${kind} on the ${ground} ground after construction. It asks what to inspect, in what form, and which agency should do it, so the response to ${hazards} can be verified on the site. Audit bodies can use this subsection to set the checklist and the reporting line that keeps the atlas current.${tail}`,
    };
  }
  return {
    gist: "Further subjects that still affect safe building here.",
    script: `Other subjects collect the remaining guidance for ${kind} on the ${ground} ground that still affects how ${hazards} should be planned for. Review them with the materials, design and siting advice so a project brief stays complete.${tail}`,
  };
}

function optionSteps(segment: Segment, first?: InfraCategory): DemoStep[] {
  const categories = first
    ? [first, ...segment.categories.filter((category) => category.id !== first.id)]
    : segment.categories;
  return categories.flatMap((category) => {
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
  const regions = segment.regions.join(", ").replace(/&/g, "and");
  const hazards = hazardPhrase(segment);
  return [
    {
      id: "hero",
      title: segment.shortTitle,
      gist: `${regions}, planned for ${hazards}.`,
      script: `${segment.title} covers ${regions}. The hazards that define this ground are ${hazards}. People, houses, roads and services here share that exposure, so a design borrowed from a calmer or a different ground can fail when this hazard arrives. Engineers, planners and local agencies can use the segment to identify exposed assets, compare ways of building, and hold development off the paths the hazard already uses.`,
    },
    {
      id: "tabs",
      title: "The six questions",
      gist: `The same six asset types, answered for ${category.shortTitle.toLowerCase()} first.`,
      script: `Every segment is asked about homes, commerce, communications, strategic works, the private sector and industry. Asking the same questions makes the grounds comparable, while the answers follow ${hazards}. This view opens on ${category.title}. Move to another category when the asset in front of you changes, and keep the ground the same.`,
    },
    {
      id: "content",
      title: category.shortTitle,
      gist: "A build brief: materials, design, method, siting and upkeep.",
      script: `Treat ${category.shortTitle.toLowerCase()} for ${segment.shortTitle} as a build brief for ${hazards}. Start with materials and design, then the construction method, the places that should stay clear, and the maintenance and audit that keep the measure working. Where a subsection is marked pending, the atlas is not offering a recommendation yet. Use only the items that are published, and check the source named on each one.`,
    },
    ...optionSteps(segment, category),
    {
      id: "hazards",
      title: "Why these rules",
      gist: "The danger comes before the detail.",
      script: `The recommendations above follow the hazard profile of the ${segment.shortTitle} ground: ${hazards}. Use the profile to see which assets are exposed and why a material, a setback or a maintenance task is required. The figures shown with the profile are recorded facts from the sources named beside them. Apply a measure because it answers one of these hazards.`,
    },
    {
      id: "models",
      title: "A house that fits",
      gist: "DRIM models filtered to this ground.",
      script: `The house models below are the N.D.M.A. designs suited to ${segment.shortTitle}, where ${hazards} are the design problem. Open a model to read its board, its features and its materials, and confirm that the region on the board includes the project site before it is specified.`,
    },
  ];
}

function modelSteps(slug: string): DemoStep[] {
  const model = getDrimModel(slug);
  if (!model) return [];
  const hazards = model.hazards.map((hazard) => drimHazards[hazard].label.replace(/&/g, "and")).join(" and ");
  const regions = model.regions.map((region) => region.label.replace(/&/g, "and")).join(", ");
  const system = drimSystems[model.system];
  return [
    {
      id: "intro",
      title: model.title,
      gist: `${system}, for ${hazards.toLowerCase()}.`,
      script: `${model.title} is an N.D.M.A. house model using ${system}. It is intended to stand up to ${hazards.toLowerCase()}. Designers and housing programmes can use it where that danger is the one on the site, and where the board names the region. The features and materials that follow are the contents of the published board.`,
    },
    {
      id: "viewer",
      title: "The board",
      gist: "Photograph, display board, and the PDF behind them.",
      script: `The photograph and the display board are the published N.D.M.A. record of ${model.title}. Use them to see the form, the stated features and the stated materials. Keep the P.D.F. on the project file as the full document, and rely on the board when a shorter note and the board differ.`,
    },
    {
      id: "regions",
      title: "Where it belongs",
      gist: "Suitable only for the regions named on the board.",
      script: `The board places ${model.title} in ${regions}. That geography is the recommendation. In those regions, the model can be taken forward for ${hazards.toLowerCase()}, subject to site checks. Outside them, keep the model as a reference and select the design whose board names the project region. The map is there so suitability is read from location.`,
    },
    {
      id: "features",
      title: "What makes it resilient",
      gist: "The features are the reason this model was chosen.",
      script: `The salient features are the reasons ${model.title} is expected to perform under ${hazards.toLowerCase()}. Read them as structural and siting behaviour: how the house is tied, raised, braced or protected. Specify those features when the model is adopted, because the resilience sits in the behaviour, and a similar-looking house without them does not carry the same performance.`,
    },
    {
      id: "materials",
      title: "What it is built from",
      gist: "Specified materials, so the model can be costed and checked.",
      script: `The materials are part of the recommendation for ${model.title}, as stated on the N.D.M.A. boards. Builders and building-control offices can use the list to cost the model, to check what arrives on site, and to reject a substitution that the board does not allow. A change of material needs an engineering check against ${hazards.toLowerCase()} before it is accepted.`,
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
