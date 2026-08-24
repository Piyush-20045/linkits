"use client";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/constants/categories";
import { Tool } from "@/types/tool";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BookmarkPicker } from "./bookmark-picker";

interface ToolCardProps {
  tool: Tool;
  bookmarkMode?: "picker" | "remove";
  collectionId?: string;
  onRemoved?: () => void;
  onRemoveFailed?: () => void;
}

export default function ToolCard({
  tool,
  bookmarkMode = "picker",
  collectionId,
  onRemoved,
  onRemoveFailed,
}: ToolCardProps) {
  const categoryLabel = getCategoryLabel(tool.category);
  const [isSaved, setIsSaved] = useState(tool.saved ?? false);
  const [bookmarkCount, setBookmarkCount] = useState(tool.saves ?? 0);

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
        <BookmarkPicker
          toolId={tool._id}
          count={bookmarkCount}
          isSaved={bookmarkMode === "remove" ? true : isSaved}
          mode={bookmarkMode}
          collectionId={collectionId}
          onRemoved={onRemoved}
          onRemoveFailed={onRemoveFailed}
          onBookmarkChange={({ saved, saves }) => {
            if (typeof saved === "boolean") {
              setIsSaved(saved);
            }
            if (typeof saves === "number") {
              setBookmarkCount(saves);
            }
          }}
        />
      </div>
    </div>
  );
}
