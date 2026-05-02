"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("size-9 rounded-full", className)}
        disabled
      >
        <span className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-9 rounded-full transition-colors hover:bg-accent",
        className
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="size-[18px] text-muted-foreground transition-transform hover:rotate-45 duration-300" />
      ) : (
        <Moon className="size-[18px] text-muted-foreground transition-transform hover:-rotate-12 duration-300" />
      )}
    </Button>
  );
}
