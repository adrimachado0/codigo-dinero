"use client";

import "@/shared/lib/zod-csp";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/shared/lib/cn";
import { Marquee } from "@/shared/ui/marquee";
import { useLoopAnimation } from "@/shared/ui/use-loop-animation";

import { QuoteSnapshotSchema, toQuoteView, type QuoteSnapshot } from "./quotes";

const POLL_MS = 3000;

type Labels = { regionLabel: string; title: string; simulatedLabel: string };
type TickerBarProps = { initial: QuoteSnapshot; labels: Labels };

const noopSubscribe = () => () => undefined;

/** `false` while prerendering/hydrating, `true` once running in the browser. */
function useIsHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * The prerendered HTML shows the deterministic initial snapshot. Polling (TanStack Query)
 * mounts only after hydration: Query reads the clock, which can't run during prerender.
 */
export function TickerBar({ initial, labels }: TickerBarProps) {
  const hydrated = useIsHydrated();
  const [queryClient] = useState(() => new QueryClient());
  if (!hydrated) return <TickerView snapshot={initial} labels={labels} />;
  return (
    <QueryClientProvider client={queryClient}>
      <LiveTicker initial={initial} labels={labels} />
    </QueryClientProvider>
  );
}

async function fetchQuotes(): Promise<QuoteSnapshot> {
  const response = await fetch("/api/quotes", { cache: "no-store" });
  if (!response.ok) throw new Error(`Quotes request failed: ${String(response.status)}`);
  return QuoteSnapshotSchema.parse(await response.json());
}

function LiveTicker({ initial, labels }: TickerBarProps) {
  const { data } = useQuery({
    queryKey: ["ticker-quotes"],
    queryFn: fetchQuotes,
    initialData: initial,
    initialDataUpdatedAt: 0,
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: false,
  });
  return <TickerView snapshot={data} labels={labels} />;
}

function TickerView({ snapshot, labels }: { snapshot: QuoteSnapshot; labels: Labels }) {
  const quotes = snapshot.quotes.map(toQuoteView);
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
      <Marquee className="min-w-0 flex-auto" duration={44}>
        {quotes.map((q) => (
          <div
            key={q.symbol}
            className="flex items-baseline gap-2.25 border-l border-white/8 px-5.5 py-2.75 whitespace-nowrap tabular-nums"
          >
            <span className="text-13 font-semibold text-white">{q.symbol}</span>
            <span className="text-13 text-fg-soft">{q.price}</span>
            <span
              className={cn(
                "text-12 font-medium",
                q.direction === "up" ? "text-white" : "text-accent",
              )}
            >
              {q.direction === "up" ? "▲" : "▼"} {q.change}
            </span>
          </div>
        ))}
      </Marquee>
      {snapshot.simulated && (
        <div className="flex flex-none items-center pr-5 pl-3.5 text-11 text-fg-subtle">
          {labels.simulatedLabel}
        </div>
      )}
    </div>
  );
}

/** "Mercados" live dot: opacity 1 → 0.25 → 1 every 1.6 s (reference codPulse). */
function PulseDot() {
  const ref = useRef<HTMLSpanElement>(null);
  useLoopAnimation(ref, (dot) =>
    gsap.to(dot, { opacity: 0.25, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 }),
  );
  return <span ref={ref} className="size-1.75 rounded-full bg-accent" />;
}
