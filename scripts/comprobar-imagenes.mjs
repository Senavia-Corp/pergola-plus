#!/usr/bin/env node
/**
 * Puerta de imagenes: demuestra que TODO lo que el sitio pinta esta en local.
 *
 * Todo lo que el sitio pide SI esta en git: public/images, public/cms-img y los
 * dos videos que el HTML referencia. El staging (assets-migracion/{content,design})
 * sigue fuera, y se reconstruye desde ~/Downloads con instalar-assets.mjs.
 *
 * No siempre fue asi, y por eso existe el check 4b. public/cms-img y public/videos
 * estuvieron en .gitignore mientras el proyecto desplegaba por `git push`: Vercel
 * construye desde un CLON, alli no existian, y 429 urls devolvian 404 en el sitio
 * desplegado con esta puerta en verde — porque comprobaba el disco de esta maquina,
 * que es justo donde instalar-assets.mjs los acababa de poner. Estar en disco no
 * demuestra nada sobre lo que se despliega. El invariante es estar versionado.
 *
 * Se ejecuta sobre dist/ DESPUES de npm run build, igual que check:blog:
 * lo que importa no es lo que dice el manifest, es lo que pide el HTML servido.
 *
 *   npm run build && npm run check:imagenes
 */
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const STAGING = path.join(RAIZ, 'assets-migracion');
const PUBLIC = path.join(RAIZ, 'public');
const DIST = await raizHtml();
const EXPORT = '/Users/senavia/Downloads/Webflow Pergola Plus Florida';

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'OK  ' : 'FALLA'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 15)) console.log(`         ${d}`);
    if (detalle.length > 15) console.log(`         ... y ${detalle.length - 15} mas`);
  }
};

const existe = async (p) => !!(await fs.stat(p).catch(() => null));

async function listar(dir, base = dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listar(p, base)));
    else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}

console.log('Puerta de imagenes\n');

// --- 0. De donde se ha leido -------------------------------------------------
// Se afirma ANTES de comparar nada: la leccion de check:generadores es que una
// puerta que pasa porque no pudo ejecutarse es peor que no tener puerta.
const hayExport = await existe(EXPORT);
const hayDist = await existe(DIST);
console.log(`  fuente  manifest   ${path.relative(RAIZ, path.join(STAGING, 'manifest.json'))}  (en git)`);
console.log(`  fuente  binarios   ${path.relative(RAIZ, STAGING)}/{content,design}  (NO en git)`);
console.log(`  fuente  export     ${EXPORT}  ${hayExport ? '(presente)' : '!! AUSENTE'}`);
console.log(`  fuente  servido    dist/  ${hayDist ? '' : '!! AUSENTE'}\n`);

decir(hayDist, 'dist/ existe (ejecuta npm run build antes que esta puerta)');
if (!hayDist) process.exit(1);

const manifest = JSON.parse(await fs.readFile(path.join(STAGING, 'manifest.json'), 'utf8'));
const mapa = JSON.parse(await fs.readFile(path.join(RAIZ, 'src/lib/img-map.json'), 'utf8'));

// --- 1. Manifest -> staging: el binario esta y es el que dice ----------------
{
  const faltan = [], corruptos = [];
  for (const a of manifest.assets) {
    const p = path.join(STAGING, a.file);
    const buf = await fs.readFile(p).catch(() => null);
    if (!buf) { faltan.push(a.file); continue; }
    if (createHash('sha256').update(buf).digest('hex') !== a.sha256) corruptos.push(a.file);
  }
  decir(!faltan.length, `las ${manifest.assets.length} imagenes del manifest estan en el staging`, faltan);
  decir(!corruptos.length, 'ninguna difiere de su sha256', corruptos);
}

// --- 2. Staging -> public: instaladas donde el sitio las pide ----------------
{
  const faltan = [];
  for (const a of manifest.assets) {
    const publica = a.assetClass === 'design'
      ? a.publicPath
      : '/' + path.join('cms-img', path.relative('content', a.file)).split(path.sep).join('/');
    if (!(await existe(path.join(PUBLIC, publica.slice(1))))) faltan.push(`${publica}  <- ${a.file}`);
  }
  decir(!faltan.length, 'todas instaladas en public/ (ejecuta instalar-assets.mjs si falla)', faltan);
}

// --- 3. img-map.json al dia respecto del manifest ----------------------------
// Lo genera instalar-assets.mjs. Si el manifest se regenero y el mapa no, las
// plantillas de CMS lanzan en build con "URL sin mapear" — pero solo en la
// pagina que use esa imagen, asi que puede pasar semanas sin verse.
{
  const urlsManifest = new Set(manifest.assets.flatMap((a) => a.sourceUrls));
  const sinMapear = [...urlsManifest].filter((u) => !mapa[u]);
  const sobran = Object.keys(mapa).filter((u) => !urlsManifest.has(u));
  decir(!sinMapear.length, `img-map.json cubre las ${urlsManifest.size} urls del manifest`, sinMapear);
  decir(!sobran.length, 'img-map.json no tiene urls huerfanas', sobran);
}

// --- 4. Lo que el sitio SERVIDO pide existe en disco -------------------------
// La comprobacion que de verdad importa: no lo que el manifest promete, sino lo
// que el HTML construido va a pedirle al navegador. Cubre src/ y srcset, url()
// del CSS en linea, y los <video>/<source>.
const pedidas = new Map();   // ruta -> quien la pide
{
  for (const f of await listar(DIST)) {
    if (!/\.(html|css|js|xml)$/.test(f)) continue;
    const txt = await fs.readFile(path.join(DIST, f), 'utf8');
    const rutas = [
      ...[...txt.matchAll(/(?:src|srcset|href|content)\s*=\s*"([^"]+)"/g)]
        .flatMap((m) => m[1].split(',').map((p) => p.trim().split(/\s+/)[0])),
      ...[...txt.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1].trim()),
    ];
    for (const r of rutas)
      if (/^\/(images|cms-img|videos)\//.test(r) && !pedidas.has(r)) pedidas.set(r, f);
  }
  const faltan = [];
  for (const [r, quien] of pedidas)
    if (!(await existe(path.join(PUBLIC, decodeURIComponent(r).slice(1)))))
      faltan.push(`${r}   <- dist/${quien}`);
  decir(!faltan.length, `las ${pedidas.size} rutas de asset que pide dist/ existen en public/`, faltan);
  console.log(`         (${pedidas.size} rutas unicas referenciadas)`);
}

// --- 4b. ...y ademas esta en git --------------------------------------------
// El check 4 mira el disco de ESTA maquina, donde instalar-assets.mjs acaba de
// dejarlo todo. Vercel no ve este disco: clona el repo. Lo que no este versionado
// no llega, y el sintoma es exactamente el que ya se produjo — 404 en el sitio
// desplegado con la puerta local en verde. Mismo patron que el check 6b.
{
  const { execSync } = await import('node:child_process');
  const enGit = new Set(
    execSync('git ls-files public', { cwd: RAIZ, encoding: 'utf8' }).split('\n').filter(Boolean),
  );
  const sinVersionar = [];
  for (const [r, quien] of pedidas) {
    const rel = 'public' + decodeURIComponent(r);
    if (!enGit.has(rel)) sinVersionar.push(`${rel}   <- dist/${quien}`);
  }
  decir(!sinVersionar.length,
    `las ${pedidas.size} rutas que pide dist/ estan versionadas en git`, sinVersionar);
}

// --- 5. Cero dependencias del CDN de Webflow --------------------------------
// El dia que se cancele Webflow, cualquier url que quede aqui se vuelve un hueco.
{
  const culpables = [];
  for (const f of await listar(DIST)) {
    if (!/\.(html|css|js|xml)$/.test(f)) continue;
    const txt = await fs.readFile(path.join(DIST, f), 'utf8');
    const n = (txt.match(/website-files\.com|assets-website-files\.com/g) ?? []).length;
    if (n) culpables.push(`dist/${f}  (${n})`);
  }
  decir(!culpables.length, 'dist/ no referencia el CDN de Webflow', culpables);
}

// --- 6. El export original sigue siendo regenerable --------------------------
// No es cosmetico: public/images/ y public/videos/ se copian VERBATIM del export,
// y el export vive fuera del repo. Si desaparece, instalar-assets.mjs no puede
// rehacer un clon limpio aunque el manifest este perfecto.
{
  decir(hayExport, `el export de Webflow sigue en ${EXPORT}`,
    ['sin el, instalar-assets.mjs no puede reconstruir public/images ni public/videos']);
  if (hayExport) {
    const enExport = new Set(await fs.readdir(path.join(EXPORT, 'images')).catch(() => []));
    const enPublic = new Set(await fs.readdir(path.join(PUBLIC, 'images')).catch(() => []));
    const faltan = [...enExport].filter((n) => !n.startsWith('.') && !enPublic.has(n));
    decir(!faltan.length, `public/images/ tiene los ${enExport.size} archivos del export`, faltan);
  }
}

// --- 6b. public/images/ no ha perdido nada de git ---------------------------
// instalar-assets.mjs hacia `rm -rf public/images` antes de copiar el export, y
// esa carpeta SI esta versionada: 20 de sus 153 archivos no vienen del export
// (En.svg, Sp.svg, project-estimator.svg, Icon-*.svg, variantes -p-NNN) y
// desaparecian en cada ejecucion. Solo se salvaron por estar en git.
{
  const { execSync } = await import('node:child_process');
  const enGit = execSync('git ls-files public/images', { cwd: RAIZ, encoding: 'utf8' })
    .split('\n').filter(Boolean);
  const faltan = [];
  for (const f of enGit) if (!(await existe(path.join(RAIZ, f)))) faltan.push(f);
  decir(!faltan.length, `los ${enGit.length} archivos versionados de public/images/ siguen en disco`, faltan);
}

// --- 6c. Las imagenes regeneradas con IA siguen siendo las regeneradas -------
// public/images/ tiene DOS fuentes en conflicto: git (esta versionada) y el export
// de Webflow (instalar-assets.mjs lo copia encima). Cuando una foto se regenera
// con IA, el export sigue teniendo la vieja, asi que cualquier ejecucion de
// instalar-assets la revertiria. Ese script ya salta estas rutas; esto comprueba
// el RESULTADO, que es lo que importa: si alguien las pisa por otra via —un
// checkout parcial, una copia a mano, una version del script sin la guarda— la
// puerta falla en vez de que la mejora se pierda en silencio.
//
// Se compara contra el sha256 anotado, no contra "es distinta del export": una
// tercera version tampoco vale.
{
  const reg = JSON.parse(
    await fs.readFile(path.join(STAGING, 'regeneradas.json'), 'utf8').catch(() => '{"regeneradas":[]}'),
  );
  if (!reg.regeneradas.length) {
    console.log('  ---   no hay imagenes regeneradas con IA todavia');
  } else {
    const revertidas = [], ausentes = [];
    for (const r of reg.regeneradas) {
      const buf = await fs.readFile(path.join(PUBLIC, r.ruta.slice(1))).catch(() => null);
      if (!buf) { ausentes.push(r.ruta); continue; }
      const sha = createHash('sha256').update(buf).digest('hex');
      if (sha === r.sha256) continue;
      revertidas.push(
        `${r.ruta}  ${sha === r.sha256Export
          ? 'REVERTIDA al original del export (instalar-assets sin la guarda?)'
          : 'es una tercera version, ni la regenerada ni la del export'}`,
      );
    }
    decir(!ausentes.length, `las ${reg.regeneradas.length} imagenes regeneradas siguen en disco`, ausentes);
    decir(!revertidas.length, 'ninguna imagen regenerada ha sido pisada', revertidas);
  }
}

// --- 7. Huerfanos: instalado pero que nadie pide -----------------------------
// No falla la puerta. Son bytes que se van a subir a Sanity sin que nadie los
// use, y en la Fase 3 eso es dinero y ruido en el dataset.
{
  const servidas = new Set();
  for (const f of await listar(DIST)) {
    if (!/\.(html|css|js|xml)$/.test(f)) continue;
    const txt = await fs.readFile(path.join(DIST, f), 'utf8');
    for (const m of txt.matchAll(/\/(?:cms-img)\/[^"'\s,)]+/g)) servidas.add(decodeURIComponent(m[0]));
  }
  const enDisco = (await listar(path.join(PUBLIC, 'cms-img'))).map((f) => `/cms-img/${f}`);
  const huerfanas = enDisco.filter((f) => !servidas.has(f));
  const mb = (
    huerfanas.reduce((s, f) => s + (manifest.assets.find((a) =>
      '/cms-img/' + path.relative('content', a.file).split(path.sep).join('/') === f)?.bytes ?? 0), 0) / 1048576
  ).toFixed(1);
  console.log(`  AVISO ${huerfanas.length} de ${enDisco.length} imagenes del CMS no las pide ninguna pagina (${mb} MB)`);
  for (const f of huerfanas.slice(0, 8)) console.log(`         ${f}`);
  if (huerfanas.length > 8) console.log(`         ... y ${huerfanas.length - 8} mas`);
}

console.log(fallos ? `\n  ${fallos} comprobacion(es) FALLAN\n` : '\n  Todo en verde.\n');
process.exit(fallos ? 1 : 0);
