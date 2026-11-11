import type { ComponentType } from "react";

import { FooterPartner } from "@/features/broker-partner";
import { linkAttributes } from "@/shared/config/links";
import { site, type SocialNetwork } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";
import {
  ArrowUpRightIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
  type IconProps,
} from "@/shared/ui/icons";
import { Logo } from "@/shared/ui/logo";
import { Reveal } from "@/shared/ui/reveal";

import { footerContent as content } from "../content";

const socialIcons: Record<SocialNetwork, ComponentType<IconProps>> = {
  YouTube: YouTubeIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  WhatsApp: WhatsAppIcon,
};

export function SiteFooter() {
  return (
    <footer className="px-3 pb-3 md:px-4 md:pb-4">
      {/* Only the columns move: shifting the last panel would stretch the page while it rises. */}
      <Reveal
        self={false}
        className="mx-auto box-border max-w-shell rounded-panel bg-accent px-5 pt-[clamp(32px,4vw,56px)] pb-7 text-ink md:px-[clamp(22px,4vw,56px)]"
      >
        <div className="flex flex-wrap gap-x-12 gap-y-9">
          <div data-reveal className="max-w-[420px] flex-[1_1_320px]">
            <a
              href="#inicio"
              aria-label={site.homeLabel}
              className="inline-flex items-center rounded-badge bg-ink px-5 py-3.5 no-underline"
            >
              <Logo height={64} />
            </a>
            <p className="mt-4.5 mb-0 text-15 leading-relaxed text-ink-soft">{content.about}</p>
            <FooterPartner />
          </div>
          {content.columns.map((column) => (
            <nav
              key={column.title}
              data-reveal
              aria-label={column.title}
              className="flex-[1_1_140px]"
            >
              <h2 className="m-0 text-13 font-semibold tracking-caps-md uppercase">
                {column.title}
              </h2>
              <div className="mt-3.5 flex flex-col text-15">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    {...linkAttributes(link)}
                    download={link.download}
                    className={cn(
                      "py-1.25 text-ink no-underline decoration-2 underline-offset-4 hover:underline",
                      link.external && "inline-flex items-center gap-1.25",
                    )}
                  >
                    {link.label}
                    {link.external && <ArrowUpRightIcon size={12} strokeWidth={2.2} />}
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
          <div className="flex flex-wrap gap-2">
            {site.social.map((network) => {
              const Icon = socialIcons[network.name];
              return (
                <a
                  key={network.name}
                  {...linkAttributes({ ...network, external: true })}
                  aria-label={network.name}
                  className="flex size-11 items-center justify-center rounded-full bg-ink text-accent transition-[background-color,color,box-shadow] duration-300 hover:bg-accent hover:text-ink hover:shadow-[inset_0_0_0_2px_#111111]"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
