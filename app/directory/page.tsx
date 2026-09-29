import { connectDB } from "@/lib/db";
import ToolModel from "@/models/Tool";
import { Tool } from "@/types/tool";
import { Suspense } from "react";
import DirectoryContent from "./_components/directory-content";

// Refresh the prerendered directory every 5 minutes
export const revalidate = 300;

// Reads straight from Mongo so local builds don't need a running server.
// JSON round-trip converts ObjectIds and Dates to plain strings — required
// because client components only accept serializable props.
async function getTools(): Promise<Tool[]> {
  await connectDB();

  const docs = await ToolModel.find({}).sort({ createdAt: -1 }).lean();
  const plain = JSON.parse(JSON.stringify(docs)) as Array<
    Partial<Tool> & { _id: unknown }
  >;

  return plain.map((doc) => ({
    ...doc,
    _id: String(doc._id),
    tags: doc.tags ?? [],
    saves: doc.saves ?? 0,
  })) as Tool[];
}

export default async function Directory() {
  const tools = await getTools();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <DirectoryContent tools={tools} />
    </Suspense>
  );
}
