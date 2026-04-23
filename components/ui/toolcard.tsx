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
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);

  useEffect(() => {
    setIsSaved(tool.saved ?? false);
  }, [tool.saved]);

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

    // Optimistic update
    setIsSaved((prev) => !prev);

    try {
      setIsSavingBookmark(true);
      const res = await fetch("/api/bookmark", {
        method: "POST",
        body: JSON.stringify({ toolId: tool._id }),
      });

      const data = await res.json();

      console.log(data);

      setIsSaved(data.saved);
    } catch {
      setIsSaved((prev) => !prev); //rollback
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
          {tool.source === "community" ? (
            <span className="mt-2 inline-flex rounded-sm border border-gray-300 bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-gray-600 dark:border-gray-700 dark:bg-black dark:text-gray-300">
              Community Added
            </span>
          ) : null}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {categoryLabel}
          </p>
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
        <button
          onClick={handleSave}
          type="button"
          aria-label={isSaved ? "Remove bookmark" : "Save bookmark"}
          aria-pressed={isSaved}
          disabled={isSavingBookmark}
          className={`relative ml-3 inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 dark:focus-visible:ring-offset-neutral-900 ${
            isSaved
              ? "border-amber-300 bg-amber-100 text-amber-600 shadow-sm shadow-amber-200/70 hover:bg-amber-200 hover:text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/5 dark:text-amber-400 dark:shadow-amber-900/30 dark:hover:bg-amber-500/25"
              : "border-gray-200 bg-white text-gray-500 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 hover:shadow-sm dark:border-gray-700 dark:bg-neutral-950 dark:text-gray-400 dark:hover:border-amber-500/50 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
          }`}
        >
          {isSaved ? (
            <span className="relative flex items-center justify-center">
              <span className="absolute h-7 w-7 rounded-full bg-amber-300/30 blur-sm" />
              <BookmarkCheck
                size={20}
                strokeWidth={2.4}
                className="relative transition-transform duration-300 animate-in zoom-in-50"
              />
            </span>
          ) : (
            <span className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Bookmark size={19} strokeWidth={2.2} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
