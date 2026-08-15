# Pergola Plus Florida

Sitio migrado desde Webflow a Astro. El CSS y el JS de Webflow
(`public/css/pergola-plus-florida.webflow.css`, `public/js/webflow.js`) se
conservan **verbatim**: `webflow.js` lleva dentro las interacciones IX2 del
sitio y los `data-w-id` del HTML son su llave. Borrar uno mata su animación sin
dar ningún error.

## La referencia de la auditoría vive en el repo

`scripts/auditar-paridad.mjs` compara las 99 páginas construidas contra las **100
capturas del sitio en vivo** que hay en `docs/vivo/`. Son irreemplazables: el
sitio en vivo puede cambiar o caerse, y sin ellas no hay forma de demostrar que
la migración cuadra.

Estuvieron en `/tmp`, en el scratchpad de una sesión que ya no existía. Seguían
ahí de milagro. Ahora están versionadas: 5,6 MB en disco, 1,1 comprimidos.

**Regla que salió de un incidente real:** `src/contenido-migrado/` es SALIDA
GENERADA de `scripts/lib/transformar.mjs`. Los fragmentos y el transformador
tienen que viajar **siempre en el mismo commit**. Editar un fragmento a mano
funciona hasta que alguien regenera y se lo lleva por delante — pasó con la
retirada del widget de Google Reviews, que hubo que rehacer dentro del
transformador (`ELFSIGHT_RESENAS`).

Queda pendiente una puerta que compare fragmentos contra la salida de los
generadores y falle si divergen: hoy la deriva solo se nota cuando alguien
regenera y mira el diff.

## El shell (Nav y Footer) es código nuestro

`src/components/Nav.astro` y `src/components/Footer.astro` los generó en su día
`scripts/generar-shell.mjs` a partir del export de Webflow. **Ya no.** Desde el
rediseño del menú son de autoría propia y se editan a mano.

El script sigue ahí por trazabilidad, pero exige `--regenerar-shell` y avisa de
que sobrescribe: regenerar se llevaría por delante el rediseño, los enlaces
«View all», «Project Estimator» y la retirada de Elfsight.

El CSS del menú vive en `src/styles/menu.css`, importado desde `Nav.astro`.
Nunca se toca el CSS migrado de Webflow.

## El blog es código nuestro

`/resources/blog`, `/resources/blog/<categoría>` y `/post/<slug>` tampoco salen
de una captura del sitio en vivo. Leen los dos CSV del CMS en `src/data/` en
tiempo de build a través de `src/lib/blog.ts`, y de ahí salen las tarjetas, los
contadores por categoría, el RSS y el JSON-LD.

Los CSV están **dentro del repo** a propósito. `scripts/generar-detalle.mjs` los
lee de `~/Downloads`, y eso vale para un generador que se ejecuta a mano; como
entrada de build rompería el despliegue en Vercel, donde esa ruta no existe.

Los dos generadores siguen conociendo estas rutas y siguen escribiendo sus
fragmentos —son la única copia en el repo del markup original, útil para
diffear— pero **no sobrescriben las páginas**:

| Generador | Guarda | Qué protege |
|---|---|---|
| `generar-paginas.mjs` | `Set` `MANUALES` | `src/pages/resources/blog.astro` |
| `generar-detalle.mjs` | `paginaPropia: true` en `COLECCIONES` | `src/pages/post/[slug].astro` |

Saltárselas exige `--regenerar-manuales` en cualquiera de los dos, y eso borra el
rediseño. En `generar-detalle.mjs` la guarda es obligatoria por una razón
concreta: su plantilla es **una sola cadena compartida por las 8 colecciones**,
así que el JSON-LD y el anterior/siguiente del blog habrían caído también sobre
products, services, project, brands, countries, pergolas-contractors y articles.

El CSS vive en `src/styles/blog.css`. La puerta es `npm run check:blog`, que se
ejecuta sobre `dist/` después de `npm run build` y comprueba las cuentas por
categoría (9/6/3/2/1), que no queda ni un `opacity:0` en línea, que el RSS está
bien escapado y que **la animación de entrada sobrevive a la minificación**.

Esa última comprobación existe porque estuvo rota y en silencio. El minificador
fusionaba el atajo `animation` con `animation-timeline` en
`animation: .5s ease-out both pp-entrada view()`, y como `animation-timeline` no
forma parte de ese atajo en la especificación, el navegador tiraba la declaración
entera: `animation-name` quedaba en `none` y **las 22 entradas del listado no se
ejecutaban**. No se veía roto —el estado base es `opacity: 1`—, así que solo salió
midiendo el computed en el navegador. La regla usa ahora propiedades largas con
`animation-name` declarado aparte. **No volver al atajo.**

### La página del artículo

De cada fragmento migrado de `/post/<slug>` se aprovecha **solo el texto**
(`src/lib/articulo.ts`). La cabecera y la barra lateral se descartan a propósito:

- La cabecera traía `opacity:0` **en línea** y los posts no llevan bloque
  anti-FOUC — medido: 4 en línea, 0 bloques. Sin JavaScript, el `h1` y la imagen
  principal eran invisibles en los 21 artículos.
- La barra lateral eran 10 tarjetas **hardcodeadas e idénticas** en los 21 posts:
  7,9 KB de los 17 KB del fragmento y 210 enlaces internos casi duplicados. La
  sustituyen el índice y 3 relacionados de verdad, de la misma categoría.

El módulo además degrada a `h2` los `<h1>` que vienen dentro del cuerpo (había 3
en `aluminum-pergola-cost-boca-raton-vs-fort-lauderdale`, que con el de la página
hacían 4 en un mismo documento) y pone un `id` slug a cada encabezado, que es lo
que habilita el índice y los enlaces profundos.

Medidas de lectura, antes y después:

| | Antes | Ahora |
|---|---|---|
| Cuerpo | 14px | 18px |
| Interlineado | 1,5 | 1,7 |
| Caracteres por línea | 94 | 68 |
| `h2` | 40px, `margin-top: 0` | 28px, 70px de aire |
| Encabezados | `capitalize` forzado | tal cual se escribieron |

**Solo se generan rutas para las categorías con artículos** (5 de 9). Las tres
vacías dan 404, y es deliberado: una categoría sin artículos no es una sección
del sitio, es una fila del CMS. El caso claro es `service-areas` — el sitio ya
tiene **29 páginas reales de zonas** (`/about-us/where-we-work`, 3 de condado y
25 de ciudad), así que una página «Service Areas» sin contenido solo confunde,
aunque lleve `noindex`. Es data-driven: en cuanto el cliente publique en una de
las tres, su ruta aparece sola en el siguiente build.

Efecto secundario buscado: **no hay estado vacío** porque no puede alcanzarse.
Nadie llega nunca a un grid en blanco.

Tres cosas quedan pendientes del cliente en el CMS:

- **`Featured?` está en `true` en 10 de 21 posts**, así que no sirve para elegir
  destacado. El que manda es `Super Blog`, que marca uno solo. Convendría
  desmarcar los demás.
- **`Categories.Description` está vacío en las 9 filas.** Las entradillas de las
  5 categorías con artículos son copy provisional dentro de `src/lib/blog.ts`;
  en la Fase 3 se mueven a ese campo.
- **Cuatro filas sobran en `Categories`.** `view-all` es un control de interfaz
  metido en los datos, y `service-areas` pisa conceptualmente a las 29 páginas
  de ubicación. `commercial-projects` y `patio-hardscape-services` sí son temas
  de artículo plausibles, solo les falta contenido.

## Idiomas

Las 4 apps de Elfsight (traductor, WhatsApp, Click-to-Call, Google Reviews) se
retiraron: el traductor era de plan gratuito y su host perezoso vivía en el pie,
así que la traducción no llegaba a aplicarse al navegar. En su lugar hay **i18n
propio**, en `src/i18n/`:

| Archivo | Qué |
|---|---|
| `index.ts` | `idiomaDeRuta()`, `rutaEnIdioma()` y `traducirHtml()` |
| `shell.ts` | rótulos de nav y footer en los dos idiomas |
| `home.es.ts` | las 145 cadenas de la home |

**El HTML migrado no se duplica.** `traducirHtml()` reutiliza el markup del
export y sustituye solo los nodos de texto —lo que hay entre `>` y `<`, nunca
atributos—, así que `data-w-id`, anti-FOUC, clases e imágenes quedan intactos y
las interacciones IX2 funcionan igual en español. Verificado: `/es/` sale con los
mismos 41 `data-w-id` y los mismos 4 bloques anti-FOUC que `/`.

Una cadena que no esté en el diccionario **se queda en inglés** (degradado
visible, no roto) y el build la lista por consola.

Estado: **solo `/es/` está traducida**. Las páginas interiores siguen en inglés
—son ~88.000 palabras— y la home española lo dice de forma explícita en un aviso
al pie. Cuando se traduzcan más páginas, `rutaEnIdioma()` es el único sitio que
hay que tocar para que el selector apunte a la equivalente.

El selector vive en el nav: escritorio a la derecha de los CTA, móvil en la
barra superior junto a la hamburguesa (visible sin abrir el menú). Las banderas
van **inline** en `Nav.astro`; `public/images/En.svg` y `Sp.svg` NO se usan
porque no llevan `<style>` ni `fill` y se verían negras.

---

Andamiaje original del starter de Astro, más abajo.

# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
