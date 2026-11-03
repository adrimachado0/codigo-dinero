import type { Lead, LeadRepository } from "../domain/lead";

/**
 * Temporary adapter until the leads destination is defined (docs/PENDIENTES.md): logs the
 * lead on the server with the address masked.
 */
export class ConsoleLeadRepository implements LeadRepository {
  constructor(private readonly log: (message: string) => void = console.info) {}

  save(lead: Lead): Promise<void> {
    const [user = "", domain = ""] = lead.email.split("@");
    const masked = `${user.slice(0, 2)}***@${domain}`;
    this.log(`[lead-capture] new lead ${masked} at ${lead.createdAt.toISOString()}`);
    return Promise.resolve();
  }
}
