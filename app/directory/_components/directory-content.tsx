"use client";
import Navbar from "@/components/layout/navbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCategoryLabel, normalizeCategoryValue } from "@/constants/categories";
import { Tool } from "@/types/tool";
import Categories from "./categories";
import { DirectorySearch } from "./directory-search";
import { ActiveFilters, type ActiveFilter } from "./active-filters";
import { FilterChips, type TypeFilter } from "./filter-chips";
import { SortMenu, type SortKey } from "./sort-menu";
import { useSavedTools } from "./use-saved-tools";
import ToolCard from "@/components/tools/toolcard";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/footer";

interface DirectoryContentProps {
  tools: Tool[];
}

// Cards mounted at once. Small enough for instant theme switches and first
// paint, large enough to fill tall screens — the rest loads on scroll.
const PAGE_SIZE = 28;

export default function DirectoryContent({ tools }: DirectoryContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sort, setSort] = useState<SortKey>("newest");
  const [noSignupOnly, setNoSignupOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const selectedCategory = normalizeCategoryValue(searchParams.get("category"));

  const toolsWithSavedState = useSavedTools(status, tools);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tool of toolsWithSavedState) {
      const value = normalizeCategoryValue(tool.category);
      map[value] = (map[value] ?? 0) + 1;
    }
    return map;
  }, [toolsWithSavedState]);

  const filteredTools = useMemo(() => {
    return toolsWithSavedState.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" ||
        normalizeCategoryValue(tool.category) === selectedCategory;

      const matchesSignup = !noSignupOnly || tool.requiresSignup === "none";
      const matchesType = typeFilter === "all" || tool.type === typeFilter;

      return matchesSearch && matchesCategory && matchesSignup && matchesType;
    });
  }, [toolsWithSavedState, search, selectedCategory, noSignupOnly, typeFilter]);

  // Server already sends newest-first, so "newest" needs no re-sorting.
  const sortedTools = useMemo(() => {
    if (sort === "saved") {
      return [...filteredTools].sort(
        (a, b) => (b.saves ?? 0) - (a.saves ?? 0),
      );
    }
    if (sort === "az") {
      return [...filteredTools].sort((a, b) => a.title.localeCompare(b.title));
    }
    return filteredTools;
  }, [filteredTools, sort]);

  const visibleTools = useMemo(
    () => sortedTools.slice(0, visibleCount),
    [sortedTools, visibleCount],
  );
  const hasMore = visibleCount < sortedTools.length;

  // Auto-load the next page when the sentinel scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + PAGE_SIZE, sortedTools.length),
          );
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, sortedTools.length]);

  function resetVisible() {
    setVisibleCount(PAGE_SIZE);
  }

  function handleSortChange(value: string) {
    setSort(value as SortKey);
    resetVisible();
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleNoSignupChange(value: boolean) {
    setNoSignupOnly(value);
    resetVisible();
  }

  function handleTypeChange(value: TypeFilter) {
    setTypeFilter(value);
    resetVisible();
  }

  function handleClearFilters() {
    setSearch("");
    setNoSignupOnly(false);
    setTypeFilter("all");
    handleCategoryChange("all");
  }

  function handleCategoryChange(category: string) {
    resetVisible();
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (category === "all") {
      nextSearchParams.delete("category");
    } else {
      nextSearchParams.set("category", category);
    }

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  // Pills mirror the active filters; each clears just its own.
  const activeFilters: ActiveFilter[] = [];
  if (selectedCategory !== "all") {
    activeFilters.push({
      key: "category",
      label: getCategoryLabel(selectedCategory),
      onClear: () => handleCategoryChange("all"),
    });
  }
  if (search.trim()) {
    activeFilters.push({
      key: "search",
      label: `“${search.trim()}”`,
      onClear: () => {
        setSearch("");
        resetVisible();
      },
    });
  }
  if (noSignupOnly) {
    activeFilters.push({
      key: "signup",
      label: "No signup needed",
      onClear: () => handleNoSignupChange(false),
    });
  }
  if (typeFilter !== "all") {
    activeFilters.push({
      key: "type",
      label: typeFilter === "tool" ? "Tools only" : "Resources only",
      onClear: () => handleTypeChange("all"),
    });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main className="mx-auto mb-8 px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row">
          <aside className="w-full shrink-0 lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:w-61 lg:flex-col lg:border-r lg:border-neutral-600">
            {/* Search input */}
            <DirectorySearch
              value={search}
              onChange={(value) => {
                setSearch(value);
                resetVisible();
              }}
            />

            {/* Desktop categories — scrolls between search and submit */}
            <div className="hidden lg:block lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-4 lg:py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Categories
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                counts={categoryCounts}
                total={toolsWithSavedState.length}
              />
            </div>

            {/* Pinned submit */}
            {/* <div className="hidden lg:block lg:border-t lg:border-neutral-600">
              <Link href="/submit-tool">
                <Button variant="secondary" className="w-full cursor-pointer gap-2">
                  <Plus size={16} />
                  Submit Tool
                </Button>
              </Link>
            </div> */}
          </aside>

          <div className="min-w-0 flex-1">
            <h1 className="sr-only">Directory</h1>

            <div className="mt-6 mb-12 lg:my-6 lg:px-6" ref={resultsRef}>
              {/* Controls: sticky scroll row on mobile, plain row on desktop */}
              <div className="sticky top-16 z-30 -mx-4 border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none dark:border-neutral-800 dark:bg-black/95 dark:lg:bg-transparent">
                <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <FilterChips
                    noSignupOnly={noSignupOnly}
                    onNoSignupChange={handleNoSignupChange}
                    typeFilter={typeFilter}
                    onTypeChange={handleTypeChange}
                  />
                  <div className="ml-auto shrink-0">
                    <SortMenu sort={sort} onChange={handleSortChange} />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {visibleTools.length} of {filteredTools.length} results
                </p>
              </div>
              <ActiveFilters filters={activeFilters} onClearAll={handleClearFilters} />

              {/* Tools grid */}
              {filteredTools.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {visibleTools.map((tool) => (
                      <ToolCard key={tool._id} tool={tool} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-8 flex flex-col items-center gap-4">
                      <div
                        ref={sentinelRef}
                        className="h-1 w-1"
                        aria-hidden="true"
                      />
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setVisibleCount((count) =>
                            Math.min(count + PAGE_SIZE, sortedTools.length),
                          )
                        }
                      >
                        Load more ({sortedTools.length - visibleTools.length}{" "}
                        remaining)
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center dark:border-gray-700 dark:bg-neutral-900">
                  <h3 className="mb-2 font-serif text-xl text-gray-900 dark:text-white">
                    No tools found
                  </h3>
                  <p className="mb-4 text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filters.
                  </p>
                  <Button onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
