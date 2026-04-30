import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const database = await db();

  const [totalResult, revenueResult, todayResult, recentResult] =
    await Promise.all([
      database.execute({
        sql: "SELECT COUNT(*) as total FROM transactions",
        args: [],
      }),
      database.execute({
        sql: "SELECT COALESCE(SUM(amount), 0) as revenue FROM transactions",
        args: [],
      }),
      database.execute({
        sql: "SELECT COUNT(*) as today FROM transactions WHERE date(created_at) = date('now')",
        args: [],
      }),
      database.execute({
        sql: "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10",
        args: [],
      }),
    ]);

  return NextResponse.json({
    success: true,
    stats: {
      totalTransactions: Number(totalResult.rows[0]?.total ?? 0),
      totalRevenue: Number(revenueResult.rows[0]?.revenue ?? 0),
      todayTransactions: Number(todayResult.rows[0]?.today ?? 0),
    },
    recentTransactions: recentResult.rows,
  });
}
