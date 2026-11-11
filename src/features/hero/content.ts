import { z } from "zod";

import { defineContent } from "@/shared/lib/content";
import { RichTextSchema } from "@/shared/lib/rich-text";

export const heroContent = defineContent(
  z.object({
    /** First line in white; the second on its own line in the accent red. */
    title: z.object({ lead: z.string().min(1), highlight: z.string().min(1) }),
    intro: RichTextSchema,
    /** Goes to the Partner/IB sign-up (src/shared/config/links.ts). */
    primaryCta: z.string().min(1),
    /** Opens WhatsApp with the partner message. */
    partnerCta: z.string().min(1),
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
    primaryCta: "Quiero aprender desde cero",
    partnerCta: "Sumarme como Partner / IB",
  },
);
