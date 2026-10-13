import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/data/content";

function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by the PRIA API after content changes so pages refresh immediately. */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return Response.json({ error: "Revalidation is not configured" }, { status: 503 });
  }
  if (!secretMatches(request.headers.get("x-revalidate-secret"), expected)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG);
  return Response.json({ revalidated: true, tag: CONTENT_TAG, at: new Date().toISOString() });
}
