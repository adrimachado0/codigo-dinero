import { env } from "@/shared/config/env";

export type NavLink = { label: string; href: string };

/**
 * Site-wide data. Links that are still "#" have no destination yet (docs/PENDIENTES.md).
 */
export const site = {
  name: "Código Dinero",
  logoText: "COD",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "es_AR",
  title: "Código Dinero · Academia de trading",
  description:
    "Academia de trading con formación, análisis de mercado y una comunidad que opera con método. Clases gratuitas en YouTube y partner oficial de EC Markets.",
  homeLabel: "COD, Código Dinero: ir al inicio",
  nav: {
    links: [
      { label: "Inicio", href: "#inicio" },
      { label: "Escuela", href: "#" },
      { label: "Calendario", href: "#" },
      { label: "Mercado", href: "#" },
      { label: "Equipo", href: "#" },
    ],
    cta: { label: "Empezar", href: "#" },
  },
  social: [
    { name: "YouTube", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "TikTok", href: "#" },
    { name: "Telegram", href: "#" },
    { name: "X", href: "#" },
  ],
  partner: {
    name: "EC Markets",
    href: "#",
    logo: { src: "/brand/ecmarkets-logo.svg", width: 65.5, height: 22.72 },
  },
} as const;

export type SocialNetwork = (typeof site.social)[number]["name"];
