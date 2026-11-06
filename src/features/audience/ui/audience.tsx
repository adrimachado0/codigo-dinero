import { cva } from "class-variance-authority";

import { LinkButton } from "@/shared/ui/button";
import { ArrowRightIcon, CommunityIcon, StepsUpIcon, TrendUpIcon } from "@/shared/ui/icons";
import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";
import { RichText } from "@/shared/ui/rich-text";
import { SectionTitle } from "@/shared/ui/section-title";

import { audienceContent as content } from "../content";

const icons = { steps: StepsUpIcon, trend: TrendUpIcon, community: CommunityIcon } as const;

// Hover: the card lifts like the buttons; dark cards light up their border.
const cardVariants = cva(
  "box-border flex min-w-0 flex-[1_1_300px] flex-col rounded-card-lg p-5 transition-[translate,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 md:min-h-[440px] md:p-7",
  {
    variants: {
      tone: {
        dark: "border border-white/8 bg-surface-400 hover:border-white/24",
        raised: "border border-white/8 bg-surface-600 hover:border-white/24",
        accent: "bg-accent text-ink hover:shadow-[0_18px_40px_-18px_rgba(255,43,43,0.6)]",
      },
    },
  },
);

export function Audience() {
  return (
    <section
      id="para-quien"
      aria-labelledby="para-quien-title"
      className="relative px-4 pt-18 md:px-6 md:pt-27.5"
    >
      <Reveal self={false} className="mx-auto max-w-content">
        <SectionTitle
          id="para-quien-title"
          data-reveal
          lead={content.titleLead}
          highlight={content.titleHighlight}
          className="text-about leading-subheading"
        />
        <div className="mt-11 flex flex-wrap items-stretch gap-4.5">
          {content.cards.map((card) => {
            const onAccent = card.tone === "accent";
            const Icon = icons[card.icon];
            return (
              <article key={card.number} data-reveal className={cardVariants({ tone: card.tone })}>
                <div className="flex items-center justify-between gap-3">
                  <Pill tone={onAccent ? "ink" : "outline"} size="tag" caps>
                    {card.tag}
                  </Pill>
                  <span
                    className={`font-display text-22 font-semibold ${onAccent ? "text-ink" : "text-accent"}`}
                  >
                    {card.number}
                  </span>
                </div>
                <Icon className={`mt-6 md:mt-10 ${onAccent ? "text-ink" : "text-accent"}`} />
                <h3
                  className={`mt-6 mb-0 text-24 leading-tight ${onAccent ? "font-semibold" : "font-medium"}`}
                >
                  {card.title}
                </h3>
                <p
                  className={`mt-3.5 mb-0 text-15 leading-relaxed ${onAccent ? "text-ink-soft" : "text-fg-muted"}`}
                >
                  <RichText value={card.body} />
                </p>
                {onAccent ? (
                  <LinkButton
                    href={card.cta.href}
                    tone="ink"
                    size="lg"
                    className="group mt-5 gap-2.5 self-start md:mt-auto"
                  >
                    {card.cta.label}
                    <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </LinkButton>
                ) : (
                  <a
                    href={card.cta.href}
                    className="group mt-auto inline-flex min-h-11 items-center gap-2.5 pt-5 text-15 font-medium text-white no-underline transition-colors duration-300 hover:text-accent md:pt-7"
                  >
                    {card.cta.label}
                    <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
