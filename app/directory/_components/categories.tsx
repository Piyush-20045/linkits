import { CATEGORIES } from "@/constants/categories";

interface CategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const buttonClassName = (isSelected: boolean) =>
  `shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm transition lg:w-full lg:text-left ${
    isSelected
      ? "bg-gray-300 text-black dark:bg-white dark:text-black"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800"
  }`;

const Categories = ({
  selectedCategory,
  onCategoryChange,
}: CategoriesProps) => {
  return (
    <div>
      <h3 className="mb-2 hidden text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 lg:mb-3 lg:block">
        Categories
      </h3>
      <div className="flex gap-1 overflow-x-auto overscroll-x-contain touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-x-visible lg:overflow-y-visible lg:touch-auto">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={buttonClassName(selectedCategory === "all")}
        >
          All Tools
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            className={buttonClassName(selectedCategory === cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
