"use client";

import { Check, X } from "lucide-react";

export function NoSignupChip({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      aria-pressed={active}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] whitespace-nowrap transition-colors duration-150 ease-out active:scale-[0.98] ${
        active
          ? "border-transparent bg-blue-600 font-medium text-white dark:bg-blue-500 dark:text-white"
          : "border-gray-200 bg-white text-gray-600 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-gray-300 hover:text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-gray-400 dark:hover:border-neutral-700 dark:hover:text-gray-200"
      }`}
    >
      No signup needed
      {active ? (
        <X size={14} strokeWidth={active ? 2.5 : 2} />
      ) : (
        <Check size={14} strokeWidth={active ? 2.5 : 2} />
      )}
    </button>
  );
}
