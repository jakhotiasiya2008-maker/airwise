import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryCache } from "@/lib/cache/memory-cache";
import { InMemoryRateLimiter } from "@/lib/rate-limit/in-memory-limiter";

describe("MemoryCache Unit Tests", () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache();
  });

  it("stores and retrieves cached values within TTL", () => {
    cache.set("city:delhi", "AQI 320", 1000);
    expect(cache.get<string>("city:delhi")).toBe("AQI 320");
    expect(cache.size()).toBe(1);
  });

  it("returns null and deletes key when item has expired", () => {
    vi.useFakeTimers();
    cache.set("city:noida", "AQI 340", 500); // 500ms custom TTL

    expect(cache.get<string>("city:noida")).toBe("AQI 340");

    // Advance time past TTL
    vi.advanceTimersByTime(600);

    expect(cache.get<string>("city:noida")).toBeNull();
    vi.useRealTimers();
  });

  it("allows manually deleting and clearing items", () => {
    cache.set("a", "1", 5000);
    cache.set("b", "2", 5000);
    expect(cache.size()).toBe(2);

    cache.delete("a");
    expect(cache.get<string>("a")).toBeNull();
    expect(cache.size()).toBe(1);

    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get<string>("b")).toBeNull();
  });
});

describe("InMemoryRateLimiter Unit Tests", () => {
  let limiter: InMemoryRateLimiter;

  beforeEach(() => {
    // 3 requests allowed per 1000ms window
    limiter = new InMemoryRateLimiter(3, 1000);
  });

  it("allows requests up to the max limit", () => {
    const ip = "192.168.1.100";
    const res1 = limiter.check(ip);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = limiter.check(ip);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = limiter.check(ip);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit with accurate reset time", () => {
    const ip = "192.168.1.101";
    limiter.check(ip);
    limiter.check(ip);
    limiter.check(ip);

    // 4th request must be blocked
    const res4 = limiter.check(ip);
    expect(res4.allowed).toBe(false);
    expect(res4.remaining).toBe(0);
    expect(res4.resetInMs).toBeGreaterThan(0);
    expect(res4.resetInMs).toBeLessThanOrEqual(1000);
  });

  it("resets limits after the window expires", () => {
    vi.useFakeTimers();
    const ip = "192.168.1.102";
    limiter.check(ip);
    limiter.check(ip);
    limiter.check(ip);
    expect(limiter.check(ip).allowed).toBe(false);

    vi.advanceTimersByTime(1100);

    const afterWindow = limiter.check(ip);
    expect(afterWindow.allowed).toBe(true);
    expect(afterWindow.remaining).toBe(2);
    vi.useRealTimers();
  });
});
