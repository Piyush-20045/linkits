import { connectDB } from "@/lib/db";
import ToolModel from "@/models/Tool";
import { Tool } from "@/types/tool";
import { Suspense } from "react";
import DirectoryContent from "./_components/directory-content";

// Refresh the prerendered directory every 5 minutes
export const revalidate = 300;

// Reads straight from Mongo so local builds don't need a running server
async function getTools(): Promise<Tool[]> {
  await connectDB();

  const docs = await ToolModel.find({}).sort({ createdAt: -1 }).lean();

  return docs.map((doc) => ({
    ...(doc as unknown as Tool),
    _id: String(doc._id),
    tags: (doc.tags as string[]) ?? [],
    saves: doc.saves ?? 0,
  }));
}

export default async function Directory() {
  const tools = await getTools();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <DirectoryContent tools={tools} />
    </Suspense>
  );
}
