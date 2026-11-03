import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { testimonialsContent as content } from "../content";
import { TestimonialsCarousel } from "./testimonials-carousel";

function setup() {
  render(
    <TestimonialsCarousel
      reviews={content.reviews}
      initialIndex={content.initialIndex}
      labels={{
        previous: content.previousLabel,
        next: content.nextLabel,
        carousel: content.carouselLabel,
      }}
      heading={<h2>Lo que dice la comunidad</h2>}
      joinLink={<a href="#">Quiero sumarme</a>}
    />,
  );
}

const activeSlide = () =>
  screen
    .getAllByRole("group", { name: /de 3$/ })
    .find((el) => el.getAttribute("aria-current") === "true");

describe("TestimonialsCarousel", () => {
  it("starts on the second review, as in the reference", () => {
    setup();

    expect(activeSlide()).toHaveAccessibleName("2 de 3");
    expect(screen.getByText("Reseña 2 de 3")).toHaveAttribute("aria-live", "polite");
  });

  it("moves with the labelled arrows and wraps around", async () => {
    setup();
    const next = screen.getByRole("button", { name: "Reseña siguiente" });
    const previous = screen.getByRole("button", { name: "Reseña anterior" });

    await userEvent.click(next);
    expect(activeSlide()).toHaveAccessibleName("3 de 3");

    await userEvent.click(next);
    expect(activeSlide()).toHaveAccessibleName("1 de 3");
    expect(screen.getByText("Reseña 1 de 3")).toBeInTheDocument();

    await userEvent.click(previous);
    expect(activeSlide()).toHaveAccessibleName("3 de 3");
  });

  it("keeps the review placeholders untouched", () => {
    setup();

    expect(screen.getAllByText("[Nombre del alumno]")).toHaveLength(3);
  });
});
