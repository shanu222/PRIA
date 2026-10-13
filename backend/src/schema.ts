import { z } from "zod";
import { categories, regions, segmentIds, summaryIds, tables } from "./structure.js";

export const recommendationItemSchema = z.object({
  id: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(500),
  description: z.string().trim().max(5000).optional(),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
});

export const itemsSchema = z
  .array(recommendationItemSchema)
  .max(200)
  .refine((items) => new Set(items.map((i) => i.id)).size === items.length, "Item ids must be unique");

const cellSchema = z.string().trim().max(500).nullable();
const tableRowsSchema = z.record(z.string(), z.record(z.string(), cellSchema));
const paragraphsSchema = z.array(z.string().trim().min(1).max(10_000)).max(100);

/** The single content document stored in R2. Mirrors `ContentOverrides` in the portal. */
export const contentSchema = z
  .object({
    version: z.literal(1),
    updatedAt: z.string().optional(),
    recommendations: z.record(z.string(), z.record(z.string(), z.record(z.string(), itemsSchema))).default({}),
    tables: z.record(z.string(), tableRowsSchema).default({}),
    summary: z.record(z.string(), paragraphsSchema).default({}),
  })
  .superRefine((doc, ctx) => {
    for (const [segment, cats] of Object.entries(doc.recommendations)) {
      if (!(segmentIds as readonly string[]).includes(segment)) {
        ctx.addIssue({ code: "custom", path: ["recommendations", segment], message: `Unknown segment "${segment}"` });
        continue;
      }
      for (const [category, subs] of Object.entries(cats)) {
        const allowed = categories[category];
        if (!allowed) {
          ctx.addIssue({ code: "custom", path: ["recommendations", segment, category], message: `Unknown category "${category}"` });
          continue;
        }
        for (const sub of Object.keys(subs)) {
          if (!allowed.includes(sub)) {
            ctx.addIssue({
              code: "custom",
              path: ["recommendations", segment, category, sub],
              message: `Unknown sub-section "${sub}" for ${category}`,
            });
          }
        }
      }
    }
    for (const [tableId, rows] of Object.entries(doc.tables)) {
      const issue = tableIssue(tableId, rows);
      if (issue) ctx.addIssue({ code: "custom", path: ["tables", tableId], message: issue });
    }
    for (const id of Object.keys(doc.summary)) {
      if (!(summaryIds as readonly string[]).includes(id)) {
        ctx.addIssue({ code: "custom", path: ["summary", id], message: `Unknown summary page "${id}"` });
      }
    }
  });

export type ContentDocument = z.infer<typeof contentSchema>;
export type TableRows = z.infer<typeof tableRowsSchema>;

export function tableIssue(tableId: string, rows: TableRows): string | null {
  const columns = tables[tableId];
  if (!columns) return `Unknown table "${tableId}"`;
  for (const [region, cells] of Object.entries(rows)) {
    if (!(regions as readonly string[]).includes(region)) return `Unknown region "${region}"`;
    for (const col of Object.keys(cells)) {
      if (!columns.includes(col)) return `Unknown column "${col}" for ${tableId}`;
    }
  }
  return null;
}

export const tableBodySchema = z.object({ rows: tableRowsSchema });
export const itemsBodySchema = z.object({ items: itemsSchema });
export const summaryBodySchema = z.object({ paragraphs: paragraphsSchema });

export function emptyDocument(): ContentDocument {
  return { version: 1, recommendations: {}, tables: {}, summary: {} };
}
