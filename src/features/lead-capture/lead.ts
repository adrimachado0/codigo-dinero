import { z } from "zod";

/** Hidden "company" field: people never see it, bots tend to fill it. */
export const HONEYPOT_FIELD = "company";

/** A valid form submission. Used by the form (browser) and by the server, so both agree. */
export const LeadInputSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Escribe tu correo electrónico." })
    .pipe(z.email({ error: "Revisa el formato de tu correo electrónico." })),
  [HONEYPOT_FIELD]: z.string().max(200).optional(),
});

export type LeadInput = z.input<typeof LeadInputSchema>;
