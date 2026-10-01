"use client";
import { getCategoryLabel } from "@/constants/categories";
import { Tool } from "@/types/tool";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import posthog from "posthog-js";
import { useState, type MouseEvent } from "react";
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
  // Local override for instant bookmark UI; falls back to server props.
  // No sync effect needed — the parent remounts per tool via key={tool._id}.
  const [override, setOverride] = useState<{
    saved?: boolean;
    saves?: number;
  } | null>(null);
  const isSaved = override?.saved ?? tool.saved ?? false;
  const bookmarkCount = override?.saves ?? tool.saves ?? 0;
  // Some stored preview URLs are dead — hide the cover instead of
  // showing a broken image.
  const [coverOk, setCoverOk] = useState(true);

  const getHostname = (url: string) => {
    try {
      const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
      return new URL(cleanUrl).hostname;
    } catch {
      return "";
    }
  };
  // New data ships a `logo` hostname; fall back to parsing the URL.
  const hostname = tool.logo?.trim() || getHostname(tool.url);
  const showCover =
    coverOk && typeof tool.image === "string" && tool.image.startsWith("http");

  // One handler for logo / title / cover / arrow — all external links.
  // Bookmark clicks are <button>s, so they never match.
  function handleOutboundClick(e: MouseEvent<HTMLDivElement>) {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      (e.target as HTMLElement).closest('a[target="_blank"]')
    ) {
      posthog.capture("tool_clicked", {
        tool_title: tool.title,
        category: tool.category,
      });
    }
  }

  return (
    <div
      onClick={handleOutboundClick}
      className="group relative flex flex-col rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-neutral-900/80 dark:hover:border-gray-700 hover:scale-101"
    >
      {/* Header: logo + name on the left, actions on the right */}
      <div className="flex items-center gap-2.5">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${tool.title}`}
          className="group/logo flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 font-serif text-base font-bold text-gray-900 dark:border-gray-700 dark:bg-neutral-900 dark:text-gray-100"
        >
          {hostname ? (
            // unoptimized: logo.dev already serves cached, sized images —
            // proxying 600+ of them through Vercel Image Optimization would
            // burn quota and add latency. Browsers cache these directly.
            <Image
              src={`https://img.logo.dev/${hostname}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`}
              alt={tool.title}
              width={32}
              height={32}
              unoptimized
              className="object-contain transition-transform duration-150 ease-out group-hover/logo:scale-105"
            />
          ) : (
            <span>{tool.title.charAt(0)}</span>
          )}
        </a>

        <div className="min-w-0 flex-1">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate font-semibold text-gray-900 transition-colors duration-150 ease-out hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
          >
            {tool.title}
          </a>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="truncate">{categoryLabel}</span>
            {tool.source === "community" ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600"
                />
                <span className="shrink-0 text-gray-400 dark:text-gray-500">
                  Community
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <BookmarkPicker
            toolId={tool._id}
            toolTitle={tool.title}
            toolCategory={tool.category}
            count={bookmarkCount}
            isSaved={bookmarkMode === "remove" ? true : isSaved}
            mode={bookmarkMode}
            collectionId={collectionId}
            onRemoved={onRemoved}
            onRemoveFailed={onRemoveFailed}
            onBookmarkChange={({ saved, saves }) => {
              if (typeof saved === "boolean" || typeof saves === "number") {
                setOverride((prev) => ({
                  saved:
                    typeof saved === "boolean"
                      ? saved
                      : (prev?.saved ?? isSaved),
                  saves:
                    typeof saves === "number"
                      ? saves
                      : (prev?.saves ?? bookmarkCount),
                }));
              }
            }}
          />
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${tool.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-[color,background-color,transform] duration-150 ease-out hover:bg-gray-200 hover:text-gray-900 active:scale-95 group-hover/logo:bg-gray-200 group-hover/logo:text-gray-900 group-hover/cover:bg-gray-200 group-hover/cover:text-gray-900 dark:hover:bg-neutral-800 dark:hover:text-gray-100 dark:group-hover/logo:bg-neutral-800 dark:group-hover/logo:text-gray-100 dark:group-hover/cover:bg-neutral-800 dark:group-hover/cover:text-gray-100"
          >
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      {/* Site preview */}
      {showCover && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${tool.title}`}
          className="group/cover mt-2.5 block overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <Image
            src={tool.image as string}
            alt={`${tool.title} preview`}
            width={640}
            height={336}
            unoptimized
            onError={() => setCoverOk(false)}
            className="aspect-1200/630 w-full object-cover"
          />
        </a>
      )}

      {/* Description */}
      <p className="mt-2.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {tool.description}
      </p>
    </div>
  );
}
