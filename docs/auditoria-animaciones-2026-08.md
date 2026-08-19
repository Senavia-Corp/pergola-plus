# Rediseño de las entradas por scroll

Fecha: 2026-08-19
Build auditada: `.vercel/output/static` (211 páginas), servida en local
Medición en vivo: Chromium 151 con ventana real y foco verificado

Continúa [auditoria-animaciones.md](auditoria-animaciones.md), que auditó la migración
de las interacciones IX2. Aquí se sustituyen.

---

## Resumen

Las 110 entradas por scroll pasan de JavaScript (IX2, sobre `requestAnimationFrame`) a
CSS nativo con `animation-timeline: view()`. Las otras 90 interacciones de IX2 —nav,
hover, acordeón de FAQ, desplegables— se quedan como estaban.

| | Antes | Después |
|---|---|---|
| Motor de las entradas | IX2 sobre rAF | CSS `animation-timeline: view()` |
| Duración | 1000 ms | 300 ms (solo gobierna el respaldo, ver §4) |
| Espera antes de arrancar | 450 ms en 104 de 110 | 0 |
| Tiempo total percibido | **1450 ms** | ~300 ms |
| Recorrido | 100 px (`slideIn*`) | 16 px vertical · 24 px lateral |
| Escala | 0,75 → 1 en 73 de 110 | ninguna |
| Vocabularios | 5, sin regla | 1, con la regla escrita en el CSS |
| Elementos que cambian de gesto a 992 px | 20 | 0 |
| Animado por encima del pliegue | 9 elementos, incl. la barra de navegación | 0 |
| `prefers-reduced-motion` | **ignorado** | respetado |
| Elementos que se quedan invisibles | 0 | 0 |

---

## 1. El diagnóstico del encargo era incorrecto en dos de sus tres puntos

Medido sobre `public/js/webflow.js` antes de tocarlo.

| Afirmación del encargo | Lo medido | Veredicto |
|---|---|---|
| «`easeInOut` en 56 tweens hace que pesen» | Los 110 reveals usan `outQuart`. Los 54 `easeInOut` son de las listas `a-*`: nav, hover y acordeón | **Falso** |
| «500 ms es largo para un reveal» | Los reveals duran **1000 ms**. Los 64 `duration:500` son también nav/hover/acordeón | **Falso, y al revés: era el doble** |
| «Direcciones incoherentes, 5 vocabularios» | Cierto | **Cierto, y peor** |

La causa real de «se ven pesadas» no era la curva: era **`delay: 450` en 104 de los 110
eventos**, seguido de 1000 ms de animación. 1450 ms desde que el elemento cruza el
umbral hasta que se asienta.

Y la incoherencia es más literal de lo que decía el encargo: **20 de los 66 elementos
tenían dos eventos**, uno con `mediaQueries:["main"]` y otro con
`["medium","small","tiny"]`. El mismo bloque entraba deslizándose desde la izquierda en
escritorio y con un pop de escala en móvil.

### Reproducirlo

```bash
python3 -c "
import re,pathlib,collections
w=pathlib.Path('public/js/webflow.js').read_text(errors='ignore')
print(dict(collections.Counter(re.findall(r'eventTypeId:\"([A-Z_]+)\"',w))))"
```

---

## 2. Inventario

- **200 registros** de evento IX2. 110 son `SCROLL_INTO_VIEW`; los otros 90 son nav
  (`PAGE_SCROLL_UP`/`DOWN`, 24+24), hover (`MOUSE_OVER`/`OUT`, 18+18) y acordeón
  (`MOUSE_CLICK`/`MOUSE_SECOND_CLICK`, 3+3).
- Presets: `growIn` 73 · `slideInLeft` 22 · `slideInRight` 7 · `slideInBottom` 6 ·
  `slideInTop` 1 · `jiggle` 1.
- Objetivos: **66 data-w-id** y **20 selectores de clase**. De los 66, **14 son
  huérfanos**: no aparecen en ninguna de las 211 páginas. `.service-steps-content`
  tampoco tiene ni una instancia.
- Los **11 ids con bloque anti-FOUC** son objetivos de una entrada. Los **12 con
  `style="opacity:0"` en línea**, también. El anti-FOUC existía solo para esto.

---

## 3. Las dos colisiones que no se ven mirando los eventos

Una animación CSS con `animation-fill-mode: both` se resuelve **por encima** del
`element.style` que escribe IX2. Así que animar un elemento que IX2 siga gobernando lo
deja clavado, sin un solo error en consola.

Comparar objetivos de *evento* no las encuentra: están en los objetivos de *acción*,
dentro de las listas `a-*`.

| Elemento | Lo sigue gobernando | Qué le escribe |
|---|---|---|
| `.menu` (`2d27e00a…df62`) | `a-27`/`a-28`, los 48 eventos `PAGE_SCROLL_*` | `transform` y `opacity`, para esconder el nav al bajar |
| `.feature-card` | `a-23`/`a-24`, el acordeón de `.feature-header-item` | `opacity`, al abrir y cerrar |

Los dos están excluidos. `.menu` además es `position: sticky`, y un `transform` crea
bloque contenedor y se carga el sticky — el mismo motivo por el que
`auditar-paridad.mjs` ya declaraba `.blog-filter-section` sin entrada.

---

## 4. Dos cosas que no son obvias y que decidieron la forma del CSS

Medidas en Chromium 151 sobre una página de prueba.

**`animation-duration` no gobierna nada cuando hay scroll-timeline.** Con el mismo
`animation-range`, duraciones de 0,3 s / 2 s / 10 s dan las tres `opacity: 0.250` en la
misma posición de scroll. Quien manda es `animation-range`. La duración gobierna **solo
el camino de respaldo** (navegadores sin `animation-timeline`, donde la animación corre
una vez al cargar). Por eso el CSS declara las dos cosas y las dos son correctas.

**Por eso el escalonado va con `animation-range-start`, no con `animation-delay`.** El
delay también escalona, pero se mide *contra* la duración: un delay de 1 s sobre una
animación de 0,3 s se sale del rango. Atarlo al token del respaldo es pedir que se
rompa el día que alguien lo toque. (El encargo pedía `animation-delay`; no habría
funcionado como esperaba.)

---

## 5. El fallo que encontró la medición en vivo

Con el rango `entry 0% cover 25%` —el que usaba el blog— **el pie se quedaba a medio
encender en las 211 páginas**:

| Elemento | Opacidad al final del scroll |
|---|---|
| `.wrapper-bar-footer` | 0,35 |
| `.line-footer` | 0,46 |
| `.div-block-7` | 0,80 |

Un elemento pegado al final del documento nunca llega al final de su fase `cover`: el
scroll se acaba antes. No da error, no mueve el layout — el pie simplemente se ve
lavado en todo el sitio.

Con `entry 0% entry 60%` los tres cierran en 1,00. Medido también con
`entry 0% entry 100%` y `entry 10% entry 70%`: los tres rangos terminados en `entry`
lo arreglan; el terminado en `cover` es el único roto.

**El otro fallo, cazado en la misma pasada:** al apagar IX2, `.hero-block-video` se
quedó invisible para siempre en la home. Llevaba `style="opacity:0"` en línea y era IX2
quien lo encendía. Es exactamente la mina que el encargo describía, y por eso las tres
retiradas (eventos IX2, anti-FOUC, `opacity:0` en línea) tienen que ir juntas.

---

## 6. La regla nueva

Escrita en `src/styles/animaciones.css`, y la tabla en `scripts/lib/reveals.mjs`.

1. **Por defecto se sube**, 16 px. Es lo que reciben 30 elementos y las 18 clases.
2. **Lateral solo en los 5 pares que el layout justifica** —medidos lado a lado a
   1440 px— y **solo a partir de 992 px**. Por debajo se apilan y caen a la subida.
3. **Escala en ninguno.** Era el gesto de 73 de 110 y la razón de que todo se sintiera
   igual.
4. **Escalonado por columna** con `animation-range-start`, 4 pasos y vuelta a empezar.
   El tope importa: `.product-card` llega a 60 por página.
5. **Nada por encima del pliegue.**
6. **Una sola duración, un solo recorrido, una sola curva**, en tokens de `:root`.

### Ganancia colateral: `prefers-reduced-motion`

IX2 solo respeta la preferencia si el `<body>` lleva `data-wf-ix-vacation`, y ese
atributo no está en ninguna de las 211 páginas. O sea que **las 110 entradas se
reproducían igual para quien había pedido menos movimiento**;
`src/styles/accesibilidad.css` lo decía en voz alta y renunciaba a arreglarlo. El
sistema nuevo vive entero dentro de `@media (prefers-reduced-motion: no-preference)`.

---

## 7. Verificación

**Puerta nueva:** `npm run check:animaciones` — 31 afirmaciones estáticas sobre el
build. **Probada rompiéndola:** 14 roturas a propósito, cada una vista en rojo antes de
revertirla. Tres de ellas encontraron un fallo *en la puerta*:

- `.menu` se vigilaba solo por su `data-w-id`, así que `.menu{animation-name:…}` se
  colaba.
- El rango se comprobaba buscando `entry`, y `entry cover 25%` lo contiene.
- El escalonado se daba por bueno con un peldaño de tres.

**Medición en vivo:** `npm run auditar:animaciones` — 17 arquetipos (12 EN + 5 ES) × 4
anchos = **68 mediciones válidas, 0 abortadas por foco, 0 avisos**. Cada medición
comprueba `document.hasFocus()`, `document.hidden` y un contador real de fotogramas
antes de fiarse de nada, y aborta en vez de degradar a un informe parcial.

**Barrido de las 211:** 0 desviaciones. Ni un `opacity:0` en línea, ni un bloque
anti-FOUC, ni una página sin entradas.

**Paridad:** `data-w-id` faltantes 0, sobrantes 0. El parche es a nivel de datos de
IX2 y el etiquetado es por CSS sobre los `data-w-id` que ya estaban, así que no se ha
tocado ni un fragmento migrado por este cambio.

---

## Lo que queda fuera

Quitar `webflow.js` (338 KB) y jQuery (90 KB) del todo y reimplementar nav,
desplegables, acordeón y hover. Es la ganancia grande de rendimiento que queda en la
mesa, pero es otro encargo: son 90 interacciones y 211 páginas que verificar.
