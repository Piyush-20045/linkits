import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type Action = {
  href: string;
  label: string;
  icon?: ReactNode;
};

type DashboardEmptyStateProps = {
  icon?: LucideIcon;
  heading: string;
  description: string;
  primaryBtn: Action;
};

export function DashboardEmptyState({
  icon: Icon,
  heading,
  description,
  primaryBtn,
}: DashboardEmptyStateProps) {
  return (
    <section className="mt-10 rounded-xl border border-dashed border-black/15 bg-black/2 px-6 py-16 text-center dark:border-white/15 dark:bg-white/3">
      {/* ICON */}
      {Icon && (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/8">
          <Icon className="text-black/70 dark:text-white/70" />
        </div>
      )}

      <h3 className="mt-4 text-2xl font-semibold">{heading}</h3>

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>

      <Button variant="secondary" className="mt-6 inline-block  ">
        <Link href={primaryBtn.href} className="flex items-center gap-2">
          {primaryBtn.icon}
          {primaryBtn.label}
        </Link>
      </Button>
    </section>
  );
}
