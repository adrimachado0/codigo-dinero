import { externalLinkProps, linkAttributes, links, whatsappLink } from "@/shared/config/links";
import { markets } from "@/shared/config/markets";
import { LinkButton } from "@/shared/ui/button";
import { WhatsAppIcon } from "@/shared/ui/icons";
import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";
import { AdvancedChartWidget } from "@/shared/ui/tradingview-widget";

import { indicatorContent as content } from "../content";

/** "Indicador Institucional Premium" with the live XAUUSD chart (3 minutes). */
export function PremiumIndicator() {
  const lastChip = content.chips.length - 1;
  return (
    <section
      id="indicador"
      aria-labelledby="indicador-title"
      className="px-3 pt-18 md:px-4 md:pt-27.5"
    >
      <Reveal className="mx-auto box-border max-w-panel rounded-panel border border-white/6 bg-surface-300 px-4 py-6 md:p-[clamp(28px,4vw,56px)]">
        <div className="flex flex-wrap items-end gap-x-14 gap-y-7">
          <div data-reveal className="min-w-0 flex-[1_1_440px]">
            <Pill size="tag" caps>
              {content.tag}
            </Pill>
            <h2
              id="indicador-title"
              className="mt-4.5 mb-0 text-about leading-subheading font-medium"
            >
              {content.titleLead}{" "}
              <span className="block text-accent">{content.titleHighlight}</span>
            </h2>
            <p className="mt-4.5 mb-0 text-18 leading-[1.55] text-fg-quote">{content.lead}</p>
          </div>
          <div data-reveal className="min-w-0 flex-[1_1_400px]">
            <p className="m-0 text-15 leading-airy text-fg-muted">{content.body}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {content.chips.map((chip, index) => (
                <Pill key={chip} tone={index === lastChip ? "outline-accent" : "outline"} size="sm">
                  {chip}
                </Pill>
              ))}
            </div>
            <LinkButton
              {...linkAttributes(whatsappLink("indicator"))}
              className="mt-6.5 box-border min-h-13 justify-center gap-2.5 px-6 text-15"
            >
              <WhatsAppIcon />
              {content.cta}
            </LinkButton>
          </div>
        </div>

        <figure data-reveal className="mx-0 mt-10 mb-0">
          {/* Height follows the design's chart at each breakpoint; the widget fills it. */}
          <div
            data-chart-frame
            className="relative overflow-hidden rounded-[16px] border border-white/10 bg-canvas md:rounded-tile"
          >
            <div aria-hidden="true" className="h-[43px]" />
            <div
              aria-hidden="true"
              className="aspect-[340/380] md:aspect-[680/420] lg:aspect-[1100/470]"
            />
            <AdvancedChartWidget
              symbol={markets.gold.proName}
              interval="3"
              title={content.chartTitle}
              className="absolute inset-0"
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap justify-end gap-x-6 gap-y-1.5 text-13">
            <a
              href={links.tradingViewGold}
              data-link="tradingview-xauusd"
              {...externalLinkProps}
              className="text-fg-muted"
            >
              {content.attribution}
            </a>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
