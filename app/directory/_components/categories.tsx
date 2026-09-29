import {
  RESOURCE_CATEGORIES,
  TOOL_CATEGORIES,
  type CategoryEntry,
} from "@/constants/categories";
import {
  AudioLines,
  BarChart3,
  Blocks,
  BookOpen,
  Brain,
  Briefcase,
  Clapperboard,
  Code2,
  FileText,
  GraduationCap,
  Landmark,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Lightbulb,
  ListChecks,
  MessagesSquare,
  Palette,
  PenLine,
  Presentation,
  Puzzle,
  Shapes,
  ShieldCheck,
  Sparkles,
  SwatchBook,
  TrendingUp,
  Tv,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "ai-tools": Sparkles,
  design: Palette,
  development: Code2,
  productivity: ListChecks,
  "writing-and-content": PenLine,
  "jobs-and-career": Briefcase,
  "interview-prep": MessagesSquare,
  video: Clapperboard,
  audio: AudioLines,
  "marketing-and-growth": TrendingUp,
  "business-and-finance": Landmark,
  "data-and-analytics": BarChart3,
  "privacy-and-security": ShieldCheck,
  "automation-and-no-code": Workflow,
  "files-and-documents": FileText,
  "mind-games": Brain,
  entertainment: Tv,
  utilities: Wrench,
  learning: GraduationCap,
  inspiration: Lightbulb,
  components: Puzzle,
  "icons-and-fonts": Shapes,
  colors: SwatchBook,
  portfolios: Presentation,
  templates: LayoutTemplate,
  "design-system": Layers,
  courses: BookOpen,
};

interface CategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  counts?: Record<string, number>;
  total?: number;
}

function rowClassName(isSelected: boolean) {
  return `flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ease-out active:scale-[0.98] ${
    isSelected
      ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-200"
  }`;
}

function CategoryRow({
  entry,
  count,
  isSelected,
  onSelect,
}: {
  entry: CategoryEntry;
  count?: number;
  isSelected: boolean;
  onSelect: (value: string) => void;
}) {
  const Icon = CATEGORY_ICONS[entry.value] ?? Blocks;
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.value)}
      className={rowClassName(isSelected)}
    >
      <Icon size={16} className="shrink-0" strokeWidth={2} />
      <span className="truncate">{entry.label}</span>
      {typeof count === "number" && (
        <span className="ml-auto pl-2 text-xs tabular-nums text-gray-400 dark:text-gray-500">
          {count}
        </span>
      )}
    </button>
  );
}

const Categories = ({
  selectedCategory,
  onCategoryChange,
  counts,
  total,
}: CategoriesProps) => {
  return (
    <>
      {/* Mobile: flat horizontal pills */}
      <div className="flex gap-1 overflow-x-auto overscroll-x-contain touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-out active:scale-[0.98] ${
            selectedCategory === "all"
              ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800"
          }`}
        >
          All Tools
        </button>
        {[...TOOL_CATEGORIES, ...RESOURCE_CATEGORIES].map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors duration-150 ease-out active:scale-[0.98] ${
              selectedCategory === cat.value
                ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Desktop: grouped sidebar */}
      <nav className="hidden lg:block" aria-label="Categories">
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={rowClassName(selectedCategory === "all")}
          >
            <LayoutGrid size={16} className="shrink-0" strokeWidth={2} />
            <span className="truncate">All Tools</span>
            {typeof total === "number" && (
              <span className="ml-auto pl-2 text-xs tabular-nums text-gray-400 dark:text-gray-500">
                {total}
              </span>
            )}
          </button>
        </div>

        <p className="mt-5 mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Tools
        </p>
        <div className="space-y-0.5">
          {TOOL_CATEGORIES.map((cat) => (
            <CategoryRow
              key={cat.value}
              entry={cat}
              count={counts?.[cat.value]}
              isSelected={selectedCategory === cat.value}
              onSelect={onCategoryChange}
            />
          ))}
        </div>

        <p className="mt-5 mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Resources
        </p>
        <div className="space-y-0.5">
          {RESOURCE_CATEGORIES.map((cat) => (
            <CategoryRow
              key={cat.value}
              entry={cat}
              count={counts?.[cat.value]}
              isSelected={selectedCategory === cat.value}
              onSelect={onCategoryChange}
            />
          ))}
        </div>
      </nav>
    </>
  );
};

export default Categories;
