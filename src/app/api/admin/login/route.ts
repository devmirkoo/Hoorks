import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, createSessionCookie } from "@/lib/auth/jwt";
import { rateLimit } from "@/lib/rate-limit";

// Pre-computed dummy hash to normalize response time when user is not found.
// This prevents timing-based username enumeration.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per 15 minutes per IP
  const limited = rateLimit(request, {
    key: "admin-login",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  // Validate username length to prevent DoS with excessively long strings
  if (username.length > 100) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const database = await db();
  const result = await database.execute({
    sql: "SELECT id, username, password_hash FROM admins WHERE username = ?",
    args: [username],
  });

  // Always run bcrypt.compare to normalize response time,
  // whether the user exists or not (prevents timing-based enumeration)
  const admin = result.rows[0];
  const hashToCompare = admin ? String(admin.password_hash) : DUMMY_HASH;
  const passwordValid = await bcrypt.compare(password, hashToCompare);

  if (!admin || !passwordValid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signToken({
    adminId: String(admin.id),
    username: String(admin.username),
  });

  const response = NextResponse.json({
    success: true,
    username: String(admin.username),
  });

  response.headers.set("Set-Cookie", createSessionCookie(token));

  return response;
}
