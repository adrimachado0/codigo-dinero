import { z } from "zod";

/** Hidden "company" field: people never see it, bots tend to fill it. */
export const HONEYPOT_FIELD = "company";

/** Who is asking for the session; the labels live in content.ts. */
export const LEAD_PROFILES = ["beginner", "experienced", "community-leader"] as const;

export type LeadProfile = (typeof LEAD_PROFILES)[number];

/** A valid form submission. Used by the form (browser) and by the server, so both agree. */
export const LeadInputSchema = z.object({
  name: z.string().trim().min(1, { error: "Escribe tu nombre." }).max(120),
  email: z
    .string()
    .trim()
    .min(1, { error: "Escribe tu correo electrónico." })
    .pipe(z.email({ error: "Revisa el formato de tu correo electrónico." })),
  profile: z.enum(LEAD_PROFILES, { error: "Elige tu perfil." }),
  [HONEYPOT_FIELD]: z.string().max(200).optional(),
});

export type LeadInput = z.input<typeof LeadInputSchema>;

/** What gets stored: the validated lead, without the honeypot. */
export type Lead = Omit<z.output<typeof LeadInputSchema>, typeof HONEYPOT_FIELD>;
