import { DashboardEmptyState } from "../dashboard-empty-state";
import { ArrowRightIcon, Rocket } from "lucide-react";

// Saved (pre-made, curated) collections aren't built yet — show a
// coming-soon card instead of an empty state.
const SavedCollections = () => {
  return (
    <DashboardEmptyState
      icon={Rocket}
      heading="Curated collections are coming soon"
      description="Hand-picked tool collections for specific tasks and workflows. We're putting them together — check back soon."
      primaryBtn={{
        href: "/directory",
        label: "Browse tools",
        icon: <ArrowRightIcon />,
      }}
    />
  );
};

export default SavedCollections;
