import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Vite 8 resolves tsconfig `paths` (@/*) natively; no vite-tsconfig-paths plugin needed.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      include: ["src/features/*/domain/**", "src/features/*/application/**"],
      exclude: ["**/*.test.{ts,tsx}"],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
