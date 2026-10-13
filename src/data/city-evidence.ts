/**
 * Cited evidence model for Pakistani cities.
 * A problem is shown only when a journal paper or an official assessment names that
 * city, or when the record is explicitly provincial or regional. Nothing here is inferred
 * beyond the scope written on the finding.
 */
import type { ProvinceId } from "./census";
import type { SegmentId } from "./pria";

export type SourceKind = "journal" | "official";
export type EvidenceScope = "city" | "province" | "region" | "national";

export type EvidenceSource = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  url: string;
  doi?: string;
  kind: SourceKind;
};

export type CityRecord = {
  id: string;
  name: string;
  province: ProvinceId;
  segment: SegmentId;
  aliases?: string[];
};

export type CityFinding = {
  id: string;
  title: string;
  summary: string;
  sourceId: string;
  scope: EvidenceScope;
  cities?: string[];
  province?: ProvinceId;
  provinces?: ProvinceId[];
};

export const evidenceSources: EvidenceSource[] = [
  {
    id: "hasan-2015",
    title: "Land contestation in Karachi and the impact on housing and urban development",
    authors: "Arif Hasan",
    year: 2015,
    venue: "Environment and Urbanization",
    url: "https://doi.org/10.1177/0956247814567263",
    doi: "10.1177/0956247814567263",
    kind: "journal",
  },
  {
    id: "soni-2025",
    title: "Challenges and considerations of applying nature-based solutions for future mega-cities: Implications for Karachi as a Sponge City",
    authors: "Lubaina Adnan Soni, Asifa Iqbal, Faseeha Waheed, Ayesha Agha Shah and Naji Meidani Ali Akbar",
    year: 2025,
    venue: "Human Settlements and Sustainability",
    url: "https://doi.org/10.1016/j.hssust.2025.02.002",
    doi: "10.1016/j.hssust.2025.02.002",
    kind: "journal",
  },
  {
    id: "khanum-2017",
    title: "Characterization of five-year observation data of fine particulate matter in the metropolitan area of Lahore",
    authors: "Fatima Khanum, Muhammad Nawaz Chaudhry and Prashant Kumar",
    year: 2017,
    venue: "Air Quality, Atmosphere & Health",
    url: "https://doi.org/10.1007/s11869-017-0464-1",
    doi: "10.1007/s11869-017-0464-1",
    kind: "journal",
  },
  {
    id: "ali-2022",
    title: "Characterizing Air Pollution and Its Association with Emission Sources in Lahore: A Guide to Adaptation Action Plans to Control Pollution and Smog",
    authors: "Mifrah Ali, Iffat Siddique and Sawaid Abbas",
    year: 2022,
    venue: "Applied Sciences",
    url: "https://doi.org/10.3390/app12105102",
    doi: "10.3390/app12105102",
    kind: "journal",
  },
  {
    id: "jabeen-2021",
    title: "Assessing Health Impacts of Winter Smog in Lahore for Exposed Occupational Groups",
    authors: "Fatima Jabeen, Zulfiqar Ali and Amina Maharjan",
    year: 2021,
    venue: "Atmosphere",
    url: "https://doi.org/10.3390/atmos12111532",
    doi: "10.3390/atmos12111532",
    kind: "journal",
  },
  {
    id: "majeed-2024",
    title: "Solving the mysteries of Lahore smog: the fifth season in the country",
    authors: "Rabia Majeed, Muhammad Shehzaib Anjum, Muhammad Imad-ud-din, Suhaib Malik, Muhammad Naveed Anwar, Bilal Anwar and Muhammad Fahim Khokhar",
    year: 2024,
    venue: "Frontiers in Sustainable Cities",
    url: "https://doi.org/10.3389/frsc.2023.1314426",
    doi: "10.3389/frsc.2023.1314426",
    kind: "journal",
  },
  {
    id: "tayyab-2021",
    title: "GIS-Based Urban Flood Resilience Assessment Using Urban Flood Resilience Model: A Case Study of Peshawar City, Khyber Pakhtunkhwa, Pakistan",
    authors: "Muhammad Tayyab, Jiquan Zhang, Muhammad Hussain, Safi Ullah, Xingpeng Liu, Shah Nawaz Khan, Muhammad Aslam Baig, Waqas Hassan and Bazel Al-Shaibah",
    year: 2021,
    venue: "Remote Sensing",
    url: "https://doi.org/10.3390/rs13101864",
    doi: "10.3390/rs13101864",
    kind: "journal",
  },
  {
    id: "ali-peshawar-2024",
    title: "Assessment of multi-components and sectoral vulnerability to urban floods in Peshawar, Pakistan",
    authors: "Amjad Ali, Waheed Ullah, Usman Khan, Safi Ullah, Asim Ali, Mushtaq Ahmad Jan, Asher Samuel Bhatti and Qasim Jan",
    year: 2024,
    venue: "Natural Hazards Research",
    url: "https://doi.org/10.1016/j.nhres.2023.12.012",
    doi: "10.1016/j.nhres.2023.12.012",
    kind: "journal",
  },
  {
    id: "kakar-2020",
    title: "Land subsidence caused by groundwater exploitation in Quetta and surrounding region, Pakistan",
    authors: "Najeebullah Kakar, Din Muhammad Kakar and Sadia Barrech",
    year: 2020,
    venue: "Proceedings of the International Association of Hydrological Sciences",
    url: "https://doi.org/10.5194/piahs-382-595-2020",
    doi: "10.5194/piahs-382-595-2020",
    kind: "journal",
  },
  {
    id: "nasrullah-2024",
    title: "Land subsidence resulting from reservoir overexploitation and karez collapse in Mastung and Quetta districts, Baluchistan, Pakistan",
    authors: "Nasrullah, L. I. Kian, S. Khan and colleagues",
    year: 2024,
    venue: "Environmental Earth Sciences",
    url: "https://doi.org/10.1007/s12665-024-11774-0",
    doi: "10.1007/s12665-024-11774-0",
    kind: "journal",
  },
  {
    id: "rehman-2014",
    title: "Threat of glacial lake outburst flood to Tehsil Gupis from Khukush Lake, District Ghizer, Gilgit-Baltistan, Pakistan",
    authors: "Gohar Rehman, Sajjad Ahmad, Shuhab D. Khan, Fayaz Ali, Taqweemul H. Ali and Sadaf F. Khan",
    year: 2014,
    venue: "Natural Hazards",
    url: "https://doi.org/10.1007/s11069-013-0893-6",
    doi: "10.1007/s11069-013-0893-6",
    kind: "journal",
  },
  {
    id: "siddiqui-2023",
    title: "Advance Ensemble Flood Warning System: A Case Study for Nullah Lai",
    authors: "Muhammad Aamir Siddiqui, Mudasser Muneer Khan, Rabia Khan and Syyed Adnan Raheel Shah",
    year: 2023,
    venue: "Environmental Sciences Proceedings",
    url: "https://doi.org/10.3390/ECWS-7-14197",
    doi: "10.3390/ECWS-7-14197",
    kind: "journal",
  },
  {
    id: "khan-2011",
    title: "Simulation of the impacts of land-use change on surface runoff of Lai Nullah Basin in Islamabad, Pakistan",
    authors: "Zahiruddin Khan and colleagues",
    year: 2011,
    venue: "Landscape and Urban Planning",
    url: "https://doi.org/10.1016/j.landurbplan.2011.05.006",
    doi: "10.1016/j.landurbplan.2011.05.006",
    kind: "journal",
  },
  {
    id: "pdna-2022",
    title: "Pakistan Floods 2022: Post-Disaster Needs Assessment",
    authors: "Ministry of Planning, Development and Special Initiatives, with the Asian Development Bank, the European Union, the United Nations and the World Bank",
    year: 2022,
    venue: "Government of Pakistan",
    url: "https://www.pc.gov.pk/uploads/downloads/PDNA-2022.pdf",
    kind: "official",
  },
  {
    id: "ndma-sitrep-150",
    title: "NDMA Floods 2022, Daily Situation Report No. 150 (10 November 2022)",
    authors: "National Disaster Management Authority",
    year: 2022,
    venue: "NDMA, reproduced by ReliefWeb",
    url: "https://reliefweb.int/attachments/70195e8a-3ca7-4375-8d44-4b10491dc2a0/wW0uONYXGLyVXJIl5tku.pdf",
    kind: "official",
  },
  {
    id: "pdma-sindh-2022",
    title: "Flood 2022 in Sindh",
    authors: "Provincial Disaster Management Authority, Sindh",
    year: 2022,
    venue: "Government of Sindh",
    url: "https://pdma.gos.pk/Documents/Reports/Flood%202022%20In%20Sindh.pdf",
    kind: "official",
  },
];

const city = (
  id: string,
  name: string,
  province: ProvinceId,
  segment: SegmentId,
  aliases?: string[],
): CityRecord => ({ id, name, province, segment, aliases });

export const evidenceCities: CityRecord[] = [
  city("lahore", "Lahore", "punjab", "riverine-plains"),
  city("faisalabad", "Faisalabad", "punjab", "riverine-plains"),
  city("rawalpindi", "Rawalpindi", "punjab", "riverine-plains", ["pindi"]),
  city("multan", "Multan", "punjab", "riverine-plains"),
  city("gujranwala", "Gujranwala", "punjab", "riverine-plains"),
  city("sialkot", "Sialkot", "punjab", "riverine-plains"),
  city("sargodha", "Sargodha", "punjab", "riverine-plains"),
  city("bahawalpur", "Bahawalpur", "punjab", "desert-arid"),
  city("sahiwal", "Sahiwal", "punjab", "riverine-plains"),
  city("gujrat", "Gujrat", "punjab", "riverine-plains"),
  city("sheikhupura", "Sheikhupura", "punjab", "riverine-plains"),
  city("jhang", "Jhang", "punjab", "riverine-plains"),
  city("rahim-yar-khan", "Rahim Yar Khan", "punjab", "desert-arid", ["ryk"]),
  city("kasur", "Kasur", "punjab", "riverine-plains"),
  city("okara", "Okara", "punjab", "riverine-plains"),
  city("dera-ghazi-khan", "Dera Ghazi Khan", "punjab", "desert-arid", ["dg khan", "d.g. khan"]),
  city("wah", "Wah Cantonment", "punjab", "riverine-plains", ["wah"]),
  city("muzaffargarh", "Muzaffargarh", "punjab", "riverine-plains"),
  city("jhelum", "Jhelum", "punjab", "riverine-plains"),
  city("khanewal", "Khanewal", "punjab", "riverine-plains"),
  city("hafizabad", "Hafizabad", "punjab", "riverine-plains"),
  city("chiniot", "Chiniot", "punjab", "riverine-plains"),
  city("vehari", "Vehari", "punjab", "riverine-plains"),
  city("kamoke", "Kamoke", "punjab", "riverine-plains"),
  city("attock", "Attock", "punjab", "riverine-plains"),
  city("mianwali", "Mianwali", "punjab", "riverine-plains"),
  city("bhakkar", "Bhakkar", "punjab", "desert-arid"),
  city("sadiqabad", "Sadiqabad", "punjab", "desert-arid"),
  city("karachi", "Karachi", "sindh", "coastal"),
  city("hyderabad", "Hyderabad", "sindh", "riverine-plains"),
  city("sukkur", "Sukkur", "sindh", "riverine-plains"),
  city("larkana", "Larkana", "sindh", "riverine-plains", ["larkano"]),
  city("nawabshah", "Nawabshah", "sindh", "riverine-plains", ["shaheed benazirabad", "benazirabad"]),
  city("mirpur-khas", "Mirpur Khas", "sindh", "riverine-plains"),
  city("jacobabad", "Jacobabad", "sindh", "desert-arid"),
  city("shikarpur", "Shikarpur", "sindh", "riverine-plains"),
  city("khairpur", "Khairpur", "sindh", "riverine-plains"),
  city("dadu", "Dadu", "sindh", "riverine-plains"),
  city("jamshoro", "Jamshoro", "sindh", "riverine-plains"),
  city("kambar", "Kambar", "sindh", "riverine-plains", ["kamber", "shahdadkot", "kambar shahdadkot"]),
  city("thatta", "Thatta", "sindh", "coastal"),
  city("badin", "Badin", "sindh", "coastal"),
  city("peshawar", "Peshawar", "khyber-pakhtunkhwa", "riverine-plains"),
  city("mardan", "Mardan", "khyber-pakhtunkhwa", "riverine-plains"),
  city("abbottabad", "Abbottabad", "khyber-pakhtunkhwa", "mountain"),
  city("mingora", "Mingora", "khyber-pakhtunkhwa", "mountain", ["swat"]),
  city("kohat", "Kohat", "khyber-pakhtunkhwa", "riverine-plains"),
  city("dera-ismail-khan", "Dera Ismail Khan", "khyber-pakhtunkhwa", "riverine-plains", ["di khan", "d.i. khan"]),
  city("bannu", "Bannu", "khyber-pakhtunkhwa", "riverine-plains"),
  city("swabi", "Swabi", "khyber-pakhtunkhwa", "riverine-plains"),
  city("charsadda", "Charsadda", "khyber-pakhtunkhwa", "riverine-plains"),
  city("nowshera", "Nowshera", "khyber-pakhtunkhwa", "riverine-plains"),
  city("mansehra", "Mansehra", "khyber-pakhtunkhwa", "mountain"),
  city("haripur", "Haripur", "khyber-pakhtunkhwa", "mountain"),
  city("chitral", "Chitral", "khyber-pakhtunkhwa", "mountain"),
  city("quetta", "Quetta", "balochistan", "desert-arid"),
  city("mastung", "Mastung", "balochistan", "desert-arid"),
  city("pishin", "Pishin", "balochistan", "desert-arid"),
  city("kuchlak", "Kuchlak", "balochistan", "desert-arid"),
  city("gwadar", "Gwadar", "balochistan", "coastal"),
  city("turbat", "Turbat", "balochistan", "desert-arid", ["kech"]),
  city("khuzdar", "Khuzdar", "balochistan", "desert-arid"),
  city("chaman", "Chaman", "balochistan", "desert-arid"),
  city("hub", "Hub", "balochistan", "coastal"),
  city("sibi", "Sibi", "balochistan", "desert-arid"),
  city("zhob", "Zhob", "balochistan", "desert-arid"),
  city("gilgit", "Gilgit", "gilgit-baltistan", "mountain"),
  city("skardu", "Skardu", "gilgit-baltistan", "mountain"),
  city("hunza", "Hunza", "gilgit-baltistan", "mountain", ["karimabad"]),
  city("gupis", "Gupis", "gilgit-baltistan", "mountain"),
  city("ghizer", "Ghizer", "gilgit-baltistan", "mountain"),
  city("chilas", "Chilas", "gilgit-baltistan", "mountain", ["diamir", "diamer"]),
  city("muzaffarabad", "Muzaffarabad", "azad-kashmir", "mountain"),
  city("mirpur", "Mirpur", "azad-kashmir", "mountain"),
  city("kotli", "Kotli", "azad-kashmir", "mountain"),
  city("rawalakot", "Rawalakot", "azad-kashmir", "mountain"),
  city("bagh", "Bagh", "azad-kashmir", "mountain"),
  city("islamabad", "Islamabad", "islamabad", "riverine-plains", ["ict"]),
];

const ndmaHouses: Record<Exclude<ProvinceId, "islamabad">, { partial: number; full: number; total: number; roadsKm: number }> = {
  punjab: { partial: 42_127, full: 25_854, total: 67_981, roadsKm: 877 },
  sindh: { partial: 1_168_210, full: 716_819, total: 1_885_029, roadsKm: 8_389 },
  "khyber-pakhtunkhwa": { partial: 53_939, full: 37_525, total: 91_464, roadsKm: 1_575 },
  balochistan: { partial: 125_837, full: 115_822, total: 241_659, roadsKm: 2_222 },
  "gilgit-baltistan": { partial: 1_126, full: 667, total: 1_793, roadsKm: 33 },
  "azad-kashmir": { partial: 228, full: 327, total: 555, roadsKm: 19 },
};

const provinceLabel: Record<ProvinceId, string> = {
  punjab: "Punjab",
  sindh: "Sindh",
  "khyber-pakhtunkhwa": "Khyber Pakhtunkhwa",
  balochistan: "Balochistan",
  islamabad: "Islamabad Capital Territory",
  "gilgit-baltistan": "Gilgit-Baltistan",
  "azad-kashmir": "Azad Jammu & Kashmir",
};

function houses(id: Exclude<ProvinceId, "islamabad">): CityFinding {
  const row = ndmaHouses[id];
  return {
    id: `ndma-houses-${id}`,
    title: `2022 flood damage to houses and roads in ${provinceLabel[id]}`,
    summary: `NDMA Situation Report No. 150, cumulative from 14 June to 10 November 2022, records ${row.total.toLocaleString("en-PK")} damaged houses in ${provinceLabel[id]} (${row.partial.toLocaleString("en-PK")} partial and ${row.full.toLocaleString("en-PK")} full) and ${row.roadsKm.toLocaleString("en-PK")} km of damaged roads. This is a provincial total, not a count for one city.`,
    sourceId: "ndma-sitrep-150",
    scope: "province",
    province: id,
  };
}

const cityFindings: CityFinding[] = [
  {
    id: "karachi-drainage",
    title: "Drainage encroachment and more frequent flooding",
    summary:
      "Hasan reports that Karachi has flooded more often since the mid-1980s, and that the studies available to him tied this to encroachment on sea outfalls, on natural drains, and on channels at the city's edge, rather than to a demonstrated change in rainfall. Water then drains slowly and floods the areas where channels have been lost.",
    sourceId: "hasan-2015",
    scope: "city",
    cities: ["karachi"],
  },
  {
    id: "karachi-impervious",
    title: "Impervious cover, extreme weather and flood exposure",
    summary:
      "Soni and colleagues focus on Karachi's flooding and extreme weather, and on the loss of green space as the city hardens. They argue that nature-based drainage, of the kind used in sponge-city practice, needs to be part of urban planning if those pressures are to be reduced.",
    sourceId: "soni-2025",
    scope: "city",
    cities: ["karachi"],
  },
  {
    id: "sindh-urban-flood-2022",
    title: "Urban flooding in the 2022 rains",
    summary:
      "PDMA Sindh records that heavy rain in July 2022 caused urban flooding especially in Karachi and Hyderabad, and that later spells flooded low-lying parts of Karachi, Hyderabad, Sukkur and Larkana. The report says Karachi's storm drainage was insufficient and that the city was the most affected in those spells.",
    sourceId: "pdma-sindh-2022",
    scope: "city",
    cities: ["karachi", "hyderabad", "sukkur", "larkana"],
  },
  {
    id: "sindh-inundation-2022",
    title: "Inundation where water entered from Balochistan",
    summary:
      "The same PDMA Sindh account says that in September 2022 large volumes of water from Balochistan damaged infrastructure and inundated left-bank districts, including Kambar, Larkana, Dadu and Jamshoro. An emergency was declared in 24 of 30 districts of the province.",
    sourceId: "pdma-sindh-2022",
    scope: "city",
    cities: ["kambar", "larkana", "dadu", "jamshoro"],
  },
  {
    id: "lahore-pm25",
    title: "Fine-particle pollution well above a safe urban level",
    summary:
      "Khanum, Chaudhry and Kumar measured PM2.5 at two Lahore sites from 2007 to 2011. The highest daily means were 389 µg/m³ at Townhall and 354 µg/m³ at Township, and the winter mean was about 53% higher than summer and about twice the monsoon and post-monsoon mean.",
    sourceId: "khanum-2017",
    scope: "city",
    cities: ["lahore"],
  },
  {
    id: "lahore-smog-sources",
    title: "Smog tied to local emissions",
    summary:
      "Ali, Siddique and Abbas treat winter smog as Lahore's acute air-quality problem and link the air-quality index to sulphur dioxide, nitrogen dioxide and carbon monoxide. In their study period the index was higher on weekends than on weekdays, which they use to point adaptation plans at the dominant local sources.",
    sourceId: "ali-2022",
    scope: "city",
    cities: ["lahore"],
  },
  {
    id: "lahore-smog-health",
    title: "Winter smog and respiratory symptoms",
    summary:
      "Jabeen, Ali and Maharjan find that people living in urban Lahore were more likely to report several respiratory symptoms during winter smog than people on the city's edge. They connect the winter build-up of fine particles to industry, traffic, agricultural burning and a shallower boundary layer that traps pollution.",
    sourceId: "jabeen-2021",
    scope: "city",
    cities: ["lahore"],
  },
  {
    id: "igp-smog-named",
    title: "Post-monsoon smog on the plain",
    summary:
      "Majeed and colleagues describe intense smog, locally called a fifth season, over the north-western Indo-Gangetic Plain. They name Lahore, Faisalabad and Multan among the cities exposed, and find that crop-residue burning and vehicles have raised how often and how hard these episodes hit. Their source ranking gives moderate weight to transboundary agricultural fires over vehicle emissions.",
    sourceId: "majeed-2024",
    scope: "city",
    cities: ["lahore", "faisalabad", "multan"],
  },
  {
    id: "igp-smog-regional",
    title: "Same regional smog pattern, not a city measurement",
    summary:
      "The Majeed study of the Indo-Gangetic smog season names Lahore, Faisalabad and Multan. It does not publish a measurement for every other Punjab city. Those three sit on the same plain, so the regional finding is the relevant evidence here, and it should not be read as a local monitoring result.",
    sourceId: "majeed-2024",
    scope: "region",
    provinces: ["punjab"],
    cities: ["lahore", "faisalabad", "multan"],
  },
  {
    id: "peshawar-resilience",
    title: "Urban flood exposure and limited coping capacity",
    summary:
      "Tayyab and colleagues build a GIS flood-resilience model for Peshawar and present it as a first city-scale assessment of how exposed the city is and how far its coping capacity can absorb urban floods. The paper is written for agencies that have to invest before the next flood, not as a single neighbourhood ranking.",
    sourceId: "tayyab-2021",
    scope: "city",
    cities: ["peshawar"],
  },
  {
    id: "peshawar-sectors",
    title: "Old commercial fabric and encroached torrents",
    summary:
      "Ali and colleagues find Peshawar's urban floods are mainly from heavy rain, made worse by growth, encroachment and failed drains, including the Shahi Katta drain in the old city. Old commercial and manufacturing buildings at Kohati Gate rank as highly vulnerable, and encroachments along the torrent in Hayatabad raise the exposure of houses and schools there.",
    sourceId: "ali-peshawar-2024",
    scope: "city",
    cities: ["peshawar"],
  },
  {
    id: "quetta-subsidence",
    title: "Groundwater decline and land subsidence",
    summary:
      "Kakar, Kakar and Barrech measure subsidence in Quetta valley from about 30 mm a year on the flanks to 120 mm a year in the centre, alongside groundwater-level drops of 1.5 to 5 metres a year where subsidence is fastest. They attribute it to unplanned groundwater use after drought and rapid population growth, and they record about 9 to 10 cm of subsidence around Kuchlak, Mastung and Pishin.",
    sourceId: "kakar-2020",
    scope: "city",
    cities: ["quetta", "kuchlak", "mastung", "pishin"],
  },
  {
    id: "quetta-karez",
    title: "Subsidence from over-pumping and karez collapse",
    summary:
      "Nasrullah and colleagues report InSAR subsidence of up to 15 cm a year in Quetta and about 4 to 5 cm a year in Mastung. They link it to groundwater overuse, collapse of traditional karez, the weight of new building, and compaction of alluvial soils, and they warn that it threatens further urban development.",
    sourceId: "nasrullah-2024",
    scope: "city",
    cities: ["quetta", "mastung"],
  },
  {
    id: "gupis-glof",
    title: "Glacial-lake outburst risk above Gupis",
    summary:
      "Rehman and colleagues assess Khukush Lake above Gupis in Ghizer. They estimate a peak outburst discharge of 7,642 m³/s from a moraine dam they judge unreliable, and they find that a large share of settlements downstream would be in the flood path. The paper is about Gupis tehsil, not the whole of Gilgit-Baltistan.",
    sourceId: "rehman-2014",
    scope: "city",
    cities: ["gupis", "ghizer"],
  },
  {
    id: "gb-glof-regional",
    title: "GLOF evidence is for Ghizer, not this town",
    summary:
      "The Rehman study of Khukush Lake is a Gupis and Ghizer case. Other towns in Gilgit-Baltistan share the mountain setting in which glacial-lake outburst floods are studied, but this library does not contain a paper that measures that hazard for the town being searched.",
    sourceId: "rehman-2014",
    scope: "region",
    provinces: ["gilgit-baltistan"],
    cities: ["gupis", "ghizer"],
  },
  {
    id: "lai-flash",
    title: "Flash floods on Nullah Lai",
    summary:
      "Siddiqui and colleagues describe flash flooding on Nullah Lai, which drains Islamabad and Rawalpindi. Steep rain on the Margalla hills arrives quickly in the denser, flatter reaches of Rawalpindi. The stretch from Qatarian Bridge to Gawalmandi Bridge has repeatedly risen several feet within hours, too fast for a warning that starts only when the water is already in the channel.",
    sourceId: "siddiqui-2023",
    scope: "city",
    cities: ["islamabad", "rawalpindi"],
  },
  {
    id: "lai-runoff",
    title: "Built-up growth raises storm runoff",
    summary:
      "Khan and colleagues model the Lai Nullah basin and find that the land-use pattern in the Islamabad master plan would raise total storm runoff by about 52 to 100 percent and peak discharge by about 45 to 83 percent, in step with how fast the built-up area grows.",
    sourceId: "khan-2011",
    scope: "city",
    cities: ["islamabad", "rawalpindi"],
  },
  {
    id: "pdna-national",
    title: "National damage, loss and reconstruction need after the 2022 floods",
    summary:
      "The Post-Disaster Needs Assessment, led by the Ministry of Planning with the Asian Development Bank, the European Union, the United Nations and the World Bank, estimates damage above USD 14.9 billion, losses of about USD 15.2 billion, and at least USD 16.3 billion to rebuild in a more resilient way. Housing is among the sectors with the highest damage. The figure is national.",
    sourceId: "pdna-2022",
    scope: "national",
  },
  {
    id: "pdna-sindh",
    title: "Sindh carried about half of 2022 recovery needs",
    summary:
      "The same national assessment finds that Sindh accounted for about half of recovery and reconstruction needs. It is a provincial share, not a budget for one city.",
    sourceId: "pdna-2022",
    scope: "province",
    province: "sindh",
  },
  {
    id: "ndma-ict",
    title: "No house-damage figure was reported for Islamabad",
    summary:
      "In NDMA Situation Report No. 150 the cumulative house and road cells for the Islamabad Capital Territory are blank, unlike the provincial rows. That is an absence of a reported total in that table, not a finding that the capital has no flood problem. City-level evidence for Islamabad is the Nullah Lai research.",
    sourceId: "ndma-sitrep-150",
    scope: "province",
    province: "islamabad",
  },
  ...(["punjab", "sindh", "khyber-pakhtunkhwa", "balochistan", "gilgit-baltistan", "azad-kashmir"] as const).map(houses),
];

export const cityFindingsAll: CityFinding[] = cityFindings;

export function getSource(id: string): EvidenceSource | undefined {
  return evidenceSources.find((s) => s.id === id);
}

export function getEvidenceCity(id: string): CityRecord | undefined {
  return evidenceCities.find((c) => c.id === id);
}

export function matchCities(query: string): CityRecord[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (q.length < 2) return [];
  const scored = evidenceCities
    .map((item) => {
      const names = [item.name, ...(item.aliases ?? [])].map((n) => n.toLowerCase());
      let score = 0;
      for (const name of names) {
        if (name === q) score = Math.max(score, 100);
        else if (name.startsWith(q)) score = Math.max(score, 80);
        else if (name.split(/[\s-]+/).some((word) => word.startsWith(q))) score = Math.max(score, 60);
        else if (name.includes(q)) score = Math.max(score, 40);
      }
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
  return scored.map((row) => row.item);
}

export type CityEvidenceView = {
  city: CityRecord;
  direct: CityFinding[];
  provincial: CityFinding[];
  regional: CityFinding[];
  national: CityFinding[];
};

export function evidenceFor(city: CityRecord): CityEvidenceView {
  const named = new Set(
    cityFindingsAll.filter((f) => f.scope === "city" && f.cities?.includes(city.id)).map((f) => f.id),
  );
  return {
    city,
    direct: cityFindingsAll.filter((f) => named.has(f.id)),
    provincial: cityFindingsAll.filter((f) => f.scope === "province" && f.province === city.province),
    regional: cityFindingsAll.filter(
      (f) => f.scope === "region" && f.provinces?.includes(city.province) && !f.cities?.includes(city.id),
    ),
    national: cityFindingsAll.filter((f) => f.scope === "national"),
  };
}
