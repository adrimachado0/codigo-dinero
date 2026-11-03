# Proyecto: landing de Código Dinero en Next.js (pixel perfect)

Eres un ingeniero frontend senior. Vas a construir la landing de **Código Dinero** (academia de trading, partner oficial del broker EC Markets) como una aplicación Next.js de producción. Tiene que ser una réplica **pixel perfect** del diseño de referencia, con SEO técnico impecable, principios SOLID, arquitectura limpia y estructura de carpetas por feature.

Trabajarás **paso por paso**, en fases. Al final de cada fase te detienes, me muestras un resumen y **esperas mi OK** antes de seguir.

---

## 0. Reglas de trabajo (aplican a todo el proyecto)

1. **Antes de escribir código**, lee este archivo completo e inspecciona `reference/`. Después preséntame un plan breve: fases, librerías con versión y riesgos. Espera mi OK.
2. Lleva una lista de tareas visible y márcalas a medida que avanzas.
3. **Checkpoint al cerrar cada fase**:
   - qué hiciste;
   - cómo lo verificaste (comandos y resultados reales, no supuestos);
   - qué queda pendiente;
   - un commit con Conventional Commits.

   Luego **detente y espera** a que te diga "seguí".
4. Si algo de este prompt choca con la documentación oficial de la versión instalada, **manda la documentación instalada**. Next.js 16.3+ deja su documentación en `node_modules/next/dist/docs/` y la referencia desde `AGENTS.md`. Leela antes de usar cualquier API de Next. Avísame de la discrepancia.
5. Nada de código "de ejemplo" ni TODOs sin registrar. Todo lo que quede pendiente va a `docs/PENDIENTES.md`.
6. **No inventes contenido.** Copia los textos exactos de la referencia. Los marcadores como `[PRECIO]`, `[Nombre del alumno]`, `[PLATAFORMA]` o `[CONFIRMAR POLÍTICA]` se mantienen tal cual y se listan en `docs/PENDIENTES.md`. No inventes reseñas, cifras ni links.
7. Si un comando falla (por ejemplo, un flag que no existe), revisa su `--help` y corrígelo. No lo saltees en silencio.
8. Idioma: el código, los nombres y los commits van en inglés. Los textos de la UI van en español, exactamente como en la referencia.
9. **Todo corre en Docker. No instales nada en el host**: ni Node, ni pnpm, ni navegadores, ni CLIs globales. El entorno vive en `docker/Dockerfile` y `compose.yaml` (ver sección 2). Si una herramienta falta, agrégala a la imagen y no al host.

---

## 1. Material de referencia (`reference/`)

| Archivo | Para qué sirve |
|---|---|
| `reference/index.html` | **Diseño ejecutable.** Ábrelo en el navegador o sírvelo con `npx serve reference`. Es la verdad visual. |
| `reference/design-source.dc.html` | **Fuente del diseño.** Todos los valores exactos (colores, tamaños, espaciados, radios, sombras) están como estilos inline. Ver la nota de sintaxis más abajo. |
| `reference/screenshots/desktop-1440.png`, `tablet-768.png`, `mobile-390.png` | Capturas de página completa. |
| `reference/screenshots/mobile-390-menu.png` | Menú móvil abierto. |
| `reference/ecmarkets-logo.svg` | Logo oficial de EC Markets (blanco con círculo rojo; va siempre sobre fondo oscuro). |

**Sintaxis de `design-source.dc.html`.** Es un formato de plantilla:

- `{{accent}}` vale `#FF2B2B`.
- `<sc-for list="{{x}}" as="item">` es un bucle y `<sc-if value="{{x}}">` es un condicional.
- `onClick="{{fn}}"` son handlers.
- `<helmet>` contiene las fuentes, los keyframes y **todo lo responsive**: clases `cod-*` con media queries para < 1024px y < 768px, que pisan los estilos inline con `!important`. En Next replícalo con variantes responsive de Tailwind (`md:`, `lg:`), sin `!important`.
- El bloque `<script type="text/x-dc">` tiene la lógica. Ahí están:
  - el algoritmo de la **esfera de partículas** (`makeSphere`, `drawScene`, `drawChart`): pórtalo fielmente;
  - el ticker simulado (`initPrices`, `walkPrices`);
  - el estado inicial del FAQ (abierta la 1.ª pregunta) y del carrusel de reseñas (activa la 2.ª);
  - el menú móvil (`menuOpen`).

**Tokens principales** (verifícalos contra la fuente):

- Fondo `#0F0F0F`.
- Superficies `#141414`, `#161616`, `#181818`, `#1A1A1A`, `#222222`.
- Siluetas `#2A2A2A`, `#333333`.
- Tinta oscura `#111111`.
- Texto `#FFFFFF`; secundarios `#BDBDBD`, `#CFCFCF`, `#E6E6E6`; placeholder `#8A8A8A`; `#9A9A9A`.
- **Acento rojo `#FF2B2B`**; hover de links `#FF8A8A`.
- Hero vino: fondo `#3A0C11`, círculo `#4E1219` con sombra `0 0 140px rgba(255,43,43,0.22)`, texto secundario `#EBCFD1`, silueta `#1E0609`.
- Cinta crema `#F4F4F0`.
- Bordes `rgba(255,255,255, .06 / .08 / .18 / .28 / .30 / .32 / .55)`.
- Radios: 999px, 50%, 36, 32, 28, 26, 24, 22, 12. El hero usa `28px 28px 80px 80px`.
- Contenedores: 1400, 1240, 1100, 1040 y 1000px.
- Tipografías: **Lexend** 300–700 (texto) y **Unbounded** 600/800 (logo "COD", números "01–06", la banda "Aprende ✦ Analiza ✦ Opera" y la cinta roja).
- Tamaños fluidos con `clamp()`, como en la fuente.
- Animaciones de la referencia:
  - marquee del ticker: 44s;
  - cintas: 40s y 60s en sentido inverso;
  - giro del logo: 24s;
  - giro del adorno del hero: 30s;
  - texto circular: 20s;
  - pulso del punto "Mercados": 1.6s.

### Objetivo pixel perfect

**Pixel perfect obligatorio en los cuatro anchos: 1440, 1024, 768 y 390.** La referencia ya resuelve móvil y tablet, así que replícala tal cual. Esto es lo que cambia en cada breakpoint:

- **< 1024px:**
  - el hero pasa a columna: título → texto centrado → foto con CTAs → bloque partner centrado;
  - la banda de cifras pasa a una grilla de 2×2.
- **< 768px:**
  - el header muestra logo + "Empezar" + botón hamburguesa. El botón lleva `aria-expanded` y `aria-controls` y abre un panel con los links (ver `mobile-390-menu.png`); el panel se cierra con Esc y al hacer clic en un link;
  - el adorno del hero se centra sobre el título y se oculta el trazo "<";
  - la banda "Aprende ✦ Analiza ✦ Opera" se apila en columna;
  - se oculta la pestaña vertical "Qué enseñamos";
  - el carrusel de reseñas muestra solo la reseña activa.
- En ningún ancho puede haber scroll horizontal.

---

## 2. Stack (última versión estable de cada uno; fija las versiones exactas en `package.json`)

- **Entorno: Docker.** Una imagen de desarrollo y test (`docker/Dockerfile`) basada en `mcr.microsoft.com/playwright:v<versión de @playwright/test>-noble`. Trae Node LTS, Chromium y las dependencias de sistema, y le suma pnpm y `agent-browser`. El repo se monta como bind mount con el mismo uid que el host. `compose.yaml` define estos servicios:
  - `app`, para comandos puntuales: `docker compose run --rm app pnpm <script>`;
  - `dev`, para `next dev` en el puerto 3000, más el 3001 para `reference/` y el 3002 para Remotion Studio.

  La regresión visual, Lighthouse y el render de Remotion corren en esta misma imagen, lo que deja tipografías y navegador deterministas. CI usa la misma imagen.

- **Next.js 16.4.x** (App Router, Turbopack) con la versión de React que traiga (19.2 o posterior). Activa `reactCompiler: true` y `cacheComponents: true`. La home tiene que quedar 100% prerenderizada; las partes dinámicas van como islas cliente o detrás de `Suspense`.
- **TypeScript** en modo estricto (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`). Next 16.3+ soporta TypeScript 7 para el type-check. Úsalo si ESLint, typescript-eslint y Vitest son compatibles; si no, usa la última 5.x/6.x y documenta la decisión.
- **pnpm** como gestor de paquetes.
- **Tailwind CSS v4**, con tokens en `@theme`, más `clsx`, `tailwind-merge` (un helper `cn`) y `class-variance-authority` para las variantes.
- **Zod v4** para:
  - el contenido tipado;
  - las variables de entorno (`@t3-oss/env-nextjs`);
  - los formularios;
  - las respuestas de API.
- **GSAP** y **@gsap/react** (`useGSAP`), con ScrollTrigger donde aporte. Todos los plugins de GSAP son gratuitos.
- **Remotion** y **@remotion/player** para el video de presentación.
- **next-safe-action** para los Server Actions validados con Zod.
- **TanStack Query v5** para el polling de cotizaciones.
- **schema-dts** para el JSON-LD tipado.
- `next/font/google` para Lexend y Unbounded, `next/image` y `next/og`.
- Calidad:
  - ESLint (flat config: `eslint-config-next` + typescript-eslint strict + `eslint-plugin-boundaries`);
  - Prettier con `prettier-plugin-tailwindcss`;
  - Husky, lint-staged y commitlint.
- Tests:
  - **Vitest** y Testing Library (unitarios y de componentes);
  - **Playwright** (e2e y regresión visual) con `@axe-core/playwright` (accesibilidad) y `pixelmatch`;
  - opcional: Lighthouse CI.
- shadcn/ui o Radix **solo** si una primitiva accesible lo justifica (accordion o carrusel). Si se puede resolver bien con HTML semántico, no lo agregues.

---

## 3. Arquitectura

### Estructura por feature

```
src/
  app/                        # Solo enrutamiento y composición (capa delgada)
    layout.tsx  page.tsx  globals.css
    opengraph-image.tsx  icon.tsx  manifest.ts  sitemap.ts  robots.ts
    api/quotes/route.ts       # Adaptador HTTP → caso de uso
  features/
    site-header/  market-ticker/  hero/  broker-partner/  about/
    promo-video/  training/  motto-band/  topics-ribbon/
    testimonials/  faq/  lead-capture/  site-footer/
  shared/
    ui/                       # Primitivas: Container, Button/Pill (cva), SectionTitle (palabra resaltada),
                              # Marquee, Sparkle, Starburst, PersonPhoto, íconos SVG
    lib/                      # cn, utils
    config/                   # site.ts (nombre, URL, redes, partner), env.ts
    seo/                      # builders de metadata y JSON-LD
docs/  e2e/  reference/
```

### Estructura interna de una feature (solo las capas que la feature necesite)

```
features/market-ticker/
  domain/          # Entidades, value objects, esquemas Zod, puertos (interfaces). TS puro, sin React ni Next.
  application/     # Casos de uso. Dependen SOLO de domain.
  infrastructure/  # Adaptadores que implementan puertos (simulado, API real, repositorios).
  ui/              # Componentes y hooks de React.
  composition.ts   # Raíz de composición: elige el adaptador según env.
  content.ts       # Copy tipado y validado con Zod (si aplica).
  index.ts         # API pública de la feature. Prohibidos los imports profundos entre features.
```

### Reglas de dependencia (hazlas cumplir con `eslint-plugin-boundaries` y que fallen en CI)

- `ui → application → domain`; `infrastructure → domain`. `domain` no importa nada externo salvo Zod.
- Una feature solo importa de otra a través de su `index.ts`. Cualquier feature puede importar de `shared`, pero `shared` nunca importa de `features`.
- `app/` solo compone features y llama a casos de uso.

### SOLID aplicado (sin sobreingeniería)

Las secciones puramente visuales (about, motto-band, footer) solo necesitan `ui/` y `content.ts`. Las capas se justifican donde hay lógica.

- **SRP:** un componente o módulo por responsabilidad. Las secciones se componen con primitivas de `shared/ui`.
- **OCP + DIP — market-ticker:**
  - el puerto `QuoteSource` define `getQuotes(symbols): Promise<Quote[]>` y expone `isSimulated`;
  - `SimulatedQuoteSource` reproduce el random walk de la referencia, con estas semillas: XAUUSD 4025.40, XAGUSD 53.08, BTCUSD 80036.6, ETHUSD 2320.82, EURUSD 1.1642, GBPUSD 1.3318, USDARS 1465.50, con los mismos decimales;
  - el adaptador se elige con `QUOTES_PROVIDER` en `composition.ts`;
  - `app/api/quotes/route.ts` valida la salida con Zod;
  - en la UI, TanStack Query hace polling cada 2–5 s;
  - mientras la fuente sea simulada, la etiqueta "Simulado" tiene que seguir visible;
  - deja documentado en `PENDIENTES.md` cómo enchufar un proveedor real (por ejemplo Twelve Data o Finnhub para FX y metales, CoinGecko para cripto, una API de dólar para USDARS). No lo implementes.
- **ISP + DIP — lead-capture:**
  - el formulario "Tu correo" usa un esquema Zod compartido entre cliente y servidor;
  - un Server Action con next-safe-action llama al caso de uso `captureLead`;
  - el caso de uso depende del puerto `LeadRepository`; por ahora el adaptador es `ConsoleLeadRepository`;
  - agrega un honeypot anti-spam, estados de carga, éxito y error accesibles (`aria-live`), y un lugar preparado para rate limiting.
- **LSP:** escribe un contract test por puerto que corra contra cada adaptador.
- **Contenido:** todos los textos salen de `content.ts` validados con Zod al cargar el módulo. Las FAQ son la única fuente de verdad tanto para la UI como para el JSON-LD `FAQPage`.
- **Fotos de clientes:** `PersonPhoto` recibe `src?: StaticImageData`.
  - Sin `src`, muestra la silueta y la pastilla "Foto" idénticas a la referencia.
  - Con `src`, muestra un `next/image` (PNG con fondo transparente).
  - Las fotos se configuran en un solo lugar (`shared/config/photos.ts`). Hay tres espacios: hero, mentor (sección "Qué es") y CTA final.
  - Las reseñas también aceptan un avatar opcional.

---

## 4. Skills para Claude Code (instálalas a nivel proyecto en la Fase 0)

Usa la CLI `skills` **dentro del contenedor** con su flag no interactivo (`-y`/`--yes`; confírmalo con `npx skills add --help`), `--agent claude-code` y `--copy`. `--copy` hace falta porque Claude Code puede leer el repo desde Windows (`\\wsl.localhost`), donde los symlinks de Linux no se resuelven. Los comandos quedan en `docker/install-skills.sh`, que se corre con `docker compose run --rm app bash docker/install-skills.sh`:

```bash
# Buenas prácticas de React/Next (Vercel) y guías de UI/accesibilidad
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --agent claude-code
npx skills add vercel-labs/agent-skills --skill web-design-guidelines --agent claude-code

# Next.js: loop de desarrollo con verificación en navegador (requiere agent-browser >= 0.31.1,
# que viene en la imagen Docker; no se instala en el host)
npx skills add vercel/next.js --skill next-dev-loop --agent claude-code

# Animaciones: skills oficiales de GSAP (core, timeline, scrolltrigger, plugins, utils, react, performance, frameworks)
npx skills add https://github.com/greensock/gsap-skills --agent claude-code

# Video: skills oficiales de Remotion
npx skills add remotion-dev/skills --agent claude-code

# SEO y Core Web Vitals
npx skills add addyosmani/web-quality-skills --skill seo --agent claude-code
npx skills add addyosmani/web-quality-skills --skill core-web-vitals --agent claude-code
npx skills add coreyhaines31/marketingskills --skill seo-audit --agent claude-code
```

Notas:

- **No** instales `vercel-labs/next-skills` (`next-best-practices`): Vercel lo retiró. La documentación de Next llega por el `AGENTS.md` que mantiene `next dev`.
- Asegúrate de que `CLAUDE.md` importe `AGENTS.md` (con una línea `@AGENTS.md`). Agrega a `CLAUDE.md` las convenciones de este proyecto: arquitectura, reglas de dependencia, comandos y checklist de PR.
- Usa estas skills activamente: `next-dev-loop` para verificar en el navegador después de cada cambio, las de GSAP y Remotion al animar y `seo-audit` en la fase de SEO.
- `agent-browser` mantiene un daemon persistente. Úsalo con `docker compose exec dev agent-browser ...` contra el servicio `dev` levantado, no con `run --rm`.

---

## 5. SEO y rendimiento (criterios de aceptación)

- **Metadata** con la Metadata API en `layout.tsx`:
  - `metadataBase` desde `NEXT_PUBLIC_SITE_URL` (validado con Zod);
  - título por defecto "Código Dinero · Academia de trading" y plantilla `%s · Código Dinero`;
  - descripción de unos 150–160 caracteres;
  - `alternates.canonical`;
  - Open Graph (`type: website`, `locale: es_AR`, `siteName`);
  - Twitter `summary_large_image`;
  - `robots` con `noindex` fuera de producción;
  - `export const viewport` con `themeColor: #0F0F0F`.
- `<html lang="es">`.
- `opengraph-image.tsx` con `next/og` (1200×630): fondo vino, starburst rojo, "COD" en Unbounded y el titular. También `icon.tsx` (el starburst), `manifest.ts`, `sitemap.ts` y `robots.ts`.
- **JSON-LD** tipado con schema-dts y escapando `<`:
  - `EducationalOrganization` (nombre, url, logo, `sameAs` con las redes);
  - `WebSite`;
  - `FAQPage`, generado desde el mismo contenido de las FAQ;
  - `VideoObject` cuando haya URLs reales de YouTube (por ahora queda en pendientes).
  - Ojo: Google limita los rich results de FAQ. Inclúyelo igual como datos estructurados válidos, pero no prometas el resultado enriquecido.
- **HTML semántico:**
  - un solo `h1` y jerarquía de encabezados correcta;
  - landmarks `header`/`nav`/`main`/`footer`;
  - los anchors de sección (`#inicio`, `#que-es`, `#formacion`, `#comunidad`, `#faq`);
  - textos de link descriptivos, `alt` en todas las imágenes y `aria-label` en los botones que solo tienen ícono.
- **Rendimiento:**
  - el LCP es el `h1` del hero: no lo ocultes con animaciones de entrada;
  - Canvas, GSAP y el Player de Remotion se cargan del lado del cliente y de forma diferida (`next/dynamic` con `ssr: false` para el Player);
  - las animaciones se pausan fuera de pantalla (IntersectionObserver);
  - el canvas usa un DPR máximo de 2;
  - las fuentes usan `next/font` con subset latin y solo los pesos que se usan;
  - CLS 0: reserva las dimensiones de todo lo que cargue después.
- **Accesibilidad:** WCAG 2.2 AA, `prefers-reduced-motion` en todas las animaciones, foco visible, targets ≥ 44px y 0 violaciones serias o críticas de axe.
- **Objetivos:**
  - Lighthouse móvil: SEO, Accesibilidad y Buenas prácticas en 100; Rendimiento ≥ 95;
  - Core Web Vitals en laboratorio: LCP < 2.0 s, CLS < 0.05, TBT bajo.
- **Cabeceras de seguridad** en `next.config.ts`: CSP razonable, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y `frame-ancestors`.

---

## 6. Fases (detente al final de cada una)

**Fase 0: Preparación**
- Lee este prompt y `reference/`, y preséntame el plan.
- `git init`.
- Crea el entorno Docker (`docker/Dockerfile`, `compose.yaml`) y verifica que la imagen construye.
- Instala las skills de la sección 4 desde el contenedor y crea `CLAUDE.md`.
- Al terminar, **pídeme que reinicie Claude Code** para que se carguen las skills.

**Fase 1: Scaffold y tooling**
- `create-next-app` (última versión), corrido en el contenedor, con TypeScript, Tailwind, ESLint, App Router, `src/`, el alias `@/*`, pnpm y React Compiler. Usa flags no interactivos (revisa `--help`).
- Husky corre en el host, que no tiene Node. Sus hooks delegan en el contenedor (`docker compose run --rm -T app pnpm exec lint-staged`, y lo mismo para commitlint).
- Como la carpeta no está vacía (`PROMPT.md`, `LEEME.md`, `reference/`), crea el proyecto en una carpeta temporal con `--disable-git` (el repo ya existe) y mueve su contenido a la raíz, conservando esos archivos.
- Configura:
  - `next.config.ts`;
  - TypeScript estricto;
  - ESLint con boundaries, Prettier, Husky, lint-staged y commitlint;
  - Vitest y Playwright;
  - `env.ts` con Zod;
  - el esqueleto de carpetas de la sección 3.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `test:visual`, `remotion:studio`, `remotion:render`.
- Al cerrar, `lint`, `typecheck` y `build` tienen que pasar en verde.

**Fase 2: Sistema de diseño**
- Pasa los tokens de la referencia a `@theme` de Tailwind.
- Configura Lexend y Unbounded con `next/font`.
- Crea las primitivas de `shared/ui` con sus tests: Container, Button/Pill, SectionTitle con la palabra resaltada rotada −2°, Sparkle, Starburst, PersonPhoto, Marquee y los íconos.

**Fase 3: Arnés de regresión visual (antes de maquetar)**
- Playwright levanta un `webServer` para la app y sirve `reference/` como estático.
- `e2e/visual.spec.ts` captura **cada sección** por su id/landmark en la referencia y en la app, en 1440, 1024, 768 y 390, más el menú móvil abierto en 390. Corre con `reducedMotion: 'reduce'` y `animations: 'disabled'`, y enmascara lo no determinista: canvas, ticker, marquees y adornos que giran.
- Compara con `pixelmatch` y guarda los diffs en `test-results/visual/`.
- Imprime una tabla con el % de píxeles distintos por sección.
- **Umbral:** ≤ 0.5% por sección en los cuatro anchos.

**Fase 4: Maquetación pixel perfect, sección por sección**
- Va en el orden de la página: header + ticker (UI) → hero → banda de cifras → qué es → motto → formación → comunidad → cinta diagonal → FAQ → CTA + footer.
- Después de cada sección:
  - corre el diff visual de esa sección y verifícala con `next-dev-loop`;
  - itera hasta cumplir el umbral;
  - haz un commit.
- Detente después del hero para que yo revise; después sigue hasta el final.
- Los estados iniciales tienen que coincidir con la referencia: FAQ con la 1.ª abierta y reseñas con la 2.ª activa.

**Fase 5: Lógica y arquitectura**
- `market-ticker` completo (puerto, adaptador simulado, ruta, Query).
- `lead-capture` completo (Zod, Server Action, repositorio).
- FAQ como acordeón accesible.
- Carrusel de reseñas accesible (botones con `aria-label` y estado anunciado).
- Menú móvil, igual que en la referencia (accesible, se cierra con Esc y al hacer clic en un link, y devuelve el foco al botón).
- Contenido validado con Zod.
- Contract tests y tests de casos de uso.

**Fase 6: Animaciones (GSAP + canvas)**
- Replica exactamente las animaciones de la referencia con GSAP y `useGSAP`: marquees y cintas en loop sin costura, giros y pulso.
- Porta `ParticleSphere` (hero y tarjeta de video) desde el algoritmo de la fuente, como componente cliente con `requestAnimationFrame`.
- Puedes sumar entradas sutiles con ScrollTrigger solo si **el estado final es idéntico a la referencia**, nunca sobre el `h1`, y se desactivan con reduced motion y en los tests visuales.
- Limpia todas las animaciones al desmontar (contexto de `useGSAP`).

**Fase 7: Video con Remotion**
- Crea la composición `PromoCodigoDinero` (1920×1080, 30 fps, 12–15 s) dentro de `features/promo-video/remotion/`. Contenido: esfera de partículas + línea de precio con brillo rojo + "Academia de trading · Código Dinero" + logo de EC Markets.
- Incrústala con `@remotion/player`:
  - en la tarjeta "Video · Remotion" de la sección "Qué es";
  - con carga diferida y un póster estático para no afectar LCP ni CLS;
  - el botón de play rojo inicia el Player.
- Agrega scripts para Studio y para renderizar un MP4 en `public/video/`.

**Fase 8: SEO, rendimiento y accesibilidad**
- Implementa todo lo de la sección 5.
- Corre la skill `seo-audit`, Lighthouse (móvil y desktop) y axe, y corrige lo que encuentren.
- Entrega una tabla con las métricas antes y después.

**Fase 9: Calidad y entrega**
- Cobertura ≥ 90% en `domain/` y `application/`.
- e2e de humo.
- GitHub Actions con lint, typecheck, test, build, e2e y visual, corriendo en la misma imagen Docker.
- `README.md`:
  - cómo correr el proyecto;
  - un diagrama de la arquitectura;
  - cómo cambiar el proveedor de cotizaciones;
  - **cómo reemplazar las fotos de clientes**;
  - cómo editar los textos.
- `docs/PENDIENTES.md` completo.
- Informe final con el diff visual por sección y los puntajes de Lighthouse.

---

## 7. Definición de terminado

- [ ] Diff visual ≤ 0.5% por sección en 1440, 1024, 768 y 390 (incluido el menú móvil abierto), y sin scroll horizontal en ningún ancho.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` y `pnpm test:e2e` en verde, sin warnings ignorados.
- [ ] Reglas de arquitectura aplicadas por ESLint.
- [ ] Lighthouse móvil: 100/100/100 y ≥ 95 en Rendimiento.
- [ ] 0 violaciones serias o críticas de axe.
- [ ] JSON-LD válido (probado con el Rich Results Test o el validador de schema.org; deja el resultado en el informe).
- [ ] "Simulado" visible mientras las cotizaciones no sean reales; ningún dato inventado.
- [ ] `docs/PENDIENTES.md` lista: precio, plataforma, soporte, política de cancelación, reseñas reales, links de YouTube y redes, link de partner de EC Markets, fotos de clientes, proveedor real de cotizaciones, destino de los leads, dominio y textos legales.

Empieza por la **Fase 0**.
