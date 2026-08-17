/**
 * Puerta del circuito de leads. Se ejecuta sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:formularios
 *
 * Los 3 formularios del sitio (#email-form en /contact-us/get-a-quote,
 * #wf-form-Contact-Page-Form en /contact-us/get-in-touch y #wf-form-Footer-Form
 * en las 107 paginas) llegaron de Webflow con `method="get"` y sin `action`: se
 * rellenaban, la pagina recargaba con los datos en la URL y no los recibia nadie.
 *
 * Esta puerta prueba el circuito ENTERO, no el markup: levanta `astro preview` y
 * postea de verdad contra /api/lead. Un formulario que apunta al endpoint pero
 * cuyo endpoint no valida, o que valida pero no registra el lead, sigue estando
 * roto para el visitante.
 *
 * FASE 0: cableada y en vacio. Las comprobaciones entran en la Fase 2, junto con
 * el endpoint. Una puerta que no existe no se acuerda nadie de crearla.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const DIST = path.join(path.resolve(import.meta.dirname, '..'), 'dist');

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) {
  console.log('  FALLO  dist/ vacio: corre `npm run build` primero');
  process.exit(1);
}

console.log(`  ${htmls.length} paginas`);
console.log('  ---    sin comprobaciones todavia: se llenan en la Fase 2 (formularios)');
