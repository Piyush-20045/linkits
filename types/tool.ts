export const MAIN_CATEGORIES = [
  "AI Tools",
  "Design",
  "Development",
  "Productivity",
  "Writing & Content",
  "Jobs & Career",
  "Interview Prep",
  "Video",
  "Audio",
  "Marketing & Growth",
  "Business & Finance",
  "Data & Analytics",
  "Privacy & Security",
  "Automation & No-Code",
  "Files & Documents",
  "Mind Games",
  "Entertainment",
  "Utilities",
] as const;

export const RESOURCE_CATEGORIES = [
  "Learning",
  "Inspiration",
  "Components",
  "Icons & Fonts",
  "Colors",
  "Portfolios",
  "Templates",
  "Design System",
  "Courses",
] as const;

export type MainCategory = (typeof MAIN_CATEGORIES)[number];
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
export type Category = MainCategory | ResourceCategory;

export type ToolType = "tool" | "resource";
export type SignupRequirement = "none" | "optional" | "required";
export type Platform =
  | "web"
  | "windows"
  | "mac"
  | "linux"
  | "ios"
  | "android"
  | "browser-extension"
  | "cli";

export type Tool = {
  _id: string;
  title: string;
  description: string;
  url: string;
  logo?: string;
  image?: string | null;
  type: ToolType;
  category: Category;
  tags: string[];
  requiresSignup: SignupRequirement;
  platforms: Platform[];
  source?: string;
  featured?: boolean;
  saves?: number;
  saved?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
