/**
 * Preferred infrastructure corridors to visitor sites in northern Pakistan.
 * Roads are the national and valley routes that actually serve these sites
 * (N-35, N-15, N-95, N-45 / Lowari, Gilgit–Skardu, Neelum valley road).
 * Limits come from this segment's own no-go rules: active channels of the
 * Indus, Swat, Kunhar, Neelum and Hunza, GLOF fans, and the 2022 Swat riverbank failure.
 * This is a siting template, not a live travel bulletin.
 */

export type RouteNode = { id: string; name: string; x: number; y: number };

export const routeNodes: RouteNode[] = [
  { id: "khunjerab", name: "Khunjerab", x: 575, y: 42 },
  { id: "hunza", name: "Hunza", x: 490, y: 88 },
  { id: "gupis", name: "Gupis", x: 350, y: 72 },
  { id: "gilgit", name: "Gilgit", x: 430, y: 150 },
  { id: "skardu", name: "Skardu", x: 575, y: 188 },
  { id: "raikot", name: "Raikot", x: 355, y: 178 },
  { id: "chilas", name: "Chilas", x: 270, y: 214 },
  { id: "naran", name: "Naran", x: 175, y: 248 },
  { id: "kalam", name: "Kalam", x: 95, y: 148 },
  { id: "chitral", name: "Chitral", x: 78, y: 78 },
  { id: "dir", name: "Dir", x: 48, y: 196 },
  { id: "mingora", name: "Mingora", x: 108, y: 268 },
  { id: "mansehra", name: "Mansehra", x: 168, y: 348 },
  { id: "muzaffarabad", name: "Muzaffarabad", x: 280, y: 392 },
  { id: "sharda", name: "Sharda", x: 400, y: 348 },
];

export type NorthRoute = {
  id: string;
  site: string;
  region: "Gilgit-Baltistan" | "North Khyber Pakhtunkhwa" | "Azad Jammu & Kashmir";
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
    road: "N-35 Karakoram Highway",
    path: ["mansehra", "chilas", "raikot", "gilgit", "hunza"],
    infrastructure: ["KKH carriageway and its bridges", "Parking and guest-house sites off the Hunza channel"],
    limit: "Do not place hotels on the Hunza or Indus flood terrace. The segment no-go rule keeps buildings out of those active channels.",
    season: "The highway is the year-round spine. Winter closures are at high cuts, not a reason to drop onto the riverbed.",
  },
  {
    id: "khunjerab",
    site: "Khunjerab",
    region: "Gilgit-Baltistan",
    road: "N-35 beyond Hunza",
    path: ["mansehra", "chilas", "raikot", "gilgit", "hunza", "khunjerab"],
    infrastructure: ["KKH to the pass", "Border and viewpoint facilities on the engineered alignment"],
    limit: "Facilities stay on the highway bench. Debris fans below side valleys are not building sites.",
    season: "The pass itself is a seasonal border. Approach planning uses the Hunza section of N-35.",
  },
  {
    id: "gilgit",
    site: "Gilgit",
    region: "Gilgit-Baltistan",
    road: "N-35 Karakoram Highway",
    path: ["mansehra", "chilas", "raikot", "gilgit"],
    infrastructure: ["KKH as the regional hub", "Bridges at the Gilgit and Indus confluence kept as through-routes"],
    limit: "Visitor buildings sit above the confluence flood line, not in the river junction.",
    season: "Year-round hub for the northern roads.",
  },
  {
    id: "skardu",
    site: "Skardu",
    region: "Gilgit-Baltistan",
    road: "Gilgit–Skardu road",
    path: ["gilgit", "skardu"],
    infrastructure: ["The engineered valley road along the Indus", "Bridges, not fords, at side streams"],
    limit: "Rockfall and river-edge sections stay on the built road. New facilities are not cut into the Indus terrace.",
    season: "Open through the year, with short closures after rockfall. Do not substitute a riverbed track.",
  },
  {
    id: "raikot",
    site: "Raikot / Fairy Meadows junction",
    region: "Gilgit-Baltistan",
    road: "N-35, then the Raikot track",
    path: ["mansehra", "chilas", "raikot"],
    infrastructure: ["KKH to the Raikot junction", "The last climb is a steep unpaved track, not a national highway"],
    limit: "Treat the track as a limited-capacity link. Parking and lodging belong at the junction, not on the Indus bank.",
    season: "The highway approach is the reliable leg. The track is fair-weather.",
  },
  {
    id: "gupis",
    site: "Gupis, Ghizer",
    region: "Gilgit-Baltistan",
    road: "Gilgit–Ghizer road",
    path: ["gilgit", "gupis"],
    infrastructure: ["The valley road from Gilgit", "Bridges clear of debris fans"],
    limit: "Khukush Lake above Gupis is a studied outburst source. Do not site lodging or parking on the fan or in the modelled flow path.",
    season: "Use the valley road. An outburst path is never a shortcut.",
  },
  {
    id: "naran",
    site: "Naran, Kaghan",
    region: "North Khyber Pakhtunkhwa",
    road: "N-15 from Mansehra",
    path: ["mansehra", "naran"],
    infrastructure: ["N-15 as the valley road", "A separate seasonal link over Babusar toward Chilas"],
    limit: "Hotels stay back from the Kunhar. The segment rule bars the active channel and flood terrace. New rooms need a valley plan for road capacity, sewage and parking.",
    season: "Naran is reached on N-15. Babusar is a summer link only and is not the preferred approach.",
  },
  {
    id: "kalam",
    site: "Kalam, Swat",
    region: "North Khyber Pakhtunkhwa",
    road: "N-95 from Mingora",
    path: ["mingora", "kalam"],
    infrastructure: ["N-95 up the Swat valley", "Bridges and a setback for any new guest house"],
    limit: "A new hotel in Swat collapsed into the river in the 2022 floods. Visitor buildings stay off the bank.",
    season: "The highway is the corridor. Do not route visitors along the riverbed when the road is cut.",
  },
  {
    id: "chitral",
    site: "Chitral",
    region: "North Khyber Pakhtunkhwa",
    road: "N-45 through the Lowari Tunnel",
    path: ["dir", "chitral"],
    infrastructure: ["N-45 and the Lowari Tunnel", "Valley-road bridges rather than fair-weather fords"],
    limit: "Keep facilities off debris fans and the active channel. The tunnel is the all-season infrastructure; the old pass is not the template.",
    season: "The tunnel is the year-round link from Dir.",
  },
  {
    id: "muzaffarabad",
    site: "Muzaffarabad",
    region: "Azad Jammu & Kashmir",
    road: "Engineered approach from Mansehra",
    path: ["mansehra", "muzaffarabad"],
    infrastructure: ["The valley highway into the city", "Bridges at the Neelum and Jhelum confluence"],
    limit: "No new building on the mapped trace of the fault that ruptured in 2005, or in the confluence flood plain.",
    season: "Year-round highway approach.",
  },
  {
    id: "sharda",
    site: "Sharda, Neelum",
    region: "Azad Jammu & Kashmir",
    road: "Neelum valley road from Muzaffarabad",
    path: ["muzaffarabad", "sharda"],
    infrastructure: ["The valley road and its bridges", "Parking terraces above the Neelum"],
    limit: "The Neelum's active channel and flood terrace are a no-go for hotels, as with Naran, Kalam and Hunza.",
    season: "Use the valley road. Landslide closures are repaired on that alignment, not bypassed through the river.",
  },
];

export const routeEdges: { a: string; b: string; seasonal?: boolean }[] = [
  { a: "mansehra", b: "chilas" },
  { a: "chilas", b: "raikot" },
  { a: "raikot", b: "gilgit" },
  { a: "gilgit", b: "hunza" },
  { a: "hunza", b: "khunjerab" },
  { a: "gilgit", b: "skardu" },
  { a: "gilgit", b: "gupis" },
  { a: "mansehra", b: "naran" },
  { a: "naran", b: "chilas", seasonal: true },
  { a: "mingora", b: "kalam" },
  { a: "dir", b: "chitral" },
  { a: "mansehra", b: "muzaffarabad" },
  { a: "muzaffarabad", b: "sharda" },
];
