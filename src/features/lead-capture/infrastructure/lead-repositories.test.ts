import { describe, expect, it, vi } from "vitest";

import { leadRepositoryContract } from "../domain/lead-repository.contract";
import { ConsoleLeadRepository } from "./console-lead-repository";
import { InMemoryLeadRepository } from "./in-memory-lead-repository";
import { NoopRateLimiter } from "./noop-rate-limiter";

leadRepositoryContract("ConsoleLeadRepository", () => new ConsoleLeadRepository(() => undefined));
leadRepositoryContract("InMemoryLeadRepository", () => new InMemoryLeadRepository());

describe("ConsoleLeadRepository", () => {
  it("logs the lead with the address masked", async () => {
    const log = vi.fn();
    await new ConsoleLeadRepository(log).save({
      email: "ana.perez@example.com",
      createdAt: new Date("2026-11-03T10:00:00Z"),
    });

    expect(log).toHaveBeenCalledWith(
      "[lead-capture] new lead an***@example.com at 2026-11-03T10:00:00.000Z",
    );
  });
});

describe("NoopRateLimiter", () => {
  it("allows every request", async () => {
    await expect(new NoopRateLimiter().consume()).resolves.toBe(true);
  });
});
