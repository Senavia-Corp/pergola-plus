# 02 — Cambios por hallazgo

Cada entrada: ID del backlog → archivos → qué cambia y por qué → evidencia → prueba que lo cubre. Todo en el checkout local; nada desplegado.

## PERF-001 / GH-003 / PERF-004 — LCP móvil: hero y vídeo

**Archivos:** `scripts/lib/transformar.mjs` (nuevo paso 4m), `src/contenido-migrado/estaticas/index.html` (regenerado), `src/layouts/BaseLayout.astro` (prop `preloadImagen`), `src/pages/index.astro`, `src/pages/es/index.astro`, `public/images/hero-pergola-plus-florida-poster.avif` (nuevo, 82.768 B), `public/videos/Bd-video-pergola-plus-Final_movil.mp4` (nuevo, 4.510.968 B), `.gitignore`.

**Qué cambia:**
- El fotograma de espera pasa de `style="background-image:url(…poster.jpg)"` (JPEG 199.782 B, descubierto tarde) a `poster="/images/hero-pergola-plus-florida-poster.avif"` nativo (AVIF 1280×720 q50 sacado del fotograma 0 del master 2560×1440 del cliente) + `<link rel="preload" as="image" fetchpriority="high">` en el `<head>` de las dos home.
- `<source type="video/mp4">` / `type="video/webm"` declarados.
- Un `<script>` en línea como primer hijo del `<video>` quita `autoplay` y pone `preload="none"` antes de que el parser inserte las fuentes, y arranca el vídeo al `load` de la página desde el mismo fotograma que el poster. Por debajo de 768 px reproduce la versión de 960×540 (1,08 Mbps). Con `prefers-reduced-motion` o `saveData` no arranca y se queda la foto real. Sin JavaScript el markup conserva `autoplay` y las dos fuentes.
- El MP4 de escritorio NO se recodifica: medido, a CRF 27/36 salía 13,0 / 22,5 MB frente a los 9,2 MB actuales.

**Evidencia:** sonda Playwright después del cambio: `poster` presente, `paused:false`, `currentSrc` = `_movil.mp4` a 375 px y `_mp4.mp4` a 768/1440 px, en EN y ES. Lighthouse móvil local ×3: ver 03/04.
**Prueba:** el paso 4m lanza si el markup del `<video>` deja de coincidir; `check:generadores`, `check:imagenes` (el vídeo nuevo está versionado), sonda.

## PERF-003 — Imágenes del cliente a tamaño real

**Archivos:** `scripts/lib/transformar.mjs` (paso 4d + `CLIENTE_DERIVADOS`), `scripts/optimizar-imagenes-cliente.mjs` (escribe los derivados), `public/images/cliente/*-{640,960,1280,1920}.avif` (48 nuevos, 3,2 MB en total), 40 fragmentos regenerados.

**Qué cambia:** las 12 fotos del cliente (2500×1406, 141–272 KB) se pintaban a 343/360/643 px. Ahora llevan `srcset` 640/960/1280/1920/2500 y `sizes="(min-width: 992px) 50vw, 100vw"`; el `src` sigue siendo el master (es el que mide `img-dim.json`).
**Evidencia:** en la home a 375 px el navegador elige el derivado de 640 (`naturalWidth 375→` fichero 640w, 20 KB) y a 1440 px el de 960 (40 KB) frente a los 258 KB del master. El insight *image-delivery* de Lighthouse pasa de 1.299 KiB (auditoría) / 6 imágenes del cliente a 0 imágenes del cliente listadas; quedan la de cabanas del CMS y 3 logos PNG (ver 11).
**Prueba:** `check:imagenes` (las 48 rutas existen y están en git), sonda (render/natural), diff visual 0,19–1,0 % en páginas de servicio (remuestreo, no layout).

## PERF-001 (plantillas) — Portada del hero de las fichas en `loading="lazy"`

**Archivos:** `scripts/lib/transformar.mjs` (paso 6b, `PORTADAS_ANCHOS`), `scripts/derivar-portadas.mjs` (nuevo), `public/cms-img/locations/**/cover-*-{640,960,1280}.avif` y `public/cms-img/products/**/cover-*-{640,960,1280}.avif` (36 nuevos, 3,6 MB), 76 fragmentos regenerados.

**Qué cambia:** en las 25 ciudades, 3 condados y 10 productos (×2 idiomas = 76 páginas) la imagen del hero —el elemento LCP— llevaba `loading="lazy"` y venía a 1450×967 (200–580 KB) para una caja de 412×350 en móvil. Lighthouse móvil en `/pergolas-contractors/miami-pergola-experts/`: Performance 75, LCP 7,6 s, «LCP resources should not use loading=lazy». Ahora: `loading="eager" fetchpriority="high"` y, para las 12 portadas del CMS, `srcset` 640/960/1280/1450 con `sizes="100vw"`; las 7 portadas que son fotos del cliente ya traían su `srcset` del paso 4d. El paso corre DESPUÉS de `recomponerFicha`, que busca el `<img>` del hero por su literal exacto.
**Evidencia:** ver `03-BEFORE-AFTER-LIGHTHOUSE.csv` (`prod-ciudad` antes del paso frente a `prod2-ciudad` después) y 09.
**Prueba:** el paso lanza si falta algún derivado (`node scripts/derivar-portadas.mjs` lo repone); `check:imagenes` (existen y están en git); `check:generadores`.
**Hallazgo colateral:** `/pergolas-contractors/coral-springs-installation/` (EN y ES) tiene como portada `/images/wf-placeholder.svg`: la ficha del CMS no trae imagen. Va a 11.

## SEO-004 / QA — Índice del blog y formulario de presupuesto (hallazgos del Lighthouse por plantilla)

**Archivos:** `src/i18n/blog.es.ts`, `src/styles/blog.css`, `src/styles/cotizacion.css`, `public/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-5.avif`.

- `/resources/blog/` (y las 5 categorías, EN y ES) daba SEO 92 por `link-text`: el botón del destacado decía «Read More» / «Leer más». Ahora «Read the full article» / «Leer el artículo completo» (misma clave `leerMas`, que también usa la tarjeta).
- A11y 97 por `color-contrast` REAL: la fecha y los minutos del destacado (`.pp-dato`, `#61767c`) sobre la columna oscura daban 1,7:1. Regla acotada `.blog-featured_column .pp-dato { color: #cfd8da }` (5,7:1).
- LCP móvil 6,6 s: la imagen del destacado ya era `fetchpriority=high` y eager, pero pesaba 252 KB a 1250 px. Recodificada a q55 (misma resolución; ~80 KB). Mismo aviso que la de cabanas: `instalar-assets.mjs` la repondría desde el staging.
- `/contact-us/get-a-quote/` CLS 0,05 en móvil: los tres pasos del multipaso se pintaban a la vez y `Formulario.astro` los plegaba después. Con JS activo (`html.w-mod-js`) los pasos 2 y 3 nacen plegados hasta que el script pone `data-pp-multipaso`; sin JS no aplica. Best Practices 96 ahí es `Uncaught TurnstileError 600010`: el sitekey no admite `localhost`; en el dominio real no ocurre y no se puede arreglar desde el código.

**Evidencia:** filas `prod-blog`/`prod3-blog` y `prod-quote`/`prod3-quote` de 03.

## GH-010 — Miniaturas del blog

Sin cambio: el commit `6ab769b` ya había retirado las 10 miniaturas de la home y de las 25 ciudades. En `/resources/blog/` se pintan a 343×229 (móvil) y 406×271 (escritorio) desde 525×350 (59–117 KB): proporción correcta para DPR 1–1,5. **NOT_APPLICABLE**.

## PERF-002 / GH-004 — Camino crítico: jQuery y webflow.js

**Archivos:** `src/layouts/BaseLayout.astro`, `public/js/jquery-3.5.1.min.js` (nuevo, 89.476 B).

**Qué cambia:** jQuery pasa del CloudFront de Webflow (único tercero del camino crítico; Lighthouse le atribuía 1.073 ms en móvil) a `/js/`, byte a byte el mismo fichero: `sha256` en base64 `9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=` = el `integrity` que ya llevaba el sitio, que se conserva. Los dos scripts llevan `defer` (orden garantizado entre ellos; webflow.js arranca en `$(document).ready`, que con `defer` sigue disparándose).
**Evidencia:** render-blocking de Lighthouse móvil: desaparecen webflow.js y jQuery de la lista; FCP 2.255 → 1.373 ms (mediana de 3). Sonda: menú móvil abre (`w--open`), 10 hermanos con `inert`, Escape cierra; dropdown de escritorio abre y Escape cierra; en las 8 rutas × 3 anchos.
**Qué NO se hizo:** retirar/diferir las hojas de Webflow o inyectar CSS crítico (ver 01 y 09).

## GH-006 — Fuentes Inter duplicadas

**Archivos:** `public/fonts/` (10 → 2 ficheros: `inter-latin.woff2`, `inter-latin-ext.woff2`), `src/styles/fuentes.css`, `scripts/bajar-fuentes.mjs`, `src/layouts/BaseLayout.astro`.

**Qué cambia:** se comprobó la tabla de directorios de los woff2 (tablas `fvar`, `gvar`, `avar`, `HVAR`, `STAT`): son fuentes VARIABLES, y los cinco «pesos» eran el mismo fichero (SHA idéntico). Ahora hay un `@font-face` por subconjunto con `font-weight: 300 700`; el preload pasa de dos (400 y 700 = 2×48 KB iguales) a uno. El generador `bajar-fuentes.mjs` produce ya esta forma.
**Evidencia:** peticiones de fuente en la home móvil: 4 ficheros `inter-latin-{300,400,500,700}` de 48.658 B (194 KB) → 1 fichero de 48.658 B. Cobertura de caracteres idéntica (mismos `unicode-range`), pesos 300–700 reales (variable), sin cambio visual en las capturas.
**Prueba:** `check:seo`/`check:paginas` (sin referencias rotas), diff visual.

## GH-002 — Preview: `noindex` legible

**Archivos:** `astro.config.mjs` (`sitemapYRobots`, docblock), `scripts/comprobar-noindex.mjs`.

**Qué cambia:** el build sin `PUBLIC_ES_PRODUCCION=1` escribía `robots.txt` con `Disallow: /`, que impide a Google leer el `<meta noindex>` de las páginas; una URL enlazada desde fuera podía indexarse como «URL sin contenido». Ahora `Allow: /` + `Disallow: /api/`, sin `Sitemap:`, y el `noindex,nofollow` en las 217 páginas sigue siendo la exclusión. Sin sitemap ni RSS, como antes. La puerta `check:noindex` comprueba lo nuevo (y sigue exigiendo que NO haya sitemap y que las 217 lleven el meta).
**Evidencia:** `dist/client/robots.txt` del build preview; `check:noindex` en verde en los dos modos.
**Pendiente (fuera del repo):** Deployment Protection en Vercel (ver 08).

## GH-001 / SEO-001 / SEO-002 / SEO-003 — Indexabilidad real

Sin cambio de código posible: el problema está en las variables de production del proyecto `pergola-plus-preview` (leídas en solo lectura). Documentado con evidencia HTTP y de panel en 00 y 08; pasos exactos en 10. **BLOCKED (autorización).**

## SEO-004 / SEO-005 / I18N-001 — Crawl completo del build de producción simulada

**Archivos:** `scripts/informe-crawl.mjs` (nuevo), `05-CRAWL-SEO-VALIDATION.csv`.

Una fila por cada una de las 217 páginas: canonical absoluta y coincidente con la ruta, title/description y longitudes, un único H1, `html[lang]`, robots, hreflang y reciprocidad (comprobada contra la página destino), og:image, tipos JSON-LD y si parsea, presencia en el sitemap (y que ninguna `noindex` esté dentro). Resultado en 05 y 09.

## GH-007 — og:image

**Archivos:** `src/layouts/BaseLayout.astro` (default), `src/pages/index.astro`, `src/pages/es/index.astro`, `public/images/og-pergola-plus-florida.jpg` (nuevo, 1200×630, 150.721 B).

**Qué cambia:** la home (y toda página sin `ogImage` propia) salía sin `og:image`/`twitter:image`. Ahora el layout usa por defecto un recorte 1200×630 del fotograma 0 del vídeo del cliente (imagen real, no stock); las fichas con imagen propia siguen pasando la suya.
**Evidencia:** 217/217 páginas con `og:image` absoluta en el crawl (05). Antes: 0 en la home.

## GH-009 — Aviso de idioma de la home ES

**Archivos:** `src/pages/es/index.astro`.

**Qué cambia:** el texto afirmaba que blog y calculador seguían en inglés; medido sobre dist: 108 de 109 rutas tienen gemela en `/es/`, incluidos los 21 posts (`/es/post/*`, con title y H1 en español) y `/es/project-estimator/`. El aviso ahora enlaza blog y calculador en español y dice la única verdad restante: `/articles/terms-of-service/` sigue en inglés.
**Prueba:** `check:i18n`, `check:paginas`.

## GH-005 — PII en logs del endpoint

**Archivos:** `src/lib/lead.ts`.

**Qué cambia:** la línea `LEAD` de stdout llevaba el lead entero (nombre, teléfono, email, mensaje) y `ERROR_ENTREGA` lo repetía. Ahora stdout lleva `{tipo, id (UUID de correlación), formulario, pagina, idioma, recibido, verificado, campos: [nombres]}` y `ERROR_ENTREGA` lo mismo más `errores`. El contenido completo viaja solo por los canales de entrega (archivo local, webhook, correo), que no cambian. Turnstile, validaciones, 303/JSON y el fallo cerrado sin canal se conservan.
**Evidencia:** prueba con webhook mock local (scratchpad `leads/prueba-lead.mjs`): 7/7 PASS — ok:true con webhook; el webhook recibe el lead entero; stdout/stderr sin ninguno de los 4 marcadores de PII; `id` presente; sin canal → ok:false y `ERROR_ENTREGA` sin datos. Ver 07.
**Prueba:** `check:correo` (entregarLead no miente) en verde.

## GH-008 / LOCAL-001 / CONTENT-001 — Contenido local

Medición de similitud de las 28 páginas (06) y backlog de verificación (11). Sin contenido nuevo: **CONTENT BLOCKED: VERIFICATION REQUIRED**.

## QA-001 — Errores de consola de la auditoría

Eran `chrome-extension://` y un `@import` a Google Fonts inyectado por una extensión: en el build no existe ninguna referencia a `fonts.googleapis`. En Chrome limpio, Best Practices 100 móvil y escritorio, consola limpia en 7 de 8 rutas (la 8.ª, `/contact-us/get-a-quote/`, muestra avisos del challenge de Turnstile en headless, idénticos antes y después).

## GH-011 — Ejecución de las puertas

Las 19 `check:*` ejecutadas en baseline y tras los cambios (07). `check:generadores` exige que la salida generada esté comiteada: se ejecuta tras el commit local y su resultado se anota en 07/09.
