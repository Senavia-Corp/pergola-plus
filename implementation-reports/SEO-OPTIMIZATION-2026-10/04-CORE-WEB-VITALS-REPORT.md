# 04 — Core Web Vitals: causalidad y resultado

## Datos de campo

**NO DATA.** El dominio `www.pergolaplusflorida.com` sirve hoy el Webflow original, así que CrUX no tiene datos de ESTE sitio; `pergola-plus-preview.vercel.app` no alcanza el umbral de tráfico de CrUX. INP no se ha medido en campo y no se estima: el TBT de laboratorio (0–20 ms) no lo sustituye.

## Qué era el LCP y por qué tardaba (móvil)

Elemento LCP en todas las corridas: `<video>` del hero (`main > section.hero-video-main > div.background-video > video`), 412×484 px en el viewport móvil de Lighthouse. Lo que pinta es su fotograma de espera.

Causas medidas en el baseline (JSON de la auditoría + corridas locales):

1. **Descubrimiento tardío del fotograma.** Iba como `background-image` en línea (JPEG 1280×720, 199.782 B): el navegador no lo pide hasta aplicar estilos, y Lighthouse lo marcaba sin `fetchpriority`. → Ahora `poster` nativo AVIF (82.768 B) + `<link rel="preload" as="image" fetchpriority="high">` en el `<head>`.
2. **Camino crítico con un tercero.** jQuery desde `d3e54v103j8qbb.cloudfront.net` (DNS+TLS+31 KB) y `webflow.js` (70 KB) sin `defer`: Lighthouse móvil estimaba 1.920 ms de bloqueo, 1.073 de ellos jQuery. → jQuery local + `defer` en ambos. FCP local 2.255 → 1.353 ms (mediana de 3).
3. **Competencia por el ancho de banda durante la carga.** El MP4 de 9,2 MB empezaba a bajar en paralelo con el poster, las hojas y la fuente, y seis fotos de 2.135×1.406 (141–272 KB cada una) se pedían a 343 px. → el vídeo arranca al `load` (y en móvil la versión de 960 px); las fotos llevan `srcset` y bajan a 20–52 KB; la foto de cabanas del CMS pasa de 317 a 100 KB sin cambio visible.
4. **Fuentes duplicadas.** 4 ficheros Inter idénticos de 48.658 B en la home (300/400/500/700) → 1.

## Lo que queda y por qué (laboratorio local, móvil simulado)

Tras los cambios, el desglose del LCP que da Lighthouse es TTFB 2–4 ms, retraso de carga 5–9 ms, duración 6–7 ms y retraso de render 50–150 ms: el poster llega y se pinta enseguida en tiempo real. El valor **simulado** (~3,3 s, ver 03) lo fija el modelo Lantern: en su grafo pesimista entran todas las peticiones que terminaron antes del LCP real, y en un servidor local todo termina en milisegundos, así que las imágenes `loading="lazy"` del primer scroll (dentro del umbral de 1.250 px de Chrome) y el fondo CSS de la banda siguiente (85 KB) cuentan como si compitieran con el poster en 4G. Reducir esos bytes (hecho con `srcset` y la foto de cabanas) baja ese valor; lo que no se puede hacer sin tocar el diseño es que esas imágenes dejen de estar en el primer scroll.

Lo que NO se hizo y aún movería el LCP/FCP de laboratorio: CSS crítico en línea para ahorrar un viaje de red en el FCP (~300–500 ms simulados) y purgar las hojas de Webflow. Está en 09 como siguiente paso con su riesgo.

## CLS e INP

- CLS: 0 en todas las corridas después (0,012 antes). El `poster` reserva el mismo hueco que el `background-image`; las imágenes llevan `width/height` desde `img-dim.json`.
- INP: sin dato de campo. TBT 0–63 ms en laboratorio; el único JS en el hilo principal al cargar es webflow.js (IX2, navbar, dropdown) y los módulos propios (formularios, carrusel), todos diferidos.

## Antes/después (mediana de 3 corridas, misma máquina, mismo servidor, misma versión)

| Métrica móvil | Antes | Después | Δ |
|---|---:|---:|---:|
| Performance | 73 | 92 | +19 |
| FCP | 2.255 ms | 1.353 ms | −40 % |
| LCP (simulado) | 8.557 ms | ver 03 | — |
| CLS | 0,012 | 0 | — |
| TBT | 15 ms | 0 ms | — |
| Bytes transferidos (home) | ≈ 7,0 MB (MP4 5,2 MB + 6 fotos ≈ 1,5 MB + poster 200 KB + 4 fuentes) | ≈ 3,9–4,6 MB (MP4 móvil 3,1 MB tras `load` + fotos ≈ 220 KB + poster 83 KB + 1 fuente) | ≈ −40 % |

| Métrica escritorio | Antes | Después |
|---|---:|---:|
| Performance | 98 | 100 |
| FCP / LCP | 485 / 1.165 ms | 328 / 670 ms |
| CLS / TBT | 0 / 0 | 0 / 0 |

Las cifras completas, por corrida y por plantilla, en `03-BEFORE-AFTER-LIGHTHOUSE.csv`.
