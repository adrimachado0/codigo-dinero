import { linkAttributes, whatsappLink } from "@/shared/config/links";
import { photos } from "@/shared/config/photos";
import { WhatsAppIcon } from "@/shared/ui/icons";
import { PersonPhoto } from "@/shared/ui/person-photo";
import { Reveal } from "@/shared/ui/reveal";
import { Sparkle } from "@/shared/ui/sparkle";

import { contactContent as content } from "../content";

/** Closing section: one WhatsApp button per profile (no form, no backend). */
export function Contact() {
  return (
    <section
      id="contacto"
      aria-label={content.sectionLabel}
      className="px-4 pt-18 md:px-6 md:pt-25"
    >
      <Reveal
        self={false}
        className="mx-auto flex max-w-content flex-wrap items-end justify-between gap-8"
      >
        <div data-reveal className="max-w-[560px] flex-[1_1_420px] pb-15">
          <h2 className="m-0 text-cta leading-heading font-medium tracking-tight">
            {content.title}
          </h2>
          <p className="mt-4.5 mb-0 text-16 leading-relaxed text-fg-muted">{content.body}</p>
          <div className="mt-6.5 flex max-w-[520px] flex-col gap-3">
            {content.profiles.map((profile) => (
              <a
                key={profile.message}
                {...linkAttributes(whatsappLink(profile.message))}
                className="group box-border flex min-h-15 items-center justify-between gap-4 rounded-full border border-white/30 py-2 pr-2 pl-6 text-15 font-medium text-white no-underline transition-[background-color,color,border-color] duration-300 hover:border-white hover:bg-white hover:text-ink"
              >
                <span>{profile.label}</span>
                <span className="flex size-11 flex-none items-center justify-center rounded-full bg-accent text-ink transition-transform duration-300 group-hover:scale-105">
                  <WhatsAppIcon />
                </span>
              </a>
            ))}
          </div>
          <p className="mt-3.5 mb-0 text-13 text-placeholder">{content.note}</p>
        </div>
        <div data-reveal className="relative h-[470px] min-w-0 flex-[0_1_360px]">
          <Sparkle size={40} className="absolute top-7.5 left-2.5" />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 -ml-[170px] size-[340px] rounded-full bg-wine shadow-[0_0_120px_rgba(255,43,43,0.18)]"
          />
          <PersonPhoto
            tone="charcoal"
            photo={photos.cta}
            sizes="280px"
            className="absolute bottom-0 left-1/2 -ml-[140px] w-[280px]"
          />
        </div>
      </Reveal>
    </section>
  );
}
