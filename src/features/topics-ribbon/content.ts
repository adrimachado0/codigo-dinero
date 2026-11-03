import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const topicsContent = defineContent(
  z.object({
    label: z.string().min(1),
    creamRibbon: z.string().min(1),
    redRibbon: z.string().min(1),
  }),
  {
    label: "Temas",
    creamRibbon:
      "Velas japonesas ✦ Soportes y resistencias ✦ Tamaño de posición ✦ Stop loss ✦ Plan de trading ✦ Diario de operaciones ✦ Sesiones de mercado ✦",
    redRibbon:
      "XAUUSD ✦ FOREX ✦ CRIPTO ✦ ÍNDICES ✦ GESTIÓN DE RIESGO ✦ ANÁLISIS TÉCNICO ✦ CALENDARIO ECONÓMICO ✦",
  },
);
