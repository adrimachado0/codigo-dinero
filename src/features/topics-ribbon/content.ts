import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

/** Lucide icons available for the topics (mapped to components in ui/topics-ribbon.tsx). */
export const TOPIC_ICONS = [
  "candlestick",
  "levels",
  "scale",
  "stop-loss",
  "plan",
  "journal",
  "clock",
  "gold",
  "forex",
  "crypto",
  "index",
  "risk",
  "analysis",
  "calendar",
] as const;

const TopicSchema = z.object({ label: z.string().min(1), icon: z.enum(TOPIC_ICONS) });

export type Topic = z.infer<typeof TopicSchema>;

export const topicsContent = defineContent(
  z.object({
    label: z.string().min(1),
    creamRibbon: z.array(TopicSchema).min(1),
    redRibbon: z.array(TopicSchema).min(1),
  }),
  {
    label: "Temas",
    creamRibbon: [
      { label: "Velas japonesas", icon: "candlestick" },
      { label: "Soportes y resistencias", icon: "levels" },
      { label: "Tamaño de posición", icon: "scale" },
      { label: "Stop loss", icon: "stop-loss" },
      { label: "Plan de trading", icon: "plan" },
      { label: "Diario de operaciones", icon: "journal" },
      { label: "Sesiones de mercado", icon: "clock" },
    ],
    redRibbon: [
      { label: "XAUUSD", icon: "gold" },
      { label: "FOREX", icon: "forex" },
      { label: "CRIPTO", icon: "crypto" },
      { label: "ÍNDICES", icon: "index" },
      { label: "GESTIÓN DE RIESGO", icon: "risk" },
      { label: "ANÁLISIS TÉCNICO", icon: "analysis" },
      { label: "CALENDARIO ECONÓMICO", icon: "calendar" },
    ],
  },
);
