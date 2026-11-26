interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 60, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(ip: string): { allowed: boolean; remaining: number; resetInMs: number } {
    const now = Date.now();
    const record = this.records.get(ip);

    if (!record || now > record.resetAt) {
      this.records.set(ip, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetInMs: this.windowMs,
      };
    }

    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetInMs: Math.max(0, record.resetAt - now),
      };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  // Periodic cleanup of expired records to prevent unbounded memory growth
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.records.entries()) {
      if (now > value.resetAt) {
        this.records.delete(key);
      }
    }
  }
}

export const apiRateLimiter = new InMemoryRateLimiter(60, 60 * 1000); // 60 req/min per IP
