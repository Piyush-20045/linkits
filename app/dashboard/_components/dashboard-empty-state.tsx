"use client";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type Action = {
  href: string;
  label: string;
  variant?: "default" | "outline";
  icon?: ReactNode;
};

type DashboardEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction: Action;
  secondaryAction?: Action;
};

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: DashboardEmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-black/15 bg-black/2 px-6 py-16 text-center dark:border-white/15 dark:bg-white/3">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/8">
        <Icon className="text-black/70 dark:text-white/70" />
      </div>

      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-black dark:text-white">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-black/60 dark:text-white/60">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full px-5">
          <Link href={primaryAction.href}>
            {primaryAction.label}
            {primaryAction.icon}
          </Link>
        </Button>

        {secondaryAction && (
          <Button
            asChild
            variant={secondaryAction.variant ?? "outline"}
            className="rounded-full border-black/15 bg-white/60 px-5 dark:border-white/15 dark:bg-white/3"
          >
            <Link href={secondaryAction.href}>
              {secondaryAction.label}
              {secondaryAction.icon}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
