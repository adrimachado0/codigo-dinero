import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button, LinkButton } from "./button";

describe("Button", () => {
  it("renders a type=button solid pill by default", () => {
    render(<Button>Empezar</Button>);

    const button = screen.getByRole("button", { name: "Empezar" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass(
      "rounded-full",
      "bg-accent",
      "text-ink",
      "font-semibold",
      "min-h-11",
    );
  });

  it("keeps an explicit submit type", () => {
    render(<Button type="submit">Enviar</Button>);

    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute("type", "submit");
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ir</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Ir" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("lets callers override padding", () => {
    render(<Button className="px-5.5">Empezar</Button>);

    const button = screen.getByRole("button", { name: "Empezar" });
    expect(button).toHaveClass("px-5.5");
    expect(button).not.toHaveClass("px-5");
  });
});

describe("LinkButton", () => {
  it("renders an anchor with the outline tone", () => {
    render(
      <LinkButton href="#comunidad" tone="outline" size="lg">
        Quiero sumarme
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "Quiero sumarme" });
    expect(link).toHaveAttribute("href", "#comunidad");
    expect(link).toHaveClass("border", "border-white/32", "text-white", "min-h-12", "px-5.5");
    expect(link).not.toHaveClass("bg-accent");
  });

  it.each([
    ["outline-soft", "border-white/28"],
    ["outline-strong", "border-white/55"],
  ] as const)("supports the %s tone", (tone, borderClass) => {
    render(
      <LinkButton href="#" tone={tone}>
        Link
      </LinkButton>,
    );

    expect(screen.getByRole("link", { name: "Link" })).toHaveClass(borderClass);
  });

  it("supports the header size (no min-height)", () => {
    render(
      <LinkButton href="#" size="nav">
        Empezar
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "Empezar" });
    expect(link).toHaveClass("px-5", "py-3");
    expect(link).not.toHaveClass("min-h-11");
  });
});
