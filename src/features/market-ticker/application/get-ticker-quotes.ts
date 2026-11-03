import { QuoteSnapshotSchema, TICKER_SYMBOLS, type QuoteSnapshot } from "../domain/quote";
import type { QuoteSource } from "../domain/quote-source";

/** Use case: the ticker snapshot, validated, flagged as simulated when it is. */
export async function getTickerQuotes(
  source: QuoteSource,
  symbols: readonly string[] = TICKER_SYMBOLS,
): Promise<QuoteSnapshot> {
  const quotes = await source.getQuotes(symbols);
  return QuoteSnapshotSchema.parse({ quotes, simulated: source.isSimulated });
}
