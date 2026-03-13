import { CATEGORIES } from "@/constants/categories";

interface CategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Categories = ({
  selectedCategory,
  onCategoryChange,
}: CategoriesProps) => {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Categories
      </h3>
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
            selectedCategory === "all"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
              selectedCategory === cat.value
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
