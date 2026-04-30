"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

interface TransactionTableProps {
  transactions: Transaction[];
  compact?: boolean;
}

export function TransactionTable({
  transactions,
  compact = false,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <span className="text-muted-foreground text-lg">∅</span>
        </div>
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            {!compact && <TableHead>Transaction ID</TableHead>}
            <TableHead>Gift</TableHead>
            {!compact && <TableHead>Universe</TableHead>}
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="group">
              <TableCell className="font-mono text-xs">
                {tx.user_id}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{tx.product_id}</Badge>
              </TableCell>
              <TableCell className="font-mono text-primary font-medium">
                R$ {Number(tx.amount).toLocaleString()}
              </TableCell>
              {!compact && (
                <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                  {tx.transaction_id}
                </TableCell>
              )}
              <TableCell>
                {tx.is_a_gift ? (
                  <Badge variant="outline" className="text-primary border-primary/30">
                    🎁 Gift
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              {!compact && (
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {tx.universe_id}
                </TableCell>
              )}
              <TableCell className="text-xs text-muted-foreground">
                {new Date(tx.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
