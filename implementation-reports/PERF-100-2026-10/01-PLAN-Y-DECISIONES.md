# 01 — Plan, decisiones y descartes

Rama `perf/100-cwv` desde `main@7feee86`. Un commit por fase. Método en cada fase:
`npm run check` → build de producción simulada (`PUBLIC_ES_PRODUCCION=1`,
`PUBLIC_SITE_URL=https://www.pergolaplusflorida.com`) → `scripts/perf/servir.mjs`
(4173) → Lighthouse 13.5 ×3 × 2 dispositivos × 16 plantillas → sonda (22 rutas × 4
anchos) → diff visual → crawl. Lo que no mejora la métrica que perseguía se revierte.

## F0 · Preparación y baseline (`bedd04f`)

**Hecho**

- `astro` 7.2.2 → 7.4.1, `sharp` 0.35.3 → 0.35.5, `nodemailer` 9.0.5 → 10.1.7,
  `@astrojs/vercel` 11.0.5 → 11.0.16. Las 19 puertas en verde con las versiones nuevas.
  `npm audit` deja 1 advisory *high* (`path-to-regexp` vía `@vercel/routing-utils`,
  dependencia del adaptador; sin fix no rompiente; se usa en build, no en runtime).
- Herramientas en `scripts/perf/` (sin dependencias nuevas): `servir.mjs`,
  `lighthouse.sh`, `resumen.mjs`, `sonda.mjs`, `diff-visual.mjs`, `crawl.mjs`,
  `medir-anchos.mjs`, `clases-runtime.mjs`, `plantillas.mjs`.
- Baseline: `00-BASELINE.csv` (medianas) y `00-baseline/` (96 corridas, sonda, crawl).

**Decisiones**

- Las capturas de página completa (60 PNG, 183 MB por tanda) y los 96 JSON de
  Lighthouse (~60 MB) **no van a git** (`.gitignore`): se regeneran con las
  herramientas y en el repo quedan los CSV, el JSON de la sonda y el informe del diff
  con los PNG de las diferencias (si las hay).
- Las capturas se toman con `prefers-reduced-motion: reduce`, recorriendo la página
  para disparar las imágenes `lazy` y esperando a que **todas** estén `complete`
  (estado, no reloj) y con las animaciones congeladas: así dos capturas de la misma
  página son idénticas y el diff mide cambios de verdad.
- Lighthouse va en serie (no en paralelo) y con la máquina sin builds: la corrida
  móvil 1 de galería (76, LCP 6,4 s) coincidió con un barrido de Playwright y es un
  valor atípico que la mediana descarta; se deja en el CSV porque se reporta todo.

**Lectura del baseline que cambia el plan**

- Home móvil ha salido 85 (93/85/85) con LCP 4,2 s en dos corridas, frente a los 93
  de la auditoría: el vídeo arranca al `load` y en una corrida lenta compite con el
  poster. F3 (arranque diferido) importa para la estabilidad, no solo para el peso.
- Estimador móvil 80 (69/80/80), CLS 0,133: el `<form>` baja cuando el JS muestra
  la barra de progreso (`hidden` → visible). Es geometría, no imágenes.
- 125 imágenes sobredimensionadas a 1440 y 9 a 375 (sin contar SVG): casi todas
  `/cms-img/**` a 1.250 px en cajas de 200–620 px.

## F1 · Imágenes

**Hecho**

- `scripts/derivar-cms.mjs` (nuevo, patrón de `derivar-portadas.mjs`): lee los HTML
  construidos y escribe junto a cada foto del CMS que se pinta (332 masters, todos
  ≥ 600 px) los derivados `-480/-800/-1200.avif` (972 ficheros, 52 MB, en git como el
  resto de `public/cms-img`). Los 4 PNG de logos del marquee (450×200 para 50 px de
  alto) y el SVG de Illustrator de 25 KB pasan a AVIF de 100 px de alto (2,5–4,7 KB).
- `responsivizarImagenes()` (`scripts/lib/transformar.mjs`), aplicada **sobre `dist/`**
  en el mismo barrido que `dimensionarImagenes()`: `srcset` con el juego completo +
  `sizes` por clase, **medidos** con `scripts/perf/medir-anchos.mjs` a 375/768/992/1440
  (tabla en `SIZES_POR_CLASE`, 21 clases). Solo emite si el juego está completo; si
  falta un derivado calla y `check:imagenes` (check 8, nuevo) lo convierte en fallo.
  Resultado: 3.204 `<img>` del CMS con srcset; quedan 40 fotos de clase sin medida
  (aviso, no fallo) y 2 por artículo que se arreglan en F2 (regex de `sizes` como
  primer atributo).
- `precargarLcp()` (ídem, sobre `dist/`): `<link rel="preload" as="image"
  imagesrcset imagesizes fetchpriority="high">` del primer `<img fetchpriority="high">`
  de la página, antes de las hojas de estilo. 136 páginas (fichas de ciudad, condado,
  producto, proyecto, posts e índices del blog). La prop `preloadImagen` de
  `BaseLayout` admite ahora `{ href, srcset, sizes }`.
- Hero de las 3 fichas de proyecto del cliente (`img.hero_media-img`, el LCP a 5,1 s):
  `loading="eager" fetchpriority="high"` desde `scripts/lib/proyectos-destacados.mjs`
  (las 10 del CMS llevan un embed de YouTube en ese hueco, sin imagen LCP).
- Estimador (`src/components/Estimador.astro`): `img.est-foto` con `srcset` de los
  derivados existentes (`-640/-960/-1280` del cliente, `-480/-800` del CMS) y
  `sizes="(min-width: 992px) 340px, (min-width: 768px) 45vw, 40vw"` (medido 148/344/
  247/340). CLS: `.est-progreso[hidden]` y `.est-nav[hidden]` reservan su sitio desde
  el primer frame (`visibility:hidden` en vez de `display:none`) y el texto de progreso
  reserva `1lh`.
- Blog: `sizes` medido en `TarjetaPost.astro` (29/47/92 vw), `Articulo.astro` (hero,
  1186 px / 94 vw) y en el cuerpo (`src/lib/articulo.ts`, `min(61vw, 772px)`); el
  srcset lo pone el barrido de `dist/`.
- `img.image-3` del formulario de presupuesto: `sizes` de `100vw` a `40vw` desde 992 px
  (la columna mide el 40 %; pedía el candidato de 1600 px para 576).

**Decisiones**

- `srcset` sobre `dist/` y no en 8 plantillas: las fotos del CMS están en el HTML
  migrado **y** en componentes propios (blog, proyectos, estimador). Es la misma razón
  por la que `dimensionarImagenes()` ya se aplicaba ahí (ver su comentario), y lo que
  mantiene `check:generadores` sin ruido. El preload del LCP igual.
- `sizes` por clase medidos, nunca a ojo: un `sizes` corto hace que el navegador elija
  un derivado pequeño y la foto salga borrosa (este repo ya tiene una auditoría de
  nitidez). Por eso en cada tramo se toma el **mayor** ancho medido para la clase.
- Se descarta recodificar `hero-custom-poolside-cabana-south-florida.avif` desde
  `public/photos/`: con los derivados la home sirve el de 480/800 px y la ficha de
  cabanas usa la portada con sus propios derivados; elegir el original por hoja de
  contactos entre 148 fotos no cambiaría un solo byte servido.
- Las 174 huérfanas no se tocan (07-PENDIENTE §7).

**Medido (mediana de 3, móvil; `01-f1/lighthouse-medianas.csv`)**

| Plantilla | Perf base → F1 | LCP base → F1 | Peso base → F1 (KB) |
|---|---|---|---|
| Estimador | 80 → **95** | 5.255 → 2.960 ms | 2.402 → 475 |
| Proyecto | 81 → **94** | 5.103 → 3.035 | 1.113 → 479 |
| Post | 90 → **97** | 3.677 → 2.585 | 534 → 355 |
| Producto | 90 → **94** | 3.426 → 3.040 | 825 → 496 |
| Home | 85 → **93** | 4.181 → 3.262 | 3.757 → 3.663 |
| Índice / categoría blog | 91 / 92 → **93 / 93** | 3.453 → 3.184 | 1.690 → 553 |
| Ciudad | 90 → 90 | 3.604 → 3.677 | 2.096 → 746 |
| Condado | 86 → 86 | 4.128 → 4.127 | 2.064 → 738 |
| Servicio | 95 → 93 | 2.964 → 3.189 | 2.100 → 782 |
| Resto (índices, galería, FAQ, contacto, home ES) | sin cambio (92–97) | | galería 1.624 → 568 |

CLS 0 en 32/32 (el estimador pasa de 0,133 a 0,000). `image-delivery-insight`: de
0,7–2 MB de ahorro estimado a 0–126 KB en todas. Sonda: 0 regresiones, 0
sobredimensionadas a 375 y 1440 (eran 9 y 125), menú 67/67, dropdown 23/23.

- **Ciudad y condado no suben** aunque el hero baje de 258 KB a 99–125 KB: el
  `lcp-breakdown` observado es 3+4+4+75 ms; el LCP simulado (3,7–4,1 s) lo fija la
  simulación de 1,6 Mbps con 42 KB gz de CSS bloqueante + 48 KB de fuente + 99 KB gz
  de JavaScript (jQuery + webflow.js) compitiendo con la imagen. Es trabajo de F2 y
  F7, no de imágenes: se para aquí y se retoma con medición en esas fases.
- **Servicio baja 2 puntos** (95 → 93, LCP +0,2 s) con el hero en `eager` +
  `fetchpriority="high"` + preload: `lcp-discovery-insight` pasa de 0 a 1 (antes se
  descubría a los 74 ms, detrás del CSS) pero la simulación adelanta la imagen por
  delante del CSS y mueve 0,2 s el LCP. Se mantiene por ser lo correcto para el
  navegador real y se **re-evalúa tras F2**: si sigue por debajo del baseline, se
  revierte el `eager` del servicio en ese commit.
- Las fotos del cliente en `/images/cliente/*` (estimador, servicio) ya tenían srcset;
  a 768 px la home sigue marcando 10 «sobredimensionadas» porque `product-card-image`
  es 2 columnas (360 px) en la home y 1 columna (704 px) en `/products/`: el `sizes`
  compartido toma el mayor para no servir borroso el índice. Aceptado.

**Diff visual (`01-f1/diff-visual.md`)**: decide la captura SIN fotos (las `<img>`
raster ocultas con `visibility:hidden`, la caja se queda): 59/60 por debajo del 1 %; la
única por encima (proyecto a 375, 2,55 %) son las 87 filas superiores: el nav estaba
en su estado «scroll» de IX2 en la captura del baseline y en reposo en la de F1 (la
vuelta arriba antes de capturar no espera a esa transición). Del píxel 87 abajo, 0 %.
Con fotos, 26/60 superan el 1 % (hasta 6 %) y todo el exceso está dentro de las fotos:
remuestreo de un derivado de 480/800 px frente al master de 1.250 reescalado por el
navegador; comprobado a ojo en galería y proyecto (ver `diff-png/`). Por eso la
captura sin fotos es la que decide desde F1.

## F2 · CSS: camino crítico

**Hecho**

- `scripts/lib/css.mjs` (nuevo, ~160 líneas, sin dependencias): tokenizador de CSS
  (reglas y bloques `@media/@supports` anidados), purga por página conservadora
  (`:not/:is/:where/:has`, atributos y pseudos nunca descartan; `@font-face`,
  `@keyframes` e `@import` se conservan) y unión de las 5 hojas del `<head>` en una,
  en el orden exacto que ya tenía (normalize → webflow → sitio → propias).
- Lista blanca de clases de runtime: `scripts/perf/clases-runtime.mjs` mide el
  `classList` antes/después de abrir menú, dropdowns (con hover), idioma, carruseles,
  FAQ, estimador, multipaso, envío vacío, 30 tabulaciones y lightbox en las 16
  plantillas × 375/1440, y le suma la lista cerrada de webflow.js (§0) y las clases
  que ponen los scripts propios (`grep classList.add|toggle`). 55 clases →
  `scripts/lib/clases-runtime.json`.
- Integrado en el barrido de `dist/` de `astro.config.mjs` (`unirCss`), con dos
  interruptores de entorno para medir: `PP_CSS=enlace|inline|no` y
  `PP_PURGA=webflow|todas`.

**Medido antes de decidir (5 plantillas móvil × 2)**

| | 5 hojas (F1) | 1 hoja `<link>`, purga Webflow | inline, purga Webflow | inline, purga total |
|---|---|---|---|---|
| CSS bloqueante | 41 KB gz / 5 peticiones | 17–21 KB gz / 1 | 0 peticiones (+12 KB gz de HTML) | 0 (+8–10 KB gz) |
| FCP móvil | 1,35 s | 1,20 s | 0,90–1,08 s | 0,90–1,05 s |
| `render-blocking-insight` | 450 ms | 150 ms | 0 | 0 |
| `unused-css-rules` | 12 KB | 15 KB | 12–14 KB | **0** |
| FAQ / servicio / ciudad / condado | 97 / 93 / 90 / 86 | 98 / 94 / 90 / 88 | 99 / 94 / 90 / 88 | 99 / 95 / 91 / 88 |

**Decisiones**

- **Inline, purga total.** Inline porque con la simulación móvil de Lighthouse cualquier
  petición bloqueante cuesta ≥ 150 ms de FCP, y el precio (8–10 KB gz por página, sin
  caché entre páginas) es asumible en un sitio de 217 páginas al que se llega desde
  buscadores. No hay FOUC posible: todo el CSS va en el documento, no se difiere nada.
- Purga también del CSS propio porque con solo Webflow quedaban 11–14 KB de reglas de
  blog, FAQ y menú en páginas que no las usan; la lista blanca medida + las clases
  de los scripts propios la cubren, y lo demuestran la sonda (menú, dropdown, hover,
  idioma, estimador, multipaso) y el diff visual, no la lista.
- Se descartó el «CSS crítico + resto diferido con `preload onload`»: exige elegir qué
  es crítico por plantilla (34), introduce un parpadeo real al llegar el resto y gana
  frente a inline-todo solo si la hoja fuera grande; con 8–10 KB gz no lo es.
- Las `url()` relativas del CSS de Webflow (`../images/…`) se absolutizan al moverlo
  de `/css/` al `<head>`: medido un 404 en `/services/images/…` en la primera prueba.
- `font-display: swap`, el único `preload` de `inter-latin.woff2` y los dos
  `@font-face` de `fuentes.css` quedan como estaban.

**Medido (mediana de 3, móvil; `02-f2/lighthouse-medianas.csv`)**

| Plantilla | F1 → F2 | LCP F1 → F2 | FCP |
|---|---|---|---|
| Home / Home ES | 93 / 92 → **95 / 95** | 3.262 → 2.960 · 3.299 → 3.002 | 1,35 → 0,9 s |
| Estimador | 95 → **97** | 2.960 → 2.658 | |
| FAQ | 97 → **99** | 2.555 → 2.201 | 1,05 s |
| Blog índice / categoría | 93 / 93 → **96 / 96** | 3.184 → 2.812 / 2.847 | |
| Producto / Proyecto / Servicio | 94 / 94 / 93 → **96 / 96 / 96** | 3.040 → 2.815 · 3.035 → 2.809 · 3.189 → 2.815 | |
| Ciudad / Condado | 90 / 86 → **92 / 89** | 3.677 → 3.377 · 4.127 → 3.753 | 0,9 s |
| Post / galería / índices / contacto | 96–98 (sin cambio significativo) | | |

Escritorio 99–100 en las 16. `render-blocking-insight` 0 ms y `unused-css-rules` 0 KB
en las 16 (objetivo < 5 KB). Servicio vuelve por encima del baseline (96 > 95): el
`eager` del hero se queda. Sonda: 0 regresiones funcionales (menú 67/67, dropdown y
hover 23/23); las únicas líneas del comparador son 1–3 mensajes más de Turnstile en
consola en las páginas de contacto a 1440, que varían de una carga a otra.

**Lo que el diff visual cazó (y por eso existe)**: la primera purga sacaba la versión
española con «Pedir Presupuesto» y «Cabañas De Aluminio» en mayúsculas (29,7 % de
diferencia y +71 px de alto en `/es/products/cabanas/` a 375). No era la purga: el
compactador quitaba el espacio antes de `:` y convertía `html[lang=es] :is(h1,…)`
(descendiente) en `html[lang=es]:is(h1,…)` (nunca casa). Corregido y recapturado antes
del commit. Las otras dos capturas marcadas (proyecto y categoría del blog) son las 87
filas del nav en estado «scroll» de IX2, como en F1.

**Puertas**: `check:marquee` contaba las clases del marquee también dentro del
`<style>` inline (11 copias en vez de 10, y el primer `data-pp-marquee` caía en el
CSS): la puerta ignora ahora los bloques `<style>`; el markup no cambió.

**Segunda regresión cazada por el diff**: el paso a paso del formulario de presupuesto
(«1 Proyecto · 2 · 3») salía como lista sin estilo en EN y ES a 375/768/1440 (+48–60 px
de alto, 11–27 % de diferencia). `Formulario.astro` inyecta ese bloque y sus clases
**al cargar**, así que no estaban ni en el HTML servido ni eran «nuevas» respecto al
DOM tras `load`: el recolector no las veía. Ahora compara también el DOM tras `load`
con el HTML crudo (62 clases en la lista blanca). Recapturado: 59/60 bajo el 1 %; la
restante es el nav en estado «scroll» (87 filas). Las medianas de Lighthouse de
`02-f2/` se midieron antes de estas dos correcciones (que añaden ~1 KB de CSS); la
comprobación posterior en home ES / ciudad / FAQ dio 95 / 91 / 98–100, igual que la
tanda, y F8 vuelve a medir las 16.
