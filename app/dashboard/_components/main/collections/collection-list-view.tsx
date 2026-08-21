import { Collection } from "@/types/collection";
import {
  Ellipsis,
  FolderPen,
  Lock,
  Plus,
  PencilIcon,
  TrashIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CollectionListViewProps = {
  collections: Collection[];
  onCreateCollection: () => void;
  onSelectCollection: (collectionId: string) => void;
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (collection: Collection) => void;
};

export default function CollectionListView({
  collections,
  onCreateCollection,
  onSelectCollection,
  onEditCollection,
  onDeleteCollection,
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
          <div
            onClick={() => onSelectCollection(collection._id)}
            className="cursor-pointer rounded-xl border border-black/10 bg-neutral-50 px-5 py-4 text-left hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-neutral-950"
          >
            <div className="flex justify-between">
              <h3 className="flex items-center gap-2">
                <span className="rounded-sm bg-neutral-100 p-2 dark:bg-neutral-800">
                  <FolderPen className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                </span>
                <p className="text-lg font-semibold">{collection.name}</p>
              </h3>

              {/* Actions Btn: view, edit, delete */}
              <span className="z-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(event) => event.stopPropagation()}
                      className="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Ellipsis className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          onSelectCollection(collection._id);
                        }}
                      >
                        <Eye />
                        View Tools
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          onEditCollection(collection);
                        }}
                      >
                        <PencilIcon />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={(event) => {
                          event.preventDefault();
                          onDeleteCollection(collection);
                        }}
                      >
                        <TrashIcon />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
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
          </div>
        ))}
      </div>
    </section>
  );
}
