import { serve } from "@hono/node-server";
import { Hono, type MiddlewareHandler } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { z } from "zod";
import { corsOrigins, env } from "./env.js";
import { revalidateFrontend } from "./revalidate.js";
import {
  contentSchema,
  itemsBodySchema,
  summaryBodySchema,
  tableBodySchema,
  tableIssue,
  type ContentDocument,
} from "./schema.js";
import { store } from "./store.js";
import { categories, segmentIds, structure, summaryIds } from "./structure.js";

const app = new Hono();

app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "/api/*",
  cors({
    origin: corsOrigins,
    allowMethods: ["GET", "PUT", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  }),
);

const requireAdmin: MiddlewareHandler = async (c, next) => {
  if (!env.ADMIN_API_KEY) {
    throw new HTTPException(503, { message: "Writes are disabled: ADMIN_API_KEY is not configured" });
  }
  return bearerAuth({ token: env.ADMIN_API_KEY })(c, next);
};

const writeGuard = [bodyLimit({ maxSize: 1024 * 1024 }), requireAdmin] as const;

async function parseBody<T extends z.ZodType>(c: { req: { json: () => Promise<unknown> } }, schema: T): Promise<z.infer<T>> {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    throw new HTTPException(400, { message: "Request body must be valid JSON" });
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HTTPException(400, { message: z.prettifyError(result.error) });
  }
  return result.data;
}

async function saved(doc: ContentDocument) {
  const revalidation = await revalidateFrontend();
  if (revalidation.status === "failed") console.warn(`[pria] Frontend revalidation failed: ${revalidation.detail}`);
  return { ok: true, updatedAt: doc.updatedAt, revalidation };
}

/* ---------------------------------- Public --------------------------------- */

app.get("/", (c) => c.json({ name: "PRIA API", docs: "/api/structure", health: "/health" }));

app.get("/health", async (c) => {
  try {
    await store.check();
    return c.json({ ok: true, storage: store.driver });
  } catch (error) {
    console.error("[pria] Storage health check failed", error);
    return c.json({ ok: false, storage: store.driver }, 503);
  }
});

app.get("/api/structure", (c) => c.json(structure));

app.get("/api/content", async (c) => {
  const doc = await store.read();
  c.header("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  return c.json(doc);
});

/* ---------------------------------- Admin ---------------------------------- */

app.put("/api/content", ...writeGuard, async (c) => {
  const doc = await parseBody(c, contentSchema);
  const next = await store.update(() => doc);
  return c.json(await saved(next));
});

app.put("/api/recommendations/:segment/:category/:subSection", ...writeGuard, async (c) => {
  const { segment, category, subSection } = c.req.param();
  if (!(segmentIds as readonly string[]).includes(segment)) throw new HTTPException(404, { message: `Unknown segment "${segment}"` });
  if (!categories[category]) throw new HTTPException(404, { message: `Unknown category "${category}"` });
  if (!categories[category].includes(subSection)) {
    throw new HTTPException(404, { message: `Unknown sub-section "${subSection}" for ${category}` });
  }
  const { items } = await parseBody(c, itemsBodySchema);
  const next = await store.update((doc) => {
    const seg = (doc.recommendations[segment] ??= {});
    const cat = (seg[category] ??= {});
    if (items.length === 0) delete cat[subSection];
    else cat[subSection] = items;
  });
  return c.json(await saved(next));
});

app.put("/api/tables/:tableId", ...writeGuard, async (c) => {
  const { tableId } = c.req.param();
  const { rows } = await parseBody(c, tableBodySchema);
  const issue = tableIssue(tableId, rows);
  if (issue) throw new HTTPException(issue.startsWith("Unknown table") ? 404 : 400, { message: issue });
  const next = await store.update((doc) => {
    const table = (doc.tables[tableId] ??= {});
    for (const [region, cells] of Object.entries(rows)) {
      table[region] = { ...table[region], ...cells };
    }
  });
  return c.json(await saved(next));
});

app.put("/api/summary/:id", ...writeGuard, async (c) => {
  const { id } = c.req.param();
  if (!(summaryIds as readonly string[]).includes(id)) throw new HTTPException(404, { message: `Unknown summary page "${id}"` });
  const { paragraphs } = await parseBody(c, summaryBodySchema);
  const next = await store.update((doc) => {
    if (paragraphs.length === 0) delete doc.summary[id];
    else doc.summary[id] = paragraphs;
  });
  return c.json(await saved(next));
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    const message = error.message || (error.status === 401 ? "Unauthorized: invalid or missing API key" : "Request failed");
    const authenticate = error.getResponse().headers.get("WWW-Authenticate");
    if (authenticate) c.header("WWW-Authenticate", authenticate);
    return c.json({ error: message }, error.status);
  }
  console.error("[pria] Unhandled error", error);
  return c.json({ error: "Internal server error" }, 500);
});

const server = serve({ fetch: app.fetch, port: env.PORT, hostname: "0.0.0.0" }, (info) => {
  console.log(`[pria] API listening on http://localhost:${info.port} (storage: ${store.driver}, env: ${env.NODE_ENV})`);
  if (!env.ADMIN_API_KEY) console.warn("[pria] ADMIN_API_KEY is not set: write endpoints are disabled");
  if (env.NODE_ENV === "production" && store.driver === "file") {
    console.warn("[pria] STORAGE_DRIVER=file in production: content will be lost on redeploy. Use r2.");
  }
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
