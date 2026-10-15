/**
 * Baseline recommendations per segment → category → sub-section.
 *
 * Drawn from established practice in Pakistan: the Building Code of Pakistan (Seismic Provisions 2007),
 * ERRA's post-2005 rural housing guidelines, NDMA / PDMA guidance after the 2010 and 2022 floods,
 * the GLOF-I/II programmes, and Census 2023 housing data. Content published through the PRIA API
 * replaces a sub-section's items here.
 */
import type { RecommendationContent, RecommendationItem } from "./pria";

type Rec = [title: string, description: string, tags?: string[]];

function list(prefix: string, recs: Rec[]): RecommendationItem[] {
  return recs.map(([title, description, tags], i) => ({ id: `${prefix}-${i + 1}`, title, description, tags }));
}

function build(
  segment: string,
  categories: Record<string, Record<string, Rec[]>>,
): NonNullable<RecommendationContent[string]> {
  return Object.fromEntries(
    Object.entries(categories).map(([category, subs]) => [
      category,
      Object.fromEntries(Object.entries(subs).map(([sub, recs]) => [sub, list(`${segment}-${category}-${sub}`, recs)])),
    ]),
  );
}

/* --------------------------------- Mountain -------------------------------- */

const mountain = build("mountain", {
  residential: {
    "material-options": [
      [
        "Timber-laced masonry: Dhajji Dewari and Bhatar",
        "Traditional timber frames with stone or brick infill (Dhajji) and stone walls with horizontal timber runners (Bhatar) flex rather than collapse; both were accepted as compliant rural designs in ERRA's reconstruction after 2005.",
        ["ERRA", "Seismic", "Local materials"],
      ],
      [
        "Confined masonry with reinforced-concrete bands",
        "Brick or concrete-block walls confined by RC tie-columns at corners and junctions, tied together by plinth, lintel and roof bands so the house moves as one box.",
        ["BCP 2007", "Seismic"],
      ],
      [
        "Lightweight roofs instead of heavy mud or stone roofs",
        "Timber or light-gauge steel trusses with CGI or insulated sheet roofing, securely tied to the walls, reduce the mass that falls on occupants when walls are shaken.",
        ["Seismic", "Snow load"],
      ],
    ],
    "design-options": [
      [
        "Design to the Building Code of Pakistan (Seismic Provisions 2007)",
        "The northern belt of GB, AJK and Hazara/Malakand lies in the code's higher seismic zones; every new house design template should be checked against the zone at its site.",
        ["BCP 2007", "Seismic zoning"],
      ],
      [
        "Compact, symmetric plans with limited openings",
        "Rectangular plans close to 1:2, openings kept away from corners and limited in total wall length, and no heavy overhangs or cantilevered storeys.",
        ["Seismic", "DRIM"],
      ],
      [
        "Climate-adapted envelope for cold regions",
        "Insulated walls and roofs, south-facing glazing and roof pitches that shed snow, to cut firewood demand and roof failures under heavy snow.",
        ["Energy", "Snow load"],
      ],
    ],
    "construction-methodology": [
      [
        "Continuous horizontal bands and corner reinforcement",
        "Plinth, sill, lintel and roof bands (RC or timber), vertical steel at corners and wall junctions, and through-stones in random-rubble masonry, as set out in the ERRA guidelines.",
        ["ERRA", "Seismic"],
      ],
      [
        "Site preparation on slopes",
        "Avoid cutting slopes without retaining walls, provide surface and sub-surface drainage behind structures, and keep houses back from cut edges, scarps and debris-flow fans.",
        ["Landslide"],
      ],
      [
        "Trained and certified masons and carpenters",
        "Train and certify local artisans in compliant construction before each reconstruction or housing programme, with inspection at the foundation, band and roof stages.",
        ["Capacity", "Quality control"],
      ],
    ],
    "no-go-areas": [
      [
        "GLOF flow paths below hazardous glacial lakes",
        "No new housing in the outburst flow paths and debris fans below the 33 glacial lakes assessed as hazardous; define these zones from GLOF-II hazard mapping.",
        ["GLOF", "Zoning"],
      ],
      [
        "Active river channels and valley flood plains",
        "Keep settlements out of the active channels and flood terraces of the Indus, Swat, Kunhar, Neelum, Hunza and their tributaries, which flash floods occupy within hours.",
        ["Flash flood", "Zoning"],
      ],
      [
        "Active fault traces, landslide and avalanche run-out zones",
        "Prohibit construction directly on mapped active fault traces, including the fault that ruptured in 2005, and in known landslide bodies and avalanche run-outs.",
        ["Seismic", "Landslide", "Avalanche"],
      ],
    ],
    "tourism-templates": [
      [
        "River setbacks for hotels and guest houses",
        "Enforce setbacks from river banks for tourism buildings; a newly built hotel in Swat collapsed into the river during the 2022 floods.",
        ["Flash flood", "Tourism"],
      ],
      [
        "Visitor-capacity, sewage and waste planning for valleys",
        "Approve new hotels in valleys such as Naran, Kalam, Hunza and Neelum only against a valley plan for road capacity, sewage treatment, solid waste and parking.",
        ["Tourism", "Planning"],
      ],
    ],
    maintenance: [
      [
        "Pre-monsoon and post-winter inspections",
        "Inspect roofs, roof-to-wall ties, retaining walls and drainage channels before the monsoon and after snowmelt, and repair cracks before the next season.",
        ["Maintenance"],
      ],
      [
        "Keep nullahs, culverts and drains clear",
        "Community and municipal clearing of nullahs and culverts so debris does not dam water against houses and roads.",
        ["Flash flood", "Maintenance"],
      ],
    ],
    "e-infra-audit": [
      [
        "Periodic structural audit of schools and health facilities",
        "About 19,000 students and teachers died in collapsed schools in 2005. Audit public buildings against the seismic code on a fixed cycle, led by PDMA KP, SDMA AJK and GBDMA with the works departments.",
        ["Audit", "Schools", "Seismic"],
      ],
      [
        "Geo-tagged register of house construction types",
        "Maintain a digital register of houses by construction type (pacca, semi-pacca, kacha), linked to Census 2023 enumeration blocks, to target retrofitting.",
        ["Audit", "Digital twin", "Census 2023"],
      ],
    ],
    "other-subjects": [
      [
        "Community-based early warning",
        "Extend the automatic weather stations, river-flow gauges and village warning committees established under GLOF-I and GLOF-II to every exposed valley.",
        ["GLOF", "Early warning"],
      ],
    ],
  },
  commercial: {
    "material-options": [
      [
        "Ductile RC or steel frames for bazaars and markets",
        "Use detailed RC or steel frames with lightweight infill for buildings above two storeys, in place of unreinforced masonry.",
        ["BCP 2007", "Seismic"],
      ],
      [
        "Non-combustible, lightweight cladding",
        "Light, well-anchored cladding and roofing, so falling parts do not block narrow bazaar streets used for evacuation.",
        ["Seismic", "Fire"],
      ],
    ],
    "design-options": [
      [
        "No soft storeys",
        "Avoid open ground floors with walled upper storeys (shops below, rooms above), a common collapse mechanism in earthquakes; add shear walls or bracing.",
        ["Seismic", "DRIM"],
      ],
      [
        "Evacuation space in bazaar layouts",
        "Plan open squares and minimum street widths in new and rebuilt bazaars as refuge and access space after an earthquake or landslide.",
        ["Planning"],
      ],
    ],
    "construction-methodologies": [
      [
        "Third-party structural review",
        "Independent design and site checks for commercial buildings above two storeys by registered engineers before occupancy certificates are issued.",
        ["Quality control", "PEC"],
      ],
      [
        "Slope protection for roadside commercial strips",
        "Retaining structures and drainage where markets are cut into slopes along highways such as the KKH and N-15.",
        ["Landslide"],
      ],
    ],
  },
  communication: {
    "material-options": [
      [
        "Galvanised towers rated for wind, ice and snow",
        "Telecom and broadcast towers designed for local wind and ice loading, with hot-dip galvanising for durability at altitude.",
        ["Telecom"],
      ],
      [
        "Armoured fibre and protective conduit",
        "Armoured cable and steel conduit at river, nullah and landslide crossings, where flash floods most often cut links.",
        ["Fibre", "Flash flood"],
      ],
    ],
    "design-options": [
      [
        "Two independent routes into every valley",
        "Ring or dual-path fibre and microwave backhaul so a single washed-out road or bridge does not isolate a valley.",
        ["Redundancy"],
      ],
      [
        "Satellite backup for isolated districts",
        "Satellite terminals at district headquarters and DDMA control rooms for use when the Karakoram Highway and terrestrial links are cut.",
        ["Redundancy", "Emergency"],
      ],
    ],
    "construction-methodologies": [
      [
        "Alignments away from river banks and unstable slopes",
        "Route cables on the uphill side of roads, away from eroding banks, using hazard maps to avoid landslide bodies.",
        ["Landslide", "Planning"],
      ],
      [
        "Solar-hybrid power with battery storage",
        "Off-grid solar-hybrid power at remote sites so communications survive extended grid outages after disasters.",
        ["Energy", "Continuity"],
      ],
    ],
  },
  strategic: {
    "material-options": [
      [
        "Durable bridge materials with scour protection",
        "Steel or prestressed-concrete bridges with protected foundations, replacing low causeways and timber crossings that floods remove.",
        ["Bridges"],
      ],
      [
        "Gabion and bioengineered slope protection",
        "Gabion walls, check dams and vegetation on slopes, the low-cost structures used under GLOF-II to protect villages and farmland.",
        ["GLOF", "Landslide"],
      ],
    ],
    "design-options": [
      [
        "Design crossings for debris flows and GLOF discharge",
        "Size bridges and culverts for debris-laden peak flows rather than clear-water floods, with freeboard for boulders and trees.",
        ["GLOF", "Hydraulics"],
      ],
      [
        "Seismic design of dams, tunnels and power infrastructure",
        "Site-specific seismic hazard assessment for dams, tunnels, grid stations and transmission lines in the northern belt.",
        ["Seismic", "Energy"],
      ],
    ],
    "construction-methodologies": [
      [
        "Slope stabilisation along strategic highways",
        "Systematic stabilisation, rockfall barriers and drainage on the Karakoram Highway and other strategic corridors, which landslides closed repeatedly in 2022.",
        ["Landslide", "Roads"],
      ],
      [
        "Pre-positioned bridging and plant",
        "Store modular steel bridges and earth-moving plant in each district to reopen routes within days.",
        ["Emergency", "Roads"],
      ],
    ],
  },
  "private-sector": {
    "material-options": [
      [
        "Certified local timber, stone and blocks",
        "Support local supply chains for treated timber, dressed stone and quality-tested blocks so compliant construction is affordable in remote valleys.",
        ["Local materials", "Supply chain"],
      ],
    ],
    "design-options": [
      [
        "Hazard-map checks for private housing schemes",
        "Approve private housing and hotel schemes only after checks against GLOF, flood, landslide and seismic hazard maps.",
        ["Zoning", "Approvals"],
      ],
    ],
    "construction-methodologies": [
      [
        "Licensed contractors and registered engineers",
        "Require PEC-registered contractors and engineers for buildings above a set size, with insurance cover for structural defects.",
        ["PEC", "Quality control"],
      ],
    ],
  },
  industrial: {
    "material-options": [
      [
        "Robust plant for hydropower and processing sites",
        "Hydropower intakes, powerhouses and processing plants built to resist debris impact and inundation of critical equipment.",
        ["Hydropower"],
      ],
    ],
    "design-options": [
      [
        "GLOF and flood hazard assessment for hydropower",
        "Mandatory GLOF and flash-flood assessment for every hydropower project, with early-warning links to downstream communities.",
        ["GLOF", "Hydropower"],
      ],
    ],
    "construction-methodologies": [
      [
        "Quarry, mining and spoil management",
        "Benching and drainage of quarry and mine faces, and spoil disposal away from streams, so waste does not feed debris flows.",
        ["Mining", "Landslide"],
      ],
    ],
  },
});

/* ----------------------------- Riverine & plains ---------------------------- */

const riverine = build("riverine-plains", {
  residential: {
    "material-options": [
      [
        "Fired brick in cement–sand mortar below flood level",
        "Mud-mortar and unbaked-brick walls dissolve when inundated, which is how most of the 2.29 Mn houses damaged in 2022 failed. Use fired brick or blocks in cement mortar at least up to the highest recorded flood level.",
        ["2022 floods", "Flood resilient"],
      ],
      [
        "Compressed stabilised earth blocks (CSEB)",
        "Cement- or lime-stabilised earth blocks made on site give a low-cost, water-resistant alternative to unfired mud bricks for rural housing.",
        ["Low cost", "Local materials"],
      ],
      [
        "Water-resistant finishes on lower walls and floors",
        "Cement plaster, ceramic or stone flooring and moisture-resistant doors below flood level, so houses can be cleaned and reoccupied quickly.",
        ["Flood resilient"],
      ],
    ],
    "design-options": [
      [
        "Raised plinths above the highest recorded flood",
        "Set plinth heights from the highest recorded flood level of the area, with raised courtyards for livestock.",
        ["Flood resilient", "DRIM"],
      ],
      [
        "Accessible flat roofs as a refuge",
        "Strong flat roofs with permanent stair access where flash or riverine floods leave no time to evacuate.",
        ["Flood resilient"],
      ],
      [
        "Vertical housing to save farmland",
        "Ground-plus-two and mid-rise housing in growing towns, in place of horizontal sprawl over agricultural land and flood plains.",
        ["Vertical growth", "Land use"],
      ],
    ],
    "construction-methodology": [
      [
        "Damp-proof course and protected foundations",
        "A continuous damp-proof course, compacted fill and foundations taken below scour depth, so long standing water does not undermine walls.",
        ["Flood resilient"],
      ],
      [
        "Elevated electrical wiring and services",
        "Switchboards, meters, pumps and gas connections above flood level so homes can be re-energised safely after floods.",
        ["Services"],
      ],
    ],
    "no-go-areas": [
      [
        "Active flood plains of the Indus and its tributaries",
        "No permanent settlement inside the river beds and flood plains (katcha areas) of the Indus, Jhelum, Chenab, Ravi and Sutlej without protected high ground.",
        ["Riverine flood", "Zoning"],
      ],
      [
        "Hill-torrent paths and fans",
        "Keep housing off the paths and fans of hill torrents from the Koh-e-Suleman range, which flooded Taunsa and D.G. Khan in 2022, and from the Kirthar range in Sindh.",
        ["Hill torrent", "Zoning"],
      ],
      [
        "Embankment breach and toe zones",
        "Maintain a no-build strip along the inner and outer toe of flood embankments and around known breach points.",
        ["Embankments", "Zoning"],
      ],
    ],
    "tourism-templates": [
      [
        "Flood-safe heritage and riverside visitor sites",
        "Visitor facilities at riverside heritage, shrine and recreation sites placed outside the flood line, with signed evacuation routes.",
        ["Tourism", "Heritage"],
      ],
    ],
    maintenance: [
      [
        "Annual pre-monsoon desilting",
        "Desilt urban drains, nullahs and irrigation channels before every monsoon; blocked drains drive urban flooding in Lahore, Rawalpindi and other cities.",
        ["Urban flood", "Maintenance"],
      ],
      [
        "Embankment inspection and repair",
        "Inspect and repair flood embankments and spurs with the irrigation departments before the flood season.",
        ["Embankments", "Maintenance"],
      ],
    ],
    "e-infra-audit": [
      [
        "Standard post-flood damage assessment",
        "A common house-by-house damage format, as used in the 2022 Post-Disaster Needs Assessment, applied by PDMAs after every flood season.",
        ["Audit", "PDNA"],
      ],
      [
        "Satellite flood-extent mapping",
        "Overlay satellite flood maps on settlement and Census 2023 housing data each season to find repeatedly flooded areas.",
        ["Audit", "Digital twin"],
      ],
    ],
    "other-subjects": [
      [
        "Flood forecasting and warning",
        "Link village and union-council warning to the Pakistan Meteorological Department's flood forecasting and the Federal Flood Commission's seasonal plans.",
        ["Early warning"],
      ],
    ],
  },
  commercial: {
    "material-options": [
      [
        "Flood-resistant ground floors for markets",
        "Concrete or masonry ground floors with water-resistant finishes and raised display and storage levels.",
        ["Flood resilient"],
      ],
    ],
    "design-options": [
      [
        "No basements in flood-prone areas",
        "Restrict basements and underground parking in flood-prone areas, or require pumping and flood barriers.",
        ["Urban flood"],
      ],
      [
        "Rainwater detention in large commercial plots",
        "On-site detention tanks and permeable paving for malls and markets to reduce peak runoff into city drains.",
        ["Urban flood", "Water"],
      ],
    ],
    "construction-methodologies": [
      [
        "Site drainage approval before building permits",
        "Building-control approval of the drainage plan before construction starts on large commercial sites.",
        ["Approvals"],
      ],
    ],
  },
  communication: {
    "material-options": [
      [
        "Raised, sealed equipment cabinets",
        "Telecom shelters and cabinets on plinths above flood level with sealed cable entries.",
        ["Telecom", "Flood resilient"],
      ],
    ],
    "design-options": [
      [
        "Diverse river crossings for fibre",
        "Carry fibre across rivers on at least two separate structures, as bridges lost in floods take their cables with them.",
        ["Redundancy", "Bridges"],
      ],
    ],
    "construction-methodologies": [
      [
        "Microwave and satellite backup",
        "Microwave links and portable satellite units to restore connectivity to flooded districts.",
        ["Redundancy", "Emergency"],
      ],
    ],
  },
  strategic: {
    "material-options": [
      [
        "Erosion-resistant embankment protection",
        "Stone pitching, geotextiles and spurs on vulnerable embankment reaches, prioritised by breach history.",
        ["Embankments"],
      ],
    ],
    "design-options": [
      [
        "Roads with adequate cross-drainage",
        "Road and rail embankments with enough culverts and bridges that they do not act as dams across the floodplain, a major problem in 2022.",
        ["Roads", "2022 floods"],
      ],
      [
        "Bridges re-rated for 2022-level discharges",
        "Review bridge waterways and scour depths against the discharges recorded in 2022, when 439 bridges were damaged.",
        ["Bridges", "Hydraulics"],
      ],
    ],
    "construction-methodologies": [
      [
        "Raise critical routes above flood level",
        "Raise sections of national highways and access roads to flood-prone districts so relief can move during floods.",
        ["Roads", "Emergency"],
      ],
    ],
  },
  "private-sector": {
    "material-options": [
      [
        "Quality-tested bricks, cement and steel",
        "Testing and labelling of bricks, cement and reinforcement from private suppliers, with district-level testing facilities.",
        ["Quality control", "Supply chain"],
      ],
    ],
    "design-options": [
      [
        "Drainage and flood checks for private housing societies",
        "No-objection certificates for housing societies only with approved drainage plans and finished levels above the flood line.",
        ["Approvals", "Urban flood"],
      ],
    ],
    "construction-methodologies": [
      [
        "No private development in flood plains",
        "Enforce bans on private schemes inside river flood plains and on filled-in natural drainage channels.",
        ["Zoning", "Encroachment"],
      ],
    ],
  },
  industrial: {
    "material-options": [
      [
        "Raised critical equipment",
        "Motors, control panels, chemical stores and backup generators placed above flood level.",
        ["Flood resilient", "Continuity"],
      ],
    ],
    "design-options": [
      [
        "Industrial estates outside flood plains",
        "Locate new industrial estates and special economic zones outside mapped flood plains, with flood bunds for existing ones.",
        ["Zoning"],
      ],
    ],
    "construction-methodologies": [
      [
        "Effluent and chemical containment",
        "Secondary containment for effluent ponds and chemical stores so floods do not spread contamination to farms and water supplies.",
        ["Environment"],
      ],
    ],
  },
});

/* ---------------------------- Desert, semi-desert & arid -------------------------- */

const desert = build("desert-arid", {
  residential: {
    "material-options": [
      [
        "Thermal mass from local stone and stabilised earth",
        "Thick walls of stone or stabilised earth delay daytime heat gain; stabilise earth with lime or cement so walls survive the flash floods that destroyed mud houses in Balochistan in 2022.",
        ["Heat", "Local materials"],
      ],
      [
        "Cool, reflective roofs",
        "Light-coloured or reflective roof coatings and insulated roofs lower indoor temperatures in places that have recorded above 50 °C, such as Turbat, Sibi and Jacobabad.",
        ["Heat", "Energy"],
      ],
      [
        "Upgrade the kacha housing stock",
        "59.0% of houses in Balochistan are kacha (July 2026 refined count) and 61% have mud or unbaked-brick walls (Census 2023); prioritise these households for durable, affordable materials.",
        ["Census 2023", "Housing quality"],
      ],
    ],
    "design-options": [
      [
        "Courtyards, shading and cross-ventilation",
        "Inward-looking courtyard plans, deep verandas, small shaded openings and orientation that limits east–west exposure.",
        ["Heat", "Passive cooling"],
      ],
      [
        "Wind catchers and stack ventilation",
        "Roof wind catchers, a traditional feature of Hyderabad, Sindh, and ventilation shafts that draw air through houses without power.",
        ["Passive cooling", "Heritage"],
      ],
      [
        "Rainwater storage in every house",
        "Covered underground tanks fed by roofs and courtyards, building on traditional Thar and Cholistan water-harvesting practice.",
        ["Water", "Drought"],
      ],
    ],
    "construction-methodology": [
      [
        "Hot-weather concreting and curing",
        "Schedule concreting in cooler hours and keep work covered and moist while curing, as high temperatures and dry winds crack poorly cured concrete and plaster.",
        ["Quality control", "Heat"],
      ],
      [
        "Water-efficient construction",
        "Cut construction water demand through stabilised blocks, recycled water for curing and dry construction systems where water is trucked in.",
        ["Water"],
      ],
    ],
    "no-go-areas": [
      [
        "Dry riverbeds and nullahs",
        "No building in dry riverbeds and nullah channels that fill suddenly in flash floods.",
        ["Flash flood", "Zoning"],
      ],
      [
        "Moving dune fields",
        "Avoid settlement and roads across active sand dunes without stabilisation by vegetation or barriers.",
        ["Sand drift", "Zoning"],
      ],
    ],
    "tourism-templates": [
      [
        "Desert tourism sites with shade, water and first aid",
        "Templates for visitor facilities at sites such as Derawar Fort in Cholistan and Nagarparkar in Thar: shaded rest areas, potable water, heat first aid and solar power.",
        ["Tourism", "Heat"],
      ],
    ],
    maintenance: [
      [
        "Seasonal re-coating of roofs and plaster",
        "Renew reflective roof coatings and repair plaster before summer and after the rains to prevent heat gain and water damage.",
        ["Maintenance", "Heat"],
      ],
      [
        "Desilting of rainwater tanks and ponds",
        "Clean household tanks and village ponds before the monsoon so they capture the full season's rain.",
        ["Maintenance", "Water"],
      ],
    ],
    "e-infra-audit": [
      [
        "Heat-vulnerability survey of housing",
        "Survey roof types, ventilation and access to cooling in districts with recorded extreme heat, to target cooling retrofits and heat shelters.",
        ["Audit", "Heat"],
      ],
      [
        "Water infrastructure audit",
        "Audit tanks, wells, ponds, pipelines and solar pumps each year with the public health engineering departments.",
        ["Audit", "Water"],
      ],
    ],
    "other-subjects": [
      [
        "Heatwave action plans",
        "City and district heatwave plans with early warning, cooling centres and hospital surge capacity, following the response after the 2015 heatwave.",
        ["Heat", "Early warning"],
      ],
    ],
  },
  commercial: {
    "material-options": [
      [
        "Insulated roofs and shaded facades",
        "Insulated roofs, shading devices and light-coloured surfaces for markets and shops to reduce cooling loads.",
        ["Heat", "Energy"],
      ],
    ],
    "design-options": [
      [
        "Shaded streets and covered bazaars",
        "Covered walkways, arcades and tree planting in market streets to keep public space usable in peak heat.",
        ["Heat", "Planning"],
      ],
    ],
    "construction-methodologies": [
      [
        "Rooftop solar on commercial buildings",
        "Design roofs for solar panels to keep cooling running during grid outages, a factor in heatwave deaths in 2015.",
        ["Energy", "Continuity"],
      ],
    ],
  },
  communication: {
    "material-options": [
      [
        "Dust- and heat-rated equipment",
        "Sealed, dust-filtered shelters and equipment rated for high ambient temperatures.",
        ["Telecom", "Heat"],
      ],
    ],
    "design-options": [
      [
        "Solar-powered sites with battery storage",
        "Solar-hybrid power for remote towers in Thar, Cholistan and Balochistan where grid supply is weak.",
        ["Energy", "Continuity"],
      ],
    ],
    "construction-methodologies": [
      [
        "Cable routes clear of flash-flood channels",
        "Route and bury cables away from dry riverbeds, with protected crossings where they cannot be avoided.",
        ["Flash flood"],
      ],
    ],
  },
  strategic: {
    "material-options": [
      [
        "Lined canals and covered water conveyance",
        "Lining canals and using pipelines in place of open channels to cut seepage and evaporation losses.",
        ["Water"],
      ],
    ],
    "design-options": [
      [
        "Small dams and recharge structures",
        "Small and delay-action dams, check dams and recharge wells that capture flash-flood water and recharge groundwater.",
        ["Water", "Flash flood"],
      ],
      [
        "Roads with cross-drainage for flash floods",
        "Causeways and culverts sized for flash floods on desert roads, which otherwise wash out and cut off settlements.",
        ["Roads", "Flash flood"],
      ],
    ],
    "construction-methodologies": [
      [
        "Heat-resistant pavements",
        "Asphalt grades and concrete mixes suited to extreme surface temperatures to prevent rutting and cracking.",
        ["Roads", "Heat"],
      ],
    ],
  },
  "private-sector": {
    "material-options": [
      [
        "Local solar and water-harvesting industry",
        "Support private supply and installation of solar systems, water tanks and cool-roof products in desert districts.",
        ["Energy", "Water"],
      ],
    ],
    "design-options": [
      [
        "Passive-cooling standards for private schemes",
        "Include orientation, shading and roof insulation in approval criteria for private housing schemes.",
        ["Heat", "Approvals"],
      ],
    ],
    "construction-methodologies": [
      [
        "Water budgets for new developments",
        "Require private developments to show a sustainable water source and reuse plan before approval.",
        ["Water", "Approvals"],
      ],
    ],
  },
  industrial: {
    "material-options": [
      [
        "Water recycling in mining and energy projects",
        "Closed-loop water use and treated-water reuse in coal, mineral and energy projects in Thar and Balochistan.",
        ["Water", "Mining"],
      ],
    ],
    "design-options": [
      [
        "Heat-safe industrial workplaces",
        "Shaded, ventilated work areas and cooling facilities for workers, with work-hour adjustments during heatwaves.",
        ["Heat", "Occupational safety"],
      ],
    ],
    "construction-methodologies": [
      [
        "Waste, ash and tailings containment",
        "Lined storage for ash, tailings and waste that withstands flash floods and dust storms.",
        ["Environment", "Flash flood"],
      ],
    ],
  },
});

/* --------------------------------- Coastal --------------------------------- */

const coastal = build("coastal", {
  residential: {
    "material-options": [
      [
        "Durable concrete for the marine environment",
        "Higher concrete cover, low water–cement ratios and sulphate-resisting cement where chloride and sulphate attack corrode reinforcement in coastal buildings.",
        ["Corrosion", "Marine"],
      ],
      [
        "Corrosion-protected steel and fixings",
        "Coated or galvanised reinforcement and stainless or galvanised roof fixings so roofs stay anchored in cyclone winds.",
        ["Corrosion", "Cyclone"],
      ],
    ],
    "design-options": [
      [
        "Raised plinths and stilt houses above surge level",
        "Raise floor levels above the expected storm-surge level in low-lying villages of the Indus Delta and Makran coast.",
        ["Storm surge", "DRIM"],
      ],
      [
        "Hip roofs, low overhangs and continuous tie-downs",
        "Roof shapes and tie-downs that resist uplift, with a continuous load path from roof to foundation.",
        ["Cyclone"],
      ],
      [
        "Multi-purpose cyclone shelters",
        "Schools and community buildings designed as cyclone shelters within reach of every exposed settlement; 81,935 people had to be evacuated before Cyclone Biparjoy.",
        ["Cyclone", "Shelter"],
      ],
    ],
    "construction-methodology": [
      [
        "Fresh water for mixing and curing",
        "Never use seawater or brackish water for concrete and mortar; test aggregates for salt content.",
        ["Quality control", "Corrosion"],
      ],
      [
        "Anchored roofs and protected openings",
        "Anchor roof sheets at close spacing near edges and ridges and fit shutters to protect windows from wind-borne debris.",
        ["Cyclone"],
      ],
    ],
    "no-go-areas": [
      [
        "Mangrove forests and tidal creeks",
        "Protect the Indus Delta's mangroves, about 94% of the country's 98,128 ha, and the creek network from reclamation and housing; they buffer storm surge.",
        ["Mangroves", "Zoning"],
      ],
      [
        "Low-lying surge and erosion zones",
        "No new permanent housing on low-lying spits and eroding shorelines around Keti Bandar, Shah Bandar and similar settlements without surge protection.",
        ["Storm surge", "Erosion"],
      ],
      [
        "Tsunami run-up zone on the Makran coast",
        "Define a setback and evacuation zone along the Makran coast, where the 1945 Mw 8.1 earthquake generated a tsunami.",
        ["Tsunami", "Zoning"],
      ],
    ],
    "tourism-templates": [
      [
        "Beach facilities behind a coastal setback line",
        "Visitor facilities at sites such as Kund Malir, Hingol, Ormara and Gwadar placed behind a setback line, with warning signage and evacuation routes.",
        ["Tourism", "Storm surge"],
      ],
    ],
    maintenance: [
      [
        "Pre-cyclone-season inspections",
        "Inspect roofs, fixings and shutters before the pre-monsoon (May–June) and post-monsoon (October–November) cyclone seasons in the Arabian Sea.",
        ["Cyclone", "Maintenance"],
      ],
      [
        "Anti-corrosion maintenance",
        "Regular repainting and repair of spalled concrete before corrosion weakens reinforcement.",
        ["Corrosion", "Maintenance"],
      ],
    ],
    "e-infra-audit": [
      [
        "Corrosion and condition surveys of RC buildings",
        "Periodic chloride and cover surveys of public RC buildings in Karachi, Gwadar and other coastal towns.",
        ["Audit", "Corrosion"],
      ],
      [
        "Shelter capacity audit",
        "Annual audit of cyclone shelter capacity, access routes and supplies against coastal population, with PDMA Sindh and PDMA Balochistan.",
        ["Audit", "Shelter"],
      ],
    ],
    "other-subjects": [
      [
        "Mangrove restoration as natural protection",
        "Expand mangrove planting in the Indus Delta and at Miani Hor, Kalmat and Jiwani as a natural buffer against surge and erosion.",
        ["Mangroves", "Nature-based"],
      ],
    ],
  },
  commercial: {
    "material-options": [
      [
        "Marine-grade materials for waterfront buildings",
        "Corrosion-resistant reinforcement, cladding and fixings for harbour-side and waterfront commercial buildings.",
        ["Corrosion"],
      ],
    ],
    "design-options": [
      [
        "Wind-resistant facades and signage",
        "Glazing, cladding and billboards designed for cyclone wind pressures, as falling signs and glass injure people in storms.",
        ["Cyclone"],
      ],
    ],
    "construction-methodologies": [
      [
        "Flood-resistant ground floors",
        "Raised ground floors and water-resistant finishes in surge- and rain-flood-prone commercial areas.",
        ["Storm surge", "Urban flood"],
      ],
    ],
  },
  communication: {
    "material-options": [
      [
        "Cyclone-rated towers",
        "Towers and antennas designed for cyclone wind speeds, with corrosion protection for the salt-laden air.",
        ["Cyclone", "Telecom"],
      ],
    ],
    "design-options": [
      [
        "Diversity for submarine cable landings",
        "Protect and diversify the submarine cable landing stations near Karachi, which carry most of the country's international traffic.",
        ["Redundancy", "Strategic"],
      ],
    ],
    "construction-methodologies": [
      [
        "Raised power and battery rooms",
        "Locate power systems and batteries above surge level at coastal telecom sites.",
        ["Storm surge", "Continuity"],
      ],
    ],
  },
  strategic: {
    "material-options": [
      [
        "Durable marine structures for ports",
        "Marine-grade concrete and cathodic protection for berths, breakwaters and jetties at Karachi, Port Qasim and Gwadar.",
        ["Ports", "Corrosion"],
      ],
    ],
    "design-options": [
      [
        "Design ports and coastal roads for sea-level rise and surge",
        "Set design levels for ports, the Makran Coastal Highway and coastal power plants with allowances for sea-level rise and storm surge.",
        ["Ports", "Sea-level rise"],
      ],
    ],
    "construction-methodologies": [
      [
        "Coastal protection with nature-based buffers",
        "Combine engineered protection with mangrove and dune belts in front of strategic installations.",
        ["Nature-based", "Mangroves"],
      ],
    ],
  },
  "private-sector": {
    "material-options": [
      [
        "Certified marine-grade suppliers",
        "Approved supplier lists for marine-grade cement, steel and fixings used by private developers on the coast.",
        ["Quality control", "Corrosion"],
      ],
    ],
    "design-options": [
      [
        "Coastal setbacks for private developments",
        "Enforce setback lines and finished-level requirements on private housing and resort projects along the coast.",
        ["Zoning", "Storm surge"],
      ],
    ],
    "construction-methodologies": [
      [
        "Restrict reclamation of creeks and mangroves",
        "Restrict private land reclamation in creeks and mangrove areas, which removes natural surge protection.",
        ["Mangroves", "Encroachment"],
      ],
    ],
  },
  industrial: {
    "material-options": [
      [
        "Corrosion-protected plant and tanks",
        "Coatings and cathodic protection for tanks, pipelines and plant in coastal industrial zones.",
        ["Corrosion"],
      ],
    ],
    "design-options": [
      [
        "Surge protection for industrial zones",
        "Flood walls, raised critical plant and drainage for coastal industrial estates near Karachi and Port Qasim.",
        ["Storm surge"],
      ],
    ],
    "construction-methodologies": [
      [
        "Desalination and water reuse for industry",
        "Desalination and treated-wastewater reuse for coastal industry to reduce pressure on scarce fresh water.",
        ["Water", "Desalination"],
      ],
    ],
  },
});

export const baselineRecommendations: RecommendationContent = {
  mountain,
  "riverine-plains": riverine,
  "desert-arid": desert,
  coastal,
};
