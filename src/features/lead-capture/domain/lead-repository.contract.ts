import { describe, expect, it } from "vitest";

import type { LeadRepository } from "./lead";

/** LSP contract: every LeadRepository adapter must pass these. */
export function leadRepositoryContract(name: string, create: () => LeadRepository) {
  describe(`LeadRepository contract: ${name}`, () => {
    it("saves a lead without throwing", async () => {
      await expect(
        create().save({ email: "ana@example.com", createdAt: new Date("2026-01-01T00:00:00Z") }),
      ).resolves.toBeUndefined();
    });

    it("accepts several leads, including repeated emails", async () => {
      const repository = create();
      const lead = { email: "ana@example.com", createdAt: new Date() };

      await expect(Promise.all([repository.save(lead), repository.save(lead)])).resolves.toEqual([
        undefined,
        undefined,
      ]);
    });
  });
}
