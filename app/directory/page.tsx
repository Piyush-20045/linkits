"use client";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

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
    label: "Learning",
    value: "learning",
    description: "Courses and tutorials",
  },
  {
    label: "Dev Utilities",
    value: "utilities",
    description: "Helpers and converters",
  },
  {
    label: "UI / Frontend",
    value: "ui",
    description: "Design inspiration and libraries",
  },
];

const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState([]);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("category");
  const [selectedPricing, setSelectedPricing] = useState("all");

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="my-8">
          <h1 className="text-4xl mb-4 text-gray-900 dark:text-white">
            Directory
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Explore our complete collection of developer resources.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Search
              </h3>
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors ${selectedCategory === "all" ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`block w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors ${selectedCategory === cat.value ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Directory;
