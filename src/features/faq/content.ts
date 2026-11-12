import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

const FaqItemSchema = z.object({
  number: z.string().regex(/^\d{2}$/),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type FaqItem = z.infer<typeof FaqItemSchema>;

/** Single source of truth for the FAQ UI and the FAQPage JSON-LD. */
export const faqContent = defineContent(
  z.object({
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    intro: z.string().min(1),
    topics: z.array(z.string().min(1)),
    /** Index open on load (the reference opens the 1st). */
    initialOpen: z.number().int().min(-1),
    items: z.array(FaqItemSchema).min(1),
  }),
  {
    titleLead: "Preguntas",
    titleHighlight: "frecuentes",
    intro: "Lo que necesitas saber antes de empezar. Si tu duda no está aquí, escríbenos.",
    topics: ["Pagos", "Accesos", "Soporte"],
    initialOpen: 0,
    items: [
      {
        number: "01",
        question: "¿Cuánto cuesta?",
        answer:
          "En noviembre, diciembre y enero la formación no tiene costo: solo tienes que crear tu cuenta en EC Markets. Las clases de nuestro canal de YouTube son gratuitas.",
      },
      {
        number: "02",
        question: "¿Necesito experiencia previa?",
        answer:
          "No. La formación empieza desde cero: qué es un mercado, cómo funciona un broker y cómo leer un gráfico. Si ya operas, también encontrarás contenido de análisis y gestión de riesgo para ordenar tu operativa.",
      },
      {
        number: "03",
        question: "¿Cómo accedo a los videos?",
        answer: "Las clases están en nuestro canal de YouTube.",
      },
      {
        number: "04",
        question: "¿Las operaciones que compartimos son recomendaciones?",
        answer:
          "No. Las operaciones y los análisis que compartimos tienen fines exclusivamente educativos y no constituyen asesoramiento financiero ni una recomendación de inversión. Cada persona decide y es responsable de sus operaciones. Operar CFDs, divisas y criptomonedas con apalancamiento conlleva un alto riesgo de perder dinero.",
      },
    ],
  },
);
