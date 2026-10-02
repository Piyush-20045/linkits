import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { connectDB } from "@/lib/db";
import Tool from "@/models/Tool";

// Returns only the caller's own collection tools — never a bulk listing.
// Replaces the old generic GET /api/tools?ids=… fetch primitive.
export async function GET(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collectionId = new URL(req.url).searchParams.get("collectionId");

  if (!collectionId || !ObjectId.isValid(collectionId)) {
    return NextResponse.json(
      { error: "Valid collectionId is required" },
      { status: 400 },
    );
  }

  const client = (await clientPromise).db();
  const user = await client
    .collection("users")
    .findOne(
      { email: session.user.email },
      { projection: { collections: 1 } },
    );

  const collections = (user?.collections ?? []) as Array<{
    _id: ObjectId;
    toolIds?: unknown;
  }>;
  const collection = collections.find(
    (item) => String(item._id) === collectionId,
  );

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  await connectDB();

  const ids = (Array.isArray(collection.toolIds) ? collection.toolIds : [])
    .map((id) => String(id))
    .filter((id) => ObjectId.isValid(id));

  const tools = await Tool.find({ _id: { $in: ids } })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(tools);
}
