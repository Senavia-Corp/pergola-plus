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
 * QUE QUEDA EN ESTA LISTA
 *
 * La EXCEPCION: paginas sin banda que aun asi deben traer el carrusel, y que por
 * tanto lo montan como banda propia (fondo crema, 5rem de padding, con su titular).
 *
 *   /about-us/testimonials   se titula «Client Reviews» y dice «Real reviews. Real
 *                            craftsmanship». No tiene banda `reviews` porque el paso
 *                            6b le QUITA el enlace en vez de ponerselo —apuntaria a
 *                            si misma—, asi que aqui no hay marca donde embeber y el
 *                            carrusel tiene que ser la seccion.
 *
 * Las que no estan y aun asi lo llevan, cada una por su motivo:
 *   · `/` y `/contact-us/get-in-touch` salieron de aqui al pasar a embebido. La home
 *     por la marca; contacto no usa el fragmento migrado —su banda la pinta a mano
 *     `src/components/PaginaContacto.astro`— y lo monta ese componente, que sirve a
 *     los dos idiomas de una vez.
 *   · `/project-estimator` y las 10 fichas de producto son de autoria propia o salen
 *     de `scripts/generar-detalle.mjs`, y lo montan ellas. Tampoco tienen banda.
 */
export const CON_RESENAS = new Set([
  '/about-us/testimonials',
]);
