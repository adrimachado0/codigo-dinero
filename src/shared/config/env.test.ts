// @vitest-environment node
// env.ts is read on the server; under jsdom t3-env would treat the test as client code.
import { afterEach, describe, expect, it, vi } from "vitest";

async function loadEnv() {
  vi.resetModules();
  const { env } = await import("./env");
  return env;
}

describe("env", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("applies defaults when variables are unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("SITE_ENV", "");

    const env = await loadEnv();

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
    expect(env.SITE_ENV).toBe("development");
  });

  it("reads a valid site URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const env = await loadEnv();

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
  });

  it("rejects an invalid site URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not-a-url");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(loadEnv()).rejects.toThrow("Invalid environment variables");
    expect(consoleError).toHaveBeenCalled();
  });

  it("rejects an unknown site environment", async () => {
    vi.stubEnv("SITE_ENV", "staging");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(loadEnv()).rejects.toThrow("Invalid environment variables");
    expect(consoleError).toHaveBeenCalled();
  });
});
