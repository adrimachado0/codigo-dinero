import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const promoVideoContent = defineContent(
  z.object({
    posterLabel: z.string().min(1),
    playLabel: z.string().min(1),
    pauseLabel: z.string().min(1),
    seekLabel: z.string().min(1),
    fullscreenLabel: z.string().min(1),
    playerTitle: z.string().min(1),
    caption: z.string().min(1),
  }),
  {
    posterLabel: "Animación: esfera de partículas y gráfico de precio",
    playLabel: "Reproducir video de presentación",
    pauseLabel: "Pausar video",
    seekLabel: "Posición del video",
    fullscreenLabel: "Pantalla completa",
    playerTitle: "Video de presentación de Código Dinero",
    caption: "Academia de trading",
  },
);
