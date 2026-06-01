"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { TransactionTable } from "@/components/transaction-table";
import type { Transaction } from "@/components/transaction-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey =
  | "user_id"
  | "product_id"
  | "amount"
  | "transaction_id"
  | "is_a_gift"
  | "gifter_id"
  | "universe_id"
  | "created_at"
  | "item_type";

type SortDirection = "asc" | "desc";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Filters
  const [userIdFilter, setUserIdFilter] = useState("");
  const [transactionIdFilter, setTransactionIdFilter] = useState("");
  const [productIdFilter, setProductIdFilter] = useState("");
  const [gamepassIdFilter, setGamepassIdFilter] = useState("");
  const [gifterIdFilter, setGifterIdFilter] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Sort
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [sortOrder, setSortOrder] = useState<SortDirection>("desc");

  // Gift filter
  const [giftFilter, setGiftFilter] = useState<boolean | null>(null);

  const hasActiveFilters =
    userIdFilter ||
    transactionIdFilter ||
    productIdFilter ||
    gamepassIdFilter ||
    gifterIdFilter ||
    itemTypeFilter ||
    giftFilter !== null;

  const activeFilterCount = [
    userIdFilter,
    transactionIdFilter,
    productIdFilter,
    gamepassIdFilter,
    gifterIdFilter,
    itemTypeFilter,
    giftFilter !== null ? "x" : "",
  ].filter(Boolean).length;


  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
          sortBy,
          sortOrder,
        });

        if (userIdFilter.trim()) params.set("userId", userIdFilter.trim());
        if (transactionIdFilter.trim())
          params.set("transactionId", transactionIdFilter.trim());
        if (productIdFilter.trim())
          params.set("productId", productIdFilter.trim());
        if (gamepassIdFilter.trim())
          params.set("gamepassId", gamepassIdFilter.trim());
        if (gifterIdFilter.trim())
          params.set("gifterId", gifterIdFilter.trim());
        if (itemTypeFilter)
          params.set("itemType", itemTypeFilter);
        if (giftFilter !== null)
          params.set("isAGift", giftFilter ? "true" : "false");

        const res = await fetch(`/api/admin/transactions?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (!ignore) {
          setTransactions(
            data.data?.map((row: Record<string, unknown>) => ({
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
              item_type: row.item_type ? String(row.item_type) : null,
              timestamp: String(row.timestamp),
              created_at: String(row.created_at),
            })) || []
          );
          setTotal(data.pagination?.total || 0);
        }
      } catch {
        if (!ignore) toast.error("Failed to fetch transactions");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [
    offset,
    userIdFilter,
    transactionIdFilter,
    productIdFilter,
    gamepassIdFilter,
    gifterIdFilter,
    itemTypeFilter,
    giftFilter,
    sortBy,
    sortOrder,
  ]);

  const clearAllFilters = () => {
    setUserIdFilter("");
    setTransactionIdFilter("");
    setProductIdFilter("");
    setGamepassIdFilter("");
    setGifterIdFilter("");
    setItemTypeFilter("");
    setGiftFilter(null);
    setOffset(0);
  };

  const handleSort = (key: SortKey, direction: SortDirection) => {
    setSortBy(key);
    setSortOrder(direction);
    setOffset(0);
  };

  const handleGiftFilterChange = (val: boolean | null) => {
    setGiftFilter(val);
    setOffset(0);
  };

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
          <div className="flex flex-col gap-3 animate-slide-up">
            {/* Primary filter bar */}
            <div className="flex gap-3 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="filter-user-id"
                  placeholder="Filter by User ID..."
                  value={userIdFilter}
                  onChange={(e) => {
                    setUserIdFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="pl-9"
                />
              </div>

              <Button
                variant={showFilters ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="size-5 p-0 flex items-center justify-center text-[10px] rounded-full"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="gap-1.5 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Expandable filter row */}
            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-5 gap-3 overflow-hidden transition-all duration-300 ease-out",
                showFilters
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0 pointer-events-none"
              )}
            >
              <div className="relative">
                <Input
                  id="filter-transaction-id"
                  placeholder="Transaction ID..."
                  value={transactionIdFilter}
                  onChange={(e) => {
                    setTransactionIdFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="text-sm"
                />
                {transactionIdFilter && (
                  <button
                    onClick={() => {
                      setTransactionIdFilter("");
                      setOffset(0);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <Input
                  id="filter-product-id"
                  placeholder="Product ID..."
                  value={productIdFilter}
                  onChange={(e) => {
                    setProductIdFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="text-sm"
                />
                {productIdFilter && (
                  <button
                    onClick={() => {
                      setProductIdFilter("");
                      setOffset(0);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <Input
                  id="filter-gamepass-id"
                  placeholder="Gamepass ID..."
                  value={gamepassIdFilter}
                  onChange={(e) => {
                    setGamepassIdFilter(e.target.value);
                    setOffset(0);
                  }}
                  className="text-sm"
                />
                {gamepassIdFilter && (
                  <button
                    onClick={() => {
                      setGamepassIdFilter("");
                      setOffset(0);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <Input
                  id="filter-gifter-id"
                  placeholder="Gifter ID..."
                  value={gifterIdFilter}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setGifterIdFilter(nextValue);
                    setGiftFilter(nextValue.trim() ? true : null);
                    setOffset(0);
                  }}
                  className="text-sm"
                />
                {gifterIdFilter && (
                  <button
                    onClick={() => {
                      setGifterIdFilter("");
                      setGiftFilter(null);
                      setOffset(0);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <select
                value={itemTypeFilter}
                onChange={(e) => {
                  setItemTypeFilter(e.target.value);
                  setOffset(0);
                }}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All Types</option>
                <option value="Gamepass">Gamepass</option>
                <option value="DeveloperProduct">DeveloperProduct</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <Card
            className="glow-border animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {total} total transaction{total !== 1 ? "s" : ""}
                {hasActiveFilters && (
                  <span className="text-primary ml-1">(filtered)</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <TransactionTable
                  transactions={transactions}
                  serverSide
                  onSort={handleSort}
                  onGiftFilterChange={handleGiftFilterChange}
                  currentSort={{ key: sortBy, direction: sortOrder }}
                  currentGiftFilter={giftFilter}
                />
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
