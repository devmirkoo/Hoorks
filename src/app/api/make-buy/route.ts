import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { validateApiKey } from "@/lib/auth/api-key";
import { db } from "@/lib/db";
import { validateTransaction } from "@/lib/validators";
import { sendDiscordNotification } from "@/lib/discord";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limited = rateLimit(request, {
    key: "make-buy",
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  // Validate API key
  const auth = await validateApiKey(request);
  if (!auth.valid) return auth.response!;

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Validate fields
  const validation = validateTransaction(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 }
    );
  }

  const data = validation.data!;
  const database = await db();

  // Check for duplicate transactionId
  const existing = await database.execute({
    sql: "SELECT id FROM transactions WHERE transaction_id = ?",
    args: [data.transactionId],
  });

  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "Duplicate transaction", transactionId: data.transactionId },
      { status: 409 }
    );
  }

  // Insert transaction
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  await database.execute({
    sql: `INSERT INTO transactions (id, user_id, product_id, gamepass_id, is_a_gift, gifter_id, amount, universe_id, place_id, transaction_id, timestamp, item_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.userId,
      data.productId,
      data.gamepassId ?? null,
      data.isAGift ? 1 : 0,
      data.gifterId ?? null,
      data.amount,
      data.universeId,
      data.placeId,
      data.transactionId,
      data.timestamp,
      data.itemType,
      createdAt,
    ],
  });

  // Fire-and-forget Discord notification
  sendDiscordNotification(data).catch((err) =>
    console.error("[Discord] Notification failed:", err)
  );

  return NextResponse.json(
    {
      success: true,
      data: {
        id,
        userId: data.userId,
        productId: data.productId,
        transactionId: data.transactionId,
        amount: data.amount,
        createdAt,
      },
    },
    { status: 201 }
  );
}
