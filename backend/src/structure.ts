/**
 * Valid identifiers for PRIA content. Must stay in sync with `src/data/pria.ts` in the portal;
 * writes using any other id are rejected so typos never silently disappear.
 */

const residentialSubSections = [
  "material-options",
  "design-options",
  "construction-methodology",
  "no-go-areas",
  "tourism-templates",
  "maintenance",
  "e-infra-audit",
  "other-subjects",
] as const;

const standardSubSections = ["material-options", "design-options", "construction-methodologies"] as const;

export const categories: Record<string, readonly string[]> = {
  residential: residentialSubSections,
  commercial: standardSubSections,
  communication: standardSubSections,
  strategic: standardSubSections,
  "private-sector": standardSubSections,
  industrial: standardSubSections,
};

export const segmentIds = ["mountain", "riverine-plains", "desert-arid", "coastal"] as const;

export const regions = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory",
] as const;

export const tables: Record<string, readonly string[]> = {
  "province-breakdown": [
    "residential-urban",
    "residential-rural",
    "commercial",
    "strategic",
    "communication",
    "misc",
  ],
  "projected-breakdown": ["current-status", "projected-need", "key-challenge"],
};

export const summaryIds = ["ndma-role", "responsibilities", "conclusion", "end-state"] as const;

export const structure = {
  segments: segmentIds,
  categories,
  regions,
  tables,
  summary: summaryIds,
};
