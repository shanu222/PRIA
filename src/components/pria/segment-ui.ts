import type { InfraCategory, Segment } from "@/data/pria";

/** Glass panel tinted by the surrounding `--seg` colour. */
export const segGlass =
  "rounded-2xl border border-[color-mix(in_srgb,var(--seg)_38%,hsl(var(--border)))] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--seg)_11%,hsl(var(--card)))_0%,hsl(var(--card))_65%)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--seg)_10%,transparent),0_0_30px_-14px_var(--seg),inset_0_1px_0_rgba(255,255,255,0.06)]";

/** Smaller bordered tile inside a glass panel. */
export const segTile =
  "rounded-xl border border-[color-mix(in_srgb,var(--seg)_24%,hsl(var(--border)))] bg-[color-mix(in_srgb,var(--seg)_5%,hsl(var(--card)))]";

/** Number / code chip with a 3D segment-coloured face. */
export const segChip =
  "bg-gradient-to-b from-[color-mix(in_srgb,var(--seg)_70%,white)] to-[var(--seg-strong)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_2px_0_color-mix(in_srgb,var(--seg-strong)_60%,black),0_0_14px_-3px_var(--seg)]";

const RESIDENTIAL_PHOTOS: Record<string, string[]> = {
  mountain: ["timber", "masonry", "slope"],
  "riverine-plains": ["elevated", "masonry", "earth"],
  "desert-arid": ["earth", "masonry", "frame"],
  coastal: ["elevated", "frame", "masonry"],
};

const MATERIAL_PHOTO_COUNT: Record<string, number> = {
  mountain: 3,
  "riverine-plains": 3,
  "desert-arid": 3,
  coastal: 2,
};

const materialPhoto = (segmentId: string, n: number) => `/recs/${segmentId}-residential-material-options-${n}.jpg`;

/** Photo shown next to the category title. */
export function categoryPhoto(segment: Segment, category: InfraCategory) {
  return category.id === "residential"
    ? materialPhoto(segment.id, 1)
    : `/infra/${segment.id}-${category.id}-build.jpg`;
}

/** Photo for one recommendation; varies across items and sub-sections. */
export function recommendationPhoto(segment: Segment, category: InfraCategory, subIndex: number, itemIndex: number) {
  if (category.id === "residential" && subIndex === 0 && itemIndex < (MATERIAL_PHOTO_COUNT[segment.id] ?? 0)) {
    return materialPhoto(segment.id, itemIndex + 1);
  }
  const pool =
    category.id === "residential"
      ? [
          ...(RESIDENTIAL_PHOTOS[segment.id] ?? []).map((name) => `/construction/${name}.jpg`),
          ...Array.from({ length: MATERIAL_PHOTO_COUNT[segment.id] ?? 0 }, (_, i) => materialPhoto(segment.id, i + 1)),
          `/segments/${segment.slug}.jpg`,
        ]
      : [
          `/infra/${segment.id}-${category.id}-build.jpg`,
          `/infra/${segment.id}-${category.id}-design.jpg`,
          `/segments/${segment.slug}.jpg`,
        ];
  return pool[(subIndex * 2 + itemIndex) % pool.length];
}
