import type { MetadataRoute } from "next";

import { site } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.homeUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
