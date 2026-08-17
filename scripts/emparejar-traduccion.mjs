#!/usr/bin/env node
/**
 * Empareja las cadenas de un fragmento con sus traducciones y escribe el diccionario.
 *
 *     node scripts/emparejar-traduccion.mjs <fragmento.html> <traducciones.txt> <salida.ts>
 *
 * POR QUE EXISTE
 *
 * `traducirHtml()` indexa por la cadena inglesa EXACTA. Transcribirlas a mano en el
 * diccionario es donde se cuela el error que no da error: el espacio fino de no
 * separacion (U+202F) de "8:00 AM - 5:00 PM", una comilla tipografica que parece
 * recta, un `&amp;` que se escribe `&`. La entrada no casa, la cadena sale en ingles
 * y no lo avisa nadie mas que el contador del build.
 *
 * Aqui las claves NO se escriben: se extraen del propio fichero. Lo unico que se
 * autoria es el lado español, una linea por cadena y en el mismo orden.
 *
 * Si los dos lados no tienen el mismo numero de lineas, esto se para y dice en cual
 * se desalinearon. Un desfase de una linea traduciria el resto del articulo con el
 * texto equivocado, y eso si que pasaria las puertas: son cadenas validas, solo que
 * en el sitio que no es.
 *
 * Formato del .txt: una traduccion por linea, en el orden que imprime
 * `extraer-traducibles.mjs --listar`. Una linea con solo `=` deja la cadena TAL CUAL
 * (nombres propios, referencias de producto, cifras sueltas).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { traducibles } from './lib/traducibles.mjs';

const args = process.argv.slice(2);
const [fragmento, traducciones, salida] = args.filter((a) => !a.startsWith('--'));
if (!fragmento || !traducciones || !salida) {
  console.error('uso: node scripts/emparejar-traduccion.mjs <fragmento.html> <traducciones.txt> <salida.ts> [--conocidas=<lista.txt>]');
  process.exit(1);
}

const html = await fs.readFile(fragmento, 'utf8');
let claves = traducibles(html);

// Las cadenas que YA viven en comun.es.ts (las tarjetas del blog, el CTA del pie)
// no se repiten aqui: el diccionario efectivo de la pagina es {...COMUN_ES, ...este}.
// Traducirlas otra vez en los 21 articulos serian ~650 entradas duplicadas, y una
// duplicada es una que un dia dice algo distinto que su original.
const conocidasArg = args.find((a) => a.startsWith('--conocidas='));
if (conocidasArg) {
  const lista = new Set(
    (await fs.readFile(conocidasArg.slice('--conocidas='.length), 'utf8'))
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean),
  );
  claves = claves.filter((c) => !lista.has(c));
}

const crudo = await fs.readFile(traducciones, 'utf8');
// Se respetan las lineas vacias intencionadas? No: una cadena vacia dejaria el nodo
// en blanco en la pagina. Una linea vacia es SIEMPRE un descuido, y se para.
const valores = crudo.replace(/\n+$/, '').split('\n');

if (claves.length !== valores.length) {
  console.error(`\n  DESALINEADO en ${path.basename(fragmento)}`);
  console.error(`  ${claves.length} cadenas en el fragmento, ${valores.length} lineas de traduccion.\n`);
  const n = Math.min(claves.length, valores.length);
  for (let i = 0; i < n; i++) {
    // Donde empieza a desalinearse se ve porque la traduccion deja de tener que ver
    // con su clave. No se puede detectar solo, pero si se puede enseñar el final.
    if (i >= n - 4) console.error(`  [${i}] ${claves[i]?.slice(0, 60)}\n        -> ${valores[i]?.slice(0, 60)}`);
  }
  if (claves.length > valores.length) {
    console.error('\n  Faltan estas por traducir:');
    for (let i = valores.length; i < claves.length; i++) console.error(`  [${i}] ${claves[i]}`);
  } else {
    console.error('\n  Sobran estas lineas:');
    for (let i = claves.length; i < valores.length; i++) console.error(`  [${i}] ${valores[i]}`);
  }
  process.exit(1);
}

const vacias = valores.map((v, i) => [i, v]).filter(([, v]) => !String(v).trim());
if (vacias.length) {
  console.error(`\n  ${vacias.length} traduccion(es) VACIAS en ${path.basename(traducciones)}:`);
  for (const [i] of vacias.slice(0, 10)) console.error(`  [${i}] ${claves[i]?.slice(0, 70)}`);
  process.exit(1);
}

const entradas = claves
  .map((clave, i) => {
    const valor = valores[i] === '=' ? clave : valores[i];
    return `  ${JSON.stringify(clave)}:\n    ${JSON.stringify(valor)},`;
  })
  .join('\n');

const nombre = path.basename(fragmento, '.html');
await fs.writeFile(
  salida,
  `// GENERADO por scripts/emparejar-traduccion.mjs — no editar a mano.\n`
  + `//\n`
  + `// Las CLAVES salen del propio fragmento, no se transcriben: asi no puede colarse\n`
  + `// un espacio fino ni una comilla tipografica que deje la cadena sin casar.\n`
  + `// Para cambiar una traduccion se edita src/i18n/posts/${nombre}.txt y se regenera.\n`
  + `\n`
  + `export default {\n${entradas}\n} as Record<string, string>;\n`,
);

console.log(`  ok  ${path.basename(salida)} — ${claves.length} cadenas`);
