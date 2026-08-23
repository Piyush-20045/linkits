"use client";
import ToolCard from "@/components/ui/toolcard";
import ToolCardSkeleton from "@/components/ui/toolcard-skeleton";
import { DashboardEmptyState } from "../dashboard-empty-state";
import { ArrowRightIcon, ToolCase } from "lucide-react";
import { Tool } from "@/types/tool";

interface SavedToolsProps {
  tools: Tool[];
  loading: boolean;
  onToolRemoved: (toolId: string) => void;
  onToolRemoveFailed: (tool: Tool) => void;
}

const SavedTools = ({
  tools,
  loading,
  onToolRemoved,
  onToolRemoveFailed,
}: SavedToolsProps) => {
  return (
    <div>
      {loading ? (
        // If tools are loading
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
        // If 0 tools are there
        <DashboardEmptyState
          icon={ToolCase}
          heading="No saved tools yet"
          description="Bookmark tools from the directory to see them here."
          primaryBtn={{
            href: "/directory",
            label: "Browse tools",
            icon: <ArrowRightIcon />,
          }}
        />
      ) : (
        // All saved tools
        <section className="mt-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">Saved Tools</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              All tools you bookmarked from the directory.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool: Tool) => (
              <ToolCard
                key={tool._id}
                tool={tool}
                bookmarkMode="remove"
                onRemoved={() => onToolRemoved(tool._id)}
                onRemoveFailed={() => onToolRemoveFailed(tool)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SavedTools;
