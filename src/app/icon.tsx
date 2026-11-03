import { ImageResponse } from "next/og";

import { StarburstMark } from "@/shared/seo/brand-image";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Favicon / app icon: the red starburst on the page background. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F0F0F",
        borderRadius: 112,
      }}
    >
      <StarburstMark size={400} color="#FF2B2B" />
    </div>,
    size,
  );
}
