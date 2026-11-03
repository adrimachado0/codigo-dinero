import { z } from "zod";

/** Name of the honeypot field: hidden from people, bots tend to fill it. */
export const HONEYPOT_FIELD = "company";

/** Shared by the form (client) and the Server Action (server). */
export const LeadInputSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Escribe tu correo electrónico." })
    .pipe(z.email({ error: "Revisa el formato de tu correo electrónico." })),
  [HONEYPOT_FIELD]: z.string().max(200).optional(),
});

export type LeadInput = z.input<typeof LeadInputSchema>;

export type Lead = {
  email: string;
  createdAt: Date;
};

/** Port: where captured leads are stored. */
export interface LeadRepository {
  save(lead: Lead): Promise<void>;
}

/** Port: abuse protection. `key` identifies the requester (e.g. IP). */
export interface RateLimiter {
  /** Resolves `true` when the request is allowed. */
  consume(key: string): Promise<boolean>;
}
