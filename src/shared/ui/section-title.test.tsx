import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionTitle } from "./section-title";

describe("SectionTitle", () => {
  it("renders an h2 whose accessible name is the full title", () => {
    render(<SectionTitle lead="Nuestra" highlight="formación" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Nuestra formación" }),
    ).toBeInTheDocument();
  });

  it("puts the highlighted word on a red tag rotated −2°", () => {
    render(<SectionTitle lead="Preguntas" highlight="frecuentes" />);

    expect(screen.getByText("frecuentes")).toHaveClass(
      "-rotate-2",
      "bg-accent",
      "text-ink",
      "rounded-tag",
      "inline-block",
    );
    expect(screen.getByText("Preguntas")).not.toHaveClass("bg-accent");
  });

  it("forwards id and classes to the heading", () => {
    render(
      <SectionTitle id="faq-title" className="mt-4" lead="Lo que dice la" highlight="comunidad" />,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "faq-title");
    expect(heading).toHaveClass("mt-4", "text-section", "font-medium");
  });
});
