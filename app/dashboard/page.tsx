"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ui/toolcard";
import ToolCardSkeleton from "@/components/ui/toolcard-skeleton";
import { Tool } from "@/types/tool";
import ToolsFilter from "./_components/tools-filter";
import { DashboardHeader } from "./_components/dashboard-header";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState("tools");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setTools([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSavedTools() {
      setLoading(true);

      try {
        const res = await fetch("/api/saved-tools", {
          cache: "no-store",
        });
        const data: Tool[] = await res.json();

        if (!cancelled) {
          setTools(data);
        }
      } catch (error) {
        console.error("Failed to fetch saved tools", error);

        if (!cancelled) {
          setTools([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSavedTools();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Dashboard Header (avatar and name) */}
        <DashboardHeader tools={tools}/>

        {/* Filter section */}
        <ToolsFilter isSelected={isSelected} setIsSelected={setIsSelected} />

        {/* SAVED TOOLS && PERSONAL COLLECTIONS && SAVED COLLECTIONS */}
        {isSelected === "tools" ? (
          // 1. SAVED TOOLS
          <div>
            {loading ? (
              // IF TOOLS ARE LOADING
              <section className="mt-10">
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold">Saved Tools</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    All tools you bookmarked from the directory.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <ToolCardSkeleton count={6} />
                </div>
              </section>
            ) : tools.length === 0 ? (
              // IF 0 TOOLS ARE THERE
              <section className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center dark:border-gray-700 dark:bg-neutral-950">
                <h2 className="text-2xl font-semibold">No saved tools yet</h2>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Bookmark tools from the directory to see them here.
                </p>

                <Link href="/directory" className="mt-6 inline-block">
                  <Button variant="secondary">Browse directory</Button>
                </Link>
              </section>
            ) : (
              // ALL SAVED TOOLS
              <section className="mt-6">
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold">Saved Tools</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    All tools you bookmarked from the directory.
                  </p>
                </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool._id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
      </main>
    </div>
  );
}
