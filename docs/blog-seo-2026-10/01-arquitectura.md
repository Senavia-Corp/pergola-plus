# Cómo se generan los 21 artículos, y por qué el arreglo va donde va

Esto es lo que había que entender antes de tocar nada. Está aquí porque la próxima
persona que abra el blog se va a hacer las mismas preguntas.

## La cadena real

```
docs/vivo/post__<slug>.html          captura del sitio en vivo (100 capturas, en git)
        │
        │  scripts/generar-detalle.mjs
        │    · reescribirImagenes()  URL de Webflow -> ruta local (img-map.json)
        │    · transformar(html, '/post/<slug>')
        │        └── recomponerPost()   ← EL CAMBIO DE ESTE ENCARGO
        ▼
src/contenido-migrado/post/<slug>.html        SALIDA GENERADA
        │
        │  src/pages/post/[slug].astro   (código propio, no generado)
        │    · prepararArticulo()  extrae el texto, pone ids, degrada h1 -> h2
        │    · metadatos y JSON-LD desde el CSV, vía src/lib/blog.ts
        ▼
dist/client/post/<slug>/index.html
```

La versión española reutiliza **el mismo fragmento**: `src/pages/es/post/[slug].astro`
lo pasa por `traducirHtml()` antes de prepararlo, y no duplica markup.

## Tres cosas que no son evidentes y cuestan caro

### 1. El `Post Body` del CSV NO es lo que se publica

`src/data/blog-posts.csv` tiene una columna `Post Body` con el texto del artículo,
pero `src/lib/blog.ts` solo la usa para **contar palabras** (tiempo de lectura y
`wordCount` del JSON-LD). El cuerpo que se renderiza sale del fragmento migrado.

Editar `Post Body` para cambiar un artículo no cambia nada en la página.

### 2. `src/contenido-migrado/` es salida generada, y hay una puerta que lo vigila

`check:generadores` ejecuta los generadores y hace `git diff`. Una edición a mano en un
fragmento sobrevive hasta el siguiente `node scripts/generar-detalle.mjs` y entonces se
revierte **en silencio**. Ya pasó una vez en este repositorio, con el widget muerto de
Google Reviews: 40 ficheros editados a mano que un regenerado deshizo.

Por eso el cambio vive en `scripts/lib/posts.mjs` y entra por `transformar()`, que es
de donde sale ese markup. Mismo camino que `ELFSIGHT_RESENAS` en su día.

### 3. `instalar-assets.mjs` ya no se puede ejecutar

Lee de `/Users/senavia/Downloads/Webflow Pergola Plus Florida`, borrado el
30-sep-2026. Es el único script que regenera `src/lib/img-map.json`.

**Consecuencia práctica:** incorporar una imagen nueva *por la vía del manifest* no es
posible hoy sin arreglar antes ese script. Es una de las razones por las que las 40
fotografías que entran salen de `public/cms-img/projects/`, que se referencia por ruta
directa —igual que hacen las fichas de proyecto— y no necesita `img-map.json`.

## Dónde está cada decisión

| Qué | Dónde |
|---|---|
| Qué foto entra en cada hueco, y su `alt` en EN y ES | `scripts/lib/posts.mjs` → `FOTOS` |
| Qué hueco se retira y por qué | `scripts/lib/posts.mjs` → `FOTOS[].quitar` |
| Qué se enlaza y adónde | `scripts/lib/posts.mjs` → `ENLACES` |
| El CTA del final | `scripts/lib/posts.mjs` → `CTA_NUEVO` |
| La tabla comparativa reconstruida | `scripts/lib/posts.mjs` → `TABLA_BUENA` |
| Las reglas que no se pueden incumplir | `scripts/lib/posts.mjs` → `autocomprobar()` |
| Estilo de tabla y CTA | `src/styles/blog.css` |
| `alt` en español | `scripts/lib/posts.mjs` → `ALTS_ES`, consumido por `/es/post/[slug].astro` |

## Las dos invariantes de i18n que condicionan todo

**Los enlaces envuelven nodos de texto COMPLETOS.** `traducirHtml()` indexa por la
cadena inglesa exacta de cada nodo de texto. Partir un párrafo en tres trozos para
enlazar el del medio deja las tres claves sin casar, y esa frase sale **en inglés** en
`/es/`. Envolviendo el nodo entero (`<li>Texto</li>` → `<li><a …>Texto</a></li>`), la
clave sigue siendo la misma cadena.

Esto limita de verdad dónde se puede enlazar: se enlaza lo que el artículo **ya dice**
en un nodo propio. Por eso hay artículos con 5 enlaces y artículos con 2. Añadir frases
para poder enlazarlas sería escribir contenido nuevo, que necesita aprobación (ver
`09`).

**Los `href` se escriben en inglés.** `enlazarEnEspanol()` (en `astro.config.mjs`)
reescribe los enlaces internos de las páginas `/es/` al final del build. Las 107 rutas
de destino de este trabajo están traducidas, así que los 111 enlaces de `/es/post/`
apuntan al español. Escribirlos en español aquí rompería la versión inglesa.

## Una trampa medida

`traducirHtml()` **sí** traduce el atributo `alt` —está en su lista blanca— pero, al
contrario que con los nodos de texto, **no reporta los que no encuentra**. Un `alt` sin
traducir sale en inglés en `/es/` y no lo avisa ni el build ni `check:i18n`.

Por eso el español de cada `alt` vive pegado al inglés en la misma entrada (`altEs`) y
`autocomprobar()` exige los 40: la única forma de que no se olvide uno es que no exista
el sitio donde olvidarlo.
