import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const tickerContent = defineContent(
  z.object({
    regionLabel: z.string().min(1),
    title: z.string().min(1),
    simulatedLabel: z.string().min(1),
  }),
  {
    regionLabel: "Cotizaciones",
    title: "Mercados",
    simulatedLabel: "Simulado",
  },
);
