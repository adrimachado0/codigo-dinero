// Generates the favicon, app icons and the OG photo from the brand assets.
// Run in the container: docker compose run --rm app pnpm icons
// Rerun it when the logo or the mentor photo change (or a higher-resolution emblem arrives).
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

// sharp ships with Next (image optimization); resolved from there instead of adding a dependency.
const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));

const LOGO = "src/shared/ui/brand/codigo-dinero-logo.png";
const MENTOR = "src/shared/config/photos/mentor.webp";
/** The round emblem is the left square of the logo (the lettering starts at x = 160). */
const EMBLEM = { left: 0, top: 0, width: 160, height: 160 };
const BACKGROUND = "#0F0F0F";

const emblem = () => sharp(LOGO).extract(EMBLEM);

/** Emblem centered on a square; `scale` is the share of the side it takes. */
async function icon(size, { scale = 1, background } = {}) {
  const inner = Math.round(size * scale);
  const mark = await emblem().resize(inner, inner).png().toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
}

/** ICO container with PNG entries (supported by every current browser). */
function ico(entries) {
  const header = Buffer.alloc(6 + entries.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = header.length;
  entries.forEach(({ size, png }, i) => {
    const at = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, at);
    header.writeUInt8(size >= 256 ? 0 : size, at + 1);
    header.writeUInt16LE(1, at + 4); // color planes
    header.writeUInt16LE(32, at + 6); // bits per pixel
    header.writeUInt32LE(png.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...entries.map((e) => e.png)]);
}

mkdirSync("public/icons", { recursive: true });
mkdirSync("src/shared/seo/images", { recursive: true });

const icoSizes = [16, 32, 48];
writeFileSync(
  "src/app/favicon.ico",
  ico(await Promise.all(icoSizes.map(async (size) => ({ size, png: await icon(size) })))),
);
// Google shows the favicon in results: a multiple of 48 px, square.
writeFileSync("src/app/icon.png", await icon(192));
// iOS fills transparency with black and rounds the corners itself: opaque with some margin.
writeFileSync("src/app/apple-icon.png", await icon(180, { scale: 0.84, background: BACKGROUND }));
writeFileSync("public/icons/icon-192.png", await icon(192, { background: BACKGROUND }));
writeFileSync("public/icons/icon-512.png", await icon(512, { background: BACKGROUND }));
// Maskable: Android crops to a circle/squircle; the safe zone is the central 80%.
writeFileSync(
  "public/icons/icon-maskable-512.png",
  await icon(512, { scale: 0.72, background: BACKGROUND }),
);
// Satori (next/og) can't read WebP: PNG copy of the mentor photo for the Open Graph image.
await sharp(MENTOR)
  .resize({ width: 420 })
  .png({ compressionLevel: 9 })
  .toFile("src/shared/seo/images/mentor.png");

console.log("Icons and OG photo generated.");
