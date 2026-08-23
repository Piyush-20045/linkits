import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { connectDB } from "@/lib/db";
import Tool from "@/models/Tool";

type BookmarkTarget = "default" | "collection";
type BookmarkAction = "add" | "remove";

type BookmarkBody = {
  toolId?: string;
  target?: BookmarkTarget;
  collectionId?: string;
  action?: BookmarkAction;
};

function getIdVariants(id: string) {
  const ids: Array<string | ObjectId> = [id];

  if (ObjectId.isValid(id)) {
    ids.push(new ObjectId(id));
  }

  return ids;
}

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as BookmarkBody;
  const toolId = body.toolId?.trim();
  const target: BookmarkTarget = body.target ?? "default";
  const action: BookmarkAction = body.action ?? "add";
  const collectionId = body.collectionId?.trim();

  if (!toolId) {
    return NextResponse.json({ error: "Tool id is required" }, { status: 400 });
  }

  if (target !== "default" && target !== "collection") {
    return NextResponse.json({ error: "Invalid bookmark target" }, { status: 400 });
  }

  if (action !== "add" && action !== "remove") {
    return NextResponse.json({ error: "Invalid bookmark action" }, { status: 400 });
  }

  if (target === "collection" && !collectionId) {
    return NextResponse.json(
      { error: "Collection id is required" },
      { status: 400 },
    );
  }

  const client = (await clientPromise).db();
  const users = client.collection("users");
  const user = await users.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const toolIdVariants = getIdVariants(toolId);

  if (target === "collection") {
    const collectionIds = getIdVariants(collectionId!);
    const collections = user.collections || [];
    const collection = collections.find((item: { _id: string | ObjectId }) =>
      collectionIds.some((id) => String(id) === String(item._id)),
    );

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    const alreadyInCollection = (collection.toolIds || [])
      .map(String)
      .includes(String(toolId));

    if (action === "remove") {
      if (alreadyInCollection) {
        const updateResult = await users.updateOne(
          {
            email: session.user.email,
            "collections._id": { $in: collectionIds },
          },
          {
            $pull: { "collections.$.toolIds": { $in: toolIdVariants } },
            $set: { "collections.$.updatedAt": new Date() },
          },
        );

        if (updateResult.matchedCount === 0) {
          return NextResponse.json(
            { error: "Collection not found" },
            { status: 404 },
          );
        }
      }

      return NextResponse.json({
        target: "collection",
        collectionId,
        savedToCollection: false,
        alreadySaved: false,
      });
    }

    if (!alreadyInCollection) {
      const updateResult = await users.updateOne(
        {
          email: session.user.email,
          "collections._id": { $in: collectionIds },
        },
        {
          $addToSet: { "collections.$.toolIds": String(toolId) },
          $set: { "collections.$.updatedAt": new Date() },
        },
      );

      if (updateResult.matchedCount === 0) {
        return NextResponse.json(
          { error: "Collection not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({
      target: "collection",
      collectionId,
      savedToCollection: true,
      alreadySaved: alreadyInCollection,
    });
  }

  const savedToolIds = (user.savedTools || []).map(String);
  const alreadySaved = savedToolIds.includes(String(toolId));
  let saves: number | undefined;

  if (action === "remove") {
    if (alreadySaved) {
      const updateResult = await users.updateOne(
        { email: session.user.email },
        { $pull: { savedTools: { $in: toolIdVariants } } },
      );

      if (updateResult.modifiedCount > 0) {
        await connectDB();
        const updatedTool = await Tool.findOneAndUpdate(
          { _id: toolId, saves: { $gt: 0 } },
          { $inc: { saves: -1 } },
          { new: true },
        );
        saves = updatedTool?.saves;
      }
    }

    return NextResponse.json({
      target: "default",
      saved: false,
      alreadySaved: false,
      saves,
    });
  }

  if (!alreadySaved) {
    const updateResult = await users.updateOne(
      { email: session.user.email },
      { $addToSet: { savedTools: toolId } },
    );

    if (updateResult.modifiedCount > 0) {
      await connectDB();
      const updatedTool = await Tool.findByIdAndUpdate(
        toolId,
        { $inc: { saves: 1 } },
        { new: true },
      );
      saves = updatedTool?.saves;
    }
  }

  return NextResponse.json({
    target: "default",
    saved: true,
    alreadySaved,
    saves,
  });
}
