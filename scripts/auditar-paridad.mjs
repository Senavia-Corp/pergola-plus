#!/usr/bin/env node
/**
 * Fase 1 — PROMPT 11 + PROMPT D (parte estatica).
 *
 * Compara las 99 paginas construidas contra las 99 del sitio en vivo.
 * No dice "esta bien": mide y reporta cada delta.
 *
 * Lo que comprueba:
 *   1. data-w-id      conjunto a conjunto por pagina. Uno que falte = un
 *                     elemento que dejo de animarse, en silencio.
 *   2. anti-FOUC      que no quede ninguno. Se retiraron los 11 el 19-08-2026 al
 *                     migrar las entradas a CSS; ver FOUC_RETIRADO mas abajo.
 *   3. <head>         title, description, og:*. La unica diferencia ESPERADA es
 *                     el SEO desde el CMS, que se marca aparte.
 *   4. assets         que ninguna ruta local apunte a un archivo inexistente.
 *   5. externos       cero referencias a Webflow.
 *   6. texto          numero de nodos de texto y su contenido, para cazar
 *                     contenido perdido.
 *
 *   node scripts/auditar-paridad.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = await raizHtml();

/**
 * Las 100 capturas del sitio en vivo, DENTRO del repo.
 *
 * Antes esto apuntaba al scratchpad de una sesion que ya no existe, en /tmp.
 * Seguian ahi de milagro: son la referencia contra la que se mide TODA la
 * paridad y no hay forma de regenerarlas —el sitio en vivo puede cambiar o
 * caerse—, asi que un `/tmp` limpiandose se llevaba por delante la unica prueba
 * de que la migracion cuadra. 5,6 MB en disco, 1,1 comprimidos en el packfile:
 * barato para lo que protege.
 */
const VIVO = path.join(RAIZ, 'docs/vivo');

/**
 * Rutas de AUTORIA PROPIA: ya no pretenden reproducir el markup del vivo, asi
 * que sus `data-w-id` ausentes no son una perdida, son una consecuencia.
 *
 * No se excluye la ruta entera: se declaran UNO A UNO los ids que pueden faltar
 * y por que. Si manana desaparece un cuarto, la auditoria lo sigue cazando. Lo
 * que se pierde si esto no existe es peor: el contador global deja de valer
 * cero y con el la unica cifra que de verdad avisa de una animacion muerta.
 */
const PROPIAS = {
  '/contact-us/get-in-touch': {
    razon:
      'hero, datos de contacto y formulario reconstruidos a mano; el revelado lo hace [data-pp-reveal] con animation-timeline, no IX2. Las tres secciones de abajo (condados, reseñas y CTA final) conservan su markup y sus ids, asi que siguen contando',
    permitidos: {
      '15b709b4-f6d7-0064-6f7b-160d6783adab':
        '.wrapper-hero-page -> el hero es ahora un panel propio. No estaba en animaciones.css, asi que no animaba nada: se pierde el id, no una entrada',
      'e2f2465a-47b0-b46c-8bcb-683e8ff0f22b':
        '.box-info-contact -> las cuatro filas de datos son markup propio y entran con [data-pp-reveal]',
      'e2f2465a-47b0-b46c-8bcb-683e8ff0f243':
        '.divider-right -> la tarjeta del formulario es markup propio y entra con [data-pp-reveal]',
    },
  },
  '/products/motorized-louvered-pergolas': {
    razon:
      'ficha recompuesta: el bloque `services` sale entero y su hueco lo ocupa «Comparar las cubiertas». Era el peor bloque de la pagina —1.211 px al 62 % del scroll ofreciendo pavimentos, calzadas y vallas en plena decision de compra— y ademas tapaba el agujero real que midio F0: CERO enlaces visibles a una ficha hermana, frente a 12 al blog. Los dos ids siguen vivos en estaticas/index.html, asi que el selector de animaciones.css no se queda huerfano',
    permitidos: {
      'af395482-435a-2143-5385-d4f1e6bdca74':
        '.header-services -> el bloque de servicios se retira de esta ficha. El unico enlace que valia la pena, /services/pergola-design-construction, se repone en la entradilla del proceso: sin eso el enlazado a servicio pasaba de 7 a 0',
      'af395482-435a-2143-5385-d4f1e6bdca7b':
        '.wrapper-services -> la rejilla de las 7 tarjetas de servicio, con el mismo bloque. Su turno OSCURO lo cubre ahora la seccion de especificaciones, que se monta como componente y por tanto no lleva data-w-id de Webflow: entra con [data-pp-reveal]',
    },
    anadidos: {
      'a36f2a1e-9f59-c2af-809a-f51186a9ca93':
        '.why-choose-content -> la seccion «Como funciona» (§5) es un clon de `why-choose-section`, que YA existe en el CSS de Webflow y en 29 fragmentos vivos, pero en ninguna ficha de producto. Se clona CON su data-w-id a proposito: animaciones.css lo selecciona por atributo, asi que el bloque hereda su entrada sin una linea de CSS nueva. Que el vivo no lo tuviera es exactamente el cambio, no una fuga',
    },
  },
  '/products/solid-roof-pergolas': {
    razon:
      'ficha recompuesta, mismo molde que la de lamas: el bloque `services` sale entero y su hueco lo ocupa «Comparar las cubiertas». Los dos ids de servicios siguen vivos en estaticas/index.html, asi que el selector de animaciones.css no se queda huerfano',
    permitidos: {
      'af395482-435a-2143-5385-d4f1e6bdca74':
        '.header-services -> el bloque de servicios se retira de esta ficha. El unico enlace que valia la pena, /services/pergola-design-construction, se repone en la entradilla del proceso',
      'af395482-435a-2143-5385-d4f1e6bdca7b':
        '.wrapper-services -> la rejilla de las 7 tarjetas de servicio, con el mismo bloque. Su turno OSCURO lo cubre ahora la seccion de especificaciones, que se monta como componente y por tanto no lleva data-w-id de Webflow: entra con [data-pp-reveal]',
    },
    anadidos: {
      'a36f2a1e-9f59-c2af-809a-f51186a9ca93':
        '.why-choose-content -> la seccion «Como funciona» (§5) es un clon de `why-choose-section`, que YA existe en el CSS de Webflow y en 29 fragmentos vivos, pero en ninguna ficha de producto. Se clona CON su data-w-id a proposito: animaciones.css lo selecciona por atributo, asi que el bloque hereda su entrada sin una linea de CSS nueva',
    },
  },
  '/resources/blog': {
    razon: 'listado reconstruido desde el CSV del CMS; el revelado lo hace [data-pp-reveal] con animation-timeline, no IX2',
    permitidos: {
      '4e7e8d11-2645-58a6-0ad5-dc9ad3b4e493':
        '.blog-featured_column -> ahora lleva data-pp-reveal',
      'b2b763d4-d982-efe3-5f4c-bd7f20891915':
        '.blog-grid-item -> data-pp-reveal en los 21 <li>',
      '01ba1a7b-6777-db20-f823-b4019ddf70f5':
        '.blog-filter-section -> ahora es .pp-filtros, position:sticky. NO lleva revelado a proposito: la animacion mueve transform y eso rompe sticky, y una barra fijada arriba no tiene sentido que entre con fade',
    },
  },
};

/**
 * Los 21 /post/<slug> comparten exactamente el mismo conjunto de ausencias, asi
 * que se declara una vez y se expande. La alternativa era pegar 21 entradas
 * identicas y que nadie las volviera a leer.
 */
const POST_PROPIO = {
  razon:
    'del fragmento migrado se usa SOLO el texto: la cabecera traia opacity:0 en linea sin bloque anti-FOUC (sin JS el h1 y la imagen eran invisibles) y la barra lateral eran 10 tarjetas identicas en los 21 posts',
  permitidos: {
    'e3f363b3-599a-9941-9bc4-bf58cc9d3812':
      '.blog_rich-text (h1 + entradilla) -> cabecera propia, sin opacity:0 en linea',
    'de531817-b01a-06e3-4198-ce2865b2d07e':
      '.blog_post-hero-img -> .pp-art-hero, con aspect-ratio fijo y sin opacity:0',
    '45635bac-2fbe-6a6a-f3d5-758b0c33de53':
      '.sidebar_block -> reemplazado por el indice y 3 relacionados de la misma categoria',
  },
};

for (const linea of (await fs.readFile(path.join(RAIZ, 'docs/urls-actuales.txt'), 'utf8')).split('\n')) {
  const r = linea.trim();
  if (r.startsWith('/post/')) PROPIAS[r] = POST_PROPIO;
}

/**
 * data-w-id retirados del SHELL (Nav/Footer) a proposito. Pueden faltar en TODAS
 * las paginas, asi que PROPIAS no sirve: es por ruta y habria que declarar lo
 * mismo 99 veces, con lo que la lista dejaria de leerse.
 *
 * Se declaran UNO A UNO con su motivo, igual que en PROPIAS: la alternativa —
 * excluir el shell del recuento— convertiria el contador global en un numero que
 * ya no avisa de nada.
 */
const PROPIAS_SHELL = {
  'e3bb8397-af45-2730-f4b9-60600b55ee46':
    'item "Landscaping" del submenu de servicios. Apuntaba a /services/landscaping, que no existe ni en el export ni en el vivo: era el unico href="#" vivo del sitio. Retirado en los dos idiomas (Fase 1)',
};

/**
 * Bloques anti-FOUC retirados A PROPOSITO el 19-08-2026. Van UNO A UNO con su motivo,
 * igual que PROPIAS_SHELL: apagar el contador entero convertiria «anti-FOUC faltantes»
 * en un numero que ya no avisa de nada.
 *
 * El bloque `html.w-mod-js:not(.w-mod-ix) [data-w-id="..."]{opacity:0}` decia «manten
 * esto invisible hasta que arranque IX2». Existia SOLO para las entradas por scroll:
 * los 11 ids que lo llevaban son los 11 objetivos de una interaccion SCROLL_INTO_VIEW,
 * comprobado uno a uno. Esas 110 interacciones estan apagadas
 * (scripts/parchear-webflow.mjs) y la entrada la hace ahora src/styles/animaciones.css
 * con animation-timeline: view(), cuyos keyframes terminan en opacity:1.
 *
 * Mantener el bloque dejaria estos 11 elementos invisibles PARA SIEMPRE en las 42
 * paginas que lo llevaban, sin un solo error. Lo vigila check:animaciones.
 */
const FOUC_RETIRADO = {
  '9e6cd8cc-1a46-44d5-b687-f5405cbfa2df': '.section-marquee-logos — entra con animaciones.css; lo vigila tambien check:marquee',
  '75ab0aed-f458-0f6c-c3e3-46c239fb009f': '.intro-left-column — entra de lado a >=992px',
  'de620e7c-00c6-9295-215a-c63c3d0264e4': '.intro-right-column — entra de lado a >=992px',
  'dc99a523-ff98-25c5-a796-1da9e193eb98': '.feature-about-left — entra subiendo (no tiene gemela derecha medida)',
  'd1a9be1f-b69f-a2f0-ecba-d86f44713a94': '.column-left-commercial — entra de lado a >=992px',
  '3a5b213a-e551-9220-6b99-5febdf20190a': '.column-right-commercial — entra de lado a >=992px',
  'e2f2465a-47b0-b46c-8bcb-683e8ff0f22b': '.box-info-contact — entra subiendo',
  '8e25be38-8af5-bd56-fef1-65d902221d20': '.column-left-color — entra de lado a >=992px (20 paginas)',
  '4bd4bb2a-09d0-43e7-8c40-d721bf135688': '.column-right-color — entra de lado a >=992px (20 paginas)',
  '0e17210d-a02e-0587-0e89-a3118db8567e': '.column-left-hero-service — SIN entrada: esta por encima del pliegue (14 paginas)',
  '9d7c5ec8-09e1-d041-2bb5-788cc13790e2': '.column-right-hero-service — SIN entrada: esta por encima del pliegue (14 paginas)',
};

const ids = (s) => new Set([...s.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
const foucIds = (s) => new Set(
  [...s.matchAll(/html\.w-mod-js:not\(\.w-mod-ix\)\s*\[data-w-id="([^"]+)"\]/g)].map((m) => m[1]));
const titulo = (s) => s.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? null;
const desc = (s) => s.match(/<meta content="([^"]*)"\s+name="description"/)?.[1]?.trim() ?? null;

/** Texto visible: se quitan script, style y etiquetas, y se normaliza el espacio. */
function texto(s) {
  const cuerpo = s.slice(s.indexOf('<body'), s.lastIndexOf('</body>'));
  return cuerpo
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Ruta del sitio -> archivo generado. */
function archivoDist(ruta) {
  return ruta === '/' ? path.join(DIST, 'index.html') : path.join(DIST, ruta.slice(1), 'index.html');
}
/** Ruta del sitio -> captura del vivo. */
function archivoVivo(ruta) {
  return path.join(VIVO, (ruta === '/' ? 'index' : ruta.slice(1).replace(/\//g, '__')) + '.html');
}

const rutas = (await fs.readFile(path.join(RAIZ, 'docs/urls-actuales.txt'), 'utf8'))
  .split('\n').map((s) => s.trim()).filter(Boolean);

const publicos = new Set();
async function indexarPublic(dir, base = '') {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const rel = base + '/' + e.name;
    if (e.isDirectory()) await indexarPublic(path.join(dir, e.name), rel);
    else publicos.add(rel);
  }
}
await indexarPublic(path.join(RAIZ, 'public'));

const filas = [];
const sinVivo = [];

for (const ruta of rutas) {
  let gen, viv;
  try { gen = await fs.readFile(archivoDist(ruta), 'utf8'); }
  catch { filas.push({ ruta, error: 'NO GENERADA' }); continue; }
  try { viv = await fs.readFile(archivoVivo(ruta), 'utf8'); }
  catch { sinVivo.push(ruta); continue; }

  const iv = ids(viv), ig = ids(gen);
  const propia = PROPIAS[ruta];
  const ausentes = [...iv].filter((x) => !ig.has(x));
  // Los declarados se apartan; el resto sigue contando como perdida.
  const faltan = ausentes.filter((x) => !propia?.permitidos[x] && !PROPIAS_SHELL[x]);
  const declarados = ausentes.filter((x) => propia?.permitidos[x]);
  const delShell = ausentes.filter((x) => PROPIAS_SHELL[x]);
  // Un id declarado que YA NO falta significa que la declaracion sobra.
  const declaracionesObsoletas = propia
    ? Object.keys(propia.permitidos).filter((x) => !ausentes.includes(x))
    : [];
  // Simetrico de `permitidos`: un bloque NUEVO trae ids que el vivo no tenia, y eso es
  // tan deliberado como una ausencia. Sin declararlos, «sobrantes» se queda clavado en
  // un numero distinto de cero y deja de avisar del dia que se cuele un id por error.
  const anadidos = [...ig].filter((x) => !iv.has(x));
  const sobran = anadidos.filter((x) => !propia?.anadidos?.[x]);
  const sobranDeclarados = anadidos.filter((x) => propia?.anadidos?.[x]);
  // Un id declarado como anadido que ya NO esta significa que la declaracion sobra.
  const anadidosObsoletos = propia?.anadidos
    ? Object.keys(propia.anadidos).filter((x) => !anadidos.includes(x))
    : [];

  const fv = foucIds(viv), fg = foucIds(gen);
  const foucAusentes = [...fv].filter((x) => !fg.has(x));
  const foucFaltan = foucAusentes.filter((x) => !FOUC_RETIRADO[x]);
  const foucRetirados = foucAusentes.filter((x) => FOUC_RETIRADO[x]);
  // Una declaracion que ya no hace falta es ruido que tapa la siguiente: se canta.
  const foucDeclaracionesObsoletas = Object.keys(FOUC_RETIRADO).filter(
    (x) => fv.has(x) && !foucAusentes.includes(x));

  // Assets locales que no existen en public/.
  const rotos = [];
  for (const m of gen.matchAll(/(?:src|href)="(\/(?:images|videos|cms-img|css|js)\/[^"]+)"/g)) {
    const p = decodeURIComponent(m[1]);
    if (!publicos.has(p)) rotos.push(p);
  }
  // srcset aparte
  for (const m of gen.matchAll(/srcset="([^"]+)"/g)) {
    for (const parte of m[1].split(',')) {
      const u = parte.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !publicos.has(decodeURIComponent(u))) rotos.push(u);
    }
  }

  const externos = (gen.match(/website-files\.com/g) ?? []).length;

  const tv = texto(viv), tg = texto(gen);
  const palabrasV = tv.split(' ').length, palabrasG = tg.split(' ').length;

  filas.push({
    ruta,
    idsV: iv.size, idsG: ig.size, faltan, sobran, declarados, delShell, declaracionesObsoletas,
    sobranDeclarados, anadidosObsoletos,
    foucV: fv.size, foucG: fg.size, foucFaltan, foucRetirados, foucDeclaracionesObsoletas,
    tituloIgual: titulo(viv) === titulo(gen),
    tituloV: titulo(viv), tituloG: titulo(gen),
    descIgual: desc(viv) === desc(gen),
    rotos: [...new Set(rotos)],
    externos,
    palabrasV, palabrasG,
    deltaTexto: palabrasV ? Math.abs(palabrasG - palabrasV) / palabrasV : 0,
  });
}

// --- informe ----------------------------------------------------------------
const fallos = filas.filter((f) =>
  f.error || f.faltan?.length || f.sobran?.length || f.foucFaltan?.length ||
  f.rotos?.length || f.externos || f.deltaTexto > 0.02);

console.log('AUDITORIA DE PARIDAD — Fase 1\n');
console.log(`  paginas comparadas: ${filas.length}   sin referencia en vivo: ${sinVivo.length}\n`);

const suma = (k) => filas.reduce((s, f) => s + (f[k]?.length ?? 0), 0);
console.log(`  data-w-id faltantes ....... ${suma('faltan')}`);
console.log(`  data-w-id sobrantes ....... ${suma('sobran')}`);
console.log(`  data-w-id ausentes DECLARADOS ... ${suma('declarados')}  (paginas de autoria propia)`);
console.log(`  data-w-id ANADIDOS declarados ... ${suma('sobranDeclarados')}  (bloques nuevos que el vivo no tenia)`);
for (const [id, razon] of Object.entries(PROPIAS_SHELL)) {
  const n = filas.filter((f) => f.delShell?.includes(id)).length;
  console.log(`  retirados del shell ....... ${n} paginas · ${id.slice(0, 8)}…  ${razon}`);
}
console.log(`  anti-FOUC faltantes ....... ${suma('foucFaltan')}`);
console.log(`  anti-FOUC RETIRADOS ....... ${suma('foucRetirados')} en ${filas.filter((f) => f.foucRetirados?.length).length} paginas (${Object.keys(FOUC_RETIRADO).length} ids declarados)`);
{
  const obs = new Set(filas.flatMap((f) => f.foucDeclaracionesObsoletas ?? []));
  if (obs.size) console.log(`  !! declaraciones de anti-FOUC que ya sobran (el bloque volvio): ${[...obs].join(', ')}`);
}
console.log(`  assets rotos .............. ${suma('rotos')}`);
console.log(`  referencias a Webflow ..... ${filas.reduce((s, f) => s + (f.externos ?? 0), 0)}`);
console.log(`  paginas con delta de texto > 2% ... ${filas.filter((f) => f.deltaTexto > 0.02).length}`);
// El delta de texto es un INFORME, no un fallo, y hay una parte que es constante en
// todas las paginas: el shell propio anade texto que el vivo no tiene. Se deja dicho
// aqui para que nadie vuelva a investigarlo desde cero.
//
//   nav          "View all products", "View all services", "Project Estimator"
//   selector     "EN / English / Español"
//   estimador    el CTA con "Price... cover... minutes... contact... details needed"
//   pie          la etiqueta oculta del campo de correo (accesibilidad)
//
// Son ~23 palabras. En una pagina de ~460 eso ya pasa del 2%, asi que el numero de
// paginas marcadas sube de golpe cuando se anade una sola palabra al shell. Lo que
// hay que mirar en este informe es un delta NEGATIVO o grande: eso si seria contenido
// perdido.
console.log('     (el shell propio anade ~23 palabras a todas: nav, selector de idioma,');
console.log('      CTA del estimador y la etiqueta oculta del pie. Ver el comentario.)');

// Las desviaciones declaradas se IMPRIMEN, no se esconden: si estan aqui es
// para que alguien pueda discutirlas, no para que dejen de verse.
const conDeclarados = filas.filter((f) => f.declarados?.length);
if (conDeclarados.length) {
  console.log('\n--- DESVIACIONES DECLARADAS ---');
  for (const f of conDeclarados) {
    console.log(`\n  ${f.ruta}\n     ${PROPIAS[f.ruta].razon}`);
    for (const id of f.declarados) console.log(`     · ${id.slice(0, 8)}…  ${PROPIAS[f.ruta].permitidos[id]}`);
  }
}
const conAnadidos = filas.filter((f) => f.sobranDeclarados?.length);
if (conAnadidos.length) {
  console.log('\n--- ANADIDOS DECLARADOS ---');
  for (const f of conAnadidos) {
    console.log(`\n  ${f.ruta}`);
    for (const id of f.sobranDeclarados) console.log(`     + ${id.slice(0, 8)}…  ${PROPIAS[f.ruta].anadidos[id]}`);
  }
}
const anadObs = filas.filter((f) => f.anadidosObsoletos?.length);
if (anadObs.length) {
  console.log('\n  !! anadidos declarados que ya no estan (el bloque se fue):');
  for (const f of anadObs) for (const id of f.anadidosObsoletos) console.log(`     ${f.ruta} · ${id}`);
}
const obsoletas = filas.filter((f) => f.declaracionesObsoletas?.length);
if (obsoletas.length) {
  console.log('\n  !! declaraciones que ya sobran (el id volvio a estar):');
  for (const f of obsoletas) for (const id of f.declaracionesObsoletas) console.log(`     ${f.ruta} · ${id}`);
}

// El SEO desde el CMS es una desviacion DELIBERADA: se cuenta aparte.
const seoCambiado = filas.filter((f) => !f.tituloIgual);
console.log(`\n  titles distintos del vivo: ${seoCambiado.length}  (esperado: el SEO desde el CMS)`);
const seoInesperado = seoCambiado.filter((f) => f.tituloV !== 'Pergola Plus Florida');
if (seoInesperado.length) {
  console.log(`  !! ${seoInesperado.length} con title distinto SIN ser el arreglo de SEO:`);
  for (const f of seoInesperado.slice(0, 10)) console.log(`     ${f.ruta}\n        vivo: ${f.tituloV}\n        gen : ${f.tituloG}`);
}

if (fallos.length) {
  console.log(`\n--- ${fallos.length} PAGINAS CON HALLAZGOS ---`);
  for (const f of fallos.slice(0, 25)) {
    console.log(`\n  ${f.ruta}`);
    if (f.error) { console.log(`     ${f.error}`); continue; }
    if (f.faltan.length) console.log(`     data-w-id FALTAN (${f.faltan.length}): ${f.faltan.slice(0, 4).join(', ')}`);
    if (f.sobran.length) console.log(`     data-w-id sobran (${f.sobran.length}): ${f.sobran.slice(0, 4).join(', ')}`);
    if (f.foucFaltan.length) console.log(`     anti-FOUC faltan: ${f.foucFaltan.join(', ')}`);
    if (f.rotos.length) console.log(`     assets rotos (${f.rotos.length}): ${f.rotos.slice(0, 4).join(', ')}`);
    if (f.externos) console.log(`     referencias a Webflow: ${f.externos}`);
    if (f.deltaTexto > 0.02) console.log(`     texto: vivo ${f.palabrasV} palabras vs generado ${f.palabrasG}  (${(100 * f.deltaTexto).toFixed(1)}%)`);
  }
  if (fallos.length > 25) console.log(`\n  ... y ${fallos.length - 25} paginas mas`);
} else {
  console.log('\n  SIN HALLAZGOS: las 99 paginas cuadran.');
}

await fs.writeFile(path.join(RAIZ, 'docs/auditoria-paridad.json'), JSON.stringify({ filas, sinVivo }, null, 2));
console.log(`\n  detalle -> docs/auditoria-paridad.json`);
