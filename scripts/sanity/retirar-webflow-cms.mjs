#!/usr/bin/env node
/**
 * Una vez (3f): quita de las plantillas del codigo (src/plantillas) lo que retira
 * src/lib/sin-webflow-cms.mjs, con sus huecos:
 *   - `heredado:N` cuyo valor es el <script type="text/x-wf-template"> (o vacio), en el
 *     .html y en el .heredado.json;
 *   - el <div class="w-dyn-hide w-dyn-empty"> y el hueco de su texto (o el `opcional` que
 *     lo envolvia);
 *   - el JSON del lightbox: el literal y los huecos `derivado` que lo generaban.
 *
 *     node scripts/sanity/retirar-webflow-cms.mjs
 *
 * Idempotente. El dataset no cambia: los valores de los huecos retirados se quedan sin
 * leer (los lee aun el codigo anterior al corte).
 */
import fs from 'node:fs';
import path from 'node:path';
import { sinWebflowCms } from '../../src/lib/sin-webflow-cms.mjs';
import { MARCA } from '../../src/lib/plantilla.mjs';

const DIR = path.resolve(import.meta.dirname, '../../src/plantillas');
const M = MARCA;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cambios = {};
const nota = (f, que) => { (cambios[f] ??= {})[que] = (cambios[f][que] ?? 0) + 1; };

for (const base of fs.readdirSync(DIR).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5))) {
  const fh = path.join(DIR, `${base}.html`), fj = path.join(DIR, `${base}.json`), fhe = path.join(DIR, `${base}.heredado.json`);
  let html = fs.readFileSync(fh, 'utf8');
  const huecos = fs.existsSync(fj) ? JSON.parse(fs.readFileSync(fj, 'utf8')) : null;
  const heredado = fs.existsSync(fhe) ? JSON.parse(fs.readFileSync(fhe, 'utf8')) : null;

  // Huecos que desaparecen: los derivados del JSON del lightbox y el texto del w-dyn-hide.
  const fuera = new Set();
  const marcar = (hs) => {
    for (const [k, h] of Object.entries(hs ?? {})) {
      if (h.tipo === 'derivado' && /class="w-json"/.test([h.patron, ...Object.values(h.porLegado ?? {})].join(''))) fuera.add(k);
      // El «No items found.» opcional (solo con galeria heredada de Webflow).
      if (h.tipo === 'opcional' && /class="w-dyn-hide w-dyn-empty"/.test(h.plantilla ?? '')) fuera.add(k);
      if (h.tipo === 'lista') marcar(h.huecos);
    }
  };
  marcar(huecos);
  // El texto del w-dyn-hide: la clave que va sola dentro de su <div>.
  const textoVacio = (s) => [...s.matchAll(new RegExp(`<div class="w-dyn-hide w-dyn-empty"><div>${M}([^${M}]+)${M}</div></div>`, 'g'))].map((m) => m[1]);
  // Los heredados que solo traen la plantilla de Webflow (o nada).
  if (heredado) {
    const claves = new Set(Object.values(heredado).flatMap((v) => Object.keys(v)));
    for (const k of claves) {
      if (Object.values(heredado).every((v) => v[k] == null || v[k] === '' || /^<script\b[^>]*type="text\/x-wf-template"[^>]*>[\s\S]*<\/script>$/.test(v[k]))) fuera.add(k);
    }
  }
  const limpiar = (s) => {
    for (const k of textoVacio(s)) fuera.add(k);
    let r = sinWebflowCms(s.replace(new RegExp(`<div class="w-dyn-hide w-dyn-empty"><div>${M}[^${M}]+${M}</div></div>`, 'g'), ''));
    for (const k of fuera) r = r.split(`${M}${k}${M}`).join('');
    return r;
  };
  // Dos pasadas: la primera descubre las claves de texto dentro de las listas.
  const quitarHuecos = (hs) => {
    for (const k of Object.keys(hs ?? {})) {
      if (fuera.has(k)) { delete hs[k]; nota(base, 'huecos'); continue; }
      if (hs[k].tipo === 'lista') { hs[k].plantilla = limpiar(hs[k].plantilla); quitarHuecos(hs[k].huecos); }
    }
  };
  for (let p = 0; p < 2; p++) {
    const antes = html;
    html = limpiar(html);
    if (html !== antes && p === 0) nota(base, 'html');
    if (huecos) quitarHuecos(huecos);
  }
  if (heredado) for (const v of Object.values(heredado)) for (const k of Object.keys(v)) if (fuera.has(k)) { delete v[k]; nota(base, 'heredados'); }
  for (const k of fuera) if (html.includes(`${M}${k}${M}`)) throw new Error(`${base}: queda la marca ${k}`);
  fs.writeFileSync(fh, html);
  if (huecos) fs.writeFileSync(fj, JSON.stringify(huecos, null, 1) + '\n');
  if (heredado) fs.writeFileSync(fhe, JSON.stringify(heredado, null, 1) + '\n');
}
console.log(JSON.stringify(cambios, null, 1));
