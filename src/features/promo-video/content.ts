import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const promoVideoContent = defineContent(
  z.object({
    posterLabel: z.string().min(1),
    playLabel: z.string().min(1),
    playerTitle: z.string().min(1),
    captionLines: z.tuple([z.string().min(1), z.string().min(1)]),
  }),
  {
    posterLabel: "Animación: esfera de partículas y gráfico de precio",
    playLabel: "Reproducir video de presentación",
    playerTitle: "Video de presentación de Código Dinero",
    captionLines: ["Academia de trading", "Video · Remotion"],
  },
);
