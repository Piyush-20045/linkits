"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ui/toolcard";
import ToolCardSkeleton from "@/components/ui/toolcard-skeleton";
import { Tool } from "@/types/tool";
import ToolsFilter from "./_components/tools-filter";
import { DashboardEmptyState } from "./_components/dashboard-empty-state";
import { DashboardHeader } from "./_components/dashboard-header";
import { ArrowRightIcon, Folders, Plus } from "lucide-react";

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
        <DashboardHeader tools={tools} />

        {/* Filter section */}
        <ToolsFilter isSelected={isSelected} setIsSelected={setIsSelected} />

        {/* SAVED TOOLS && PERSONAL COLLECTIONS && SAVED COLLECTIONS */}
        {isSelected === "tools" ? (
          // 1. SAVED TOOLS
          <div>
            {loading ? (
              // if tools are loading
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
              // if 0 tools are there
              <section className="mt-10 rounded-xl border border-dashed border-black/15 bg-gray-50 px-6 py-16 text-center dark:border-white/15 dark:bg-neutral-950">
                <h2 className="text-2xl font-semibold">No saved tools yet</h2>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Bookmark tools from the directory to see them here.
                </p>

                <Link href="/directory" className="mt-6 inline-block">
                  <Button variant="secondary">Browse directory</Button>
                </Link>
              </section>
            ) : (
              // all saved tools
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
            )}
          </div>
        ) : isSelected === "personal-collections" ? (
          // 2. PERSONAL COLLECTIONS
          <div>
            {tools.length !== 0 ? (
              // if 0 collections are there
              <DashboardEmptyState
                icon={Folders}
                heading="No collections created yet"
                description="Create private collections to keep your favorite tools organized."
                primaryBtn={{
                  href: "/create-collections",
                  label: "Create a collection",
                  icon: <Plus />,
                }}
              />
            ) : (
              <div>
                These are the personal collections..
              </div>
            )}
          </div>
        ) : (
          // 3. SAVED COLLECTIONS
          <div>
            {tools.length !== 0 ? (
              // if 0 collections are there
              <DashboardEmptyState
                icon={Folders}
                heading="No collections saved yet"
                description="Save curated pre-made collections for different specific tasks."
                primaryBtn={{
                  href: "/directory",
                  label: "Browse collections",
                  icon: <ArrowRightIcon />,
                }}
              />
            ) : (
              <div>this is the saved collections</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
