import { Collection } from "@/types/collection";
import {
  CollectionEmptyState,
} from "../dashboard-empty-state";
import { Folders, Plus } from "lucide-react";

type PersonalCollectionsProps = {
  collections: Collection[];
  onCollectionCreated: (collection: Collection) => void;
};

const PersonalCollections = ({
  collections,
  onCollectionCreated,
}: PersonalCollectionsProps) => {
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
          }}
          onCollectionCreated={onCollectionCreated}
        />
      ) : (
        <section className="mt-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">Personal Collections</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your private groups of saved tools.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <article
                key={collection._id}
                className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/3"
              >
                <h3 className="text-lg font-semibold">{collection.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {collection.description || "No description provided."}
                </p>

                <p className="mt-3 text-xs font-medium text-black/70 dark:text-white/70">
                  {collection.toolIds.length} tools
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PersonalCollections;
