/**
 * Indicated new-town sites. Positions are offsets from the existing city, chosen so the
 * site leaves the hazard the portal already names: river channels, the Lai, the Quetta
 * valley centre, GLOF fans, the coastal setback. They are not notified townships.
 */
import { cityCoords } from "./city-coords";
import type { CityRecord } from "./city-evidence";
import { modelsForSegment } from "./drim";

export type IndicatedTown = {
  id: string;
  name: string;
  lon: number;
  lat: number;
  rules: string[];
  why: string;
  models: string[];
};

const SHIFT: Record<string, [number, number, string]> = {
  lahore: [-0.38, 0.08, "West of Lahore, on the higher doab, off the Ravi floodway and clear of the eastern border."],
  karachi: [0.48, 0.32, "Inland of Karachi, northeast of the coast and clear of the Malir and Lyari outfalls."],
  quetta: [0.28, 0.16, "On the valley flank, not in the centre where subsidence was measured at its fastest."],
  islamabad: [0.26, 0.1, "East of Islamabad on the plateau, not south into the Lai corridor."],
  rawalpindi: [-0.22, 0.16, "Off the lower Lai, away from the Qatarian-to-Gawalmandi reach."],
  peshawar: [0.08, -0.28, "South of Peshawar, off the Kabul River and off the Hayatabad torrent."],
  hyderabad: [0.32, 0.06, "East of Hyderabad, off the Indus flood plain."],
  sukkur: [0.28, 0.12, "Off the Indus channel at Sukkur, on ground the river does not occupy."],
  larkana: [0.26, 0.1, "Off the Indus and the 2022 inundation path, not in the left-bank flood."],
  gwadar: [0.08, 0.22, "Inland of Gwadar, behind a coastal setback, not on the shore or a tidal creek."],
  gupis: [0.16, 0.1, "On a side bench at Gupis, outside the Khukush outburst path."],
  gilgit: [0.14, 0.1, "On a terrace above the Gilgit–Indus confluence, not in the junction."],
  hunza: [0.12, 0.08, "Above the Hunza channel, beside the Karakoram Highway bench, not on the flood terrace."],
  skardu: [0.16, 0.1, "Off the Indus terrace, on the valley side above the engineered road."],
  multan: [0.3, 0.12, "Off the Chenab floodway, on higher ground east of Multan."],
  faisalabad: [0.26, 0.14, "On the plain east of Faisalabad, outside a drain or canal floodway."],
};

/** Cities whose eastern side is the border or the Line of Control. Growth is kept to the west. */
const KEEP_WEST = new Set([
  "sialkot",
  "kasur",
  "gujranwala",
  "kamoke",
  "okara",
  "sahiwal",
  "vehari",
  "bahawalpur",
  "rahim-yar-khan",
  "sadiqabad",
  "muzaffarabad",
  "mirpur",
  "kotli",
  "rawalakot",
  "bagh",
]);

const SEGMENT_SHIFT: Record<CityRecord["segment"], [number, number, string]> = {
  mountain: [0.18, 0.12, "On a bench above the valley floor, beside the engineered road and off the river channel."],
  "riverine-plains": [0.3, -0.1, "On higher ground off the floodway, not in the katcha or active channel."],
  "desert-arid": [0.24, 0.12, "Off the dry nullah, where a water plan exists before plots are marked."],
  coastal: [0.06, 0.22, "Inland of the shoreline, behind a setback, clear of mangroves and tidal creeks."],
};

const SEGMENT_RULES: Record<CityRecord["segment"], string[]> = {
  mountain: [
    "Outside the active channel and flood terrace of the valley river.",
    "Outside glacial-lake outburst paths and debris fans.",
    "Not on a mapped active fault trace.",
    "Houses use continuous bands and a light roof, as in the mountain DRIM models.",
  ],
  "riverine-plains": [
    "Outside the riverbed and flood plain. An embankment is not a substitute for that.",
    "Living floors on a raised plinth or an elevated frame where floodwater must pass.",
    "Drains and nullahs kept clear. The town is not sited in one.",
    "Growth goes to a smaller town instead of another ring inside the flood line.",
  ],
  "desert-arid": [
    "Not in a dry riverbed or nullah that fills in a few hours.",
    "A water source is planned before the town, not assumed from a falling aquifer.",
    "Concrete is placed and cured for hot, dry weather.",
  ],
  coastal: [
    "Behind a coastal setback. Not on mangroves or tidal creeks.",
    "Living areas elevated, with materials that tolerate salt and wind.",
    "Fresh water only for concrete. No seawater in the mix.",
  ],
};

function modelsFor(city: CityRecord): string[] {
  return modelsForSegment(city.segment)
    .slice(0, 3)
    .map((model) => model.title);
}

export function indicatedTowns(city: CityRecord): IndicatedTown[] {
  const coord = cityCoords[city.id];
  if (!coord) return [];
  const [lon, lat] = coord;
  const special = SHIFT[city.id];
  const picked = special ?? SEGMENT_SHIFT[city.segment];
  const base: [number, number, string] =
    KEEP_WEST.has(city.id) && picked[0] > 0 ? [-picked[0], picked[1], picked[2]] : picked;
  const rules = [
    ...SEGMENT_RULES[city.segment],
    "A smaller town near the city, using the portal rule to add capacity outside saturated and hazardous ground.",
  ];
  const modelNames = modelsFor(city);
  const primary: IndicatedTown = {
    id: `${city.id}-town-a`,
    name: `Indicated town near ${city.name}`,
    lon: lon + base[0],
    lat: lat + base[1],
    rules,
    why: base[2],
    models: modelNames,
  };
  const length = Math.hypot(base[0], base[1]) || 1;
  const secondary: IndicatedTown = {
    id: `${city.id}-town-b`,
    name: `Second site near ${city.name}`,
    lon: lon + base[0] * 0.62 + (-base[1] / length) * 0.14,
    lat: lat + base[1] * 0.62 + (base[0] / length) * 0.14,
    rules,
    why: `A closer alternative on the same safe side of ${city.name}, so growth is not pushed back onto the hazard line.`,
    models: modelNames,
  };
  return [primary, secondary];
}
