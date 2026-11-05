import { MarketTicker } from "@/features/market-ticker";
import { site } from "@/shared/config/site";
import { QrPattern } from "@/shared/ui/qr-pattern";

import { headerContent } from "../content";
import { MainNav } from "./main-nav";

/**
 * Top of the wine shell (nav + menu + ticker). The shell continues in the hero section, so
 * this part has only the top radius; together they look like the reference's single block.
 */
export function SiteHeader() {
  return (
    <div id="inicio" className="px-4 pt-4">
      <header
        data-qr-anchor
        className="relative isolate mx-auto box-border max-w-full overflow-hidden rounded-t-card-lg bg-wine px-[clamp(16px,3vw,40px)] pt-5.5 text-white"
      >
        <QrPattern id="header" />
        <MainNav
          links={site.nav.links}
          cta={site.nav.cta}
          homeLabel={site.homeLabel}
          labels={headerContent}
        />
        <MarketTicker />
      </header>
    </div>
  );
}
