"use client";
import { Collection } from "@/types/collection";
import { CollectionEmptyState } from "../dashboard-empty-state";
import { Folders, Plus } from "lucide-react";
import InputModal from "../input-modal";
import { useEffect, useState } from "react";
import { Tool } from "@/types/tool";
import CollectionListView from "./collections/collection-list-view";
import CollectionToolsView from "./collections/collection-tools-view";

type PersonalCollectionsProps = {
  collections: Collection[];
  onCollectionCreated: (collection: Collection) => void;
  onCollectionUpdated: (collection: Collection) => void;
  onCollectionDeleted: (collectionId: string) => void;
  onCollectionToolRemoved: (collectionId: string, toolId: string) => void;
  onCollectionToolRemoveFailed: (collectionId: string, toolId: string) => void;
};

type CreateCollectionPayload = {
  title: string;
  description: string;
};

const PersonalCollections = ({
  collections,
  onCollectionCreated,
  onCollectionUpdated,
  onCollectionDeleted,
  onCollectionToolRemoved,
  onCollectionToolRemoveFailed,
}: PersonalCollectionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCollectionTools, setSelectedCollectionTools] = useState<
    Tool[]
  >([]);
  const [isLoadingTools, setIsLoadingTools] = useState(false);

  const selectedCollection = collections.find(
    (collection) => collection._id === selectedCollectionId,
  );

  // Fetch the selected collection's tools by id. Collections can hold tools
  // that are NOT in the default saved list, so filtering the saved-tools
  // fetch here would silently hide them.
  useEffect(() => {
    if (!selectedCollection) return;

    const ids = selectedCollection.toolIds
      .map((toolId) => String(toolId))
      .join(",");
    let cancelled = false;

    async function loadTools() {
      setIsLoadingTools(true);
      try {
        const res = await fetch(`/api/tools?ids=${ids}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!cancelled && res.ok) {
          setSelectedCollectionTools(data);
        }
      } catch (error) {
        console.error("Failed to fetch collection tools", error);
      } finally {
        if (!cancelled) setIsLoadingTools(false);
      }
    }

    loadTools();
    return () => {
      cancelled = true;
    };
  }, [selectedCollection]);

  const editingInitialValues = editingCollection
    ? {
        title: editingCollection.name,
        description: editingCollection.description || "",
      }
    : undefined;

  const handleOpenCreateModal = () => {
    setEditingCollection(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (collection: Collection) => {
    setEditingCollection(collection);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
    setErrorMessage("");
  };

  const handleDeleteCollection = async (collection: Collection) => {
    const shouldDelete = window.confirm(
      `Delete "${collection.name}"? This cannot be undone.`,
    );

    if (!shouldDelete) return;

    setErrorMessage("");

    try {
      const response = await fetch(`/api/collections/${collection._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result?.error || "Failed to delete collection");
        return;
      }

      onCollectionDeleted(collection._id);
      if (selectedCollectionId === collection._id) {
        setSelectedCollectionId(null);
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleFormSubmit = async (data: CreateCollectionPayload) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const isEditing = Boolean(editingCollection);
      const response = await fetch(
        isEditing
          ? `/api/collections/${editingCollection?._id}`
          : "/api/collections",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.error ||
            (isEditing
              ? "Failed to update collection"
              : "Failed to create collection"),
        );
        return;
      }

      if (result?.collection) {
        if (isEditing) {
          onCollectionUpdated(result.collection);
        } else {
          onCollectionCreated(result.collection);
        }
      }

      setIsModalOpen(false);
      setEditingCollection(null);
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
          loading={isLoadingTools}
          onBack={() => setSelectedCollectionId(null)}
          onToolRemoved={(toolId) =>
            onCollectionToolRemoved(selectedCollection._id, toolId)
          }
          onToolRemoveFailed={(toolId) =>
            onCollectionToolRemoveFailed(selectedCollection._id, toolId)
          }
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
          onEditCollection={handleOpenEditModal}
          onDeleteCollection={handleDeleteCollection}
        />
      ) : null}

      <InputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        title={editingCollection ? "Edit Collection" : "Create New Collection"}
        description={
          editingCollection
            ? "Update the collection name and description."
            : "Group your favorite tools in one place and organize them your way."
        }
        submitLabel={editingCollection ? "Save Changes" : "Create"}
        initialValues={editingInitialValues}
      />
    </div>
  );
};

export default PersonalCollections;
