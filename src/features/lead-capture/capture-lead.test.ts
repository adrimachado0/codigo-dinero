import { describe, expect, it, vi } from "vitest";

import { captureLead, isAllowed, saveLead } from "./capture-lead";

const NOW = new Date("2026-11-03T12:00:00Z");
const ANA = { name: "Ana Pérez", email: "ana@example.com", profile: "beginner" } as const;

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
  it("stores a valid lead, trimmed, with the email lowercased", async () => {
    const { save, isAllowed: allowed, deps } = setup();

    await expect(
      captureLead(
        { name: "  Ana Pérez ", email: "  Ana@Example.com ", profile: "community-leader" },
        "1.2.3.4",
        deps,
      ),
    ).resolves.toEqual({ status: "captured" });
    expect(save).toHaveBeenCalledWith(
      { name: "Ana Pérez", email: "ana@example.com", profile: "community-leader" },
      NOW,
    );
    expect(allowed).toHaveBeenCalledWith("1.2.3.4");
  });

  it.each([
    [{ ...ANA, name: " " }, "Escribe tu nombre."],
    [{ ...ANA, email: "" }, "Escribe tu correo electrónico."],
    [{ ...ANA, email: "no-es-un-correo" }, "Revisa el formato de tu correo electrónico."],
    [{ ...ANA, profile: "broker" }, "Elige tu perfil."],
  ])("rejects %j with a message", async (input, message) => {
    const { save, deps } = setup();

    // @ts-expect-error -- an out-of-range profile is exactly what the server must reject.
    await expect(captureLead(input, "ip", deps)).resolves.toEqual({ status: "invalid", message });
    expect(save).not.toHaveBeenCalled();
  });

  it("silently drops bots that fill the honeypot", async () => {
    const { save, isAllowed: allowed, deps } = setup();

    await expect(captureLead({ ...ANA, company: "ACME" }, "ip", deps)).resolves.toEqual({
      status: "captured",
    });
    expect(save).not.toHaveBeenCalled();
    expect(allowed).not.toHaveBeenCalled();
  });

  it("stops when the rate limit refuses", async () => {
    const { save, deps } = setup(false);

    await expect(captureLead(ANA, "ip", deps)).resolves.toEqual({ status: "rate-limited" });
    expect(save).not.toHaveBeenCalled();
  });

  it("uses the real defaults: allows, logs masked and timestamps now", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined);

    await expect(captureLead({ ...ANA, email: "ana.perez@example.com" }, "ip")).resolves.toEqual({
      status: "captured",
    });
    expect(log).toHaveBeenCalledWith(
      expect.stringMatching(/^\[lead-capture\] new lead an\*\*\*@example\.com \(beginner\) at /),
    );
  });
});

describe("defaults", () => {
  it("isAllowed lets every request through for now", async () => {
    await expect(isAllowed()).resolves.toBe(true);
  });

  it("saveLead never logs the full address or the name", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined);

    await saveLead({ ...ANA, email: "ana.perez@example.com", profile: "experienced" }, NOW);

    expect(log).toHaveBeenCalledWith(
      "[lead-capture] new lead an***@example.com (experienced) at 2026-11-03T12:00:00.000Z",
    );
  });
});
