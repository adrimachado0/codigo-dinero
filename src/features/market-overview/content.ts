import { z } from "zod";

import { markets, type TradingViewSymbol } from "@/shared/config/markets";
import { defineContent } from "@/shared/lib/content";

const SymbolSchema = z.custom<TradingViewSymbol>();

export const marketContent = defineContent(
  z.object({
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    intro: z.string().min(1),
    source: z.string().min(1),
    /** Featured mini charts, in order. */
    featured: z.array(z.object({ symbol: SymbolSchema, title: z.string().min(1) })).length(2),
    /** Tabs of the quotes card; the first one starts selected. */
    groups: z
      .array(z.object({ name: z.string().min(1), symbols: z.array(SymbolSchema).min(1) }))
      .min(1),
    tabsLabel: z.string().min(1),
    quotesTitle: z.string().min(1),
  }),
  {
    titleLead: "Cotizaciones en",
    titleHighlight: "tiempo real",
    intro: "El Oro y Bitcoin primero, junto a los metales, criptomonedas y divisas que seguimos.",
    source: "Datos de mercado: TradingView",
    featured: [
      { symbol: markets.gold, title: "Gráfico de XAUUSD (TradingView)" },
      { symbol: markets.bitcoin, title: "Gráfico de BTCUSD (TradingView)" },
    ],
    groups: [
      { name: "Metales", symbols: [markets.gold, markets.silver] },
      { name: "Cripto", symbols: [markets.bitcoin, markets.ether] },
      { name: "Forex", symbols: [markets.euro, markets.pound, markets.peso] },
    ],
    tabsLabel: "Mercados",
    quotesTitle: "Cotizaciones de TradingView",
  },
);
