import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const indicatorsContent = defineContent(
  z.object({
    tag: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    plans: z.array(z.string().min(1)).min(1),
    /** Destination pending (docs/PENDIENTES.md). */
    cta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
    chartLabel: z.string().min(1),
  }),
  {
    tag: "Indicadores exclusivos",
    title: "Herramientas profesionales de desarrollo propio.",
    body: "Indicadores avanzados para optimizar entradas, gestión de riesgo y automatización.",
    plans: ["Suscripción mensual", "Suscripción anual"],
    cta: { label: "Ver planes de indicadores", href: "#" },
    chartLabel: "Gráfico ilustrativo con señales de un indicador",
  },
);
