export type RouteReport = {
  index: number;
  score: number;
  summary: string;
  notes: string[];
};

export type RouteWeatherResult = {
  reports: RouteReport[];
  best: number | null;
  reason: string;
};

type Current = {
  temperature_2m: number;
  precipitation: number;
  snowfall: number;
  weather_code: number;
  wind_speed_10m: number;
};

function sampleLine(line: [number, number][], count = 5) {
  if (line.length === 0) return [];
  const steps = Math.min(count, line.length);
  const picked: { lon: number; lat: number }[] = [];
  const seen = new Set<number>();
  for (let step = 0; step < steps; step++) {
    const index = steps === 1 ? 0 : Math.round((step * (line.length - 1)) / (steps - 1));
    if (seen.has(index)) continue;
    seen.add(index);
    const [lon, lat] = line[index];
    picked.push({ lon, lat });
  }
  return picked;
}

function condition(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Snow";
  if (code >= 95) return "Thunderstorm";
  return "Mixed";
}

function pointRisk(current: Current) {
  let risk = 0;
  const notes: string[] = [];
  const code = current.weather_code;
  const snow = (code >= 71 && code <= 77) || code === 85 || code === 86 || current.snowfall > 0.1;
  const rain =
    (code >= 61 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    code >= 95 ||
    (code >= 53 && code <= 55) ||
    current.precipitation >= 0.3;
  if (snow) {
    risk += 60 + Math.min(30, current.snowfall * 8);
    notes.push("snow");
  } else if (rain) {
    risk += 28 + Math.min(18, current.precipitation * 4);
    notes.push(code >= 95 ? "thunderstorms" : "rain");
  } else if (code === 45 || code === 48) {
    risk += 22;
    notes.push("fog");
  }
  if (current.temperature_2m <= 0) {
    risk += 24;
    notes.push("freezing temperatures");
  } else if (current.temperature_2m <= 2) {
    risk += 10;
    notes.push("near-freezing temperatures");
  }
  if (current.wind_speed_10m >= 50) {
    risk += 22;
    notes.push("high wind");
  } else if (current.wind_speed_10m >= 35) {
    risk += 10;
    notes.push("strong wind");
  }
  return { risk, notes };
}

function describe(points: Current[], seasonal: boolean): { summary: string; notes: string[]; score: number } {
  const risks = points.map(pointRisk);
  const temps = points.map((point) => point.temperature_2m);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  let worst = 0;
  risks.forEach((item, index) => {
    const colder = points[index].temperature_2m < points[worst].temperature_2m;
    if (item.risk > risks[worst].risk || (item.risk === risks[worst].risk && colder)) worst = index;
  });
  const mean = risks.reduce((sum, item) => sum + item.risk, 0) / risks.length;
  let score = risks[worst].risk + mean * 0.25;
  const notes = [...new Set(risks.flatMap((item) => item.notes))];
  if (seasonal && (min <= 2 || notes.includes("snow"))) {
    score += 16;
    if (!notes.includes("a high seasonal pass")) notes.push("a high seasonal pass");
  }
  const span = Math.round(min) === Math.round(max) ? `${Math.round(min)}°C` : `${Math.round(max)}°C to ${Math.round(min)}°C`;
  const wind = Math.round(Math.max(...points.map((point) => point.wind_speed_10m)));
  const summary = `${span} · ${condition(points[worst].weather_code)} · wind ${wind} km/h`;
  return { summary, notes, score };
}

export async function loadRouteWeather(
  lines: [number, number][][],
  seasonal: boolean[],
  signal?: AbortSignal,
): Promise<RouteWeatherResult> {
  const groups = lines.map((line) => sampleLine(line));
  const flat = groups.flat();
  if (flat.length === 0) return { reports: [], best: null, reason: "" };

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", flat.map((point) => point.lat.toFixed(4)).join(","));
  url.searchParams.set("longitude", flat.map((point) => point.lon.toFixed(4)).join(","));
  url.searchParams.set("current", "temperature_2m,precipitation,snowfall,weather_code,wind_speed_10m");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Weather ${response.status}`);
  const payload = (await response.json()) as { current?: Current } | { current?: Current }[];
  const rows = Array.isArray(payload) ? payload : [payload];
  if (rows.length !== flat.length || rows.some((row) => !row.current)) throw new Error("Weather response was incomplete");

  let cursor = 0;
  const reports: RouteReport[] = groups.map((group, index) => {
    const points = rows.slice(cursor, cursor + group.length).map((row) => row.current as Current);
    cursor += group.length;
    if (points.length === 0) return { index, score: 999, summary: "No sample on this road", notes: [] };
    const described = describe(points, seasonal[index] ?? false);
    return { index, ...described };
  });

  if (reports.length < 2) return { reports, best: reports[0]?.index ?? null, reason: "" };

  const ranked = [...reports].sort((a, b) => a.score - b.score || Number(seasonal[a.index]) - Number(seasonal[b.index]));
  const best = ranked[0];
  const others = ranked.slice(1);
  const problems = [...new Set(others.flatMap((item) => item.notes))];
  const close = others.every((item) => item.score - best.score < 6);
  const reason = close
    ? "Conditions are close. This is the steadier highway."
    : problems.length > 0
      ? `The other ${others.length > 1 ? "corridors have" : "corridor has"} ${problems.join(", ")}.`
      : "This road is calmer along its length.";

  return { reports, best: best.index, reason };
}
