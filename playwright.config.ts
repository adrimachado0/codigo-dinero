import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3100; // 3000 belongs to `next dev` in the dev service
const REFERENCE_PORT = 3001;
const isCI = Boolean(process.env.CI);

// Runs inside the Docker image (pinned Chromium + fonts), so screenshots are deterministic.
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results/playwright",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "e2e",
      testIgnore: /visual\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testMatch: /visual\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        contextOptions: { reducedMotion: "reduce" },
      },
    },
  ],
  webServer: [
    {
      // Tests run against the production build, as the Next.js testing guide recommends.
      command: `pnpm build && pnpm start --port ${APP_PORT}`,
      url: `http://localhost:${APP_PORT}`,
      reuseExistingServer: !isCI,
      timeout: 300_000,
    },
    {
      command: `pnpm exec serve reference --listen ${REFERENCE_PORT} --no-clipboard --no-request-logging`,
      url: `http://localhost:${REFERENCE_PORT}`,
      reuseExistingServer: !isCI,
    },
  ],
});
