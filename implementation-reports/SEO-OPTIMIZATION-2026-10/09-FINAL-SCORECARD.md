# 09 — Scorecard final

Fecha: 18-oct-2026 · Checkout local `main` (ver `git log` desde `6ab769b`) · **Nada desplegado.**

## Resultado frente a metas

| Meta | Resultado real | Estado |
|---|---|---|
| Lighthouse 100/100/100/100 móvil y escritorio en todas las plantillas | **Escritorio:** Performance 100 en home EN/ES, producto, servicio, post, formulario; 97 ciudad; 98 índice del blog. A11y/BP/SEO 100 (BP 96 solo en el formulario por el error de Turnstile en `localhost`). **Móvil:** Performance 89–98 según plantilla (mediana home 92–95), A11y 100 en 6 de 8 plantillas y 97 en home y servicio (artefacto de la animación de entrada, ver 07 §5), BP 100 (96 formulario), SEO 100 en el build de producción. | **PARCIAL** — 100 reproducible en escritorio en 6 de 8 plantillas; móvil no llega a 100 en Performance y se dice por qué |
| LCP p75 ≤ 2,5 s en campo | Sin datos de campo (el dominio sirve Webflow). Laboratorio móvil simulado: 2,5–3,8 s según plantilla y corrida (antes 4,6 s en Vercel y 6,0–8,6 s en local) | **NO DATA** campo / mejorado en laboratorio |
| CLS ≤ 0,10 · INP ≤ 200 ms | CLS 0 en todas las corridas finales (formulario 0,05 → 0). INP sin dato; TBT 0–30 ms | PASS (lab) / NO DATA (INP) |
| Indexabilidad solo en el dominio autorizado | El código la cumple en ambos modos (puertas y crawl en verde). **El deploy real no**: `pergola-plus-preview.vercel.app` es indexable con `PUBLIC_ES_PRODUCCION=1` en production | **BLOCKED** — decisión y autorización (08, 10) |
| Cobertura de todas las plantillas EN/ES | 217 páginas construidas e inventariadas una a una (05): 109 EN + 108 ES, 213 indexables en sitemap, 4 `noindex` a propósito, 0 FAIL | PASS |
| Experiencia premium intacta | Vídeo del hero, menú, dropdowns, formularios, carruseles y animaciones verificados con sonda y diff visual (07); cambios visibles: ninguno de layout | PASS |
| Sin datos comerciales inventados | Ningún texto, precio, reseña, licencia ni proyecto nuevo. Lo que falta está en 11 | PASS |

## Lighthouse por plantilla — build de producción simulada, local (Lighthouse 13.5.0, Chrome headless sin extensiones, throttling simulado)

`prod-*` = primera medición de la fase; `prod2-*`/`prod3-*` = tras arreglar la portada lazy de las fichas (ciudad/producto/servicio) y el índice del blog / formulario. Las cifras completas, por corrida, en `03-BEFORE-AFTER-LIGHTHOUSE.csv`.

| Plantilla | URL | Dispositivo | Runs | Performance (runs → mediana) | A11y | BP | SEO | FCP ms | LCP ms (runs → mediana) | CLS | TBT ms |
|---|---|---|---:|---|---:|---:|---:|---:|---|---:|---:|
| blog-indice (prod-blog) | /resources/blog/ | desktop | 1 | 98 → **98** (±0) | 100 | 100 | 92 | 326 | 1186 → 1186 | 0.000 | 0 |
| blog-indice (prod-blog) | /resources/blog/ | mobile | 2 | 77/77 → **77** (±0) | 97 | 100 | 92 | 1353 | 6605/6604 → 6605 | 0.000 | 0 |
| blog-indice (prod3-blog) | /resources/blog/ | mobile | 2 | 91/91 → **91** (±0) | 100 | 100 | 100 | 1353 | 3455/3455 → 3455 | 0.000 | 0 |
| ciudad (prod-ciudad) | /pergolas-contractors/miami-pergola-experts/ | desktop | 1 | 100 → **100** (±0) | 100 | 100 | 100 | 323 | 614 → 614 | 0.000 | 0 |
| ciudad (prod2-ciudad) | /pergolas-contractors/miami-pergola-experts/ | desktop | 1 | 97 → **97** (±0) | 100 | 100 | 100 | 326 | 1325 → 1325 | 0.000 | 0 |
| ciudad (prod-ciudad) | /pergolas-contractors/miami-pergola-experts/ | mobile | 2 | 75/95 → **95** (±20) | 100 | 100 | 100 | 1924 | 7583/2965 → 7583 | 0.000 | 27 |
| ciudad (prod2-ciudad) | /pergolas-contractors/miami-pergola-experts/ | mobile | 3 | 90/89/89 → **89** (±1) | 100 | 100 | 100 | 1353 | 3606/3680/3680 → 3680 | 0.000 | 10 |
| formulario-presupuesto (prod-quote) | /contact-us/get-a-quote/ | desktop | 1 | 100 → **100** (±0) | 100 | 96 | 100 | 283 | 606 → 606 | 0.000 | 0 |
| formulario-presupuesto (prod-quote) | /contact-us/get-a-quote/ | mobile | 2 | 97/97 → **97** (±0) | 100 | 96 | 100 | 1203 | 2590/2439 → 2590 | 0.050 | 0 |
| formulario-presupuesto (prod3-quote) | /contact-us/get-a-quote/ | mobile | 2 | 98/97 → **98** (±1) | 100 | 96 | 100 | 1202 | 2435/2464 → 2464 | 0.000 | 6 |
| home (prod-home) | / | desktop | 3 | 100/100/100 → **100** (±0) | 100 | 100 | 100 | 324 | 717/657/655 → 657 | 0.000 | 0 |
| home (prod-home) | / | mobile | 3 | 92/92/92 → **92** (±0) | 97 | 100 | 100 | 1353 | 3296/3293/3294 → 3294 | 0.000 | 8 |
| home (prod2-home) | / | mobile | 2 | 87/92 → **92** (±5) | 97 | 100 | 100 | 1933 | 3816/3294 → 3816 | 0.000 | 30 |
| home-es (prod-es-home) | /es/ | desktop | 1 | 100 → **100** (±0) | 100 | 100 | 100 | 323 | 655 → 655 | 0.000 | 0 |
| home-es (prod-es-home) | /es/ | mobile | 2 | 92/93 → **93** (±1) | 100 | 100 | 100 | 1353 | 3303/3246 → 3303 | 0.000 | 12 |
| home-es (prod2-es-home) | /es/ | mobile | 2 | 93/93 → **93** (±0) | 100 | 100 | 100 | 1353 | 3263/3263 → 3263 | 0.000 | 10 |
| post (prod-post) | /post/hoa-rules-pergolas-south-florida/ | desktop | 1 | 100 → **100** (±0) | 100 | 100 | 100 | 285 | 684 → 684 | 0.000 | 0 |
| post (prod-post) | /post/hoa-rules-pergolas-south-florida/ | mobile | 2 | 91/90 → **91** (±1) | 100 | 100 | 100 | 1203 | 3529/3604 → 3604 | 0.000 | 15 |
| producto (prod-producto) | /products/cabanas/ | desktop | 1 | 100 → **100** (±0) | 100 | 100 | 100 | 469 | 744 → 744 | 0.000 | 0 |
| producto (prod-producto) | /products/cabanas/ | mobile | 2 | 95/90 → **95** (±5) | 100 | 100 | 100 | 1922 | 2893/3456 → 3456 | 0.000 | 26 |
| producto (prod2-producto) | /products/cabanas/ | mobile | 2 | 94/94 → **94** (±0) | 100 | 100 | 100 | 1353 | 3044/3042 → 3044 | 0.000 | 0 |
| servicio (prod-servicio) | /services/pavers/ | desktop | 1 | 100 → **100** (±0) | 100 | 100 | 100 | 324 | 658 → 658 | 0.000 | 0 |
| servicio (prod-servicio) | /services/pavers/ | mobile | 2 | 93/93 → **93** (±0) | 97 | 100 | 100 | 1353 | 3191/3191 → 3191 | 0.000 | 0 |
| servicio (prod2-servicio) | /services/pavers/ | mobile | 2 | 95/95 → **95** (±0) | 97 | 100 | 100 | 1354 | 2967/2968 → 2968 | 0.000 | 0 |

Home antes/después (preview, misma máquina):

| Fase | Dispositivo | Runs | Performance | A11y | BP | SEO | FCP ms | LCP ms mediana | CLS | TBT ms |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|
| after-home | desktop | 3 | 100/100/100 → **100** | 100 | 100 | 69 | 328 | 670 | 0.000 | 0 |
| after-home | mobile | 3 | 92/92/92 → **92** | 97 | 100 | 69 | 1373 | 3304 | 0.000 | 9 |
| after2-home | mobile | 3 | 95/90/92 → **92** | 97 | 100 | 69 | 1376 | 3304 | 0.000 | 0 |
| after3-home | mobile | 3 | 88/92/92 → **92** | 97 | 100 | 69 | 1353 | 3305 | 0.000 | 0 |
| after4-home | mobile | 3 | 97/95/93 → **95** | 97 | 100 | 69 | 1353 | 2902 | 0.000 | 0 |
| baseline-home | desktop | 3 | 98/98/98 → **98** | 100 | 100 | 69 | 485 | 1165 | 0.000 | 0 |
| baseline-home | mobile | 3 | 76/73/73 → **73** | 97 | 100 | 69 | 2255 | 8557 | 0.012 | 15 |
| prod2-home | mobile | 2 | 87/92 → **92** | 97 | 100 | 100 | 1933 | 3816 | 0.000 | 30 |

Lectura: la variación entre corridas es de 0–5 puntos salvo en `prod-ciudad` (75/95, un run con la imagen LCP lazy que pasó a 89–90 estables tras el arreglo) y `prod2-home` (87/92: un run con FCP 1,9 s por un hipo del servidor local). La A11y 97 de home y servicio en móvil es `color-contrast` en tarjetas a medio fundido por la animación de entrada (07 §5): 100 en escritorio y 100 en las otras seis plantillas.

## Por qué no es 100 en móvil, con números

- **FCP 1,35 s** (puntuación 0,97–0,99): es HTML + 5 hojas CSS en paralelo bajo 4G simulado con 150 ms de RTT. Solo baja con CSS crítico en línea (ahorra un viaje), no hecho por riesgo de regresión en 217 páginas.
- **LCP 2,5–3,8 s simulado** (puntuación 0,6–0,9): el poster/portada ya llega en milisegundos con prioridad alta; lo que el modelo Lantern añade es el ancho de banda que consumen las imágenes del primer scroll (lazy pero dentro del umbral de Chrome) y el fondo CSS de la banda siguiente. Se redujo (fotos del cliente ×5 más pequeñas, cabanas y destacado del blog ×3 más pequeños, vídeo fuera de la carga inicial); lo que queda son imágenes que están realmente en pantalla al poco de bajar.
- **Formulario BP 96**: `TurnstileError 600010`, el sitekey no admite `localhost`. En el dominio autorizado desaparece; no es corregible desde el código.

## Cobertura comprobada

| | |
|---|---|
| Páginas construidas / inventariadas | 217 / 217 (05) |
| Canonical absoluta y coincidente · H1 único · `og:image` · JSON-LD que parsea | 217 / 217 / 217 / 217 |
| Con JSON-LD de entidad o contenido | 214 (los 3 sin él son `404`, `thank-you` EN/ES, a propósito) |
| Pares hreflang EN↔ES recíprocos | 214 páginas en pares recíprocos; 3 sin par (`/404/`, `/es/404/`, `/articles/terms-of-service/` sin traducción) |
| Sitemap (producción) | 213 URL, 42 con `lastmod` real, alternates EN/ES; sin `noindex`, 404, thank-you ni `/api/` |
| Títulos > 65 caracteres | 48 (47 del CMS, avisados por `check:seo`, no fallados: decisión editorial del cliente) |
| Descriptions > 160 | 3 (2 condados, 1 proyecto; del CMS) |
| Puertas `check:*` | 18/18 en verde en modo preview y en producción simulada; `check:generadores` ver 07 §7 |
| Lighthouse | 31 combinaciones URL×dispositivo×fase, 60 corridas en total |

## Problemas remanentes y bloqueantes

| # | Qué | Quién / qué hace falta | Ref |
|---|---|---|---|
| 1 | Deploy real indexable en `*.vercel.app` mientras el dominio sirve Webflow | Decisión A/B + cambio de variables en Vercel (autorización) | 08, 10 |
| 2 | Sin canal de leads ni Turnstile en production | SMTP/webhook + `TURNSTILE_SECRET_KEY` en Vercel | 08, 11 |
| 3 | Datos de campo (CrUX/GSC) inexistentes | Lanzamiento en el dominio real + GSC | 11 |
| 4 | Contenido local de las 25 ciudades ≈ 75 % plantilla | Datos verificados del cliente | 06, 11 |
| 5 | A11y 97 móvil por el fundido de entrada | Decisión de diseño de movimiento (acortar rango o quitar fundido a tarjetas con texto) | 07 §5 |
| 6 | CSS crítico / purga del CSS de Webflow | Siguiente iteración de rendimiento, con diff visual de las 217 páginas | 01, 04 |
| 7 | `/pergolas-contractors/coral-springs-installation/` con portada placeholder; `terms-of-service` sin español; 174 imágenes del CMS huérfanas (28 MB) | Cliente | 11 |

## Qué puede fusionarse y qué no

- **Fusionable ya** (todo lo del commit): no cambia el comportamiento de indexación en ningún entorno más que hacer el preview rastreable-con-noindex; el resto es rendimiento, metadatos y privacidad de logs, verificado con puertas, sonda y Lighthouse.
- **NO desplegar como «producción indexable»** hasta cerrar el bloqueante 1: con la configuración actual de Vercel, cualquier push publica otra copia indexable en `*.vercel.app`. Hacer el push es seguro para la copia que ya existe (no empeora nada), pero no la arregla.

## Adenda — medido en Vercel tras el despliegue (18-oct-2026, commit `7738767`)

Push a `main` autorizado por el cliente; Vercel construyó y sirvió el nuevo build en `https://pergola-plus-preview.vercel.app`. Verificado por HTTP: póster y preload del LCP, jQuery local con `defer`, una sola fuente, `og:image` absoluta, `srcset` en fotos y portadas, 301 de `/products/sukkha`. Lighthouse 13.5.0 sobre la URL real, Chrome sin extensiones:

| URL | Dispositivo | Runs | Performance | A11y | BP | SEO | FCP ms | LCP ms | CLS |
|---|---|---:|---|---:|---:|---:|---:|---|---:|
| `/` | móvil | 3 | 99/92/94 → **94** | 97 | 100 | 100 | 1.274 | 2.016/2.614/2.965 → 2.614 | 0 |
| `/` | escritorio | 2 | 100/100 → **100** | 100 | 100 | 100 | 460 | 670/598 → 670 | 0 |
| `/pergolas-contractors/miami-pergola-experts/` | móvil | 2 | 92/99 → **99** | — | — | — | — | 2.864/2.019 | — |

Frente a la auditoría original sobre la misma URL (móvil 78, LCP 4,6 s; escritorio 90, LCP 1,1 s): móvil +16 puntos y LCP −2,0 s en la mediana; escritorio 100/100/100/100 en las dos corridas.

**El bloqueante 1 sigue abierto:** la URL `*.vercel.app` continúa indexable (robots `Allow`, sitemap, sin `noindex`) porque las variables de production del proyecto no han cambiado. El código desplegado no lo empeora ni lo arregla; requiere la decisión A/B de 10.
