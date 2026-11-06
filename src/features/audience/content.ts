import { z } from "zod";

import { defineContent } from "@/shared/lib/content";
import { RichTextSchema } from "@/shared/lib/rich-text";

const LinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const audienceContent = defineContent(
  z.object({
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    cards: z
      .array(
        z.object({
          number: z.string().regex(/^\d{2}$/),
          /** Card surface; `accent` is the red card with dark text and a black button. */
          tone: z.enum(["dark", "raised", "accent"]),
          icon: z.enum(["steps", "trend", "community"]),
          tag: z.string().min(1),
          title: z.string().min(1),
          body: RichTextSchema,
          cta: LinkSchema,
        }),
      )
      .length(3),
  }),
  {
    titleLead: "¿A quién está",
    titleHighlight: "dirigido?",
    cards: [
      {
        number: "01",
        tone: "dark",
        icon: "steps",
        tag: "Traders novatos",
        title: "Dando tus primeros pasos.",
        body: [
          "Aprende una habilidad real desde cero. Te enseñamos a leer el mercado, gestionar el riesgo y te ofrecemos cuentas demo para practicar sin riesgo antes de dar el salto al mercado real.",
        ],
        cta: { label: "Quiero aprender desde cero", href: "#contacto" },
      },
      {
        number: "02",
        tone: "raised",
        icon: "trend",
        tag: "Traders con experiencia",
        title: "Lleva tu operativa al siguiente nivel.",
        body: [
          "Accede a herramientas avanzadas, estrategias probadas, indicadores exclusivos por suscripción y análisis de mercado profesionales.",
        ],
        cta: { label: "Ver planes de indicadores", href: "#indicadores" },
      },
      {
        number: "03",
        tone: "accent",
        icon: "community",
        tag: "Líderes e IBs",
        title: "Potencia tu comunidad con EC Markets.",
        body: [
          "Si ya lideras un grupo o eres trader con comunidad, súmate a nuestro equipo. Te ofrecemos las mejores condiciones comerciales, soporte directo y un esquema de trabajo estructurado para escalar juntos en ",
          { strong: "EC Markets" },
          ".",
        ],
        cta: { label: "Sumarme como Partner / IB", href: "#contacto" },
      },
    ],
  },
);
