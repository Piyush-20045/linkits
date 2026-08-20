"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Tool } from "@/types/tool";
import { Collection } from "@/types/collection";
import Navbar from "@/components/layout/navbar";
import DashboardHeader from "./_components/dashboard-header";
import ToolsFilter from "./_components/main/tools-filter";
import SavedTools from "./_components/main/saved-tools";
import PersonalCollections from "./_components/main/personal-collections";
import SavedCollections from "./_components/main/saved-collections";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tools, setTools] = useState<Tool[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState("tools");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setTools([]);
      setCollections([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchDashboardData() {
      setLoading(true);

      try {
        const [savedToolsRes, collectionsRes] = await Promise.all([
          fetch("/api/saved-tools", {
            cache: "no-store",
          }),
          fetch("/api/collections", {
            cache: "no-store",
          }),
        ]);

        const savedToolsData: Tool[] = await savedToolsRes.json();
        const collectionsData: Collection[] = collectionsRes.ok
          ? await collectionsRes.json()
          : [];

        if (!cancelled) {
          setTools(savedToolsData);
          setCollections(collectionsData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);

        if (!cancelled) {
          setTools([]);
          setCollections([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Dashboard Header (avatar and name) */}
        <DashboardHeader
          toolsCount={tools.length}
          personalCollectionsCount={collections.length}
          savedCollectionsCount={0}
        />

        {/* Filter section */}
        <ToolsFilter isSelected={isSelected} setIsSelected={setIsSelected} />

        {/* SAVED TOOLS && PERSONAL COLLECTIONS && SAVED COLLECTIONS */}
        {isSelected === "tools" ? (
          // 1. SAVED TOOLS
          <SavedTools tools={tools} loading={loading} />
        ) : isSelected === "personal-collections" ? (
          // 2. PERSONAL COLLECTIONS
          <PersonalCollections
            collections={collections}
            tools={tools}
            onCollectionCreated={(collection) =>
              setCollections((prev) => [collection, ...prev])
            }
          />
        ) : (
          // 3. SAVED COLLECTIONS
          <SavedCollections tools={tools} />
        )}
      </main>
    </div>
  );
}
