"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import { Zap, UserPlus } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Setup failed");
        return;
      }

      toast.success("Admin account created! Redirecting to login...");
      setTimeout(() => router.push("/admin/login"), 1500);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 grid-noise">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary animate-pulse-glow">
            <Zap className="size-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Roblox-Discord Bridge
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Initial Setup
            </p>
          </div>
        </div>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="text-primary" />
              Create Master Account
            </CardTitle>
            <CardDescription>
              Set up your admin credentials. This can only be done once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="setup-username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="setup-username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="setup-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="setup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="setup-confirm"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <Input
                  id="setup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
