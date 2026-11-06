import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

import { LEAD_PROFILES } from "./lead";

export const leadContent = defineContent(
  z.object({
    sectionLabel: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    nameLabel: z.string().min(1),
    namePlaceholder: z.string().min(1),
    emailLabel: z.string().min(1),
    emailPlaceholder: z.string().min(1),
    profileLabel: z.string().min(1),
    /** One option per profile, in the order of the select (the first is preselected). */
    profiles: z
      .array(z.object({ value: z.enum(LEAD_PROFILES), label: z.string().min(1) }))
      .length(LEAD_PROFILES.length),
    submit: z.string().min(1),
    // Status copy is not in the reference: pending confirmation (docs/PENDIENTES.md).
    sending: z.string().min(1),
    success: z.string().min(1),
    rateLimited: z.string().min(1),
    serverError: z.string().min(1),
  }),
  {
    sectionLabel: "Contacto",
    title: "Coordinemos una sesión estratégica",
    body: "¿Buscas mejorar las condiciones de tu operativa actual o llevar tu comunidad al siguiente broker? Déjanos tus datos y coordinamos una sesión estratégica para evaluar tu caso.",
    nameLabel: "Tu nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Tu correo electrónico",
    emailPlaceholder: "Tu correo electrónico",
    profileLabel: "Tu perfil",
    profiles: [
      { value: "beginner", label: "Estoy empezando desde cero" },
      { value: "experienced", label: "Soy trader con experiencia" },
      { value: "community-leader", label: "Lidero una comunidad / soy IB" },
    ],
    submit: "Coordinar sesión",
    sending: "Enviando…",
    success: "¡Gracias! Te escribiremos a tu correo.",
    rateLimited: "Demasiados intentos. Prueba de nuevo en unos minutos.",
    serverError: "No pudimos registrar tu correo. Inténtalo de nuevo.",
  },
);
