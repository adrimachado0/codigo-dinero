import { tickerContent } from "./content";
import { getInitialQuotes } from "./simulated-market";
import { TickerBar } from "./ticker-bar";

/** Server part: puts the first prices in the HTML; TickerBar then keeps them updated. */
export function MarketTicker() {
  return <TickerBar initial={getInitialQuotes()} labels={tickerContent} />;
}
