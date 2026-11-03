import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest runs without globals, so Testing Library can't register its auto-cleanup.
afterEach(() => {
  cleanup();
});

// Component tests are static: decorative motion off (jsdom has no IntersectionObserver).
if (typeof window !== "undefined") {
  Object.assign(window, { __FREEZE_MOTION__: true });
}
