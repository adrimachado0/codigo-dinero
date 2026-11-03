import { getInitialTickerQuotes } from "../composition";
import { tickerContent } from "../content";
import { TickerBar } from "./ticker-bar";

/** Server entry: prerenders the deterministic first snapshot, then the client island polls. */
export async function MarketTicker() {
  const initial = await getInitialTickerQuotes();
  return <TickerBar initial={initial} labels={tickerContent} />;
}
