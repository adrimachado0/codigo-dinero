"use server";

import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";

import { captureLead } from "./capture-lead";
import { LeadInputSchema } from "./lead";

/** The bridge form → server: next-safe-action validates with the same schema as the form. */
export const captureLeadAction = createSafeActionClient()
  .inputSchema(LeadInputSchema)
  .action(async ({ parsedInput }) => {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    return captureLead(parsedInput, ip);
  });
