"use client";

import { useEffect, useMemo, useState } from "react";
import { Tool } from "@/types/tool";

// Merges the viewer's saved state into the directory list.
// Returns the tools unchanged for logged-out visitors.
export function useSavedTools(status: string, tools: Tool[]): Tool[] {
  const [savedTools, setSavedTools] = useState<Tool[]>([]);

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

  return useMemo(() => {
    if (status !== "authenticated") {
      return tools.map((tool) => ({ ...tool, saved: false }));
    }

    const savedMap = new Map(savedTools.map((tool) => [String(tool._id), tool]));

    return tools.map((tool) => {
      const savedTool = savedMap.get(String(tool._id));
      if (!savedTool) {
        return { ...tool, saved: false };
      }
      return { ...tool, saved: true, saves: savedTool.saves ?? tool.saves };
    });
  }, [tools, savedTools, status]);
}
