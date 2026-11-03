import type { EducationalOrganization, FAQPage, Graph, WebSite } from "schema-dts";

import { site } from "@/shared/config/site";

/** Serializes JSON-LD safe for an inline <script>: `<` can't close the tag. */
export function serializeJsonLd(data: Graph): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: Graph }) {
  return (
    <script
      type="application/ld+json"
      // Safe: serializeJsonLd escapes `<`.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

const absolute = (path: string) => new URL(path, site.url).toString();

/** Only real profile URLs: "#" placeholders are left out until the links exist. */
const sameAs = site.social.map((s) => s.href).filter((href) => /^https?:\/\//.test(href));

export function organizationLd(): EducationalOrganization {
  return {
    "@type": "EducationalOrganization",
    "@id": absolute("/#organization"),
    name: site.name,
    url: site.homeUrl,
    logo: absolute("/icon"),
    description: site.description,
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function websiteLd(): WebSite {
  return {
    "@type": "WebSite",
    "@id": absolute("/#website"),
    name: site.name,
    url: site.homeUrl,
    inLanguage: "es",
    publisher: { "@id": absolute("/#organization") },
  };
}

/** FAQPage from the same items the accordion renders (single source of truth). */
export function faqPageLd(items: readonly { question: string; answer: string }[]): FAQPage {
  return {
    "@type": "FAQPage",
    "@id": absolute("/#faq"),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function graph(...nodes: (EducationalOrganization | WebSite | FAQPage)[]): Graph {
  return { "@context": "https://schema.org", "@graph": nodes };
}
