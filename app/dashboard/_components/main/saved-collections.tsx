import { DashboardEmptyState } from "../dashboard-empty-state";
import { ArrowRightIcon, Folders } from "lucide-react";
import { Tool } from "@/types/tool";

const SavedCollections = ({ tools }: { tools: Tool[] }) => {
  return (
    <div>
      {tools.length !== 0 ? (
        // if 0 collections are there
        <DashboardEmptyState
          icon={Folders}
          heading="No collections saved yet"
          description="Save curated pre-made collections for different specific tasks."
          primaryBtn={{
            href: "/directory",
            label: "Browse collections",
            icon: <ArrowRightIcon />,
          }}
        />
      ) : (
        <div>this is the saved collections</div>
      )}
    </div>
  );
};

export default SavedCollections;
