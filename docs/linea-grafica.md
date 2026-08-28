# Línea gráfica — Pergola Plus Florida

Extraída del CSS migrado el 28-ago-2026, no inventada. Cada valor de aquí está en
`public/css/pergola-plus-florida.webflow.css` y se puede comprobar.

**Para qué sirve este documento.** El CSS de Webflow se conserva **verbatim** —684 clases
y 749 interacciones IX2 que dependen de él— así que nadie puede «rediseñar» el sitio
tocando estilos. Lo que sí se puede es **componer secciones nuevas con el vocabulario que
ya existe**, y para eso hace falta saber cuál es. Eso es esto: el catálogo, no una
propuesta.

---

## 1. Color

Los seis tokens declarados en `:root`, con sus nombres reales (sí, `secundary` y
`terceary` van mal escritos en el CSS; se usan tal cual porque renombrarlos rompería 684
clases).

| Token | Valor | Qué es |
|---|---|---|
| `--primary` | `#3a545b` | Verde azulado oscuro. Es **el** color de la marca: nav, botones, fondos de sección oscura |
| `--secundary` | `#fffbf0` | Crema cálido. El fondo claro de la marca — **no** blanco puro |
| `--terceary` | `#61767c` | Verde azulado medio. Apoyo, estados, separadores |
| `--white` | `#fff` | Fondo de página y texto sobre `--primary` |
| `--gray` | `#f1f1f1` | Gris de bloques neutros |
| `--black` | `#000` | Reservado |
| *(texto)* | `#333` | Color de cuerpo, declarado en `body` — no es `--black` |

**Regla de ritmo:** las secciones alternan claro y oscuro. `intro-location` y
`gallery-section` van sobre `--primary`; `feature` y `section-faq-page` van sobre el fondo
claro. Una sección nueva **hereda el turno que le toque**: si va detrás de una oscura,
va clara. Dos oscuras seguidas rompen el ritmo de toda la página.

Sobre `--primary` el texto es `--white` y los iconos son las variantes `*-white.svg` de
`public/images/`.

---

## 2. Tipografía

**Inter**, autoalojada en `public/fonts/` (`inter-latin-400.woff2`, `-700.woff2`, ambas
con `<link rel="preload">` en el `<head>`). No hay segunda familia. No añadas ninguna.

| Elemento | Tamaño | Peso | Interlineado | Nota |
|---|---|---|---|---|
| `body` | 14px | 400 | 150% | Color `#333` |
| `h1` | 64px | 600 | 100% | **`text-transform: capitalize`** |
| `h2` | 40px | 600 | 120% | **`capitalize`** |
| `h3` | 20px | 500 | 130% | **`capitalize`** |
| `h4` | 18px | 500 | 24px | Sin capitalize |

**La trampa del `capitalize`.** Los H1–H3 pintan en mayúscula la inicial de **cada
palabra**, hagas lo que hagas en el HTML. Consecuencias que hay que tener presentes al
escribir copy:

- No escribas los títulos en Title Case a mano: se ve igual y ensucia el texto que leen
  el JSON-LD y los lectores de pantalla, que sí toman el original.
- Un título con una sigla o una unidad (`LED`, `20 ft`, `PVC`) sale bien porque
  `capitalize` no baja mayúsculas existentes — pero uno con un `y`/`and`/`de` sale
  `Y`/`And`/`De`. Si el título necesita minúsculas internas, hay que replantear el
  título, no pelearse con el CSS.
- El H1 del JSON-LD sale del texto del `<h1>`, no de lo pintado.

---

## 3. Retícula y espaciado

| Pieza | Valor |
|---|---|
| `.container` | `max-width: 1250px`, ancho 100% |
| `.w-layout-blockcontainer` | `max-width: 940px` — el contenedor **estrecho**, para texto largo |
| `--max-weight-hero-page` | `850px` — ancho máximo del bloque de texto del hero |
| Padding vertical de sección | **`8rem 2rem`** — es el ritmo del sitio, cópialo |
| Altura del hero de producto | `min-height: 100vh`, `padding-top: 85px` |

**El `padding-top: 85px` no es decorativo:** el nav es `position: fixed` y mide 85 px.
Toda sección que pueda quedar la primera necesita ese hueco o el nav le tapa el título.

---

## 4. Botones

Tres variantes, y no hacen falta más.

```html
<a href="…" class="button w-button">Get a Quote</a>                    <!-- primario  -->
<a href="…" class="button secundary w-button">Schedule A Visit</a>     <!-- secundario -->
<a href="…" class="button tertiary w-button">Explore Our Work</a>      <!-- sobre foto -->
```

| Variante | Fondo | Texto | Borde |
|---|---|---|---|
| `.button` | `--primary` | `--white` | — |
| `.button.secundary` | `--white` | `--primary` | `1px solid --primary` |
| `.button.tertiary` | — | — | `box-shadow: 0 0 0 1px #fff` (para ir sobre imagen) |

`border-radius: 4px`, `padding: 0 20px`, `transition: all .25s`, `text-transform: capitalize`.

**Jerarquía de CTA en una página:** un solo primario por pantalla. El par canónico del
sitio es **`Get a Quote` (primario) + `Schedule A Visit` (secundario)**, en ese orden.

---

## 5. Formas

- **Radios:** el sitio usa `4px` en botones, `10px`/`15px`/`20px` en tarjetas e imágenes,
  y `100%` en pastillas e iconos redondos. **No introduzcas radios nuevos.**
- **Sombras:** son deliberadamente discretas — `0 1px 2px #0003`, `0 0 5px #0003`,
  `0 -2px 5px #0003`. Este sitio separa por **color de fondo y espacio**, no por sombra.
  Si una sección nueva necesita una sombra fuerte para leerse, el problema es el contraste,
  no la sombra.

---

## 6. Breakpoints

`479` · `767` · `991` · `1440` · `1920` (los de Webflow). Cualquier media query nueva
tiene que caer en uno de esos cinco o el layout se desincroniza del resto del sitio.

Trampa medida en este repo: con `aspect-ratio` y la altura ya definida, el navegador
calcula el **ancho** y desborda la columna. Si usas `aspect-ratio`, deja la altura en
`auto`.

---

## 7. Vocabulario compositivo

Los componentes que existen y hay que reutilizar. **Antes de escribir markup nuevo,
comprueba si uno de estos hace el trabajo.**

### `intro-location` — dos columnas, imagen + texto + bullets
**Es el patrón de la referencia que pidió el cliente** (imagen a un lado; al otro H2,
párrafo y lista de bullets con icono). Ya existe, ya está animado y ya es responsive.

```
section.intro-location  (fondo --primary, padding 8rem 2rem)
└ .container
  └ .wrapper-intro-city
    ├ .intro-column-left   [data-w-id]  → img.intro-img-city
    └ .intro-column-right  [data-w-id]  → h2 + div + ul.list-item-about
                                            └ li.list-item-about-page
                                               → img.icon-intro + .intro-links
```

**Para invertir las columnas** (imagen a la derecha) basta con el orden en el DOM;
`wrapper-intro-city` es flex.

**Los `data-w-id` se pueden reutilizar tal cual.** Son los mismos en las 10 fichas —el CSS
los selecciona por atributo, no por unicidad— así que clonar el bloque hereda la animación
de entrada gratis. Es el camino correcto: un bloque nuevo **sin** `data-w-id` entra sin
animar y canta al lado de los demás.

### `feature` — rejilla de 6 características
`.item-feature` → `.block-heading-feature` (h3 + `.line-feature-vertical` /
`.line-feature-landscape`, el icono «+») → `.content-feature` → `.text-feature`.

### `card-services` — tarjeta de servicio
`.card-services` → `.car-content-services` → `.card-header-services` (`img.icon-services`
+ `h3.title-card-services`) + `.text-card-services` + `.services-action` (botón) +
`img.cover-services` de fondo.

### `faq_item` — acordeón
`.faq_item` → `.faq_trigger` (`.faq_question` + `.faq_icon`) → `.faq_content` →
`.faq_answer`. El script del acordeón viaja en el propio fragmento.

### `blog-card`, `item-color`, `step-content-title`
Tarjeta de post, muestra de color/textura y paso del proceso «How We Build It».

---

## 8. Fotografía

El sitio es de un contratista de gama alta y sus fotos son **obra propia**: exteriores
reales del sur de Florida, luz de día, casas terminadas y habitadas. Eso define el listón:

- **Sin stock genérico.** Una foto que podría ser de cualquier sitio del mundo no vale.
- **Sin render** presentado como obra. Si algo es un render, se dice.
- **Sin gente identificable** salvo autorización.
- Formato **AVIF**, `loading="lazy"`, `width`/`height` inyectados automáticamente por
  `dimensionarHtml()` sobre `dist/`. No los pongas a mano.
- **Todas las rutas deben estar versionadas en git**, no solo existir en disco:
  `check:imagenes` lo comprueba con `git ls-files` porque Vercel construye desde un clon.
- El `alt` es contenido, no relleno: describe la obra, no el producto en abstracto. Y en
  `/es/` necesita traducción propia — `comprobar-i18n.mjs` **no mira atributos**.

**Aviso sobre los nombres de archivo:** mienten sobre el encuadre. Un
`hero-…-pergola.avif` puede ser un plano cerrado inservible para un hero. Hay que abrir
las imágenes antes de elegirlas.

---

## 9. Movimiento

Las 110 entradas por scroll de IX2 están migradas a CSS scroll-driven y `webflow.js` está
parcheado para no volver a ejecutarlas. Reglas:

- **No añadas ClientRouter / View Transitions.** `webflow.js` se inicializa una vez por
  documento y las 749 interacciones morirían a partir de la segunda página. Está anotado
  en `astro.config.mjs`.
- Todo elemento con animación de entrada lleva su bloque anti-FOUC. **Un elemento que
  pierde su `data-w-id` se queda en `opacity: 0` para siempre**, sin error y sin hueco.
- Con `view()`, la duración se ignora: manda `animation-range`.
- Respeta `prefers-reduced-motion`.

---

## 10. Cómo usar esto

1. **Componer, no inventar.** Si una sección nueva no se puede montar con §7, primero
   revisa si es que la sección está mal planteada.
2. **Clases nuevas: mínimas y con prefijo `pp-`.** Ya hay precedente (`pp-faq-puente`,
   `pp-faq-img`). Van en el `<style>` del componente Astro, nunca en el CSS de Webflow —
   ese fichero solo se toca por `scripts/parchear-css.mjs`, y hoy toca **una** línea.
3. **Nada de dependencias nuevas.** Ni framework de UI, ni librería de iconos, ni CDN:
   los iconos son SVG en `public/images/`.
4. **Cuidado con `<style>` en Astro:** es raw-text. Un comentario truncado que abra un
   `<style>` se traga cientos de líneas sin dar error.
