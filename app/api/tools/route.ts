import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Tool from "@/models/Tool";

// NOTE: there is intentionally no GET handler here. The public directory
// reads Mongo server-side, and dashboard collection views use the narrow
// /api/collection-tools endpoint (caller's own collection only) — so no
// URL returns tools as a bulk listing anymore.

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, url, category } = await req.json();

  if (!title || !url || !category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  await connectDB();

  // Heads-up for review, not a blocker — suggestions never write to the DB.
  const existingTool = await Tool.findOne({ url }).lean();

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    console.error("Telegram env vars missing — suggestion not sent:", {
      title,
      url,
      category,
    });
    return NextResponse.json(
      { error: "Suggestion service is not configured. Try again later." },
      { status: 503 },
    );
  }

  const text = [
    "🔧 <b>New tool suggestion</b>",
    `<b>${escapeHtml(String(title))}</b>`,
    escapeHtml(String(url)),
    `Category: ${escapeHtml(String(category))}`,
    `By: ${escapeHtml(session.user.email)}`,
    existingTool ? "⚠️ Already in directory" : "✅ Not in directory",
  ].join("\n");

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    },
  );

  if (!telegramRes.ok) {
    console.error("Telegram send failed:", await telegramRes.text());
    return NextResponse.json(
      { error: "Could not send suggestion. Try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Thanks! We'll review your suggestion.",
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
