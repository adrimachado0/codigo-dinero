/**
 * Every outbound destination of the site, in one place. "#" means the destination is not
 * defined yet (docs/PENDIENTES.md).
 */
export const links = {
  youtube: "https://www.youtube.com/@tradersdexau",
  /** "Cómo leer velas japonesas desde cero": the channel until the video exists. */
  youtubeTutorial: "https://www.youtube.com/@tradersdexau",
  /** Basic and intermediate course playlist. */
  youtubeCourse: "https://www.youtube.com/watch?v=tPtMM8FjbUE&list=PLcxBN_CpiwBY&index=6",
  tiktok: "https://www.tiktok.com/@gonzalezbrothers.xau",
  instagram: "https://www.instagram.com/gonzalezbrothers.xau",
  /** EC Markets training ("Formación" in the menu). */
  training: "https://www.ecmarkets.com/ec-academy/",
  economicCalendar: "https://www.ecmarkets.com/economic-calendar/",
  /** Partner/IB sign-up of EC Markets: every "Empezar" and "Quiero aprender desde cero". */
  partnerRegistration: "#",
  /** "Ver clases grabadas": the YouTube channel. */
  recordedClasses: "https://www.youtube.com/@tradersdexau",
  /** Attribution under the XAUUSD chart. */
  tradingViewGold: "https://es.tradingview.com/symbols/XAUUSD/",
} as const;

/** Attributes of every link that leaves the site. */
export const externalLinkProps = { target: "_blank", rel: "noopener noreferrer" } as const;

/** `<a>` attributes of a configured link: href, its `data-link` id and, if external, the new tab. */
export function linkAttributes(link: { href: string; external?: boolean; dataLink?: string }) {
  return {
    href: link.href,
    ...(link.dataLink && { "data-link": link.dataLink }),
    ...(link.external && externalLinkProps),
  };
}

/** International format without "+" or spaces: +54 9 341 264-9713. */
export const WHATSAPP_NUMBER = "5493412649713";

/** Pre-filled WhatsApp messages of the design, one per button, with its `data-link` id. */
export const whatsappMessages = {
  partner: {
    dataLink: "whatsapp-partner",
    text: "Hola Ángel, quiero sumarme como Partner / IB.",
  },
  book: {
    dataLink: "whatsapp-libro",
    text: 'Hola Ángel, quiero comprar el libro "Domina la estructura del mercado".',
  },
  indicator: {
    dataLink: "whatsapp-indicador",
    text: "Hola Ángel, quiero solicitar acceso al indicador Institucional Premium.",
  },
  beginner: {
    dataLink: "whatsapp-novato",
    text: "Hola Ángel, estoy empezando desde cero y quiero coordinar una sesión.",
  },
  experienced: {
    dataLink: "whatsapp-experiencia",
    text: "Hola Ángel, soy trader con experiencia y quiero coordinar una sesión.",
  },
  communityLeader: {
    dataLink: "whatsapp-ib",
    text: "Hola Ángel, lidero una comunidad y quiero coordinar una sesión como IB.",
  },
  support: {
    dataLink: "whatsapp-soporte",
    text: "Hola Ángel, no se acreditó mi pago y te envío el comprobante.",
  },
  general: {
    dataLink: "whatsapp-general",
    text: "Hola Ángel, quiero más información sobre Código Dinero.",
  },
} as const;

export type WhatsAppMessage = keyof typeof whatsappMessages;

/** Message of a library item ("Solicitar por WhatsApp"). */
export function libraryRequestMessage(title: string): string {
  return `Hola Ángel, quiero el recurso de la biblioteca: ${title}.`;
}

/** Chat with the number above and `message` ready to send. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Link (for `linkAttributes`) that opens WhatsApp with one of the design's messages. */
export function whatsappLink(message: WhatsAppMessage) {
  const { dataLink, text } = whatsappMessages[message];
  return { href: whatsappUrl(text), external: true, dataLink };
}

/** Every "Empezar" / "Quiero aprender desde cero" button. */
export const partnerRegistrationLink = {
  href: links.partnerRegistration,
  external: true,
  dataLink: "partner-ib-registro",
} as const;
