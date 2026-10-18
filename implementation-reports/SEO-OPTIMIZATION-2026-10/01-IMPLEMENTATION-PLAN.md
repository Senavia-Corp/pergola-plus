# 01 — Plan de implementación (ejecutado)

Orden real de ejecución, con los ID del backlog `12-PRIORITIZED-SEO-BACKLOG.csv`. Estado: **HECHO** (en el checkout local), **DOCUMENTADO** (no se puede hacer desde el repo) o **PENDIENTE**.

| # | Fase | IDs | Archivos | Riesgo | Estado |
|---|---|---|---|---|---|
| 0 | Baseline: build, 19 puertas, Lighthouse ×3 local, sonda Playwright, lectura Vercel/HTTP | GH-001, GH-011, QA-001, SEO-002, SEO-003 | (scratchpad) | — | HECHO |
| 1a | Hero: `poster` AVIF nativo + `preload fetchpriority=high` + `type` en `<source>` + vídeo móvil 960 px + respeto a reduced-motion/save-data | PERF-001, PERF-004, GH-003 | `scripts/lib/transformar.mjs` (4m), `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/es/index.astro`, `public/images/hero-*.avif`, `public/videos/*_movil.mp4`, `.gitignore` | M (vídeo/LCP) | HECHO |
| 1b | Imágenes del cliente: derivados 640/960/1280/1920 + `srcset/sizes` | PERF-003 | `transformar.mjs` (4d), `scripts/optimizar-imagenes-cliente.mjs`, `public/images/cliente/*-NNN.avif` (48) | B | HECHO |
| 1c | Miniaturas de blog | GH-010 | — | — | NO APLICA ya: el commit `6ab769b` las retiró de la home y las 25 ciudades; en `/resources/blog/` se pintan a 343–406 px desde 525×350. Ver 02 |
| 2a | jQuery autoalojado + `defer` en jQuery y webflow.js | PERF-002, GH-004 | `BaseLayout.astro`, `public/js/jquery-3.5.1.min.js` | M (menú/IX2) → verificado con sonda | HECHO |
| 2b | Inter: un woff2 variable por subconjunto en vez de 5 duplicados | GH-006 | `src/styles/fuentes.css`, `public/fonts/`, `scripts/bajar-fuentes.mjs`, `BaseLayout.astro` | B | HECHO |
| 2c | CSS crítico / purga del CSS Webflow | PERF-002 | — | A | PENDIENTE (deliberado: ver 09) |
| 3a | Preview rastreable con `noindex` legible (en vez de `Disallow: /`) | GH-002 | `astro.config.mjs`, `scripts/comprobar-noindex.mjs` | B | HECHO |
| 3b | Build de producción simulada + crawl de las 217 URL | SEO-001, SEO-004, SEO-005, I18N-001 | `scripts/informe-crawl.mjs`, `05-CRAWL-SEO-VALIDATION.csv` | — | HECHO |
| 3c | Corregir el deploy real (env de Vercel) | GH-001 | Vercel (fuera del repo) | A | DOCUMENTADO — requiere autorización |
| 4 | `og:image` por defecto en todo el sitio y explícita en las dos home | GH-007 | `BaseLayout.astro`, `index.astro`, `es/index.astro`, `public/images/og-pergola-plus-florida.jpg` | B | HECHO |
| 5a | Similitud de las 25 ciudades + 3 condados (medida, no opinada) | GH-008, LOCAL-001 | `06-STRUCTURED-DATA-AND-LOCAL-SEO.md`, `11-REMAINING-EDITORIAL-VERIFICATION.md` | — | HECHO (medición) / contenido PENDIENTE de evidencia |
| 5b | Aviso de idioma de la home ES | GH-009 | `src/pages/es/index.astro` | B | HECHO |
| 6 | Logs del endpoint sin PII + id de correlación; prueba con webhook mock | GH-005 | `src/lib/lead.ts` | B | HECHO |
| 7 | Build, 19 puertas, Lighthouse antes/después (home ×3 móvil/escritorio) y por plantilla, sonda de regresión, diff visual | GH-011 | reportes 03, 04, 07 | — | HECHO |

## Dependencias y orden

1. Los cambios de markup migrado van SIEMPRE por `transformar.mjs` → `node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs` → `npm run build`. Editar `src/contenido-migrado/*.html` a mano lo revierte el siguiente regenerado y lo caza `check:generadores`.
2. Los nuevos ficheros de `public/` tienen que estar en git antes de `check:imagenes` (comprueba `git ls-files`), de ahí la excepción en `.gitignore` para el vídeo móvil.
3. El build de producción simulada se hace en el mismo `dist/` con `PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com`, se mide y se vuelve a construir en modo preview al final para no dejar un `dist/` indexable en disco (el `dist/` no se versiona).

## Lo que se decidió NO hacer (y por qué)

- **Recodificar el vídeo de escritorio.** A CRF 27 (H.264) y CRF 36 (VP9) salía MÁS grande que el MP4 de Webflow (13,0 MB y 22,5 MB frente a 9,2 MB): es plano de dron con mucho detalle y el original ya está a 2,2 Mbps. Bajar de ahí es perder calidad visible en el hero. Se añadió solo la variante móvil (960×540, 1,08 Mbps, 4,5 MB) que es donde la pantalla no puede mostrar los 1280 px.
- **Retirar o diferir el CSS de Webflow / inyectar CSS crítico.** Las tres hojas estilizan el 100 % del sitio; el `unused-css` estimado son ~15 KB. El riesgo de regresión visual en 217 páginas no compensa ~100–200 ms de FCP estimado. Documentado como siguiente paso opcional en 09.
- **Tocar Vercel, DNS o producción.** Fuera de alcance por regla; está escrito exactamente qué cambiar en 08.
- **Contenido local nuevo para las 25 ciudades.** Sin proyectos verificados por ciudad sería inventar; ver 11.
