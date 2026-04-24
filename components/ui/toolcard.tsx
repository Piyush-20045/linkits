"use client";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/constants/categories";
import { Tool } from "@/types/tool";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const categoryLabel = getCategoryLabel(tool.category);
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(tool.saved ?? false);
  const [bookmarkCount, setBookmarkCount] = useState(tool.saves ?? 0);
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);

  useEffect(() => {
    setIsSaved(tool.saved ?? false);
    setBookmarkCount(tool.saves ?? 0);
  }, [tool.saved, tool.saves]);

  const getHostname = (url: string) => {
    try {
      const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
      return new URL(cleanUrl).hostname;
    } catch {
      return "";
    }
  };
  const hostname = getHostname(tool.url);

  const handleSave = async () => {
    if (isSavingBookmark) return;

    if (!session) {
      return signIn("google");
    }

    const nextSavedState = !isSaved;
    const previousCount = bookmarkCount;

    setIsSaved(nextSavedState);
    setBookmarkCount((prev) =>
      nextSavedState ? prev + 1 : Math.max(prev - 1, 0),
    );

    try {
      setIsSavingBookmark(true);
      const res = await fetch("/api/bookmark", {
        method: "POST",
        body: JSON.stringify({ toolId: tool._id }),
      });

      const data = await res.json();

      setIsSaved(data.saved);
      if (typeof data.saves === "number") {
        setBookmarkCount(data.saves);
      }
    } catch {
      setIsSaved(!nextSavedState);
      setBookmarkCount(previousCount);
    } finally {
      setIsSavingBookmark(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-md border border-gray-200 bg-gray-50 p-5 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-neutral-900 dark:hover:border-gray-700 hover:scale-105">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-100 bg-gray-50 font-serif text-lg font-bold text-gray-900 dark:border-gray-700 dark:bg-neutral-900 dark:text-gray-100">
          {hostname ? (
            <Image
              src={`https://img.logo.dev/${hostname}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`}
              alt={tool.title}
              width={38}
              height={38}
              className="object-contain rounded-md"
            />
          ) : (
            <span>{tool.title.charAt(0)}</span>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {tool.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{categoryLabel}</span>
            {tool.source === "community" ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"
                />
                <span className="text-gray-400 dark:text-gray-500">
                  Community Added
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 line-clamp-2 xl:line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
        {tool.description}
      </p>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-gray-300 bg-gray-100 px-2 py-1 text-[10px] text-gray-500 dark:border-gray-700 dark:bg-neutral-900 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="mt-auto flex pt-2">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            variant="secondary"
            size="sm"
            className="w-full transition-colors border bg-gray-200 dark:bg-neutral-950/40 group-hover:bg-gray-400/50 dark:group-hover:bg-neutral-950 cursor-pointer"
          >
            Visit Site
          </Button>
        </a>
        <div
          className={`ml-3 inline-flex h-8 shrink-0 items-center overflow-hidden rounded-full border transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-2 dark:focus-within:ring-offset-neutral-900 ${
            isSaved
              ? "border-amber-300 bg-amber-100 text-amber-700 shadow-sm shadow-amber-200/70 dark:border-amber-500/50 dark:bg-amber-500/5 dark:text-amber-400 dark:shadow-amber-900/30"
              : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-neutral-950 dark:text-gray-400"
          }`}
        >
          <button
            onClick={handleSave}
            type="button"
            aria-label={isSaved ? "Remove bookmark" : "Save bookmark"}
            aria-pressed={isSaved}
            disabled={isSavingBookmark}
            className={`relative inline-flex h-9 w-9 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70 ${
              isSaved
                ? "hover:bg-amber-200 dark:hover:bg-amber-500/25"
                : "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
            }`}
          >
            {isSaved ? (
              <span className="relative flex items-center justify-center">
                <span className="absolute h-7 w-7 rounded-full bg-amber-300/30 blur-sm" />
                <BookmarkCheck
                  size={20}
                  strokeWidth={2.4}
                  className="relative animate-in zoom-in-50 transition-transform duration-300"
                />
              </span>
            ) : (
              <span className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Bookmark size={19} strokeWidth={2.2} />
              </span>
            )}
          </button>

          <span className="border-l border-current/10 px-2.5 text-sm font-semibold">
            {bookmarkCount}
          </span>
        </div>
      </div>
    </div>
  );
}
