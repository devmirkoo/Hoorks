"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Copy, Key, Ban } from "lucide-react";

interface ApiKey {
  id: string;
  label: string;
  createdAt: string;
  revoked: boolean;
}

interface ApiKeyCardProps {
  apiKeys: ApiKey[];
  onRefresh: () => void;
}

export function ApiKeyCard({ apiKeys, onRefresh }: ApiKeyCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel || "Untitled Key" }),
      });

      if (!res.ok) throw new Error("Failed to generate key");

      const data = await res.json();
      setGeneratedKey(data.data.rawKey);
      setShowDialog(true);
      setNewLabel("");
      onRefresh();
    } catch {
      toast.error("Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevoke = async (keyId: string) => {
    try {
      const res = await fetch(`/api/admin/keys?id=${keyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to revoke key");
      toast.success("API key revoked");
      onRefresh();
    } catch {
      toast.error("Failed to revoke key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <Card className="glow-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for Roblox server authentication
              </CardDescription>
            </div>
          </div>

          {/* Generate new key form */}
          <div className="flex gap-2 pt-2">
            <Input
              placeholder="Key label (e.g., Production Server)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleGenerate} disabled={isGenerating}>
              <Plus data-icon="inline-start" />
              {isGenerating ? "Generating..." : "Generate Key"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                <Key className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No API keys yet. Generate one to get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{key.label}</span>
                      {key.revoked ? (
                        <Badge variant="destructive">Revoked</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Created{" "}
                      {new Date(key.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {!key.revoked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRevoke(key.id)}
                    >
                      <Ban data-icon="inline-start" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Key Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Copy this key now. You will not be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <code className="flex-1 break-all font-mono text-xs text-primary">
                {generatedKey}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedKey)}
              >
                <Copy data-icon="inline-start" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Store this key securely. Use it in the <code>X-API-KEY</code>{" "}
              header for all API requests from your Roblox game server.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
