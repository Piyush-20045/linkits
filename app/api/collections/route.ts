import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

type CreateCollectionBody = {
  title?: string;
  description?: string;
};

type UserCollection = {
  _id: ObjectId;
  name: string;
  description: string;
  toolIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = (await clientPromise).db();
  const user = await client.collection("users").findOne(
    { email: session.user.email },
    { projection: { collections: 1 } },
  );

  const collections = ((user?.collections || []) as UserCollection[]).map(
    (collection) => ({
      ...collection,
      _id: String(collection._id),
    }),
  );

  return NextResponse.json(collections);
}

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as CreateCollectionBody;

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
  const user = await users.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date();
  const collection = {
    _id: new ObjectId(),
    name: title,
    description,
    toolIds: [],
    createdAt: now,
    updatedAt: now,
  };

  await users.updateOne(
    { email: session.user.email },
    { $push: { collections: collection } },
  );

  return NextResponse.json(
    {
      success: true,
      collection: {
        ...collection,
        _id: String(collection._id),
      },
    },
    { status: 201 },
  );
}