import type { Quote } from "./quote";

/** Port: where quotes come from (simulated today; a real market data API later). */
export interface QuoteSource {
  readonly isSimulated: boolean;
  /** Returns one quote per known symbol, in the requested order. Unknown symbols are skipped. */
  getQuotes(symbols: readonly string[]): Promise<Quote[]>;
}
