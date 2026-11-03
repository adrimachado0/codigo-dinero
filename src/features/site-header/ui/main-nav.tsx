"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import type { NavLink } from "@/shared/config/site";
import { LinkButton } from "@/shared/ui/button";
import { CloseIcon, MenuIcon } from "@/shared/ui/icons";
import { Starburst } from "@/shared/ui/starburst";

export const MOBILE_MENU_ID = "cod-mobile-menu";

type MainNavProps = {
  links: readonly NavLink[];
  cta: NavLink;
  logoText: string;
  homeLabel: string;
  labels: { navLabel: string; openMenuLabel: string; closeMenuLabel: string };
};

const linkClass = "py-3 text-white no-underline";

export function MainNav({ links, cta, logoText, homeLabel, labels }: MainNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // First three links on the left of the logo, the rest on the right (desktop/tablet).
  const left = links.slice(0, 3);
  const right = links.slice(3);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      close(true);
    }
  };

  return (
    <>
      <nav
        aria-label={labels.navLabel}
        onKeyDown={onKeyDown}
        className="mx-auto box-border flex max-w-nav flex-wrap items-center justify-between gap-x-4.5 gap-y-1.5 rounded-nav bg-ink py-2 pr-2.5 pl-6.5"
      >
        <div className="hidden flex-[1_1_260px] flex-wrap gap-x-6.5 gap-y-1 text-14 md:flex">
          {left.map((link) => (
            <a key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#inicio"
          aria-label={homeLabel}
          className="flex flex-none items-center gap-2 text-white no-underline"
        >
          <Starburst size={26} spinSeconds={24} />
          <span className="font-display text-20 font-extrabold tracking-logo">{logoText}</span>
        </a>
        <div className="flex flex-none flex-wrap items-center justify-end gap-2 text-14 md:flex-[1_1_260px] md:gap-x-6.5 md:gap-y-1">
          {right.map((link) => (
            <a key={link.label} href={link.href} className={`${linkClass} hidden md:inline`}>
              {link.label}
            </a>
          ))}
          <LinkButton href={cta.href} size="nav">
            {cta.label}
          </LinkButton>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
            aria-label={open ? labels.closeMenuLabel : labels.openMenuLabel}
            onClick={() => {
              setOpen((value) => !value);
            }}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-transparent p-0 text-white md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          id={MOBILE_MENU_ID}
          onKeyDown={onKeyDown}
          className="mx-auto mt-2 flex max-w-nav flex-col rounded-card bg-ink px-5.5 py-1.5 md:hidden"
        >
          {links.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                close(false);
              }}
              className={
                index < links.length - 1
                  ? "border-b border-white/8 py-3.5 text-17 text-white no-underline"
                  : "py-3.5 text-17 text-white no-underline"
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
