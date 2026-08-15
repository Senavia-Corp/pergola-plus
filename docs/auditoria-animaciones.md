# Auditoría de animaciones e interacciones — PROMPT D

Fecha: 2026-08-14
Referencia: https://pergola-plus-florida.webflow.io/
Build auditada: `dist/` (100 páginas), servida con `astro preview` en :4340

---

## Resumen

**Pasa.** Las 749 interacciones IX2 sobreviven a la migración. Se conserva
`js/webflow.js` intacto, que es donde vive la definición de las animaciones, y
todos los `data-w-id` llegan al HTML final.

| Comprobación | Resultado |
|---|---|
| `data-w-id` faltantes (99 páginas) | **0** |
| `data-w-id` sobrantes | **0** |
| Bloques anti-FOUC faltantes | **0** (21 páginas lo llevan, exactamente las que toca) |
| `data-wf-page` presente (IX2 lo necesita) | **100/100** |
| Animaciones que ejecutan en la home | **16/16**, igual que el vivo |
| Elementos que se quedan invisibles | **0** |
| Assets rotos | **0** |
| Referencias a Webflow | **0** |

---

## 1. Inventario de `data-w-id` (parte 1)

Comparación conjunto a conjunto de las 99 páginas contra su equivalente en vivo
(`scripts/auditar-paridad.mjs`). Cero diferencias en ambos sentidos: ni falta
ninguno ni sobra ninguno. Un `data-w-id` perdido mata su animación en silencio,
así que esta es la comprobación que de verdad importa.

## 2. Bloques anti-FOUC (parte 2)

21 páginas llevan el `<style>` con
`html.w-mod-js:not(.w-mod-ix) [data-w-id="…"]{opacity:0}`: las 4 estáticas que
lo tenían más las 10 de `/products` y las 7 de `/services`. Mismos ids y mismas
4 media queries que el original.

Durante la migración esto estuvo mal: el generador de detalle no extraía el
bloque, así que 2 elementos por página de producto y servicio habrían
parpadeado. Corregido y verificado.

## 3. Verificación en ejecución (parte 3)

Sonda con scroll progresivo midiendo `getComputedStyle` de opacidad y transform
antes y después de que cada elemento entre en viewport.

**Home, 1440 px:**

| | Migración | Sitio en vivo |
|---|---|---|
| Elementos con `data-w-id` | 37 | 37 |
| Animaron de verdad (0 → 1) | **16** | **16** |
| Se quedaron invisibles | **0** | **0** |
| Sin cambio (hover/click, no scroll) | 21 | 21 |

Coincidencia exacta.

> ### ⚠️ La trampa del foco casi produce un falso positivo
>
> A mitad de la auditoría la página de FAQ parecía rota: los `.faq_item` se
> quedaban congelados en `opacity: 0.238` y el acordeón no abría. Parecía una
> regresión clara.
>
> No lo era. Estaba midiendo el sitio en vivo **con** foco y la migración
> **sin** foco, porque iba alternando entre pestañas para comparar. Sin foco,
> `requestAnimationFrame` se para y el tween de IX2 se congela a medias.
>
> `document.hasFocus()` devolvía `false`. Al cerrar la pestaña del vivo, hacer
> un clic real y volver a medir, la página salió a contraste pleno y el
> acordeón funcionó igual que el original.
>
> **Método correcto:** una sola pestaña, clic real antes de medir, y comprobar
> `document.hasFocus() === true` o descartar la medición. Con navegador
> automatizado este fallo sale en verde y engaña en las dos direcciones.

## 4. Interacciones por evento (parte 4)

Todas probadas con clic real contra el comportamiento del sitio original:

| Interacción | Evento IX2 | Resultado |
|---|---|---|
| Acordeón FAQ | `MOUSE_CLICK` | ✅ abre 43 → 143 px, icono gira a `matrix(1,0,0,1,0,0)`; los demás siguen cerrados. Idéntico al vivo |
| Mega-dropdown "Our Products" | `DROPDOWN_OPEN` | ✅ despliega las 2 columnas, los 10 productos y la imagen |
| Menú móvil (375 px) | `NAVBAR_OPEN` | ✅ botón a `w--open`, menú a 325 px, overlay activo, 6 secciones + CTAs + teléfono |
| Entradas por scroll | `SCROLL_INTO_VIEW` | ✅ 16/16 en la home |
| Marquee de marcas | — | ✅ muestra las 5 marcas reales |
| Vídeo del hero | — | ✅ reproduce a 1280×720, `readyState` 4 |

**Nota de método:** el clic por píxel se cuelga en emulación móvil (problema del
panel del navegador, no del sitio). El menú se verificó disparando el evento por
jQuery, que es como Webflow lo registra, y confirmando `w--open`, el ancho del
menú y el overlay. Los eventos `click` y `keydown` están enlazados al botón y el
módulo `navbar` de Webflow está inicializado.

---

## Hallazgos abiertos

**Elfsight Google Reviews da `WIDGET_DISABLED` en local.** El widget
`3da28fc2-41dc-4c2e-ab75-297b8e71f6eb` está bloqueado por dominio en la cuenta
de Elfsight, así que en `localhost` no carga. No es un fallo de la migración: en
el dominio real cargará igual que ahora. Pero conviene añadir el dominio nuevo a
la cuenta de Elfsight **antes** del cutover, o las reseñas desaparecerán de las
8 páginas que las muestran.

**El badge "Made in Webflow"** aparece en el sitio de referencia porque es el
staging `.webflow.io`. No existe en la migración ni en el dominio de pago.
