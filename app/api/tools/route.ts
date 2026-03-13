import { NextResponse } from "next/server";
import { getCategoryQueryValues } from "@/constants/categories";
import { connectDB } from "@/lib/db";
import Tool from "@/models/Tool";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const categoryValues = getCategoryQueryValues(category);

  const query = categoryValues.length > 0 ? { category: { $in: categoryValues } } : {};

  const tools = await Tool.find(query).sort({ createdAt: -1 });

  return NextResponse.json(tools);
}
