import { beforeEach, describe, expect, it, vi } from "vitest";

import { CACHE_MS, fetchQuotes, getLiveQuotes, resetQuotesCache } from "./live-quotes";
import { toQuoteView } from "./quotes";

function chart(meta: Record<string, number>) {
  return new Response(JSON.stringify({ chart: { result: [{ meta }] } }));
}

/** Fake Yahoo: every symbol at `price`, +1%; `fail` lists the symbols that error. */
function fakeYahoo(price = 100, fail: string[] = []) {
  return vi.fn((url: string | URL | Request) => {
    const href = url instanceof Request ? url.url : url.toString();
    const source = decodeURIComponent(href.split("/chart/")[1]?.split("?")[0] ?? "");
    if (fail.includes(source)) return Promise.resolve(new Response("nope", { status: 500 }));
    return Promise.resolve(chart({ regularMarketPrice: price, regularMarketChangePercent: 1 }));
  });
}

describe("fetchQuotes", () => {
  it("returns every instrument in the design's order", async () => {
    const { quotes } = await fetchQuotes(fakeYahoo());

    expect(quotes.map((q) => q.symbol)).toEqual([
      "XAUUSD",
      "BTCUSD",
      "XAGUSD",
      "ETHUSD",
      "EURUSD",
      "GBPUSD",
      "USDARS",
    ]);
    expect(quotes[0]).toEqual({ symbol: "XAUUSD", price: 100, changePercent: 1, decimals: 2 });
  });

  it("leaves out the instruments that fail or come malformed", async () => {
    // Silver errors; gold (the first request) comes back malformed.
    const fetchFn = fakeYahoo(100, ["SI=F"]);
    fetchFn.mockImplementationOnce(() => Promise.resolve(new Response("{}")));

    const { quotes } = await fetchQuotes(fetchFn);

    expect(quotes.map((q) => q.symbol)).not.toContain("XAUUSD");
    expect(quotes.map((q) => q.symbol)).not.toContain("XAGUSD");
    expect(quotes).toHaveLength(5);
  });

  it("computes the change from the previous close when Yahoo omits it", async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve(chart({ regularMarketPrice: 110, chartPreviousClose: 100 })),
    );

    const { quotes } = await fetchQuotes(fetchFn);

    expect(quotes[0]?.changePercent).toBeCloseTo(10);
  });

  it("survives network errors", async () => {
    const { quotes } = await fetchQuotes(vi.fn(() => Promise.reject(new Error("offline"))));

    expect(quotes).toEqual([]);
  });
});

describe("getLiveQuotes", () => {
  beforeEach(() => {
    resetQuotesCache();
  });

  it("serves the cached snapshot for a minute", async () => {
    const fetchFn = fakeYahoo();
    await getLiveQuotes(0, fetchFn);
    await getLiveQuotes(CACHE_MS - 1, fetchFn);
    expect(fetchFn).toHaveBeenCalledTimes(7);

    await getLiveQuotes(CACHE_MS, fetchFn);
    expect(fetchFn).toHaveBeenCalledTimes(14);
  });

  it("keeps the last good snapshot when a refresh brings nothing", async () => {
    await getLiveQuotes(0, fakeYahoo(100));
    const offline = vi.fn(() => Promise.reject(new Error("offline")));

    const snapshot = await getLiveQuotes(CACHE_MS, offline);

    expect(snapshot.quotes).toHaveLength(7);
  });
});

describe("toQuoteView", () => {
  it("formats price and change like the design", () => {
    expect(
      toQuoteView({ symbol: "BTCUSD", price: 80123.46, changePercent: 0.154, decimals: 1 }),
    ).toEqual({ symbol: "BTCUSD", price: "80,123.5", change: "+0.15%", direction: "up" });
    expect(
      toQuoteView({ symbol: "EURUSD", price: 1.1642, changePercent: -0.26, decimals: 5 }),
    ).toMatchObject({ price: "1.16420", change: "-0.26%", direction: "down" });
  });
});
