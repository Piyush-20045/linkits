"use client";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeCategoryValue } from "@/constants/categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Tool } from "@/types/tool";
import ToolCard from "@/components/ui/toolcard";
import Categories from "./_components/categories";

export default function Directory() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const categoryFromQuery = searchParams.get("category");
    setSelectedCategory(normalizeCategoryValue(categoryFromQuery));
  }, [searchParams]);

  // Fetch tools
  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("/api/tools");
        const data = await res.json();
        setTools(data);
      } catch (error) {
        console.error("Failed to fetch tools", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  // Filter logic
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
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
  }, [tools, search, selectedCategory]);

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="my-10">
          <h1 className="text-4xl mb-2 text-gray-900 dark:text-white">
            Directory
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore curated developer resources.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            {/* Search */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                Search
              </h3>
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Categories */}
            <Categories
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          {/* Results */}
          <main className="flex-1">
            {loading ? (
              <p className="text-gray-500">Loading tools...</p>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredTools.length} results
                </div>

                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
