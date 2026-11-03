import { ImageResponse } from "next/og";

import { heroHeadline } from "@/features/hero";
import { site } from "@/shared/config/site";
import { loadBrandFonts, StarburstMark } from "@/shared/seo/brand-image";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = await loadBrandFonts();

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#3A0C11",
        color: "#FFFFFF",
        fontFamily: "Lexend",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <StarburstMark size={84} color="#FF2B2B" />
        <span style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 64, letterSpacing: 1 }}>
          {site.logoText}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, lineHeight: 1.04, letterSpacing: -1.5 }}>{heroHeadline}</div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#EBCFD1" }}>
          {`${site.name} · Academia de trading`}
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
