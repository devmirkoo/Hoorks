import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth/jwt";
import { generateApiKey } from "@/lib/auth/api-key";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const database = await db();
  const result = await database.execute({
    sql: "SELECT id, label, created_at, revoked FROM api_keys ORDER BY created_at DESC",
    args: [],
  });

  return NextResponse.json({
    success: true,
    data: result.rows.map((row) => ({
      id: row.id,
      label: row.label,
      createdAt: row.created_at,
      revoked: Boolean(row.revoked),
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { label?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const label = body.label || "Untitled Key";
  const id = uuidv4();
  const { raw, hash } = generateApiKey();

  const database = await db();
  await database.execute({
    sql: "INSERT INTO api_keys (id, key_hash, label) VALUES (?, ?, ?)",
    args: [id, hash, label],
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        id,
        label,
        rawKey: raw, // Shown exactly once
      },
    },
    { status: 201 }
  );
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const keyId = searchParams.get("id");

  if (!keyId) {
    return NextResponse.json(
      { error: "Key ID is required" },
      { status: 400 }
    );
  }

  const database = await db();
  await database.execute({
    sql: "UPDATE api_keys SET revoked = 1 WHERE id = ?",
    args: [keyId],
  });

  return NextResponse.json({ success: true });
}
