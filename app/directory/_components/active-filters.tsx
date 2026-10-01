"use client";

import { X } from "lucide-react";

export interface ActiveFilter {
  key: string;
  label: string;
  onClear: () => void;
}

// Removable pills reflecting exactly what is filtering the grid.
// Renders nothing when no filter is active.
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
        <button
          key={filter.key}
          type="button"
          onClick={filter.onClear}
          className="inline-flex max-w-48 items-center gap-1 rounded-full bg-gray-100 py-1 pr-1.5 pl-2.5 text-xs text-gray-600 transition-colors duration-150 ease-out hover:bg-gray-200 hover:text-gray-900 active:scale-[0.98] dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 dark:hover:text-white"
        >
          <span className="truncate">{filter.label}</span>
          <X size={12} className="shrink-0 opacity-60" />
        </button>
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
