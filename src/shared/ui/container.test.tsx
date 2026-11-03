import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "./container";

describe("Container", () => {
  it("centers content with the default 1100px width", () => {
    render(<Container data-testid="c">x</Container>);

    expect(screen.getByTestId("c")).toHaveClass("mx-auto", "max-w-content");
  });

  it.each([
    ["shell", "max-w-shell"],
    ["panel", "max-w-panel"],
    ["wide", "max-w-wide"],
    ["nav", "max-w-nav"],
    ["narrow", "max-w-narrow"],
  ] as const)("maps size %s to %s", (size, expected) => {
    render(<Container data-testid="c" size={size} />);

    expect(screen.getByTestId("c")).toHaveClass(expected);
  });

  it("merges custom classes and forwards props", () => {
    render(<Container data-testid="c" className="mt-10" id="inicio" />);

    const el = screen.getByTestId("c");
    expect(el).toHaveClass("mt-10", "mx-auto");
    expect(el).toHaveAttribute("id", "inicio");
  });
});
