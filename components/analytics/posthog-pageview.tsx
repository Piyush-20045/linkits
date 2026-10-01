"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

// Fires on first load and every App Router navigation.
// Must sit inside a <Suspense> boundary (wired in app/layout.tsx).
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture("$pageview");
    }
  }, [pathname, searchParams]);

  return null;
}
