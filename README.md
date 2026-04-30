# Roblox-Discord Bridge

A serverless API bridge built with **Next.js 14+** that securely connects Roblox game servers to Discord via webhooks.

## Features

- **Serverless API** — Built on Next.js App Router, optimized for Vercel deployment
- **Secure Authentication** — SHA-256 hashed API keys with constant-time comparison
- **Discord Webhooks** — Rich embed notifications for every purchase
- **Admin Dashboard** — Manage transactions, API keys, and settings
- **Turso Database** — Edge-compatible SQLite database via libsql

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your values
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Navigate to `/admin` to set up your master account

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Turso (libsql) |
| Auth | JWT (httpOnly cookies) + bcrypt |
| Notifications | Discord Webhooks |
| Deployment | Vercel |

## API Endpoints

- `POST /api/make-buy` — Record a purchase (requires API key)
- `GET /api/items` — List transactions (requires API key)

## Environment Variables

```
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
JWT_SECRET=your-secret
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

## License

Private — All rights reserved.
