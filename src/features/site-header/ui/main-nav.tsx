"use client";

import gsap from "gsap";
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

// `relative` keeps the text above the sliding highlight.
const linkClass = "relative py-3 text-white no-underline";

/** Horizontal room (px) the highlight pill adds around the link text. */
const PILL_PAD_X = 14;
const PILL_PAD_Y = 3;

/**
 * Hover highlight that slides from link to link (desktop): appears in place on the first
 * link, then glides to the next one.
 */
function movePill(nav: HTMLElement, pill: HTMLElement, link: HTMLElement) {
  const navBox = nav.getBoundingClientRect();
  const box = link.getBoundingClientRect();
  const target = {
    x: box.left - navBox.left - PILL_PAD_X,
    y: box.top - navBox.top + PILL_PAD_Y,
    width: box.width + PILL_PAD_X * 2,
    height: box.height - PILL_PAD_Y * 2,
  };
  const visible = Number(gsap.getProperty(pill, "opacity")) > 0.05;
  if (visible) {
    gsap.to(pill, { ...target, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: true });
  } else {
    gsap.set(pill, target);
    gsap.to(pill, { opacity: 1, duration: 0.2, ease: "power1.out", overwrite: true });
  }
}

/** Fades the highlight out when the pointer/focus leaves the nav. */
function hidePill(pill: HTMLElement) {
  gsap.to(pill, { opacity: 0, duration: 0.25, overwrite: true });
}

export function MainNav({ links, cta, logoText, homeLabel, labels }: MainNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const onLinkEnter = (event: { currentTarget: HTMLElement }) => {
    if (navRef.current && pillRef.current) {
      movePill(navRef.current, pillRef.current, event.currentTarget);
    }
  };
  const onNavLeave = () => {
    if (pillRef.current) hidePill(pillRef.current);
  };
  const linkHandlers = { onPointerEnter: onLinkEnter, onFocus: onLinkEnter };

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
        ref={navRef}
        aria-label={labels.navLabel}
        onKeyDown={onKeyDown}
        onPointerLeave={onNavLeave}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) onNavLeave();
        }}
        className="relative mx-auto box-border flex max-w-nav flex-wrap items-center justify-between gap-x-4.5 gap-y-1.5 rounded-nav bg-ink py-2 pr-2.5 pl-6.5"
      >
        <span
          ref={pillRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 rounded-full bg-white/10 opacity-0"
        />
        <div className="hidden flex-[1_1_260px] flex-wrap gap-x-6.5 gap-y-1 text-14 md:flex">
          {left.map((link) => (
            <a key={link.label} href={link.href} className={linkClass} {...linkHandlers}>
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
            <a
              key={link.label}
              href={link.href}
              className={`${linkClass} hidden md:inline`}
              {...linkHandlers}
            >
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
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-transparent p-0 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink md:hidden"
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
