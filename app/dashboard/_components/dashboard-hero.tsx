"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";

type DashboardHeroProps = {
  showSignInAction: boolean;
};

export function DashboardHero({ showSignInAction }: DashboardHeroProps) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white/75 p-8 shadow-[0_24px_90px_-48px_rgba(0,0,0,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
      <span className="inline-flex rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-black/60 dark:border-white/10 dark:bg-white/3 dark:text-white/60">
        Dashboard
      </span>

      <h1 className="mt-5 max-w-2xl font-instrument text-4xl leading-tight tracking-tight text-black sm:text-5xl dark:text-white">
        Saved tools, arranged in a cleaner space.
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65 sm:text-base dark:text-white/65">
        Revisit the resources you care about, keep your collection easy to scan,
        and jump back into work without hunting through tabs.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="rounded-full px-5">
          <Link href="/directory">
            Browse directory
            <ArrowRight />
          </Link>
        </Button>

        {showSignInAction && (
          <Button
            asChild
            variant="outline"
            className="rounded-full border-black/15 bg-white/60 px-5 dark:border-white/15 dark:bg-white/3"
          >
            <Link href="/login">
              Sign in
              <LogIn />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
