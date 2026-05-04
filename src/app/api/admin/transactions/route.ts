import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "20", 10) || 20, 1),
    200
  );
  const offset = Math.max(
    parseInt(searchParams.get("offset") || "0", 10) || 0,
    0
  );

  // Filters
  const userId = searchParams.get("userId");
  const transactionId = searchParams.get("transactionId");
  const productId = searchParams.get("productId");
  const gamepassId = searchParams.get("gamepassId");
  const isAGift = searchParams.get("isAGift"); // "true" | "false" | null
  const itemType = searchParams.get("itemType"); // "Gamepass" | "DeveloperProduct" | null

  // Sorting
  const sortBy = searchParams.get("sortBy") || "created_at";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "ASC" : "DESC";

  // Whitelist allowed sort columns to prevent SQL injection
  const allowedSortColumns: Record<string, string> = {
    user_id: "user_id",
    product_id: "product_id",
    amount: "amount",
    transaction_id: "transaction_id",
    is_a_gift: "is_a_gift",
    universe_id: "universe_id",
    created_at: "created_at",
    gamepass_id: "gamepass_id",
    item_type: "item_type",
  };

  const safeSort = allowedSortColumns[sortBy] || "created_at";

  const database = await db();

  // Build query dynamically
  const conditions: string[] = [];
  const args: (string | number)[] = [];
  const countArgs: (string | number)[] = [];

  if (transactionId) {
    // If transactionId is provided, it's unique so we ignore other filters
    conditions.push("transaction_id = ?");
    args.push(transactionId);
    countArgs.push(transactionId);
  } else {
    if (userId) {
      conditions.push("user_id = ?");
      args.push(userId);
      countArgs.push(userId);
    }
    if (productId) {
      conditions.push("product_id = ?");
      args.push(productId);
      countArgs.push(productId);
    }
    if (gamepassId) {
      conditions.push("gamepass_id = ?");
      args.push(gamepassId);
      countArgs.push(gamepassId);
    }
    if (isAGift === "true") {
      conditions.push("is_a_gift = 1");
    } else if (isAGift === "false") {
      conditions.push("is_a_gift = 0");
    }
    if (itemType === "Gamepass" || itemType === "DeveloperProduct") {
      conditions.push("item_type = ?");
      args.push(itemType);
      countArgs.push(itemType);
    }
  }

  const whereClause =
    conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

  const sql = `SELECT * FROM transactions${whereClause} ORDER BY ${safeSort} ${sortOrder} LIMIT ? OFFSET ?`;
  const countSql = `SELECT COUNT(*) as total FROM transactions${whereClause}`;

  args.push(limit, offset);

  const [dataResult, countResult] = await Promise.all([
    database.execute({ sql, args }),
    database.execute({ sql: countSql, args: countArgs }),
  ]);

  const total = Number(countResult.rows[0]?.total ?? 0);

  return NextResponse.json({
    success: true,
    data: dataResult.rows,
    pagination: {
      total,
      limit,
      offset,
    },
  });
}
