import { describe, expect, it } from "vitest";

import { seededRandom } from "@/shared/lib/random";

import { QuoteSchema, TICKER_SYMBOLS } from "./quotes";
import { getInitialQuotes, getLiveQuotes, SimulatedMarket } from "./simulated-market";

describe("SimulatedMarket", () => {
  it("starts from the reference prices and decimals", () => {
    const market = new SimulatedMarket(
      () => 0.5,
      () => 0,
    );

    const quotes = market.getQuotes(["XAUUSD", "XAGUSD", "BTCUSD", "EURUSD", "USDARS"]);

    expect(quotes.map((q) => [q.symbol, q.price, q.decimals])).toEqual([
      ["XAUUSD", 4025.4, 2],
      ["XAGUSD", 53.08, 3],
      ["BTCUSD", 80036.6, 1],
      ["EURUSD", 1.1642, 5],
      ["USDARS", 1465.5, 2],
    ]);
  });

  it("returns every ticker symbol in order, as valid quotes", () => {
    const quotes = new SimulatedMarket().getQuotes();

    expect(quotes.map((q) => q.symbol)).toEqual([...TICKER_SYMBOLS]);
    for (const quote of quotes) expect(QuoteSchema.safeParse(quote).success).toBe(true);
  });

  it("keeps the requested order and skips unknown symbols", () => {
    const quotes = new SimulatedMarket().getQuotes(["EURUSD", "NOPE", "XAUUSD"]);

    expect(quotes.map((q) => q.symbol)).toEqual(["EURUSD", "XAUUSD"]);
  });

  it("moves prices once per 2 seconds, not per request", () => {
    let now = 0;
    const market = new SimulatedMarket(seededRandom(1), () => now);
    const [first] = market.getQuotes(["XAUUSD"]);

    now = 1999;
    expect(market.getQuotes(["XAUUSD"])[0]?.price).toBe(first?.price);

    now = 2000;
    const [next] = market.getQuotes(["XAUUSD"]);
    expect(next?.price).not.toBe(first?.price);
    // One step moves gold at most ±0.035%.
    expect(Math.abs((next?.price ?? 0) / (first?.price ?? 1) - 1)).toBeLessThanOrEqual(0.00035);
  });
});

describe("snapshots", () => {
  it("live quotes are flagged as simulated", () => {
    expect(getLiveQuotes()).toMatchObject({ simulated: true });
  });

  it("initial quotes are identical on every build", () => {
    expect(getInitialQuotes()).toEqual(getInitialQuotes());
  });
});
