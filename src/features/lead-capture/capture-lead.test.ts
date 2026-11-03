import { describe, expect, it, vi } from "vitest";

import { captureLead, isAllowed, saveLead } from "./capture-lead";

const NOW = new Date("2026-11-03T12:00:00Z");

function setup(allowed = true) {
  const save = vi.fn(() => Promise.resolve());
  const isAllowedMock = vi.fn(() => Promise.resolve(allowed));
  return {
    save,
    isAllowed: isAllowedMock,
    deps: { save, isAllowed: isAllowedMock, now: () => NOW },
  };
}

describe("captureLead", () => {
  it("stores a valid email, trimmed and lowercased", async () => {
    const { save, isAllowed: allowed, deps } = setup();

    await expect(captureLead({ email: "  Ana@Example.com " }, "1.2.3.4", deps)).resolves.toEqual({
      status: "captured",
    });
    expect(save).toHaveBeenCalledWith("ana@example.com", NOW);
    expect(allowed).toHaveBeenCalledWith("1.2.3.4");
  });

  it.each([
    ["", "Escribe tu correo electrónico."],
    ["no-es-un-correo", "Revisa el formato de tu correo electrónico."],
  ])("rejects %j with a message", async (email, message) => {
    const { save, deps } = setup();

    await expect(captureLead({ email }, "ip", deps)).resolves.toEqual({
      status: "invalid",
      message,
    });
    expect(save).not.toHaveBeenCalled();
  });

  it("silently drops bots that fill the honeypot", async () => {
    const { save, isAllowed: allowed, deps } = setup();

    await expect(
      captureLead({ email: "bot@example.com", company: "ACME" }, "ip", deps),
    ).resolves.toEqual({
      status: "captured",
    });
    expect(save).not.toHaveBeenCalled();
    expect(allowed).not.toHaveBeenCalled();
  });

  it("stops when the rate limit refuses", async () => {
    const { save, deps } = setup(false);

    await expect(captureLead({ email: "ana@example.com" }, "ip", deps)).resolves.toEqual({
      status: "rate-limited",
    });
    expect(save).not.toHaveBeenCalled();
  });

  it("uses the real defaults: allows, logs masked and timestamps now", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined);

    await expect(captureLead({ email: "ana.perez@example.com" }, "ip")).resolves.toEqual({
      status: "captured",
    });
    expect(log).toHaveBeenCalledWith(
      expect.stringMatching(/^\[lead-capture\] new lead an\*\*\*@example\.com at /),
    );
  });
});

describe("defaults", () => {
  it("isAllowed lets every request through for now", async () => {
    await expect(isAllowed()).resolves.toBe(true);
  });

  it("saveLead never logs the full address", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined);

    await saveLead("ana.perez@example.com", NOW);

    expect(log).toHaveBeenCalledWith(
      "[lead-capture] new lead an***@example.com at 2026-11-03T12:00:00.000Z",
    );
  });
});
