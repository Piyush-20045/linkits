"use client";
import Navbar from "@/components/layout/navbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { normalizeCategoryValue } from "@/constants/categories";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Tool } from "@/types/tool";
import Categories from "./categories";
import ToolCard from "@/components/tools/toolcard";
import { useSession } from "next-auth/react";
import Footer from "@/components/layout/footer";

interface DirectoryContentProps {
  tools: Tool[];
}

export default function DirectoryContent({ tools }: DirectoryContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const { status } = useSession();

  const [search, setSearch] = useState("");
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
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

  function handleCategoryChange(category: string) {
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

      <main className="mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-16 lg:max-h-[calc(100vh-6rem)] lg:w-56 lg:self-start lg:overflow-y-auto">
            <div className="mt-8 mb-4">
              <h1 className="mb-2 text-3xl text-gray-900 dark:text-white">
                Directory
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Explore curated developer resources.
              </p>
            </div>

            {/* Search input */}
            <div className="relative overflow-hidden">
              <ShineBorder
                shineColor={theme.theme === "dark" ? "white" : "black"}
              />
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Desktop categories */}
            <div className="hidden lg:block">
              <Categories
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">

            {/* Mobile categories */}
            <div className="sticky top-16 z-40 -mx-4 border-b border-neutral-300 dark:border-neutral-800 bg-white/95 px-4 py-2 backdrop-blur-md dark:bg-black/95 sm:-mx-6 sm:px-6 lg:hidden">
              <Categories
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            <div className="mt-6 mb-12 lg:my-10">
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredTools.length} results
              </div>

              {/* Tools grid */}
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {filteredTools.map((tool) => (
                    <ToolCard key={tool._id} tool={tool} />
                  ))}
                </div>
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
