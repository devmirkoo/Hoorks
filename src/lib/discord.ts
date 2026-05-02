import { db } from "./db";

interface TransactionData {
  userId: string;
  productId: string;
  gamepassId?: string | null;
  isAGift: boolean;
  gifterId?: string | null;
  amount: number;
  universeId: string;
  placeId: string;
  transactionId: string;
  timestamp: string;
}

async function getWebhookUrl(): Promise<string | null> {
  try {
    const database = await db();
    const result = await database.execute({
      sql: "SELECT value FROM settings WHERE key = 'discord_webhook_url'",
      args: [],
    });

    if (result.rows.length > 0 && result.rows[0].value) {
      return String(result.rows[0].value);
    }
  } catch {
    // Fall through to env var
  }

  return process.env.DISCORD_WEBHOOK_URL || null;
}

function buildEmbed(data: TransactionData) {
  return {
    embeds: [
      {
        title: "🛒 New Purchase",
        color: 5763719,
        fields: [
          { name: "User ID", value: data.userId, inline: true },
          { name: "Product", value: data.productId, inline: true },
          { name: "Amount", value: `R$ ${data.amount}`, inline: true },
          {
            name: "Transaction ID",
            value: data.transactionId,
            inline: false,
          },
          {
            name: "Gift?",
            value: data.isAGift ? "Yes" : "No",
            inline: true,
          },
          {
            name: "Gifter ID",
            value: data.gifterId || "N/A",
            inline: true,
          },
          { name: "Universe ID", value: data.universeId, inline: true },
          { name: "Place ID", value: data.placeId, inline: true },
          {
            name: "Gamepass ID",
            value: data.gamepassId || "N/A",
            inline: true,
          },
        ],
        timestamp: data.timestamp,
        footer: { text: "Hoorks" },
      },
    ],
  };
}

export async function sendDiscordNotification(
  data: TransactionData
): Promise<void> {
  const webhookUrl = await getWebhookUrl();

  if (!webhookUrl) {
    console.warn(
      "[Discord] No webhook URL configured. Skipping notification."
    );
    return;
  }

  try {
    const payload = buildEmbed(data);
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[Discord] Failed to send webhook:", error);
  }
}

export async function sendTestWebhook(webhookUrl: string): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "🧪 Test Notification",
            description:
              "This is a test message from Hoorks. If you see this, your webhook is configured correctly!",
            color: 3066993,
            timestamp: new Date().toISOString(),
            footer: { text: "Hoorks — Test" },
          },
        ],
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
