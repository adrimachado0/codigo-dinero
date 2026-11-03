import type { MetadataRoute } from "next";

import { site } from "@/shared/config/site";
import { isIndexable } from "@/shared/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
