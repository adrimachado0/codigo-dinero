import { tickerSymbols } from "@/shared/config/markets";
import { PulseDot } from "@/shared/ui/pulse-dot";
import { TickerTapeWidget } from "@/shared/ui/tradingview-widget";

import { tickerContent as labels } from "./content";

/**
 * Header strip: the "Mercados" label and TradingView's Ticker Tape with live quotes. The lane
 * keeps the design's height while the widget loads.
 */
export function MarketTicker() {
  return (
    <div
      role="region"
      aria-label={labels.regionLabel}
      className="mx-auto mt-2.5 flex max-w-nav items-stretch overflow-hidden rounded-full bg-ink"
    >
      <div className="flex flex-none items-center gap-2 pr-4 pl-5 text-11 font-semibold tracking-caps-xl text-accent uppercase">
        <PulseDot />
        <span>{labels.title}</span>
      </div>
      <div data-ticker-lane className="relative h-[38px] min-w-0 flex-auto overflow-hidden">
        <TickerTapeWidget
          symbols={tickerSymbols}
          title={labels.widgetTitle}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}
