import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest runs without globals, so Testing Library can't register its auto-cleanup.
afterEach(() => {
  cleanup();
});

// jsdom lacks matchMedia (used by GSAP): tests run as "prefers-reduced-motion: reduce", so
// loop animations never start and need no IntersectionObserver.
if (typeof window !== "undefined") {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes(": reduce"),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
