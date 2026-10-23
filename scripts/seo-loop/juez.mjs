#!/usr/bin/env node
/**
 * Juez del loop SEO (docs/seo-loop/00-ESPECIFICACION-LOOP.md §2 y §4). Lo ejecuta un subagente NUEVO
 * en cada cierre de fase, y solo esto:
 *
 *     node scripts/seo-loop/juez.mjs
 *
 * Construye y comprueba, en serie (una tarea pesada a la vez, §7):
 *   J0  integridad: los ficheros fijados coinciden con lo firmado en HASHES.txt
 *   J1  `npm run check` de produccion (build + 25 puertas), PUERTO_FORMULARIOS=4351 libre
 *   J3  crawl.mjs: 0 en las 15 metricas de fallo
 *   J4  check:urls-antiguas (las 64 URL antiguas, sin y con barra, en un salto)
 *   J5–J14, J16  sobre el dist de produccion; J6 y J17 tambien sobre Sanity (solo lectura)
 *   J15 Lighthouse x3 (16 plantillas x 2 dispositivos)
 *   J2  build cerrado (sin PUBLIC_ES_PRODUCCION) + check:noindex — al final: reescribe el dist
 *   J17 fuera del loop
 * Con docs/seo-loop/RELEASE.json, el build lee el contenido del loop (PP_PERSPECTIVA, §5 F1).
 *
 * Imprime una linea por puerta y, al final, el JSON del resultado. Sale con 0 SOLO si J0–J17 pasan.
 * `--solo J5,J8` corre solo esas sobre el dist que haya (diagnostico del implementador): sale
 * `"parcial": true` y NO vale como corrida del juez.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { comprobar } from './lib/fijados.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const SOLO = process.argv.includes('--solo') ? process.argv[process.argv.indexOf('--solo') + 1].split(',') : null;
const quiere = (j) => !SOLO || SOLO.includes(j);
const marca = new Date().toISOString().replace(/[:.]/g, '-');
const CARPETA = `/Users/senavia/Sites/pp-exports/loop-juez/${marca}`;
fs.mkdirSync(CARPETA, { recursive: true });

const RELEASE = fs.existsSync(path.join(RAIZ, 'docs/seo-loop/RELEASE.json')) ? JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/seo-loop/RELEASE.json'), 'utf8')) : {};
const PROD = { PP_FUENTE: 'sanity', PUBLIC_ES_PRODUCCION: '1', PUBLIC_SITE_URL: 'https://www.pergolaplusflorida.com', PUERTO_FORMULARIOS: '4351', ...(RELEASE.perspectiva ? { PP_PERSPECTIVA: RELEASE.perspectiva } : {}) };
// En modo cerrado las variables de produccion se QUITAN (null): vacias, Astro rechaza `site` («Invalid URL»).
const CERRADO = { PP_FUENTE: 'sanity', PUBLIC_ES_PRODUCCION: null, PUBLIC_SITE_URL: null, ...(RELEASE.perspectiva ? { PP_PERSPECTIVA: RELEASE.perspectiva } : {}) };

const resultados = {};
const anotar = (j, ok, fallos = [], extra = {}) => {
  resultados[j] = { ok, fallos: fallos.length, muestra: fallos.slice(0, 10), ...extra };
  console.log(`${ok ? 'PASA ' : 'FALLA'} ${j}${fallos.length ? `  (${fallos.length}) ${fallos[0]}` : ''}`);
};
/** Corre un comando con su salida a un log de la carpeta de la corrida. */
const correr = (nombre, cmd, args, env = {}, cwd = RAIZ) => {
  const entorno = { ...process.env };
  for (const [k, v] of Object.entries(env)) if (v === null) delete entorno[k]; else entorno[k] = v;
  const r = spawnSync(cmd, args, { cwd, env: entorno, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, timeout: 90 * 60 * 1000 });
  fs.writeFileSync(path.join(CARPETA, `${nombre}.log`), `${r.stdout ?? ''}\n${r.stderr ?? ''}\nexit ${r.status}\n`);
  return r;
};
/** Una puerta J5–J17: su ultima linea es el JSON de lib/comun.mjs `informe`. */
const puerta = (j, fichero, args = []) => {
  if (!quiere(j)) return;
  const r = correr(j, 'node', [path.join(RAIZ, 'scripts/seo-loop', fichero), ...args]);
  const ultima = (r.stdout ?? '').trim().split('\n').at(-1);
  let res; try { res = JSON.parse(ultima); } catch { res = { ok: false, muestra: [`la puerta no termino bien (exit ${r.status}): ${(r.stderr ?? '').slice(-300)}`], fallos: 1 }; }
  const ok = r.status === 0 && res.ok === true;
  resultados[j] = { ...res, ok };
  console.log(`${ok ? 'PASA ' : 'FALLA'} ${j}${res.fallos ? `  (${res.fallos}) ${res.muestra?.[0] ?? ''}` : ''}`);
};
const puertoLibre = (p) => spawnSync('lsof', ['-nP', `-iTCP:${p}`, '-sTCP:LISTEN'], { encoding: 'utf8' }).stdout.trim() === '';

// J0 · integridad
if (quiere('J0')) { const f = comprobar(); anotar('J0', !f.length, f); }

correr('git-fetch', 'git', ['fetch', '--quiet', 'origin', 'main']);
if (['J6', 'J17'].some(quiere)) {
  const r = correr('sanity-leer', 'npx', ['sanity', 'exec', '../scripts/seo-loop/lib/sanity-leer.mjs', '--with-user-token'], {}, path.join(RAIZ, 'studio'));
  if (r.status !== 0) for (const j of ['J6', 'J17']) if (quiere(j)) anotar(j, false, [`NO CORRIO: no se pudo leer Sanity (${(r.stderr ?? '').slice(-200)})`]);
}

// J1 · las 26 puertas de produccion (construye el dist de produccion que usan las demas)
if (quiere('J1')) {
  if (!puertoLibre(4351)) anotar('J1', false, ['NO CORRIO: el puerto 4351 (PUERTO_FORMULARIOS) esta ocupado']);
  else {
    const r = correr('J1-check', 'npm', ['run', 'check'], PROD);
    const puertas = ((r.stdout ?? '').match(/^> pergola-plus@[^ ]+ check:/gm) ?? []).length;
    anotar('J1', r.status === 0 && puertas === 25, r.status === 0 && puertas === 25 ? [] : [`npm run check sale con ${r.status}; ${puertas}/25 puertas ejecutadas (ver ${CARPETA}/J1-check.log)`]);
  }
}
const distProd = fs.existsSync(path.join(RAIZ, 'dist/client/sitemap.xml'));

// J3 · crawl
if (quiere('J3')) {
  const r = correr('J3-crawl', 'node', ['scripts/perf/crawl.mjs', path.join(CARPETA, 'crawl')]);
  const METRICAS = ['canonicalNoAuto', 'hreflangNoReciproco', 'sinXDefault', 'h1Mal', 'saltoEncabezado', 'imgSinAlt', 'imgSinDim', 'jsonldRoto', 'jsonldIdiomaMal', 'enlacesRotos', 'fueraSitemap', 'enSitemapConNoindex', 'titulosDup', 'descDup', 'sinProfundidad'];
  let f = [];
  try {
    const res = JSON.parse(fs.readFileSync(path.join(CARPETA, 'crawl/crawl-resumen.json'), 'utf8'));
    const n = (x) => (Array.isArray(x) ? x.length : typeof x === 'object' ? Object.keys(x).length : x);
    f = METRICAS.filter((m) => n(res[m]) !== 0).map((m) => `${m}: ${n(res[m])}`);
    if (!distProd) f.push('el dist no es de produccion (sin sitemap): el crawl no vale');
  } catch (e) { f = [`NO CORRIO: ${r.status} ${e.message}`]; }
  anotar('J3', !f.length, f);
}

// J4 · URL antiguas
if (quiere('J4')) {
  const r = correr('J4-urls-antiguas', 'node', ['scripts/comprobar-urls-antiguas.mjs']);
  anotar('J4', r.status === 0 && /\b64\b/.test(r.stdout ?? ''), r.status === 0 ? [] : [`check:urls-antiguas sale con ${r.status}`]);
}

for (const [j, f] of [['J5', 'j05-seo-estricto.mjs'], ['J6', 'j06-sanity-completo.mjs'], ['J7', 'j07-jsonld-google.mjs'], ['J8', 'j08-silo.mjs'], ['J9', 'j09-lastmod.mjs'], ['J10', 'j10-es-florida.mjs'], ['J11', 'j11-geo.mjs'], ['J12', 'j12-aeo.mjs'], ['J13', 'j13-contenido-local.mjs'], ['J14', 'j14-canibalizacion.mjs'], ['J16', 'j16-registro-cliente.mjs']]) {
  if (resultados[j]) continue; // ya anotada como NO CORRIO
  puerta(j, f);
}
puerta('J15', 'j15-lighthouse.mjs', [path.join(CARPETA, 'lighthouse')]);

// J2 · modo cerrado (reescribe el dist: va despues de todo lo que lee el de produccion)
if (quiere('J2')) {
  const b = correr('J2-build-cerrado', 'npm', ['run', 'build'], CERRADO);
  const n = b.status === 0 ? correr('J2-noindex', 'npm', ['run', 'check:noindex'], CERRADO) : null;
  anotar('J2', b.status === 0 && n?.status === 0, b.status !== 0 ? [`build cerrado sale con ${b.status}`] : n.status !== 0 ? ['check:noindex en rojo con el build cerrado'] : []);
}
if (!resultados.J17) puerta('J17', 'j17-fuera-del-loop.mjs');

const ok = Object.values(resultados).every((r) => r.ok) && (SOLO ? true : Object.keys(resultados).length === 18);
const commit = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).stdout.trim();
const sucio = spawnSync('git', ['status', '--porcelain'], { cwd: RAIZ, encoding: 'utf8' }).stdout.trim() !== '';
const salida = { fecha: new Date().toISOString(), commit, arbolSucio: sucio, parcial: Boolean(SOLO), perspectiva: RELEASE.perspectiva ?? 'publicado', carpeta: CARPETA, ok, pasan: Object.values(resultados).filter((r) => r.ok).length, total: Object.keys(resultados).length, resultados };
fs.writeFileSync(path.join(CARPETA, 'juez.json'), JSON.stringify(salida, null, 2));
console.log(JSON.stringify(salida));
process.exit(ok ? 0 : 1);
