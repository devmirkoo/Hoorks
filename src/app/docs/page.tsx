import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Zap, ArrowLeft, Copy } from "lucide-react";

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="code-block overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-muted/30">
          <span className="text-xs text-muted-foreground font-mono">{title}</span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-[0.8125rem] leading-relaxed">{children}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen grid-noise">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 h-14">
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
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft data-icon="inline-start" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            API Reference
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Documentation
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Everything you need to integrate your Roblox game with the Hoorks API.
            Follow these examples to start sending purchase notifications.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Authentication */}
          <Card className="glow-border animate-slide-up">
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                All API requests must include your API key in the <code className="text-primary font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">X-API-KEY</code> header.
                Generate an API key from the admin dashboard.
              </p>
              <CodeBlock title="Header">{`X-API-KEY: rdb_a1b2c3d4e5f6...`}</CodeBlock>
            </CardContent>
          </Card>

          <Separator />

          {/* POST /api/make-buy */}
          <Card className="glow-border animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">POST</Badge>
                <CardTitle className="font-mono text-lg">/api/make-buy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Record a new purchase transaction and send a Discord notification.
              </p>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Request</h4>
                <CodeBlock title="POST /api/make-buy">{`POST /api/make-buy HTTP/1.1
Host: your-app.vercel.app
Content-Type: application/json
X-API-KEY: rdb_a1b2c3d4e5f6...

{
  "userId": "123456789",
  "productId": "sword-of-fire",
  "gamepassId": "GP-001",
  "isAGift": false,
  "gifterId": null,
  "amount": 499,
  "universeId": "987654321",
  "placeId": "111222333",
  "transactionId": "TXN-abc-123-def",
  "timestamp": "2025-01-15T14:30:00Z",
  "itemType": "Gamepass"
}`}</CodeBlock>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Response <Badge variant="secondary">201 Created</Badge></h4>
                <CodeBlock title="Response">{`{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "userId": "123456789",
    "productId": "sword-of-fire",
    "transactionId": "TXN-abc-123-def",
    "amount": 499,
    "createdAt": "2025-01-15T14:30:01Z"
  }
}`}</CodeBlock>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Error <Badge variant="destructive">401</Badge></h4>
                <CodeBlock title="Error Response">{`{
  "error": "Invalid or missing API key"
}`}</CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* GET /api/items */}
          <Card className="glow-border animate-slide-up" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">GET</Badge>
                <CardTitle className="font-mono text-lg">/api/items</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Retrieve paginated transaction records.
              </p>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Query Parameters</h4>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-2 font-medium">Param</th>
                        <th className="text-left px-4 py-2 font-medium">Default</th>
                        <th className="text-left px-4 py-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-mono text-primary text-xs">limit</td>
                        <td className="px-4 py-2 text-muted-foreground">50</td>
                        <td className="px-4 py-2 text-muted-foreground">Max 200</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-mono text-primary text-xs">offset</td>
                        <td className="px-4 py-2 text-muted-foreground">0</td>
                        <td className="px-4 py-2 text-muted-foreground">Pagination offset</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-mono text-primary text-xs">userId</td>
                        <td className="px-4 py-2 text-muted-foreground">—</td>
                        <td className="px-4 py-2 text-muted-foreground">Filter by user</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-primary text-xs">transactionId</td>
                        <td className="px-4 py-2 text-muted-foreground">—</td>
                        <td className="px-4 py-2 text-muted-foreground">Filter by transaction ID. If provided, other filters are ignored.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-primary text-xs">itemType</td>
                        <td className="px-4 py-2 text-muted-foreground">—</td>
                        <td className="px-4 py-2 text-muted-foreground">Filter by item type: <code className="text-primary font-mono text-xs bg-primary/10 px-1 py-0.5 rounded">Gamepass</code> or <code className="text-primary font-mono text-xs bg-primary/10 px-1 py-0.5 rounded">DeveloperProduct</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Request</h4>
                <CodeBlock title="GET /api/items">{`GET /api/items?limit=10&offset=0&userId=123456789&itemType=Gamepass HTTP/1.1
Host: your-app.vercel.app
X-API-KEY: rdb_a1b2c3d4e5f6...`}</CodeBlock>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Response <Badge variant="secondary">200 OK</Badge></h4>
                <CodeBlock title="Response">{`{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0
  }
}`}</CodeBlock>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Roblox Lua Example */}
          <Card className="glow-border animate-slide-up" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle>Roblox Lua Integration</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Ready-to-use Lua snippet for your Roblox game. Drop this into a server Script.
              </p>
              <CodeBlock title="ServerScript.lua">{`local HttpService = game:GetService("HttpService")
local MarketplaceService = game:GetService("MarketplaceService")

local API_URL: string = "https://your-app.vercel.app/api/make-buy"
local API_KEY: string = "rdb_your_key_here"

export type ItemType = "Gamepass" | "DeveloperProduct"

type PurchaseData = {
    userId: string,
    productId: string,
    gamepassId: string?,
    isAGift: boolean,
    gifterId: string?,
    amount: number,
    universeId: string,
    placeId: string,
    transactionId: string,
    timestamp: string,
    itemType: ItemType,
}

local function recordPurchase(
    player: Player,
    productId: string,
    amount: number,
    itemType: ItemType,
    gamepassId: string?
)
    local data: PurchaseData = {
        userId = tostring(player.UserId),
        productId = productId,
        gamepassId = gamepassId,
        isAGift = false,
        gifterId = nil,
        amount = amount,
        universeId = tostring(game.GameId),
        placeId = tostring(game.PlaceId),
        transactionId = HttpService:GenerateGUID(false),
        timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ"),
        itemType = itemType,
    }

    local success: boolean, response = pcall(function()
        return HttpService:RequestAsync({
            Url = API_URL,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json",
                ["X-API-KEY"] = API_KEY
            },
            Body = HttpService:JSONEncode(data)
        })
    end)

    if success then
        print("[Hoorks] Purchase recorded:", response.StatusCode)
    else
        warn("[Hoorks] Failed to record purchase:", response)
    end
end

-- Gamepass purchase callback
MarketplaceService.PromptGamePassPurchaseFinished:Connect(
    function(player: Player, gamepassId: number, wasPurchased: boolean)
        if not wasPurchased then return end
        local info = MarketplaceService:GetProductInfo(gamepassId, Enum.InfoType.GamePass)
        recordPurchase(
            player,
            info.Name or tostring(gamepassId),
            info.PriceInRobux or 0,
            "Gamepass",
            tostring(gamepassId)
        )
    end
)

-- Developer Product purchase callback
MarketplaceService.ProcessReceipt = function(receiptInfo: {
    PlayerId: number,
    ProductId: number,
    PurchaseId: string,
})
    local player: Player? = game:GetService("Players"):GetPlayerByUserId(receiptInfo.PlayerId)
    if not player then return Enum.ProductPurchaseDecision.NotProcessedYet end

    local info = MarketplaceService:GetProductInfo(receiptInfo.ProductId, Enum.InfoType.Product)
    recordPurchase(
        player,
        info.Name or tostring(receiptInfo.ProductId),
        info.PriceInRobux or 0,
        "DeveloperProduct",
        nil
    )

    return Enum.ProductPurchaseDecision.PurchaseGranted
end`}</CodeBlock>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between text-xs text-muted-foreground">
          <span>Hoorks — API Documentation</span>
          <Link href="/admin" className="hover:text-foreground transition-colors">
            Admin Dashboard →
          </Link>
        </div>
      </footer>
    </div>
  );
}
