import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 3 attempts per 15 minutes per IP
  const limited = rateLimit(request, {
    key: "admin-setup",
    limit: 3,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  const database = await db();

  // Check if any admin already exists
  const existing = await database.execute({
    sql: "SELECT COUNT(*) as count FROM admins",
    args: [],
  });

  if (Number(existing.rows[0]?.count) > 0) {
    return NextResponse.json(
      { error: "Setup has already been completed. Only one master account is allowed." },
      { status: 403 }
    );
  }

  let body: { username?: string; password?: string; confirmPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password, confirmPassword } = body;

  if (!username || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "Username, password, and password confirmation are required" },
      { status: 400 }
    );
  }

  if (username.length < 3) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 12);

  await database.execute({
    sql: "INSERT INTO admins (id, username, password_hash) VALUES (?, ?, ?)",
    args: [id, username, passwordHash],
  });

  return NextResponse.json(
    { success: true, message: "Admin account created successfully" },
    { status: 201 }
  );
}

export async function GET() {
  const database = await db();
  const result = await database.execute({
    sql: "SELECT COUNT(*) as count FROM admins",
    args: [],
  });

  const hasAdmin = Number(result.rows[0]?.count) > 0;

  return NextResponse.json({ hasAdmin });
}
