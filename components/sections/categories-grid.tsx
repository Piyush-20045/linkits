"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const CATEGORIES_DATA = [
  {
    title: "AI Tools",
    description: "Supercharge your workflow with AI.",
    href: "/directory?category=ai",
    image: "/categories/ai-tools.jpg",
  },
  {
    title: "Developer Tools",
    description: "Helpers, converters, and utilities.",
    href: "/directory?category=utilities",
    image: "/categories/dev-tools.jpg",
  },
  {
    title: "UI / Frontend",
    description: "Design inspiration and libraries.",
    href: "/directory?category=ui",
    image: "/categories/ui-frontend.jpg",
  },
  {
    title: "Jobs & Career",
    description: "Find your next role at top companies.",
    href: "/directory?category=jobs",
    image: "/categories/job-search.jpg",
  },
  // {
  //   title: "Interview Prep",
  //   description: "Practice and ace technical interviews.",
  //   href: "/directory?category=interview",
  //   image:
  //     "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  // },
  // {
  //   title: "Free Courses",
  //   description: "Tutorials, courses, and books.",
  //   href: "/directory?category=courses",
  //   image:
  //     "https://images.unsplash.com/photo-1501504905252-47347d3c3a56?auto=format&fit=crop&w=800&q=80",
  // },
];

const CategoriesGrid = () => {
  return (
    <section className="bg-gray-50 py-20 dark:bg-black">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
            Explore categories
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A curated collection of tools, resources, and platforms across every
            stage of your development journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES_DATA.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-2xl aspect-5/3 md:aspect-6/3 lg:aspect-4/3 transition-transform duration-300 hover:scale-[1.02]"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-101"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent dark:from-black/80 dark:via-black/30" />

              <div className="relative z-10 p-6 text-white">
                <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                <p className="text-sm text-white/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/directory">
          <Button
            variant="secondary"
            size="lg"
            className="flex mx-auto mt-10 hover:bg-gray-200 dark:hover:bg-neutral-900 transition-colors"
          >
            Explore more categories <ArrowRight />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CategoriesGrid;
