"use client";

import { useEffect, useRef, useState } from "react";

import type { TradingViewSymbol } from "@/shared/config/markets";
import { cn } from "@/shared/lib/cn";
import { isMotionFrozen } from "@/shared/lib/motion";

/**
 * Official TradingView embed widgets. Each one is the vendor's script with its JSON config
 * inline (that is how the embed reads it), injected only when the frame gets close to the
 * viewport. The caller sizes the frame, so nothing shifts when the iframe arrives (no CLS)
 * and nothing competes with the hero (LCP).
 *
 * Not loaded while motion is frozen (visual tests): live data can't be compared.
 */

const SCRIPT_BASE = "https://s3.tradingview.com/external-embedding/embed-widget-";

type WidgetKind = "advanced-chart" | "mini-symbol-overview" | "market-quotes";

/** Shared look: Spanish, dark, and the page font where TradingView allows it. */
const BASE_CONFIG = { locale: "es", colorTheme: "dark" } as const;

type WidgetProps = {
  kind: WidgetKind;
  config: Record<string, unknown>;
  /** Accessible name of the iframe (TradingView leaves it untitled). */
  title: string;
  /** Distance before the viewport at which the script starts loading. */
  rootMargin?: string;
  className?: string;
};

function TradingViewWidget({ kind, config, title, rootMargin = "300px", className }: WidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const json = JSON.stringify({ ...BASE_CONFIG, ...config });

  useEffect(() => {
    const element = ref.current;
    if (!element || isMotionFrozen()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !near) return;

    const target = document.createElement("div");
    target.className = "tradingview-widget-container__widget";
    target.style.height = "100%";
    const script = document.createElement("script");
    script.src = `${SCRIPT_BASE}${kind}.js`;
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = json;
    element.replaceChildren(target, script);

    // Name the iframe as soon as the embed creates it (axe: frame-title).
    const titles = new MutationObserver(() => {
      for (const frame of element.querySelectorAll("iframe:not([title])")) {
        frame.setAttribute("title", title);
      }
    });
    titles.observe(element, { childList: true, subtree: true });

    return () => {
      titles.disconnect();
      element.replaceChildren();
    };
  }, [near, kind, json, title]);

  return (
    <div
      ref={ref}
      data-tv-widget={kind}
      className={cn("tradingview-widget-container size-full", className)}
    />
  );
}

/** Advanced Chart: full candlestick chart with TradingView's own toolbar. */
export function AdvancedChartWidget({
  symbol,
  interval,
  title,
  className,
}: {
  symbol: string;
  interval: string;
  title: string;
  className?: string;
}) {
  return (
    <TradingViewWidget
      kind="advanced-chart"
      title={title}
      className={className}
      config={{
        symbol,
        interval,
        timezone: "America/Argentina/Buenos_Aires",
        theme: "dark",
        style: "1",
        backgroundColor: "#0F0F0F",
        gridColor: "rgba(255,255,255,0.06)",
        hide_side_toolbar: true,
        allow_symbol_change: false,
        autosize: true,
        support_host: "https://www.tradingview.com",
      }}
    />
  );
}

/** Mini Chart: symbol, last price, change and an area chart. */
export function MiniChartWidget({
  symbol,
  title,
  className,
}: {
  symbol: string;
  title: string;
  className?: string;
}) {
  return (
    <TradingViewWidget
      kind="mini-symbol-overview"
      title={title}
      className={className}
      config={{
        symbol,
        width: "100%",
        height: "100%",
        dateRange: "1M",
        isTransparent: true,
        autosize: true,
        trendLineColor: "rgba(255, 43, 43, 1)",
        underLineColor: "rgba(255, 43, 43, 0.12)",
        underLineBottomColor: "rgba(255, 43, 43, 0)",
        largeChartUrl: "",
      }}
    />
  );
}

/** Market Quotes: list of symbols with price and change. */
export function MarketQuotesWidget({
  group,
  symbols,
  title,
  className,
}: {
  group: string;
  symbols: readonly TradingViewSymbol[];
  title: string;
  className?: string;
}) {
  return (
    <TradingViewWidget
      kind="market-quotes"
      title={title}
      className={className}
      config={{
        width: "100%",
        height: "100%",
        isTransparent: true,
        showSymbolLogo: true,
        symbolsGroups: [
          {
            name: group,
            symbols: symbols.map((s) => ({ name: s.proName, displayName: s.title })),
          },
        ],
      }}
    />
  );
}
