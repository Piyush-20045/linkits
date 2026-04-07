import { NextResponse } from "next/server";
import { getCategoryQueryValues } from "@/constants/categories";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import Tool from "@/models/Tool";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const categoryValues = getCategoryQueryValues(category);

  const query = categoryValues.length > 0 ? { category: { $in: categoryValues } } : {};

  const tools = await Tool.find(query).sort({ createdAt: -1 });

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
