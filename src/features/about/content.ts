import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const aboutContent = defineContent(
  z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
  }),
  {
    eyebrow: "¿Qué es Código Dinero?",
    title: "Convertimos el ruido del mercado en un método",
    body: "Una academia de trading que te acompaña desde tu primera operación. Aprendes a leer el mercado, a gestionar el riesgo y a operar con un plan, con clases claras, análisis de mercado y una comunidad que avanza contigo.",
  },
);
