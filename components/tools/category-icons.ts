import { createElement } from "react";
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

// Icon per category slug — shared by the desktop sidebar and the mobile menu.
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
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

export function getCategoryIcon(value: string): LucideIcon {
  return CATEGORY_ICONS[value] ?? Blocks;
}

// Render helper so call sites never create a component during render
// (keeps the react-hooks/static-components rule happy).
export function CategoryIcon({
  value,
  size = 16,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  return createElement(getCategoryIcon(value), {
    size,
    className,
    strokeWidth: 2,
  });
}
