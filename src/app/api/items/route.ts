import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth/api-key";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limited = rateLimit(request, {
    key: "items",
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  // Validate API key
  const auth = await validateApiKey(request);
  if (!auth.valid) return auth.response!;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "50", 10) || 50, 1),
    200
  );
  const offset = Math.max(
    parseInt(searchParams.get("offset") || "0", 10) || 0,
    0
  );
  const userId = searchParams.get("userId");
  const transactionId = searchParams.get("transactionId")
  const itemType = searchParams.get("itemType");

  const database = await db();

  // Build query
  let sql = "SELECT * FROM transactions";
  let countSql = "SELECT COUNT(*) as total FROM transactions";
  const args: (string | number)[] = [];
  const countArgs: (string | number)[] = [];

  if (userId) {
    sql += " WHERE user_id = ?";
    countSql += " WHERE user_id = ?";
    args.push(userId);
    countArgs.push(userId);
  }

  if (transactionId) {
    if (!userId) {
      sql += " WHERE id = ?";
      countSql += " WHERE id = ?"

    } else {
      sql += " AND id = ?";
      countSql += " AND id = ?"
    }
    args.push(transactionId)
    countArgs.push(transactionId)
  }

  if (itemType === "Gamepass" || itemType === "DeveloperProduct") {
    const hasWhere = userId || transactionId;
    sql += hasWhere ? " AND item_type = ?" : " WHERE item_type = ?";
    countSql += hasWhere ? " AND item_type = ?" : " WHERE item_type = ?";
    args.push(itemType);
    countArgs.push(itemType);
  }

  sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
