import { HONEYPOT_FIELD, LeadInputSchema, type Lead, type LeadInput } from "./lead";

export type CaptureLeadResult =
  { status: "captured" } | { status: "invalid"; message: string } | { status: "rate-limited" };

/**
 * Where leads go. Today: a server log with the address masked and no name, until the
 * destination (CRM, newsletter, database) is defined. Replace this function to store them.
 */
export function saveLead(lead: Lead, createdAt: Date): Promise<void> {
  const [user = "", domain = ""] = lead.email.split("@");
  console.info(
    `[lead-capture] new lead ${user.slice(0, 2)}***@${domain} (${lead.profile}) at ${createdAt.toISOString()}`,
  );
  return Promise.resolve();
}

/**
 * Abuse protection. Today every request is allowed; plug a real limiter here (e.g. an
 * Upstash Redis sliding window): captureLead passes the requester's IP as first argument.
 */
export function isAllowed(): Promise<boolean> {
  return Promise.resolve(true);
}

type Deps = {
  save: (lead: Lead, createdAt: Date) => Promise<void>;
  isAllowed: (requester: string) => Promise<boolean>;
  now: () => Date;
};

/** Overridable in tests. */
const defaults: Deps = { save: saveLead, isAllowed, now: () => new Date() };

/**
 * Validates the submission, drops bots and stores the lead.
 * A filled honeypot answers "captured" without storing anything, so bots get no signal.
 */
export async function captureLead(
  input: LeadInput,
  requester: string,
  deps: Partial<Deps> = {},
): Promise<CaptureLeadResult> {
  const { save, isAllowed: allowed, now } = { ...defaults, ...deps };

  const parsed = LeadInputSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "invalid", message: parsed.error.issues.map((i) => i.message).join(" ") };
  }
  const { [HONEYPOT_FIELD]: honeypot, name, email, profile } = parsed.data;
  if (honeypot) return { status: "captured" };
  if (!(await allowed(requester))) return { status: "rate-limited" };

  await save({ name, email: email.toLowerCase(), profile }, now());
  return { status: "captured" };
}
