import type { Metadata, Viewport } from "next";

import { env } from "@/shared/config/env";
import { site } from "@/shared/config/site";

export const isIndexable = env.SITE_ENV === "production";

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: site.title, template: `%s · ${site.name}` },
    description: site.description,
    applicationName: site.name,
    alternates: { canonical: "/" },
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
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    formatDetection: { telephone: false },
  };
}

export const rootViewport: Viewport = {
  themeColor: "#0F0F0F",
  colorScheme: "dark",
};
