import { getSegment, pages, type PageMeta } from "@/data/pria";

/** Finds the page whose href is the longest prefix of `pathname`. */
export function matchPage(pathname: string): PageMeta | undefined {
  if (pathname === "/") return pages[0];
  let best: PageMeta | undefined;
  for (const page of pages) {
    if (page.href === "/") continue;
    if (pathname === page.href || pathname.startsWith(`${page.href}/`)) {
      if (!best || page.href.length > best.href.length) best = page;
    }
  }
  return best;
}

export function getPrevNext(pathname: string): { prev?: PageMeta; next?: PageMeta } {
  const current = matchPage(pathname);
  if (!current) return {};
  const index = pages.findIndex((p) => p.id === current.id);
  return { prev: pages[index - 1], next: pages[index + 1] };
}

export type Crumb = { label: string; href?: string };

export function getBreadcrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "PRIA", href: "/" }];
  if (pathname === "/") return [{ label: "PRIA" }, { label: "Overview" }];

  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "segments") {
    crumbs.push({ label: "Regional Segments", href: "/segments" });
    const segment = parts[1] ? getSegment(parts[1]) : undefined;
    if (segment) {
      crumbs.push({ label: `Segment ${segment.number}: ${segment.shortTitle}`, href: `/segments/${segment.slug}` });
      const category = parts[2] ? segment.categories.find((c) => c.id === parts[2]) : undefined;
      if (category) crumbs.push({ label: category.shortTitle });
    }
  } else {
    const page = matchPage(pathname);
    if (page) {
      crumbs.push({ label: page.eyebrow });
      crumbs.push({ label: page.navLabel });
    }
  }

  const last = crumbs[crumbs.length - 1];
  return crumbs.map((c) => (c === last ? { label: c.label } : c));
}
