import { About } from "@/features/about";
import { PartnerStats } from "@/features/broker-partner";
import { Faq, faqContent } from "@/features/faq";
import { Hero } from "@/features/hero";
import { LeadCapture } from "@/features/lead-capture";
import { MottoBand } from "@/features/motto-band";
import { SiteFooter } from "@/features/site-footer";
import { SiteHeader } from "@/features/site-header";
import { Testimonials } from "@/features/testimonials";
import { TopicsRibbon } from "@/features/topics-ribbon";
import { Training } from "@/features/training";
import { faqPageLd, graph, JsonLd, organizationLd, websiteLd } from "@/shared/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd data={graph(organizationLd(), websiteLd(), faqPageLd(faqContent.items))} />
      <SiteHeader />
      <main>
        <Hero />
        {/* Red glows behind the content (positioned against the page wrapper). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[980px] -left-40 size-[420px] rounded-full bg-accent opacity-8 blur-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[1700px] -right-45 size-[460px] rounded-full bg-accent opacity-7 blur-blob-lg"
        />
        <PartnerStats />
        <About />
        <MottoBand />
        <Training />
        <Testimonials />
        <TopicsRibbon />
        <Faq />
        <LeadCapture />
      </main>
      <SiteFooter />
    </>
  );
}
