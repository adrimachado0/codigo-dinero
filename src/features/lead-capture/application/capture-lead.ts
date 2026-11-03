import {
  HONEYPOT_FIELD,
  LeadInputSchema,
  type LeadInput,
  type LeadRepository,
  type RateLimiter,
} from "../domain/lead";

export type CaptureLeadResult =
  { status: "captured" } | { status: "invalid"; message: string } | { status: "rate-limited" };

type Deps = {
  repository: LeadRepository;
  rateLimiter: RateLimiter;
  now?: () => Date;
};

/**
 * Use case: validate, filter bots (honeypot) and store a lead.
 * A filled honeypot reports success without storing, so bots get no signal.
 */
export async function captureLead(
  input: LeadInput,
  requesterKey: string,
  { repository, rateLimiter, now = () => new Date() }: Deps,
): Promise<CaptureLeadResult> {
  const parsed = LeadInputSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "invalid", message: parsed.error.issues.map((i) => i.message).join(" ") };
  }
  if (parsed.data[HONEYPOT_FIELD]) return { status: "captured" };
  if (!(await rateLimiter.consume(requesterKey))) return { status: "rate-limited" };

  await repository.save({ email: parsed.data.email.toLowerCase(), createdAt: now() });
  return { status: "captured" };
}
