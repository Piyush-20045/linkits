"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortKey = "newest" | "saved" | "az";

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  saved: "Most Saved",
  az: "A–Z",
};

export function SortMenu({
  sort,
  onChange,
}: {
  sort: SortKey;
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-md border-gray-200 bg-white text-[13px] font-normal whitespace-nowrap text-gray-600 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowUpDown size={14} />
          {SORT_LABELS[sort]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={sort} onValueChange={onChange}>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <DropdownMenuRadioItem key={key} value={key}>
              {SORT_LABELS[key]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
