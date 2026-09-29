import {
  MAIN_CATEGORIES as TOOL_LABELS,
  RESOURCE_CATEGORIES as RESOURCE_LABELS,
} from "@/types/tool";

// Only the current category system exists here — source of truth is
// types/tool.ts. `value` is a URL-safe slug of the label.
function toCategoryToken(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CategoryEntry {
  label: string;
  value: string;
  description: string;
}

function buildEntries(labels: readonly string[]): CategoryEntry[] {
  return labels.map((label) => ({
    label,
    value: toCategoryToken(label),
    description: `Explore ${label.toLowerCase()}`,
  }));
}

export const TOOL_CATEGORIES: CategoryEntry[] = buildEntries(TOOL_LABELS);
export const RESOURCE_CATEGORIES: CategoryEntry[] =
  buildEntries(RESOURCE_LABELS);

export const CATEGORIES: CategoryEntry[] = [
  ...TOOL_CATEGORIES,
  ...RESOURCE_CATEGORIES,
];

export function normalizeCategoryValue(category?: string | null) {
  if (!category) {
    return "all";
  }

  const token = toCategoryToken(category);

  if (token === "all") {
    return "all";
  }

  const match = CATEGORIES.find(
    (item) =>
      toCategoryToken(item.value) === token ||
      toCategoryToken(item.label) === token,
  );

  return match?.value ?? "all";
}

export function getCategoryLabel(category?: string | null) {
  const normalizedCategory = normalizeCategoryValue(category);
  const match = CATEGORIES.find((item) => item.value === normalizedCategory);

  return match?.label ?? category?.trim() ?? "";
}

export function getCategoryQueryValues(category?: string | null) {
  const normalizedCategory = normalizeCategoryValue(category);

  if (normalizedCategory === "all") {
    return [];
  }

  const label = getCategoryLabel(category);

  return [
    ...new Set([category?.trim(), normalizedCategory, label].filter(Boolean)),
  ];
}
