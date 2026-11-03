import { ConsoleLeadRepository } from "./infrastructure/console-lead-repository";
import { NoopRateLimiter } from "./infrastructure/noop-rate-limiter";

/** Adapters for lead capture. Swap here when the real destination/limiter exist. */
export const leadCaptureDeps = {
  repository: new ConsoleLeadRepository(),
  rateLimiter: new NoopRateLimiter(),
};
