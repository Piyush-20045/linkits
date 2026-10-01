"use client";

import posthog from "posthog-js";
import { useTheme } from "next-themes";
import { ShineBorder } from "@/components/ui/shine-border";
import { Input } from "@/components/ui/input";

// Sidebar search. Filtering stays live on every keystroke; pressing Enter
// only reports an analytics event (query length, never the text).
export function DirectorySearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();

  return (
    <form
      className="relative mt-4 overflow-hidden rounded-md lg:mx-4 lg:mt-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY && value.trim().length > 0) {
          posthog.capture("search_used", {
            query_length: value.trim().length,
          });
        }
      }}
    >
      <ShineBorder shineColor={theme.theme === "dark" ? "white" : "black"} />
      <Input
        placeholder="Search tools..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}
