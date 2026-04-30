import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Database } from "lucide-react";

interface DbErrorPageProps {
  message: string;
}

export function DbErrorPage({ message }: DbErrorPageProps) {
  const isMissingCredentials =
    message.includes("404") ||
    message.includes("not set") ||
    message.includes("your-db-name");

  return (
    <div className="flex min-h-screen items-center justify-center p-6 grid-noise">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex size-14 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Database Connection Failed
          </h1>
        </div>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="text-muted-foreground" />
              Configuration Required
            </CardTitle>
            <CardDescription>
              {isMissingCredentials
                ? "Your Turso database credentials are not configured or are using placeholder values."
                : "Could not connect to the database. Check your credentials."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Error detail */}
            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
              <code className="text-xs text-destructive font-mono break-all">
                {message}
              </code>
            </div>

            {/* Fix instructions */}
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">To fix this:</p>
              <ol className="list-decimal list-inside flex flex-col gap-2 pl-1">
                <li>
                  Create a free database at{" "}
                  <a
                    href="https://turso.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    turso.tech
                  </a>
                </li>
                <li>
                  Update <Badge variant="secondary">.env.local</Badge> with your real credentials:
                </li>
              </ol>

              <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs">
                <div>TURSO_DATABASE_URL=libsql://your-db.turso.io</div>
                <div>TURSO_AUTH_TOKEN=your-real-token</div>
              </div>

              <ol className="list-decimal list-inside flex flex-col gap-2 pl-1" start={3}>
                <li>Restart the dev server</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
