import { photos } from "@/shared/config/photos";
import { LinkButton } from "@/shared/ui/button";
import { CandlesIcon } from "@/shared/ui/icons";
import { PersonPhoto } from "@/shared/ui/person-photo";
import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";
import { RichText } from "@/shared/ui/rich-text";
import { SectionTitle } from "@/shared/ui/section-title";

import { mentorContent as content } from "../content";

const photo = photos.mentor;

const captionBars = [
  { width: "w-2.25", opacity: "" },
  { width: "w-1.25", opacity: "opacity-80" },
  { width: "w-0.75", opacity: "opacity-60" },
];

export function MentorProfile() {
  return (
    <section id="quien-soy" aria-labelledby="quien-soy-title" className="px-6 pt-27.5">
      <Reveal
        self={false}
        className="mx-auto flex max-w-content flex-wrap items-center gap-x-16 gap-y-10"
      >
        <div
          data-reveal
          className="relative h-[440px] max-w-[440px] min-w-0 flex-[1_1_320px] overflow-hidden rounded-card-lg bg-surface-600 md:h-[540px]"
        >
          <PersonPhoto
            tone="graphite"
            photo={photo}
            label={null}
            // Rendered at most 405px wide (92% of the 440px card).
            sizes="405px"
            className={
              photo
                ? "absolute top-8 left-1/2 w-[92%] -translate-x-1/2"
                : "absolute bottom-0 left-1/2 w-[82%] -translate-x-1/2"
            }
            imageClassName="[filter:grayscale(1)_contrast(1.05)]"
          />
          <CandlesIcon className="absolute top-6.5 right-6.5 text-accent" />
          {!photo && <Pill className="absolute top-6.5 left-5.5">{content.photoLabel}</Pill>}
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
              href={content.primaryCta.href}
              size="lg"
              className="box-border justify-center gap-2.5"
            >
              {content.primaryCta.label}
            </LinkButton>
            <LinkButton
              href={content.partnerCta.href}
              tone="outline"
              size="lg"
              className="box-border justify-center gap-2.5"
            >
              {content.partnerCta.label}
            </LinkButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
