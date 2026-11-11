import Image from "next/image";

import { linkAttributes, partnerRegistrationLink, whatsappLink } from "@/shared/config/links";
import { photos, type PhotoSlot } from "@/shared/config/photos";
import { LinkButton } from "@/shared/ui/button";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/shared/ui/icons";
import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";
import { RichText } from "@/shared/ui/rich-text";
import { SectionTitle } from "@/shared/ui/section-title";

import { mentorContent as content } from "../content";

const captionBars = [
  { width: "w-2.25", opacity: "" },
  { width: "w-1.25", opacity: "opacity-80" },
  { width: "w-0.75", opacity: "opacity-60" },
];

// Focal points of the design (object-position).
const events = [
  { photo: photos.stand, caption: content.events.stand, position: "object-[50%_14%]" },
  { photo: photos.moneyExpo, caption: content.events.moneyExpo, position: "object-[50%_36%]" },
];

/** Event photo with the black caption and the red bar (stand, Money Expo). */
function EventCard({
  photo,
  caption,
  position,
}: {
  photo: PhotoSlot;
  caption: string;
  position: string;
}) {
  return (
    <figure
      data-reveal
      className="relative m-0 h-60 min-w-0 flex-[1_1_320px] overflow-hidden rounded-card bg-surface-600 md:h-80"
    >
      {photo && (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 1023px) 100vw, 541px"
          className={`object-cover ${position}`}
        />
      )}
      <figcaption className="absolute bottom-4 left-4 flex items-stretch gap-1">
        <span className="bg-ink px-3.5 py-[9px] text-13 font-semibold text-white">{caption}</span>
        <span className="w-1.5 bg-accent" />
      </figcaption>
    </figure>
  );
}

export function MentorProfile() {
  const photo = photos.mentor;
  return (
    <section
      id="quien-soy"
      aria-labelledby="quien-soy-title"
      className="px-4 pt-18 md:px-6 md:pt-27.5"
    >
      <Reveal
        self={false}
        className="mx-auto flex max-w-content flex-wrap items-center gap-x-16 gap-y-10"
      >
        <div
          data-reveal
          className="relative h-[440px] max-w-[440px] min-w-0 flex-[1_1_320px] overflow-hidden rounded-card-lg bg-surface-600 md:h-[540px]"
        >
          {photo && (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 767px) 100vw, 440px"
              className="object-cover object-[100%_30%]"
            />
          )}
          <div className="absolute right-5 bottom-5 left-5 flex items-stretch gap-1.25">
            <div className="bg-accent py-3 pr-5 pl-5.5 leading-caps text-ink">
              <span className="block text-16 font-bold">{content.name}</span>
              <span className="block text-12 font-semibold tracking-caps-xs uppercase">
                {content.role}
              </span>
            </div>
            {captionBars.map((bar) => (
              <div key={bar.width} className={`${bar.width} bg-accent ${bar.opacity}`} />
            ))}
          </div>
        </div>

        <div data-reveal className="min-w-0 flex-[1.2_1_420px]">
          <p className="m-0 text-14 font-medium tracking-caps text-accent uppercase">
            {content.eyebrow}
          </p>
          <SectionTitle
            id="quien-soy-title"
            lead={content.titleLead}
            highlight={content.titleHighlight}
            className="mt-3.5 text-about leading-subheading"
          />
          <p className="mt-6.5 mb-0 text-18 leading-relaxed text-fg-quote">
            <RichText value={content.intro} strongClassName="font-semibold text-white" />
          </p>
          <p className="mt-4 mb-0 text-15 leading-airy text-fg-muted">
            <RichText value={content.body} strongClassName="font-semibold text-white" />
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {content.facts.map((fact) => (
              <Pill key={fact.label} tone={fact.highlight ? "outline-accent" : "outline"} size="sm">
                {fact.label}
              </Pill>
            ))}
          </div>
          <div className="mt-7.5 flex flex-wrap gap-3">
            <LinkButton
              {...linkAttributes(partnerRegistrationLink)}
              size="lg"
              className="box-border justify-center gap-2.5"
            >
              {content.primaryCta}
              <ArrowUpRightIcon size={12} strokeWidth={2.2} />
            </LinkButton>
            <LinkButton
              {...linkAttributes(whatsappLink("partner"))}
              tone="outline"
              size="lg"
              className="box-border justify-center gap-2.5"
            >
              <WhatsAppIcon size={17} />
              {content.partnerCta}
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-[1_1_100%] flex-wrap gap-4.5">
          {events.map((event) => (
            <EventCard key={event.caption} {...event} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
