"use client";

import "@/shared/lib/zod-csp";

import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { Marquee } from "@/shared/ui/marquee";
import { PulseDot } from "@/shared/ui/pulse-dot";

import { tickerContent as labels } from "./content";
import { QuoteSnapshotSchema, TICKER_INSTRUMENTS, toQuoteView, type Quote } from "./quotes";

/** The server refreshes once a minute; polling faster would only repeat the same prices. */
const POLL_MS = 30_000;

type Row = ReturnType<typeof toQuoteView> | { symbol: string; price: null };

/** Before the first answer every symbol shows "—", so the strip keeps its size. */
const PLACEHOLDER: Row[] = TICKER_INSTRUMENTS.map(({ symbol }) => ({ symbol, price: null }));

function useLiveQuotes(): Row[] {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch("/api/quotes");
        if (!response.ok) return;
        const { quotes: next } = QuoteSnapshotSchema.parse(await response.json());
        // A failed refresh keeps what is already on screen.
        if (alive && next.length > 0) setQuotes(next);
      } catch {
        // Offline or a bad payload: keep the last prices.
      }
    };
    void load();
    const timer = window.setInterval(() => void load(), POLL_MS);
    const onVisible = () => {
      if (!document.hidden) void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return quotes.length > 0 ? quotes.map(toQuoteView) : PLACEHOLDER;
}

/** Header strip: "Mercados" and the live quotes (/api/quotes) scrolling in the design's style. */
export function MarketTicker() {
  const rows = useLiveQuotes();
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
      <Marquee data-ticker-lane className="min-w-0 flex-auto" duration={44}>
        {rows.map((row) => (
          <div
            key={row.symbol}
            className="flex items-baseline gap-2.25 border-l border-white/8 px-5.5 py-2.75 whitespace-nowrap tabular-nums"
          >
            <span className="text-13 font-semibold text-white">{row.symbol}</span>
            <span className="text-13 text-fg-soft">{row.price ?? "—"}</span>
            {"direction" in row && (
              <span
                className={cn(
                  "text-12 font-medium",
                  row.direction === "up" ? "text-white" : "text-accent",
                )}
              >
                {row.direction === "up" ? "▲" : "▼"} {row.change}
              </span>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
