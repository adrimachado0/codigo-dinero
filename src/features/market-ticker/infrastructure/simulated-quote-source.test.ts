import { describe, expect, it } from "vitest";

import { seededRandom } from "@/shared/lib/random";

import { quoteSourceContract } from "../domain/quote-source.contract";
import { SimulatedQuoteSource } from "./simulated-quote-source";

quoteSourceContract("SimulatedQuoteSource", () => new SimulatedQuoteSource());

describe("SimulatedQuoteSource", () => {
  it("starts from the reference seeds with their decimals", async () => {
    const source = new SimulatedQuoteSource({ random: () => 0.5, now: () => 0 });

    const quotes = await source.getQuotes(["XAUUSD", "XAGUSD", "BTCUSD", "EURUSD", "USDARS"]);

    expect(quotes.map((q) => [q.symbol, q.price, q.decimals])).toEqual([
      ["XAUUSD", 4025.4, 2],
      ["XAGUSD", 53.08, 3],
      ["BTCUSD", 80036.6, 1],
      ["EURUSD", 1.1642, 5],
      ["USDARS", 1465.5, 2],
    ]);
    expect(source.isSimulated).toBe(true);
  });

  it("walks prices by elapsed time (one step per 2 s), not per request", async () => {
    let now = 0;
    const source = new SimulatedQuoteSource({ random: seededRandom(1), now: () => now });
    const [first] = await source.getQuotes(["XAUUSD"]);

    now = 1999;
    const [sameStep] = await source.getQuotes(["XAUUSD"]);
    expect(sameStep?.price).toBe(first?.price);

    now = 2000;
    const [nextStep] = await source.getQuotes(["XAUUSD"]);
    expect(nextStep?.price).not.toBe(first?.price);
    // Each step moves at most ±volatility (0.035% for gold).
    expect(Math.abs((nextStep?.price ?? 0) / (first?.price ?? 1) - 1)).toBeLessThanOrEqual(0.00035);
  });

  it("is deterministic with a seeded random", async () => {
    const a = await new SimulatedQuoteSource({ random: seededRandom(9), now: () => 0 }).getQuotes([
      "BTCUSD",
    ]);
    const b = await new SimulatedQuoteSource({ random: seededRandom(9), now: () => 0 }).getQuotes([
      "BTCUSD",
    ]);

    expect(a).toEqual(b);
  });
});
