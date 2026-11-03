import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false, null, undefined, "b", { c: true, d: false })).toBe("a b c");
  });

  it("lets the last conflicting Tailwind utility win", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("keeps a custom font size and a custom text color together", () => {
    expect(cn("text-15 text-ink")).toBe("text-15 text-ink");
  });

  it("resolves conflicts inside the custom theme groups", () => {
    expect(cn("text-14", "text-15")).toBe("text-15");
    expect(cn("text-white", "text-accent")).toBe("text-accent");
    expect(cn("rounded-card", "rounded-full")).toBe("rounded-full");
    expect(cn("max-w-nav", "max-w-shell")).toBe("max-w-shell");
    expect(cn("tracking-caps", "tracking-caps-md")).toBe("tracking-caps-md");
    expect(cn("leading-relaxed", "leading-loose")).toBe("leading-loose");
  });
});
