"use client";
import { Collection } from "@/types/collection";
import { CollectionEmptyState } from "../dashboard-empty-state";
import { Folders, Plus } from "lucide-react";
import InputModal from "../input-modal";
import { useState } from "react";
import { Tool } from "@/types/tool";
import CollectionListView from "./collections/collection-list-view";
import CollectionToolsView from "./collections/collection-tools-view";

type PersonalCollectionsProps = {
  collections: Collection[];
  tools: Tool[];
  onCollectionCreated: (collection: Collection) => void;
};

type CreateCollectionPayload = {
  title: string;
  description: string;
};

const PersonalCollections = ({
  collections,
  tools,
  onCollectionCreated,
}: PersonalCollectionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedCollection = collections.find(
    (collection) => collection._id === selectedCollectionId,
  );

  // Keep ID matching resilient when tool ids come as ObjectId-like values.
  const selectedCollectionTools = selectedCollection
    ? tools.filter((tool) =>
        selectedCollection.toolIds
          .map((toolId) => String(toolId))
          .includes(String(tool._id)),
      )
    : [];

  const handleOpenCreateModal = () => {
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateCollectionPayload) => {
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
      {/* Detail mode: show tools for one selected collection. */}
      {selectedCollection ? (
        <CollectionToolsView
          collection={selectedCollection}
          tools={selectedCollectionTools}
          onBack={() => setSelectedCollectionId(null)}
        />
      ) : null}

      {collections.length === 0 ? (
        // Empty state component for collections
        <CollectionEmptyState
          icon={Folders}
          heading="No collections created yet"
          description="Create private collections to keep your favorite tools organized."
          primaryBtn={{
            href: "#",
            label: "Create a collection",
            icon: <Plus />,
            onClick: handleOpenCreateModal,
          }}
        />
      ) : !selectedCollection ? (
        <CollectionListView
          collections={collections}
          onCreateCollection={handleOpenCreateModal}
          onSelectCollection={setSelectedCollectionId}
        />
      ) : null}

      <InputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default PersonalCollections;
