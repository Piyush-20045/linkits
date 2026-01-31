"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === "directive";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-600 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-geist-mono text-2xl text-white tracking-tight">
              linkits
            </span>
          </Link>

          {/* Directory and Category list */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/directory"
              className={`text-sm font-medium transition-colors ${isActive ? "text-black" : "text-gray-400 hover:text-white"}`}
            >
              Directory
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-0.5">
                Categories
                <ChevronDown size={18} className=" opacity-50" />
              </button>
              <div className="absolute left-0 top-full mt-2 w-48 origin-top-left rounded-md border border-gray-400/80 bg-black opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/directory?category=${cat.value}`}
                    className="block px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-neutral-900/95"
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
            <input
              placeholder="Search..."
              className="h-9 w-48 rounded-full pl-9 pr-4 text-sm outline-none cursor-pointer border border-neutral-800 bg-neutral-950 hover:bg-black text-white"
            />
          </Link>

          {/* Login & signup btn */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex text-black"
              >
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="border border-white hover:bg-black">
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
        className={`w-full md:hidden absolute border-t border-neutral-600 bg-neutral-950 px-4 space-y-3 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <Link
          href="/directory"
          className="mt-4 block text-base font-medium text-gray-400"
        >
          Directory
        </Link>
        <div className="py-2 border-t border-gray-100">
          <p className="my-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Categories
          </p>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/directory?category=${cat.value}`}
              className="block py-1 text-sm text-gray-400"
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
