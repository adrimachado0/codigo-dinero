import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";

import { PersonPhoto } from "./person-photo";

const photo: StaticImageData = { src: "/hero.png", width: 600, height: 680 };

describe("PersonPhoto", () => {
  it("shows the silhouette and the 'Foto' pill without a photo", () => {
    const { container } = render(<PersonPhoto tone="wine" />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("fill-wine-silhouette");
    expect(screen.getByText("Foto")).toHaveClass("bg-accent", "top-[66%]");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it.each([
    ["charcoal", "fill-silhouette"],
    ["graphite", "fill-silhouette-strong"],
  ] as const)("uses the %s silhouette color", (tone, fillClass) => {
    const { container } = render(<PersonPhoto tone={tone} />);

    expect(container.querySelector("svg")).toHaveClass(fillClass);
  });

  it("can hide the label or move it", () => {
    const { rerender } = render(<PersonPhoto tone="graphite" label={null} />);
    expect(screen.queryByText("Foto")).not.toBeInTheDocument();

    rerender(<PersonPhoto tone="wine" labelClassName="top-1/2" />);
    const label = screen.getByText("Foto");
    expect(label).toHaveClass("top-1/2");
    expect(label).not.toHaveClass("top-[66%]");
  });

  it("renders the real photo with its alt text when src is set", () => {
    render(<PersonPhoto tone="wine" photo={{ src: photo, alt: "Mentor de Código Dinero" }} />);

    const img = screen.getByRole("img", { name: "Mentor de Código Dinero" });
    expect(img).toHaveAttribute("width", "600");
    expect(img).toHaveAttribute("height", "680");
    expect(screen.queryByText("Foto")).not.toBeInTheDocument();
  });
});
