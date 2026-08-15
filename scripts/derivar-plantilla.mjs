#!/usr/bin/env node
/**
 * Fase 1 — deriva la plantilla de una coleccion a partir de las paginas REALES.
 *
 * EL PROBLEMA
 * El export de Webflow trae las plantillas de detalle con los bindings VACIOS
 * (w-dyn-bind-empty): el HTML esta, pero sin contenido. Adivinar que elemento
 * corresponde a que campo del CSV es justo el tipo de trabajo donde se cuelan
 * errores silenciosos.
 *
 * LA SOLUCION
 * El sitio en vivo renderiza esas mismas plantillas con el contenido puesto.
 * Verificado: detail_products.html y /products/cabanas tienen las mismas 7
 * secciones en el mismo orden y los mismos 32 data-w-id. Es la misma plantilla.
 *
 * Asi que: por cada item se coge SU pagina renderizada y se sustituyen los
 * valores de SU fila del CSV por marcadores. Si la derivacion es correcta, las N
 * plantillas resultantes salen IDENTICAS entre si.
 *
 * Eso es lo que hace este script auto-verificable: no dice "he mapeado los
 * campos", demuestra que el mapeo explica TODA la variacion entre items. Lo que
 * quede distinto entre plantillas es exactamente lo que no se ha sabido mapear,
 * y se reporta.
 *
 *   node scripts/derivar-plantilla.mjs <coleccion>
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const VIVO = '/private/tmp/claude-501/-Users-senavia/c6c8d2e5-148e-47e5-b6cf-e7286ffbc547/scratchpad/vivo';
const EXPORT = '/Users/senavia/Downloads/Webflow Pergola Plus Florida';

/** Campos administrativos de Webflow: no son contenido. */
const ADMIN = new Set(['Collection ID', 'Locale ID', 'Item ID', 'Archived', 'Draft',
  'Created On', 'Updated On', 'Published On']);

export const COLECCIONES = {
  products: { csv: '- Products -', ruta: '/products' },
  services: { csv: '- Services -', ruta: '/services' },
  post: { csv: 'Blog Posts', ruta: '/post' },
  project: { csv: 'Projects', ruta: '/project' },
  brands: { csv: 'Brands', ruta: '/brands' },
  countries: { csv: 'Countries', ruta: '/countries' },
  'pergolas-contractors': { csv: 'Pergolas Contractors', ruta: '/pergolas-contractors' },
  articles: { csv: 'Articles', ruta: '/articles' },
};

// El parser CSV vive en lib/csv.mjs: lo comparten varios scripts.
export { parseCSV } from './lib/csv.mjs';

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escaparAttr = (s) => escapar(s).replace(/"/g, '&quot;');

/**
 * Encuentra el cierre de la etiqueta que empieza en `i`, contando anidamiento.
 * Necesario porque el HTML del sitio viene minificado y sin sangria.
 */
function cierreDe(html, i) {
  const tag = html.slice(i + 1, html.indexOf(' ', i) < 0 ? i + 5 : html.indexOf(' ', i)).replace(/[>\s].*/s, '');
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = i;
  let prof = 0, m;
  while ((m = re.exec(html))) {
    prof += m[0].startsWith('</') ? -1 : 1;
    if (prof === 0) return m.index + m[0].length;
  }
  return -1;
}

/**
 * Colapsa las listas de coleccion anidadas a un solo item.
 *
 * Las plantillas de detalle no solo pintan los campos del item: llevan dentro
 * listas de OTRAS colecciones filtradas por el item (Feature Products, FAQs,
 * Brochures) y la galeria propia. Cada producto tiene un numero distinto de
 * elementos ahi, y por eso las plantillas derivadas no salian identicas.
 *
 * Se deja el primer w-dyn-item de cada lista como cuerpo del bucle y se marca
 * cuantos habia. Lo que queda ya deberia ser identico entre items.
 */
export function colapsarListas(html) {
  // Una sola pasada, de izquierda a derecha, saltando el bloque ya tratado.
  // (Intente hacerlo con reemplazo iterativo y renombrando la clase a
  // "w-dyn-items-ok", pero eso SIGUE conteniendo "w-dyn-items" como subcadena y
  // el patron volvia a casar: 40 vueltas sobre la misma lista.)
  const listas = [];
  const trozos = [];
  const re = /<div[^>]*class="[^"]*w-dyn-items[^"]*"/g;
  let pos = 0, m;
  while ((m = re.exec(html))) {
    if (m.index < pos) continue;               // dentro de una lista ya tratada
    const fin = cierreDe(html, m.index);
    if (fin < 0) break;
    const bloque = html.slice(m.index, fin);
    const abre = bloque.indexOf('>') + 1;
    const cierra = bloque.lastIndexOf('</div>');
    const interior = bloque.slice(abre, cierra);

    // w-dyn-item de primer nivel dentro de esta lista.
    const items = [];
    let j = 0;
    while (j < interior.length) {
      const k = interior.indexOf('w-dyn-item', j);
      if (k < 0) break;
      const ini = interior.lastIndexOf('<', k);
      const f = cierreDe(interior, ini);
      if (f < 0) break;
      items.push(interior.slice(ini, f));
      j = f;
    }

    trozos.push(html.slice(pos, m.index));
    trozos.push(bloque.slice(0, abre) + `<!--LISTA:${listas.length}-->` + bloque.slice(cierra));
    listas.push({
      clase: bloque.match(/class="([^"]*)"/)?.[1] ?? '',
      n: items.length,
      item: items[0] ?? '',
    });
    pos = fin;
    re.lastIndex = fin;
  }
  trozos.push(html.slice(pos));
  return { plantilla: trozos.join(''), listas };
}

/**
 * Cuerpo de la pagina: entre el cierre del <nav class="menu"> y el <footer>.
 *
 * OJO: no vale con buscar el primer </nav>. El menu anida TRES niveles de <nav>
 * (nav.menu > nav.nav-menu > nav.dropdown-list-*), asi que el primer cierre
 * corresponde a un dropdown y se colaria medio menu dentro del "cuerpo".
 * Hay que contar la profundidad.
 */
export function cuerpo(html) {
  const i = html.indexOf('<nav');
  if (i < 0) throw new Error('no encuentro el nav');
  let prof = 0, fin = -1;
  for (const m of html.slice(i).matchAll(/<nav\b|<\/nav>/g)) {
    prof += m[0] === '</nav>' ? -1 : 1;
    if (prof === 0) { fin = i + m.index + m[0].length; break; }
  }
  const b = html.lastIndexOf('<footer');
  if (fin < 0 || b < 0) throw new Error('no encuentro el cierre del nav o el footer');
  return html.slice(fin, b);
}

/**
 * Sustituye en `html` los valores de `fila` por marcadores {{Campo}} o
 * {{Campo#n}} cuando el campo tiene varios valores (galerias).
 */
export function marcar(html, fila) {
  let s = html;
  const usados = [];

  // De mas largo a mas corto: si no, un valor corto que sea subcadena de otro
  // lo parte por la mitad.
  //
  // Se descartan los valores GENERICOS. Los booleanos del CSV ("true"/"false")
  // casaban con data-hover="false" del nav y marcaban medio menu como si fuera
  // un campo. Un valor que no identifica al item no sirve para derivar nada.
  const GENERICOS = /^(true|false|yes|no|\d+|[\d.,-]+)$/i;
  const campos = Object.entries(fila)
    .filter(([k, v]) => !ADMIN.has(k) && v && v.trim().length > 3 && !GENERICOS.test(v.trim()))
    .sort((a, b) => b[1].length - a[1].length);

  for (const [campo, valor] of campos) {
    const v = valor.trim();
    // Multivalor (galerias): "url1; url2; url3"
    const partes = v.includes('; ') ? v.split(';').map((x) => x.trim()).filter(Boolean) : [v];
    partes.forEach((parte, i) => {
      const marca = partes.length > 1 ? `{{${campo}#${i}}}` : `{{${campo}}}`;
      // Hay que probar tambien la forma URL-codificada: el lightbox de Webflow
      // guarda su configuracion en un <script type="application/json"> metido
      // dentro de un atributo, y ahi las URLs de la galeria salen escapadas con
      // %3A%2F%2F. Sin este candidato, la galeria parecia variacion no explicada.
      let hecho = false;
      for (const cand of [parte, escapar(parte), escaparAttr(parte), encodeURIComponent(parte)]) {
        if (cand.length > 3 && s.includes(cand)) { s = s.replaceAll(cand, marca); hecho = true; }
      }
      if (hecho) usados.push(marca);
    });
  }
  return { plantilla: s, usados };
}

// ---------------------------------------------------------------------------
const nombre = process.argv[2];
if (!nombre || !COLECCIONES[nombre]) {
  console.error(`Uso: node scripts/derivar-plantilla.mjs <${Object.keys(COLECCIONES).join('|')}>`);
  process.exit(1);
}
const col = COLECCIONES[nombre];
const ficheros = await fs.readdir(path.join(EXPORT, 'CMS'));
const csv = ficheros.find((f) => f.includes(col.csv));
const filas = parseCSV(await fs.readFile(path.join(EXPORT, 'CMS', csv), 'utf8'));

const derivadas = [];
for (const fila of filas) {
  const f = path.join(VIVO, `${col.ruta.slice(1)}__${fila.Slug}.html`);
  let html;
  try { html = await fs.readFile(f, 'utf8'); }
  catch { console.error(`  !! sin pagina en vivo para ${fila.Slug}`); continue; }
  // Primero se colapsan las listas anidadas (su numero de elementos varia por
  // item), y luego se marcan los campos propios del item.
  const { plantilla: sinListas, listas } = colapsarListas(cuerpo(html));
  const { plantilla, usados } = marcar(sinListas, fila);
  derivadas.push({ slug: fila.Slug, plantilla, usados, listas });
}

// --- LA COMPROBACION --------------------------------------------------------
// Si el mapeo explica toda la variacion, las N plantillas son identicas.
const grupos = new Map();
for (const d of derivadas) {
  const k = d.plantilla;
  if (!grupos.has(k)) grupos.set(k, []);
  grupos.get(k).push(d.slug);
}

console.log(`\n=== ${nombre} — ${derivadas.length} items ===`);
console.log(`plantillas distintas tras marcar: ${grupos.size}   (1 = derivacion completa)\n`);

const orden = [...grupos.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [, slugs] of orden) console.log(`   ${String(slugs.length).padStart(3)} items  ${slugs.slice(0, 4).join(', ')}${slugs.length > 4 ? ', ...' : ''}`);

// Listas anidadas detectadas (colecciones filtradas por el item).
const l0 = derivadas[0]?.listas ?? [];
if (l0.length) {
  console.log(`\nlistas anidadas: ${l0.length}`);
  for (let i = 0; i < l0.length; i++) {
    const ns = derivadas.map((d) => d.listas[i]?.n ?? 0);
    console.log(`   ${l0[i].clase.replace(' w-dyn-items','').padEnd(38)} elementos por item: ${Math.min(...ns)}-${Math.max(...ns)}`);
  }
}

// Que campos se han sabido colocar y cuales no.
const todos = new Set(Object.keys(filas[0]).filter((k) => !ADMIN.has(k)));
const colocados = new Set(derivadas.flatMap((d) => d.usados).map((m) => m.replace(/^\{\{|\}\}$/g, '').split('#')[0]));
const sinColocar = [...todos].filter((c) => !colocados.has(c) && filas.some((f) => (f[c] || '').trim()));
console.log(`\ncampos colocados: ${colocados.size}/${todos.size}`);
if (sinColocar.length) {
  console.log('sin colocar (tienen valor pero no aparecen en la pagina):');
  for (const c of sinColocar) console.log(`   ${c}`);
}

// Si hay mas de un grupo, ensenar en que se diferencian.
if (grupos.size > 1) {
  const [a, b] = orden.slice(0, 2).map(([k]) => k.split('\n'));
  console.log('\n--- primera diferencia entre los dos grupos mayores ---');
  let n = 0;
  for (let i = 0; i < Math.max(a.length, b.length) && n < 6; i++) {
    if (a[i] !== b[i]) { console.log(`  L${i}\n    A: ${(a[i] || '').trim().slice(0, 150)}\n    B: ${(b[i] || '').trim().slice(0, 150)}`); n++; }
  }
}

await fs.mkdir('/tmp/plantillas', { recursive: true });
await fs.writeFile(`/tmp/plantillas/${nombre}.html`, orden[0][0]);
console.log(`\nplantilla mayoritaria -> /tmp/plantillas/${nombre}.html`);
