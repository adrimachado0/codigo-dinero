import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

const LinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const trainingContent = defineContent(
  z.object({
    tab: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    intro: z.string().min(1),
    lessons: z.array(LinkSchema.extend({ number: z.string().regex(/^\d{2}$/) })).length(4),
    featured: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      href: z.string().min(1),
      circularText: z.string().min(1),
    }),
    studyPath: z.object({
      question: z.string().min(1),
      labelLines: z.tuple([z.string().min(1), z.string().min(1)]),
      href: z.string().min(1),
    }),
    youtube: z.object({
      text: z.string().min(1),
      labelLines: z.tuple([z.string().min(1), z.string().min(1)]),
      href: z.string().min(1),
    }),
  }),
  {
    tab: "Qué enseñamos",
    titleLead: "Nuestra",
    titleHighlight: "formación",
    intro:
      "Clases gratuitas en YouTube para aprender a operar con criterio: desde los fundamentos hasta tu propio plan de trading.",
    lessons: [
      { number: "01", label: "Fundamentos del trading", href: "#" },
      { number: "02", label: "Análisis técnico", href: "#" },
      { number: "03", label: "Gestión de riesgo", href: "#" },
      { number: "04", label: "Psicología del trader", href: "#" },
    ],
    featured: {
      eyebrow: "Clase destacada",
      title: "Cómo leer velas japonesas desde cero",
      href: "#",
      circularText: "CÓDIGO DINERO ✦ CLASES EN YOUTUBE ✦ GRATIS ✦",
    },
    studyPath: {
      question: "¿No sabes por dónde empezar con el trading?",
      labelLines: ["Ver la ruta", "de estudio"],
      href: "#",
    },
    youtube: {
      text: "Todas las clases, gratis en nuestro canal.",
      labelLines: ["Ver en", "YouTube"],
      href: "#",
    },
  },
);
