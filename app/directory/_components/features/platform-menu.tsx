"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PlatformKey =
  | "all"
  | "ios"
  | "android"
  | "mac"
  | "windows"
  | "linux"
  | "cli"
  | "browser-extension";

export const PLATFORM_LABELS: Record<PlatformKey, string> = {
  all: "Platform",
  ios: "iOS",
  android: "Android",
  mac: "macOS",
  windows: "Windows",
  linux: "Linux",
  cli: "CLI",
  "browser-extension": "Extension",
};

const PLATFORM_KEYS = Object.keys(PLATFORM_LABELS) as PlatformKey[];

export function PlatformMenu({
  platform,
  onChange,
}: {
  platform: PlatformKey;
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-full border-gray-200 bg-white text-[13px] font-normal whitespace-nowrap text-gray-600 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:text-gray-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {PLATFORM_LABELS[platform]}
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={platform} onValueChange={onChange}>
          {PLATFORM_KEYS.map((key) => (
            <DropdownMenuRadioItem key={key} value={key}>
              {key === "all" ? "All platforms" : PLATFORM_LABELS[key]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
