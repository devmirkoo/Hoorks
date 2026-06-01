"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ApiKeyCard } from "@/components/api-key-card";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  label: string;
  createdAt: string;
  revoked: boolean;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/keys");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setApiKeys(data.data || []);
    } catch {
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/keys");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!ignore) {
          setApiKeys(data.data || []);
        }
      } catch {
        if (!ignore) toast.error("Failed to load API keys");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="flex flex-col gap-6 p-6 grid-noise min-h-screen">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground mt-1">
              Generate and manage authentication keys for your game servers
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="animate-slide-up">
              <ApiKeyCard apiKeys={apiKeys} onRefresh={fetchKeys} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
