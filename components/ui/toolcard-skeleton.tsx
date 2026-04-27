"use client";

interface ToolCardSkeletonProps {
  count?: number;
}

export default function ToolCardSkeleton({
  count = 1,
}: ToolCardSkeletonProps) {
  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className="animate-pulse rounded-md border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-neutral-900"
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-md bg-gray-200 dark:bg-neutral-800" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-neutral-800" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="h-6 w-16 rounded-sm bg-gray-200 dark:bg-neutral-800" />
        <div className="h-6 w-20 rounded-sm bg-gray-200 dark:bg-neutral-800" />
        <div className="h-6 w-14 rounded-sm bg-gray-200 dark:bg-neutral-800" />
      </div>

      <div className="mt-auto flex pt-2">
        <div className="h-9 flex-1 rounded-md bg-gray-200 dark:bg-neutral-800" />
        <div className="ml-3 h-9 w-20 rounded-full bg-gray-200 dark:bg-neutral-800" />
      </div>
    </div>
  ));
}
