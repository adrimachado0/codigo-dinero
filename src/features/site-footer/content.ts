import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

const LinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const footerContent = defineContent(
  z.object({
    about: z.string().min(1),
    columns: z.array(z.object({ title: z.string().min(1), links: z.array(LinkSchema).min(1) })),
    risk: z.string().min(1),
    copyright: z.string().min(1),
  }),
  {
    about:
      "Código Dinero, academia de trading. Formación, análisis de mercado y comunidad para operar con método.",
    columns: [
      {
        title: "Navegación",
        links: [
          { label: "Inicio", href: "#inicio" },
          { label: "Escuela", href: "#" },
          { label: "Calendario", href: "#" },
          { label: "Mercado", href: "#" },
          { label: "Equipo", href: "#" },
          { label: "Empezar", href: "#" },
        ],
      },
      {
        title: "Academia",
        links: [
          { label: "¿A quién está dirigido?", href: "#para-quien" },
          { label: "Qué es", href: "#que-es" },
          { label: "Quién soy", href: "#quien-soy" },
          { label: "Recursos", href: "#formacion" },
          { label: "Indicadores", href: "#indicadores" },
          { label: "Preguntas frecuentes", href: "#faq" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Términos y condiciones", href: "#" },
          { label: "Política de privacidad", href: "#" },
          { label: "Aviso de riesgo", href: "#" },
        ],
      },
    ],
    risk: "Aviso de riesgo: los CFDs, las divisas y las criptomonedas son instrumentos complejos y conllevan un alto riesgo de perder dinero rápidamente debido al apalancamiento. Código Dinero es una academia de formación y partner de EC MARKETS; no es un broker ni presta asesoramiento financiero. El contenido es educativo y no constituye una recomendación de inversión. Los resultados pasados no garantizan resultados futuros.",
    copyright: "© 2026 Código Dinero. Todos los derechos reservados.",
  },
);
