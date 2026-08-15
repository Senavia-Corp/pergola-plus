#!/usr/bin/env node
/**
 * Fase 0.5 — la UNICA modificacion al CSS de Webflow.
 *
 * La regla de la migracion es copiar el CSS verbatim. Esta es la excepcion, y
 * esta acotada a una sola linea:
 *
 *   pergola-plus-florida.webflow.css apunta al checkmark de las casillas
 *   personalizadas con una URL ABSOLUTA al CDN de Webflow:
 *     url(https://d3e54v103j8qbb.cloudfront.net/static/custom-checkbox-checkmark.589d534424.svg)
 *
 *   Lo usan las 6 casillas del formulario de presupuesto (LED, ventiladores,
 *   mosquiteras, drenaje, cocina exterior, ampliacion de pavimento). Dejarlo
 *   significa que las casillas del sitio nuevo dependen del CDN de Webflow para
 *   siempre y se rompen el dia que se cancele la cuenta.
 *
 * El archivo descargado es byte a byte el mismo, asi que el resultado visual es
 * identico. Solo cambia de donde se sirve.
 *
 * Idempotente: si ya esta parcheado, no hace nada.
 *
 *   node scripts/parchear-css.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const RAIZ = path.resolve(import.meta.dirname, '..');
const CSS = path.join(RAIZ, 'public/css/pergola-plus-florida.webflow.css');
const ORIGEN = '/Users/senavia/Downloads/Webflow Pergola Plus Florida/css/pergola-plus-florida.webflow.css';

const PARCHES = [
  {
    de: 'https://d3e54v103j8qbb.cloudfront.net/static/custom-checkbox-checkmark.589d534424.svg',
    a: '/images/custom-checkbox-checkmark.589d534424.svg',
    porque: 'checkmark de las casillas personalizadas — quita la dependencia del CDN de Webflow',
  },
];

const css = await fs.readFile(CSS, 'utf8');
let out = css;
const aplicados = [];

for (const p of PARCHES) {
  if (out.includes(p.de)) { out = out.replaceAll(p.de, p.a); aplicados.push(p); }
}

// El asset local tiene que existir antes de repuntar el CSS hacia el.
for (const p of aplicados) {
  const destino = path.join(RAIZ, 'public', p.a.replace(/^\//, ''));
  try { await fs.access(destino); }
  catch {
    console.error(`FALLO: ${p.a} no existe en public/. Ejecuta antes descargar-imagenes.mjs.`);
    process.exit(1);
  }
}

if (!aplicados.length) {
  const yaOk = PARCHES.every((p) => out.includes(p.a));
  console.log(yaOk ? 'CSS ya parcheado, nada que hacer.' : 'AVISO: no se encontro ningun patron. Revisa si el CSS cambio.');
  process.exit(yaOk ? 0 : 1);
}

await fs.writeFile(CSS, out);

// Deja constancia de que la desviacion respecto al original es SOLO esta.
const orig = await fs.readFile(ORIGEN, 'utf8');
const dif = orig.length - out.length;
console.log(`CSS parcheado: ${aplicados.length} cambio(s)`);
for (const p of aplicados) console.log(`   ${p.de}\n   -> ${p.a}\n      (${p.porque})`);
console.log(`
   sha original : ${createHash('sha256').update(orig).digest('hex').slice(0, 16)}
   sha parcheado: ${createHash('sha256').update(out).digest('hex').slice(0, 16)}
   diferencia   : ${dif} bytes  (esperado: solo la longitud de la URL sustituida)`);

const restantes = [...out.matchAll(/url\(\s*['"]?(https?:[^'")]+)['"]?\s*\)/g)].map((m) => m[1]);
console.log(`   url() absolutas restantes en el CSS: ${restantes.length}`);
for (const u of restantes) console.log(`      !! ${u}`);
