import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { connectDB } from "@/lib/db";
import Tool from "@/models/Tool";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toolId } = await req.json();

  if (!toolId) {
    return NextResponse.json({ error: "Tool id is required" }, { status: 400 });
  }

  const client = (await clientPromise).db();
  const users = client.collection("users");

  const user = await users.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const savedToolIds = (user.savedTools || []).map(String);
  const isSaved = savedToolIds.includes(String(toolId));

  const updateResult = await users.updateOne(
    { email: session.user.email },
    isSaved
      ? { $pull: { savedTools: toolId } }
      : { $addToSet: { savedTools: toolId } },
  );

  if (updateResult.modifiedCount > 0) {
    await connectDB();

    if (isSaved) {
      await Tool.updateOne(
        { _id: toolId, saves: { $gt: 0 } },
        { $inc: { saves: -1 } },
      );
    } else {
      await Tool.updateOne({ _id: toolId }, { $inc: { saves: 1 } });
    }
  }

  return NextResponse.json({ saved: !isSaved });
}
