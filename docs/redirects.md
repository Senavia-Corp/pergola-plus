# Redirects 301

Van en `astro.config.mjs`, en la clave `redirects`, y **no** en JavaScript de
cliente: un redirect que necesita que el navegador ejecute algo no lo sigue ningún
buscador, y con él se pierde el enlace entrante que veníamos a salvar.

| De | A | Por qué |
|---|---|---|
| `/deck-builders` | `/services/deck-builders` | Enlace roto que YA estaba en producción: 2 veces en el export y 1 en el sitio en vivo, devolviendo 404. El markup se corrigió en el transformador (`ENLACES_ROTOS`), pero quien lo tenga guardado o enlazado desde fuera sigue llegando aquí. |
| `/about-us` | `/about-us/about-us` | Lo enlazaban el menú y el pie de las **113 páginas** y devolvía 404. No lo veía ninguna puerta porque `check:enlaces` solo busca `href="#"`, y este enlace sí tenía destino — solo que a ninguna parte. Los enlaces ya están corregidos; el redirect salva a quien tenga el viejo. |
| `/services/patio-remodeling` | `/services/full-outdoor-remodel` | El servicio se renombró a **Full Outdoor Remodel** al ampliar su alcance del patio al exterior completo (25-ago-2026). Es la primera URL viva del sitio original que cambia de ruta. |
| `/es/services/patio-remodeling` | `/es/services/full-outdoor-remodel` | La gemela en español del anterior. Los slugs no se traducen, así que el par es simétrico. |
| `/brands/appolo` | `/brands/apollo` | «Appolo» era una errata del CMS de Webflow: la marca es **Apollo** (Apollo Opening Roof). Feedback final de Daniel, 30-sep-2026. La carpeta de imágenes `cms-img/brands/appolo/` conserva el nombre viejo a propósito (no se ve y no se pidió). |
| `/es/brands/appolo` | `/es/brands/apollo` | La gemela en español del anterior. |
| `/products/sukkha` | `/products/sukkah` | Errata del producto: es **Sukkah** (Sukkah 3000). Mismo feedback, 30-sep-2026. La carpeta `cms-img/products/sukkha/` y sus 11 ficheros conservan el nombre viejo a propósito; el JPG de Open Graph sí se renombró (`sukkah-1200x630.jpg`). |
| `/es/products/sukkha` | `/es/products/sukkah` | La gemela en español del anterior. |

## Rutas que NO cambiaron

Los slugs no se traducen: `/es/products/` usa el mismo slug que `/products/`. Es
deliberado — traducirlos obligaría a mantener un segundo mapa de redirects para
siempre, y no aporta nada en un sitio cuyo público busca en los dos idiomas.

Las 99 URLs vivas del sitio original conservan su ruta exacta **salvo tres**, cubiertas
con los 301 de arriba:

- `/services/patio-remodeling` → `/services/full-outdoor-remodel` (25-ago-2026): el
  nombre del servicio cambió por decisión del cliente.
- `/brands/appolo` → `/brands/apollo` (30-sep-2026): corrige la errata de la marca.
- `/products/sukkha` → `/products/sukkah` (30-sep-2026): corrige la del producto.

Son las únicas excepciones a la invariante. Todo lo demás está verificado una a una en
`docs/urls-actuales.txt` y lo comprueba `scripts/auditar-paridad.mjs`, que compara
contra las 100 capturas de `docs/vivo/`.

Al renombrar una ruta hay que renombrar también su captura
(`docs/vivo/services__full-outdoor-remodel.html`, `docs/vivo/brands__apollo.html`,
`docs/vivo/products__sukkah.html`),
porque el slug de las páginas de detalle **sale del nombre de fichero de la captura**
(`generar-detalle.mjs`). El contenido de esas capturas sigue siendo el del sitio en
vivo, que continúa sirviendo la URL vieja: son lo único de `docs/vivo/` que ya no
espeja la ruta real.

### La variante con barra final no se cubre

Astro normaliza una clave de redirect con barra (`'/brands/appolo/'`) a la misma ruta
que sin ella, así que los 301 de arriba solo responden a la forma **sin** barra; la
forma con barra da 404, igual que con `/services/patio-remodeling/` desde agosto. Si al
cortar el dominio hubiera tráfico por esa forma, se cubre con un *splice* de la ruta
`^/brands/appolo/?$` en `scripts/rutas-vercel.mjs` (el mismo patrón que `RUTA_404_ES`).
Hoy no se hace: nada del sitio la enlaza.

## Las tres que dan 404 en el sitio en vivo

De la Fase 0, y siguen dando 404 a propósito:

- `/resources/product-info` — el archivo del export solo tiene el shell, sin
  contenido. Nadie la enlaza. No se migró.
- `/contact-us/get-services` — 589 líneas de contenido real, pero despublicada y
  huérfana en producción. **Decisión pendiente del cliente**, ver
  `docs/estado-final.md`.
- `/deck-builders` — ahora redirige (arriba).
