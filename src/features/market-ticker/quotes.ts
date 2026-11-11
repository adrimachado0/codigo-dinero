import { z } from "zod";

/**
 * Instruments of the header strip, in the design's order, with the Yahoo Finance symbol each
 * one is read from. Gold and silver are the COMEX front-month futures (Yahoo has no spot
 * XAU/XAG); the XAUUSD chart below uses TradingView's spot price.
 */
export const TICKER_INSTRUMENTS = [
  { symbol: "XAUUSD", source: "GC=F", decimals: 2 },
  { symbol: "BTCUSD", source: "BTC-USD", decimals: 1 },
  { symbol: "XAGUSD", source: "SI=F", decimals: 3 },
  { symbol: "ETHUSD", source: "ETH-USD", decimals: 2 },
  { symbol: "EURUSD", source: "EURUSD=X", decimals: 4 },
  { symbol: "GBPUSD", source: "GBPUSD=X", decimals: 4 },
  { symbol: "USDARS", source: "ARS=X", decimals: 2 },
] as const;

/** One quote: last price, change against the previous close (%) and display decimals. */
export const QuoteSchema = z.object({
  symbol: z.string().min(1),
  price: z.number().positive(),
  changePercent: z.number(),
  decimals: z.number().int().min(0).max(8),
});

export type Quote = z.infer<typeof QuoteSchema>;

/** What /api/quotes returns: the quotes that could be read, in display order. */
export const QuoteSnapshotSchema = z.object({ quotes: z.array(QuoteSchema) });

export type QuoteSnapshot = z.infer<typeof QuoteSnapshotSchema>;

/** A quote ready to print, formatted like the design (e.g. "80,123.5" "▲ +0.15%"). */
export function toQuoteView(quote: Quote) {
  const up = quote.changePercent >= 0;
  return {
    symbol: quote.symbol,
    price: quote.price.toLocaleString("en-US", {
      minimumFractionDigits: quote.decimals,
      maximumFractionDigits: quote.decimals,
    }),
    change: `${up ? "+" : ""}${quote.changePercent.toFixed(2)}%`,
    direction: up ? ("up" as const) : ("down" as const),
  };
}
