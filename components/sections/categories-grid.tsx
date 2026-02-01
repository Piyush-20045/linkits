import { Book, BotMessageSquare, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

const CategoriesGrid = () => {
  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
            Everything you need
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Browse our hand-picked collections
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            href="/directory?category=jobs"
            className="group block space-y-3 rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <BriefcaseBusiness />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Jobs & Career
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Find the best platforms to land your next dream role.
            </p>
          </Link>

          <Link
            href="/directory?category=ai"
            className="group block space-y-3 rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <BotMessageSquare />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Tools
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cutting-edge AI tools to supercharge your workflow.
            </p>
          </Link>

          <Link
            href="/directory?category=learning"
            className="group block space-y-3 rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <Book />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Learning
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tutorials, courses, and books to level up your skills.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
