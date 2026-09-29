import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { normalizeCategoryValue } from "@/constants/categories";
import Tool from "@/models/Tool";

// Tiny payload for nav menus: per-category counts + total.
// Cached for 5 minutes like the directory page.
export const revalidate = 300;

export async function GET() {
  await connectDB();

  const groups = (await Tool.aggregate([
    { $group: { _id: "$category", n: { $sum: 1 } } },
  ])) as Array<{ _id: string; n: number }>;

  const counts: Record<string, number> = {};
  let total = 0;
  for (const group of groups) {
    const slug = normalizeCategoryValue(group._id);
    counts[slug] = (counts[slug] ?? 0) + group.n;
    total += group.n;
  }

  return NextResponse.json({ counts, total });
}
