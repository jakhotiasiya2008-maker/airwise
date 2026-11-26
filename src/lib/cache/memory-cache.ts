export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

// Global server instance
export const serverCache = new MemoryCache();

// 10 minutes TTL for air quality as required
export const AQ_CACHE_TTL_MS = 10 * 60 * 1000;
// 20 minutes TTL for guidance cache
export const GUIDANCE_CACHE_TTL_MS = 20 * 60 * 1000;

export function buildGuidanceCacheKey(city: string, aqiBand: string, profileHash: string): string {
  return `guidance:${city.toLowerCase().trim()}:${aqiBand}:${profileHash}`;
}

export function hashProfile(profile: Record<string, unknown>): string {
  const serialized = JSON.stringify(profile, Object.keys(profile).sort());
  let hash = 0;
  for (let i = 0; i < serialized.length; i++) {
    hash = (hash << 5) - hash + serialized.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
