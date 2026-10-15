/**
 * Growth outlook 2020–2047: population, buildings, housing need, urbanisation and built-up
 * coverage. Figures are taken verbatim from the PRIA data brief; each block keeps the data
 * file it was read from.
 */
import type { ProvinceId } from "./census";

export const outlookSources = {
  ghsl: "PRIA data: pop_builtup_2020_2050.json (GHSL population & built-up series)",
  provinceUrban: "PRIA data: pop_province_urban_rural_2017_2047.csv",
  buildingsNational: "PRIA data: obt_building_count_national_2016_2047.csv (Open Buildings model)",
  buildingsProvince: "PRIA data: obt_building_count_province_2016_2047.csv",
  reference: "PRIA data: portal_reference_values_2017_2047.csv",
  urbanRural: "PRIA data: pop_urban_rural_incl_ajk_gb_2017_2047.csv",
} as const;

/** National population (millions) and annual growth %, GHSL series. 2021–2025 are not in the data. */
export const populationSeries: { year: number; pop: number; growth?: number }[] = [
  { year: 2020, pop: 234.99 },
  { year: 2026, pop: 255, growth: 1.371 },
  { year: 2027, pop: 260, growth: 1.961 },
  { year: 2028, pop: 265, growth: 1.923 },
  { year: 2029, pop: 270, growth: 1.887 },
  { year: 2030, pop: 276, growth: 2.222 },
  { year: 2031, pop: 281, growth: 1.812 },
  { year: 2032, pop: 287, growth: 2.135 },
  { year: 2033, pop: 293, growth: 2.091 },
  { year: 2034, pop: 298, growth: 1.706 },
  { year: 2035, pop: 304, growth: 2.013 },
  { year: 2036, pop: 310, growth: 1.974 },
  { year: 2037, pop: 317, growth: 2.258 },
  { year: 2038, pop: 323, growth: 1.893 },
  { year: 2039, pop: 329, growth: 1.858 },
  { year: 2040, pop: 336, growth: 2.128 },
  { year: 2041, pop: 343, growth: 2.083 },
  { year: 2042, pop: 350, growth: 2.041 },
  { year: 2043, pop: 357, growth: 2.0 },
  { year: 2044, pop: 364, growth: 1.961 },
  { year: 2045, pop: 371, growth: 1.923 },
  { year: 2046, pop: 378, growth: 1.887 },
  { year: 2047, pop: 386, growth: 2.116 },
];

/** National building coverage (% of land area) and built footprint (km²). */
export const coverageSeries: { year: number; pct: number; km2: number }[] = [
  { year: 2020, pct: 0.712, km2: 6256.6 },
  { year: 2026, pct: 0.866, km2: 7612.6 },
  { year: 2027, pct: 0.891, km2: 7832.8 },
  { year: 2028, pct: 0.917, km2: 8061.0 },
  { year: 2029, pct: 0.944, km2: 8297.9 },
  { year: 2030, pct: 0.972, km2: 8543.8 },
  { year: 2031, pct: 1.001, km2: 8802.1 },
  { year: 2032, pct: 1.032, km2: 9070.0 },
  { year: 2033, pct: 1.063, km2: 9347.8 },
  { year: 2034, pct: 1.096, km2: 9636.0 },
  { year: 2035, pct: 1.13, km2: 9935.2 },
  { year: 2036, pct: 1.16, km2: 10196.7 },
  { year: 2037, pct: 1.191, km2: 10466.3 },
  { year: 2038, pct: 1.222, km2: 10744.3 },
  { year: 2039, pct: 1.255, km2: 11030.9 },
  { year: 2040, pct: 1.288, km2: 11326.6 },
  { year: 2041, pct: 1.321, km2: 11611.8 },
  { year: 2042, pct: 1.354, km2: 11905.8 },
  { year: 2043, pct: 1.389, km2: 12208.7 },
  { year: 2044, pct: 1.424, km2: 12520.8 },
  { year: 2045, pct: 1.461, km2: 12842.5 },
  { year: 2046, pct: 1.499, km2: 13174.2 },
  { year: 2047, pct: 1.538, km2: 13516.1 },
  { year: 2050, pct: 1.662, km2: 14607.2 },
];

/** National building count (census area). */
export const buildingSeries: { year: number; buildings: number; added: number }[] = [
  { year: 2026, buildings: 40_866_704, added: 1_172_218 },
  { year: 2030, buildings: 45_912_118, added: 1_316_940 },
  { year: 2035, buildings: 53_103_661, added: 1_523_222 },
  { year: 2040, buildings: 61_421_668, added: 1_761_815 },
  { year: 2045, buildings: 71_042_584, added: 2_037_781 },
  { year: 2047, buildings: 75_300_456, added: 2_159_913 },
];

/** Residential units required (population ÷ 6.5 persons per unit). */
export const housingSeries: { year: number; units: number; additional?: number }[] = [
  { year: 2026, units: 40_182_837 },
  { year: 2030, units: 43_451_278, additional: 3_268_441 },
  { year: 2035, units: 47_806_252, additional: 7_623_415 },
  { year: 2040, units: 52_783_193, additional: 12_600_356 },
  { year: 2045, units: 58_223_931, additional: 18_041_094 },
  { year: 2047, units: 60_555_045, additional: 20_372_208 },
];

/** Planning scenario supplied for PRIA, not portal data. */
export const buildCapacityScenario = {
  neededPerYear: 500_000,
  builtPerYear: 300_000,
  shortfallPerYear: 200_000,
  years: 22,
  cumulativeShortfall: 4_400_000,
  cumulativeNeed: 11_000_000,
  cumulativeDelivery: 6_600_000,
};

export const urbanRural = {
  y2017: { urban: 76.37, rural: 135.34, total: 211.72, urbanShare: 36.07 },
  y2023: { urban: 94.68, rural: 151.15, total: 245.83, urbanShare: 38.52 },
  urbanCagr: 3.65,
  ruralCagr: 1.86,
  urbanShare2043: 47.0,
  urbanShare2047: 48.75,
  urban2047: 190.6,
  rural2047: 200.4,
};

export type ProvinceOutlook = {
  id: ProvinceId;
  name: string;
  pop2020: number;
  pop2026: number;
  pop2047: number;
  share2026: number;
  share2047: number;
  buildings2026: number;
  buildings2047: number;
  coverage2020: number;
  coverage2026: number;
  coverage2047: number;
  coverageGrowth: number;
  /** Share of Pakistan's total built-up area in 2026, %. */
  builtShare2026: number;
  urban2017?: number;
  urban2047?: number;
};

export const provinceOutlook: ProvinceOutlook[] = [
  {
    id: "punjab", name: "Punjab",
    pop2020: 128.62, pop2026: 135.71, pop2047: 211.93, share2026: 51.78, share2047: 54.9,
    buildings2026: 25_434_176, buildings2047: 47_397_828,
    coverage2020: 1.783, coverage2026: 2.157, coverage2047: 3.768, coverageGrowth: 2.72, builtShare2026: 58.23,
    urban2017: 36.86, urban2047: 56.39,
  },
  {
    id: "sindh", name: "Sindh",
    pop2020: 54.07, pop2026: 59.35, pop2047: 89.65, share2026: 22.64, share2047: 23.23,
    buildings2026: 6_327_610, buildings2047: 9_114_879,
    coverage2020: 0.695, coverage2026: 0.872, coverage2047: 1.689, coverageGrowth: 3.23, builtShare2026: 16.21,
    urban2017: 51.89, urban2047: 61.67,
  },
  {
    id: "khyber-pakhtunkhwa", name: "Khyber Pakhtunkhwa",
    pop2020: 36.97, pop2026: 43.26, pop2047: 60.51, share2026: 16.51, share2047: 15.68,
    buildings2026: 6_881_784, buildings2047: 14_846_862,
    coverage2020: 1.068, coverage2026: 1.286, coverage2047: 2.233, coverageGrowth: 2.68, builtShare2026: 17.24,
    urban2017: 16.55, urban2047: 9.93,
  },
  {
    id: "balochistan", name: "Balochistan",
    pop2020: 8.51, pop2026: 16.07, pop2047: 12.76, share2026: 6.13, share2047: 3.31,
    buildings2026: 1_554_641, buildings2047: 1_683_987,
    coverage2020: 0.059, coverage2026: 0.075, coverage2047: 0.143, coverageGrowth: 3.18, builtShare2026: 3.42,
    urban2017: 27.62, urban2047: 45.84,
  },
  {
    id: "islamabad", name: "Islamabad",
    pop2020: 2.01, pop2026: 2.53, pop2047: 3.45, share2026: 0.97, share2047: 0.89,
    buildings2026: 668_494, buildings2047: 2_256_900,
    coverage2020: 10.114, coverage2026: 12.147, coverage2047: 19.201, coverageGrowth: 2.25, builtShare2026: 1.44,
    urban2017: 50.37, urban2047: 33.48,
  },
  {
    id: "azad-kashmir", name: "Azad Kashmir",
    pop2020: 3.71, pop2026: 3.99, pop2047: 6.02, share2026: 1.52, share2047: 1.56,
    buildings2026: 1_533_797, buildings2047: 3_370_494,
    coverage2020: 1.736, coverage2026: 2.034, coverage2047: 3.346, coverageGrowth: 2.41, builtShare2026: 2.95,
  },
  {
    id: "gilgit-baltistan", name: "Gilgit-Baltistan",
    pop2020: 1.1, pop2026: 1.18, pop2047: 1.69, share2026: 0.45, share2047: 0.44,
    buildings2026: 354_790, buildings2047: 845_995,
    coverage2020: 0.046, coverage2026: 0.055, coverage2047: 0.095, coverageGrowth: 2.64, builtShare2026: 0.51,
  },
];

export function getProvinceOutlook(id: string): ProvinceOutlook | undefined {
  return provinceOutlook.find((p) => p.id === id);
}

export type DistrictOutlook = { name: string; province: string; pop2026: number; pop2047: number; change: number; growth: number };

/** Top 15 districts by 2047 population. */
export const topDistricts: DistrictOutlook[] = [
  { name: "Lahore", province: "Punjab", pop2026: 13_551_346, pop2047: 18_529_033, change: 4_977_687, growth: 36.7 },
  { name: "Faisalabad", province: "Punjab", pop2026: 10_946_157, pop2047: 16_372_807, change: 5_426_650, growth: 49.6 },
  { name: "Gujranwala", province: "Punjab", pop2026: 6_337_938, pop2047: 9_680_691, change: 3_342_753, growth: 52.7 },
  { name: "Rawalpindi", province: "Punjab", pop2026: 6_192_183, pop2047: 9_197_937, change: 3_005_754, growth: 48.5 },
  { name: "Rahim Yar Khan", province: "Punjab", pop2026: 5_738_694, pop2047: 8_461_518, change: 2_722_824, growth: 47.4 },
  { name: "Sialkot", province: "Punjab", pop2026: 5_164_481, pop2047: 8_427_596, change: 3_263_115, growth: 63.2 },
  { name: "Multan", province: "Punjab", pop2026: 5_648_016, pop2047: 7_941_840, change: 2_293_824, growth: 40.6 },
  { name: "Sargodha", province: "Punjab", pop2026: 4_925_782, pop2047: 7_375_163, change: 2_449_381, growth: 49.7 },
  { name: "Kasur", province: "Punjab", pop2026: 4_464_501, pop2047: 7_119_986, change: 2_655_485, growth: 59.5 },
  { name: "Sheikhupura", province: "Punjab", pop2026: 4_310_588, pop2047: 7_051_658, change: 2_741_070, growth: 63.6 },
  { name: "East Karachi", province: "Sindh", pop2026: 4_253_481, pop2047: 6_841_104, change: 2_587_623, growth: 60.8 },
  { name: "Bahawalpur", province: "Punjab", pop2026: 4_484_782, pop2047: 6_594_342, change: 2_109_560, growth: 47.0 },
  { name: "Gujrat", province: "Punjab", pop2026: 3_915_309, pop2047: 6_580_454, change: 2_665_145, growth: 68.1 },
  { name: "South Karachi", province: "Sindh", pop2026: 4_616_604, pop2047: 6_552_600, change: 1_935_996, growth: 41.9 },
  { name: "Okara", province: "Punjab", pop2026: 4_112_330, pop2047: 6_052_681, change: 1_940_351, growth: 47.2 },
];

/** Fastest-growing large districts, % change 2026→2047. */
export const fastestDistricts: { name: string; province: string; growth: number }[] = [
  { name: "Malir", province: "Sindh", growth: 110.6 },
  { name: "Gujrat", province: "Punjab", growth: 68.1 },
  { name: "Sheikhupura", province: "Punjab", growth: 63.6 },
  { name: "Sialkot", province: "Punjab", growth: 63.2 },
  { name: "Jhang", province: "Punjab", growth: 61.2 },
  { name: "East Karachi", province: "Sindh", growth: 60.8 },
  { name: "Kasur", province: "Punjab", growth: 59.5 },
];

export const outlookHeadlines = {
  popCagr2026to2047: 1.99,
  popCagr2020to2047: 1.86,
  builtCagr2020to2047: 2.89,
  coverageMultiple2047: 2.16,
  buildingGrowth: 2.95,
  buildingIncreasePct: 84,
  buildingsInclAjkGb2026: 42.76,
  buildingsInclAjkGb2047: 79.52,
};
