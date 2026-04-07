import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Tool from "@/models/Tool";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([]);

  const client = (await clientPromise).db();

  const user = await client.collection("users").findOne({
    email: session.user.email,
  });
  await connectDB();

  const tools = await Tool.find({
    _id: { $in: user?.savedTools || [] },
  }).sort({ createdAt: -1 });

  const toolsWithSavedState = tools.map((tool) => ({
    ...tool.toObject(),
    saved: true,
  }));

  return NextResponse.json(toolsWithSavedState);
}
