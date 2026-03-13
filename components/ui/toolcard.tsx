"use client";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/constants/categories";
import { Tool } from "@/types/tool";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const categoryLabel = getCategoryLabel(tool.category);

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-neutral-900 dark:hover:border-gray-700">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 font-serif text-lg font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
          {tool.title.charAt(0)}
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
      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {tool.description}
      </p>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-[10px] text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="mt-auto pt-4">
        <a href={tool.url} target="_blank" rel="noopener noreferrer">
          <Button
            variant="secondary"
            size="sm"
            className="w-full transition-colors group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black cursor-pointer"
          >
            Visit Site
          </Button>
        </a>
      </div>
    </div>
  );
}
