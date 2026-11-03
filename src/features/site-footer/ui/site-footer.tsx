import type { ComponentType } from "react";

import { FooterPartner } from "@/features/broker-partner";
import { site, type SocialNetwork } from "@/shared/config/site";
import {
  InstagramIcon,
  TelegramIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
  type IconProps,
} from "@/shared/ui/icons";
import { Starburst } from "@/shared/ui/starburst";

import { footerContent as content } from "../content";

const socialIcons: Record<SocialNetwork, ComponentType<IconProps>> = {
  YouTube: YouTubeIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  Telegram: TelegramIcon,
  X: XIcon,
};

export function SiteFooter() {
  return (
    <footer className="px-4 pb-4">
      <div className="mx-auto box-border max-w-shell rounded-panel bg-accent px-[clamp(22px,4vw,56px)] pt-[clamp(32px,4vw,56px)] pb-7 text-ink">
        <div className="flex flex-wrap gap-x-12 gap-y-9">
          <div className="max-w-[420px] flex-[1_1_320px]">
            <a
              href="#inicio"
              aria-label={site.homeLabel}
              className="inline-flex items-center gap-3 text-ink no-underline"
            >
              <Starburst size={40} className="text-ink" />
              <span className="font-display text-40 leading-none font-extrabold">
                {site.logoText}
              </span>
            </a>
            <p className="mt-4.5 mb-0 text-15 leading-relaxed text-ink-soft">{content.about}</p>
            <FooterPartner />
          </div>
          {content.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex-[1_1_140px]">
              <h2 className="m-0 text-13 font-semibold tracking-caps-md uppercase">
                {column.title}
              </h2>
              <div className="mt-3.5 flex flex-col text-15">
                {column.links.map((link) => (
                  <a key={link.label} href={link.href} className="py-1.25 text-ink no-underline">
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          ))}
        </div>
        <p className="mt-9 mb-0 border-t border-ink/22 pt-5.5 text-13 leading-loose text-ink-soft">
          {content.risk}
        </p>
        <div className="mt-5.5 flex flex-wrap items-center justify-between gap-4">
          <p className="m-0 text-13 text-ink-soft">{content.copyright}</p>
          <div className="flex gap-2">
            {site.social.map((network) => {
              const Icon = socialIcons[network.name];
              return (
                <a
                  key={network.name}
                  href={network.href}
                  aria-label={network.name}
                  className="flex size-11 items-center justify-center rounded-full bg-ink text-accent"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
