import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

/**
 * In-memory sliding-window rate limiter.
 * Returns null if allowed, or a 429 NextResponse if rate-limited.
 *
 * @param request - The incoming request
 * @param opts.key - Unique identifier for this limiter (e.g. "login", "make-buy")
 * @param opts.limit - Max requests per window
 * @param opts.windowMs - Window duration in milliseconds
 */
export function rateLimit(
  request: NextRequest,
  opts: { key: string; limit: number; windowMs: number }
): NextResponse | null {
  const { key, limit, windowMs } = opts;

  // Get or create the store for this limiter key
  if (!stores.has(key)) {
    stores.set(key, new Map());
  }
  const store = stores.get(key)!;

  // Extract client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — reset
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(entry.resetAt),
        },
      }
    );
  }

  entry.count++;
  return null;
}

// Periodic cleanup of expired entries (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [, store] of stores) {
      for (const [ip, entry] of store) {
        if (now > entry.resetAt) {
          store.delete(ip);
        }
      }
    }
  }, 5 * 60 * 1000);
}
