# Código Dinero — landing

Landing de **Código Dinero** (academia de trading, partner oficial de EC Markets) en Next.js 16. Es una réplica pixel perfect de `reference/`: 0,000% de diferencia por sección en 1440, 1024, 768 y 390 px.

- Stack: Next.js 16.4 (App Router, Turbopack, React Compiler, Cache Components), React 19.3, TypeScript 6 estricto, Tailwind CSS 4, Zod 4, GSAP, Remotion, TanStack Query, next-safe-action.
- La home está 100% prerenderizada. Lo dinámico son islas cliente (ticker, FAQ, carrusel, menú, formulario, video) y la ruta `/api/quotes`.
- Pendientes de contenido y de integración: [`docs/PENDIENTES.md`](docs/PENDIENTES.md).

## Cómo correrlo

Todo corre en Docker. No hace falta instalar Node ni navegadores en el host. Desde la carpeta del repo (en WSL):

```bash
docker compose build app                          # imagen de desarrollo y test (una vez)
docker compose run --rm app pnpm install          # dependencias

docker compose up -d dev                          # next dev en http://localhost:3000
docker compose run --rm app pnpm build            # build de producción
```

| Comando (`docker compose run --rm app …`) | Qué hace                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build` / `pnpm start`  | Desarrollo, build y servidor de producción                                                                        |
| `pnpm lint`                               | ESLint, incluidas las reglas de arquitectura (`eslint-plugin-boundaries`)                                         |
| `pnpm format` / `pnpm format:check`       | Prettier                                                                                                          |
| `pnpm typecheck`                          | `next typegen` + `tsc --noEmit`                                                                                   |
| `pnpm test` / `pnpm test:coverage`        | Vitest: unitarios y de componentes (cobertura ≥ 90% en los archivos con lógica)                                   |
| `pnpm test:e2e`                           | Playwright contra el build de producción: smoke, SEO, formulario, menú, axe y CSP                                 |
| `pnpm test:visual`                        | Regresión visual por sección contra `reference/`. Tabla en consola y diffs en `test-results/visual/`              |
| `pnpm remotion:studio`                    | Remotion Studio en http://localhost:3002 (usar el servicio `dev`: `docker compose exec dev pnpm remotion:studio`) |
| `pnpm remotion:render`                    | Renderiza el MP4 a `public/video/promo-codigo-dinero.mp4`                                                         |

Variables de entorno (validadas con Zod en `src/shared/config/env.ts`; ver `.env.example`):

| Variable                   | Por defecto                                                                   | Uso                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | En Vercel, `https://` + dominio de producción; si no, `http://localhost:3000` | `metadataBase`, canonical, sitemap, JSON-LD y URLs de las imágenes OG     |
| `SITE_ENV`                 | En Vercel, `VERCEL_ENV`; si no, `development`                                 | Solo `production` es indexable; el resto sale con `noindex`               |
| `GOOGLE_SITE_VERIFICATION` | —                                                                             | Token de Google Search Console (`<meta name="google-site-verification">`) |
| `BING_SITE_VERIFICATION`   | —                                                                             | Token de Bing Webmaster Tools (`<meta name="msvalidate.01">`)             |

**Deploy en Vercel**: no hace falta configurar variables. Producción toma el dominio del proyecto y queda indexable; los previews salen con `noindex` y su canonical apunta a producción. Si se usa un dominio propio, conviene definir `NEXT_PUBLIC_SITE_URL` con ese dominio (Vercel toma como "producción" el dominio que marques como principal).

**Íconos y Open Graph**: el favicon (`src/app/favicon.ico`), `icon.png`, `apple-icon.png` y los íconos del manifest (`public/icons/`) salen del emblema del logo con `docker compose run --rm app pnpm icons` (`scripts/generate-icons.mjs`), que también genera la foto en PNG para la imagen OG. La imagen OG (`src/app/opengraph-image.tsx`, reutilizada por `twitter-image.tsx`) se arma en el build con los textos del hero y del partner.

Los hooks de Git (Husky) corren en el host y delegan en el contenedor: `lint-staged` en el pre-commit y `commitlint` (Conventional Commits) en el commit-msg. CI (`.github/workflows/ci.yml`) corre lint, formato, tipos, tests con cobertura, build, e2e y la regresión visual, en la misma imagen.

## Arquitectura

```
src/
  app/        # Enrutamiento y composición: page, layout, api/quotes, metadata (OG, icon, sitemap, robots, manifest)
  features/   # Una carpeta por sección
  shared/     # ui/ (primitivas), lib/, config/ (site, env, photos), seo/ (metadata, JSON-LD)
```

**La página se arma en `src/app/page.tsx`**: es la lista de secciones en orden (`<SiteHeader />`, `<Hero />`, `<About />`, …). Cada sección es una carpeta en `src/features/`:

```mermaid
flowchart LR
  page["app/page.tsx<br/>(lista de secciones)"] --> index["features/&lt;sección&gt;/index.ts"]
  index --> ui["ui/&lt;sección&gt;.tsx<br/>(lo que se ve)"]
  ui --> content["content.ts<br/>(los textos)"]
  ui --> shared["shared/<br/>(botones, íconos, colores, config)"]
```

Casi todas las secciones son solo `content.ts` (textos) + `ui/<sección>.tsx` (diseño) + `index.ts`. Dos tienen lógica, en archivos planos:

| Sección         | Archivo                  | Qué hace                                                                       |
| --------------- | ------------------------ | ------------------------------------------------------------------------------ |
| `market-ticker` | `quotes.ts`              | Qué es una cotización y cómo se muestra (`80,123.5 ▲ +0.15%`)                  |
|                 | `simulated-market.ts`    | Los precios simulados (random walk de la referencia)                           |
|                 | `ticker-bar.tsx`         | La barra; pide `/api/quotes` cada 3 s (TanStack Query)                         |
| `lead-capture`  | `lead.ts`                | Qué es un correo válido (el formulario y el servidor usan la misma regla)      |
|                 | `capture-lead.ts`        | Qué se hace con el correo: filtra bots (honeypot), límite de envíos y guardado |
|                 | `capture-lead-action.ts` | El puente formulario → servidor (Server Action con next-safe-action)           |

Reglas, verificadas por ESLint (`eslint.config.mjs`), que fallan en CI:

- Una sección usa otra solo a través de su `index.ts`. Dentro de una sección, los archivos se importan libremente.
- `shared` nunca importa de `features`. `app/` solo compone secciones.

## Cómo cambiar el proveedor de cotizaciones

Hoy los precios salen de `SimulatedMarket` (`src/features/market-ticker/simulated-market.ts`). Para usar precios reales:

1. Escribir una función que pida los precios a la API elegida y devuelva lo mismo que `getLiveQuotes()`: `{ quotes: [{ symbol, price, open, decimals }], simulated: false }`. Puede vivir en un archivo nuevo, por ejemplo `real-market.ts`, al lado. Las credenciales van como variables de servidor en `src/shared/config/env.ts`.
2. Hacer que `getLiveQuotes()` la use en lugar del mercado simulado. `/api/quotes` y la barra no cambian.
3. Con `simulated: false`, la etiqueta "Simulado" desaparece sola.
4. Si la API se llama desde el servidor (lo recomendado, a través de `/api/quotes`), no hay que tocar la CSP. Si se llamara desde el navegador, hay que sumarla a `connect-src` en `next.config.ts`.

Hay ideas de proveedores en `docs/PENDIENTES.md`.

## Cómo reemplazar las fotos de clientes

Hay tres espacios: hero, mentor (sección "¿Qué es?") y CTA final. Sin foto, se muestra la silueta con la pastilla "Foto", igual que en la referencia.

1. Exportar la foto como **PNG con fondo transparente**, recortada a la persona (proporción aproximada 300 × 340; mínimo 620 px de ancho).
2. Copiarla a `src/shared/config/photos/` (por ejemplo `hero.png`).
3. En `src/shared/config/photos.ts`, importarla y asignarla:

   ```ts
   import heroPhoto from "./photos/hero.png";

   export const photos = {
     hero: { src: heroPhoto, alt: "Nombre Apellido, mentor de Código Dinero" },
     mentor: null,
     cta: null,
   };
   ```

`next/image` genera los tamaños y reserva el espacio, así que no hay saltos de layout. Las reseñas aceptan un `avatar` opcional en `src/features/testimonials/content.ts`.

## Cómo editar los textos

Cada sección tiene su `content.ts` en `src/features/<sección>/content.ts`, validado con Zod al cargar el módulo: un texto mal formado rompe el build en lugar de la página.

| Sección                                   | Archivo                                  |
| ----------------------------------------- | ---------------------------------------- |
| Menú, logo, links, redes, partner         | `src/shared/config/site.ts`              |
| Hero                                      | `src/features/hero/content.ts`           |
| Cifras y sello de partner                 | `src/features/broker-partner/content.ts` |
| ¿Qué es?                                  | `src/features/about/content.ts`          |
| Formación, clases y links de YouTube      | `src/features/training/content.ts`       |
| Reseñas                                   | `src/features/testimonials/content.ts`   |
| Cintas de temas                           | `src/features/topics-ribbon/content.ts`  |
| FAQ (también genera el JSON-LD `FAQPage`) | `src/features/faq/content.ts`            |
| Formulario de correo                      | `src/features/lead-capture/content.ts`   |
| Footer y aviso de riesgo                  | `src/features/site-footer/content.ts`    |

Los marcadores (`[PRECIO]`, `[PLATAFORMA]`, `[Nombre del alumno]`, …) se reemplazan ahí mismo. La lista completa está en `docs/PENDIENTES.md`. Después de editar, `pnpm test:visual` muestra qué secciones cambiaron respecto de la referencia (es esperable que cambien si cambia el texto).
