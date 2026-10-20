# 03 — Sonda funcional de regresión (Playwright)

22 rutas × 320/375/768/1440 (`isMobile` + `hasTouch` por debajo de 768) + una pasada con `reducedMotion: reduce` en la home, por fase, sobre el build de producción simulada. Cada fila compara con la fase anterior (`sonda-regresiones.txt`). `scripts/perf/sonda.mjs`.

| Fase | Cargas | 200/404 ok | H1 único | Overflow 0 | `<main>` | Skip link (primer foco) | Menú móvil abre/foco/inert/Esc/foco-botón | Dropdown abre/aria/visible/hover/Esc | Lightbox abre/→/Esc/foco-vuelve | Paradas sin anillo | Sobredim. 375 / 1440 | Vídeo 8 s | Reduced motion | Consola | Regresiones vs anterior |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 00-baseline | 90 | 90 | 90 | 90 | 90 | 0 (0) | 67/67/67/67/67 de 67 | 23/23/23/23/23 de 23 | — | 34 | 9 / 125 | reproduce 8/8 | 375:parado 1440:parado | 56 | 0 |
| 01-f1 | 90 | 90 | 90 | 90 | 90 | 0 (0) | 67/67/67/67/67 de 67 | 23/23/23/23/23 de 23 | — | 4 | 0 / 0 | reproduce 8/8 | 375:parado 1440:parado | 55 | 0 |
| 02-f2 | 90 | 90 | 90 | 90 | 90 | 0 (0) | 67/67/67/67/67 de 67 | 23/23/23/23/23 de 23 | — | 4 | 0 / 0 | reproduce 8/8 | 375:parado 1440:parado | 53 | 2 (solo recuento de Turnstile en contacto) |
| 03-f3 | 10 | 10 | 10 | 10 | 10 | 0 (0) | 7/7/7/7/7 de 7 | 3/3/3/3/3 de 3 | — | 0 | 0 / 0 | reproduce 8/8 | 375:parado 1440:parado | 0 | 0 |
| 04-f4 | 8 | 8 | 8 | 8 | 8 | 8 (8) | 4/4/4/4/4 de 4 | 4/4/4/4/4 de 4 | — | 0 | 0 / 0 | reproduce 8/8 | - | 0 | 2 (solo recuento de Turnstile en contacto) |
| 05-f5 | 90 | 90 | 90 | 90 | 90 | 90 (90) | 67/67/67/67/67 de 67 | 23/23/23/23/23 de 23 | — | 0 | 0 / 0 | reproduce 8/8 | 375:parado 1440:parado | 56 | 0 |
| 06-f6 | 90 | 90 | 90 | 90 | 90 | 90 (90) | 67/67/67/67/67 de 67 | 23/23/23/23/23 de 23 | — | 0 | 0 / 0 | reproduce 8/8 | 375:parado 1440:parado | 56 | 1 (solo recuento de Turnstile en contacto) |
| 08-f8 | 90 | 90 | 90 | 90 | 90 | 90 (90) | 67/67/67/67/67 de 67 | 23/23/23/23/23 de 23 | — | 0 | 0 / 0 | reproduce 8/8 | 375:parado 1440:parado | 51 | 2 (solo recuento de Turnstile en contacto) |
| 09-f7 | 90 | 90 | 90 | 90 | 90 | 90 (90) | 66/66/66/66/66 de 66 | 23/23/23/23/23 de 23 | 24/24/24/24 de 24 | 0 | 0 / 0 | reproduce 8/8 | 375:parado 1440:parado | 30 | 6 |

Lecturas:

- **Baseline (00)**: sin enlace de salto (0/90), 1 parada sin anillo por ruta en la FAQ (`input.pp-faq-input`), 9 imágenes sobredimensionadas a 375 y 125 a 1440 (sin contar SVG), menú 67/67 y dropdown 23/23 ya con webflow.js.
- **Desde F1**: 0 sobredimensionadas a 375 y 1440 (a 768 quedan las 10 tarjetas de producto de la home: `product-card-image` es 2 columnas en la home y 1 en `/products/`, y el `sizes` compartido toma el mayor para no servir borroso el índice).
- **Desde F4**: enlace de salto en 90/90 y primer foco; 0 paradas sin anillo.
- **Consola**: los 53–56 mensajes son todos de la página de presupuesto y contacto a 1440: Turnstile (`No available adapters`, su propia CSP `data:,`, el error 600010 de `localhost`) y varían de una carga a otra. No hay ningún mensaje propio del sitio ni de la CSP de F6.
- **Hover del mega-menú**: 23/23 con ratón (IX2). Con teclado (`focoPreview`) 0/23 hasta F6: IX2 solo escuchaba `mouseover`. Desde F7 (CSS `:has(:focus)`) 23/23.
- **Lightbox (desde F7, columna nueva)**: en las 6 rutas con galería × 4 anchos, abre con la foto cargada, → cambia de foto y la tira marca la activa, Escape cierra, el foco vuelve al enlace y el resto del documento recupera `aria-hidden`/`tabindex`: 24/24. La misma sonda sobre el build de F8 con webflow.js (`09-f7/sonda-antes/`): 16/16 en 4 rutas salvo el foco de vuelta (0/16).
- **Filas cortas**: 03-f3 se midió solo en la home EN/ES (lo único que cambió: el vídeo); el JSON de 04-f4 es el de una pasada parcial posterior (4 rutas × 2 anchos) que pisó el de la pasada completa, cuyos valores quedaron en `05-A11Y-WCAG22.md` (90 cargas: salto 90/90, 0 paradas sin anillo, menú 67/67, dropdown 23/23). La pasada final (08-f8) vuelve a ser completa.
- **09-f7, columna «Regresiones»**: las 6 líneas son la carrera de `/contact-us/get-in-touch/@320` (el clic al menú llega mientras Turnstile desplaza la página; 4 campos `undefined`, 2/2 en verde al repetir la ruta sola) y dos recuentos de consola de Turnstile/OnceHub. Consola total 51 → 30 sin webflow.js.
- Lo que la sonda NO mide: lector de pantalla, el paso exacto de las flechas de los carruseles (`carrusel-qa`, a petición) y la reproducción real del vídeo fuera de Chromium.
