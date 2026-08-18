/**
 * In-memory sliding window rate limiter for Next.js API routes.
 * Limits request frequency by IP address to protect AI routes against abuse.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically purge stale records every 5 minutes
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    for (const [ip, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

/**
 * Checks if a request from an IP exceeds the specified limit in a given window.
 */
export function checkRateLimit(
  ip: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip) || { timestamps: [] };

  // Remove timestamps older than windowMs
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetSeconds,
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(ip, { timestamps: activeTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - activeTimestamps.length,
    reset: Math.ceil(windowMs / 1000),
  };
}

/**
 * Helper to extract client IP from incoming request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
