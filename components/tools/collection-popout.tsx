"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collection } from "@/types/collection";
import { Bookmark, Check, FolderTree, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type CollectionPopoutProps = {
  toolId: string;
  onClose: () => void;
};

// How many collections are visible before "Show more"
const PAGE_SIZE = 5;

// Centered modal for picking a destination for a saved tool.
// Rendered via portal so the toolcards' hover-scale can't shift it around.
export function CollectionPopout({ toolId, onClose }: CollectionPopoutProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Newest collections first so the top of the list is the most recent
    async function loadCollections() {
      try {
        const res = await fetch("/api/collections", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data?.error || "Failed to load collections");
          return;
        }

        if (!cancelled) {
          const sorted = [...data].sort(
            (a: Collection, b: Collection) =>
              +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0),
          );
          setCollections(sorted);
          setHasLoaded(true);
        }
      } catch {
        toast.error("Failed to load collections");
      }
    }

    loadCollections();
    return () => {
      cancelled = true;
    };
  }, []);

  // Adds the tool to the picked collection
  async function addToCollection(collection: Collection) {
    if (isMutating) return;

    try {
      setIsMutating(true);
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          target: "collection",
          collectionId: collection._id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error || "Failed to add to collection");
        return;
      }

      toast.success(`Added to ${collection.name}`, { duration: 4000 });
      onClose();
    } catch {
      toast.error("Failed to add to collection");
    } finally {
      setIsMutating(false);
    }
  }

  // Creates a collection inline from the popout
  async function createCollection() {
    const title = newName.trim();
    if (!title || isMutating) return;

    try {
      setIsMutating(true);
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to create collection");
        return;
      }

      setCollections((prev) => [data.collection, ...prev]);
      setNewName("");
      setIsCreating(false);
    } catch {
      toast.error("Failed to create collection");
    } finally {
      setIsMutating(false);
    }
  }

  // Portal to <body> escapes the card's hover:scale-105, which otherwise
  // becomes the positioning parent of fixed elements and makes them jump
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-72 rounded-lg border border-gray-200 bg-white/90 p-3 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-neutral-900/90"
      >
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Save to
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-800 dark:hover:text-gray-300"
          >
            <X size={14} />
          </button>
        </div>

        {/* Default bookmarks entry (already saved at this point) */}
        <div className="flex items-center gap-2 rounded-md px-2 py-2 text-sm">
          <Bookmark size={16} className="text-amber-500" fill="currentColor" />
          <span className="flex-1">Bookmarks</span>
          <Check size={16} className="text-emerald-500" />
        </div>

        {/* Collections list */}
        {!hasLoaded ? (
          <div className="px-2 py-2 text-xs text-gray-500">
            Loading collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="px-2 py-2 text-xs text-gray-500">
            No collections yet.
          </div>
        ) : (
          <>
            {collections.slice(0, visibleCount).map((collection) => (
              <button
                key={collection._id}
                type="button"
                disabled={isMutating}
                onClick={() => void addToCollection(collection)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-neutral-800"
              >
                <FolderTree size={16} className="shrink-0 text-gray-500" />
                <span className="truncate">{collection.name}</span>
              </button>
            ))}

            {collections.length > visibleCount && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="w-full justify-center text-xs text-gray-500"
              >
                Show more
              </Button>
            )}
          </>
        )}

        {/* New collection */}
        {isCreating ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void createCollection();
            }}
            className="mt-2 flex gap-2 border-t border-gray-200 pt-2 dark:border-gray-800"
          >
            <Input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Collection name"
              maxLength={60}
              autoFocus
            />
            <Button type="submit" size="sm" disabled={isMutating}>
              Add
            </Button>
          </form>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="mt-2 w-full justify-start gap-2 border-t border-gray-200 text-xs dark:border-gray-800"
          >
            <Plus size={14} />
            New collection
          </Button>
        )}
      </div>
    </div>,
    document.body,
  );
}
