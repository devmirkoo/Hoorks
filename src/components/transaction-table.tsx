"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Gift,
  Inbox,
  X,
  Ticket,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface Transaction {
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

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

interface TransactionTableProps {
  transactions: Transaction[];
  compact?: boolean;
  /** When true, sorting and filtering happens server-side via callbacks */
  serverSide?: boolean;
  onSort?: (key: SortKey, direction: SortDirection) => void;
  onGiftFilterChange?: (filter: boolean | null) => void;
  currentSort?: SortState;
  currentGiftFilter?: boolean | null;
}

function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortState;
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentSort.key === sortKey;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-150",
        "hover:text-foreground cursor-pointer select-none",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
      <span className="inline-flex size-4 items-center justify-center">
        {isActive ? (
          currentSort.direction === "asc" ? (
            <ArrowUp className="size-3.5" />
          ) : (
            <ArrowDown className="size-3.5" />
          )
        ) : (
          <ArrowUpDown className="size-3 opacity-40" />
        )}
      </span>
    </button>
  );
}

function GiftToggle({
  filter,
  onChange,
}: {
  filter: boolean | null;
  onChange: (val: boolean | null) => void;
}) {
  const cycle = () => {
    if (filter === null) onChange(true); // Show only gifts
    else if (filter === true) onChange(false); // Show only non-gifts
    else onChange(null); // Reset — show all
  };

  return (
    <button
      onClick={cycle}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-150",
        "hover:text-foreground cursor-pointer select-none",
        filter === true
          ? "text-primary"
          : filter === false
          ? "text-destructive"
          : "text-muted-foreground"
      )}
      title={
        filter === null
          ? "Show all — Click to filter gifts only"
          : filter === true
          ? "Showing gifts — Click to show non-gifts"
          : "Showing non-gifts — Click to show all"
      }
    >
      Gift
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full size-5 text-[10px] font-bold transition-all duration-200",
          filter === true
            ? "bg-primary/20 text-primary ring-1 ring-primary/30"
            : filter === false
            ? "bg-destructive/20 text-destructive ring-1 ring-destructive/30"
            : "bg-muted text-muted-foreground"
        )}
      >
        {filter === true ? (
          <Gift className="size-3" />
        ) : filter === false ? (
          <X className="size-3" />
        ) : (
          <ArrowUpDown className="size-3 opacity-40" />
        )}
      </span>
    </button>
  );
}

function TransactionIdCell({ value }: { value: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="truncate max-w-[200px] text-left"
        >
          {value}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {value}
      </TooltipContent>
    </Tooltip>
  );
}

export function TransactionTable({
  transactions,
  compact = false,
  serverSide = false,
  onSort,
  onGiftFilterChange,
  currentSort: externalSort,
  currentGiftFilter: externalGiftFilter,
}: TransactionTableProps) {
  // Local state for client-side sorting
  const [localSort, setLocalSort] = useState<SortState>({
    key: "created_at",
    direction: "desc",
  });
  const [localGiftFilter, setLocalGiftFilter] = useState<boolean | null>(null);

  const sort = externalSort || localSort;
  const giftFilter =
    externalGiftFilter !== undefined ? externalGiftFilter : localGiftFilter;

  const handleSort = (key: SortKey) => {
    const newDirection: SortDirection =
      sort.key === key && sort.direction === "desc" ? "asc" : "desc";
    if (serverSide && onSort) {
      onSort(key, newDirection);
    } else {
      setLocalSort({ key, direction: newDirection });
    }
  };

  const handleGiftFilter = (val: boolean | null) => {
    if (serverSide && onGiftFilterChange) {
      onGiftFilterChange(val);
    } else {
      setLocalGiftFilter(val);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Transaction ID copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  // Client-side sort + filter
  const displayData = useMemo(() => {
    if (serverSide) return transactions;

    let filtered = [...transactions];

    // Gift filter
    if (giftFilter === true) {
      filtered = filtered.filter((tx) => tx.is_a_gift === 1);
    } else if (giftFilter === false) {
      filtered = filtered.filter((tx) => tx.is_a_gift === 0);
    }

    // Sort
    filtered.sort((a, b) => {
      const key = sort.key;
      const valA = a[key];
      const valB = b[key];

      // Numeric comparison for amount and is_a_gift
      if (key === "amount" || key === "is_a_gift") {
        const nA = Number(valA);
        const nB = Number(valB);
        return sort.direction === "asc" ? nA - nB : nB - nA;
      }

      // String comparison
      const sA = String(valA ?? "").toLowerCase();
      const sB = String(valB ?? "").toLowerCase();
      const cmp = sA.localeCompare(sB);
      return sort.direction === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [transactions, sort, giftFilter, serverSide]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Inbox className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <TooltipProvider delayDuration={500}>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                label="User ID"
                sortKey="user_id"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Product"
                sortKey="product_id"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Amount"
                sortKey="amount"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            {!compact && (
              <TableHead>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  TXN ID
                </span>
              </TableHead>
            )}
            <TableHead>
              <GiftToggle filter={giftFilter} onChange={handleGiftFilter} />
            </TableHead>
            {!compact && (
              <TableHead>
                <SortableHeader
                  label="Gifter"
                  sortKey="gifter_id"
                  currentSort={sort}
                  onSort={handleSort}
                />
              </TableHead>
            )}
            <TableHead>
              <SortableHeader
                label="Type"
                sortKey="item_type"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
            {!compact && (
              <TableHead>
                <SortableHeader
                  label="Universe"
                  sortKey="universe_id"
                  currentSort={sort}
                  onSort={handleSort}
                />
              </TableHead>
            )}
            <TableHead>
              <SortableHeader
                label="Date"
                sortKey="created_at"
                currentSort={sort}
                onSort={handleSort}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((tx) => (
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
                <TableCell className="font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 min-w-0">
                    <TransactionIdCell value={tx.transaction_id} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(tx.transaction_id)}
                      aria-label="Copy transaction ID"
                    >
                      <Copy data-icon="inline-start" />
                    </Button>
                  </div>
                </TableCell>
              )}
              <TableCell>
                {tx.is_a_gift ? (
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/30 gap-1"
                  >
                    <Gift className="size-3" />
                    Gift
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              {!compact && (
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {tx.gifter_id || "—"}
                </TableCell>
              )}
              <TableCell>
                {tx.item_type ? (
                  <Badge variant="secondary" className="gap-1">
                    {tx.item_type === "Gamepass" ? (
                      <Ticket className="size-3" />
                    ) : (
                      <ShoppingCart className="size-3" />
                    )}
                    {tx.item_type}
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
      </TooltipProvider>
    </div>
  );
}
