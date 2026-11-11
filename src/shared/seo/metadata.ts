import type { Metadata, Viewport } from "next";

import { env } from "@/shared/config/env";
import { site } from "@/shared/config/site";

export const isIndexable = env.SITE_ENV === "production";

/** Search terms the page is about (Bing still reads `keywords`; Google ignores it). */
const keywords = [
  "formación en trading",
  "curso de trading",
  "aprender trading",
  "trading desde cero",
  "análisis técnico",
  "análisis de mercado",
  "plan de trading",
  "gestión del riesgo",
  "cuentas demo",
  "indicador de trading",
  "Smart Money Concepts",
  "XAUUSD",
  "libro de trading",
  "forex",
  "clases de trading gratis",
  "partner EC Markets",
  "introducing broker",
  "EC Markets",
  "Código Dinero",
];

const verification: NonNullable<Metadata["verification"]> = {
  ...(env.GOOGLE_SITE_VERIFICATION && { google: env.GOOGLE_SITE_VERIFICATION }),
  ...(env.BING_SITE_VERIFICATION && {
    other: { "msvalidate.01": env.BING_SITE_VERIFICATION },
  }),
};

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: site.title, template: `%s · ${site.name}` },
    description: site.description,
    applicationName: site.name,
    keywords,
    authors: [{ name: site.name, url: site.homeUrl }],
    creator: site.name,
    publisher: site.name,
    category: "education",
    alternates: { canonical: "/" },
    // og:image and twitter:image come from app/opengraph-image.tsx and app/twitter-image.tsx.
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: "/",
      title: site.title,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
    },
    robots: isIndexable
      ? {
          index: true,
          follow: true,
          // Large image previews and full snippets in Google results and Discover.
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    ...(Object.keys(verification).length > 0 && { verification }),
    appleWebApp: { title: site.name, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const rootViewport: Viewport = {
  themeColor: "#0F0F0F",
  colorScheme: "dark",
};
