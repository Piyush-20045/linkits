"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Folders } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

export default function InputModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    // Optional: reset form or let parent handle state destruction
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity dark:bg-black/70"
        onClick={onClose}
      />

      {/* Modal Content Wrapper */}
      <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-neutral-900">
        {/* Header */}
        <h3 className="mb-2 flex items-center gap-2.5 text-xl font-bold leading-6 text-slate-900 dark:text-white">
          <Folders className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          Create New Collection
        </h3>
        <p className="mb-5 text-sm text-slate-600 dark:text-neutral-400">
          Group your favorite tools in one place and organize them your way.
        </p>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input 1 */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              Collection Name
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              required
              maxLength={60}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI Tools, Design Tools"
              className="h-10 rounded-sm placeholder:text-sm"
            />
          </div>

          {/* Input 2 */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              Description{" "}
              <span className="font-light text-slate-700 dark:text-slate-300">
                (optional)
              </span>
            </label>
            <Textarea
              id="description"
              name="description"
              maxLength={280}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Best AI Tools for Image generation"
              rows={4}
              className="min-h-28 resize-none placeholder:text-sm"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>

            <Button type="submit" variant="default">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
