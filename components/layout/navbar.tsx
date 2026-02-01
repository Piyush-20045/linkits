"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";
import { ToggleButton } from "../ui/toggle-button";
import { Input } from "../ui/input";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === "directive";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-600 dark:bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
              <div className="absolute left-0 top-full mt-2 w-48 origin-top-left rounded-lg border border-gray-200 bg-white p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-950">
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
        <div className="flex items-center gap-4">
          {/* Search */}
          <Link href="/" className="hidden sm:block relative">
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 rounded-full"
            />
          </Link>
          <div>
            <ToggleButton />
          </div>

          {/* Login & signup btn */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex hover:bg-gray-200 dark:hover:bg-neutral-900"
              >
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="border border-white">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`w-full md:hidden absolute border-t border-neutral-400 dark:border-neutral-600 backdrop-blur-md bg-gray-50/90 dark:bg-neutral-950/90 px-4 space-y-3 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <Link
          href="/directory"
          className="mt-4 block text-base font-medium text-gray-600 dark:text-gray-400"
        >
          Directory
        </Link>
        <div className="py-2 border-t border-gray-600 dark:border-gray-100">
          <p className="my-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Categories
          </p>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/directory?category=${cat.value}`}
              className="block py-1 text-sm text-gray-600 dark:text-gray-400"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
