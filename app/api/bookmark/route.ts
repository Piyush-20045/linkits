import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toolId } = await req.json();

  const client = (await clientPromise).db();

  const user = await client
    .collection("users")
    .findOne({ email: session.user.email });

  const isSaved = user?.savedTools?.includes(toolId);

  await client
    .collection("users")
    .updateOne(
      { email: session.user.email },
      isSaved
        ? { $pull: { savedTools: toolId } }
        : { $addToSet: { savedTools: toolId } },
    );

  return NextResponse.json({ saved: !isSaved });
}
