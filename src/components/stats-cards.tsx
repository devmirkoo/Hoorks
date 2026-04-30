"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, DollarSign, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalTransactions: number;
  totalRevenue: number;
  todayTransactions: number;
}

export function StatsCards({
  totalTransactions,
  totalRevenue,
  todayTransactions,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      icon: ArrowLeftRight,
      description: "All-time purchases recorded",
    },
    {
      title: "Total Revenue",
      value: `R$ ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Cumulative Robux earned",
    },
    {
      title: "Today",
      value: todayTransactions.toLocaleString(),
      icon: TrendingUp,
      description: "Transactions today",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="glow-border animate-slide-up overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                <Icon className="text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight font-mono glow-text">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
