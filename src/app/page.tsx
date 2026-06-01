import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Shield, ArrowRight, Server, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen grid-noise">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 h-14">
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
                WebkitMaskPosition: "center"
              }} 
            />
            <span className="font-semibold text-sm tracking-tight">Hoorks</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/docs">
              <Button variant="ghost" size="sm">
                <BookOpen data-icon="inline-start" />
                Docs
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

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center pt-32 pb-20 px-6">
        <Badge variant="outline" className="mb-8 animate-fade-in border-primary/30 text-primary">
          Roblox to Discord • Secure • Deploy-Ready
        </Badge>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight max-w-3xl leading-tight animate-fade-in pb-2">
          <span className="bg-gradient-to-r from-primary via-primary/60 to-primary bg-clip-text text-transparent animate-text-gradient">
            Hoorks
          </span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-medium mt-4 text-foreground/90 animate-fade-in">
          Simple. Lightweight. Fast. Secure.
        </h2>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl animate-slide-up leading-relaxed">
          A powerful serverless API platform designed to seamlessly connect your Roblox 
          game servers to Discord. Track purchases, manage API keys, and receive real-time notifications.
        </p>
        <div className="flex gap-3 mt-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Link href="/docs">
            <Button size="lg">
              <BookOpen data-icon="inline-start" />
              Read the Docs
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="lg">
              Open Dashboard
              <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Features */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Server,
              title: "Serverless API",
              desc: "Built on Next.js App Router with Vercel-optimized serverless functions. Zero cold-start overhead.",
            },
            {
              icon: Shield,
              title: "Secure by Design",
              desc: "SHA-256 hashed API keys, bcrypt admin auth, JWT httpOnly cookies, constant-time comparisons.",
            },
            {
              icon: MessageSquare,
              title: "Discord Webhooks",
              desc: "Rich embed notifications for every purchase. Configurable webhook URL with test functionality.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 glow-border animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-5xl flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Hoorks</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>Deployed on Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
