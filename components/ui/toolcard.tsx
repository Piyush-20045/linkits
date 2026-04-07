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
    if (!session) {
      return signIn("google");
    }

    // Optimistic update
    setIsSaved((prev) => !prev);

    try {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        body: JSON.stringify({ toolId: tool._id }),
      });

      const data = await res.json();

      console.log(data);

      setIsSaved(data.saved);
    } catch (err) {
      setIsSaved((prev) => !prev); //rollback
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
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex-1">
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
          className="px-2 py-1 text-xs cursor-pointer rounded-full hover:shadow"
        >
          {isSaved ? (
            <span>
              <BookmarkCheck />
            </span>
          ) : (
            <span>
              <Bookmark />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
