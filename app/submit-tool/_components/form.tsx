"use client";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RESOURCE_CATEGORIES, TOOL_CATEGORIES } from "@/constants/categories";

interface SubmitToolFormProps {
  title: string;
  url: string;
  category: string;
  error: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function Form({
  title,
  url,
  category,
  error,
  isSubmitting,
  onTitleChange,
  onUrlChange,
  onCategoryChange,
  onSubmit,
}: SubmitToolFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Tool name</label>
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
        <label className="mb-2 block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-black dark:border-gray-700 dark:bg-black dark:focus:border-white"
        >
          <optgroup label="Tools">
            {TOOL_CATEGORIES.map((item) => (
              <option key={item.value} value={item.label}>
                {item.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Resources">
            {RESOURCE_CATEGORIES.map((item) => (
              <option key={item.value} value={item.label}>
                {item.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending..." : "Suggest Tool"}
      </Button>
    </form>
  );
}
