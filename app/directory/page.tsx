import { Tool } from "@/types/tool";
import { Suspense } from "react";
import DirectoryContent from "./_components/directory-content";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function getTools() {
  const res = await fetch(`${siteUrl}/api/tools`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tools");
  }

  return res.json();
}

export default async function Directory() {
  const tools: Tool[] = await getTools();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <DirectoryContent tools={tools} />
    </Suspense>
  );
}
