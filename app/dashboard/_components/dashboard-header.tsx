import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardHeader({ tools }: any) {
  const { data: session, status } = useSession();

  const user = session?.user;
  const userName = user?.name || "Your profile";
  const userEmail = user?.email || "Signed in with Google";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col md:flex-row justify-between rounded-xl border border-black/10 bg-white/75 p-6 md:p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
      {/* Heading and paragraph */}
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-black/60 dark:border-white/10 dark:bg-white/3 dark:text-white/60">
          Dashboard
        </span>

        <h1 className="mt-5 font-instrument text-4xl leading-tight tracking-tight text-black sm:text-5xl dark:text-white">
          Saved tools, arranged in a cleaner space.
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/65 sm:text-base dark:text-white/65">
          Revisit the resources you care about, keep your collection easy to
          scan, and jump back into work without hunting through tabs.
        </p>
      </div>

      {/* Avatar and Email ID */}
      <section className="rounded-lg border border-black/10 bg-white/75 shadow mt-8 md:mt-0 p-5 md:p-8 sm:min-w-73 dark:border-white/10 dark:bg-white/3">
        {status === "authenticated" ? (
          <div className="flex flex-col gap-5 sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-gray-200 dark:border-gray-800">
                <AvatarImage src={user?.image || ""} alt={userName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl font-semibold">{userName}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>
              </div>
            </div>

            <p className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
              You have saved:{" "}
              <span className="text-black dark:text-white">
                {tools.length} tools <br /> 3 private collections | 2 saved
                collections{" "}
              </span>
            </p>
          </div>
        ) : (
          // fallback if user is not logged in
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Your dashboard</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to view and manage your saved tools.
              </p>
            </div>

            <Link href="/login">
              <Button>Sign in</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
