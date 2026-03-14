import { Book, BotMessageSquare, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

const CategoriesGrid = () => {
  const CATEGORIES_DATA = [
    {
      title: "Jobs & Career",
      paragraph: "Find the best platforms to land your next dream role.",
      href: "/directory?category=jobs",
      icon: <BriefcaseBusiness />,
    },
    {
      title: "AI Tools",
      paragraph: "Cutting-edge AI tools to supercharge your workflow.",
      href: "/directory?category=ai",
      icon: <BotMessageSquare />,
    },
    {
      title: "Learning",
      paragraph: "Tutorials, courses, and books to level up your skills.",
      href: "/directory?category=courses",
      icon: <Book />,
    },
  ];

  return (
    <section className="bg-gray-50 py-20 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
            Everything you need
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Browse our hand-picked collections
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CATEGORIES_DATA.map((data, index) => (
            <Link
              key={index}
              href={data.href}
              className="group block space-y-3 rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md border border-gray-100 dark:bg-neutral-950/80 dark:border-neutral-600/80 dark:hover:bg-black"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
                {data.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {data.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data.paragraph}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
