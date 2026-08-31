/**
 * Las rutas que llevan el carrusel de resenas COMO BANDA PROPIA.
 *
 * Vive en `.mjs` y aparte por la MISMA razon que `src/i18n/rutas.mjs`: lo necesitan
 * los dos lados —el BUILD, en `scripts/generar-paginas.mjs`, y el SITIO, en
 * `src/pages/es/[...ruta].astro`—. Duplicar la lista seria garantizar que un dia la
 * version inglesa tenga resenas y la espanola no.
 *
 * LA POLITICA CAMBIO EL 31-08-2026. QUE DECIA ANTES Y POR QUE YA NO
 *
 * Decia que el bloque NO se esparcia por las 107 paginas, porque «repetir el mismo
 * bloque en todas lo convierte en decorado que nadie lee, y multiplica por 107 el
 * peso del HTML». Se decidio cuando la alternativa era NADA, y salio caro: dejo 60
 * paginas —las 50 landing locales, 6 de condado y 4 de about-us— enseñando la banda
 * «Reviews & Testimonials / What Clients Say About Our Work» con su parrafo y su
 * boton, y debajo un hueco. Prometian resenas y servian aire. En la home y en
 * contacto era peor todavia: el carrusel SI estaba, pero colgado al final del
 * documento, asi que se veian DOS secciones de Reviews —la blanca de Webflow vacia a
 * media pagina y una crema abajo con las tarjetas—. Eso es lo que reporto el cliente.
 *
 * LA POLITICA DE HOY: EL CARRUSEL VA DONDE ESTA LA BANDA
 *
 * Donde el fragmento migrado trae la banda `reviews`, el carrusel va DENTRO de ella,
 * embebido, entre su titular y el boton «Read Client Reviews» — y eso NO lo decide
 * una lista: lo decide el propio fragmento. El paso 6b de `scripts/lib/transformar.mjs`
 * escribe `MARCA_RESENAS` al sustituir el widget muerto de Elfsight, o sea que la
 * marca cae exactamente donde estaba el widget, en los 39 fragmentos con banda y solo
 * en ellos. Una lista habria que acordarse de ampliarla; esto no.
 *
 * El invariante, y es el que vigila `npm run check:resenas`:
 *
 *     ninguna pagina promete resenas sin traerlas, y ninguna las trae dos veces.
 *
 * NO se esparce a `post`, `resources`, `brands`, `project`, `articles`, `404` ni
 * `thank-you` por una razon simple y medida: NO TIENEN BANDA. No prometen nada, asi
 * que no hay nada que cumplir ahi, y meterselo si que seria decorado — con el coste
 * real de 6,5 KB de HTML por pagina.
 *
 * QUE QUEDA EN ESTA LISTA: NADA, Y ESO ES EL RESULTADO
 *
 * Hasta el 31-08-2026 quedaba la EXCEPCION: `/about-us/testimonials`, que se titula
 * «Client Reviews» y no tiene banda `reviews` —el paso 6b le QUITA el enlace en vez
 * de ponerselo, porque apuntaria a si misma—, asi que el carrusel se le añadia como
 * banda propia AL FINAL del documento.
 *
 * Y al final del documento es DEBAJO del CTA del pie. Ademas la pagina si tenia un
 * hueco reservado —`<section class="reviews-page">`, la ranura donde vivia el widget
 * de Elfsight—, que al retirarlo quedaba con un div vacio y sus 8rem de padding:
 * media pantalla en blanco entre el hero y el CTA, en la pagina que se titula
 * «Client Reviews». Las resenas estaban en la pagina, pero por debajo de todo.
 *
 * El arreglo no fue moverlas: fue que el paso 6b emita la marca TAMBIEN en esa ruta
 * —sin el enlace, que sigue apuntando a si misma— y dejar que el mismo mecanismo de
 * las otras 78 las monte dentro de la ranura. Con eso la lista se queda vacia.
 *
 * SE MANTIENE EL FICHERO, no se borra, porque el punto no es la lista: es la
 * POLITICA de arriba y el porque de que ya no haga falta ninguna lista. `CON_RESENAS`
 * vacio significa «ninguna pagina necesita el rodeo», que es distinto de que el rodeo
 * no exista. Si aparece una pagina que promete resenas y no tiene donde embeberlas,
 * aqui es donde va — y arriba esta escrito que la alternativa preferible es que el
 * fragmento traiga la marca.
 */
export const CON_RESENAS = new Set([]);
