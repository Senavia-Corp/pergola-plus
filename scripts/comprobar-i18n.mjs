#!/usr/bin/env node
/**
 * Puerta del espanol. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:i18n
 *
 * Lo que protege NO es «que haya espanol»: es que el espanol no MIENTA y que no se
 * publique a medias.
 *
 * Los dos fallos que persigue son silenciosos:
 *
 *   1. Una pagina /es/ a medio traducir. Se ve bien por arriba y el visitante se topa
 *      con ingles al tercer parrafo. Peor que no tenerla.
 *   2. Una pagina /es/ que pierde un `data-w-id` o el bloque anti-FOUC de su gemela
 *      inglesa. Como la version espanola REUTILIZA el markup migrado y solo sustituye
 *      nodos de texto, si algo se come un id el elemento se queda en opacity:0 para
 *      siempre. Sin error, sin hueco: invisible.
 *
 * Y el que ya estaba arreglado y hay que mantener arreglado: el hreflang tiene que
 * ser reciproco y apuntar SOLO a paginas que existen. Antes, 106 paginas declaraban
 * una traduccion inexistente.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();

/** Cobertura minima de nodos de texto traducidos, por pagina. */
const COBERTURA = 0.98;

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 10)) console.log(`         ${d}`);
    if (detalle.length > 10) console.log(`         ... y ${detalle.length - 10} mas`);
  }
};

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) {
  console.log('  FALLO  dist/ vacio: corre `npm run build` primero');
  process.exit(1);
}

const ruta = (rel) => '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
const es = htmls.filter((rel) => ruta(rel).startsWith('/es/') || ruta(rel) === '/es/');

decir(es.length > 0, `${es.length} paginas en /es/`);

// El cuerpo, sin el shell: el nav y el pie ya se traducen por diccionario de claves
// (src/i18n/shell.ts) y meterlos aqui diluiria la medida de la pagina.
function cuerpo(html) {
  const i = html.indexOf('</nav>');
  const j = html.lastIndexOf('<footer');
  return i >= 0 && j > i ? html.slice(i, j) : html;
}

/** Nodos de texto que parecen prosa, con el mismo criterio que traducirHtml. */
function nodos(html) {
  const sinBloques = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const out = [];
  for (const m of sinBloques.matchAll(/>([^<>]+)</g)) {
    const t = m[1].trim();
    if (t.length > 2 && /[a-zA-Z]{3}/.test(t)) out.push(t);
  }
  return out;
}

/**
 * Heuristica de «esto sigue en ingles».
 *
 * No se puede detectar el idioma de verdad sin una libreria, y no hace falta: basta
 * con buscar palabras funcionales inglesas que NO existen en espanol. `and`, `the` o
 * `with` en un texto espanol solo aparecen dentro de una marca o de una cita.
 *
 * ponytail: sin detector de idioma. Si algun dia hay falsos positivos de verdad, el
 * sitio para meter uno es esta funcion.
 */
const INGLESAS = /\b(the|and|with|your|our|for|from|that|this|are|will|have|which|you)\b/i;
const esIngles = (t) => INGLESAS.test(t);

const sinCobertura = [];
const idsPerdidos = [];
const foucPerdido = [];
const langMal = [];
const tituloIgual = [];

for (const rel of es) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const r = ruta(rel);

  // --- <html lang="es"> ---
  if (!/<html[^>]*\blang="es"/.test(html)) langMal.push(r);

  // --- cobertura ---
  const textos = nodos(cuerpo(html));
  const enIngles = textos.filter(esIngles);
  const cobertura = textos.length ? 1 - enIngles.length / textos.length : 1;
  if (cobertura < COBERTURA) {
    sinCobertura.push(
      `${r}  ${(cobertura * 100).toFixed(1)}% (${enIngles.length} de ${textos.length} en ingles)`
      + (enIngles.length ? `\n           p.ej. "${enIngles[0].slice(0, 70)}"` : ''),
    );
  }

  // --- paridad con la gemela inglesa ---
  // Se busca por el hreflang que la propia pagina declara: si dice que su gemela es
  // /products, se compara contra /products. Asi no hace falta un segundo mapa.
  const gemela = html.match(/<link rel="alternate" hreflang="en" href="([^"]+)"/)?.[1];
  if (gemela) {
    const p = new URL(gemela).pathname;
    const relEn = p === '/' ? 'index.html' : p.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
    const ingles = await fs.readFile(path.join(DIST, relEn), 'utf8').catch(() => null);
    if (ingles) {
      const ids = (s) => new Set([...s.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
      const faltan = [...ids(ingles)].filter((x) => !ids(html).has(x));
      if (faltan.length) idsPerdidos.push(`${r}: ${faltan.length} (${faltan[0].slice(0, 8)}…)`);

      const fouc = (s) => new Set(
        [...s.matchAll(/html\.w-mod-js:not\(\.w-mod-ix\)\s*\[data-w-id="([^"]+)"\]/g)].map((m) => m[1]));
      const fFaltan = [...fouc(ingles)].filter((x) => !fouc(html).has(x));
      if (fFaltan.length) foucPerdido.push(`${r}: ${fFaltan.length} bloques anti-FOUC`);

      // Un title identico al ingles significa que se olvido traducir el <head>.
      const t = (s) => s.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
      if (t(html) && t(html) === t(ingles)) tituloIgual.push(r);
    }
  }
}

decir(langMal.length === 0, 'toda pagina /es/ declara <html lang="es">', langMal);
decir(sinCobertura.length === 0, `${COBERTURA * 100}% de los nodos de texto traducidos`, sinCobertura);
decir(idsPerdidos.length === 0, 'ninguna pagina /es/ pierde un data-w-id de su gemela', idsPerdidos);
decir(foucPerdido.length === 0, 'ninguna pagina /es/ pierde un bloque anti-FOUC', foucPerdido);
decir(tituloIgual.length === 0, 'ningun <title> de /es/ es identico al ingles', tituloIgual);

// --- hreflang reciproco y verdadero ---------------------------------------
// Es el fallo que mas caro sale y el mas facil de reintroducir: basta con anadir una
// ruta a TRADUCIDAS y olvidarse de crear la pagina.
const rotos = [];
const noReciprocos = [];
const rutas = new Set(htmls.map(ruta));

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const r = ruta(rel);
  const alt = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
    .map((m) => ({ lang: m[1], p: new URL(m[2]).pathname }));

  for (const a of alt) {
    if (a.lang === 'x-default') continue;
    if (!rutas.has(a.p) && !rutas.has(a.p.replace(/\/$/, ''))) {
      rotos.push(`${r} declara hreflang="${a.lang}" -> ${a.p}, que NO existe`);
      continue;
    }
    // Reciprocidad: la pagina apuntada tiene que apuntar de vuelta a esta.
    const relOtra = a.p === '/' ? 'index.html' : a.p.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
    const otra = await fs.readFile(path.join(DIST, relOtra), 'utf8').catch(() => null);
    if (!otra) continue;
    const vuelve = [...otra.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)]
      .some((m) => new URL(m[1]).pathname.replace(/\/$/, '') === r.replace(/\/$/, ''));
    if (!vuelve) noReciprocos.push(`${r} -> ${a.p} no apunta de vuelta`);
  }
}

decir(rotos.length === 0, 'ningun hreflang apunta a una pagina que no existe', rotos);
decir(noReciprocos.length === 0, 'todo par de hreflang es reciproco', noReciprocos);

// --- cuanto queda ----------------------------------------------------------
// El informe importa tanto como la puerta: sin este numero, «el sitio esta en
// espanol» pasa por cierto cuando lo estan 7 paginas de 107.
const en = htmls.filter((rel) => !ruta(rel).startsWith('/es/') && ruta(rel) !== '/es/');
const conGemela = en.filter(async () => true);
console.log(`\n  ${es.length} de ${en.length} paginas inglesas tienen version espanola publicada`);
console.log('  Las que no la tienen NO existen en /es/, no llevan hreflang y no entran');
console.log('  en el sitemap: media traduccion publicada es peor que ninguna.');

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log('\n  Todo en verde.');
