import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const aboutContent = defineContent(
  z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    /** Labels under the bull (left) and the bear (right). */
    buyLabel: z.string().min(1),
    sellLabel: z.string().min(1),
    /** Controls of the candlestick video (screen reader names). */
    video: z.object({
      playerTitle: z.string().min(1),
      playLabel: z.string().min(1),
      pauseLabel: z.string().min(1),
      replayLabel: z.string().min(1),
      seekLabel: z.string().min(1),
      fullscreenLabel: z.string().min(1),
    }),
  }),
  {
    eyebrow: "¿Qué es Código Dinero?",
    title: "Convertimos el ruido del mercado en un método",
    body: "Un espacio de formación en trading que te acompaña desde tu primera operación. Aprendes a leer el mercado, a gestionar el riesgo y a operar con un plan, con clases claras, análisis de mercado y una comunidad que avanza contigo.",
    buyLabel: "Buy · Compra",
    sellLabel: "Sell · Venta",
    video: {
      playerTitle: "Video: cómo leer velas japonesas",
      playLabel: "Reproducir video",
      pauseLabel: "Pausar video",
      replayLabel: "Ver de nuevo",
      seekLabel: "Posición del video",
      fullscreenLabel: "Pantalla completa",
    },
  },
);
