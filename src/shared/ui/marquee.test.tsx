import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Marquee } from "./marquee";

describe("Marquee", () => {
  it("renders the content twice and hides the copy from assistive tech", () => {
    render(
      <Marquee aria-label="Temas">
        <span>Velas japonesas ✦</span>
      </Marquee>,
    );

    const items = screen.getAllByText("Velas japonesas ✦", { exact: true });
    expect(items).toHaveLength(2);
    expect(items[0]?.closest("[aria-hidden]")).toBeNull();
    expect(items[1]?.closest("[aria-hidden]")).toHaveAttribute("aria-hidden", "true");
  });

  it("clips the track and exposes it for the animation", () => {
    const { container } = render(
      <Marquee className="flex-1" trackClassName="py-3">
        <span>x</span>
      </Marquee>,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass("overflow-hidden", "flex-1");
    const track = root?.querySelector("[data-marquee-track]");
    expect(track).toHaveClass("flex", "w-max", "py-3");
  });
});
