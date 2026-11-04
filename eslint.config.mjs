import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

// ---------------------------------------------------------------------------
// Architecture (CLAUDE.md "Reglas de dependencia"):
//   - A section (src/features/<name>) uses another section only through its index.ts.
//   - shared/ never imports from features/.
//   - app/ only composes sections (through their index.ts) and shared/.
// Inside a section, files import each other freely.
// ---------------------------------------------------------------------------

const publicApi = { to: { element: { type: "feature" }, file: { categories: "public" } } };
const shared = { to: { element: { type: "shared" } } };

const architecture = {
  files: ["src/**/*.{ts,tsx}"],
  plugins: { boundaries },
  settings: {
    "import/resolver": {
      typescript: { alwaysTryTypes: true, project: "./tsconfig.json" },
    },
    "boundaries/ignore": ["**/*.test.{ts,tsx}"],
    "boundaries/legacy-templates": false,
    "boundaries/elements": [
      { type: "app", pattern: "src/app", partialMatch: false },
      { type: "shared", pattern: "src/shared/*", partialMatch: false },
      { type: "feature", pattern: "src/features/*", partialMatch: false, capture: ["feature"] },
    ],
    "boundaries/files": [{ category: "public", pattern: "src/features/*/index.ts" }],
  },
  rules: {
    "boundaries/no-unknown-files": "error",
    "boundaries/no-ignored-dependencies": "error",
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        policies: [
          { from: { element: { type: "app" } }, allow: [publicApi, shared] },
          { from: { element: { type: "feature" } }, allow: [publicApi, shared] },
          { from: { element: { type: "shared" } }, allow: [shared] },
        ],
      },
    ],
  },
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,mts}"],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    },
  },
  architecture,
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    "next-env.d.ts",
    "reference/**",
    ".claude/**",
    "public/**",
  ]),
]);
