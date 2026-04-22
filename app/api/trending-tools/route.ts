import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import clientPromise from "@/lib/mongodb";
import Tool from "@/models/Tool";

export async function GET() {
  await connectDB();

  const tools = await Tool.find({}).sort({ saves: -1, createdAt: -1 }).limit(6);
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(tools);
  }

  const client = (await clientPromise).db();
  const user = await client.collection("users").findOne({
    email: session.user?.email,
  });
  const savedToolIds = new Set((user?.savedTools || []).map(String));

  const toolsWithSavedState = tools.map((tool) => ({
    ...tool.toObject(),
    saved: savedToolIds.has(String(tool._id)),
  }));

  return NextResponse.json(toolsWithSavedState);
}
