import { HeroPartner } from "@/features/broker-partner";
import { photos } from "@/shared/config/photos";
import { LinkButton } from "@/shared/ui/button";
import { ParticleSphere } from "@/shared/ui/particle-sphere";
import { PersonPhoto } from "@/shared/ui/person-photo";
import { Starburst } from "@/shared/ui/starburst";

import { heroContent } from "../content";

const photo = photos.hero;

/**
 * Lower part of the wine shell (the header is the top part). The h1 is the LCP element:
 * it is never animated on entry.
 */
export function Hero() {
  const [line1, line2] = heroContent.titleLines;
  return (
    <section id="hero" aria-labelledby="hero-title" className="px-4">
      <div className="relative mx-auto box-border max-w-shell overflow-hidden rounded-b-hero-bottom bg-wine px-[clamp(16px,3vw,40px)] text-white">
        <div className="relative mx-auto mt-14 max-w-narrow text-center">
          <Starburst
            size={72}
            strokeWidth={2.6}
            spinSeconds={30}
            className="absolute -top-12.5 left-1/2 -ml-5 size-10 md:-top-8.5 md:left-0 md:ml-0 md:size-18"
          />
          <h1
            id="hero-title"
            className="m-0 text-hero leading-display font-semibold tracking-tightest text-white"
          >
            {line1}
            <br />
            {line2}
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
          <div className="mx-auto max-w-[560px] flex-none text-center lg:mx-0 lg:max-w-[320px] lg:flex-[1_1_260px] lg:pb-30 lg:text-left">
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
            <p className="mt-2.5 mb-0 text-15 leading-relaxed text-wine-fg">{heroContent.intro}</p>
            <LinkButton
              href={heroContent.secondaryCta.href}
              tone="outline-strong"
              className="mt-5.5 box-border px-5.5"
            >
              {heroContent.secondaryCta.label}
            </LinkButton>
          </div>

          <div className="relative h-[420px] w-full min-w-0 flex-none md:h-[480px] lg:h-[500px] lg:w-auto lg:flex-[1.6_1_380px]">
            <div className="absolute bottom-0 left-1/2 -ml-[190px] size-[380px] rounded-full bg-wine-circle shadow-glow md:-ml-[230px] md:size-[460px] lg:-bottom-10" />
            <ParticleSphere
              kind="hero"
              aria-hidden="true"
              className="absolute inset-0 block size-full"
            />
            <PersonPhoto
              tone="wine"
              photo={photo}
              className="absolute bottom-0 left-1/2 -ml-[135px] w-[270px] md:-ml-[155px] md:w-[310px]"
              labelClassName="top-1/2 md:top-[66%]"
            />
            <div className="absolute bottom-6.5 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink/86 p-1.5 whitespace-nowrap">
              <LinkButton href={heroContent.primaryCta.href}>
                {heroContent.primaryCta.label}
              </LinkButton>
              <LinkButton href={heroContent.accountCta.href} tone="outline-soft">
                {heroContent.accountCta.label}
              </LinkButton>
            </div>
          </div>

          <HeroPartner className="mx-auto mt-2 max-w-none flex-none pb-16 text-center lg:mt-0 lg:mr-0 lg:ml-auto lg:max-w-[280px] lg:flex-[1_1_220px] lg:pb-40 lg:text-right" />
        </div>
      </div>
    </section>
  );
}
