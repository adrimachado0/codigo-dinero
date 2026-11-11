import { PulseDot } from "@/shared/ui/pulse-dot";
import { Reveal } from "@/shared/ui/reveal";
import { SectionTitle } from "@/shared/ui/section-title";
import { MiniChartWidget } from "@/shared/ui/tradingview-widget";

import { marketContent as content } from "../content";
import { QuotesTabs } from "./quotes-tabs";

const card =
  "box-border flex min-w-0 flex-[1_1_320px] flex-col rounded-card border border-white/8 bg-ink";

/** "Cotizaciones en tiempo real": Gold and Bitcoin mini charts and the quotes by market. */
export function MarketOverview() {
  return (
    <section id="mercado" aria-labelledby="mercado-title" className="px-3 pt-18 md:px-4 md:pt-27.5">
      <Reveal className="mx-auto box-border max-w-panel rounded-panel border border-white/6 bg-surface-300 px-4 py-6 md:p-[clamp(28px,4vw,56px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div data-reveal className="min-w-0 flex-[1_1_420px]">
            <SectionTitle
              id="mercado-title"
              lead={content.titleLead}
              highlight={content.titleHighlight}
              className="text-about leading-subheading"
            />
            <p className="mt-4 mb-0 max-w-[520px] text-15 leading-relaxed text-fg-muted">
              {content.intro}
            </p>
          </div>
          <span
            data-reveal
            className="inline-flex items-center gap-2 rounded-full border border-white/24 px-3.5 py-2 text-13 text-fg-soft"
          >
            <PulseDot />
            {content.source}
          </span>
        </div>

        <div className="mt-9 flex flex-wrap items-stretch gap-4.5">
          {content.featured.map((item) => (
            <div key={item.symbol.proName} data-reveal className={`${card} p-6`}>
              <div data-mini-chart className="relative min-h-[239px] flex-auto">
                <MiniChartWidget
                  symbol={item.symbol.proName}
                  title={item.title}
                  className="absolute inset-0"
                />
              </div>
            </div>
          ))}
          <div data-reveal className={`${card} p-5.5`}>
            <QuotesTabs
              groups={content.groups}
              label={content.tabsLabel}
              widgetTitle={content.quotesTitle}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
