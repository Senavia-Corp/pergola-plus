/**
 * Puerta de los botones sin destino. Se ejecuta sobre dist/, DESPUES de
 * `npm run build`.
 *
 *     npm run check:cta
 *
 * Los dos botones del bloque `call-to-action-footer` venian con href="#" del
 * Webflow original, en ~100 paginas. El arreglo vive en BOTONES_MUERTOS
 * (scripts/lib/transformar.mjs) y se aplica al REGENERAR los fragmentos, no al
 * construir: si alguien vuelve a generar con el mapa roto, o edita el fragmento
 * a mano, el href="#" reaparece en silencio. Esto lo caza.
 *
 * Mira el HTML final, no el fragmento: es lo unico que prueba que el arreglo
 * llego hasta la pagina servida.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = path.join(RAIZ, 'dist');

/** El bloque entero, desde la marca de seccion hasta su cierre. */
const BLOQUE = /class="call-to-action-footer"[\s\S]*?<\/section>/g;
const MUERTO = /href="#"/;

const paginas = await fs.readdir(DIST, { recursive: true });
const htmls = paginas.filter((p) => p.endsWith('.html'));
if (!htmls.length) throw new Error('dist/ vacio: corre `npm run build` primero');

const fallos = [];
let bloques = 0;

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  for (const [bloque] of html.matchAll(BLOQUE)) {
    bloques++;
    if (MUERTO.test(bloque)) fallos.push(rel);
  }
}

console.log(`  ${bloques} bloques call-to-action-footer en ${htmls.length} paginas`);
// ponytail: solo se comprueba que no quede href="#"; que la ruta EXISTA ya lo
// cubre auditar-paridad.mjs, que recorre todos los enlaces internos de dist/.
if (fallos.length) {
  console.log(`  FALLO  href="#" sigue vivo en ${fallos.length} paginas:`);
  for (const f of fallos.slice(0, 10)) console.log(`         ${f}`);
  process.exit(1);
}
if (!bloques) {
  console.log('  FALLO  no se encontro ni un bloque: el selector ya no vale');
  process.exit(1);
}
console.log('  ok     ningun boton sin destino');
