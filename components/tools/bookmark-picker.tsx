"use client";

import { Button } from "@/components/ui/button";
import { CollectionPopout } from "@/components/tools/collection-popout";
import { Bookmark } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

type BookmarkChange = {
  saved?: boolean;
  saves?: number;
};

type BookmarkPickerProps = {
  toolId: string;
  count: number;
  isSaved: boolean;
  // "picker" -> directory/home cards: click toggles save; "remove" -> dashboard cards: click only removes
  mode?: "picker" | "remove";
  // Set in the dashboard collection view so removal targets that one collection
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
  const { status } = useSession();
  const [isMutating, setIsMutating] = useState(false);
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);

  // Adds when unsaved, removes from the default list when saved
  // (collections are separate containers and stay untouched)
  async function toggleBookmark() {
    if (isMutating) return;

    // Visitors must sign in before bookmarking
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    const willSave = !isSaved;
    const previousSaved = isSaved;
    const previousCount = count;

    // Collection view -> only that collection; otherwise the default list
    const target = mode === "remove" && collectionId ? "collection" : "default";

    // Undoes optimistic updates and reports why
    function rollback(error?: string) {
      onBookmarkChange?.({ saved: previousSaved, saves: previousCount });
      if (mode === "remove") onRemoveFailed?.();
      toast.error(error || "Something went wrong");
    }

    // Optimistic update so the icon flips instantly
    onBookmarkChange?.({
      saved: willSave,
      saves: willSave ? count + 1 : Math.max(count - 1, 0),
    });
    if (mode === "remove") onRemoved?.(); // drop dashboard card up front

    try {
      setIsMutating(true);
      const response = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          target,
          action: willSave ? "add" : "remove",
          collectionId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        rollback(data?.error);
        return;
      }

      // Sync counter with the DB value when the API returns one
      onBookmarkChange?.({
        saved: data.saved ?? willSave,
        saves: typeof data.saves === "number" ? data.saves : undefined,
      });

      if (willSave) {
        const toastId = toast.success("Saved", {
          duration: 4000,
          action: {
            // Swaps the toast for the collection picker panel
            label: "Change collection",
            onClick: () => {
              toast.dismiss(toastId);
              setIsPopoutOpen(true);
            },
          },
        });
      } else if (mode === "picker") {
        toast("Removed from bookmarks", { duration: 3000 });
      }
    } catch {
      rollback();
    } finally {
      setIsMutating(false);
    }
  }

  const buttonClassName = `ml-3 inline-flex h-8 items-center overflow-hidden rounded-full border bg-white text-gray-500 dark:bg-neutral-950 dark:text-gray-400 ${
    isSaved
      ? "border-green-300 dark:border-green-500/20"
      : "border-neutral-200 dark:border-neutral-800"
  }`;

  return (
    <div className={buttonClassName}>
      {/* Collection picker panel opened from the toast */}
      {isPopoutOpen && (
        <CollectionPopout
          toolId={toolId}
          savedInDefault={isSaved}
          onDefaultChange={(saved) => {
            onBookmarkChange?.({ saved });
          }}
          onClose={() => setIsPopoutOpen(false)}
        />
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isMutating}
        onClick={() => {
          void toggleBookmark();
        }}
        className="h-9 w-9 rounded-none border-0 bg-transparent text-gray-500 shadow-none hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-500/10 dark:hover:text-gray-500"
        aria-label={
          collectionId
            ? "Remove from collection"
            : isSaved
              ? "Remove bookmark"
              : "Save tool"
        }
      >
        <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
      </Button>
      <span className="border-l border-current/10 px-2.5 text-sm font-semibold">
        {count}
      </span>
    </div>
  );
}
