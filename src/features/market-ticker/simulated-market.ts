import { seededRandom, type RandomFn } from "@/shared/lib/random";

import { QuoteSnapshotSchema, TICKER_SYMBOLS, type Quote, type QuoteSnapshot } from "./quotes";

/**
 * Simulated prices: the reference's random walk. To use real prices, write a function that
 * returns the same QuoteSnapshot from a market data API and call it from getLiveQuotes()
 * (see README, "Cómo cambiar el proveedor de cotizaciones").
 */

// Reference seeds: starting price, display decimals and how much it moves per step.
const SEEDS = [
  { symbol: "XAUUSD", price: 4025.4, decimals: 2, volatility: 0.00035 },
  { symbol: "XAGUSD", price: 53.08, decimals: 3, volatility: 0.0006 },
  { symbol: "BTCUSD", price: 80036.6, decimals: 1, volatility: 0.0007 },
  { symbol: "ETHUSD", price: 2320.82, decimals: 2, volatility: 0.0009 },
  { symbol: "EURUSD", price: 1.1642, decimals: 5, volatility: 0.00006 },
  { symbol: "GBPUSD", price: 1.3318, decimals: 5, volatility: 0.00007 },
  { symbol: "USDARS", price: 1465.5, decimals: 2, volatility: 0.0002 },
];

/** Prices move one step every 2 seconds, like the reference. */
const STEP_MS = 2000;

export class SimulatedMarket {
  private readonly prices = new Map<string, Quote & { volatility: number }>();
  private lastStep: number;

  constructor(
    private readonly random: RandomFn = Math.random,
    private readonly now: () => number = Date.now,
  ) {
    this.lastStep = now();
    for (const seed of SEEDS) {
      // The "open" price is a random point up to ±0.4% away, so the change isn't 0 at start.
      const open = seed.price * (1 + (random() - 0.5) * 0.008);
      this.prices.set(seed.symbol, { ...seed, open });
    }
  }

  /** Current quotes for the given symbols, in that order (unknown symbols are skipped). */
  getQuotes(symbols: readonly string[] = TICKER_SYMBOLS): Quote[] {
    this.advance();
    return symbols.flatMap((symbol) => {
      const q = this.prices.get(symbol);
      return q ? [{ symbol, price: q.price, open: q.open, decimals: q.decimals }] : [];
    });
  }

  /** Moves prices by the steps elapsed since last time (several visitors don't speed it up). */
  private advance() {
    const steps = Math.floor((this.now() - this.lastStep) / STEP_MS);
    if (steps <= 0) return;
    this.lastStep += steps * STEP_MS;
    for (const q of this.prices.values()) {
      for (let i = 0; i < steps; i++) {
        q.price = q.price * (1 + (this.random() - 0.5) * 2 * q.volatility);
      }
    }
  }
}

let liveMarket: SimulatedMarket | undefined;

/** Prices for /api/quotes: one market per server, so every visitor sees the same walk. */
export function getLiveQuotes(): QuoteSnapshot {
  liveMarket ??= new SimulatedMarket();
  return QuoteSnapshotSchema.parse({ quotes: liveMarket.getQuotes(), simulated: true });
}

/**
 * Prices baked into the prerendered HTML. They must be the same on every build (no
 * Math.random during prerender), so the market uses a fixed seed. The browser replaces them
 * on its first poll.
 */
export function getInitialQuotes(): QuoteSnapshot {
  const market = new SimulatedMarket(seededRandom(2026), () => 0);
  return { quotes: market.getQuotes(), simulated: true };
}
