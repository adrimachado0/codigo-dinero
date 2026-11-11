"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

import type { TradingViewSymbol } from "@/shared/config/markets";
import { cn } from "@/shared/lib/cn";
import { MarketQuotesWidget } from "@/shared/ui/tradingview-widget";

type Group = { name: string; symbols: readonly TradingViewSymbol[] };

/** Metales / Cripto / Forex tabs over TradingView's Market Quotes of the selected group. */
export function QuotesTabs({
  groups,
  label,
  widgetTitle,
}: {
  groups: readonly Group[];
  label: string;
  widgetTitle: string;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const group = groups[active] ?? groups[0];

  // Arrow keys move between tabs (WAI-ARIA tabs, automatic activation).
  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + groups.length) % groups.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
        {groups.map((g, index) => {
          const selected = index === active;
          return (
            <button
              key={g.name}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${String(index)}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                setActive(index);
              }}
              className={cn(
                // The ::after widens the hit area to 44px without changing the design's pill.
                "relative cursor-pointer rounded-full px-3.5 py-[7px] font-sans text-13 font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-[7px] after:content-['']",
                selected
                  ? "border-0 bg-accent text-ink"
                  : "border border-white/24 bg-transparent text-fg-soft hover:border-white hover:text-white",
              )}
            >
              {g.name}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${String(active)}`}
        data-quotes-panel
        className="relative mt-3.5 h-[305px]"
      >
        {group && (
          <MarketQuotesWidget
            key={group.name}
            group={group.name}
            symbols={group.symbols}
            title={widgetTitle}
            className="absolute inset-0"
          />
        )}
      </div>
    </>
  );
}
