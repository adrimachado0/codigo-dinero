import Image from "next/image";

import { site } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";
import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";

import { partnerContent } from "../content";

const { logo } = site.partner;

/** EC Markets logo (white with red circle): always on a dark background. */
function PartnerLogo({ className, height }: { className?: string; height: number }) {
  const width = Math.round(((height * logo.width) / logo.height) * 100) / 100;
  return (
    <Image
      src={logo.src}
      alt={site.partner.name}
      width={width}
      height={height}
      unoptimized
      className={cn("block", className)}
    />
  );
}

/** Hero block: "Partner oficial" pill, logo and tagline. */
export function HeroPartner({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Pill caps>{partnerContent.badge}</Pill>
      <PartnerLogo
        height={79.78}
        className="mx-auto mt-3.5 h-auto w-[230px] max-w-full lg:mr-0 lg:ml-auto"
      />
      <p className="mt-2 mb-0 text-14 text-wine-fg">{partnerContent.tagline}</p>
    </div>
  );
}

/** Footer chip: "Partner oficial | logo" on ink. */
export function FooterPartner() {
  return (
    <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-ink px-4.5 py-2.5 text-white">
      <span className="text-12 tracking-caps-md text-accent uppercase">{partnerContent.badge}</span>
      <span className="h-4 w-px bg-white/30" />
      <PartnerLogo height={24} className="h-6 w-auto" />
    </div>
  );
}

/** "EC MARKETS en números" band. */
export function PartnerStats() {
  return (
    <section
      aria-label={partnerContent.statsLabel}
      className="relative px-4 pt-12 md:px-6 md:pt-16"
    >
      <Reveal className="mx-auto box-border grid max-w-nav grid-cols-2 gap-y-7 rounded-card-lg border border-white/18 bg-surface-200 px-4 py-6.5 lg:flex lg:flex-wrap lg:gap-y-5">
        {partnerContent.stats.map((stat) => (
          <div key={stat.label} data-reveal className="flex-[1_1_200px] text-center">
            <p className="m-0 text-28 font-semibold md:text-34">
              {stat.before}
              <span className="text-accent">{stat.accent}</span>
              {stat.after}
            </p>
            <p className="mt-1.5 mb-0 text-14 text-fg-muted">{stat.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
