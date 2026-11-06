import { z } from "zod";

import { defineContent } from "@/shared/lib/content";
import { RichTextSchema } from "@/shared/lib/rich-text";

const LinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const heroContent = defineContent(
  z.object({
    /** First line in white; the second on its own line in the accent red. */
    title: z.object({ lead: z.string().min(1), highlight: z.string().min(1) }),
    intro: RichTextSchema,
    primaryCta: LinkSchema,
    partnerCta: LinkSchema,
  }),
  {
    title: {
      lead: "De cero a tu propio plan de trading:",
      highlight: "te guiamos en cada paso.",
    },
    intro: [
      "Formación, análisis y una comunidad que opera con método. Si estás empezando, te llevamos de la mano; si ya tienes experiencia o una comunidad, potenciamos tu operativa y tus ingresos como partner de ",
      { strong: "EC Markets" },
      ".",
    ],
    primaryCta: { label: "Quiero aprender desde cero", href: "#contacto" },
    partnerCta: { label: "Sumarme como Partner / IB", href: "#contacto" },
  },
);
