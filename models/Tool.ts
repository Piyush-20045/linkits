import mongoose, { Schema, models, model } from "mongoose";

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
  },
  { timestamps: true },
);

export default models.Tool || model("Tool", ToolSchema);
