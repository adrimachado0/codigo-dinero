import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

const LinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

const TileSchema = z.object({
  text: z.string().min(1),
  labelLines: z.tuple([z.string().min(1), z.string().min(1)]),
  href: z.string().min(1),
});

export const trainingContent = defineContent(
  z.object({
    tab: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    intro: z.string().min(1),
    resources: z.array(LinkSchema.extend({ number: z.string().regex(/^\d{2}$/) })).length(4),
    featured: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      href: z.string().min(1),
      circularText: z.string().min(1),
    }),
    recordings: TileSchema,
    library: TileSchema,
  }),
  {
    tab: "Recursos",
    titleLead: "Nuestros",
    titleHighlight: "recursos",
    intro:
      "Formación, clases, biblioteca e indicadores propios para que aprendas y operes con criterio.",
    resources: [
      { number: "01", label: "Videos en YouTube", href: "#" },
      { number: "02", label: "Clases grabadas de operaciones reales", href: "#" },
      { number: "03", label: "Biblioteca y estrategias", href: "#" },
      { number: "04", label: "Indicadores exclusivos", href: "#indicadores" },
    ],
    featured: {
      eyebrow: "Formación y clases",
      title: "Cómo leer velas japonesas desde cero",
      href: "#",
      circularText: "CÓDIGO DINERO ✦ CLASES EN YOUTUBE ✦ GRATIS ✦",
    },
    recordings: {
      text: "Clases grabadas de operaciones reales y análisis paso a paso.",
      labelLines: ["Ver clases", "grabadas"],
      href: "#",
    },
    library: {
      text: "Biblioteca y estrategias: libros de trading y metodologías de análisis técnico.",
      labelLines: ["Ir a la", "biblioteca"],
      href: "#",
    },
  },
);
