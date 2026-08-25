import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// Next.js 16 passes dynamic route params as a Promise
type CollectionParams = {
  params: Promise<{ collectionId: string }>;
};

type CollectionBody = {
  title?: string;
  description?: string;
};

function getCollectionIdVariants(collectionId: string) {
  const ids: Array<string | ObjectId> = [collectionId];

  if (ObjectId.isValid(collectionId)) {
    ids.push(new ObjectId(collectionId));
  }

  return ids;
}

export async function PATCH(req: Request, { params }: CollectionParams) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await params;
  const body = (await req.json()) as CollectionBody;
  const title = body.title?.trim();
  const description = body.description?.trim() || "";

  if (!title) {
    return NextResponse.json(
      { error: "Collection name is required" },
      { status: 400 },
    );
  }

  if (title.length > 60) {
    return NextResponse.json(
      { error: "Collection name must be 60 characters or less" },
      { status: 400 },
    );
  }

  if (description.length > 280) {
    return NextResponse.json(
      { error: "Description must be 280 characters or less" },
      { status: 400 },
    );
  }

  const client = (await clientPromise).db();
  const users = client.collection("users");
  const collectionIds = getCollectionIdVariants(collectionId);

  const updateResult = await users.updateOne(
    {
      email: session.user.email,
      "collections._id": { $in: collectionIds },
    },
    {
      $set: {
        "collections.$.name": title,
        "collections.$.description": description,
        "collections.$.updatedAt": new Date(),
      },
    },
  );

  if (updateResult.matchedCount === 0) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    collection: {
      _id: collectionId,
      name: title,
      description,
    },
  });
}

export async function DELETE(_req: Request, { params }: CollectionParams) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collectionId } = await params;
  const client = (await clientPromise).db();
  const users = client.collection("users");
  const collectionIds = getCollectionIdVariants(collectionId);

  const updateResult = await users.updateOne(
    { email: session.user.email },
    { $pull: { collections: { _id: { $in: collectionIds } } } },
  );

  if (updateResult.matchedCount === 0) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
