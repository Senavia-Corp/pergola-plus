# SEO técnico de la sección de blog

Todo lo de aquí está comprobado **sobre `dist/`**, después de `npm run build`. El
proyecto tiene una regla dura al respecto: `npm run dev` no hornea `width`/`height`, así
que las medidas tomadas ahí mienten.

---

## Canónicas

| | |
|---|---|
| Una canónica por página | ✅ 217/217 (`check:seo`) |
| Absolutas | ✅ |
| Autorreferenciales (ninguna apunta a otra ruta) | ✅ |
| `/es/post/<slug>` canoniza a sí misma, **no** a la inglesa | ✅ |

Lo último importa y es fácil de romper: canonicalizar el español al inglés le diría a
Google que la versión española es un duplicado y no debe servirse. El sitio no lo hace.

## hreflang

| | |
|---|---|
| Ningún `hreflang` solitario | ✅ |
| Todo par recíproco | ✅ |
| Ninguno apunta a una página que no existe | ✅ |
| Ninguno declara un idioma distinto del de la URL destino | ✅ |
| Cobertura en el blog | 21 de 21 artículos |

El mapa de traducciones es **explícito** (`src/i18n/rutas.mjs`), no una regla. Antes fue
una regla y las 107 rutas declaraban tener versión española: 106 mentían y las 106
apuntaban a la home. Está documentado en el propio fichero.

## Sitemap

Se genera desde `astro:build:done` con las páginas que **realmente** se han construido.
Dos detalles que no son de serie:

- Los `xhtml:link` alternates salen del **mismo** `hreflang` que ya lleva la página, así
  que no pueden contradecirlo.
- `lastmod` **solo** donde hay fecha real. Los 21 posts la tienen (`dateModified` del
  JSON-LD); el resto del sitio no, y un `lastmod` inventado hace que Google deje de
  hacer caso al feed entero.

Una página con `noindex` no entra en el sitemap. Decir las dos cosas a la vez es pedirle
al buscador que elija.

> **Ojo con el modo de build.** Sin `PUBLIC_ES_PRODUCCION=1` **no hay sitemap**, no hay
> RSS, y `robots.txt` sirve `Disallow: /`. Es deliberado: el dominio sigue sirviendo el
> Webflow en vivo y un deploy provisional indexable competiría con el sitio del cliente.
> Pero significa que el trabajo de este encargo **no llega a ningún buscador hasta que
> se despliegue con esa variable puesta**.

## robots.txt

En modo producción: `Allow: /`, `Disallow: /api/` y la línea `Sitemap:`.

**No se ha tocado la política de rastreadores.** No hay reglas para `Google-Extended`,
`OAI-SearchBot` ni `GPTBot`, lo que significa que hoy ninguno está bloqueado. Cambiar
eso —en un sentido o en otro— es una decisión de negocio del cliente, no una corrección
técnica, y el encargo lo dice expresamente.

Conviene no confundirlos: `Googlebot` es rastreo de Google Search; `Google-Extended` es
control de ciertos usos del contenido por sistemas de Google y **no** equivale a
bloquear Google Search; `OAI-SearchBot` es descubrimiento para la búsqueda de ChatGPT y
`GPTBot` es rastreo relacionado con entrenamiento. Bloquear el segundo por confusión con
el cuarto es un error caro.

## Datos estructurados

Cada artículo emite **dos** bloques JSON-LD, y solo dos:

**`BlogPosting`** — `@id`, `mainEntityOfPage`, `url`, `headline`, `description`,
`image`, `articleSection`, `datePublished`, `dateModified`, `wordCount`, `timeRequired`,
`inLanguage`, `author`, `publisher`, `isPartOf`.

**`BreadcrumbList`** — jerarquía real: Home → Blog → Categoría → Artículo.

Comprobado en esta revisión:

- ✅ No hay duplicados: un solo `BlogPosting` por página.
- ✅ `author` y `publisher` son la organización. **No se ha inventado una persona**: no
  hay campo de autor en ningún CSV del export.
- ✅ Fechas reales del CMS. **`dateModified` NO se ha tocado** para simular frescura,
  aunque el cuerpo haya cambiado — ese campo dice lo que dice el CMS.
- ✅ `image` resuelve a una imagen que existe y se sirve (`check:imagenes`).
- ✅ `inLanguage` correcto por idioma: `en-US` / `es-US`.
- ✅ Todo el JSON-LD parsea (`check:seo`).

**No se ha añadido** `FAQPage`, `Review`, `AggregateRating` ni `Product`. Ninguno
corresponde al contenido visible de un artículo de blog, y añadirlos porque «suenan a
ventaja SEO» es justo lo que el encargo prohíbe. No existe un schema especial para AI
Overviews.

> **Validación externa: NO EJECUTADA.** No se ha pasado el JSON-LD por la herramienta de
> resultados enriquecidos de Google ni por el validador de schema.org. Lo que sí se ha
> comprobado es que parsea, que no hay duplicados, que las URLs resuelven y que las
> fechas son reales.

## HTML semántico

| Elemento | Estado |
|---|---|
| Un solo `<h1>` por página | ✅ 217/217 — eran 4 en un artículo |
| `<figure>` para las imágenes del cuerpo | ✅ |
| `<table>` + `<caption>` + `<th scope>` | ✅ la única tabla del blog |
| Elementos que parecen interactivos y no lo son | ✅ ninguno — eran 42 |
| Toda `<img>` con `alt` | ✅ |
| Toda `<img>` con `width` y `height` | ✅ |

## Rendimiento

Lo que se puede afirmar con lo medido:

- **CLS**: todas las `<img>` llevan `width`/`height`, inyectados sobre el HTML
  construido desde medidas reales (`src/lib/img-dim.json`, medido con sharp). No hay
  dimensión inventada.
- **Carga diferida**: las imágenes del cuerpo van `loading="lazy"` y
  `decoding="async"`. **No es la LCP**: la LCP de un artículo es la imagen de cabecera,
  que la plantilla sirve aparte. No se ha aplicado `fetchpriority="high"` a nada.
- **Peso**: las 40 fotografías que entran ya estaban optimizadas a AVIF con techo de
  300 KB. Al retirar 22 huecos, cada artículo pide **menos** bytes que antes.
- **Resolución**: medido en la página construida, 1250 px de intrínseca para 636 px de
  display = **1,97×**, por encima del umbral de 1,5× de la auditoría de nitidez.

> **Core Web Vitals de campo: NO EJECUTADO.** LCP, INP y CLS reales necesitan datos de
> usuario (CrUX / Search Console). No hay acceso. No se inventa ninguna puntuación de
> Lighthouse.

## Experiencia móvil

Comprobado a 375 px en la página construida:

| | |
|---|---|
| Desborde horizontal de página | **0 px** |
| Tabla comparativa | hace scroll **dentro de su región** (544 → 343 px), no desborda la página |
| La región desplazable es alcanzable por teclado | ✅ `role="region"` + `tabindex="0"` |
| CTA | los dos botones envuelven, no se salen |
| Contraste de los botones | **8,08:1** (AA pide 4,5:1) |

Ese último punto fue un fallo introducido y corregido en esta misma sesión: la regla
`.pp-prosa a` pintaba todo enlace del cuerpo con `var(--primary)` y le pisaba el blanco
al botón primario, dejándolo con color y fondo idénticos — un botón negro y mudo.
**No lo vio ninguna puerta y no podía verlo**: ninguna mide contraste. Salió al mirar la
página construida en el navegador. Corregido en `7fb7551`.
