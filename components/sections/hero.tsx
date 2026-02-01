import Link from "next/link";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        {/* Heading and paragraph */}
        <h1 className="px-2.5 text-5xl sm:text-6xl md:text-7xl text-gray-700 dark:text-gray-400 leading-tight tracking-tight font-instrument">
          Discover the best tools to{" "}
          <span className="italic text-black dark:text-white">build</span> and{" "}
          <span className="italic text-black dark:text-white">grow</span>.
        </h1>
        <p className="px-2.5 sm:px-0 mx-auto max-w-2xl text-lg text-gray-400 md:text-xl font-base">
          A curated directory of resources, learning platforms, and utilities
          for modern developers.
        </p>
        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/directory">
            <Button
              variant="secondary"
              size="lg"
              className="px-8 hover:bg-gray-200 dark:hover:bg-neutral-900"
            >
              Explore Tools
            </Button>
          </Link>
          <Link href="/directory?category=ai">
            <Button
              size="lg"
              className="px-8 border border-white"
            >
              Browse AI
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
