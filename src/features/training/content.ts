import { z } from "zod";

import { links, whatsappLink } from "@/shared/config/links";
import { defineContent } from "@/shared/lib/content";

const ResourceSchema = z.object({
  number: z.string().regex(/^\d{2}$/),
  label: z.string().min(1),
  href: z.string().min(1),
  /** `data-link` id; resources with one open in a new tab. */
  dataLink: z.string().min(1).optional(),
});

export const trainingContent = defineContent(
  z.object({
    tab: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    intro: z.string().min(1),
    resources: z.array(ResourceSchema).length(4),
    featured: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      circularText: z.string().min(1),
    }),
    recordings: z.object({
      text: z.string().min(1),
      labelLines: z.tuple([z.string().min(1), z.string().min(1)]),
    }),
    course: z.object({
      tag: z.string().min(1),
      labelLines: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
    }),
  }),
  {
    tab: "Recursos",
    titleLead: "Nuestros",
    titleHighlight: "recursos",
    intro:
      "Formación, clases, biblioteca e indicadores propios para que aprendas y operes con criterio.",
    resources: [
      { number: "01", label: "Videos en YouTube", href: links.youtube, dataLink: "youtube-canal" },
      { number: "02", label: "Síguenos en TikTok", href: links.tiktok, dataLink: "tiktok" },
      {
        number: "03",
        label: "Síguenos en Instagram",
        href: links.instagram,
        dataLink: "instagram",
      },
      // Opens WhatsApp with the indicator access request.
      { number: "04", label: "Indicadores exclusivos", ...whatsappLink("indicator") },
    ],
    featured: {
      eyebrow: "Tutorial",
      title: "Cómo leer velas japonesas desde cero",
      circularText: "CÓDIGO DINERO ✦ CLASES EN YOUTUBE ✦ GRATIS ✦",
    },
    recordings: {
      text: "Clases grabadas de operaciones reales y análisis paso a paso.",
      labelLines: ["Ver clases", "grabadas"],
    },
    course: {
      tag: "Básico e Intermedio",
      labelLines: ["Ver el Curso Básico", "e Intermedio", "en YouTube"],
    },
  },
);
