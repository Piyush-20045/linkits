export const CATEGORIES = [
  { label: "Jobs & Career", value: "jobs", description: "Find your next role" },
  {
    label: "Interview Prep",
    value: "interview",
    description: "Ace the technical interview",
  },
  {
    label: "AI Tools",
    value: "ai",
    description: "Leverage AI in your workflow",
  },
  {
    label: "Developer Tools",
    value: "utilities",
    description: "Helpers and converters",
  },
  {
    label: "UI / Frontend Resources",
    value: "ui",
    description: "Design inspiration and libraries",
  },
  {
    label: "Free Courses",
    value: "courses",
    description: "Courses and tutorials",
  },
] as const;

const CATEGORY_ALIASES: Record<string, string> = {
  learning: "courses",
  "jobs-and-career": "jobs",
};

function toCategoryToken(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCategoryValue(category?: string | null) {
  if (!category) {
    return "all";
  }

  const token = toCategoryToken(category);

  if (token === "all") {
    return "all";
  }

  const alias = CATEGORY_ALIASES[token];

  if (alias) {
    return alias;
  }

  const match = CATEGORIES.find(
    (item) =>
      toCategoryToken(item.value) === token || toCategoryToken(item.label) === token,
  );

  return match?.value ?? category.trim();
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

  return [...new Set([category?.trim(), normalizedCategory, label].filter(Boolean))];
}
