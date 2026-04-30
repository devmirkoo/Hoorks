import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db";
import { sendTestWebhook } from "@/lib/discord";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const database = await db();
  const result = await database.execute({
    sql: "SELECT value FROM settings WHERE key = 'discord_webhook_url'",
    args: [],
  });

  const webhookUrl =
    (result.rows[0]?.value as string) ||
    process.env.DISCORD_WEBHOOK_URL ||
    "";

  return NextResponse.json({ success: true, webhookUrl });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { webhookUrl?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle test webhook action
  if (body.action === "test") {
    const database = await db();
    const result = await database.execute({
      sql: "SELECT value FROM settings WHERE key = 'discord_webhook_url'",
      args: [],
    });

    const url =
      (result.rows[0]?.value as string) ||
      process.env.DISCORD_WEBHOOK_URL ||
      "";

    if (!url) {
      return NextResponse.json(
        { error: "No webhook URL configured" },
        { status: 400 }
      );
    }

    const success = await sendTestWebhook(url);
    if (!success) {
      return NextResponse.json(
        { error: "Webhook test failed. Check the URL and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Test message sent!" });
  }

  // Save webhook URL
  if (!body.webhookUrl) {
    return NextResponse.json(
      { error: "Webhook URL is required" },
      { status: 400 }
    );
  }

  // Validate URL to prevent SSRF — only Discord webhook URLs are allowed
  const DISCORD_WEBHOOK_PREFIX = "https://discord.com/api/webhooks/";
  if (!body.webhookUrl.startsWith(DISCORD_WEBHOOK_PREFIX)) {
    return NextResponse.json(
      { error: "Invalid webhook URL. Must be a Discord webhook URL (https://discord.com/api/webhooks/...)" },
      { status: 400 }
    );
  }

  const database = await db();
  await database.execute({
    sql: `INSERT INTO settings (key, value) VALUES ('discord_webhook_url', ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [body.webhookUrl],
  });

  return NextResponse.json({
    success: true,
    message: "Webhook URL saved",
  });
}
