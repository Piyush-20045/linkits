import { Collection } from "@/types/collection";
import { Tool } from "@/types/tool";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/tools/toolcard";
import Link from "next/link";

type CollectionToolsViewProps = {
  collection: Collection;
  tools: Tool[];
  loading?: boolean;
  onBack: () => void;
  onToolRemoved: (toolId: string) => void;
  onToolRemoveFailed: (toolId: string) => void;
};

export default function CollectionToolsView({
  collection,
  tools,
  loading = false,
  onBack,
  onToolRemoved,
  onToolRemoveFailed,
}: CollectionToolsViewProps) {
  return (
    <section className="mt-6">
      {/* Back btn & total tool count */}
      <div className="mb-6 flex gap-4 items-center justify-between">
        <Button
          variant="link"
          className="flex items-center gap-2 px-0"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" /> Back to collections
        </Button>
        <span className="rounded-full bg-neutral-100 w-fit px-3 py-1 text-xs md:text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {tools.length} tools
        </span>
      </div>

      {/* Collections Name & Description */}
      <div className="md:mx-6">
        <h2 className="text-2xl font-semibold">{collection.name}</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {collection.description || ""}
        </p>
      </div>

      {/* Saved Tools of collection */}
      {loading ? (
        <div className="mt-4 md:mx-6 text-sm text-gray-500 dark:text-gray-400">
          Loading tools...
        </div>
      ) : tools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 bg-black/2 md:mx-6 mt-4 px-6 py-10 text-center dark:border-white/15 dark:bg-white/3">
          <p className="mb-4 md:text-md text-gray-600 dark:text-gray-300">
            This collection has no tools yet.
          </p>
          <Link href="directory">
            <Button variant="secondary">Browse Tools</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool._id}
              tool={tool}
              bookmarkMode="remove"
              collectionId={collection._id}
              onRemoved={() => onToolRemoved(tool._id)}
              onRemoveFailed={() => onToolRemoveFailed(tool._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
