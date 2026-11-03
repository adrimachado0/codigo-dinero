"use server";

import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";

import { captureLead } from "../application/capture-lead";
import { leadCaptureDeps } from "../composition";
import { LeadInputSchema } from "../domain/lead";

const action = createSafeActionClient();

/** Server Action: validated with the shared Zod schema, then the use case. */
export const captureLeadAction = action
  .inputSchema(LeadInputSchema)
  .action(async ({ parsedInput }) => {
    const requestHeaders = await headers();
    const requester = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    return captureLead(parsedInput, requester, leadCaptureDeps);
  });
