import { describe, expect, it } from "vitest";

import { TICKER_SYMBOLS, type Quote } from "../domain/quote";
import type { QuoteSource } from "../domain/quote-source";
import { getTickerQuotes } from "./get-ticker-quotes";

function fakeSource(isSimulated: boolean, quotes: Quote[]): QuoteSource & { asked: string[][] } {
  const asked: string[][] = [];
  return {
    isSimulated,
    asked,
    getQuotes(symbols) {
      asked.push([...symbols]);
      return Promise.resolve(quotes);
    },
  };
}

const gold: Quote = { symbol: "XAUUSD", price: 4000, open: 3990, decimals: 2 };

describe("getTickerQuotes", () => {
  it("asks the source for the ticker symbols and flags simulated data", async () => {
    const source = fakeSource(true, [gold]);

    await expect(getTickerQuotes(source)).resolves.toEqual({ quotes: [gold], simulated: true });
    expect(source.asked).toEqual([[...TICKER_SYMBOLS]]);
  });

  it("reports real data as not simulated", async () => {
    await expect(getTickerQuotes(fakeSource(false, [gold]))).resolves.toMatchObject({
      simulated: false,
    });
  });

  it("rejects invalid data from an adapter", async () => {
    const broken = fakeSource(false, [{ ...gold, price: -1 }]);

    await expect(getTickerQuotes(broken)).rejects.toThrow();
  });
});
