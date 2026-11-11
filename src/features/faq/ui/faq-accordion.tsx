"use client";

import { useId, useState } from "react";

import { linkAttributes, whatsappLink } from "@/shared/config/links";
import { cn } from "@/shared/lib/cn";

import type { FaqItem } from "../content";

/** Answer text; its `whatsapp.label` word (first match) becomes a WhatsApp link. */
function Answer({ item }: { item: FaqItem }) {
  const at = item.whatsapp ? item.answer.indexOf(item.whatsapp.label) : -1;
  if (!item.whatsapp || at < 0) return item.answer;
  const { label, message } = item.whatsapp;
  return (
    <>
      {item.answer.slice(0, at)}
      <a
        {...linkAttributes(whatsappLink(message))}
        className="font-medium text-accent-raised underline underline-offset-2"
      >
        {label}
      </a>
      {item.answer.slice(at + label.length)}
    </>
  );
}

/**
 * Accordion (WAI-ARIA pattern): heading > button with aria-expanded/aria-controls, panel as
 * region labelled by its button. Closed answers stay in the HTML for SEO, `inert` and invisible.
 * One item open at a time; clicking the open one closes it, as in the reference. Opening and
 * closing animate the height (grid rows 0fr ↔ 1fr) and turn the icon half a revolution.
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
            data-reveal
            className={cn(
              "rounded-accordion border transition-[background,border-color] duration-300",
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
                className="flex min-h-15 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent py-2.5 pr-2.5 pl-4 text-left font-sans text-16 font-medium text-white md:gap-4 md:pl-6"
              >
                <span className="flex items-center gap-3 md:gap-4">
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
                    "flex size-10 flex-[0_0_40px] items-center justify-center rounded-full text-20 transition-[background,color,rotate] duration-300 ease-out",
                    isOpen ? "rotate-180 bg-accent text-ink" : "bg-white/8 text-white",
                  )}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,visibility] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="m-0 px-4 pt-0 pb-5.5 text-15 leading-loose text-fg-soft md:pr-6 md:pl-15.5">
                  <Answer item={item} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
