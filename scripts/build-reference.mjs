// Builds reference/index.html, the standalone render of the design artboard used by the
// visual regression (pnpm test:visual), from reference/design-source.dc.html.
// Run in the container: docker compose run --rm app node scripts/build-reference.mjs
//
// The artboard's markup goes into a <template>, its DCLogic class into a text script, and
// reference/dc-runtime.js renders one into the other (holes, sc-for, sc-if, events, refs).
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = "reference/design-source.dc.html";
const OUT = "reference/index.html";

/** Canvas uploads → local copies in reference/. */
const ASSETS = {
  e387abf87e5883dee24f7a97a0e41013: "codigo-dinero-logo.png",
  "36ea0658d606a5d811def17a531cd130": "ecmarkets-logo.svg",
  b33ec01b6a756e12424b0de555d195be: "angel-hero.webp",
  ba77a665b537c7c1d1a6a35fabe9fed5: "angel-ec-rojo.jpg",
  c885f9a937656788e14baf70aaa1fefa: "angel-ec-stand.jpg",
  "0a839a526b1aa17d2126c64f547eb457": "angel-money-expo.jpg",
  "617aa39f99e2ab80d0b3909d1adfe6a9": "angel-holograma.jpg",
  "5d346669c2d57fdff657a3cb4f63c0c2": "angel-cierre.webp",
};

/** Notes for the design canvas only ("Vista de diseño…"): they are not part of the site. */
const DESIGN_NOTES = [
  /<span>Vista de diseño:[^<]*<\/span>/g,
  /<p style="[^"]*">Vista de diseño:[^<]*<\/p>\n?/g,
];

const source = readFileSync(SOURCE, "utf8");

function between(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  if (from < 0 || to < 0) throw new Error(`Missing ${start} … ${end} in ${SOURCE}`);
  return source.slice(from + start.length, to);
}

const helmet = between("<helmet>", "</helmet>").trim();
let markup = between("</helmet>", "</x-dc>").trim();
const logic = between("data-dc-script", "</script>")
  .replace(/^[^>]*>/, "")
  .trim();
const artboard = /<title>([^<]*)<\/title>/.exec(source)?.[1] ?? "";

for (const [id, file] of Object.entries(ASSETS)) {
  markup = markup.replaceAll(`/_blob/${id}`, `./${file}`);
}
for (const note of DESIGN_NOTES) markup = markup.replace(note, "");
const missing = /\/_blob\/([0-9a-f]{32})/.exec(markup);
if (missing) throw new Error(`Unmapped asset ${missing[1]}: add it to ASSETS`);

writeFileSync(
  OUT,
  `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Código Dinero · Referencia de diseño</title>
<!--
  REFERENCIA VISUAL (no es código de producción). Generado por scripts/build-reference.mjs.
  Render standalone del artboard "${artboard}" (design-source.dc.html), sin las notas de diseño.
  Abrir directamente en el navegador o servir con: npx serve reference
-->
${helmet}
</head>
<body>
<div id="app"></div>
<template id="dc-template">
${markup}
</template>
<script id="dc-logic" type="text/plain">
${logic}
</script>
<script src="./dc-runtime.js"></script>
</body>
</html>
`,
);
console.log(`${OUT} ← ${SOURCE} (${artboard})`);
