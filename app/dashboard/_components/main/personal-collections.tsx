"use client";

import { Collection } from "@/types/collection";
import { CollectionEmptyState } from "../dashboard-empty-state";
import { Folders, Lock, Plus, FolderPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputModal from "../input-modal";
import { useState } from "react";

type PersonalCollectionsProps = {
  collections: Collection[];
  onCollectionCreated: (collection: Collection) => void;
};

const PersonalCollections = ({
  collections,
  onCollectionCreated,
}: PersonalCollectionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (data: {
    title: string;
    description: string;
  }) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result?.error || "Failed to create collection");
        return;
      }

      if (result?.collection) {
        onCollectionCreated(result.collection);
      }

      setIsModalOpen(false);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {collections.length === 0 ? (
        // if 0 collections are there
        <CollectionEmptyState
          icon={Folders}
          heading="No collections created yet"
          description="Create private collections to keep your favorite tools organized."
          primaryBtn={{
            href: "#",
            label: "Create a collection",
            icon: <Plus />,
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <section className="mt-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Personal Collections</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your private groups of saved tools.
              </p>
            </div>

            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              Create Collection <Plus />
            </Button>
          </div>

          <InputModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <article
                key={collection._id}
                className="rounded-xl border border-black/10 bg-gray-50 px-5 py-4 dark:border-white/10 dark:bg-white/3"
              >
                <div className="flex justify-between">
                  <h3 className="flex gap-3 items-center">
                    <span className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-sm">
                      <FolderPen className="text-neutral-400 h-5 w-5" />
                    </span>
                    <p className="text-lg font-semibold">{collection.name}</p>
                  </h3>

                  {/* 3 options - View tools, Edit collection, Delete collection */}
                  <span className="">...</span>
                </div>
                <p className="mt-2 ml-2 line-clamp-2 text-sm text-neutral-800 dark:text-neutral-300">
                  {collection.description || "No description provided."}
                </p>

                <section className="mt-8 text-xs flex justify-between">
                  <span className="px-3 py-1 flex items-center gap-1 text-neutral-600 dark:text-neutral-300 rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <Lock className="h-3 w-3" /> Private
                  </span>
                  <span>{collection.toolIds.length} tools</span>
                </section>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PersonalCollections;
