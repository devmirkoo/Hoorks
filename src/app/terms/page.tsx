import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertTriangle,
  ArrowRight,
  FileText,
  Key,
  Server,
  Shield,
  User,
} from "lucide-react";

const UPDATED_AT = "June 1, 2026";

const HIGHLIGHTS = [
  {
    title: "Responsible use",
    description:
      "Use Hoorks only to integrate Roblox servers with Discord and comply with platform rules.",
    icon: Shield,
  },
  {
    title: "Security",
    description:
      "You are responsible for protecting admin credentials and API keys.",
    icon: Key,
  },
  {
    title: "Availability",
    description:
      "The service is provided as-is without guarantees of uninterrupted uptime.",
    icon: Server,
  },
  {
    title: "Admin account",
    description:
      "The master admin account can be created once and controls dashboard access.",
    icon: User,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen grid-noise">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-2">
            <div
              className="size-7 bg-primary"
              style={{
                maskImage: "url(/logo.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskImage: "url(/logo.svg)",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
              }}
            />
            <span className="font-semibold text-sm tracking-tight">Hoorks</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" size="sm">
                Docs
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="secondary" size="sm">
                Terms
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="ghost" size="sm">
                Privacy
              </Button>
            </Link>
            <ThemeToggle />
            <Link href="/admin">
              <Button size="sm">
                Admin
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 mb-10 animate-fade-in">
            <Badge variant="outline" className="w-fit border-primary/30 text-primary">
              Terms of Service • Last updated: {UPDATED_AT}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Hoorks Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              These terms govern the use of Hoorks, the serverless platform that connects
              Roblox servers to Discord with real-time notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
            <aside className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
              <Card className="glow-border">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                    Key points
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {HIGHLIGHTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="text-primary size-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{item.title}</div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="glow-border">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                    Quick index
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground flex flex-col gap-2">
                  {[
                    { href: "#acceptance", label: "1. Acceptance" },
                    { href: "#service", label: "2. Service description" },
                    { href: "#admin", label: "3. Admin account" },
                    { href: "#api", label: "4. API keys" },
                    { href: "#use", label: "5. Acceptable use" },
                    { href: "#availability", label: "6. Availability" },
                    { href: "#liability", label: "7. Liability limits" },
                    { href: "#changes", label: "8. Changes" },
                    { href: "#law", label: "9. Governing law" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </CardContent>
              </Card>
            </aside>

            <div className="flex flex-col gap-10">
              <section id="acceptance" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">1. Acceptance of terms</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  By using Hoorks you agree to these Terms of Service. If you do not agree,
                  you must not use the service.
                </p>
              </section>

              <section id="service" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">2. Service description</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Hoorks provides a serverless API that receives purchase events from Roblox
                  game servers, stores them, and sends notifications to a Discord webhook.
                  The service does not process payments or handle funds.
                </p>
              </section>

              <section id="admin" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <User className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">3. Admin account</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The master admin account is created once during setup. You are responsible
                  for keeping credentials secure and managing access appropriately.
                </p>
              </section>

              <section id="api" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">4. API keys and security</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  API keys are confidential. If a key is suspected to be compromised, revoke
                  it immediately and issue a replacement.
                </p>
              </section>

              <section id="use" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">5. Acceptable use</h2>
                </div>
                <div className="text-muted-foreground leading-relaxed flex flex-col gap-4">
                  <p>
                    You may use Hoorks only to integrate your Roblox servers with Discord.
                    The following are prohibited:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Fraud, spam, or attempts to bypass security controls.</li>
                    <li>Sending unauthorized data or illegal content.</li>
                    <li>Violating Roblox or Discord terms and policies.</li>
                    <li>Excessive load or denial-of-service attempts.</li>
                  </ul>
                </div>
              </section>

              <section id="availability" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">6. Availability and maintenance</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Hoorks is provided as-is. We do not guarantee continuous uptime or error-free
                  operation. The service may be suspended for maintenance or updates.
                </p>
              </section>

              <section id="liability" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">
                    7. Limitation of liability
                  </h2>
                </div>
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    [⚠️ LEGAL REVIEW REQUIRED]
                  </p>
                  <p className="mt-2">
                    To the maximum extent permitted by law, Hoorks is not liable for indirect,
                    incidental, or consequential damages, including loss of profits or data.
                  </p>
                </div>
              </section>

              <section id="changes" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">8. Changes to terms</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these terms to reflect changes to the service. If changes are
                  material, we will post a notice in the dashboard or project channels.
                </p>
              </section>

              <section id="law" className="scroll-mt-24">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="text-primary size-5" />
                  <h2 className="text-2xl font-semibold">9. Governing law</h2>
                </div>
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    [⚠️ LEGAL REVIEW REQUIRED]
                  </p>
                  <p className="mt-2">
                    Specify the governing jurisdiction and venue based on the legal location
                    of the service.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold mb-3">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You can contact the project maintainer at{" "}
                  <span className="text-foreground">devmirkoo@gmail.com</span>. Telegram or
                  Discord: <span className="text-foreground">@devmirko</span>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
