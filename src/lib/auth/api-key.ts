import { createHash, timingSafeEqual } from "crypto";
import { db } from "../db";
import { NextRequest, NextResponse } from "next/server";

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function validateApiKey(
  request: NextRequest
): Promise<{ valid: boolean; response?: NextResponse }> {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      ),
    };
  }

  const keyHash = hashApiKey(apiKey);

  const database = await db();
  const result = await database.execute({
    sql: "SELECT key_hash FROM api_keys WHERE revoked = 0",
    args: [],
  });

  const isValid = result.rows.some((row) => {
    const storedHash = String(row.key_hash);
    try {
      const a = Buffer.from(keyHash, "hex");
      const b = Buffer.from(storedHash, "hex");
      if (a.length !== b.length) return false;
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });

  if (!isValid) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      ),
    };
  }

  return { valid: true };
}

export function generateApiKey(): { raw: string; hash: string } {
  const bytes = require("crypto").randomBytes(36);
  const key = `rdb_${bytes.toString("base64url")}`;
  return {
    raw: key,
    hash: hashApiKey(key),
  };
}
