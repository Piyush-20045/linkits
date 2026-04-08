export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-black/10 dark:bg-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-28 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-20 rounded-full bg-black/5 dark:bg-white/5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-black/5 dark:bg-white/5" />
            <div className="h-3 w-4/5 rounded-full bg-black/5 dark:bg-white/5" />
          </div>

          <div className="mt-6 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-black/5 dark:bg-white/5" />
            <div className="h-6 w-20 rounded-full bg-black/5 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
