"use client";

import { X } from "lucide-react";
import { getCategoryLabel } from "@/constants/categories";
import { PLATFORM_LABELS, type PlatformKey } from "./platform-menu";

export interface ActiveFilter {
  key: string;
  label: string;
  onClear: () => void;
}

export interface ActiveFilterState {
  selectedCategory: string;
  search: string;
  noSignupOnly: boolean;
  platform: PlatformKey;
  onClearCategory: () => void;
  onClearSearch: () => void;
  onClearNoSignup: () => void;
  onClearPlatform: () => void;
}

// Builds one removable pill per active filter.
export function buildActiveFilters(state: ActiveFilterState): ActiveFilter[] {
  const filters: ActiveFilter[] = [];

  if (state.selectedCategory !== "all") {
    filters.push({
      key: "category",
      label: getCategoryLabel(state.selectedCategory),
      onClear: state.onClearCategory,
    });
  }
  if (state.search.trim()) {
    filters.push({
      key: "search",
      label: `“${state.search.trim()}”`,
      onClear: state.onClearSearch,
    });
  }
  if (state.noSignupOnly) {
    filters.push({
      key: "signup",
      label: "No signup needed",
      onClear: state.onClearNoSignup,
    });
  }
  if (state.platform !== "all") {
    filters.push({
      key: "platform",
      label: PLATFORM_LABELS[state.platform],
      onClear: state.onClearPlatform,
    });
  }

  return filters;
}

// Removable pills reflecting exactly what is filtering the grid.
// Renders nothing when no filter is active.
export function FilterPill({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex max-w-48 items-center gap-1 rounded-full bg-gray-100 py-1 pr-1.5 pl-2.5 text-xs text-gray-600 transition-colors duration-150 ease-out hover:bg-gray-200 hover:text-gray-900 active:scale-[0.98] dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 dark:hover:text-white"
    >
      <span className="truncate">{label}</span>
      <X size={12} className="shrink-0 opacity-60" />
    </button>
  );
}

export function ActiveFilters({
  filters,
  onClearAll,
}: {
  filters: ActiveFilter[];
  onClearAll: () => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5">
      {filters.map((filter) => (
        <FilterPill
          key={filter.key}
          label={filter.label}
          onClear={filter.onClear}
        />
      ))}
      {filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="px-1 text-xs text-gray-400 underline-offset-2 transition-colors duration-150 ease-out hover:text-gray-900 hover:underline dark:text-gray-500 dark:hover:text-gray-200"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
