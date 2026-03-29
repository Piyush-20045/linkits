"use client";

import ToolCard from "@/components/ui/toolcard";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    async function fetchSaved() {
      const res = await fetch("/api/saved-tools");
      const data = await res.json();
      setTools(data);
    }

    fetchSaved();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl mb-6">Saved Tools</h1>

      {tools.length === 0 ? (
        <p>No saved tools yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool: any) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
