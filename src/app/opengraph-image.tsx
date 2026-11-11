import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { partnerContent } from "@/features/broker-partner";
import { heroTitle } from "@/features/hero";
import { site } from "@/shared/config/site";
import { dataUri, loadBrandFonts, qrBackground } from "@/shared/seo/brand-image";

export const alt = `${site.name}, formación en trading con ${site.founder.name}: «${heroTitle.lead} ${heroTitle.highlight}». ${partnerContent.badge} de ${site.partner.name}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read once at build time (the image is prerendered).
const cwd = process.cwd();
const [fonts, logo, mentor, partnerLogo] = await Promise.all([
  loadBrandFonts(),
  dataUri(readFile(join(cwd, "src/shared/ui/brand/codigo-dinero-logo.png")), "image/png"),
  dataUri(readFile(join(cwd, "src/shared/seo/images/mentor.png")), "image/png"),
  dataUri(readFile(join(cwd, "public/brand/ecmarkets-logo.svg")), "image/svg+xml"),
]);
const qr = qrBackground(size);

/** Cut-out of Ángel (420 × 464) over the wine circle, as in the hero. */
const PHOTO = { width: 400, height: 442 };
const CIRCLE = 500;
const CENTER_X = 880;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#3A0C11",
        color: "#FFFFFF",
        fontFamily: "Lexend",
      }}
    >
      <img
        src={qr}
        width={size.width}
        height={size.height}
        alt=""
        style={{ position: "absolute" }}
      />
      <div
        style={{
          position: "absolute",
          left: CENTER_X - CIRCLE / 2,
          bottom: -110,
          width: CIRCLE,
          height: CIRCLE,
          borderRadius: CIRCLE,
          background: "#4E1219",
          boxShadow: "0 0 140px rgba(255,43,43,0.22)",
        }}
      />
      <img
        src={mentor}
        {...PHOTO}
        alt=""
        style={{ position: "absolute", left: CENTER_X - PHOTO.width / 2, bottom: 0 }}
      />

      <div
        style={{
          position: "absolute",
          left: 72,
          top: 64,
          bottom: 64,
          width: 620,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <img src={logo} width={229} height={80} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 52, lineHeight: 1.06, letterSpacing: -1 }}>{heroTitle.lead}</div>
          <div style={{ fontSize: 52, lineHeight: 1.06, letterSpacing: -1, color: "#FF2B2B" }}>
            {heroTitle.highlight}
          </div>
          <div style={{ marginTop: 22, fontSize: 28, color: "#EBCFD1" }}>Formación en trading</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              borderRadius: 999,
              background: "#FF2B2B",
              color: "#111111",
              fontSize: 18,
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            {partnerContent.badge}
          </div>
          <img
            src={partnerLogo}
            height={40}
            width={Math.round((40 * site.partner.logo.width) / site.partner.logo.height)}
            alt=""
          />
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
