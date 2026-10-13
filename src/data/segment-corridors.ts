/**
 * Tourism corridors for each resilience segment.
 * Mountain keeps the northern highway library.
 * The other three use only places named in that segment's own recommendations,
 * on the national roads that join those places.
 */

import { routeLines } from "./route-lines";
import {
  corridorEdges,
  northRoutes,
  routeNodes,
  type CorridorEdge,
  type NorthRoute,
  type RouteNode,
} from "./northern-routes";

export type CorridorLibrary = {
  title: string;
  intro: string;
  legend: string;
  defaultStart: string;
  defaultEnd: string;
  nodes: RouteNode[];
  routes: NorthRoute[];
  edges: CorridorEdge[];
  lines: Record<string, [number, number][]>;
  spurNodes: readonly string[];
};

const mountain: CorridorLibrary = {
  title: "Corridors from Islamabad",
  intro:
    "Choose a destination to draw every highway in this library from Islamabad, or set both ends. The lines follow the mapped roads. Live weather is read along each road, and the calmer corridor is marked for this moment. Babusar is dashed and is a summer link only. This is the infrastructure corridor, not a live travel bulletin.",
  legend:
    "Blue is the start and teal is the destination. A teal line is a year-round highway. An amber dashed line is Babusar, summer only. Roads: N-35, N-15, N-95, the Swat Expressway, N-45 through the Lowari Tunnel, the Murree–Kohala highway, the Gilgit–Skardu road, the Gilgit–Ghizer road and the Neelum valley road.",
  defaultStart: "islamabad",
  defaultEnd: "hunza",
  nodes: routeNodes,
  routes: northRoutes,
  edges: corridorEdges,
  lines: routeLines,
  spurNodes: ["muzaffarabad", "sharda"],
};

const riverineNodes: RouteNode[] = [
  { id: "rawalpindi", name: "Rawalpindi", lon: 73.0169, lat: 33.5651, group: "Punjab" },
  { id: "lahore", name: "Lahore", lon: 74.3587, lat: 31.5204, group: "Punjab" },
  { id: "dg-khan", name: "D.G. Khan", lon: 70.6455, lat: 30.0489, group: "Punjab" },
  { id: "taunsa", name: "Taunsa", lon: 70.6564, lat: 30.7042, group: "Punjab" },
];

const riverineLines: Record<string, [number, number][]> = {
  "rawalpindi-lahore": [
    [73.0169, 33.5651],
    [72.98, 33.42],
    [72.82, 33.05],
    [72.71, 32.78],
    [72.58, 32.42],
    [72.9, 32.15],
    [73.27, 31.9],
    [73.7, 31.72],
    [74.05, 31.62],
    [74.3587, 31.5204],
  ],
  "lahore-dg-khan": [
    [74.3587, 31.5204],
    [73.85, 31.28],
    [73.2, 31.05],
    [72.55, 30.9],
    [72.05, 30.55],
    [71.47, 30.2],
    [71.19, 30.07],
    [70.85, 30.06],
    [70.6455, 30.0489],
  ],
  "dg-khan-taunsa": [
    [70.6455, 30.0489],
    [70.65, 30.28],
    [70.655, 30.5],
    [70.6564, 30.7042],
  ],
};

const riverineLimit =
  "Visitor facilities stay outside the flood line, with a signed evacuation route. The segment bars the active flood plains of the Indus, Jhelum, Chenab, Ravi and Sutlej, and the toe of flood embankments.";

const riverine: CorridorLibrary = {
  title: "Corridors of the riverine plains",
  intro:
    "Choose a destination to draw the roads in this segment's library from Rawalpindi, or set both ends. The places are the ones this segment names: Lahore, and Taunsa and D.G. Khan on the hill-torrent side. Live weather is read along each road. Visitor buildings stay outside the flood line. This is the infrastructure corridor for the riverine and plains segment, not a live travel bulletin.",
  legend:
    "Blue is the start and teal is the destination. A teal line is a year-round highway. Roads: M-2 from Rawalpindi to Lahore, then M-3, M-4 and N-70 to D.G. Khan, and N-55 up to Taunsa.",
  defaultStart: "rawalpindi",
  defaultEnd: "lahore",
  nodes: riverineNodes,
  routes: [
    {
      id: "lahore",
      site: "Lahore",
      region: "Punjab",
      road: "M-2 from Rawalpindi",
      path: ["rawalpindi", "lahore"],
      infrastructure: ["Visitor facilities outside the flood line", "Signed evacuation routes"],
      limit: riverineLimit,
      season: "M-2 is the year-round road. Do not treat a drainage channel or the flood plain as a shortcut.",
    },
    {
      id: "dg-khan",
      site: "D.G. Khan",
      region: "Punjab",
      road: "M-2, then M-3, M-4 and N-70",
      path: ["rawalpindi", "lahore", "dg-khan"],
      infrastructure: ["Visitor facilities outside the Indus flood line", "Sites kept off hill-torrent fans"],
      limit: `${riverineLimit} Hill torrents from the Koh-e-Suleman range flooded D.G. Khan in 2022. Keep facilities off those fans.`,
      season: "Use the highway. A torrent bed is not an approach road.",
    },
    {
      id: "taunsa",
      site: "Taunsa",
      region: "Punjab",
      road: "N-55 north of D.G. Khan",
      path: ["rawalpindi", "lahore", "dg-khan", "taunsa"],
      infrastructure: ["The Indus highway as the approach", "Visitor facilities off the torrent fans"],
      limit: `${riverineLimit} The same 2022 hill torrents flooded Taunsa. The fans and the riverbed stay no-go.`,
      season: "N-55 is the corridor. Do not route visitors along the torrent or the Indus bed.",
    },
  ],
  edges: [
    { id: "rawalpindi-lahore", a: "rawalpindi", b: "lahore", road: "M-2" },
    { id: "lahore-dg-khan", a: "lahore", b: "dg-khan", road: "M-3, M-4 and N-70" },
    { id: "dg-khan-taunsa", a: "dg-khan", b: "taunsa", road: "N-55" },
  ],
  lines: riverineLines,
  spurNodes: [],
};

const desertNodes: RouteNode[] = [
  { id: "hyderabad", name: "Hyderabad", lon: 68.3578, lat: 25.396, group: "Sindh" },
  { id: "derawar", name: "Derawar Fort", lon: 71.3325, lat: 28.7681, group: "Cholistan" },
  { id: "nagarparkar", name: "Nagarparkar", lon: 70.7553, lat: 24.3569, group: "Thar" },
];

const desertLines: Record<string, [number, number][]> = {
  "hyderabad-derawar": [
    [68.3578, 25.396],
    [68.45, 26.3],
    [68.85, 27.7],
    [69.6, 28.15],
    [70.3, 28.42],
    [71.2, 29.05],
    [71.68, 29.4],
    [71.5, 29.1],
    [71.3325, 28.7681],
  ],
  "hyderabad-nagarparkar": [
    [68.3578, 25.396],
    [68.85, 25.5],
    [69.01, 25.53],
    [69.45, 25.42],
    [69.74, 25.36],
    [70.15, 24.95],
    [70.45, 24.6],
    [70.7553, 24.3569],
  ],
};

const desertLimit =
  "Shade, potable water, heat first aid and solar power are part of the template. Dry riverbeds and moving dunes are no-go for the buildings.";

const desert: CorridorLibrary = {
  title: "Corridors to the desert sites",
  intro:
    "Choose Derawar Fort in Cholistan or Nagarparkar in Thar. Both are the visitor sites named for this segment. The roads are drawn from Hyderabad, which this segment names, or set both ends. Live weather is read along each road. This is the infrastructure corridor for the desert and arid segment, not a live travel bulletin.",
  legend:
    "Blue is the start and teal is the destination. A teal line is a year-round road. One road runs north from Hyderabad into Cholistan, to Derawar Fort. The other runs east through Thar to Nagarparkar.",
  defaultStart: "hyderabad",
  defaultEnd: "derawar",
  nodes: desertNodes,
  routes: [
    {
      id: "derawar",
      site: "Derawar Fort, Cholistan",
      region: "Cholistan",
      road: "North from Hyderabad, then into Cholistan",
      path: ["hyderabad", "derawar"],
      infrastructure: ["Shaded rest areas", "Potable water", "Heat first aid and solar power"],
      limit: desertLimit,
      season: "Carry water on the approach. Do not site lodging on an unstabilised dune.",
    },
    {
      id: "nagarparkar",
      site: "Nagarparkar, Thar",
      region: "Thar",
      road: "East from Hyderabad through Thar",
      path: ["hyderabad", "nagarparkar"],
      infrastructure: ["Shaded rest areas", "Potable water", "Heat first aid and solar power"],
      limit: desertLimit,
      season: "The Thar road is the corridor. A dry nullah is not an alternative when the road is cut.",
    },
  ],
  edges: [
    { id: "hyderabad-derawar", a: "hyderabad", b: "derawar", road: "Road north into Cholistan" },
    { id: "hyderabad-nagarparkar", a: "hyderabad", b: "nagarparkar", road: "Road east through Thar" },
  ],
  lines: desertLines,
  spurNodes: [],
};

const coastalNodes: RouteNode[] = [
  { id: "karachi", name: "Karachi", lon: 67.0011, lat: 24.8607, group: "Sindh" },
  { id: "hingol", name: "Hingol", lon: 65.518, lat: 25.451, group: "Makran coast" },
  { id: "kund-malir", name: "Kund Malir", lon: 65.4644, lat: 25.4236, group: "Makran coast" },
  { id: "ormara", name: "Ormara", lon: 64.639, lat: 25.2048, group: "Makran coast" },
  { id: "gwadar", name: "Gwadar", lon: 62.3225, lat: 25.1264, group: "Makran coast" },
];

const coastalLines: Record<string, [number, number][]> = {
  "karachi-hingol": [
    [67.0011, 24.8607],
    [66.82, 25.02],
    [66.45, 25.22],
    [66.05, 25.32],
    [65.75, 25.38],
    [65.518, 25.451],
  ],
  "hingol-kund-malir": [
    [65.518, 25.451],
    [65.4644, 25.4236],
  ],
  "kund-malir-ormara": [
    [65.4644, 25.4236],
    [65.15, 25.34],
    [64.9, 25.28],
    [64.639, 25.2048],
  ],
  "ormara-gwadar": [
    [64.639, 25.2048],
    [64.15, 25.24],
    [63.47, 25.26],
    [63.0, 25.2],
    [62.55, 25.16],
    [62.3225, 25.1264],
  ],
};

const coastalLimit =
  "Visitor facilities sit behind a setback line, with warning signage and an evacuation route. The Makran coast has a tsunami run-up zone from the 1945 earthquake, and the beach itself is not a building site.";

const coastal: CorridorLibrary = {
  title: "Corridors along the Makran coast",
  intro:
    "Choose Kund Malir, Hingol, Ormara or Gwadar. These are the visitor sites named for this segment, reached on the Makran Coastal Highway from Karachi. Set both ends to read another pair. Live weather is read along the road. Facilities stay behind the coastal setback. This is the infrastructure corridor for the coastal segment, not a live travel bulletin.",
  legend:
    "Blue is the start and teal is the destination. A teal line is the Makran Coastal Highway, the year-round road named for this segment. The line follows the coast from Karachi through Hingol and Kund Malir to Ormara and Gwadar.",
  defaultStart: "karachi",
  defaultEnd: "gwadar",
  nodes: coastalNodes,
  routes: [
    {
      id: "hingol",
      site: "Hingol",
      region: "Makran coast",
      road: "Makran Coastal Highway from Karachi",
      path: ["karachi", "hingol"],
      infrastructure: ["Highway facilities behind the setback line", "Warning signage and an evacuation route"],
      limit: coastalLimit,
      season: "The highway is the corridor in every season. Cyclone season still uses the evacuation route, not the beach.",
    },
    {
      id: "kund-malir",
      site: "Kund Malir",
      region: "Makran coast",
      road: "Makran Coastal Highway from Karachi",
      path: ["karachi", "hingol", "kund-malir"],
      infrastructure: ["Beach facilities behind the setback line", "Warning signage and an evacuation route"],
      limit: coastalLimit,
      season: "The highway is the corridor. Do not build the rest area on the beach.",
    },
    {
      id: "ormara",
      site: "Ormara",
      region: "Makran coast",
      road: "Makran Coastal Highway from Karachi",
      path: ["karachi", "hingol", "kund-malir", "ormara"],
      infrastructure: ["Visitor facilities behind the setback line", "Warning signage and an evacuation route"],
      limit: coastalLimit,
      season: "Stay on the highway. The shoreline is inside the setback.",
    },
    {
      id: "gwadar",
      site: "Gwadar",
      region: "Makran coast",
      road: "Makran Coastal Highway from Karachi",
      path: ["karachi", "hingol", "kund-malir", "ormara", "gwadar"],
      infrastructure: ["Visitor facilities behind the setback line", "Warning signage and an evacuation route"],
      limit: coastalLimit,
      season: "The highway is the year-round approach. Surge and cyclone warnings still apply on this coast.",
    },
  ],
  edges: [
    { id: "karachi-hingol", a: "karachi", b: "hingol", road: "Makran Coastal Highway" },
    { id: "hingol-kund-malir", a: "hingol", b: "kund-malir", road: "Makran Coastal Highway" },
    { id: "kund-malir-ormara", a: "kund-malir", b: "ormara", road: "Makran Coastal Highway" },
    { id: "ormara-gwadar", a: "ormara", b: "gwadar", road: "Makran Coastal Highway" },
  ],
  lines: coastalLines,
  spurNodes: [],
};

const libraries: Record<string, CorridorLibrary> = {
  mountain,
  "riverine-plains": riverine,
  "desert-arid": desert,
  coastal,
};

export function libraryFor(segmentId: string): CorridorLibrary {
  return libraries[segmentId] ?? mountain;
}
