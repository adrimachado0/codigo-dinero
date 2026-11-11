import { describe, expect, it } from "vitest";

import { libraryRequestMessage, WHATSAPP_NUMBER, whatsappMessages, whatsappUrl } from "./links";

describe("whatsappUrl", () => {
  it("opens a chat with the number and the encoded message", () => {
    const url = new URL(whatsappUrl(whatsappMessages.book));

    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);
    expect(url.searchParams.get("text")).toBe(
      'Hola Ángel, quiero comprar el libro "Domina la estructura del mercado".',
    );
  });

  it("keeps characters that would break the query string", () => {
    const url = whatsappUrl("A & B? 100% #1");

    expect(url).not.toContain(" ");
    expect(new URL(url).searchParams.get("text")).toBe("A & B? 100% #1");
  });

  it("builds the library request with the item title", () => {
    expect(libraryRequestMessage("[Título del recurso]")).toBe(
      "Hola Ángel, quiero el recurso de la biblioteca: [Título del recurso].",
    );
  });
});
