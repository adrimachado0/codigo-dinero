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

export const QuoteSchema = z.object({
  symbol: z.string().min(1),
  price: z.number().positive(),
  /** Reference price the daily change is computed against. */
  open: z.number().positive(),
  /** Decimals used to display the price. */
  decimals: z.number().int().min(0).max(8),
});

export type Quote = z.infer<typeof QuoteSchema>;

export const QuoteSnapshotSchema = z.object({
  quotes: z.array(QuoteSchema),
  /** True while the source is simulated: the UI must keep the "Simulado" label visible. */
  simulated: z.boolean(),
});

export type QuoteSnapshot = z.infer<typeof QuoteSnapshotSchema>;

export type QuoteView = {
  symbol: string;
  price: string;
  change: string;
  direction: "up" | "down";
};

/** Display values exactly as the reference formats them (en-US grouping, ▲/▼ sign rules). */
export function toQuoteView(quote: Quote): QuoteView {
  const change = ((quote.price - quote.open) / quote.open) * 100;
  const up = change >= 0;
  return {
    symbol: quote.symbol,
    price: quote.price.toLocaleString("en-US", {
      minimumFractionDigits: quote.decimals,
      maximumFractionDigits: quote.decimals,
    }),
    change: `${up ? "+" : ""}${change.toFixed(2)}%`,
    direction: up ? "up" : "down",
  };
}
