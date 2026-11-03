import type { StaticImageData } from "next/image";
import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

// Reviews are placeholders until real ones arrive (docs/PENDIENTES.md). Never invent them.
const ReviewSchema = z.object({
  name: z.string().min(1),
  meta: z.string().min(1),
  quote: z.string().min(1),
  /** Optional avatar (square image); without it, the reference's user icon is shown. */
  avatar: z.custom<StaticImageData>().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;

export const testimonialsContent = defineContent(
  z.object({
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    intro: z.string().min(1),
    previousLabel: z.string().min(1),
    nextLabel: z.string().min(1),
    joinCta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
    carouselLabel: z.string().min(1),
    /** Index of the review active on load (the reference starts on the 2nd). */
    initialIndex: z.number().int().min(0),
    reviews: z.array(ReviewSchema).min(1),
  }),
  {
    titleLead: "Lo que dice la",
    titleHighlight: "comunidad",
    intro: "Reseñas de alumnos que estudian y operan con Código Dinero.",
    previousLabel: "Reseña anterior",
    nextLabel: "Reseña siguiente",
    joinCta: { label: "Quiero sumarme", href: "#" },
    carouselLabel: "Reseñas de alumnos",
    initialIndex: 1,
    reviews: [
      {
        name: "[Nombre del alumno]",
        meta: "[Ciudad] · Alumno",
        quote: "[Reseña de un alumno: qué aprendió y cómo cambió su forma de operar.]",
      },
      {
        name: "[Nombre del alumno]",
        meta: "[Ciudad] · Alumno",
        quote:
          "[Reseña de un alumno: qué fue lo que más le sirvió de la formación o de la comunidad.]",
      },
      {
        name: "[Nombre del alumno]",
        meta: "[Ciudad] · Alumno",
        quote: "[Reseña de un alumno: cómo empezó y dónde está hoy con su operativa.]",
      },
    ],
  },
);
