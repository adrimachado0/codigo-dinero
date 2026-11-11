import { describe, expect, it } from "vitest";

import { faqPageLd, graph, organizationLd, serializeJsonLd, websiteLd } from "./json-ld";

describe("JSON-LD", () => {
  it("escapes < so the payload can't close the script tag", () => {
    const json = serializeJsonLd(
      graph(faqPageLd([{ question: "¿Hola?", answer: "</script><script>alert(1)</script>" }])),
    );

    expect(json).not.toContain("</script>");
    expect(JSON.parse(json)).toMatchObject({
      "@graph": [
        { mainEntity: [{ acceptedAnswer: { text: "</script><script>alert(1)</script>" } }] },
      ],
    });
  });

  it("builds FAQPage questions from the given items", () => {
    expect(faqPageLd([{ question: "¿Cuánto cuesta?", answer: "[PRECIO]" }])).toMatchObject({
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cuánto cuesta?",
          acceptedAnswer: { "@type": "Answer", text: "[PRECIO]" },
        },
      ],
    });
  });

  it("links WebSite to the organization and lists only real profiles as sameAs", () => {
    const org = organizationLd();

    expect(org).toMatchObject({ "@type": "EducationalOrganization", name: "Código Dinero" });
    expect(org).toMatchObject({
      sameAs: [
        "https://www.youtube.com/@tradersdexau",
        "https://www.instagram.com/gonzalezbrothers.xau",
        "https://www.tiktok.com/@gonzalezbrothers.xau",
      ],
    });
    expect(org).toMatchObject({ "@id": "http://localhost:3000/#organization" });
    expect(websiteLd()).toMatchObject({
      publisher: { "@id": "http://localhost:3000/#organization" },
      inLanguage: "es",
    });
  });
});
