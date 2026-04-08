"use client";
import { LucideIcon } from "lucide-react";

export type DashboardStat = {
  label: string;
  value: number;
  icon: LucideIcon;
};

type DashboardStatsProps = {
  stats: DashboardStat[];
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-[1.75rem] border border-black/10 bg-white/70 p-5 shadow-[0_20px_70px_-52px_rgba(0,0,0,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/55 dark:text-white/55">
                {stat.label}
              </span>
              <span className="rounded-full border border-black/10 p-2 text-black/70 dark:border-white/10 dark:text-white/70">
                <Icon size={16} />
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold tracking-tight text-black dark:text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
