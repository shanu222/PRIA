/**
 * Recorded disasters and hazard facts used across the portal. Each figure carries its source.
 */
import type { SegmentId } from "./pria";

export type HazardFact = { value: string; label: string; source: string };

export type DisasterEvent = {
  id: string;
  year: number;
  title: string;
  icon: string;
  summary: string;
  facts: HazardFact[];
};

export const disasterTimeline: DisasterEvent[] = [
  {
    id: "earthquake-2005",
    year: 2005,
    title: "Kashmir earthquake (Mw 7.6)",
    icon: "Activity",
    summary:
      "Struck on 8 October 2005 near Muzaffarabad on the Main Himalayan Thrust. Muzaffarabad, Balakot, Bagh and Battagram were the worst-affected areas.",
    facts: [
      { value: "87,350", label: "deaths in Pakistan (official toll)", source: "Government of Pakistan" },
      { value: "780,000+", label: "buildings destroyed or severely damaged, incl. 17,000 schools", source: "Government of Pakistan" },
      { value: "3.5 Mn", label: "people displaced", source: "Government of Pakistan" },
    ],
  },
  {
    id: "floods-2010",
    year: 2010,
    title: "Indus super floods",
    icon: "Waves",
    summary: "Monsoon flooding down the length of the Indus basin, the deadliest floods in Pakistan before 2022.",
    facts: [{ value: "~2,000", label: "deaths", source: "NDMA" }],
  },
  {
    id: "heatwave-2015",
    year: 2015,
    title: "Southern Pakistan heatwave",
    icon: "Thermometer",
    summary:
      "Temperatures reached 45 °C in Karachi and 49 °C in Larkana, Turbat and Sibi in June 2015; grid failures left many without fans, cooling or water pumps.",
    facts: [{ value: "~2,000", label: "deaths, mostly in Sindh and Karachi", source: "Media reports (Bloomberg, Dawn), June 2015" }],
  },
  {
    id: "floods-2022",
    year: 2022,
    title: "Monsoon super floods",
    icon: "CloudRain",
    summary:
      "Record monsoon rain and glacial melt after a severe heatwave flooded large parts of Sindh, Balochistan, Khyber Pakhtunkhwa and south Punjab from June to October 2022.",
    facts: [
      { value: "33 Mn", label: "people affected", source: "NDMA" },
      { value: "1,739", label: "deaths", source: "NDMA" },
      { value: "2.29 Mn", label: "houses damaged (1.39 Mn) or destroyed (0.90 Mn)", source: "NDMA" },
      { value: "13,115 km", label: "of roads and 439 bridges damaged", source: "NDMA" },
      { value: "US$ 14.9 bn", label: "damage, plus US$ 15.2 bn economic loss", source: "Post-Disaster Needs Assessment 2022" },
      { value: "US$ 16.3 bn", label: "needed for recovery and reconstruction", source: "Post-Disaster Needs Assessment 2022" },
    ],
  },
  {
    id: "biparjoy-2023",
    year: 2023,
    title: "Cyclone Biparjoy",
    icon: "Wind",
    summary:
      "A very severe cyclonic storm that made landfall near the Pakistan–India border in June 2023, threatening Keti Bandar, Thatta, Sujawal and Badin.",
    facts: [{ value: "81,935", label: "people evacuated from coastal Sindh before landfall", source: "Ministry of Climate Change" }],
  },
];

export type SegmentProfile = {
  hazards: { id: string; label: string; icon: string }[];
  facts: HazardFact[];
};

export const segmentProfiles: Record<SegmentId, SegmentProfile> = {
  mountain: {
    hazards: [
      { id: "earthquake", label: "Earthquakes", icon: "Activity" },
      { id: "glof", label: "Glacial lake outburst floods", icon: "Snowflake" },
      { id: "landslide", label: "Landslides & rockfall", icon: "Mountain" },
      { id: "flash-flood", label: "Flash floods", icon: "CloudRain" },
      { id: "avalanche", label: "Avalanches & heavy snow", icon: "Snowflake" },
    ],
    facts: [
      { value: "3,044", label: "glacial lakes in Gilgit-Baltistan and Khyber Pakhtunkhwa", source: "Ministry of Climate Change / UNDP GLOF-II" },
      { value: "33", label: "of them assessed as prone to hazardous outburst floods", source: "Ministry of Climate Change / UNDP GLOF-II" },
      { value: "7.1 Mn", label: "people in GB and KP vulnerable to GLOFs", source: "Ministry of Climate Change" },
      { value: "~19,000", label: "students and teachers killed in collapsed schools in the 2005 earthquake", source: "2005 earthquake records" },
    ],
  },
  "riverine-plains": {
    hazards: [
      { id: "riverine-flood", label: "Riverine floods", icon: "Waves" },
      { id: "hill-torrent", label: "Hill torrents", icon: "CloudRain" },
      { id: "urban-flood", label: "Urban flooding", icon: "Droplets" },
      { id: "heat", label: "Heatwaves", icon: "Thermometer" },
      { id: "smog", label: "Smog & air pollution", icon: "Wind" },
    ],
    facts: [
      { value: "52.9%", label: "of Pakistan's population lives in Punjab (127.7 Mn)", source: "Census 2023" },
      { value: "33 Mn", label: "people affected by the 2022 floods across the Indus basin", source: "NDMA" },
      { value: "439", label: "bridges and 13,115 km of roads damaged in 2022", source: "NDMA" },
      { value: "223", label: "deaths in Punjab in the 2022 floods, incl. hill torrents around Taunsa", source: "NDMA" },
    ],
  },
  "desert-arid": {
    hazards: [
      { id: "heat", label: "Extreme heat", icon: "Thermometer" },
      { id: "drought", label: "Drought & water scarcity", icon: "Droplets" },
      { id: "flash-flood", label: "Flash floods in dry riverbeds", icon: "CloudRain" },
      { id: "dust", label: "Dust storms", icon: "Wind" },
    ],
    facts: [
      { value: "53.7 °C", label: "at Turbat on 28 May 2017, Pakistan's highest recorded temperature", source: "World Meteorological Organization" },
      { value: "53.5 °C", label: "at Mohenjo-daro on 26 May 2010", source: "Pakistan Meteorological Department" },
      { value: "63.6%", label: "of houses in Balochistan are kacha; 61% have mud or unbaked-brick walls", source: "Census 2023" },
      { value: "426,897", label: "houses damaged or destroyed in Balochistan in the 2022 floods", source: "NDMA" },
    ],
  },
  coastal: {
    hazards: [
      { id: "cyclone", label: "Tropical cyclones", icon: "Wind" },
      { id: "surge", label: "Storm surge & sea intrusion", icon: "Waves" },
      { id: "tsunami", label: "Tsunami (Makran subduction zone)", icon: "Activity" },
      { id: "heat", label: "Humid heatwaves", icon: "Thermometer" },
      { id: "erosion", label: "Coastal erosion", icon: "Shrink" },
    ],
    facts: [
      { value: "~1,000 km", label: "coastline shared by Sindh and Balochistan", source: "Coastal resources handbook (MFF Pakistan)" },
      { value: "98,128 ha", label: "of mangroves, 94% of them in the Indus Delta", source: "National mangrove cover assessment" },
      { value: "81,935", label: "people evacuated ahead of Cyclone Biparjoy in 2023", source: "Ministry of Climate Change" },
      { value: "Mw 8.1", label: "1945 Makran earthquake, which generated a tsunami along the coast", source: "Seismic records" },
    ],
  },
};
