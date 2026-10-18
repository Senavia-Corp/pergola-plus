# 00 — Baseline y entorno (18-oct-2026)

## Estado del repositorio

| Dato | Valor |
|---|---|
| Rama / HEAD al empezar | `main` · `6ab769b7c4e25f7d7b9696176e6da8a609f2512c` (coincide con el commit auditado) |
| Working tree al empezar | limpio salvo dos sin seguimiento: `docs/prompt-blog-imagenes-seo.md` y `public/photos/` (1,6 GB de fotos del cliente, no se tocan) |
| Node / npm locales | v24.14.0 / 11.9.0 (`engines.node >=22.12.0`) |
| Astro / adaptador / nodemailer | `astro ^7.2.2` · `@astrojs/vercel ^11.0.5` · `nodemailer ^9.0.5` (sin cambios; no se hizo ningún upgrade) |
| devDependencies | `playwright ^1.62.1`, `sharp ^0.35.3` |
| Lighthouse disponible | 13.5.0 (`npx lighthouse`, caché local) con Google Chrome del sistema; la auditoría original fue 13.4.1 |
| Vídeo | ffmpeg/ffprobe de Homebrew |

## Pipeline de build (comprobado)

`npm run build` = `astro build` + `node scripts/rutas-vercel.mjs`. En `astro:build:done` corren dos integraciones propias de `astro.config.mjs`: `pergola-dimensionar-imagenes` (width/height desde `src/lib/img-dim.json` + reescritura de enlaces internos a `/es/`) y `pergola-sitemap-robots` (sitemap/robots/RSS según `PUBLIC_ES_PRODUCCION`). Salida: `dist/client` (217 HTML) + `dist/server` (solo `/api/lead`) + `.vercel/output`. Duración local: 17 s.

Las 17 páginas estáticas y 86 fichas de detalle de `src/contenido-migrado/` y `src/pages/` son SALIDA GENERADA por `scripts/generar-paginas.mjs` y `scripts/generar-detalle.mjs` a través de `scripts/lib/transformar.mjs`; `check:generadores` lo verifica. Por eso todos los cambios de markup migrado (hero, srcset) se hicieron en el transformador y se regeneró.

## Puertas del repo en el baseline (sobre el build preview, antes de tocar nada)

Las 19 puertas `check:*` pasaron en verde: blog, enlaces, carruseles, marquee, animaciones, imagenes, cta, estimador, paridad, generadores, formularios, i18n, seo, paginas, noindex, resenas, iconos, ritmo, correo. Log: scratchpad `baseline/checks-baseline.log` (no versionado).

## Inventario de rutas construidas (dist/client)

| Familia | EN | ES |
|---|---:|---:|
| Home | 1 | 1 |
| Productos (`/products/*` + índice) | 11 | 11 |
| Servicios (`/services/*` + índice) | 8 | 8 |
| Ciudades (`/pergolas-contractors/*` + índice) | 26 | 26 |
| Condados (`/countries/*` + índice) | 4 | 4 (3 + índice) |
| Proyectos (`/project/*`) + galería | 14 | 14 |
| Blog: posts / categorías + índice / RSS | 21 / 6 | 21 / 6 |
| Marcas, FAQ, garantías, estimador, contacto (3), about (5), legales | resto | resto |
| 404 / thank-you | `404.html`, `/thank-you/` | `/es/404/`, `/es/thank-you/` |
| **Total HTML** | **109** | **108** → 217 |

Única ruta inglesa sin gemela española: `/articles/terms-of-service/`. Única española sin inglesa: `/es/404/` (la inglesa es `404.html`).

## Variables y entorno real (lectura, sin cambios)

Leído con el conector de Vercel (solo lectura) el 18-oct-2026:

| Dato | Valor |
|---|---|
| Proyecto Vercel | `pergola-plus-preview` (`prj_o1iyrhzM9Jax4NXwvVCgtI4dhYie`, team `senaviacorp`), framework astro, Node 24.x |
| Último deploy production | `dpl_B1dcbupkaVwFomgrnBzgwdjWF5Vc`, READY, SHA `6ab769b7…` = HEAD auditado |
| Dominios del proyecto | `pergola-plus-preview.vercel.app` (+ alias `-senaviacorp` y `-git-main`) — ningún dominio propio |
| `PUBLIC_ES_PRODUCCION` | `1` en target **production** (creado 16-oct-2026, con comentario que reconoce el riesgo) |
| `PUBLIC_SITE_URL` | definida en production como variable *sensitive* (valor no leído); por el HTML servido vale `https://pergola-plus-preview.vercel.app` |
| Protección | SSO `all_except_custom_domains`; passwordProtection off. La URL `pergola-plus-preview.vercel.app` responde 200 sin SSO |
| Dominio real | `https://www.pergolaplusflorida.com` sigue sirviendo el Webflow original (`data-wf-site="63f3b8ea…"`, server cloudflare) |

HTTP real medido en `https://pergola-plus-preview.vercel.app` (curl, 18-oct-2026):

```
/robots.txt  -> 200  "User-agent: * / Allow: / / Disallow: /api/ / Sitemap: https://pergola-plus-preview.vercel.app/sitemap.xml"
/sitemap.xml -> 200
/resources/blog/rss.xml -> 200
/            -> 200, canonical https://pergola-plus-preview.vercel.app/, SIN <meta name="robots" noindex>, SIN og:image
sin cabecera x-robots-tag en ninguna respuesta
```

**Conclusión P0 (GH-001/GH-002/SEO-001..003):** el deploy «preview» está construido en modo producción y es una copia completa e INDEXABLE del sitio bajo `*.vercel.app`, con sitemap y canonicals hacia esa URL, mientras el dominio real sigue en Webflow. Es exactamente el escenario que el código del repo intenta impedir. No se ha tocado (requiere autorización): ver `08-PRODUCTION-PREFLIGHT.md`.

## Baseline Lighthouse

### Auditoría original (preview en Vercel, 1 corrida por dispositivo, Chrome con extensiones)

| Indicador | Desktop | Mobile |
|---|---:|---:|
| Performance / A11y / BP / SEO | 90 / 100 / 96 / 100 | 78 / 100 / 96 / 100 |
| FCP / LCP / CLS / TBT | 0,8 s / 1,1 s / 0 / 0 ms | 3,1 s / 4,6 s / 0,012 / 20 ms |

Del JSON móvil: elemento LCP = `<video>` del hero (su fotograma de espera, un JPEG de 200 KB en `background-image` en línea). Render-blocking estimado 1.920 ms, de los que 1.073 ms eran jQuery desde CloudFront (único tercero del camino crítico). Image-delivery estimado 1.299 KiB: seis AVIF de 2.135×1.406 pintados a 889×500 o menos. El `@import` a Google Fonts y los errores de consola `chrome-extension://` provienen de extensiones del navegador auditor, no del sitio (QA-001): en el build no existe ninguna referencia a `fonts.googleapis`.

### Baseline reproducible local (este trabajo, antes de cambiar nada)

Servidor estático propio con gzip sobre `dist/client` (`scratchpad/servir.mjs`, puerto 4173), Lighthouse 13.5.0, Chrome headless sin extensiones, throttling simulado por defecto, **3 corridas por dispositivo**, build en modo preview (noindex).

| Métrica | Mobile (3 runs) | Mediana | Desktop (3 runs) | Mediana |
|---|---|---:|---|---:|
| Performance | 76 / 73 / 73 | 73 | 98 / 98 / 98 | 98 |
| Accessibility | 97 / 97 / 97 | 97 | 100 | 100 |
| Best Practices | 100 | 100 | 100 | 100 |
| SEO | 69 (noindex del modo preview: esperado) | 69 | 69 | 69 |
| FCP | 2.257 / 2.255 / 2.255 ms | 2.255 | 487 / 485 / 485 | 485 |
| LCP | 6.009 / 8.557 / 8.557 ms | 8.557 | 1.167 / 1.165 / 1.165 | 1.165 |
| CLS | 0,012 | 0,012 | 0 | 0 |
| TBT | 17 / 15 / 15 ms | 15 | 0 | 0 |

Notas: el LCP local es peor que el de Vercel porque el servidor local no es un CDN y Lighthouse simula la red igual; sirve para comparar antes/después en condiciones idénticas, no como cifra absoluta. La A11y 97 móvil local es `color-contrast` sobre `.product-card-h3` con fondo `#3d565d`: axe mide las tarjetas durante su animación de entrada (opacidad), no un color real del diseño; en el preview de Vercel dio 100.

## Capturas y sonda de regresión (baseline)

`scratchpad/sonda.mjs` (Playwright): 8 rutas × 3 anchos (375/768/1440), capturas PNG, apertura del menú móvil (+ `inert` en 10 hermanos + cierre con Escape), apertura de dropdown de escritorio (+ Escape), medidas de imágenes, estado del vídeo, consola. Resultado baseline: todo funcional; consola limpia salvo `/contact-us/get-a-quote/` (Turnstile de Cloudflare en headless: 11–13 avisos ajenos al sitio, idénticos antes y después).
