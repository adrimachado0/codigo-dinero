import { z } from "zod";

import type { WhatsAppMessage } from "@/shared/config/links";
import { defineContent } from "@/shared/lib/content";

export const contactContent = defineContent(
  z.object({
    sectionLabel: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    /** One button per profile; each opens WhatsApp with its own message. */
    profiles: z
      .array(
        z.object({
          label: z.string().min(1),
          message: z.enum([
            "beginner",
            "experienced",
            "communityLeader",
          ]) satisfies z.ZodType<WhatsAppMessage>,
        }),
      )
      .length(3),
    note: z.string().min(1),
  }),
  {
    sectionLabel: "Contacto",
    title: "Coordinemos una sesión estratégica",
    body: "¿Buscas mejorar las condiciones de tu operativa actual o llevar tu comunidad al siguiente broker? Déjanos tus datos y coordinamos una sesión estratégica para evaluar tu caso.",
    profiles: [
      { label: "Estoy empezando desde cero", message: "beginner" },
      { label: "Soy trader con experiencia", message: "experienced" },
      { label: "Lidero una comunidad / soy IB", message: "communityLeader" },
    ],
    note: "Se abre WhatsApp con tu consulta lista para enviar.",
  },
);
