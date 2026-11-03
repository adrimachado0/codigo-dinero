"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { ArrowLeftIcon, ArrowRightIcon, QuoteIcon, UserIcon } from "@/shared/ui/icons";

import type { Review } from "../content";

type Props = {
  reviews: Review[];
  initialIndex: number;
  labels: { previous: string; next: string; carousel: string };
  /** Rendered between the arrows and the cards (the "Quiero sumarme" link). */
  joinLink: ReactNode;
  heading: ReactNode;
};

const arrowClass = "flex size-12 cursor-pointer items-center justify-center rounded-full p-0";

/**
 * Accessible carousel: arrow buttons with labels, slides announced as "N de M" and the
 * active one reported through a polite live region. On mobile only the active card shows.
 */
export function TestimonialsCarousel({ reviews, initialIndex, labels, joinLink, heading }: Props) {
  const [active, setActive] = useState(initialIndex);
  const count = reviews.length;
  const go = (delta: number) => {
    setActive((current) => (current + delta + count) % count);
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 px-2">
        {heading}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label={labels.previous}
            aria-controls="testimonials-track"
            onClick={() => {
              go(-1);
            }}
            className={cn(arrowClass, "border border-white/32 bg-transparent text-white")}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            aria-controls="testimonials-track"
            onClick={() => {
              go(1);
            }}
            className={cn(arrowClass, "border-0 bg-accent text-ink")}
          >
            <ArrowRightIcon />
          </button>
          {joinLink}
        </div>
      </div>

      <div
        id="testimonials-track"
        role="group"
        aria-roledescription="carrusel"
        aria-label={labels.carousel}
        className="mt-10 flex flex-wrap gap-4.5"
      >
        {reviews.map((review, index) => {
          const isActive = index === active;
          return (
            <figure
              key={review.quote}
              role="group"
              aria-roledescription="reseña"
              aria-label={`${String(index + 1)} de ${String(count)}`}
              aria-current={isActive ? "true" : undefined}
              // Dimmed slides are not the current one: hidden from assistive tech (arrows reach them).
              aria-hidden={isActive ? undefined : true}
              className={cn(
                "m-0 box-border flex flex-[1_1_300px] flex-col gap-5 rounded-card border bg-surface-400 p-6.5 transition-[opacity,border-color] duration-300",
                isActive ? "border-accent opacity-100" : "border-white/8 opacity-45 max-md:hidden",
              )}
            >
              <figcaption className="flex items-center gap-3.5">
                <span className="flex size-12 flex-[0_0_48px] items-center justify-center overflow-hidden rounded-full bg-accent text-ink">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 object-cover"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </span>
                <span className="flex-auto">
                  <span className="block text-15 font-medium">{review.name}</span>
                  <span className="mt-0.75 block text-13 text-fg-muted">{review.meta}</span>
                </span>
                <QuoteIcon className="text-accent" />
              </figcaption>
              <blockquote className="m-0 text-15 leading-loose text-fg-quote italic">
                {review.quote}
              </blockquote>
            </figure>
          );
        })}
      </div>

      <div className="mt-5.5 flex justify-center gap-2" aria-hidden="true">
        {reviews.map((review, index) => (
          <span
            key={review.quote}
            className={cn(
              "h-2 rounded-full transition-[width] duration-300",
              index === active ? "w-7 bg-accent" : "w-2 bg-white/30",
            )}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Reseña ${String(active + 1)} de ${String(count)}`}
      </p>
    </>
  );
}
