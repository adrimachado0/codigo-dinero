import { describe, expect, it } from "vitest";

import type { RateLimiter } from "../domain/lead";
import { InMemoryLeadRepository } from "../infrastructure/in-memory-lead-repository";
import { captureLead } from "./capture-lead";

const NOW = new Date("2026-11-03T12:00:00Z");

function setup(allowed = true) {
  const repository = new InMemoryLeadRepository();
  const keys: string[] = [];
  const rateLimiter: RateLimiter = {
    consume(key) {
      keys.push(key);
      return Promise.resolve(allowed);
    },
  };
  return { repository, keys, deps: { repository, rateLimiter, now: () => NOW } };
}

describe("captureLead", () => {
  it("stores a valid, normalized email", async () => {
    const { repository, keys, deps } = setup();

    await expect(captureLead({ email: "  Ana@Example.com " }, "1.2.3.4", deps)).resolves.toEqual({
      status: "captured",
    });
    expect(repository.leads).toEqual([{ email: "ana@example.com", createdAt: NOW }]);
    expect(keys).toEqual(["1.2.3.4"]);
  });

  it.each([
    ["", "Escribe tu correo electrónico."],
    ["no-es-un-correo", "Revisa el formato de tu correo electrónico."],
  ])("rejects %j with a message", async (email, message) => {
    const { repository, deps } = setup();

    await expect(captureLead({ email }, "ip", deps)).resolves.toEqual({
      status: "invalid",
      message,
    });
    expect(repository.leads).toHaveLength(0);
  });

  it("silently drops bots that fill the honeypot", async () => {
    const { repository, keys, deps } = setup();

    await expect(
      captureLead({ email: "bot@example.com", company: "ACME" }, "ip", deps),
    ).resolves.toEqual({ status: "captured" });
    expect(repository.leads).toHaveLength(0);
    expect(keys).toHaveLength(0);
  });

  it("timestamps with the current time by default", async () => {
    const { repository, deps } = setup();
    const before = Date.now();

    await captureLead({ email: "ana@example.com" }, "ip", {
      repository: deps.repository,
      rateLimiter: deps.rateLimiter,
    });

    expect(repository.leads[0]?.createdAt.getTime()).toBeGreaterThanOrEqual(before);
  });

  it("stops when the rate limiter refuses", async () => {
    const { repository, deps } = setup(false);

    await expect(captureLead({ email: "ana@example.com" }, "ip", deps)).resolves.toEqual({
      status: "rate-limited",
    });
    expect(repository.leads).toHaveLength(0);
  });
});
