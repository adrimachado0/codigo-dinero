/** TradingView symbol (exchange prefix) and the label shown for it. */
export type TradingViewSymbol = { proName: string; title: string };

/**
 * Instruments the site follows (TradingView symbols with exchange prefix). Gold and Bitcoin
 * are featured; the rest are grouped in the "Cotizaciones en tiempo real" tabs.
 */
export const markets = {
  gold: { proName: "OANDA:XAUUSD", title: "XAUUSD" },
  bitcoin: { proName: "BITSTAMP:BTCUSD", title: "BTCUSD" },
  silver: { proName: "OANDA:XAGUSD", title: "XAGUSD" },
  ether: { proName: "BITSTAMP:ETHUSD", title: "ETHUSD" },
  euro: { proName: "FX:EURUSD", title: "EURUSD" },
  pound: { proName: "FX:GBPUSD", title: "GBPUSD" },
  peso: { proName: "FX_IDC:USDARS", title: "USDARS" },
} as const satisfies Record<string, TradingViewSymbol>;
