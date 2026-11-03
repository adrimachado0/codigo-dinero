"use client";

import { useId, useState } from "react";

import { cn } from "@/shared/lib/cn";

import type { FaqItem } from "../content";

/**
 * Accordion (WAI-ARIA pattern): heading > button with aria-expanded/aria-controls, panel as
 * region labelled by its button. Closed answers stay in the HTML (`hidden`) for SEO.
 * One item open at a time; clicking the open one closes it, as in the reference.
 */
export function FaqAccordion({ items, initialOpen }: { items: FaqItem[]; initialOpen: number }) {
  const [open, setOpen] = useState(initialOpen);
  const baseId = useId();

  return (
    <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-q${String(index)}`;
        const panelId = `${baseId}-a${String(index)}`;
        return (
          <div
            key={item.number}
            className={cn(
              "rounded-accordion border transition-[background] duration-200",
              isOpen ? "border-accent bg-surface-500" : "border-white/22 bg-transparent",
            )}
          >
            <h3 className="m-0 text-16 font-medium">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? -1 : index);
                }}
                className="flex min-h-15 w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-2.5 pr-2.5 pl-6 text-left font-sans text-16 font-medium text-white"
              >
                <span className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-display text-13 font-semibold",
                      isOpen ? "text-accent-raised" : "text-accent",
                    )}
                  >
                    {item.number}
                  </span>
                  <span>{item.question}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-10 flex-[0_0_40px] items-center justify-center rounded-full text-20",
                    isOpen ? "bg-accent text-ink" : "bg-white/8 text-white",
                  )}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <p
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="m-0 pt-0 pr-6 pb-5.5 pl-15.5 text-15 leading-loose text-fg-soft"
            >
              {item.answer}
            </p>
          </div>
        );
      })}
    </div>
  );
}
