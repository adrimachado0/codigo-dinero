import { z } from "zod";

/** Symbols shown in the ticker, in display order. */
export const TICKER_SYMBOLS = [
  "XAUUSD",
  "XAGUSD",
  "BTCUSD",
  "ETHUSD",
  "EURUSD",
  "GBPUSD",
  "USDARS",
] as const;

/** One quote: current price, the price the daily change is measured from, display decimals. */
export const QuoteSchema = z.object({
  symbol: z.string().min(1),
  price: z.number().positive(),
  open: z.number().positive(),
  decimals: z.number().int().min(0).max(8),
});

export type Quote = z.infer<typeof QuoteSchema>;

/** What /api/quotes returns. `simulated: true` keeps the "Simulado" label visible. */
export const QuoteSnapshotSchema = z.object({
  quotes: z.array(QuoteSchema),
  simulated: z.boolean(),
});

export type QuoteSnapshot = z.infer<typeof QuoteSnapshotSchema>;

/** A quote ready to print, formatted exactly like the reference (e.g. "80,123.5" "▲ +0.15%"). */
export function toQuoteView(quote: Quote) {
  const change = ((quote.price - quote.open) / quote.open) * 100;
  const up = change >= 0;
  return {
    symbol: quote.symbol,
    price: quote.price.toLocaleString("en-US", {
      minimumFractionDigits: quote.decimals,
      maximumFractionDigits: quote.decimals,
    }),
    change: `${up ? "+" : ""}${change.toFixed(2)}%`,
    direction: up ? ("up" as const) : ("down" as const),
  };
}
