"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Key,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/admin/api-keys", label: "API Keys", icon: Key },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary">
          <Zap data-icon="inline-start" className="text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            RDB Bridge
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Admin Panel
          </span>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  isActive && "glow-border font-medium"
                )}
              >
                <Icon data-icon="inline-start" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 font-normal text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut data-icon="inline-start" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
