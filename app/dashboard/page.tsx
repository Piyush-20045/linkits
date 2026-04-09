"use client";
import { ArrowRight, Bookmark, Grid2X2, LogIn, Tags } from "lucide-react";
import { DashboardEmptyState } from "./_components/dashboard-empty-state";
import { DashboardHero } from "./_components/dashboard-hero";
import { DashboardStat, DashboardStats } from "./_components/dashboard-stats";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/navbar";
import ToolCard from "@/components/ui/toolcard";
import { useSession } from "next-auth/react";
import { Tool } from "@/types/tool";

export default function Dashboard() {
  const { status } = useSession();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until auth state settles so we can show the right empty state.
    if (status === "loading") {
      return;
    }

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

  const stats = useMemo<DashboardStat[]>(() => {
    // These quick stats help summarize the collection without extra API calls.
    const categories = new Set(tools.map((tool) => tool.category));
    const tags = new Set(tools.flatMap((tool) => tool.tags));

    return [
      {
        label: "Saved tools",
        value: tools.length,
        icon: Bookmark,
      },
      {
        label: "Categories",
        value: categories.size,
        icon: Grid2X2,
      },
    ];
  }, [tools]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f4_52%,#fafaf9_100%)] text-black dark:bg-[linear-gradient(180deg,#050505_0%,#090909_50%,#0f0f0f_100%)] dark:text-white">
      <Navbar />

      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-112 bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(120,113,108,0.12),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(163,163,163,0.10),transparent_24%)]" />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <DashboardHero showSignInAction={status !== "authenticated"} />
            <DashboardStats stats={stats} />
          </section>

          <section className="mt-10 rounded-[2rem] border border-black/10 bg-white/65 p-6 shadow-[0_24px_90px_-58px_rgba(0,0,0,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="mb-8 flex flex-col gap-3 border-b border-black/10 pb-6 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-black/45 dark:text-white/45">
                  Your collection
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black dark:text-white">
                  Saved tools
                </h2>
              </div>

              <p className="text-sm text-black/55 dark:text-white/55">
                {status === "authenticated"
                  ? `${tools.length} saved ${tools.length === 1 ? "tool" : "tools"} ready to revisit.`
                  : "Sign in to sync and manage your saved resources."}
              </p>
            </div>

            {loading ? (
              <DashboardSkeleton />
            ) : status !== "authenticated" ? (
              <DashboardEmptyState
                icon={Bookmark}
                title="Sign in to see your saved tools"
                description="Your dashboard becomes useful once your bookmarks are synced to your account. After signing in, every saved tool will show up here automatically."
                primaryAction={{
                  href: "/login",
                  label: "Sign in",
                  icon: <LogIn />,
                }}
                secondaryAction={{
                  href: "/directory",
                  label: "Explore tools",
                }}
              />
            ) : tools.length === 0 ? (
              <DashboardEmptyState
                icon={Grid2X2}
                title="Your dashboard is ready for the first save"
                description="Bookmark tools from the directory and they will appear here as a focused list you can quickly return to later."
                primaryAction={{
                  href: "/directory",
                  label: "Browse directory",
                  icon: <ArrowRight />,
                }}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool._id} tool={tool} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
