<div align="center">

<img src="./public/logo.svg" alt="Hoorks Logo" width="120" />

# Hoorks

**A serverless Next.js API platform that connects Roblox game servers to Discord via webhooks — track purchases, manage transactions, and receive real-time notifications.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdevmirkoo%2Froblox-discord-bridge)

</div>

---

## ✨ Features

- 🚀 **Serverless API** — Deploy anywhere with zero infrastructure to manage
- 🔐 **Secure Auth** — SHA-256 hashed API keys with constant-time comparison
- 💬 **Discord Webhooks** — Rich embed notifications for every transaction
- 📊 **Admin Dashboard** — Full-featured panel at `/admin` for managing keys, viewing transactions & stats
- 🗄️ **Turso DB** — Edge-ready SQLite powered by libSQL
- ⚡ **Rate Limiting** — Built-in per-route rate limiting (60 req/min)
- ✅ **Input Validation** — Strict request body validation on all endpoints
- 🎮 **Roblox-native** — Supports Gamepasses, Developer Products, and gift transactions

---

## 🛠️ Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| **Framework**  | Next.js 16 (App Router)              |
| **Language**   | TypeScript (strict mode)             |
| **Styling**    | Tailwind CSS + shadcn/ui             |
| **Database**   | Turso (libSQL)                       |
| **Auth**       | JWT + bcrypt (admin), SHA-256 API keys |
| **Webhooks**   | Discord Webhook API                  |
| **Deployment** | Vercel (serverless)                  |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **>= 18**
- [npm](https://www.npmjs.com/) **>= 9**
- A [Turso](https://turso.tech/) account & database
- A [Discord Webhook URL](https://support.discord.com/hc/en-us/articles/228383668)

### 1. Clone the repository

```bash
git clone https://github.com/devmirkoo/Hoorks.git
cd roblox-discord-bridge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values (see [Environment Variables](#-environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the landing page will load.  
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

---

## 📡 API Reference

All API endpoints require an API key passed via the `x-api-key` header.

### `POST /api/make-buy`

Record a new purchase transaction and fire a Discord notification.

**Headers**

```
x-api-key: your-api-key
Content-Type: application/json
```

**Request Body**

```json
{
  "userId": "123456789",
  "productId": "100",
  "gamepassId": "200",
  "isAGift": false,
  "gifterId": null,
  "amount": 499,
  "universeId": "987654321",
  "placeId": "111222333",
  "transactionId": "txn_abc123",
  "timestamp": "2026-06-01T12:00:00Z",
  "itemType": "Gamepass"
}
```

**Response — `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "userId": "123456789",
    "productId": "100",
    "transactionId": "txn_abc123",
    "amount": 499,
    "createdAt": "2026-06-01T12:00:00.000Z"
  }
}
```

**Error — `409 Conflict`** (duplicate transaction)

```json
{
  "error": "Duplicate transaction",
  "transactionId": "txn_abc123"
}
```

---

### `GET /api/items`

List recorded transactions with filtering and pagination.

**Headers**

```
x-api-key: your-api-key
```

**Query Parameters**

| Parameter       | Type     | Default | Description                            |
| --------------- | -------- | ------- | -------------------------------------- |
| `limit`         | `number` | `50`    | Results per page (max 200)             |
| `offset`        | `number` | `0`     | Pagination offset                      |
| `userId`        | `string` | —       | Filter by Roblox user ID              |
| `transactionId` | `string` | —       | Filter by transaction ID              |
| `gifterId`      | `string` | —       | Filter by gifter ID                   |
| `itemType`      | `string` | —       | `Gamepass` or `DeveloperProduct`       |

**Response — `200 OK`**

```json
{
  "success": true,
  "data": [ /* transaction objects */ ],
  "pagination": {
    "total": 142,
    "limit": 50,
    "offset": 0
  }
}
```

---

### Admin API Routes

Protected routes under `/api/admin/*` power the admin dashboard. These require JWT authentication obtained through the admin login flow at `/admin/login`.

---

## 📁 Project Structure

```
roblox-discord-bridge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── make-buy/route.ts    # POST — record purchase
│   │   │   └── items/route.ts       # GET  — list transactions
│   │   ├── admin/                   # Admin dashboard pages
│   │   │   ├── api-keys/page.tsx
│   │   │   ├── transactions/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── setup/page.tsx
│   │   │   └── login/page.tsx
│   │   ├── docs/page.tsx            # API documentation page
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing page
│   ├── components/                  # React components + shadcn/ui
│   ├── hooks/                       # Custom React hooks
│   └── lib/
│       ├── auth/                    # API key & JWT utilities
│       ├── db.ts                    # Turso client
│       ├── discord.ts               # Webhook integration
│       ├── rate-limit.ts            # Rate limiter
│       ├── schema.ts                # DB schema
│       └── validators.ts            # Input validation
├── public/                          # Static assets
├── .env.example                     # Environment variable template
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🔑 Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable             | Description                                  | Required |
| -------------------- | -------------------------------------------- | :------: |
| `TURSO_DATABASE_URL` | Your Turso database URL                      |    ✅    |
| `TURSO_AUTH_TOKEN`   | Auth token for Turso                         |    ✅    |
| `JWT_SECRET`         | Secret for signing admin JWTs                |    ✅    |
| `DISCORD_WEBHOOK_URL`| Fallback Discord webhook (overridable in UI) |    ✅    |

> [!CAUTION]
> Never commit `.env.local` or any file containing real secrets. The `.gitignore` already excludes it.

---

## Deployment

### One-Click Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdevmirkoo%2Froblox-discord-bridge&env=TURSO_DATABASE_URL,TURSO_AUTH_TOKEN,JWT_SECRET,DISCORD_WEBHOOK_URL)

1. Click the button above
2. Set the required environment variables in the Vercel dashboard
3. Deploy — your bridge is live 🎉

### Manual Deployment

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## Security

If you discover a security vulnerability, please **do not** open a public issue. Instead, follow the responsible disclosure process outlined in [SECURITY.md](SECURITY.md).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[GitHub](https://github.com/devmirkoo/Hoorks)** · **[Issues](https://github.com/devmirkoo/Hoorks/issues)** · **[Discussions](https://github.com/devmirkoo/Hoorks/discussions)**

Built with ❤️ by [devmirkoo](https://github.com/devmirkoo)

</div>
