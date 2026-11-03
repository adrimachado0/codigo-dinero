import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const leadContent = defineContent(
  z.object({
    sectionLabel: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
    emailLabel: z.string().min(1),
    emailPlaceholder: z.string().min(1),
    submit: z.string().min(1),
    // Status copy is not in the reference: pending confirmation (docs/PENDIENTES.md).
    sending: z.string().min(1),
    success: z.string().min(1),
    rateLimited: z.string().min(1),
    serverError: z.string().min(1),
  }),
  {
    sectionLabel: "Empezar",
    title: "¿Listo para operar con método?",
    body: "Déjanos tu correo y te contamos cómo empezar en la Escuela y abrir tu cuenta en EC MARKETS.",
    emailLabel: "Tu correo electrónico",
    emailPlaceholder: "Tu correo electrónico",
    submit: "Empezar",
    sending: "Enviando…",
    success: "¡Gracias! Te escribiremos a tu correo.",
    rateLimited: "Demasiados intentos. Prueba de nuevo en unos minutos.",
    serverError: "No pudimos registrar tu correo. Inténtalo de nuevo.",
  },
);
