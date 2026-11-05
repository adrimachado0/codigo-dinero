import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { site } from "@/shared/config/site";

import { headerContent } from "../content";
import { MainNav } from "./main-nav";

function setup() {
  render(
    <MainNav
      links={site.nav.links}
      cta={site.nav.cta}
      homeLabel={site.homeLabel}
      labels={headerContent}
    />,
  );
  return screen.getByRole("button", { name: "Abrir menú" });
}

function firstMenuLink(): HTMLAnchorElement {
  const link = document.getElementById("cod-mobile-menu")?.querySelector("a");
  if (!link) throw new Error("mobile menu is closed");
  return link;
}

describe("MainNav mobile menu", () => {
  it("toggles the panel with aria-expanded/aria-controls and an updated label", async () => {
    const button = setup();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "cod-mobile-menu");
    expect(document.getElementById("cod-mobile-menu")).toBeNull();

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAccessibleName("Cerrar menú");
    expect(document.getElementById("cod-mobile-menu")).toBeInTheDocument();
  });

  it("closes with Escape and returns focus to the button", async () => {
    const button = setup();
    await userEvent.click(button);
    firstMenuLink().focus();

    await userEvent.keyboard("{Escape}");

    expect(document.getElementById("cod-mobile-menu")).toBeNull();
    expect(button).toHaveFocus();
  });

  it("closes when a link is clicked", async () => {
    const button = setup();
    await userEvent.click(button);

    await userEvent.click(firstMenuLink());

    expect(document.getElementById("cod-mobile-menu")).toBeNull();
  });
});
