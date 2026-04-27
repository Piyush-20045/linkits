"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ui/toolcard";
import ToolCardSkeleton from "@/components/ui/toolcard-skeleton";
import { Tool } from "@/types/tool";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

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

  const user = session?.user;
  const userName = user?.name || "Your profile";
  const userEmail = user?.email || "Signed in with Google";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-neutral-950 sm:p-8">
          {status === "authenticated" ? (
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border border-gray-200 dark:border-gray-800">
                  <AvatarImage src={user?.image || ""} alt={userName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-2xl font-semibold">{userName}</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {userEmail}
                  </p>
                </div>
              </div>

              <p className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300">
                You have saved {tools.length} tools
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Your dashboard</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Sign in to view and manage your saved tools.
                </p>
              </div>

              <Link href="/login">
                <Button>Sign in</Button>
              </Link>
            </div>
          )}
        </section>

        {status === "authenticated" &&
          (loading ? (
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
            <section className="mt-10">
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
