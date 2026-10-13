/**
 * Official figures from the 7th Population and Housing Census 2023 (Pakistan Bureau of Statistics):
 * Table 1 (area, population, density, urban share, growth), National Census Report tables 5.1, 5.3, 5.6
 * and 5.10 (structures, households, pacca / kacha houses, wall materials).
 * PBS housing tables cover the four provinces and ICT; AJK and Gilgit-Baltistan are included in the
 * national population total only.
 */
import type { PendingTable, SegmentId } from "./pria";

export type ProvinceId =
  | "punjab"
  | "sindh"
  | "khyber-pakhtunkhwa"
  | "balochistan"
  | "islamabad"
  | "azad-kashmir"
  | "gilgit-baltistan";

export type ProvinceCensus = {
  id: ProvinceId;
  name: string;
  population: number;
  areaKm2?: number;
  density?: number;
  urbanPct?: number;
  growthPct?: number;
  households?: number;
  householdSize?: number;
  paccaPct?: number;
  semiPaccaPct?: number;
  kachaPct?: number;
  mudWallsPct?: number;
  singleRoomPct?: number;
  residentialStructures?: number;
  economicStructures?: number;
  mixedStructures?: number;
  temporaryShelters?: number;
  underConstruction?: number;
};

export const censusSource = {
  label: "PBS, 7th Population and Housing Census 2023",
  url: "https://www.pbs.gov.pk/",
};

export const national = {
  populationProvincesIct: 241_499_431,
  populationTotal: 247_541_947,
  growthPct: 2.55,
  households: 38_292_556,
  householdsUrbanPct: 39.23,
  householdsRuralPct: 60.77,
  householdSize: 6.33,
  paccaPct: 67.46,
  semiPaccaPct: 12.58,
  kachaPct: 19.96,
  bakedBrickWallsPct: 73.3,
  mudWallsPct: 20.3,
  singleRoomPct: 31.79,
  residentialStructures: 30_434_514,
  economicStructures: 5_151_063,
  multiStoreyStructures: 114_148,
};

export const provinces: ProvinceCensus[] = [
  {
    id: "punjab",
    name: "Punjab",
    population: 127_688_922,
    areaKm2: 205_345,
    density: 621.83,
    urbanPct: 40.71,
    growthPct: 2.53,
    households: 19_839_980,
    householdSize: 6.44,
    paccaPct: 80.8,
    semiPaccaPct: 11.93,
    kachaPct: 7.26,
    mudWallsPct: 11.84,
    singleRoomPct: 24.24,
    residentialStructures: 17_379_863,
    economicStructures: 3_270_252,
    mixedStructures: 810_060,
    temporaryShelters: 104_267,
    underConstruction: 528_470,
  },
  {
    id: "sindh",
    name: "Sindh",
    population: 55_696_147,
    areaKm2: 140_914,
    density: 395.25,
    urbanPct: 53.97,
    growthPct: 2.57,
    households: 9_862_870,
    householdSize: 5.65,
    paccaPct: 57.69,
    semiPaccaPct: 9.19,
    kachaPct: 33.11,
    mudWallsPct: 23.79,
    singleRoomPct: 50.31,
    residentialStructures: 6_163_126,
    economicStructures: 825_884,
    mixedStructures: 215_689,
    temporaryShelters: 313_738,
    underConstruction: 136_920,
  },
  {
    id: "khyber-pakhtunkhwa",
    name: "Khyber Pakhtunkhwa",
    population: 40_856_097,
    areaKm2: 101_741,
    density: 401.57,
    urbanPct: 15.01,
    growthPct: 2.38,
    households: 5_861_457,
    householdSize: 6.9,
    paccaPct: 55.57,
    semiPaccaPct: 19.58,
    kachaPct: 24.85,
    mudWallsPct: 28.29,
    singleRoomPct: 27.52,
    residentialStructures: 4_689_072,
    economicStructures: 756_175,
    mixedStructures: 96_991,
    temporaryShelters: 11_477,
    underConstruction: 186_798,
  },
  {
    id: "balochistan",
    name: "Balochistan",
    population: 14_894_402,
    areaKm2: 347_190,
    density: 42.9,
    urbanPct: 30.96,
    growthPct: 3.2,
    households: 2_317_256,
    householdSize: 6.43,
    paccaPct: 19.64,
    semiPaccaPct: 16.78,
    kachaPct: 63.58,
    mudWallsPct: 61.02,
    singleRoomPct: 32.72,
    residentialStructures: 1_864_928,
    economicStructures: 267_313,
    mixedStructures: 23_950,
    temporaryShelters: 98_723,
    underConstruction: 47_622,
  },
  {
    id: "islamabad",
    name: "Islamabad Capital Territory",
    population: 2_363_863,
    areaKm2: 906,
    density: 2609.12,
    urbanPct: 46.91,
    growthPct: 2.8,
    households: 410_993,
    householdSize: 5.52,
    paccaPct: 97.35,
    semiPaccaPct: 1.21,
    kachaPct: 1.44,
    mudWallsPct: 1.53,
    singleRoomPct: 8.1,
    residentialStructures: 337_525,
    economicStructures: 31_439,
    mixedStructures: 13_614,
    temporaryShelters: 2_713,
    underConstruction: 27_350,
  },
  { id: "azad-kashmir", name: "Azad Jammu & Kashmir", population: 4_333_467 },
  { id: "gilgit-baltistan", name: "Gilgit-Baltistan", population: 1_709_049 },
];

export function getProvince(id: string): ProvinceCensus | undefined {
  return provinces.find((p) => p.id === id);
}

/** Provinces and territories each regional segment spans (segments cover parts of some provinces). */
export const segmentProvinces: Record<SegmentId, ProvinceId[]> = {
  mountain: ["gilgit-baltistan", "khyber-pakhtunkhwa", "azad-kashmir"],
  "riverine-plains": ["punjab", "khyber-pakhtunkhwa", "sindh"],
  "desert-arid": ["punjab", "sindh", "balochistan"],
  coastal: ["sindh", "balochistan"],
};

const int = new Intl.NumberFormat("en-US");
export const fmtInt = (n: number) => int.format(n);
export const fmtPct = (n: number) => `${n.toFixed(1)}%`;
export const fmtMn = (n: number) => `${(n / 1_000_000).toFixed(2)} Mn`;

/** Built-stock table rendered from the census (four provinces and ICT). */
export const housingTable: PendingTable = {
  id: "census-housing",
  title: "Housing & Built Stock by Province (Census 2023)",
  caption:
    "Population, housing units, house durability and building structures per province, from the PBS 7th Population and Housing Census 2023.",
  rowHeader: "Province / Region",
  columns: [
    { id: "population", label: "Population" },
    { id: "urban", label: "Urban share" },
    { id: "households", label: "Housing units" },
    { id: "pacca", label: "Pacca houses" },
    { id: "kacha", label: "Kacha houses" },
    { id: "mud", label: "Mud / unbaked walls" },
    { id: "residential", label: "Residential structures" },
    { id: "economic", label: "Economic structures" },
  ],
  rows: provinces
    .filter((p) => p.households)
    .map((p) => ({
      region: p.name,
      cells: {
        population: fmtInt(p.population),
        urban: fmtPct(p.urbanPct!),
        households: fmtInt(p.households!),
        pacca: fmtPct(p.paccaPct!),
        kacha: fmtPct(p.kachaPct!),
        mud: fmtPct(p.mudWallsPct!),
        residential: fmtInt(p.residentialStructures!),
        economic: fmtInt(p.economicStructures!),
      },
    })),
  status: "available",
};
