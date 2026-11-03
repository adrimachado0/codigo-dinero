import type { Lead, LeadRepository } from "../domain/lead";

/** Keeps leads in memory: for tests and local development. */
export class InMemoryLeadRepository implements LeadRepository {
  readonly leads: Lead[] = [];

  save(lead: Lead): Promise<void> {
    this.leads.push(lead);
    return Promise.resolve();
  }
}
