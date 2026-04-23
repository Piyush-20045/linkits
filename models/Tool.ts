import { Schema, models, model } from "mongoose";

const ToolSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Jobs & Career",
        "Interview Prep",
        "AI Tools",
        "Developer Tools",
        "UI / Frontend Resources",
        "Free Courses",
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    submittedBy: String,
    source: {
      type: String,
      default: "admin",
    },
    saves: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default models.Tool || model("Tool", ToolSchema);
