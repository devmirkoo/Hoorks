import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminOverviewClient } from "./overview-client";
import { DbErrorPage } from "@/components/db-error-page";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function fetchPageData() {
  // Try to connect to DB — if credentials are bad, return error
  let database;
  try {
    database = await db();
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  const session = await getSession();
  if (!session) {
    // Check if setup is needed
    try {
      const result = await database.execute({
        sql: "SELECT COUNT(*) as count FROM admins",
        args: [],
      });
      const hasAdmin = Number(result.rows[0]?.count) > 0;
      if (!hasAdmin) redirect("/admin/setup");
    } catch (error) {
      if (isRedirectError(error)) throw error;
      return { error: getErrorMessage(error) };
    }
    redirect("/admin/login");
  }

  // Fetch stats server-side
  try {
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

    const stats = {
      totalTransactions: Number(totalResult.rows[0]?.total ?? 0),
      totalRevenue: Number(revenueResult.rows[0]?.revenue ?? 0),
      todayTransactions: Number(todayResult.rows[0]?.today ?? 0),
    };

    const recentTransactions = recentResult.rows.map((row) => ({
      id: String(row.id),
      user_id: String(row.user_id),
      product_id: String(row.product_id),
      gamepass_id: row.gamepass_id ? String(row.gamepass_id) : null,
      is_a_gift: Number(row.is_a_gift),
      gifter_id: row.gifter_id ? String(row.gifter_id) : null,
      amount: Number(row.amount),
      universe_id: String(row.universe_id),
      place_id: String(row.place_id),
      transaction_id: String(row.transaction_id),
      timestamp: String(row.timestamp),
      created_at: String(row.created_at),
      item_type: row.item_type ? String(row.item_type) : null,
    }));

    return { stats, recentTransactions };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: getErrorMessage(error) };
  }
}

export default async function AdminOverviewPage() {
  const data = await fetchPageData();

  if ("error" in data) {
    return <DbErrorPage message={data.error as string} />;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <AdminOverviewClient
          stats={data.stats!}
          recentTransactions={data.recentTransactions!}
        />
      </main>
    </div>
  );
}
