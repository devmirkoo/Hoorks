import { createClient, type Client } from "@libsql/client";
import { SQL_SCHEMA } from "./schema";

let client: Client | null = null;
let initialized = false;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error("TURSO_DATABASE_URL environment variable is not set");
    }

    client = createClient({
      url,
      authToken,
    });
  }

  return client;
}

export async function initializeDatabase(): Promise<void> {
  if (initialized) return;

  const db = getDb();
  const statements = SQL_SCHEMA.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await db.execute(statement);
  }

  initialized = true;
}

// Ensure the database is initialized on first use
export async function db() {
  await initializeDatabase();
  return getDb();
}
