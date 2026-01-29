const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20; // requests per window

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, WINDOW_MS);

export async function checkRateLimit(identifier: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: now + WINDOW_MS,
      headers: {
        "X-RateLimit-Limit": MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": (MAX_REQUESTS - 1).toString(),
        "X-RateLimit-Reset": (now + WINDOW_MS).toString(),
      },
    };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: entry.resetTime,
      headers: {
        "X-RateLimit-Limit": MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": entry.resetTime.toString(),
      },
    };
  }

  entry.count++;
  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - entry.count,
    reset: entry.resetTime,
    headers: {
      "X-RateLimit-Limit": MAX_REQUESTS.toString(),
      "X-RateLimit-Remaining": (MAX_REQUESTS - entry.count).toString(),
      "X-RateLimit-Reset": entry.resetTime.toString(),
    },
  };
}
