"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collection } from "@/types/collection";
import { Bookmark, FolderTree } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

type BookmarkChange = {
  saved?: boolean;
  saves?: number;
};

type BookmarkPickerProps = {
  toolId: string;
  count: number;
  isSaved: boolean;
  mode?: "picker" | "remove";
  collectionId?: string;
  onBookmarkChange?: (change: BookmarkChange) => void;
  onRemoved?: () => void;
  onRemoveFailed?: () => void;
};

export function BookmarkPicker({
  toolId,
  count,
  isSaved,
  mode = "picker",
  collectionId,
  onBookmarkChange,
  onRemoved,
  onRemoveFailed,
}: BookmarkPickerProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadCollections() {
    setIsLoadingCollections(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/collections", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error || "Failed to load collections");
        return;
      }

      setCollections(data);
    } catch {
      setErrorMessage("Failed to load collections");
    } finally {
      setIsLoadingCollections(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && status !== "authenticated") {
      signIn("google");
      return;
    }

    setOpen(nextOpen);
    setErrorMessage("");

    if (nextOpen && session) {
      void loadCollections();
    }
  }

  async function saveToDefault() {
    if (isMutating) return;

    const previousSaved = isSaved;
    const previousCount = count;

    if (!isSaved) {
      onBookmarkChange?.({ saved: true, saves: count + 1 });
    }

    try {
      setIsMutating(true);
      const response = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          target: "default",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        onBookmarkChange?.({ saved: previousSaved, saves: previousCount });
        setErrorMessage(data?.error || "Failed to save bookmark");
        return;
      }

      onBookmarkChange?.({
        saved: data.saved ?? true,
        saves: typeof data.saves === "number" ? data.saves : undefined,
      });
      setOpen(false);
    } catch {
      onBookmarkChange?.({ saved: previousSaved, saves: previousCount });
      setErrorMessage("Failed to save bookmark");
    } finally {
      setIsMutating(false);
    }
  }

  async function saveToCollection(nextCollectionId: string) {
    if (isMutating) return;

    try {
      setIsMutating(true);
      setErrorMessage("");
      const response = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          target: "collection",
          collectionId: nextCollectionId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error || "Failed to save to collection");
        return;
      }

      setOpen(false);
    } catch {
      setErrorMessage("Failed to save to collection");
    } finally {
      setIsMutating(false);
    }
  }

  async function removeBookmark() {
    if (isMutating) return;

    onRemoved?.();

    try {
      setIsMutating(true);
      const response = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          action: "remove",
          target: collectionId ? "collection" : "default",
          collectionId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        onRemoveFailed?.();
        setErrorMessage(data?.error || "Failed to remove bookmark");
        return;
      }

      onBookmarkChange?.({
        saved: false,
        saves: typeof data.saves === "number" ? data.saves : Math.max(count - 1, 0),
      });
    } catch {
      onRemoveFailed?.();
      setErrorMessage("Failed to remove bookmark");
    } finally {
      setIsMutating(false);
    }
  }

  const buttonClassName = `ml-3 inline-flex h-9 items-center overflow-hidden rounded-full border bg-white text-gray-500 dark:bg-neutral-950 dark:text-gray-400 ${
    isSaved
      ? "border-amber-300 text-amber-700 dark:border-amber-500/50 dark:text-amber-400"
      : "border-gray-200 dark:border-gray-700"
  }`;

  if (mode === "remove") {
    return (
      <div className={buttonClassName}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isMutating}
          onClick={() => {
            void removeBookmark();
          }}
          className="h-9 w-9 rounded-none border-0 bg-transparent text-gray-500 shadow-none hover:bg-amber-50 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
          aria-label={collectionId ? "Remove from collection" : "Remove bookmark"}
        >
          <Bookmark size={18} fill="currentColor" />
        </Button>
        <span className="border-l border-current/10 px-2.5 text-sm font-semibold">
          {count}
        </span>
      </div>
    );
  }

  return (
    <div className={buttonClassName}>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none border-0 bg-transparent text-gray-500 shadow-none hover:bg-amber-50 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
            aria-label="Save tool"
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Save to
          </DropdownMenuLabel>

          <DropdownMenuItem
            disabled={isMutating}
            onSelect={(event) => {
              event.preventDefault();
              void saveToDefault();
            }}
            className="gap-2 px-3 py-2"
          >
            <Bookmark className="size-4" />
            <span className="flex flex-col">
              <span>Default bookmarks</span>
              <span className="text-xs text-gray-500">
                {isSaved ? "Already in saved tools" : "Quick save for later"}
              </span>
            </span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2 px-3 py-2">
              <FolderTree className="size-4" />
              <span className="flex flex-col">
                <span>Save to collection</span>
                <span className="text-xs text-gray-500">
                  Choose one of your collections
                </span>
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56">
              {isLoadingCollections ? (
                <div className="px-3 py-2 text-xs text-gray-500">
                  Loading collections...
                </div>
              ) : collections.length === 0 ? (
                <div className="px-3 py-2 text-xs text-gray-500">
                  No collections yet. Create one from your dashboard.
                </div>
              ) : (
                collections.map((collection) => (
                  <DropdownMenuItem
                    key={collection._id}
                    disabled={isMutating}
                    onSelect={() => {
                      void saveToCollection(collection._id);
                    }}
                  >
                    {collection.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <div className="px-3 pb-1 text-xs text-gray-500">
            {errorMessage || `${count} bookmarks saved`}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="border-l border-current/10 px-2.5 text-sm font-semibold">
        {count}
      </span>
    </div>
  );
}
