import { HeroPartner } from "@/features/broker-partner";
import { linkAttributes, partnerRegistrationLink, whatsappLink } from "@/shared/config/links";
import { photos } from "@/shared/config/photos";
import { LinkButton } from "@/shared/ui/button";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/shared/ui/icons";
import { ParticleSphere } from "@/shared/ui/particle-sphere";
import { PersonPhoto } from "@/shared/ui/person-photo";
import { QrPattern } from "@/shared/ui/qr-pattern";
import { RichText } from "@/shared/ui/rich-text";
import { Starburst } from "@/shared/ui/starburst";

import { heroContent } from "../content";

const photo = photos.hero;

/**
 * Lower part of the wine shell (the header is the top part). The h1 is the LCP element:
 * it is never animated on entry.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="px-3 md:px-4">
      <div className="relative isolate mx-auto box-border max-w-full overflow-hidden rounded-b-hero-bottom bg-wine px-3 text-white md:px-[clamp(16px,3vw,40px)]">
        <QrPattern id="hero" continued />
        <div className="mx-auto max-w-nav">
          <div className="relative mx-auto mt-14 max-w-narrow text-center">
            <Starburst
              size={72}
              strokeWidth={2.6}
              spinSeconds={30}
              className="absolute -top-12.5 left-1/2 -ml-5 size-10 md:-top-8.5 md:left-0 md:ml-0 md:size-18"
            />
            <h1
              id="hero-title"
              className="mx-auto my-0 max-w-[940px] text-hero leading-display font-semibold tracking-tightest text-balance text-white"
            >
              {heroContent.title.lead}{" "}
              <span className="block text-balance text-accent">{heroContent.title.highlight}</span>
            </h1>
            <svg
              width="40"
              height="44"
              viewBox="0 0 40 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
              className="absolute right-2 bottom-0.5 hidden text-accent md:block"
            >
              <path d="M34 6L8 20M10 28L34 38" />
            </svg>
          </div>

          <div className="mt-7 flex flex-col flex-wrap items-stretch gap-7 lg:mt-5 lg:flex-row lg:items-end lg:gap-6">
            <div className="relative z-1 mx-auto max-w-[560px] flex-none text-center lg:mx-0 lg:max-w-[320px] lg:flex-[1_1_260px] lg:pb-30 lg:text-left">
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
                className="text-accent max-lg:hidden"
              >
                <path d="M3 3L9 16M13 2L16 13" />
              </svg>
              <p className="mt-2.5 mb-0 text-15 leading-relaxed text-wine-fg">
                <RichText value={heroContent.intro} strongClassName="font-semibold text-white" />
              </p>
            </div>

            <div className="relative h-[420px] w-full min-w-0 flex-none md:h-[480px] lg:h-[500px] lg:w-auto lg:flex-[1.6_1_380px]">
              <div className="absolute bottom-0 left-1/2 -ml-[190px] size-[380px] rounded-full bg-wine-circle shadow-glow md:-ml-[230px] md:size-[460px] lg:-bottom-10" />
              <ParticleSphere
                interactive
                aria-hidden="true"
                className="absolute inset-0 block size-full"
              />
              <PersonPhoto
                tone="wine"
                photo={photo}
                preload
                sizes="(max-width: 767px) 320px, 420px"
                className="absolute bottom-0 left-1/2 -ml-40 w-80 md:-ml-[210px] md:w-[420px]"
                labelClassName="top-1/2 md:top-[66%]"
                imageClassName="max-lg:[mask-image:linear-gradient(to_bottom,#000_78%,transparent_100%)]"
              />
              {/* Below 768px the capsule stacks in a column (reference: .cod-hero-cta). */}
              <div className="absolute bottom-6.5 left-1/2 z-2 flex w-[min(300px,calc(100%-24px))] -translate-x-1/2 flex-col gap-1.5 rounded-accordion bg-ink/86 p-1.5 md:w-auto md:flex-row md:rounded-full md:whitespace-nowrap">
                <LinkButton
                  {...linkAttributes(partnerRegistrationLink)}
                  className="gap-1.75 max-md:justify-center"
                >
                  {heroContent.primaryCta}
                  <ArrowUpRightIcon size={12} strokeWidth={2.2} />
                </LinkButton>
                <LinkButton
                  {...linkAttributes(whatsappLink("partner"))}
                  tone="outline-soft"
                  className="gap-2 max-md:justify-center"
                >
                  <WhatsAppIcon size={16} />
                  {heroContent.partnerCta}
                </LinkButton>
              </div>
            </div>

            <HeroPartner className="relative z-1 mx-auto mt-2 max-w-none flex-none pb-16 text-center lg:mt-0 lg:mr-0 lg:ml-auto lg:max-w-[280px] lg:flex-[1_1_220px] lg:pb-40 lg:text-right" />
          </div>
        </div>
      </div>
    </section>
  );
}
