import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { getCategoryQueryValues } from "@/constants/categories";
import { connectDB } from "@/lib/db";
import Tool from "@/models/Tool";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const categoryValues = getCategoryQueryValues(category);

  const query: Record<string, unknown> =
    categoryValues.length > 0 ? { category: { $in: categoryValues } } : {};

  const tools = await Tool.find(query).sort({ createdAt: -1 }).lean();
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
    ...tool,
    saved: savedToolIds.has(String(tool._id)),
  }));

  return NextResponse.json(toolsWithSavedState);
}

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, url, description, category, tags } = await req.json();

  if (!title || !url || !description || !category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  await connectDB();

  const existingTool = await Tool.findOne({ url });

  if (existingTool) {
    return NextResponse.json(
      { error: "Tool already exists" },
      { status: 409 },
    );
  }

  const tool = await Tool.create({
    title,
    url,
    description,
    category,
    tags: Array.isArray(tags) ? tags : [],
    submittedBy: session.user.email,
    source: "community",
  });

  return NextResponse.json({
    success: true,
    message: "Tool submitted successfully",
    tool,
  });
}
