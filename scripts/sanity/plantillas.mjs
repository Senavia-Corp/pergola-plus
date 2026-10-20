#!/usr/bin/env node
/**
 * Deriva la PLANTILLA de una coleccion (diseño, en el codigo) y los VALORES de cada
 * pagina (contenido, a Sanity) a partir de los fragmentos migrados, en ingles y en
 * español, y comprueba la paridad: rellenar la plantilla con los valores de cada
 * pagina devuelve su fragmento.
 *
 *     node scripts/sanity/plantillas.mjs <coleccion> [--escribir]
 *
 * Con --escribir guarda la plantilla en src/plantillas/<coleccion>.html y sus huecos en
 * src/plantillas/<coleccion>.json. Ver src/lib/plantilla.mjs.
 *
 * COMO SE DERIVA
 *   1. Cada fragmento se trocea como lo hace traducirHtml: etiquetas, nodos de texto y
 *      bloques <script>/<style> enteros. Todas las paginas de la coleccion, y cada una
 *      en ingles y en español, tienen que dar la MISMA secuencia de etiquetas: si no,
 *      lanza (es una plantilla distinta y no se fuerza).
 *   2. Son hueco: todo nodo de texto; los atributos que traducirHtml traduce (alt,
 *      aria-label, placeholder, data-wait, value de boton de envio); el src de toda
 *      imagen raster; el href que cambia entre paginas. El srcset que cambia se
 *      DERIVA del src (patron comprobado en todas). Cualquier otro atributo que cambie
 *      lanza.
 *   3. Alcance: si el valor (EN y ES) es igual en todas las paginas, el hueco es
 *      COMPARTIDO (un documento por coleccion); si no, va en el documento de la pagina.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { cargarTs, cerrarTs } from './cargar-ts.mjs';
import { MARCA, rellenar } from '../../src/lib/plantilla.mjs';
import { decodificar } from '../../src/lib/portable.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');

/** Colecciones: carpeta del fragmento y diccionarios de su pagina española (los mismos que src/pages/es/<c>/[slug].astro). */
export const COLECCIONES = {
  city: { carpeta: 'pergolas-contractors', es: async () => { const { UBICACIONES_ES } = await cargarTs('src/i18n/ubicaciones.es.ts'); const { MINIATURAS_ES } = await import('../lib/miniaturas.mjs'); return (slug) => UBICACIONES_ES[slug] && { ...MINIATURAS_ES, ...UBICACIONES_ES[slug].dic }; } },
  county: { carpeta: 'countries', es: async () => { const { CONDADOS_ES } = await cargarTs('src/i18n/condados.es.ts'); return (slug) => CONDADOS_ES[slug] && CONDADOS_ES[slug].dic; } },
  product: { carpeta: 'products', es: async () => { const { PRODUCTOS_ES } = await cargarTs('src/i18n/productos.es.ts'); return (slug) => PRODUCTOS_ES[slug] && PRODUCTOS_ES[slug].dic; } },
  service: { carpeta: 'services', es: async () => { const { SERVICIOS_ES } = await cargarTs('src/i18n/servicios.es.ts'); return (slug) => SERVICIOS_ES[slug] && SERVICIOS_ES[slug].dic; } },
  brand: { carpeta: 'brands', es: async () => { const { MARCAS_ES } = await cargarTs('src/i18n/marcas.es.ts'); return (slug) => MARCAS_ES[slug] && MARCAS_ES[slug].dic; } },
  project: { carpeta: 'project', es: async () => { const { PROYECTOS_ES } = await cargarTs('src/i18n/proyectos.es.ts'); return (slug) => PROYECTOS_ES[slug] && PROYECTOS_ES[slug].dic; } },
};

// ---------------------------------------------------------------------------
// Troceado
// ---------------------------------------------------------------------------
const RX_BLOQUE = /<(script|style)\b[\s\S]*?<\/\1>|<!--[\s\S]*?-->/gi;
export function trocear(html) {
  const tokens = [];
  let ultimo = 0;
  const empujarTexto = (s) => {
    for (const parte of s.split(/(<[^>]+>)/)) {
      if (!parte) continue;
      if (parte.startsWith('<')) tokens.push(etiqueta(parte));
      else tokens.push({ t: 'texto', raw: parte });
    }
  };
  for (const m of html.matchAll(RX_BLOQUE)) {
    empujarTexto(html.slice(ultimo, m.index));
    tokens.push({ t: 'bloque', raw: m[0] });
    ultimo = m.index + m[0].length;
  }
  empujarTexto(html.slice(ultimo));
  return tokens;
}
function etiqueta(raw) {
  const m = raw.match(/^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/);
  if (!m) throw new Error(`[plantillas] etiqueta ilegible: ${raw.slice(0, 80)}`);
  const attrs = [];
  for (const a of raw.matchAll(/\s([^\s=\/>"']+)(?:="([^"]*)")?/g)) {
    // Posicion del VALOR dentro de `raw`, para poder sustituirlo sin reescribir la etiqueta.
    const ini = a[2] == null ? -1 : a.index + a[0].indexOf('="') + 2;
    attrs.push({ n: a[1], v: a[2], ini });
  }
  return { t: 'tag', raw, nombre: m[2].toLowerCase(), cierre: m[1] === '/', attrs };
}

// ---------------------------------------------------------------------------
// Derivacion
// ---------------------------------------------------------------------------
const TRADUCIBLE = (a, tag, tipo) => ['placeholder', 'aria-label', 'alt', 'data-wait'].includes(a) || (a === 'value' && tag === 'input' && (tipo === 'submit' || tipo === 'button'));
const RASTER = /\.(avif|jpe?g|png|webp|gif)(\?.*)?$/i;
const VACIOS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use']);
const limpiar = (s) => s.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'x';

/**
 * @param {{slug: string, en: string, es?: string}[]} paginas
 */
export function derivar(paginas, prefijo = '') {
  const tk = paginas.map((p) => ({ en: trocear(p.en), es: p.es ? trocear(p.es) : null }));
  const base = tk[0].en;
  // 1. Misma estructura en todas (y ES igual que EN)
  const firma = (ts) => ts.map((t) => (t.t === 'tag' ? `${t.cierre ? '/' : ''}${t.nombre}` : t.t === 'texto' ? (t.raw.trim() ? '#' : '_') : 'B')).join(' ');
  const fBase = firma(base);
  paginas.forEach((p, i) => {
    if (firma(tk[i].en) !== fBase) {
      const a = fBase.split(' '), b = firma(tk[i].en).split(' ');
      let k = 0; while (k < a.length && a[k] === b[k]) k++;
      const ctxTok = (ts) => ts.slice(Math.max(0, k - 3), k + 4).map((t) => t.raw.slice(0, 90)).join(' ¦ ');
      const e = new Error(`[plantillas] ${p.slug}: estructura distinta de ${paginas[0].slug} en el token ${k}\n   ${paginas[0].slug}: ${ctxTok(base)}\n   ${p.slug}: ${ctxTok(tk[i].en)}`);
      // El elemento abierto mas interno en el punto de divergencia: ahi estan los bloques que cambian.
      const pilaRaw = [];
      for (let q = 0; q < k && q < base.length; q++) {
        const tq = base[q];
        if (tq.t !== 'tag') continue;
        if (tq.cierre) { while (pilaRaw.length && pilaRaw.pop().nombre !== tq.nombre); } else if (!VACIOS.has(tq.nombre) && !tq.raw.endsWith('/>')) pilaRaw.push(tq);
      }
      e.contenedor = pilaRaw[pilaRaw.length - 1]?.raw;
      throw e;
    }
    if (tk[i].es && firma(tk[i].es) !== fBase) throw new Error(`[plantillas] ${p.slug}: la version ES no tiene la estructura de la EN`);
  });

  const huecos = {};
  const valores = paginas.map(() => ({}));
  let ultimaImagen = null;
  const srcImagen = {};
  const valoresImagen = (clave) => srcImagen[clave];
  const compartidos = {};
  const plantilla = [];
  const pila = [];
  let seccion = -1;
  const contadores = {};
  const nuevaClave = (basek) => { const n = (contadores[basek] = (contadores[basek] ?? 0) + 1); return prefijo + (n === 1 ? basek : `${basek}-${n}`); };
  const ctx = () => pila.map((p) => p.k).filter(Boolean).slice(-2).join('.') || 'raiz';

  /** Registra un hueco con sus valores por pagina y decide el alcance. */
  const hueco = (clave, tipo, porPagina, extra = {}) => {
    const iguales = porPagina.every((v) => JSON.stringify(v) === JSON.stringify(porPagina[0]));
    huecos[clave] = { tipo, alcance: iguales && paginas.length > 1 ? 'compartido' : 'pagina', ...extra };
    if (huecos[clave].alcance === 'compartido') compartidos[clave] = porPagina[0];
    else porPagina.forEach((v, i) => { valores[i][clave] = v; });
  };

  for (let i = 0; i < base.length; i++) {
    const t = base[i];
    if (t.t === 'bloque') {
      const vs = new Set(tk.map((x) => x.en[i].raw));
      if (vs.size > 1) {
        // El JSON del lightbox (script.w-json) repite la URL de la imagen que lo precede:
        // es un DERIVADO de esa imagen, comprobado en todas las paginas.
        if (!ultimaImagen || !/class="w-json"/.test(t.raw)) throw new Error(`[plantillas] bloque <script>/<style> que cambia entre paginas en el token ${i}: ${t.raw.slice(0, 100)}`);
        const src0 = valoresImagen(ultimaImagen)[0];
        const patron = t.raw.split(src0).join(`${MARCA}src${MARCA}`);
        tk.forEach((x, j) => { if (patron.split(`${MARCA}src${MARCA}`).join(valoresImagen(ultimaImagen)[j]) !== x.en[i].raw) throw new Error(`[plantillas] ${paginas[j].slug}: w-json que no sale de la imagen ${ultimaImagen}`); });
        const clave = `${ultimaImagen}.json`;
        huecos[clave] = { tipo: 'derivado', alcance: 'pagina', de: ultimaImagen, patron, modo: 'src', crudo: true };
        plantilla.push(`${MARCA}${clave}${MARCA}`);
        continue;
      }
      plantilla.push(t.raw);
      continue;
    }
    if (t.t === 'texto') {
      const limpio = t.raw.trim();
      if (!limpio) { plantilla.push(t.raw); continue; }
      const marcador = limpio.match(/^\u0002([LWO])(\d+)\u0002$/);
      if (marcador) {
        if (tk.some((x) => x.en[i].raw.trim() !== limpio)) throw new Error(`[plantillas] marcador de lista desalineado en el token ${i}`);
        plantilla.push(t.raw.replace(limpio, `${MARCA}${{ L: 'lista', W: 'heredado', O: 'opcional' }[marcador[1]]}:${marcador[2]}${MARCA}`));
        continue;
      }
      const clave = nuevaClave(`s${seccion}.${ctx()}.t`);
      const porPagina = tk.map((x) => ({ en: decodificar(x.en[i].raw.trim()), ...(x.es ? { es: decodificar(x.es[i].raw.trim()) } : {}) }));
      hueco(clave, 'texto', porPagina);
      plantilla.push(t.raw.replace(limpio, `${MARCA}${clave}${MARCA}`));
      continue;
    }
    // Etiqueta
    if (t.cierre) {
      while (pila.length && pila.pop().nombre !== t.nombre);
      plantilla.push(t.raw);
      continue;
    }
    if (pila.length === 0) { seccion++; Object.keys(contadores).forEach((k) => delete contadores[k]); }
    const clase = t.attrs.find((a) => a.n === 'class')?.v?.split(/\s+/)[0];
    const k = limpiar(`${t.nombre}${clase ? '-' + clase : ''}`);
    const autocierre = VACIOS.has(t.nombre) || t.raw.endsWith('/>');
    const claveEl = nuevaClave(`s${seccion}.${pila.length ? ctx() + '.' : ''}${k}`);
    if (!autocierre) pila.push({ nombre: t.nombre, k });
    const tipoInput = t.attrs.find((a) => a.n === 'type')?.v;
    // Atributos que estan en unas paginas y no en otras. La UNICA diferencia admitida es
    // el par srcset/sizes de una <img>: falta cuando la imagen no es raster (el
    // placeholder SVG de Coral Springs, hueco conocido de la Fase 6). Se convierte en un
    // hueco derivado que el render pone o quita segun la imagen.
    const nombres = (j) => tk[j].en[i].attrs.map((a) => a.n).join(' ');
    let resp = null;
    if (new Set(tk.map((_x, j) => nombres(j))).size > 1) {
      const conjuntos = tk.map((x) => new Set(x.en[i].attrs.map((a) => a.n)));
      const todos = new Set(conjuntos.flatMap((c) => [...c]));
      const opcionales = [...todos].filter((n) => conjuntos.some((c) => !c.has(n)));
      if (t.nombre !== 'img' || opcionales.some((n) => !['srcset', 'sizes', 'width', 'height'].includes(n))) throw new Error(`[plantillas] ${claveEl}: atributos presentes solo en algunas paginas: ${opcionales.join(', ')}`);
      // El grupo ` srcset … sizes … [width … height …]` va seguido en la etiqueta y sale del
      // src. Esta en las imagenes de un directorio (las de /cms-img con derivados, las fotos
      // del cliente de /images/cliente) y no en las demas: la condicion es ese prefijo,
      // comprobado en todas las paginas.
      const RX_GRUPO = / srcset="[^"]*"(?: sizes="[^"]*")?(?: width="[^"]*")?(?: height="[^"]*")?/;
      const trozo = (tt) => { const m = tt.raw.match(RX_GRUPO); if (!m) throw new Error(`[plantillas] ${claveEl}: srcset/sizes/width/height no van seguidos`); return m; };
      const srcDe = (tt) => tt.attrs.find((a) => a.n === 'src').v;
      const con = tk.map((x) => x.en[i]).filter((tt) => tt.attrs.some((a) => a.n === 'srcset'));
      const sin = tk.map((x) => x.en[i]).filter((tt) => !tt.attrs.some((a) => a.n === 'srcset'));
      const dirs = con.map((tt) => srcDe(tt).split('/').slice(0, -1));
      let prefijoDir = dirs[0];
      for (const d of dirs) { let q = 0; while (q < prefijoDir.length && prefijoDir[q] === d[q]) q++; prefijoDir = prefijoDir.slice(0, q); }
      const siPrefijo = prefijoDir.join('/') + '/';
      if (siPrefijo.length < 3 || sin.some((tt) => srcDe(tt).startsWith(siPrefijo))) throw new Error(`[plantillas] ${claveEl}: no hay un prefijo de src que explique cuando lleva srcset`);
      const src0 = srcDe(con[0]).replace(/\.[a-z0-9]+$/i, '');
      const patron = trozo(con[0])[0].split(src0).join(`${MARCA}raiz${MARCA}`);
      for (const tt of con) if (patron.split(`${MARCA}raiz${MARCA}`).join(srcDe(tt).replace(/\.[a-z0-9]+$/i, '')) !== trozo(tt)[0]) throw new Error(`[plantillas] srcset que no sale del src (${claveEl}): ${srcDe(tt)}`);
      const enBase = t.raw.match(RX_GRUPO);
      // Si la pagina base no lo lleva, la marca va justo detras del valor del src.
      const posSrc = t.attrs.find((a) => a.n === 'src');
      resp = { clave: `${claveEl}.resp`, patron, quitar: enBase ?? { index: posSrc.ini + posSrc.v.length + 1, 0: '' } };
      huecos[resp.clave] = { tipo: 'derivado', alcance: 'pagina', de: claveEl, patron, siPrefijo };
    }
    // Sustituciones dentro de la etiqueta (de atras adelante para no mover posiciones)
    const subs = [];
    const valorEn = (j, n) => tk[j].en[i].attrs.find((a) => a.n === n)?.v;
    const valorEs = (j, n) => tk[j].es?.[i].attrs.find((a) => a.n === n)?.v;
    for (const a of t.attrs) {
      if (a.v == null) continue;
      if (resp && ['srcset', 'sizes', 'width', 'height'].includes(a.n)) continue;
      const enTodas = tk.map((_x, j) => valorEn(j, a.n));
      const varia = new Set(enTodas).size > 1;
      if (TRADUCIBLE(a.n, t.nombre, tipoInput)) {
        const clave = `${claveEl}.${a.n}`;
        hueco(clave, 'atributo', tk.map((x, j) => ({ en: decodificar(valorEn(j, a.n) ?? ''), ...(x.es ? { es: decodificar(valorEs(j, a.n) ?? '') } : {}) })));
        subs.push([a.ini, a.v.length, clave]);
      } else if (a.n === 'src' && t.nombre === 'img' && enTodas.some((v) => RASTER.test(v))) {
        const noRaster = [...new Set(enTodas.filter((v) => !RASTER.test(v)))];
        if (noRaster.length > 1) throw new Error(`[plantillas] ${claveEl}: varias imagenes no raster: ${noRaster.join(', ')}`);
        // Una pagina con una imagen no raster (el placeholder) la deja VACIA en Sanity; el
        // render pinta el respaldo. Es el hueco conocido de la Fase 6, no se rellena.
        hueco(claveEl, 'imagen', enTodas.map((src) => (RASTER.test(src) ? { src: decodificar(src) } : { vacia: true })), noRaster.length ? { respaldo: noRaster[0] } : {});
        ultimaImagen = claveEl; srcImagen[claveEl] = enTodas;
        subs.push([a.ini, a.v.length, claveEl]);
      } else if (a.n === 'href' && varia) {
        hueco(`${claveEl}.href`, 'enlace', enTodas.map((href) => ({ href: decodificar(href) })));
        subs.push([a.ini, a.v.length, `${claveEl}.href`]);
      } else if (a.n === 'srcset' && varia) {
        const src0 = valorEn(0, 'src');
        const raiz0 = src0.replace(/\.[a-z0-9]+$/i, '');
        const patron = a.v.split(raiz0).join(`${MARCA}raiz${MARCA}`);
        tk.forEach((_x, j) => {
          const raiz = valorEn(j, 'src').replace(/\.[a-z0-9]+$/i, '');
          if (patron.split(`${MARCA}raiz${MARCA}`).join(raiz) !== valorEn(j, 'srcset')) throw new Error(`[plantillas] ${paginas[j].slug}: srcset que no sale del src en ${claveEl}`);
        });
        huecos[`${claveEl}.srcset`] = { tipo: 'derivado', alcance: 'pagina', de: claveEl, patron };
        subs.push([a.ini, a.v.length, `${claveEl}.srcset`]);
      } else if (varia && ((t.nombre === 'iframe' && a.n === 'src') || (a.n === 'style' && /\bw-video\b/.test(t.attrs.find((x) => x.n === 'class')?.v ?? '')))) {
        // El video embebido (embedly) y su proporcion: contenido de la pagina, sin traducir.
        hueco(`${claveEl}.${a.n}`, 'valor', enTodas.map((v) => ({ valor: decodificar(v) })));
        subs.push([a.ini, a.v.length, `${claveEl}.${a.n}`]);
      } else if (varia) {
        throw new Error(`[plantillas] atributo «${a.n}» que cambia entre paginas en ${claveEl}: ${[...new Set(enTodas)].slice(0, 3).join(' | ')}`);
      }
    }
    let raw = t.raw;
    if (resp) subs.push([resp.quitar.index, resp.quitar[0].length, resp.clave, true]);
    for (const [ini, largo, clave] of subs.sort((x, y) => y[0] - x[0])) raw = raw.slice(0, ini) + `${MARCA}${clave}${MARCA}` + raw.slice(ini + largo);
    plantilla.push(raw);
  }
  return { plantilla: plantilla.join(''), huecos, valores, compartidos };
}

// ---------------------------------------------------------------------------
// Listas de longitud variable (galerias)
// ---------------------------------------------------------------------------
const WFT = /<script is:inline type="text\/x-wf-template" id="[^"]*">[^<]*<\/script>$/;
/** Contenedores w-dyn-items de un fragmento: rango interior, elementos y el x-wf-template que lo precede. */
function listasDe(html) {
  const listas = [];
  for (const m of html.matchAll(/<div\b[^>]*class="[^"]*\bw-dyn-items\b[^"]*"[^>]*>/g)) {
    if (listas.some((l) => m.index > l.desde && m.index < l.fin)) continue; // anidada: va dentro de su elemento
    const desde = m.index + m[0].length;
    const re = /<div\b|<\/div>/g;
    re.lastIndex = desde;
    let prof = 1, ini = null, fin = -1, x;
    const items = [];
    while ((x = re.exec(html))) {
      if (x[0] !== '</div>') { if (prof === 1) ini = x.index; prof++; } else {
        prof--;
        if (prof === 1 && ini != null) { items.push(html.slice(ini, x.index + 6)); ini = null; }
        if (prof === 0) { fin = x.index; break; }
      }
    }
    if (fin < 0) throw new Error('[plantillas] w-dyn-items sin cierre');
    if (html.slice(desde, fin) !== items.join('')) throw new Error('[plantillas] w-dyn-items con algo que no son elementos');
    const w = html.slice(0, m.index).match(WFT);
    listas.push({ desde, fin, items, wft: w ? { ini: m.index - w[0].length, raw: w[0] } : null });
  }
  return listas;
}

/**
 * Deriva una coleccion con galerias. Las listas cuya longitud cambia entre paginas
 * salen del fragmento y se derivan aparte, como subplantilla de un elemento; el
 * x-wf-template que las precede (marcado heredado que nadie lee) va al codigo.
 */
// ---------------------------------------------------------------------------
// Bloques opcionales (una seccion que tienen unas paginas y otras no)
// ---------------------------------------------------------------------------
/**
 * Hijos directos del elemento cuya etiqueta de apertura es exactamente `abre` (unica en la
 * pagina): clave (id + clase, numerada si se repite) y rango en el HTML.
 */
function hijosDe(html, abre) {
  const pos = html.indexOf(abre);
  if (pos < 0) return null;
  if (html.indexOf(abre, pos + 1) >= 0) throw new Error(`[plantillas] contenedor no unico: ${abre.slice(0, 80)}`);
  const sinBloques = html.replace(RX_BLOQUE, (m) => ' '.repeat(m.length));
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  re.lastIndex = pos + abre.length;
  const out = [];
  let prof = 1, ini = null, clave = null, x;
  while ((x = re.exec(sinBloques))) {
    const [raw, cierre, nombre, auto] = x;
    const vacio = auto === '/' || VACIOS.has(nombre.toLowerCase());
    if (cierre) {
      prof--;
      if (prof === 0) return { hijos: out, fin: x.index };
      if (prof === 1 && ini != null) {
        const n = out.filter((c) => c.clave === clave || c.clave.startsWith(clave + '@')).length;
        out.push({ clave: n ? `${clave}@${n + 1}` : clave, ini, fin: x.index + raw.length });
        ini = null;
      }
      continue;
    }
    if (prof === 1) {
      const cls = raw.match(/class="([^"]*)"/)?.[1]?.split(' ')[0] ?? nombre;
      const id = raw.match(/\sid="([^"]*)"/)?.[1];
      const k = `${id ? '#' + id + '.' : ''}${cls}`;
      if (vacio) { const n = out.filter((c) => c.clave === k || c.clave.startsWith(k + '@')).length; out.push({ clave: n ? `${k}@${n + 1}` : k, ini: x.index, fin: x.index + raw.length }); }
      else { ini = x.index; clave = k; }
    }
    if (!vacio) prof++;
  }
  throw new Error(`[plantillas] contenedor sin cierre: ${abre.slice(0, 80)}`);
}

/** Orden de union de varias secuencias (cada una tiene que ser subsecuencia de la union). */
function union(seqs) {
  const res = [];
  for (const q of seqs) {
    let pos = 0;
    for (const c of q) {
      const j = res.indexOf(c, pos);
      if (j >= 0) { pos = j + 1; continue; }
      res.splice(pos, 0, c); pos++;
    }
  }
  const esSub = (q) => { let j = 0; for (const c of res) if (q[j] === c) j++; return j === q.length; };
  if (!seqs.every(esSub)) return null;
  return res;
}

/** Bloques opcionales de un contenedor: hijos que tienen unas paginas y otras no. */
function opcionalesDe(paginas, abre) {
  const hs = paginas.map((p) => hijosDe(p.en, abre));
  if (hs.some((h) => !h)) throw new Error(`[plantillas] el contenedor no esta en todas las paginas: ${abre.slice(0, 80)}`);
  const seqs = hs.map((h) => h.hijos.map((c) => c.clave));
  const u = union(seqs);
  if (!u) throw new Error(`[plantillas] los bloques del contenedor cambian de orden entre paginas: ${[...new Set(seqs.map((q) => q.join(',')))].join(' / ')}`);
  return u.map((c, idx) => ({ abre, clave: c, antesDe: u.slice(idx + 1), despuesDe: u.slice(0, idx).reverse() })).filter((o) => seqs.some((q) => !q.includes(o.clave)));
}

export function derivarColeccion(paginas) {
  // 1. Bloques opcionales. Se deriva; si la estructura diverge, los hijos del elemento
  //    abierto en ese punto se tratan como bloques opcionales (fuera del fragmento, marca
  //    en su sitio, vacia en las paginas que no lo tienen) y se reintenta.
  const originales = paginas;
  const opc = [];
  for (let intento = 0; ; intento++) {
    if (intento > 12) throw new Error('[plantillas] demasiados contenedores con bloques opcionales');
    paginas = sacarOpcionales(originales, opc);
    try { return derivarConListas(paginas, opc, originales); } catch (e) {
      if (!e.contenedor || opc.some((o) => o.abre === e.contenedor)) throw e;
      const nuevos = opcionalesDe(sacarOpcionales(originales, opc).map((p) => ({ en: p.en })), e.contenedor);
      if (!nuevos.length) throw e;
      opc.push(...nuevos);
    }
  }
}

/** Saca de cada pagina los bloques opcionales `opc` y deja una marca \u0002O<k>\u0002 en su sitio. */
function sacarOpcionales(paginas, opc) {
  if (!opc.length) return paginas;
  return paginas.map((p) => {
    const r = { ...p, bloques: opc.map(() => null) };
    for (const idioma of ['en', 'es']) {
      if (!p[idioma]) continue;
      let h = p[idioma];
      // De atras adelante, para no mover las posiciones de lo que queda por tocar. Las marcas
      // de un contenedor se calculan antes de tocar nada en el.
      const cortes = [];
      for (const [k, o] of opc.entries()) {
        const { hijos, fin } = hijosDe(h, o.abre);
        const este = hijos.find((c) => c.clave === o.clave);
        if (este) { cortes.push({ k, ini: este.ini, fin: este.fin }); continue; }
        const sig = o.antesDe.map((c) => hijos.find((x) => x.clave === c)).find(Boolean);
        const prev = o.despuesDe.map((c) => hijos.find((x) => x.clave === c)).find(Boolean);
        const pos = sig ? sig.ini : prev ? prev.fin : fin;
        cortes.push({ k, ini: pos, fin: pos });
      }
      cortes.sort((a, b) => b.ini - a.ini || b.k - a.k);
      for (const c of cortes) {
        if (c.fin > c.ini) { r.bloques[c.k] = r.bloques[c.k] ?? {}; r.bloques[c.k][idioma] = h.slice(c.ini, c.fin); }
        h = h.slice(0, c.ini) + `\u0002O${c.k}\u0002` + h.slice(c.fin);
      }
      r[idioma] = h;
    }
    return r;
  });
}

function derivarConListas(paginas, opc, originales) {
  const bloquesOpc = opc.map((_o, k) => paginas.map((p) => p.bloques?.[k] ?? null));
  const info = paginas.map((p) => ({ en: listasDe(p.en), es: p.es ? listasDe(p.es) : null }));
  const n = info[0].en.length;
  if (info.some((x) => x.en.length !== n || (x.es && x.es.length !== n))) throw new Error('[plantillas] distinto numero de listas entre paginas');
  const variables = [...Array(n).keys()].filter((k) => new Set(info.map((x) => x.en[k].items.length)).size > 1);
  const conMarcas = (html, listas) => {
    let h = html;
    for (const k of [...variables].sort((a, b) => b - a)) {
      const l = listas[k];
      h = h.slice(0, l.desde) + `\u0002L${k}\u0002` + h.slice(l.fin);
      if (l.wft) h = h.slice(0, l.wft.ini) + `\u0002W${k}\u0002` + h.slice(l.wft.ini + l.wft.raw.length);
    }
    return h;
  };
  const d = derivar(paginas.map((p, i) => ({ slug: p.slug, en: conMarcas(p.en, info[i].en), es: p.es ? conMarcas(p.es, info[i].es) : null })));
  d.heredados = paginas.map(() => ({}));
  const heredados = d.heredados;
  for (const k of variables) {
    const elementos = [];
    paginas.forEach((p, i) => info[i].en[k].items.forEach((it, j) => elementos.push({ slug: `${p.slug}#${j}`, pagina: i, en: it, es: info[i].es ? info[i].es[k].items[j] : null })));
    const di = derivar(elementos, `L${k}.`);
    d.huecos[`lista:${k}`] = { tipo: 'lista', alcance: 'pagina', plantilla: di.plantilla, huecos: di.huecos };
    Object.assign(d.compartidos, di.compartidos);
    paginas.forEach((_p, i) => { d.valores[i][`lista:${k}`] = elementos.map((e, j) => (e.pagina === i ? di.valores[j] : null)).filter(Boolean); });
    if (info.some((x) => x.en[k].wft)) {
      if (info.some((x) => !x.en[k].wft)) throw new Error(`[plantillas] la lista ${k} lleva x-wf-template en unas paginas y en otras no`);
      d.huecos[`heredado:${k}`] = { tipo: 'heredado', alcance: 'codigo' };
      info.forEach((x, i) => {
        if (x.es && x.es[k].wft.raw !== x.en[k].wft.raw) throw new Error(`[plantillas] ${paginas[i].slug}: x-wf-template distinto en ES`);
        heredados[i][`heredado:${k}`] = x.en[k].wft.raw;
      });
    }
  }
  // 3. Cada bloque opcional, derivado con las paginas que lo tienen.
  void originales;
  opc.forEach((o, k) => {
    const conBloque = paginas.map((p, i) => (bloquesOpc[k][i] ? { slug: `${p.slug}~${o.clave}`, i, ...bloquesOpc[k][i] } : null)).filter(Boolean);
    const db = derivarColeccion(conBloque.map((x) => ({ slug: x.slug, en: x.en, es: x.es ?? null })));
    const clave = `opcional:${k}`;
    d.huecos[clave] = { tipo: 'opcional', alcance: 'pagina', bloque: o.clave, plantilla: db.plantilla, huecos: db.huecos };
    // Prefijo propio para que sus claves no choquen con las de la pagina.
    for (const [kk, v] of Object.entries(db.compartidos)) d.compartidos[`O${k}.${kk}`] = v;
    db.huecos.__prefijoCompartidos = `O${k}.`;
    paginas.forEach((_p, i) => {
      const j = conBloque.findIndex((x) => x.i === i);
      d.valores[i][clave] = j < 0 ? null : db.valores[j];
      if (j >= 0) Object.assign(d.heredados[i], Object.fromEntries(Object.entries(db.heredados[j] ?? {}).map(([kk, v]) => [`O${k}.${kk}`, v])));
    });
  });
  return d;
}

/** Valor de un hueco en un idioma, para `rellenar`, desde los valores derivados. */
export function lector(huecos, valoresPagina, compartidos, idioma, heredados = {}) {
  return (clave) => {
    const h = huecos[clave];
    if (h.tipo === 'lista') return (valoresPagina[clave] ?? []).map((v) => lector(h.huecos, v, compartidos, idioma));
    if (h.tipo === 'opcional') {
      const v = valoresPagina[clave];
      if (!v) return null;
      const pre = h.huecos.__prefijoCompartidos;
      const comp = new Proxy({}, { get: (_t, k) => compartidos[pre + String(k)] });
      const her = new Proxy({}, { get: (_t, k) => heredados[pre + String(k)] });
      return lector(h.huecos, v, comp, idioma, her);
    }
    if (h.tipo === 'heredado') return heredados[clave];
    const v = h.alcance === 'compartido' ? compartidos[clave] : valoresPagina[clave];
    if (v == null) return undefined;
    if (h.tipo === 'imagen') return v.vacia ? h.respaldo : v.src;
    if (h.tipo === 'enlace') return v.href;
    if (h.tipo === 'valor') return v.valor;
    return idioma === 'es' ? (v.es ?? v.en) : v.en;
  };
}

const normalizar = (h) => decodificar(h.replace(/<[^>]+>/g, (t) => t.replace(/\s+/g, ' ').replace(/\s*\/?>$/, '>')));

/** Las paginas de una coleccion tal como las pinta hoy el sitio (fragmento EN y su traduccion ES). */
export async function paginasDe(tipo) {
  const c = COLECCIONES[tipo];
  const { traducirHtml } = await cargarTs('src/i18n/index.ts');
  const { COMUN_ES } = await cargarTs('src/i18n/comun.es.ts');
  const dicEs = await c.es();
  const dir = path.join(RAIZ, 'src/contenido-migrado', c.carpeta);
  const items = JSON.parse(await fs.readFile(path.join(dir, '_items.json'), 'utf8'));
  const paginas = [];
  for (const item of items) {
    const en = await fs.readFile(path.join(dir, `${item.slug}.html`), 'utf8');
    const dic = dicEs(item.slug);
    paginas.push({ slug: item.slug, item, en, es: dic ? traducirHtml(en, { ...COMUN_ES, ...dic }).html : null });
  }
  return paginas;
}

/** Paridad: rellenar(plantilla, valores de la pagina) == fragmento, en EN y ES. */
export function paridad(d, paginas) {
  const fallos = [];
  paginas.forEach((p, i) => {
    for (const idioma of ['en', 'es']) {
      const original = p[idioma];
      if (!original) continue;
      const salida = rellenar(d.plantilla, d.huecos, lector(d.huecos, d.valores[i], d.compartidos, idioma, d.heredados?.[i]));
      const a = normalizar(original), b = normalizar(salida);
      if (a !== b) {
        let k = 0; while (k < a.length && a[k] === b[k]) k++;
        fallos.push(`${p.slug} ${idioma}: difiere en ${k}\n      hoy:   …${a.slice(Math.max(0, k - 70), k + 70)}\n      salida:…${b.slice(Math.max(0, k - 70), k + 70)}`);
      }
    }
  });
  return fallos;
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes('--ndjson')) {
  // Paridad contra lo que se va a IMPORTAR: plantilla del codigo + documentos del NDJSON.
  process.chdir(RAIZ);
  const tipo = process.argv[2];
  const { lectorSanity } = await import('../../src/lib/plantilla-sanity.mjs');
  const { rutaDeId } = await import('../../src/lib/rutas-sanity.mjs');
  const { canonica } = await import('../../src/lib/canonica.mjs');
  const fichero = process.argv[process.argv.indexOf('--ndjson') + 1];
  const docs = (await fs.readFile(fichero, 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
  const plantilla = await fs.readFile(path.join(RAIZ, `src/plantillas/${tipo}.html`), 'utf8');
  const huecos = JSON.parse(await fs.readFile(path.join(RAIZ, `src/plantillas/${tipo}.json`), 'utf8'));
  const heredados = JSON.parse(await fs.readFile(path.join(RAIZ, `src/plantillas/${tipo}.heredado.json`), 'utf8').catch(() => '{}'));
  const docPlantilla = docs.find((d) => d._id === `plantilla-${tipo}`);
  const paginas = await paginasDe(tipo);
  await cerrarTs();
  const conv = {
    rutaImagen: (img) => '/' + path.relative(path.join(RAIZ, 'public'), img._sanityAsset.replace(/^image@file:\/\//, '')),
    hrefDe: (e) => (e.destino ? rutaDeId(e.destino._ref) : e.href) + (e.ancla ? `#${e.ancla}` : ''),
  };
  // Los href internos se comparan en forma canonica: el build los canoniza (canonizarEnlaces).
  const hrefs = (h) => h.replace(/href="(\/(?!\/)[^"#?]*)([^"]*)"/g, (_t, r, resto) => `href="${canonica(r)}${resto}"`);
  const fallos = [];
  let n = 0;
  for (const p of paginas) {
    const doc = docs.find((d) => d._id === `${tipo}-${p.slug}`);
    if (!doc) { fallos.push(`${p.slug}: no esta en el NDJSON`); continue; }
    for (const idioma of ['en', 'es']) {
      if (!p[idioma]) continue;
      n++;
      const salida = rellenar(plantilla, huecos, lectorSanity(huecos, doc, docPlantilla, idioma, conv, heredados[p.slug] ?? {}));
      const a = normalizar(hrefs(p[idioma])), b = normalizar(hrefs(salida));
      if (a !== b) { let k = 0; while (k < a.length && a[k] === b[k]) k++; fallos.push(`${p.slug} ${idioma}: difiere en ${k}\n      hoy:    …${a.slice(Math.max(0, k - 70), k + 70)}\n      sanity: …${b.slice(Math.max(0, k - 70), k + 70)}`); }
    }
  }
  console.log(JSON.stringify({ coleccion: tipo, comparadas: n, identicas: n - fallos.length, fallos: fallos.length }, null, 1));
  for (const f of fallos.slice(0, 8)) console.log('  FALLO', f);
  process.exit(fallos.length ? 1 : 0);
} else if (import.meta.url === `file://${process.argv[1]}`) {
  process.chdir(RAIZ);
  const tipo = process.argv[2];
  if (!COLECCIONES[tipo]) { console.error(`uso: plantillas.mjs <${Object.keys(COLECCIONES).join('|')}> [--escribir]`); process.exit(1); }
  const paginas = await paginasDe(tipo);
  await cerrarTs();
  const d = derivarColeccion(paginas);
  const fallos = paridad(d, paginas);
  const cuenta = (alc, tipoH) => Object.values(d.huecos).filter((h) => h.alcance === alc && (!tipoH || h.tipo === tipoH)).length;
  const resumen = {
    coleccion: tipo,
    paginas: paginas.length,
    conEs: paginas.filter((p) => p.es).length,
    huecos: Object.keys(d.huecos).length,
    listas: Object.entries(d.huecos).filter(([, h]) => h.tipo === 'lista').map(([k, h]) => ({ clave: k, huecosPorElemento: Object.keys(h.huecos).length, elementos: d.valores.map((v) => v[k].length) })),
    porPagina: { texto: cuenta('pagina', 'texto'), atributo: cuenta('pagina', 'atributo'), imagen: cuenta('pagina', 'imagen'), enlace: cuenta('pagina', 'enlace'), derivado: cuenta('pagina', 'derivado') },
    compartidos: { texto: cuenta('compartido', 'texto'), atributo: cuenta('compartido', 'atributo'), imagen: cuenta('compartido', 'imagen') },
    paridad: { comparadas: paginas.length + paginas.filter((p) => p.es).length, identicas: paginas.length + paginas.filter((p) => p.es).length - fallos.length, fallos: fallos.length },
  };
  console.log(JSON.stringify(resumen, null, 1));
  for (const f of fallos.slice(0, 10)) console.log('  FALLO', f);
  if (process.argv.includes('--escribir') && !fallos.length) {
    await fs.mkdir(path.join(RAIZ, 'src/plantillas'), { recursive: true });
    await fs.writeFile(path.join(RAIZ, `src/plantillas/${tipo}.html`), d.plantilla);
    const huecosOrdenados = Object.fromEntries(Object.entries(d.huecos));
    await fs.writeFile(path.join(RAIZ, `src/plantillas/${tipo}.json`), JSON.stringify(huecosOrdenados, null, 1) + '\n');
    if (d.heredados.some((h) => Object.keys(h).length)) {
      await fs.writeFile(path.join(RAIZ, `src/plantillas/${tipo}.heredado.json`), JSON.stringify(Object.fromEntries(paginas.map((p, i) => [p.slug, d.heredados[i]])), null, 1) + '\n');
    }
    console.log(`  escrito src/plantillas/${tipo}.html y .json`);
  }
  process.exit(fallos.length ? 1 : 0);
}
