import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    {
      // Static image imports are `StaticImageData` objects in Next, not URL strings.
      name: "next-static-images",
      enforce: "pre",
      load(id) {
        if (!/\.(png|jpe?g|webp|avif|gif)$/.test(id)) return null;
        return `export default ${JSON.stringify({ src: id, width: 100, height: 100 })};`;
      },
    },
  ],
  // Vite 8 resolves tsconfig `paths` (@/*) natively; no vite-tsconfig-paths plugin needed.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      // The files with business logic (prices, formatting, lead validation and capture).
      include: [
        "src/features/market-ticker/{quotes,simulated-market}.ts",
        "src/features/lead-capture/{lead,capture-lead}.ts",
      ],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
