import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const indicatorContent = defineContent(
  z.object({
    tag: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    lead: z.string().min(1),
    body: z.string().min(1),
    /** The last chip is highlighted in red. */
    chips: z.array(z.string().min(1)).min(1),
    /** Opens WhatsApp with the indicator message. */
    cta: z.string().min(1),
    chartTitle: z.string().min(1),
    attribution: z.string().min(1),
  }),
  {
    tag: "Indicador exclusivo",
    titleLead: "Indicador Institucional Premium:",
    titleHighlight: "Precisión en cada entrada",
    lead: "Automatiza tu análisis de Smart Money y Order Flow en TradingView.",
    body: "Desarrollado en Pine Script v6, este indicador es la herramienta definitiva para quienes operan scalping y day trading. Diseñado específicamente para detectar Order Blocks, quiebres de estructura y desequilibrios en temporalidades bajas (1m, 3m y 5m). Ideal para dominar activos de alta volatilidad como el Oro (XAUUSD) y Bitcoin (BTC), eliminando el ruido del gráfico y mostrándote únicamente las zonas clave para gatillar tus entradas con confianza.",
    chips: ["Pine Script v6", "Scalping y day trading", "1m · 3m · 5m", "XAUUSD"],
    cta: "Solicitar acceso al indicador por WhatsApp",
    chartTitle: "Gráfico de velas de XAUUSD en 3 minutos (TradingView)",
    attribution: "Gráfico de XAUUSD por TradingView",
  },
);
