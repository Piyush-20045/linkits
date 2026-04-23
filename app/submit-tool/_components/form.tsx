"use client";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/constants/categories";

interface SubmitToolFormProps {
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string;
  error: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function Form({
  title,
  url,
  description,
  category,
  tags,
  error,
  isSubmitting,
  onTitleChange,
  onUrlChange,
  onDescriptionChange,
  onCategoryChange,
  onTagsChange,
  onSubmit,
}: SubmitToolFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter tool name"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">URL</label>
        <Input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Write a short description"
          required
          rows={5}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-black dark:border-gray-700 dark:bg-black dark:focus:border-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-black dark:border-gray-700 dark:bg-black dark:focus:border-white"
        >
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Tags</label>
        <Input
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="react, ui, productivity"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Separate tags with commas.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Tool"}
      </Button>
    </form>
  );
}
