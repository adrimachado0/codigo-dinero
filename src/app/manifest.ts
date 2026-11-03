import type { MetadataRoute } from "next";

import { site } from "@/shared/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#0F0F0F",
    theme_color: "#0F0F0F",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
