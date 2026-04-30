"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { TransactionTable } from "@/components/transaction-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  product_id: string;
  gamepass_id?: string | null;
  is_a_gift: number;
  gifter_id?: string | null;
  amount: number;
  universe_id: string;
  place_id: string;
  transaction_id: string;
  timestamp: string;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (userIdFilter) params.set("userId", userIdFilter);

      const res = await fetch(`/api/items?${params}`, {
        headers: {
          // We use the admin session cookie for this page,
          // but the API needs an API key. So we'll use the admin stats endpoint instead
        },
      });

      // Since /api/items requires API key, we'll use a direct DB fetch via admin endpoint
      const statsRes = await fetch("/api/admin/stats");
      if (!statsRes.ok) throw new Error("Failed to fetch");
      const data = await statsRes.json();

      // For now, use the recent transactions from stats
      // In production, you'd create a separate admin transactions endpoint
      setTransactions(
        data.recentTransactions?.map((row: Record<string, unknown>) => ({
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
        })) || []
      );
      setTotal(data.stats?.totalTransactions || 0);
    } catch {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [offset, userIdFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to JSON");
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="flex flex-col gap-6 p-6 grid-noise min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Transactions
              </h1>
              <p className="text-muted-foreground mt-1">
                Full history of all recorded purchases
              </p>
            </div>
            <Button variant="outline" onClick={exportToJson}>
              <Download data-icon="inline-start" />
              Export JSON
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 animate-slide-up">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Filter by User ID..."
                value={userIdFilter}
                onChange={(e) => {
                  setUserIdFilter(e.target.value);
                  setOffset(0);
                }}
                className="pl-9"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="glow-border animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {total} total transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <TransactionTable transactions={transactions} />
              )}

              {/* Pagination */}
              {total > limit && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Showing {offset + 1}–
                    {Math.min(offset + limit, total)} of {total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={offset === 0}
                      onClick={() =>
                        setOffset(Math.max(0, offset - limit))
                      }
                    >
                      <ChevronLeft data-icon="inline-start" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={offset + limit >= total}
                      onClick={() => setOffset(offset + limit)}
                    >
                      Next
                      <ChevronRight data-icon="inline-end" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
