import { cache } from "react";
import {
  buildSegments,
  challenges,
  landscape,
  summary,
  type PendingTable,
  type RecommendationContent,
  type Segment,
  type TextBlock,
} from "./pria";

/**
 * Shape served by the PRIA API (`GET /api/content`). Mirrors `backend/src/schema.ts`.
 * Every field is optional so a partially filled document is valid.
 */
export type ContentOverrides = {
  version: 1;
  updatedAt?: string;
  recommendations?: RecommendationContent;
  /** tableId → region → columnId → cell value (null = pending). */
  tables?: Record<string, Record<string, Record<string, string | null>>>;
  /** summary page id → paragraphs. */
  summary?: Record<string, string[]>;
};

export const CONTENT_TAG = "pria-content";

const revalidateSeconds = Number(process.env.CONTENT_REVALIDATE_SECONDS ?? 300);

async function fetchOverrides(): Promise<ContentOverrides | null> {
  const base = process.env.PRIA_API_URL;
  if (!base) return null;

  try {
    const res = await fetch(new URL("/api/content", base), {
      next: { revalidate: revalidateSeconds, tags: [CONTENT_TAG] },
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`PRIA API responded with ${res.status}`);
    return (await res.json()) as ContentOverrides;
  } catch (error) {
    // A failed build should still ship the local content; at runtime, throwing makes ISR keep the last good page.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.warn(`[pria] Content API unavailable during build, using local content: ${String(error)}`);
      return null;
    }
    throw error;
  }
}

function applyTable(table: PendingTable, cells?: Record<string, Record<string, string | null>>): PendingTable {
  if (!cells) return table;
  const rows = table.rows.map((row) => {
    const remote = cells[row.region] ?? {};
    const merged = { ...row.cells };
    for (const col of table.columns) {
      if (col.id in remote) merged[col.id] = remote[col.id] ?? null;
    }
    return { ...row, cells: merged };
  });
  const hasData = rows.some((r) => Object.values(r.cells).some((v) => v !== null && v !== ""));
  return { ...table, rows, status: hasData ? "available" : "pending" };
}

function applySummary(blocks: typeof summary, remote?: Record<string, string[]>): typeof summary {
  if (!remote) return blocks;
  const result = { ...blocks };
  for (const key of Object.keys(result) as (keyof typeof summary)[]) {
    const paragraphs = remote[key];
    if (paragraphs && paragraphs.length > 0) {
      result[key] = { ...result[key], paragraphs, status: "available" } satisfies TextBlock;
    }
  }
  return result;
}

export type PriaContent = {
  segments: Segment[];
  provinceTable: PendingTable;
  projectedTable: PendingTable;
  summary: typeof summary;
  updatedAt?: string;
};

/** Local content merged with the API's content. Deduplicated per request. */
export const getPriaContent = cache(async (): Promise<PriaContent> => {
  const remote = await fetchOverrides();
  return {
    segments: buildSegments(remote?.recommendations),
    provinceTable: applyTable(landscape.provinceTable, remote?.tables?.[landscape.provinceTable.id]),
    projectedTable: applyTable(challenges.projectedTable, remote?.tables?.[challenges.projectedTable.id]),
    summary: applySummary(summary, remote?.summary),
    updatedAt: remote?.updatedAt,
  };
});

export async function getContentSegment(slug: string): Promise<Segment | undefined> {
  return (await getPriaContent()).segments.find((s) => s.slug === slug);
}
