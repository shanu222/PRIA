/**
 * Preferred infrastructure corridors to visitor sites in northern Pakistan.
 * Roads are the national and valley routes that actually serve these sites
 * (N-35, N-15, N-95, N-45 / Lowari, Gilgit–Skardu, Neelum valley road).
 * Limits come from this segment's own no-go rules: active channels of the
 * Indus, Swat, Kunhar, Neelum and Hunza, GLOF fans, and the 2022 Swat riverbank failure.
 * This is a siting template, not a live travel bulletin.
 */

import { routeLines } from "./route-lines";

export type RouteNode = { id: string; name: string; lon: number; lat: number; group: string };

export const routeNodes: RouteNode[] = [
  { id: "islamabad", name: "Islamabad", lon: 73.0479, lat: 33.6844, group: "Capital" },
  { id: "gilgit", name: "Gilgit", lon: 74.308, lat: 35.9208, group: "Gilgit-Baltistan" },
  { id: "hunza", name: "Hunza", lon: 74.65, lat: 36.3167, group: "Gilgit-Baltistan" },
  { id: "khunjerab", name: "Khunjerab", lon: 75.426, lat: 36.85, group: "Gilgit-Baltistan" },
  { id: "skardu", name: "Skardu", lon: 75.6337, lat: 35.2976, group: "Gilgit-Baltistan" },
  { id: "raikot", name: "Raikot", lon: 74.6002, lat: 35.4821, group: "Gilgit-Baltistan" },
  { id: "gupis", name: "Gupis", lon: 73.4422, lat: 36.2274, group: "Gilgit-Baltistan" },
  { id: "chilas", name: "Chilas", lon: 74.0946, lat: 35.4222, group: "Gilgit-Baltistan" },
  { id: "mansehra", name: "Mansehra", lon: 73.1968, lat: 34.3302, group: "North Khyber Pakhtunkhwa" },
  { id: "naran", name: "Naran", lon: 73.6504, lat: 34.9043, group: "North Khyber Pakhtunkhwa" },
  { id: "mingora", name: "Mingora", lon: 72.362, lat: 34.779, group: "North Khyber Pakhtunkhwa" },
  { id: "kalam", name: "Kalam", lon: 72.5903, lat: 35.4781, group: "North Khyber Pakhtunkhwa" },
  { id: "dir", name: "Dir", lon: 71.876, lat: 35.205, group: "North Khyber Pakhtunkhwa" },
  { id: "chitral", name: "Chitral", lon: 71.7864, lat: 35.851, group: "North Khyber Pakhtunkhwa" },
  { id: "muzaffarabad", name: "Muzaffarabad", lon: 73.4711, lat: 34.37, group: "Azad Jammu & Kashmir" },
  { id: "sharda", name: "Sharda", lon: 74.191, lat: 34.793, group: "Azad Jammu & Kashmir" },
];

export type NorthRoute = {
  id: string;
  site: string;
  region: string;
  road: string;
  /** Node ids from the approach to the site. */
  path: string[];
  infrastructure: string[];
  limit: string;
  season: string;
};

export const northRoutes: NorthRoute[] = [
  {
    id: "hunza",
    site: "Hunza (Karimabad)",
    region: "Gilgit-Baltistan",
    road: "N-35 Karakoram Highway from Islamabad",
    path: ["islamabad", "mansehra", "chilas", "raikot", "gilgit", "hunza"],
    infrastructure: ["KKH carriageway and its bridges", "Parking and guest-house sites off the Hunza channel"],
    limit: "Do not place hotels on the Hunza or Indus flood terrace. The segment no-go rule keeps buildings out of those active channels.",
    season: "The highway is the year-round spine. Winter closures are at high cuts, not a reason to drop onto the riverbed.",
  },
  {
    id: "khunjerab",
    site: "Khunjerab",
    region: "Gilgit-Baltistan",
    road: "N-35 from Islamabad to the pass",
    path: ["islamabad", "mansehra", "chilas", "raikot", "gilgit", "hunza", "khunjerab"],
    infrastructure: ["KKH to the pass", "Border and viewpoint facilities on the engineered alignment"],
    limit: "Facilities stay on the highway bench. Debris fans below side valleys are not building sites.",
    season: "The pass itself is a seasonal border. Approach planning uses the Hunza section of N-35.",
  },
  {
    id: "gilgit",
    site: "Gilgit",
    region: "Gilgit-Baltistan",
    road: "N-35 Karakoram Highway from Islamabad",
    path: ["islamabad", "mansehra", "chilas", "raikot", "gilgit"],
    infrastructure: ["KKH as the regional hub", "Bridges at the Gilgit and Indus confluence kept as through-routes"],
    limit: "Visitor buildings sit above the confluence flood line, not in the river junction.",
    season: "Year-round hub for the northern roads.",
  },
  {
    id: "skardu",
    site: "Skardu",
    region: "Gilgit-Baltistan",
    road: "N-35, then the Gilgit–Skardu road",
    path: ["islamabad", "mansehra", "chilas", "raikot", "gilgit", "skardu"],
    infrastructure: ["The engineered valley road along the Indus", "Bridges, not fords, at side streams"],
    limit: "Rockfall and river-edge sections stay on the built road. New facilities are not cut into the Indus terrace.",
    season: "Open through the year, with short closures after rockfall. Do not substitute a riverbed track.",
  },
  {
    id: "raikot",
    site: "Raikot / Fairy Meadows junction",
    region: "Gilgit-Baltistan",
    road: "N-35 from Islamabad to the Raikot junction",
    path: ["islamabad", "mansehra", "chilas", "raikot"],
    infrastructure: ["KKH to the Raikot junction", "The last climb is a steep unpaved track, not a national highway"],
    limit: "Treat the track as a limited-capacity link. Parking and lodging belong at the junction, not on the Indus bank.",
    season: "The highway approach is the reliable leg. The track is fair-weather.",
  },
  {
    id: "gupis",
    site: "Gupis, Ghizer",
    region: "Gilgit-Baltistan",
    road: "N-35, then the Gilgit–Ghizer road",
    path: ["islamabad", "mansehra", "chilas", "raikot", "gilgit", "gupis"],
    infrastructure: ["The valley road from Gilgit", "Bridges clear of debris fans"],
    limit: "Khukush Lake above Gupis is a studied outburst source. Do not site lodging or parking on the fan or in the modelled flow path.",
    season: "Use the valley road. An outburst path is never a shortcut.",
  },
  {
    id: "naran",
    site: "Naran, Kaghan",
    region: "North Khyber Pakhtunkhwa",
    road: "N-35 to Mansehra, then N-15",
    path: ["islamabad", "mansehra", "naran"],
    infrastructure: ["N-15 as the valley road", "A separate seasonal link over Babusar toward Chilas"],
    limit: "Hotels stay back from the Kunhar. The segment rule bars the active channel and flood terrace. New rooms need a valley plan for road capacity, sewage and parking.",
    season: "Naran is reached on N-15. Babusar is a summer link only and is not the preferred approach.",
  },
  {
    id: "kalam",
    site: "Kalam, Swat",
    region: "North Khyber Pakhtunkhwa",
    road: "Swat Expressway, then N-95",
    path: ["islamabad", "mingora", "kalam"],
    infrastructure: ["N-95 up the Swat valley", "Bridges and a setback for any new guest house"],
    limit: "A new hotel in Swat collapsed into the river in the 2022 floods. Visitor buildings stay off the bank.",
    season: "The highway is the corridor. Do not route visitors along the riverbed when the road is cut.",
  },
  {
    id: "chitral",
    site: "Chitral",
    region: "North Khyber Pakhtunkhwa",
    road: "M-1 and N-45 through the Lowari Tunnel",
    path: ["islamabad", "dir", "chitral"],
    infrastructure: ["N-45 and the Lowari Tunnel", "Valley-road bridges rather than fair-weather fords"],
    limit: "Keep facilities off debris fans and the active channel. The tunnel is the all-season infrastructure; the old pass is not the template.",
    season: "The tunnel is the year-round link from Dir.",
  },
  {
    id: "muzaffarabad",
    site: "Muzaffarabad",
    region: "Azad Jammu & Kashmir",
    road: "Murree–Kohala highway, or via Mansehra",
    path: ["islamabad", "muzaffarabad"],
    infrastructure: ["The valley highway into the city", "Bridges at the Neelum and Jhelum confluence"],
    limit: "No new building on the mapped trace of the fault that ruptured in 2005, or in the confluence flood plain.",
    season: "Year-round highway approach.",
  },
  {
    id: "sharda",
    site: "Sharda, Neelum",
    region: "Azad Jammu & Kashmir",
    road: "Neelum valley road from Muzaffarabad",
    path: ["islamabad", "muzaffarabad", "sharda"],
    infrastructure: ["The valley road and its bridges", "Parking terraces above the Neelum"],
    limit: "The Neelum's active channel and flood terrace are a no-go for hotels, as with Naran, Kalam and Hunza.",
    season: "Use the valley road. Landslide closures are repaired on that alignment, not bypassed through the river.",
  },
];

export type CorridorEdge = {
  id: string;
  a: string;
  b: string;
  road: string;
  seasonal?: boolean;
};

export const corridorEdges: CorridorEdge[] = [
  { id: "islamabad-mansehra", a: "islamabad", b: "mansehra", road: "N-35 from Islamabad" },
  { id: "mansehra-chilas", a: "mansehra", b: "chilas", road: "N-35 Karakoram Highway" },
  { id: "chilas-raikot", a: "chilas", b: "raikot", road: "N-35 Karakoram Highway" },
  { id: "raikot-gilgit", a: "raikot", b: "gilgit", road: "N-35 Karakoram Highway" },
  { id: "gilgit-hunza", a: "gilgit", b: "hunza", road: "N-35 Karakoram Highway" },
  { id: "hunza-khunjerab", a: "hunza", b: "khunjerab", road: "N-35 beyond Hunza" },
  { id: "gilgit-skardu", a: "gilgit", b: "skardu", road: "Gilgit–Skardu road" },
  { id: "gilgit-gupis", a: "gilgit", b: "gupis", road: "Gilgit–Ghizer road" },
  { id: "mansehra-naran", a: "mansehra", b: "naran", road: "N-15" },
  { id: "naran-chilas", a: "naran", b: "chilas", road: "Babusar, summer only", seasonal: true },
  { id: "islamabad-mingora", a: "islamabad", b: "mingora", road: "Swat Expressway" },
  { id: "mingora-kalam", a: "mingora", b: "kalam", road: "N-95" },
  { id: "islamabad-dir", a: "islamabad", b: "dir", road: "M-1 and N-45" },
  { id: "dir-chitral", a: "dir", b: "chitral", road: "N-45 through the Lowari Tunnel" },
  { id: "islamabad-muzaffarabad", a: "islamabad", b: "muzaffarabad", road: "Murree–Kohala highway" },
  { id: "mansehra-muzaffarabad", a: "mansehra", b: "muzaffarabad", road: "Mansehra–Muzaffarabad road" },
  { id: "muzaffarabad-sharda", a: "muzaffarabad", b: "sharda", road: "Neelum valley road" },
];

export type CorridorPath = {
  nodes: string[];
  roads: string[];
  seasonal: boolean;
  label: string;
};

const nodeById = Object.fromEntries(routeNodes.map((node) => [node.id, node]));

export function placeById(id: string) {
  return nodeById[id];
}

export function routesBetween(
  start: string,
  end: string,
  edges: CorridorEdge[] = corridorEdges,
  spurNodes: readonly string[] = ["muzaffarabad", "sharda"],
): CorridorPath[] {
  if (!start || !end || start === end) return [];
  const spur = new Set(spurNodes);
  const usable =
    spur.size === 0 || spur.has(start) || spur.has(end)
      ? edges
      : edges.filter((edge) => !spur.has(edge.a) && !spur.has(edge.b));
  const adjacent = new Map<string, CorridorEdge[]>();
  for (const edge of usable) {
    for (const id of [edge.a, edge.b]) {
      const list = adjacent.get(id) ?? [];
      list.push(edge);
      adjacent.set(id, list);
    }
  }
  const found: CorridorPath[] = [];
  const walk = (at: string, seen: Set<string>, nodes: string[], seasonal: boolean, roads: string[]) => {
    if (nodes.length > 10) return;
    if (at === end) {
      const collapsed: string[] = [];
      for (const road of roads) {
        if (collapsed[collapsed.length - 1] !== road) collapsed.push(road);
      }
      found.push({ nodes: [...nodes], roads: collapsed, seasonal, label: collapsed.join(" · ") });
      return;
    }
    for (const edge of adjacent.get(at) ?? []) {
      const next = edge.a === at ? edge.b : edge.a;
      if (seen.has(next)) continue;
      seen.add(next);
      nodes.push(next);
      roads.push(edge.road);
      walk(next, seen, nodes, seasonal || Boolean(edge.seasonal), roads);
      roads.pop();
      nodes.pop();
      seen.delete(next);
    }
  };
  walk(start, new Set([start]), [start], false, []);
  found.sort((a, b) => Number(a.seasonal) - Number(b.seasonal) || a.nodes.length - b.nodes.length);
  return found;
}

export function lineForPath(
  nodes: string[],
  edges: CorridorEdge[] = corridorEdges,
  lines: Record<string, [number, number][]> = routeLines,
): [number, number][] {
  const line: [number, number][] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    const edge = edges.find((item) => (item.a === a && item.b === b) || (item.a === b && item.b === a));
    if (!edge) continue;
    const raw = lines[edge.id];
    if (!raw) continue;
    const segment = edge.a === a ? raw : [...raw].reverse();
    for (const point of segment) {
      const previous = line[line.length - 1];
      if (!previous || previous[0] !== point[0] || previous[1] !== point[1]) line.push(point);
    }
  }
  return line;
}
