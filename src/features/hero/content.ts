import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

const LinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const heroContent = defineContent(
  z.object({
    titleLines: z.tuple([z.string().min(1), z.string().min(1)]),
    intro: z.string().min(1),
    secondaryCta: LinkSchema,
    primaryCta: LinkSchema,
    accountCta: LinkSchema,
  }),
  {
    titleLines: ["Te guiamos en", "cada operación"],
    intro:
      "Formación, análisis de mercado y una comunidad que opera con método. Te acompañamos desde tu primera operación hasta tu plan de trading.",
    secondaryCta: { label: "Ver formación", href: "#formacion" },
    primaryCta: { label: "Empezar ahora", href: "#" },
    accountCta: { label: "Abrir cuenta", href: "#" },
  },
);
