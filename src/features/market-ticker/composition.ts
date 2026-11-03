import { env } from "@/shared/config/env";
import { seededRandom } from "@/shared/lib/random";

import { getTickerQuotes } from "./application/get-ticker-quotes";
import type { QuoteSnapshot } from "./domain/quote";
import type { QuoteSource } from "./domain/quote-source";
import { SimulatedQuoteSource } from "./infrastructure/simulated-quote-source";

/** One factory per QUOTES_PROVIDER value (docs/PENDIENTES.md: how to plug a real provider). */
const quoteSources: Record<typeof env.QUOTES_PROVIDER, () => QuoteSource> = {
  simulated: () => new SimulatedQuoteSource(),
};

function createQuoteSource(): QuoteSource {
  return quoteSources[env.QUOTES_PROVIDER]();
}

let source: QuoteSource | undefined;

/** Live snapshot for /api/quotes (one shared source per server instance). */
export function getLiveTickerQuotes(): Promise<QuoteSnapshot> {
  source ??= createQuoteSource();
  return getTickerQuotes(source);
}

/**
 * Snapshot baked into the prerendered page. It must be deterministic (no Math.random during
 * prerender), so it uses a seeded simulation; the client replaces it on its first poll.
 */
export function getInitialTickerQuotes(): Promise<QuoteSnapshot> {
  return getTickerQuotes(new SimulatedQuoteSource({ random: seededRandom(2026), now: () => 0 }));
}
