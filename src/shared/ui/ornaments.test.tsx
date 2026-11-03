import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sparkle } from "./sparkle";
import { Starburst } from "./starburst";

describe("Sparkle", () => {
  it("is decorative, accent-colored and sized", () => {
    const { container } = render(<Sparkle size={32} />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveClass("text-accent");
    expect(svg?.querySelector("path")).toHaveAttribute("fill", "currentColor");
  });

  it("can switch color through className", () => {
    const { container } = render(<Sparkle className="text-white" />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-white");
    expect(svg).not.toHaveClass("text-accent");
  });
});

describe("Starburst", () => {
  it("is a decorative 48-unit stroke mark", () => {
    const { container } = render(<Starburst size={26} />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 48 48");
    expect(svg).toHaveAttribute("width", "26");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("stroke-width", "3");
  });

  it("accepts the hero stroke width", () => {
    const { container } = render(<Starburst size={72} strokeWidth={2.6} />);

    expect(container.querySelector("svg")).toHaveAttribute("stroke-width", "2.6");
  });
});
