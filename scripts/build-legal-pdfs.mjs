// Builds the legal PDFs linked from the footer (public/legal/*.pdf) from scripts/legal/*.html.
// Run in the container after editing a text: docker compose run --rm app pnpm legal
//
// Each HTML file holds only the body copy; this script wraps it in the brand layout (Lexend,
// red accents, logo) and prints it to A4 with the Chromium that ships with Playwright.
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

import { chromium } from "@playwright/test";

const SOURCE_DIR = "scripts/legal";
const OUT_DIR = "public/legal";

const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString("base64")}`;
const font = dataUri("public/fonts/lexend-latin.woff2", "font/woff2");
const logo = dataUri("src/shared/ui/brand/codigo-dinero-logo.png", "image/png");

const page = (title, body) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${title} · Código Dinero</title>
<style>
@font-face { font-family: Lexend; src: url(${font}) format("woff2"); font-weight: 100 900; }
@page { size: A4; margin: 22mm 20mm 20mm; }
body { margin: 0; font-family: Lexend, sans-serif; font-size: 10.5pt; line-height: 1.6; color: #1a1a1a; }
header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; margin-bottom: 26px; background: #111111; border-radius: 14px; }
header img { height: 40px; }
header span { color: #ff2b2b; font-size: 8pt; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
h1 { margin: 0; font-size: 24pt; line-height: 1.15; font-weight: 600; }
h2 { margin: 22px 0 6px; font-size: 12.5pt; font-weight: 600; color: #111111; break-after: avoid; }
p, li { margin: 0 0 8px; }
ul { margin: 0 0 8px; padding-left: 18px; }
li::marker { color: #ff2b2b; }
strong { font-weight: 600; }
.updated { margin: 6px 0 20px; font-size: 9pt; color: #6b6b6b; }
.lead { padding: 12px 16px; border-left: 4px solid #ff2b2b; background: #fff1f1; }
footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #dddddd; font-size: 8.5pt; color: #6b6b6b; }
</style>
</head>
<body>
<header><img src="${logo}" alt="Código Dinero"><span>Formación en trading</span></header>
${body}
<footer>Código Dinero · Rosario, Santa Fe, Argentina · WhatsApp +54 9 341 264-9713</footer>
</body>
</html>`;

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage();
for (const file of readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".html"))) {
  const body = readFileSync(join(SOURCE_DIR, file), "utf8");
  const title = /<h1>([^<]*)<\/h1>/.exec(body)?.[1] ?? basename(file, ".html");
  await tab.setContent(page(title, body), { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  const out = join(OUT_DIR, `${basename(file, ".html")}.pdf`);
  await tab.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log(`${out} ← ${join(SOURCE_DIR, file)}`);
}
await browser.close();
