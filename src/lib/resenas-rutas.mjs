/**
 * Rutas que llevan el carrusel de resenas de Google.
 *
 * Vive en `.mjs` y aparte por la MISMA razon que `src/i18n/rutas.mjs`: lo
 * necesitan los dos lados.
 *
 *   - el BUILD, en `scripts/generar-paginas.mjs`, para emitir `<ReseñasGoogle />`
 *     dentro de las paginas inglesas que genera;
 *   - el SITIO, en `src/pages/es/[...ruta].astro`, para montarlo en las gemelas
 *     espanolas.
 *
 * Duplicar la lista seria garantizar que un dia la home inglesa tenga resenas y
 * la espanola no. Y no puede vivir dentro de `generar-paginas.mjs`: ese fichero
 * ES un script —lee del disco y escribe paginas en cuanto se importa—, asi que
 * importarlo desde una pagina de Astro dispararia el generador entero en mitad
 * del build.
 *
 * POR QUE ESTAS TRES RUTAS
 *
 *   /                          la home: es donde la prueba social hace mas.
 *   /about-us/testimonials     se titula «Client Reviews» y dice «Real reviews.
 *                              Real craftsmanship», y desde que se retiro el
 *                              widget muerto de Elfsight no tiene NI UNA resena.
 *                              Prometia contenido y servia una pagina vacia.
 *   /contact-us/get-in-touch   la pagina de contacto, ultimo paso antes de pedir
 *                              presupuesto.
 *
 * `/project-estimator` tambien lo lleva, pero no esta aqui: es pagina de autoria
 * propia y lo monta ella misma. Igual que la home espanola
 * (`src/pages/es/index.astro`).
 *
 * NO se esparce por las 107 paginas: repetir el mismo bloque en todas lo
 * convierte en decorado que nadie lee, y multiplica por 107 el peso del HTML de
 * las resenas.
 */
export const CON_RESENAS = new Set([
  '/',
  '/about-us/testimonials',
  '/contact-us/get-in-touch',
]);
