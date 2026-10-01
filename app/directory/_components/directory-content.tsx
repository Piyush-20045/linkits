"use client";
import Navbar from "@/components/layout/navbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { normalizeCategoryValue } from "@/constants/categories";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Tool } from "@/types/tool";
import Categories from "./categories";
import ToolCard from "@/components/tools/toolcard";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/footer";

interface DirectoryContentProps {
  tools: Tool[];
}

// Cards mounted at once. Small enough for instant theme switches and first
// paint, large enough to fill tall screens — the rest loads on scroll.
const PAGE_SIZE = 28;

type SortKey = "newest" | "saved" | "az";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  saved: "Most Saved",
  az: "A–Z",
};

export default function DirectoryContent({ tools }: DirectoryContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const { status } = useSession();

  const [search, setSearch] = useState("");
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sort, setSort] = useState<SortKey>("newest");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const selectedCategory = normalizeCategoryValue(searchParams.get("category"));

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    async function fetchSavedTools() {
      try {
        const res = await fetch("/api/saved-tools", {
          cache: "no-store",
        });
        const data: Tool[] = await res.json();

        if (!cancelled) {
          setSavedTools(data);
        }
      } catch (error) {
        console.error("Failed to fetch saved tools", error);
      }
    }

    fetchSavedTools();

    return () => {
      cancelled = true;
    };
  }, [status]);

  const savedToolsMap = useMemo(() => {
    return new Map(savedTools.map((tool) => [String(tool._id), tool]));
  }, [savedTools]);

  const toolsWithSavedState = useMemo(() => {
    return tools.map((tool) => {
      if (status !== "authenticated") {
        return {
          ...tool,
          saved: false,
        };
      }

      const savedTool = savedToolsMap.get(String(tool._id));

      if (!savedTool) {
        return {
          ...tool,
          saved: false,
        };
      }

      return {
        ...tool,
        saved: true,
        saves: savedTool.saves ?? tool.saves,
      };
    });
  }, [tools, savedToolsMap, status]);

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

      return matchesSearch && matchesCategory;
    });
  }, [toolsWithSavedState, search, selectedCategory]);

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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main className="mx-auto mb-8 px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row">
          <aside className="w-full shrink-0 lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:w-61 lg:flex-col lg:border-r lg:border-neutral-600">
            {/* Search input — Enter submits for analytics; filtering stays live */}
            <form
              className="relative mt-4 overflow-hidden rounded-md lg:mx-4 lg:mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
                  search.trim().length > 0
                ) {
                  posthog.capture("search_used", {
                    query_length: search.trim().length,
                  });
                }
              }}
            >
              <ShineBorder
                shineColor={theme.theme === "dark" ? "white" : "black"}
              />
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetVisible();
                }}
              />
            </form>

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
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {visibleTools.length} of {filteredTools.length} results
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shrink-0 cursor-pointer gap-2"
                    >
                      <ArrowUpDown size={14} />
                      {SORT_LABELS[sort]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={handleSortChange}
                    >
                      {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                        <DropdownMenuRadioItem key={key} value={key}>
                          {SORT_LABELS[key]}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
                  <Button
                    onClick={() => {
                      setSearch("");
                      handleCategoryChange("all");
                    }}
                  >
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
