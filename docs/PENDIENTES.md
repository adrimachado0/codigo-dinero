# Pendientes

Todo lo que falta definir o implementar. Se actualiza en cada fase.

## Contenido (marcadores de la referencia, se mantienen tal cual en la UI)

- [ ] **Precio**: `[PRECIO] [por mes / pago único]` (FAQ 01).
- [ ] **Plataforma** de la Escuela: `[PLATAFORMA]` (FAQ 03).
- [ ] **Soporte**: `[CORREO o WHATSAPP DE SOPORTE]` y `[PLAZO]` de acreditación (FAQ 04).
- [ ] **Política de cancelación**: `[CONFIRMAR POLÍTICA]` y `[DÓNDE SE CANCELA]` (FAQ 05).
- [ ] **Reseñas reales**: `[Nombre del alumno]`, `[Ciudad]` y textos `[Reseña de un alumno: …]` (sección Comunidad, ×3).

## Links y datos

- [ ] Links de YouTube (canal, clases 01–04, clase destacada, "Ver la ruta de estudio"). Habilitan el JSON-LD `VideoObject`.
- [ ] Links de redes: YouTube, Instagram, TikTok, Telegram, X (footer y `sameAs` del JSON-LD).
- [ ] Link de partner de EC Markets ("Abrir cuenta").
- [ ] Destinos de los links del menú: Escuela, Calendario, Mercado, Equipo, Empezar.
- [ ] Dominio de producción (`NEXT_PUBLIC_SITE_URL`).
- [ ] Textos legales: Términos y condiciones, Política de privacidad, Aviso de riesgo.

## Assets

- [ ] Fotos de clientes (PNG con fondo transparente): hero, mentor (sección "Qué es") y CTA final. Se configuran en `src/shared/config/photos.ts`.
- [ ] Avatares opcionales de las reseñas.

## Integraciones

- [ ] Proveedor real de cotizaciones (hoy `SimulatedQuoteSource`; la etiqueta "Simulado" queda visible mientras tanto).
- [ ] Destino de los leads (hoy `ConsoleLeadRepository`).
- [ ] Rate limiting del formulario de leads.

## Decisiones técnicas registradas

- **Entorno 100% Docker**: no se instala nada en el host. Imagen `mcr.microsoft.com/playwright:v1.64.1-noble` (Node 26.13 LTS) más pnpm 12.16.1 y agent-browser 0.41.1. Al actualizar `@playwright/test`, hay que actualizar también el tag de la imagen base.
- **TypeScript 6.0.x en lugar de 7**: `typescript-eslint@8.72.1` declara `typescript >=4.8.4 <6.1.0`. Revisar cuando typescript-eslint soporte TS 7.
