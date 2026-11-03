import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

// ---------------------------------------------------------------------------
// Architecture (CLAUDE.md "Reglas de dependencia"):
//   ui → application → domain; infrastructure → domain; domain imports only Zod.
//   Cross-feature imports only through the feature's index.ts.
//   shared never imports from features. app/ only composes features.
// ---------------------------------------------------------------------------

const LAYERS = ["domain", "application", "infrastructure", "ui"];
const PURE_LAYERS = ["feature-domain", "feature-application"];

const sameFeature = { feature: "{{ from.element.captured.feature }}" };

/** A layer (or the root files) of the same feature as the importing file. */
const ownLayer = (type, file) => ({
  to: { element: { type, captured: sameFeature }, ...(file && { file }) },
});

/** Any feature, but only through its public API (index.ts). */
const featurePublicApi = {
  to: { element: { type: "feature" }, file: { categories: "public" } },
};

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
      { type: "shared", pattern: "src/shared/*", partialMatch: false, capture: ["segment"] },
      ...LAYERS.map((layer) => ({
        type: `feature-${layer}`,
        // Remotion compositions are React UI of the promo-video feature.
        pattern:
          layer === "ui"
            ? ["src/features/*/ui", "src/features/*/remotion"]
            : `src/features/*/${layer}`,
        partialMatch: false,
        capture: ["feature"],
      })),
      // Feature root files: index.ts, content.ts, composition.ts.
      { type: "feature", pattern: "src/features/*", partialMatch: false, capture: ["feature"] },
    ],
    "boundaries/files": [
      { category: "public", pattern: "src/features/*/index.ts" },
      { category: "content", pattern: "src/features/*/content.ts" },
      { category: "composition", pattern: "src/features/*/composition.ts" },
    ],
  },
  rules: {
    "boundaries/no-unknown-files": "error",
    "boundaries/no-unknown-dependencies": "error",
    "boundaries/no-ignored-dependencies": "error",
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        checkAllOrigins: true,
        policies: [
          // npm packages and Node built-ins: free everywhere except the pure layers.
          {
            from: { element: { types: { noneOf: PURE_LAYERS } } },
            allow: [{ to: { module: { origin: ["external", "core"] } } }],
          },
          {
            from: { element: { types: { anyOf: PURE_LAYERS } } },
            allow: [{ to: { module: { origin: "external", source: "zod" } } }],
          },
          {
            from: { element: { type: "app" } },
            allow: [featurePublicApi, shared],
          },
          {
            from: { element: { type: "shared" } },
            allow: [shared],
          },
          {
            from: { element: { type: "feature" } },
            allow: [
              ...LAYERS.map((layer) => ownLayer(`feature-${layer}`)),
              ownLayer("feature"),
              featurePublicApi,
              shared,
            ],
          },
          {
            from: { element: { type: "feature-ui" } },
            allow: [
              ownLayer("feature-application"),
              ownLayer("feature-domain"),
              ownLayer("feature", { categories: ["content", "composition"] }),
              featurePublicApi,
              shared,
            ],
          },
          {
            from: { element: { type: "feature-application" } },
            allow: [ownLayer("feature-domain")],
          },
          {
            from: { element: { type: "feature-infrastructure" } },
            allow: [ownLayer("feature-domain"), shared],
          },
          // feature-domain: no local dependencies outside its own folder.
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
