import { Collection } from "@/types/collection";
import { FolderPen, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type CollectionListViewProps = {
  collections: Collection[];
  onCreateCollection: () => void;
  onSelectCollection: (collectionId: string) => void;
};

export default function CollectionListView({
  collections,
  onCreateCollection,
  onSelectCollection,
}: CollectionListViewProps) {
  return (
    <section className="mt-6">
      {/* Header + Create Collection Btn */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Personal Collections</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your private groups of saved tools.
          </p>
        </div>

        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={onCreateCollection}
        >
          Create Collection <Plus />
        </Button>
      </div>

      {/* Collection List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          // Single Collection Card
          <button
            type="button"
            onClick={() => onSelectCollection(collection._id)}
            className="rounded-xl border border-black/10 bg-neutral-50 px-5 py-4 text-left dark:border-white/10 dark:bg-neutral-900 hover:scale-105 hover:bg-neutral-100 duration-200 cursor-pointer"
          >
            <div className="flex justify-between">
              <h3 className="flex items-center gap-2">
                <span className="rounded-sm bg-neutral-100 p-2 dark:bg-neutral-950">
                  <FolderPen className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
                </span>
                <p className="text-lg font-semibold">{collection.name}</p>
              </h3>

              {/* Placeholder for future actions: view, edit, delete */}
              <span>...</span>
            </div>

            <p className="mt-2 ml-2 h-5 line-clamp-2 text-sm text-neutral-800 dark:text-neutral-300">
              {collection.description || ""}
            </p>

            <section className="mt-8 flex justify-between items-center text-xs">
              <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                <Lock className="h-3 w-3" /> Private
              </span>
              <span>{collection.toolIds.length} tools</span>
            </section>
          </button>
        ))}
      </div>
    </section>
  );
}
