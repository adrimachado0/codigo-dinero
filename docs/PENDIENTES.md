# Pendientes

Todo lo que falta definir o implementar. Los marcadores se mantienen tal cual en la UI hasta tener el dato real; no se inventa contenido. Lo resuelto queda marcado con `[x]` junto con cómo se resolvió; lo que sigue sin marcar espera una respuesta del cliente.

## Links (todos en `src/shared/config/links.ts`)

- [x] **Número de WhatsApp**: `WHATSAPP_NUMBER = "5493412649713"` (+54 9 341 264-9713). Todos los botones lo toman de ahí.
- [ ] **Registro Partner/IB de EC Markets**: `links.partnerRegistration` (hoy `#`). Lo usan los 5 botones con `data-link="partner-ib-registro"`: "Empezar" (header y footer) y "Quiero aprender desde cero" (hero, "Traders novatos" y "Quién soy").
- [x] **"Ver clases grabadas"** (Recursos): abre el canal de YouTube (`links.recordedClasses`).
- [x] **"Indicadores exclusivos"** (Recursos, 04): abre WhatsApp con el mismo mensaje que el botón de la sección del indicador (`data-link="whatsapp-indicador"`).
- [x] **Lista de reproducción del Curso Básico e Intermedio**: `links.youtubeCourse` apunta a la lista "Curso intermedio Traders de Xau".
- [ ] **Video del tutorial** "Cómo leer velas japonesas desde cero": `links.youtubeTutorial` (hoy el canal). Con la URL del video se puede sumar el JSON-LD `VideoObject` en `src/shared/seo/json-ld.tsx`.
- [x] **Redes sin URL**: el cliente no tiene Telegram ni X; se quitaron del footer. Quedan YouTube, Instagram, TikTok y WhatsApp.
- [x] **Menú**: "Equipo" pasó a "Nosotros" y lleva a "¿Quién soy?" (`#quien-soy`), en el header, el menú móvil y el footer.
- [x] **Logo de EC Markets**: el logo ya está; el diseño no lo enlaza, así que se quitó el link vacío (`site.partner.href`) que quedaba en la configuración.
- [ ] **Dominio de producción**: en Vercel se toma solo (`VERCEL_ENV` y el dominio de producción del proyecto). Con un dominio propio, definir `NEXT_PUBLIC_SITE_URL` con ese dominio. Fuera de Vercel hay que definir `NEXT_PUBLIC_SITE_URL` y `SITE_ENV=production`: sin `production` el sitio sale con `noindex` y `robots.txt` bloquea todo.
- [x] **Search Console y Bing Webmaster Tools**: descartado por el dueño. Se quitaron las variables `GOOGLE_SITE_VERIFICATION` y `BING_SITE_VERIFICATION`.

## Contenido (marcadores del diseño)

- [ ] **Portadas reales de la biblioteca**: las 6 tarjetas son portadas de ejemplo con `[Título del recurso]` y la nota "Portadas de ejemplo: se reemplazan por las reales." (`src/features/library/content.ts`). El mensaje de WhatsApp de cada una toma su título.
- [ ] **Precio**: `[PRECIO] [por mes / pago único]` (FAQ 01). Archivo: `src/features/faq/content.ts`.
- [ ] **Plataforma** de la formación: `[PLATAFORMA]` (FAQ 03).
- [x] **Soporte, plazo de acreditación y cancelación** (antes FAQ 04 y 05): se quitaron las preguntas "¿Qué pasa si no se acredita mi pago?" y "¿Puedo cancelar cuando quiera?" (decisión del dueño). La FAQ queda con 4 preguntas.
- [x] **Textos legales**: Términos y condiciones, Política de privacidad y Aviso de riesgo se descargan en PDF desde el footer (`public/legal/`). Son textos genéricos armados con lo que dice el sitio (formación, partner de EC MARKETS, contacto por WhatsApp, sin formularios ni cookies propias, Ley 24.240 y Ley 25.326, tribunales de Rosario). Se editan en `scripts/legal/*.html` y se regeneran con `pnpm legal`. Conviene que los revise un abogado antes de publicar el sitio.

## Assets

- [x] **QR del fondo del hero**: queda el QR genérico del diseño (decisión del dueño). Si algún día hay uno real, se cambia solo `src/shared/ui/qr-glyph.ts`.
- [x] **Foto del cierre**: queda la actual (`angel-cierre.webp`, 289 px de ancho), por decisión del dueño.
- [x] **Emblema del logo**: queda el actual (160 px); los íconos se ven bien.

## Técnico

- [x] **Movimiento y accesibilidad**: se mantienen las animaciones como están (decisión del dueño): las decorativas ignoran "reducir movimiento" y la entrada de las velas sí lo respeta.
- [x] **TradingView**: el gráfico de XAUUSD y la sección de mercado siguen con los widgets oficiales (llevan el logo y la atribución de TradingView, como pide su licencia gratuita). La cinta del header volvió a los estilos del diseño, con precios reales de una API pública (ver decisiones).
- [x] **HSTS y `upgrade-insecure-requests`**: le dicen al navegador que use siempre HTTPS (y que no vuelva a pedir el sitio por HTTP). Se envían solo en producción (`SITE_ENV=production`), porque los tests corren en HTTP.
- [x] **Rich Results Test de Google**: es una herramienta de Google para revisar que los datos estructurados (JSON-LD) se lean bien. No hace falta hacer nada: el JSON-LD ya se valida en los tests unitarios y e2e. Se puede correr opcionalmente cuando el sitio esté publicado (search.google.com/test/rich-results).
- [x] **TypeScript 7 y ESLint 10**: no hace falta actualizar. Las versiones actuales están soportadas y no traen nada que el sitio necesite; se puede actualizar más adelante cuando el resto de las herramientas lo soporte.

## Decisiones técnicas registradas

- **Entorno 100% Docker**: no se instala nada en el host. Imagen `mcr.microsoft.com/playwright:v1.64.1-noble` (Node 26.13 LTS) más pnpm 12.16.1 y agent-browser 0.41.1. Al actualizar `@playwright/test`, hay que actualizar también el tag de la imagen base. CI usa la misma imagen.
- **TypeScript 6.0.x en lugar de 7**: `typescript-eslint@8.72.1` declara `typescript >=4.8.4 <6.1.0`.
- **ESLint 9.39.x en lugar de 10**: la documentación de Next 16.4 dice que `eslint-config-next` soporta ESLint 10, pero `eslint-plugin-react`, `eslint-plugin-import` y `eslint-plugin-jsx-a11y` (que trae) todavía declaran `eslint ≤ 9`.
- **Volúmenes de caché del contenedor**: `docker/Dockerfile` crea `/home/ubuntu/.pnpm-store` y `/home/ubuntu/.cache` como `ubuntu`; si no, Docker los crea como root y pnpm no puede escribir. Si un volumen viejo quedó como root: `docker compose down -v`.
- **Solo front**: sin backend propio, CMS ni formularios. Compras y solicitudes abren WhatsApp con el mensaje armado; los registros van al link Partner/IB. Se quitaron el formulario de contacto (server action, `next-safe-action`), el mercado simulado, TanStack Query y el video de Remotion. La única ruta de servidor es `/api/quotes`, que solo reenvía cotizaciones públicas.
- **Cotizaciones del header** (`src/features/market-ticker/`): `/api/quotes` lee el endpoint público de gráficos de Yahoo Finance (sin clave) del lado del servidor y guarda el resultado 1 minuto en memoria; la cinta lo pide cada 30 s (y al volver a la pestaña) y, si falla, deja los últimos precios. Antes del primer dato muestra "—". Oro y plata son los futuros de COMEX (`GC=F`, `SI=F`): Yahoo no publica el spot, así que difieren unos dólares del XAUUSD spot del gráfico de TradingView. Es un endpoint no oficial: si deja de responder, la cinta queda con "—" y se puede cambiar el proveedor en `live-quotes.ts` (alternativas probadas: gold-api.com para oro y plata, Binance o CoinGecko para cripto, DolarApi para el dólar en Argentina).
- **Textos legales en PDF**: `scripts/build-legal-pdfs.mjs` (`pnpm legal`) arma los PDF de `public/legal/` desde `scripts/legal/*.html` con la tipografía y el logo de la marca, usando el Chromium de Playwright. Los links del footer los descargan (`download`).
- **HTTPS en producción**: con `SITE_ENV=production` se envían `Strict-Transport-Security` (2 años, con subdominios, sin preload) y `upgrade-insecure-requests` en la CSP.
- **CSP sin nonces** (`next.config.ts`): los nonces obligan a renderizar en dinámico y la home tiene que quedar prerenderizada. `script-src` lleva `'unsafe-inline'` y `https://s3.tradingview.com` (scripts de los widgets), y `'unsafe-eval'` solo en desarrollo. `frame-src` admite solo los iframes de TradingView. Zod corre en modo `jitless` (`src/shared/lib/zod-csp.ts`) para no disparar violaciones de CSP con su detección de `Function("")`. El e2e falla si aparece cualquier violación de CSP con los widgets cargados.
- **Widgets de TradingView** (`src/shared/ui/tradingview-widget.tsx`): un componente por tipo (Advanced Chart, Mini Chart, Market Quotes) sobre un cargador común que inyecta el script oficial cuando el marco se acerca a la pantalla. El alto lo reserva siempre el marco (sin CLS) y nada carga antes del LCP. Los iframes llevan `color-scheme: light`: la página es oscura y los documentos de TradingView claros, y con esquemas distintos Chrome pinta un fondo blanco opaco detrás del iframe. Los símbolos están en `src/shared/config/markets.ts`.
- **Sin `vite-tsconfig-paths`**: Vite 8 resuelve los `paths` de tsconfig de forma nativa (`resolve.tsconfigPaths`).
- **Arquitectura simple**: se probó una versión con capas, puertos y adaptadores (`domain/`, `application/`, `infrastructure/`) y se aplanó a pedido del usuario, porque costaba leerla. `eslint-plugin-boundaries` solo controla que entre secciones se use el `index.ts`, y que `shared/` no importe de `features/`.
- **Referencia v4**: `reference/index.html` es el render standalone de la página "Principal v4" (`project/Main-v4.dc.html`) del lienzo de diseño, generado con `node scripts/build-reference.mjs` desde `reference/design-source.dc.html` (la fuente v4 tal cual): plantilla + lógica del artboard, assets locales en lugar de `/_blob/…` y sin las notas "Vista de diseño…". El intérprete del formato está en `reference/dc-runtime.js`. Las versiones anteriores quedan en el historial de Git.
- **Tests de Playwright contra el build de producción** en el puerto 3100 (el 3000 es de `next dev`). `reference/` se sirve en el 3001.
- **Regresión visual y datos en vivo**: con `__FREEZE_MOTION__` los widgets de TradingView no cargan; en la comparación se enmascaran entera la cinta del header (precios en vivo), el marco del gráfico de XAUUSD y las tarjetas de mercado (en la referencia, sus maquetas). Sus marcos miden lo mismo que en el diseño: el del gráfico sigue las proporciones del artboard en cada corte (≈ 525 px en 1440, 459 px en 768, 378 px en 390) y las tarjetas, 412 px.
- **Sin el preflight de Tailwind** (`src/app/globals.css`): la referencia depende de los estilos por defecto del navegador. Se importan solo `theme` y `utilities`, y la capa base replica los estilos globales de la referencia. Consecuencia: **no usar `border-solid`**, porque activa el borde en los cuatro lados con el ancho por defecto (3 px). Las utilidades `border-*` de Tailwind 4 ya fijan el estilo del lado que corresponde.
- **Fuentes**: los mismos binarios que carga la referencia desde Google Fonts CSS (Lexend v26 y Unbounded v12, subset latino, eje `wght` variable), en `public/fonts/` y servidos con `next/font/local`. `next/font/google` baja otra revisión cuyos anchos difieren ~4% y rompía el pixel match. Sin fallback métrico (`adjustFontFallback: false`), así la cadena de fuentes es idéntica a la de la referencia. La imagen OG usa TTF (`src/shared/seo/fonts/`), porque Satori no lee woff2.
- **Tokens propios en `@theme`**: se resetean los namespaces de Tailwind que se reemplazan. `src/shared/lib/cn.ts` registra los mismos tokens en `tailwind-merge`; si se agrega un token, hay que sumarlo en los dos lugares (los últimos: `bull` y `gold`).
- **Estructura del hero**: la `section#inicio` de la referencia se divide en `div#inicio > header` (landmark banner: nav, menú y ticker) y `section#hero` dentro de `main` (h1 y resto). Visualmente es el mismo bloque; la regresión visual mide la unión de los dos. La foto del hero se precarga (`preload`), porque a 420 px compite con el h1 por el LCP.
- **Accesibilidad frente a la referencia** (sin cambios visuales salvo donde se indica):
  - `SectionTitle` agrega un espacio entre palabras para el nombre accesible ("Nuestros recursos" y no "Nuestrosrecursos").
  - El logo se llama "Código Dinero, ir al inicio", así incluye el texto visible (WCAG 2.5.3).
  - El número de la pregunta abierta de la FAQ usa `#FF3636` (`accent-raised`) en lugar de `#FF2B2B` sobre `#202020`: 4,53:1 contra 4,37:1, para cumplir AA.
  - "Solicitar por WhatsApp" de la biblioteca mide 44 px (el diseño, 40 px) y su nombre accesible suma el tipo de recurso ("Solicitar por WhatsApp: Guía"). La regresión visual lo reporta como cambio intencional.
  - Las pestañas Metales / Cripto / Forex son un `tablist` con flechas; un `::after` lleva el área táctil a 44 px sin cambiar la pastilla.
  - axe excluye el contenido de los iframes de TradingView (de terceros).
- **Cambios de diseño posteriores a la referencia** (pedidos por el dueño; la regresión visual los reporta como "cambio intencional" sin fallar):
  - cintas de temas con un ícono de Lucide por tema (`src/features/topics-ribbon/content.ts`);
  - "Equipo" pasó a "Nosotros", el footer no tiene Telegram ni X y la FAQ no tiene las preguntas de acreditación y cancelación;
  - el bloque vino del header y del hero ocupa todo el ancho (`max-w-full`), y por eso a 1440 px difiere de la referencia;
  - por debajo de 768 px los márgenes y el espaciado son más compactos que en la referencia: secciones abiertas a 16 px (en lugar de 24), cajas (header/hero, Recursos, Indicador, Mercado, FAQ, footer) a 12 px del borde con padding interno compacto, tarjetas a 20 px, respuestas de la FAQ a todo el ancho y 72 px entre secciones (en lugar de 100–110). Desde 768 px no cambia nada. Por eso la regresión visual a 390 px solo reporta (no falla);
  - hovers: pastilla deslizante en el nav, botones que suben y pasan a blanco, bloques de formación y redes del footer que invierten colores; la esfera del hero reacciona al cursor.
- **Fotos**: `src/shared/config/photos.ts` centraliza las fotos de Ángel (recortes sin fondo del hero y del cierre, fotos de "Quién soy", eventos y tutorial). `PersonPhoto` muestra la silueta y la pastilla "Foto" si un slot queda en `null`.
- `pnpm-workspace.yaml` aprueba el build script de `esbuild` (lo usa Vite). pnpm 12 bloquea los scripts que no están aprobados.
