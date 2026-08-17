import { Tool } from "@/types/tool";
import { DashboardEmptyState } from "../dashboard-empty-state";
import { Folders, Plus } from "lucide-react";

const PersonalCollections = ({ tools }: { tools: Tool[] }) => {
  return (
    <div>
      {tools.length === 0 ? (
        // if 0 collections are there
        <DashboardEmptyState
          icon={Folders}
          heading="No collections created yet"
          description="Create private collections to keep your favorite tools organized."
          primaryBtn={{
            href: "/create-collections",
            label: "Create a collection",
            icon: <Plus />,
          }}
        />
      ) : (
        <div>this is the main personal collections</div>
      )}
    </div>
  );
};

export default PersonalCollections;
