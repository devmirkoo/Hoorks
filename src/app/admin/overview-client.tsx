"use client";

import { StatsCards } from "@/components/stats-cards";
import { TransactionTable } from "@/components/transaction-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  item_type?: string | null;
}

interface AdminOverviewClientProps {
  stats: {
    totalTransactions: number;
    totalRevenue: number;
    todayTransactions: number;
  };
  recentTransactions: Transaction[];
}

export function AdminOverviewClient({
  stats,
  recentTransactions,
}: AdminOverviewClientProps) {
  return (
    <div className="flex flex-col gap-6 p-6 grid-noise min-h-screen">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time overview of your Hoorks dashboard
        </p>
      </div>

      {/* Stats */}
      <StatsCards
        totalTransactions={stats.totalTransactions}
        totalRevenue={stats.totalRevenue}
        todayTransactions={stats.todayTransactions}
      />

      {/* Recent Transactions */}
      <Card className="glow-border animate-slide-up" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Last 10 purchase events recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={recentTransactions} compact />
        </CardContent>
      </Card>
    </div>
  );
}
