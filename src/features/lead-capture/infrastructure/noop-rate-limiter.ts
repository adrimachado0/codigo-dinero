import type { RateLimiter } from "../domain/lead";

/**
 * Allows every request. Placeholder for a real limiter (e.g. Upstash/Redis sliding window),
 * see docs/PENDIENTES.md.
 */
export class NoopRateLimiter implements RateLimiter {
  consume(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
