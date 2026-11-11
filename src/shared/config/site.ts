import { env } from "@/shared/config/env";
import { links, partnerRegistrationLink, whatsappLink } from "@/shared/config/links";

export type NavLink = {
  label: string;
  href: string;
  /** Opens in a new tab and shows the ↗ arrow. */
  external?: boolean;
  /** `data-link` id of the destination (analytics hook of the design). */
  dataLink?: string;
};

/**
 * Site-wide data. Destinations live in ./links.ts; "#" ones are not defined yet
 * (docs/PENDIENTES.md).
 */
export const site = {
  name: "Código Dinero",
  logoText: "COD",
  url: env.NEXT_PUBLIC_SITE_URL,
  /** Home URL exactly as Next renders the canonical (origin, no trailing slash). */
  homeUrl: new URL(env.NEXT_PUBLIC_SITE_URL).origin,
  locale: "es_AR",
  title: "Código Dinero · Academia de trading",
  description:
    "De cero a tu propio plan de trading: formación, análisis y una comunidad que opera con método. Para quien empieza, traders con experiencia e IBs de EC Markets.",
  homeLabel: "Código Dinero, ir al inicio",
  nav: {
    links: [
      { label: "Inicio", href: "#inicio" },
      {
        label: "Formación",
        href: links.training,
        external: true,
        dataLink: "ec-markets-formacion",
      },
      {
        label: "Calendario",
        href: links.economicCalendar,
        external: true,
        dataLink: "ec-markets-calendario",
      },
      { label: "Mercado", href: "#mercado" },
      { label: "Equipo", href: "#" },
    ] satisfies NavLink[],
    cta: { label: "Empezar", ...partnerRegistrationLink } satisfies NavLink,
  },
  /** Footer icons, in order. `profile`: an account page, listed as `sameAs` in the JSON-LD. */
  social: [
    { name: "YouTube", href: links.youtube, dataLink: "youtube-canal", profile: true },
    { name: "Instagram", href: links.instagram, dataLink: "instagram", profile: true },
    { name: "TikTok", href: links.tiktok, dataLink: "tiktok", profile: true },
    { name: "Telegram", href: "#", profile: true },
    { name: "X", href: "#", profile: true },
    { name: "WhatsApp", ...whatsappLink("general"), profile: false },
  ],
  partner: {
    name: "EC Markets",
    href: "#",
    logo: { src: "/brand/ecmarkets-logo.svg", width: 65.5, height: 22.72 },
  },
} as const;

export type SocialNetwork = (typeof site.social)[number]["name"];
