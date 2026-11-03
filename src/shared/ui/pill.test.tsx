import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pill } from "./pill";

describe("Pill", () => {
  it("renders the small accent label by default", () => {
    render(<Pill>Foto</Pill>);

    expect(screen.getByText("Foto")).toHaveClass(
      "rounded-full",
      "bg-accent",
      "text-ink",
      "text-12",
      "font-medium",
    );
  });

  it("renders uppercase semibold labels with caps", () => {
    render(<Pill caps>Partner oficial</Pill>);

    const pill = screen.getByText("Partner oficial");
    expect(pill).toHaveClass("uppercase", "tracking-caps", "font-semibold");
    expect(pill).not.toHaveClass("font-medium");
  });

  it("renders outline chips", () => {
    render(
      <Pill tone="outline" size="sm">
        Pagos
      </Pill>,
    );

    const pill = screen.getByText("Pagos");
    expect(pill).toHaveClass("border", "border-white/32", "text-14", "px-4", "py-2");
    expect(pill).not.toHaveClass("bg-accent");
  });
});
