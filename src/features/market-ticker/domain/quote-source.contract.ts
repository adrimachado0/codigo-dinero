import { describe, expect, it } from "vitest";

import { QuoteSchema, TICKER_SYMBOLS } from "./quote";
import type { QuoteSource } from "./quote-source";

/** LSP contract: every QuoteSource adapter must pass these. */
export function quoteSourceContract(name: string, create: () => QuoteSource) {
  describe(`QuoteSource contract: ${name}`, () => {
    it("returns one valid quote per known symbol, in the requested order", async () => {
      const quotes = await create().getQuotes(TICKER_SYMBOLS);

      expect(quotes.map((q) => q.symbol)).toEqual([...TICKER_SYMBOLS]);
      for (const quote of quotes) expect(QuoteSchema.safeParse(quote).success).toBe(true);
    });

    it("respects a custom order and skips unknown symbols", async () => {
      const quotes = await create().getQuotes(["EURUSD", "NOPE", "XAUUSD"]);

      expect(quotes.map((q) => q.symbol)).toEqual(["EURUSD", "XAUUSD"]);
    });

    it("returns an empty list for no symbols", async () => {
      await expect(create().getQuotes([])).resolves.toEqual([]);
    });

    it("declares whether it is simulated", () => {
      expect(typeof create().isSimulated).toBe("boolean");
    });
  });
}
