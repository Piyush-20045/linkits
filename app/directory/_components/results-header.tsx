"use client";

import { getCategoryLabel } from "@/constants/categories";
import { ActiveFilters, buildActiveFilters } from "./features/active-filters";
import { NoSignupChip } from "./features/signup-chip";
import { PlatformMenu, type PlatformKey } from "./features/platform-menu";
import { SortMenu, type SortKey } from "./features/sort-menu";

export type { SortKey } from "./features/sort-menu";
export type { PlatformKey } from "./features/platform-menu";

export interface ResultsHeaderProps {
  sort: SortKey;
  onSortChange: (value: string) => void;
  noSignupOnly: boolean;
  onNoSignupChange: (value: boolean) => void;
  platform: PlatformKey;
  onPlatformChange: (value: string) => void;
  selectedCategory: string;
  search: string;
  visibleCount: number;
  totalCount: number;
  onClearCategory: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

// Bar 1 (sticky controls) + Bar 2 (heading + count) + removable pills.
export function ResultsHeader({
  sort,
  onSortChange,
  noSignupOnly,
  onNoSignupChange,
  platform,
  onPlatformChange,
  selectedCategory,
  search,
  visibleCount,
  totalCount,
  onClearCategory,
  onClearSearch,
  onClearAll,
}: ResultsHeaderProps) {
  const heading =
    selectedCategory === "all"
      ? "All Tools"
      : getCategoryLabel(selectedCategory);

  const activeFilters = buildActiveFilters({
    selectedCategory,
    search,
    noSignupOnly,
    platform,
    onClearCategory,
    onClearSearch,
    onClearNoSignup: () => onNoSignupChange(false),
    onClearPlatform: () => onPlatformChange("all"),
  });

  return (
    <>
      {/* Bar 1: controls — sticky with divider on all screens */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-6 lg:px-6 dark:border-neutral-800 dark:bg-black/95">
        <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NoSignupChip active={noSignupOnly} onChange={onNoSignupChange} />
          <div className="shrink-0">
            <PlatformMenu platform={platform} onChange={onPlatformChange} />
          </div>
          <div className="ml-auto shrink-0">
            <SortMenu sort={sort} onChange={onSortChange} />
          </div>
        </div>
      </div>

      {/* Bar 2: heading + result count */}
      <div className="mt-4 mb-4 flex items-center justify-between gap-3">
        <h2 className="truncate text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {heading}
        </h2>
        <p className="shrink-0 text-sm text-gray-500 tabular-nums dark:text-gray-400">
          Showing {visibleCount} of {totalCount} results
        </p>
      </div>

      <ActiveFilters filters={activeFilters} onClearAll={onClearAll} />
    </>
  );
}
