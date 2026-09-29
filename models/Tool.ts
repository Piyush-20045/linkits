import mongoose, { Schema, model } from "mongoose";

const MAIN_CATEGORIES = [
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
];

const RESOURCE_CATEGORIES = [
  "Learning",
  "Inspiration",
  "Components",
  "Icons & Fonts",
  "Colors",
  "Portfolios",
  "Templates",
  "Design System",
  "Courses",
];

const ToolSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    logo: { type: String }, // hostname, e.g. "heroicons.com"
    image: { type: String, default: null },
    type: {
      type: String,
      enum: ["tool", "resource"],
      default: "tool",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [...MAIN_CATEGORIES, ...RESOURCE_CATEGORIES],
      validate: {
        validator: function (value: string) {
          const pool: any =
            this.type === "resource" ? RESOURCE_CATEGORIES : MAIN_CATEGORIES;
          return pool.includes(value);
        },
        message: (props: any) =>
          `"${props.value}" isn't a valid category for that type — check it's from the right pool.`,
      },
    },
    tags: { type: [String], default: [] },
    requiresSignup: {
      type: String,
      enum: ["none", "optional", "required"],
      default: "none",
    },
    platforms: {
      type: [String],
      enum: [
        "web",
        "windows",
        "mac",
        "linux",
        "ios",
        "android",
        "browser-extension",
        "cli",
      ],
      default: ["web"],
    },
    source: { type: String, default: "admin" },
    submittedBy: { type: String, default: null }, // email of community submitter
    featured: { type: Boolean, default: false },
    saves: { type: Number, default: 0 },
  },
  { timestamps: true },
);

if (mongoose.models.Tool) {
  delete mongoose.models.Tool;
}

export default model("Tool", ToolSchema);
