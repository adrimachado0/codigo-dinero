import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { faqContent } from "../content";
import { FaqAccordion } from "./faq-accordion";

const items = faqContent.items;

function setup() {
  render(<FaqAccordion items={items} initialOpen={faqContent.initialOpen} />);
  return items.map((item) =>
    screen.getByRole("button", { name: new RegExp(item.question.replace(/[¿?]/g, ".")) }),
  );
}

describe("FaqAccordion", () => {
  it("starts with the first question open, as in the reference", () => {
    const [first, second] = setup();

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("region", { name: /Cuánto cuesta/ })).toHaveTextContent("[PRECIO]");
  });

  it("links each button to its panel and keeps closed answers in the DOM", () => {
    const [, second] = setup();

    const panel = document.getElementById(second?.getAttribute("aria-controls") ?? "");
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent("La formación empieza desde cero");
  });

  it("opens one question at a time and closes the open one on click", async () => {
    const [first, second] = setup();
    if (!second) throw new Error("missing second question");

    await userEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("uses h3 headings under the section title", () => {
    setup();

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(items.length);
  });
});
