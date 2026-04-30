"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, SendHorizonal, Webhook } from "lucide-react";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setWebhookUrl(data.webhookUrl || ""))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });
      if (!res.ok) throw new Error();
      toast.success("Webhook URL saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Test failed");
        return;
      }
      toast.success("Test message sent to Discord!");
    } catch {
      toast.error("Failed to test webhook");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="flex flex-col gap-6 p-6 grid-noise min-h-screen">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your bridge integrations</p>
          </div>

          <Card className="glow-border animate-slide-up max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="text-primary" />
                Discord Webhook
              </CardTitle>
              <CardDescription>
                Configure the Discord webhook URL for purchase notifications.
                Falls back to the DISCORD_WEBHOOK_URL environment variable if not set.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {loading ? (
                <div className="h-10 bg-muted rounded-md animate-pulse" />
              ) : (
                <>
                  <Input
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      <Save data-icon="inline-start" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={handleTest} disabled={testing}>
                      <SendHorizonal data-icon="inline-start" />
                      {testing ? "Sending..." : "Test Webhook"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
