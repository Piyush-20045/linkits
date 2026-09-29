"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Bookmark, ChevronDown, Menu, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CATEGORIES,
  RESOURCE_CATEGORIES,
  TOOL_CATEGORIES,
  normalizeCategoryValue,
  type CategoryEntry,
} from "@/constants/categories";
import { CategoryIcon } from "../tools/category-icons";
import { ToggleButton } from "../ui/toggle-button";
import { useSession } from "next-auth/react";
import { UserMenu } from "../ui/user-menu";

function MobileCategoryItem({
  entry,
  count,
  isSelected,
  onNavigate,
}: {
  entry: CategoryEntry;
  count?: number;
  isSelected: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={`/directory?category=${entry.value}`}
      onClick={onNavigate}
      className={`flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 text-sm active:scale-[0.98] ${
        isSelected
          ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
      }`}
    >
      <CategoryIcon value={entry.value} size={15} className="shrink-0" />
      <span className="truncate">{entry.label}</span>
      {typeof count === "number" && (
        <span className="ml-auto pl-1 text-[11px] tabular-nums text-gray-400 dark:text-gray-500">
          {count}
        </span>
      )}
    </Link>
  );
}

// Category index for the mobile menu. Counts load lazily on first open via
// the tiny /api/category-counts endpoint — nothing fetched until needed.
function MobileCategoryMenu({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const searchParams = useSearchParams();
  const selected = normalizeCategoryValue(searchParams.get("category"));
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!open || counts) return;

    let cancelled = false;

    async function loadCounts() {
      try {
        const res = await fetch("/api/category-counts");
        const data = await res.json();
        if (!cancelled) {
          setCounts(data.counts ?? {});
        }
      } catch {
        // Counts stay hidden; categories still work.
      }
    }

    loadCounts();

    return () => {
      cancelled = true;
    };
  }, [open, counts]);

  return (
    <div className="border-t border-gray-600 py-2 dark:border-gray-100">
      <p className="my-2 px-1 text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
        Tools
      </p>
      <div className="grid grid-cols-2 gap-x-1">
        {TOOL_CATEGORIES.map((cat) => (
          <MobileCategoryItem
            key={cat.value}
            entry={cat}
            count={counts?.[cat.value]}
            isSelected={selected === cat.value}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <p className="mt-3 mb-2 px-1 text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400">
        Resources
      </p>
      <div className="grid grid-cols-2 gap-x-1 pb-2">
        {RESOURCE_CATEGORIES.map((cat) => (
          <MobileCategoryItem
            key={cat.value}
            entry={cat}
            count={counts?.[cat.value]}
            isSelected={selected === cat.value}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === "directive";
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-600 dark:bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-geist-mono text-2xl font-medium dark:text-white tracking-tight">
              link<span className="text-neutral-400">its</span>
            </span>
          </Link>

          {/* Directory and Category list */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/directory"
              className={`text-sm font-medium transition-colors ${isActive ? "text-black dark:text-white" : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"}`}
            >
              Directory
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white flex items-center gap-0.5">
                Categories
                <ChevronDown size={18} className="opacity-50" />
              </button>
              <div className="absolute left-0 top-full mt-2 w-48 origin-top-left rounded-lg border border-gray-200 bg-white p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-950 max-h-96 overflow-y-auto [scrollbar-width:1px]">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/directory?category=${cat.value}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-900"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center md:gap-4 gap-2">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="icon"
              className="bg-white cursor-pointer"
            >
              <Bookmark />
            </Button>
          </Link>

          <ToggleButton />

          {/* Login || user profile */}
          <div className="flex items-center gap-2">
            {status === "loading" ? null : status === "authenticated" ? (
              <UserMenu />
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="w-12 h-7 sm:w-16 sm:h-8 text-xs sm:text-sm border border-white"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`w-full lg:hidden absolute border-t border-neutral-400 dark:border-neutral-600 bg-gray-50 dark:bg-black px-4 space-y-3 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-[calc(100dvh-4rem)] overflow-y-auto"
            : "max-h-0 overflow-hidden"
        }`}
      >
        <Link
          href="/directory"
          onClick={() => setIsMenuOpen(false)}
          className="mt-4 block text-base font-medium text-gray-600 dark:text-gray-400"
        >
          Directory
        </Link>
        <Suspense fallback={null}>
          <MobileCategoryMenu
            open={isMenuOpen}
            onNavigate={() => setIsMenuOpen(false)}
          />
        </Suspense>
      </div>
    </nav>
  );
};

export default Navbar;
