import { z } from "zod";

import { QuoteSnapshotSchema, TICKER_INSTRUMENTS, type Quote, type QuoteSnapshot } from "./quotes";

/**
 * Live prices for the header strip from Yahoo Finance's public chart endpoint (no key).
 * Read on the server only: the browser asks /api/quotes, so there is no CORS or CSP to open,
 * and one cache serves every visitor.
 */

const ENDPOINT = "https://query1.finance.yahoo.com/v8/finance/chart/";
/** Prices are refreshed at most once a minute, whatever the traffic. */
export const CACHE_MS = 60_000;
const TIMEOUT_MS = 5_000;

const ChartSchema = z.object({
  chart: z.object({
    result: z
      .array(
        z.object({
          meta: z.object({
            regularMarketPrice: z.number().positive(),
            chartPreviousClose: z.number().positive().optional(),
            regularMarketChangePercent: z.number().optional(),
          }),
        }),
      )
      .min(1),
  }),
});

type Fetch = typeof fetch;

/** Last price and daily change of one Yahoo symbol, or `null` if it can't be read. */
async function readChart(source: string, fetchFn: Fetch) {
  try {
    const response = await fetchFn(
      `${ENDPOINT}${encodeURIComponent(source)}?range=1d&interval=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CodigoDinero/1.0)" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    const meta = ChartSchema.parse(await response.json()).chart.result[0]?.meta;
    if (!meta) return null;
    const previous = meta.chartPreviousClose;
    const changePercent =
      meta.regularMarketChangePercent ??
      (previous ? ((meta.regularMarketPrice - previous) / previous) * 100 : 0);
    return { price: meta.regularMarketPrice, changePercent };
  } catch {
    return null;
  }
}

/** Every instrument, in display order; the ones that fail are left out. */
export async function fetchQuotes(fetchFn: Fetch = fetch): Promise<QuoteSnapshot> {
  const results = await Promise.all(
    TICKER_INSTRUMENTS.map(async ({ symbol, source, decimals }) => {
      const chart = await readChart(source, fetchFn);
      return chart ? [{ symbol, decimals, ...chart } satisfies Quote] : [];
    }),
  );
  return QuoteSnapshotSchema.parse({ quotes: results.flat() });
}

let cached: { at: number; snapshot: QuoteSnapshot } | undefined;

/**
 * Quotes for /api/quotes, cached in memory for CACHE_MS. A refresh that brings nothing keeps
 * the last good snapshot.
 */
export async function getLiveQuotes(now = Date.now(), fetchFn: Fetch = fetch) {
  if (cached && now - cached.at < CACHE_MS) return cached.snapshot;
  const snapshot = await fetchQuotes(fetchFn);
  if (snapshot.quotes.length > 0 || !cached) cached = { at: now, snapshot };
  return cached.snapshot;
}

/** Test helper: forget the cached snapshot. */
export function resetQuotesCache() {
  cached = undefined;
}
