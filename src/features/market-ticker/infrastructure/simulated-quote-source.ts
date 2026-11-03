import type { RandomFn } from "@/shared/lib/random";

import type { Quote } from "../domain/quote";
import type { QuoteSource } from "../domain/quote-source";

type Seed = { symbol: string; price: number; decimals: number; volatility: number };

/** Seeds of the reference (initPrices): symbol, price, decimals, step volatility. */
const SEEDS: readonly Seed[] = [
  { symbol: "XAUUSD", price: 4025.4, decimals: 2, volatility: 0.00035 },
  { symbol: "XAGUSD", price: 53.08, decimals: 3, volatility: 0.0006 },
  { symbol: "BTCUSD", price: 80036.6, decimals: 1, volatility: 0.0007 },
  { symbol: "ETHUSD", price: 2320.82, decimals: 2, volatility: 0.0009 },
  { symbol: "EURUSD", price: 1.1642, decimals: 5, volatility: 0.00006 },
  { symbol: "GBPUSD", price: 1.3318, decimals: 5, volatility: 0.00007 },
  { symbol: "USDARS", price: 1465.5, decimals: 2, volatility: 0.0002 },
];

/** The reference walks prices every 2 s. */
const STEP_MS = 2000;

type State = Seed & { open: number };

export type SimulatedQuoteSourceOptions = {
  random?: RandomFn;
  now?: () => number;
};

/**
 * Random walk of the reference (walkPrices). Steps are tied to elapsed time, not to the
 * number of requests, so several clients polling don't speed the market up.
 */
export class SimulatedQuoteSource implements QuoteSource {
  readonly isSimulated = true;

  private readonly random: RandomFn;
  private readonly now: () => number;
  private readonly state: Map<string, State>;
  private lastStep: number;

  constructor({ random = Math.random, now = Date.now }: SimulatedQuoteSourceOptions = {}) {
    this.random = random;
    this.now = now;
    this.lastStep = now();
    this.state = new Map(
      SEEDS.map((seed) => [
        seed.symbol,
        { ...seed, open: seed.price * (1 + (random() - 0.5) * 0.008) },
      ]),
    );
  }

  getQuotes(symbols: readonly string[]): Promise<Quote[]> {
    this.advance();
    const quotes = symbols.flatMap((symbol) => {
      const s = this.state.get(symbol);
      return s ? [{ symbol, price: s.price, open: s.open, decimals: s.decimals }] : [];
    });
    return Promise.resolve(quotes);
  }

  private advance() {
    const steps = Math.floor((this.now() - this.lastStep) / STEP_MS);
    if (steps <= 0) return;
    this.lastStep += steps * STEP_MS;
    for (const s of this.state.values()) {
      for (let i = 0; i < steps; i++) {
        s.price = s.price * (1 + (this.random() - 0.5) * 2 * s.volatility);
      }
    }
  }
}
