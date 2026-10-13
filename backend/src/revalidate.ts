import { env } from "./env.js";

export type RevalidateResult = { status: "skipped" | "ok" | "failed"; detail?: string };

/** Asks the Vercel portal to refresh cached pages after content changes. */
export async function revalidateFrontend(): Promise<RevalidateResult> {
  if (!env.FRONTEND_REVALIDATE_URL || !env.REVALIDATE_SECRET) return { status: "skipped" };
  try {
    const res = await fetch(env.FRONTEND_REVALIDATE_URL, {
      method: "POST",
      headers: { "x-revalidate-secret": env.REVALIDATE_SECRET },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: "failed", detail: `Frontend responded with ${res.status}` };
    return { status: "ok" };
  } catch (error) {
    return { status: "failed", detail: String(error) };
  }
}
