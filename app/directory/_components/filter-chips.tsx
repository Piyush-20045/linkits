"use client";

import { Zap } from "lucide-react";

export type TypeFilter = "all" | "tool" | "resource";

const TYPE_OPTIONS: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "tool", label: "Tools" },
  { value: "resource", label: "Resources" },
];

export function FilterChips({
  noSignupOnly,
  onNoSignupChange,
  typeFilter,
  onTypeChange,
}: {
  noSignupOnly: boolean;
  onNoSignupChange: (value: boolean) => void;
  typeFilter: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onNoSignupChange(!noSignupOnly)}
        aria-pressed={noSignupOnly}
        className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] whitespace-nowrap transition-colors duration-150 ease-out active:scale-[0.98] ${
          noSignupOnly
            ? "border-transparent bg-blue-600 font-medium text-white dark:bg-blue-500 dark:text-white"
            : "border-gray-200 bg-white text-gray-600 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-gray-300 hover:text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-gray-400 dark:hover:border-neutral-700 dark:hover:text-gray-200"
        }`}
      >
        <Zap size={14} strokeWidth={noSignupOnly ? 2.5 : 2} />
        No signup needed
      </button>

      <div
        role="group"
        aria-label="Content type"
        className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-gray-200 bg-gray-100/70 p-0.5 dark:border-neutral-800 dark:bg-neutral-900"
      >
        {TYPE_OPTIONS.map((option) => {
          const isActive = typeFilter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onTypeChange(option.value)}
              aria-pressed={isActive}
              className={`rounded-full px-3 py-1 text-[13px] whitespace-nowrap transition-all duration-150 ease-out active:scale-[0.98] ${
                isActive
                  ? "bg-white font-medium text-gray-900 shadow-sm dark:bg-neutral-950 dark:text-white dark:shadow-black/40"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
