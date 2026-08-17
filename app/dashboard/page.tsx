"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Tool } from "@/types/tool";
import Navbar from "@/components/layout/navbar";
import DashboardHeader from "./_components/dashboard-header";
import ToolsFilter from "./_components/tools-filter";
import SavedTools from "./_components/main/saved-tools";
import PersonalCollections from "./_components/main/personal-collections";
import SavedCollections from "./_components/main/saved-collections";

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
          <SavedTools tools={tools} loading={loading} />
        ) : isSelected === "personal-collections" ? (
          // 2. PERSONAL COLLECTIONS
          <PersonalCollections tools={tools} />
        ) : (
          // 3. SAVED COLLECTIONS
          <SavedCollections tools={tools} />
        )}
      </main>
    </div>
  );
}
