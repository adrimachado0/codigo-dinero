import { z } from "zod";

import { site } from "@/shared/config/site";
import { defineContent } from "@/shared/lib/content";

const LinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional(),
  dataLink: z.string().min(1).optional(),
  /** Downloads the file (the legal PDFs) instead of navigating. */
  download: z.boolean().optional(),
});

export const footerContent = defineContent(
  z.object({
    about: z.string().min(1),
    columns: z.array(z.object({ title: z.string().min(1), links: z.array(LinkSchema).min(1) })),
    risk: z.string().min(1),
    copyright: z.string().min(1),
  }),
  {
    about:
      "Código Dinero: formación en trading, análisis de mercado y comunidad para operar con método.",
    columns: [
      // Same destinations as the header menu, plus its "Empezar" button.
      { title: "Navegación", links: [...site.nav.links, site.nav.cta] },
      {
        title: "Formación",
        links: [
          { label: "¿A quién está dirigido?", href: "#para-quien" },
          { label: "Qué es", href: "#que-es" },
          { label: "Quién soy", href: "#quien-soy" },
          { label: "Recursos", href: "#formacion" },
          { label: "Libro y biblioteca", href: "#biblioteca" },
          { label: "Indicador", href: "#indicador" },
          { label: "Mercado", href: "#mercado" },
          { label: "Preguntas frecuentes", href: "#faq" },
        ],
      },
      {
        title: "Legal",
        links: [
          {
            label: "Términos y condiciones",
            href: "/legal/terminos-y-condiciones.pdf",
            download: true,
          },
          {
            label: "Política de privacidad",
            href: "/legal/politica-de-privacidad.pdf",
            download: true,
          },
          { label: "Aviso de riesgo", href: "/legal/aviso-de-riesgo.pdf", download: true },
        ],
      },
    ],
    risk: "Aviso de riesgo: los CFDs, las divisas y las criptomonedas son instrumentos complejos y conllevan un alto riesgo de perder dinero rápidamente debido al apalancamiento. Código Dinero es un espacio de formación y partner de EC MARKETS; no es un broker ni presta asesoramiento financiero. El contenido es educativo y no constituye una recomendación de inversión. Los resultados pasados no garantizan resultados futuros.",
    copyright: "© 2026 Código Dinero. Todos los derechos reservados.",
  },
);
