"use client";
import { useEffect, useState } from "react";
import ToolCard from "@/components/ui/toolcard";
import { Tool } from "@/types/tool";

export default function TrendingTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchTrendingTools() {
      try {
        const res = await fetch("/api/trending-tools", {
          cache: "no-store",
        });
        const data: Tool[] = await res.json();

        if (!cancelled) {
          setTools(data);
        }
      } catch (error) {
        console.error("Failed to fetch trending tools", error);

        if (!cancelled) {
          setTools([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTrendingTools();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-20 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            🔥 Trending Tools
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Popular picks developers are saving right now.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading trending tools...
          </p>
        ) : tools.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trending tools will appear here once people start saving them.
          </p>
        )}
      </div>
    </section>
  );
}
