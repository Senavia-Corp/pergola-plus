# Redirects 301

Van en `astro.config.mjs`, en la clave `redirects`, y **no** en JavaScript de
cliente: un redirect que necesita que el navegador ejecute algo no lo sigue ningún
buscador, y con él se pierde el enlace entrante que veníamos a salvar.

| De | A | Por qué |
|---|---|---|
| `/deck-builders` | `/services/deck-builders` | Enlace roto que YA estaba en producción: 2 veces en el export y 1 en el sitio en vivo, devolviendo 404. El markup se corrigió en el transformador (`ENLACES_ROTOS`), pero quien lo tenga guardado o enlazado desde fuera sigue llegando aquí. |
| `/about-us` | `/about-us/about-us` | Lo enlazaban el menú y el pie de las **113 páginas** y devolvía 404. No lo veía ninguna puerta porque `check:enlaces` solo busca `href="#"`, y este enlace sí tenía destino — solo que a ninguna parte. Los enlaces ya están corregidos; el redirect salva a quien tenga el viejo. |

## Rutas que NO cambiaron

Los slugs no se traducen: `/es/products/` usa el mismo slug que `/products/`. Es
deliberado — traducirlos obligaría a mantener un segundo mapa de redirects para
siempre, y no aporta nada en un sitio cuyo público busca en los dos idiomas.

Las 99 URLs vivas del sitio original conservan su ruta exacta. Está verificado una a
una en `docs/urls-actuales.txt` y lo comprueba `scripts/auditar-paridad.mjs`, que
compara contra las 100 capturas de `docs/vivo/`.

## Las tres que dan 404 en el sitio en vivo

De la Fase 0, y siguen dando 404 a propósito:

- `/resources/product-info` — el archivo del export solo tiene el shell, sin
  contenido. Nadie la enlaza. No se migró.
- `/contact-us/get-services` — 589 líneas de contenido real, pero despublicada y
  huérfana en producción. **Decisión pendiente del cliente**, ver
  `docs/estado-final.md`.
- `/deck-builders` — ahora redirige (arriba).
