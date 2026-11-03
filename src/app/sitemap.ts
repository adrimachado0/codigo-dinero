import type { MetadataRoute } from "next";

import { site } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL("/", site.url).toString(), changeFrequency: "weekly", priority: 1 }];
}
