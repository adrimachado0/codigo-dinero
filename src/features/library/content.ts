import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

const LibraryItemSchema = z.object({
  kind: z.string().min(1),
  /** Spine and label color. */
  tone: z.enum(["accent", "gold"]),
  /** Drawing in the middle of the cover. */
  motif: z.enum(["candles", "zone", "curve"]),
  title: z.string().min(1),
});

export type LibraryItem = z.infer<typeof LibraryItemSchema>;

/** Example covers until the real ones arrive (docs/PENDIENTES.md). */
const PLACEHOLDER_TITLE = "[Título del recurso]";

export const libraryContent = defineContent(
  z.object({
    eyebrow: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    lead: z.string().min(1),
    body: z.string().min(1),
    chips: z.array(z.string().min(1)).min(1),
    /** Opens WhatsApp with the book message. */
    buyCta: z.string().min(1),
    /** Alt text of the cover photo, and the accessible name of the link around it. */
    cover: z.object({ alt: z.string().min(1), linkLabel: z.string().min(1) }),
    library: z.object({
      /** Shows the library grid under the book. */
      visible: z.boolean(),
      title: z.string().min(1),
      note: z.string().min(1),
      requestCta: z.string().min(1),
      items: z.array(LibraryItemSchema).min(1),
    }),
  }),
  {
    eyebrow: "Libro y biblioteca",
    titleLead: "Domina la estructura del mercado:",
    titleHighlight: "El método Código Dinero",
    lead: "Deja de adivinar hacia dónde va el precio y aprende a operar con precisión institucional.",
    body: "El trading no se trata de indicadores mágicos, se trata de entender dónde está la liquidez. En este libro condenso la metodología exacta basada en Smart Money Concepts (SMC) y análisis de Order Flow para que construyas tu propio plan de trading desde cero. Aprenderás a leer el gráfico como los profesionales, gestionar tu riesgo de forma estricta y detectar las zonas de alta probabilidad antes de que el movimiento suceda.",
    chips: ["Smart Money Concepts", "Order Flow", "Gestión de riesgo"],
    buyCta: "Comprar el libro por WhatsApp",
    cover: {
      alt: "Portada del libro Domina la estructura del mercado: El método Código Dinero, de Ángel Jesús González",
      linkLabel: "Pedir el libro Domina la estructura del mercado por WhatsApp",
    },
    library: {
      // Hidden until there are more books (decision of the site owner).
      visible: false,
      title: "Biblioteca",
      note: "Portadas de ejemplo: se reemplazan por las reales.",
      requestCta: "Solicitar por WhatsApp",
      items: [
        { kind: "E-book", tone: "accent", motif: "candles", title: PLACEHOLDER_TITLE },
        { kind: "Guía", tone: "gold", motif: "zone", title: PLACEHOLDER_TITLE },
        { kind: "Estrategia", tone: "accent", motif: "curve", title: PLACEHOLDER_TITLE },
        { kind: "Checklist", tone: "gold", motif: "candles", title: PLACEHOLDER_TITLE },
        { kind: "Plantilla", tone: "accent", motif: "zone", title: PLACEHOLDER_TITLE },
        { kind: "Manual", tone: "gold", motif: "curve", title: PLACEHOLDER_TITLE },
      ],
    },
  },
);
