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
import { DATA_PRODUCT } from '../lib/fichas.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');

/** Colecciones: carpeta del fragmento y diccionarios de su pagina española (los mismos que src/pages/es/<c>/[slug].astro). */
export const COLECCIONES = {
  city: { carpeta: 'pergolas-contractors', es: async () => { const { UBICACIONES_ES } = await cargarTs('src/i18n/ubicaciones.es.ts'); const { MINIATURAS_ES } = await import('../lib/miniaturas.mjs'); return (slug) => UBICACIONES_ES[slug] && { ...MINIATURAS_ES, ...UBICACIONES_ES[slug].dic }; } },
  county: { carpeta: 'countries', es: async () => { const { CONDADOS_ES } = await cargarTs('src/i18n/condados.es.ts'); return (slug) => CONDADOS_ES[slug] && CONDADOS_ES[slug].dic; } },
  product: { carpeta: 'products', es: async () => { const { PRODUCTOS_ES } = await cargarTs('src/i18n/productos.es.ts'); return (slug) => PRODUCTOS_ES[slug] && PRODUCTOS_ES[slug].dic; } },
  service: { carpeta: 'services', es: async () => { const { SERVICIOS_ES } = await cargarTs('src/i18n/servicios.es.ts'); return (slug) => SERVICIOS_ES[slug] && SERVICIOS_ES[slug].dic; } },
  brand: { carpeta: 'brands', es: async () => { const { MARCAS_ES } = await cargarTs('src/i18n/marcas.es.ts'); return (slug) => MARCAS_ES[slug] && MARCAS_ES[slug].dic; } },
  project: { carpeta: 'project', es: async () => { const { PROYECTOS_ES } = await cargarTs('src/i18n/proyectos.es.ts'); return (slug) => PROYECTOS_ES[slug] && PROYECTOS_ES[slug].dic; } },
  // Los textos legales: el envoltorio y el CTA del pie son plantilla; el texto, Portable
  // Text en el documento (hueco `cuerpo`, src/lib/portable.mjs).
  legalPage: { carpeta: 'articles', cuerpo: '<div class="w-richtext"', es: async () => { const { ARTICULOS_ES } = await cargarTs('src/i18n/articulos.es.ts'); return (slug) => ARTICULOS_ES[slug] && ARTICULOS_ES[slug].dic; } },
};

/** Vacia el <div> del texto enriquecido (equilibrando la profundidad): ese hueco es el `cuerpo`. */
function vaciarCuerpo(html, marcador) {
  const inicio = html.indexOf(marcador);
  if (inicio < 0) throw new Error(`[plantillas] sin ${marcador}`);
  const desde = html.indexOf('>', inicio) + 1;
  let prof = 1;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = desde;
  for (let m; (m = re.exec(html));) {
    prof += m[0] === '</div>' ? -1 : 1;
    if (prof === 0) return html.slice(0, desde) + html.slice(m.index);
  }
  throw new Error(`[plantillas] ${marcador} sin cerrar`);
}

// Elementos que son COPIA de otro documento: la tarjeta de producto de «Compare» de las
// fichas es la de /products con su texto de ancla (scripts/lib/transformar.mjs,
// tarjetasComparar). En la pagina se guarda solo la REFERENCIA; la tarjeta va una vez,
// en el documento del producto, y el render la pinta desde alli.
const REFERENCIAS = [
  { abre: /^<div data-product="([^"]+)" class="product-card-page">$/, coleccion: 'product', slug: (dp) => Object.keys(DATA_PRODUCT).find((s) => DATA_PRODUCT[s] === dp) },
];
/** Junta las tarjetas referenciadas de dos derivaciones; la misma tarjeta tiene que ser identica. */
function unirReferencias(dst, src) {
  for (const [col, porSlug] of Object.entries(src ?? {})) {
    for (const [slug, v] of Object.entries(porSlug)) {
      const prev = dst[col]?.[slug];
      if (prev && (prev.en !== v.en || prev.es !== v.es)) throw new Error(`[plantillas] la tarjeta de ${col} ${slug} no es igual en todas las paginas`);
      (dst[col] ??= {})[slug] = v;
    }
  }
  return dst;
}

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
export function derivar(paginas, prefijo = '', { sinReferencias = false, todoContenido = false } = {}) {
  // `todoContenido` (paginas estaticas, una sola pagina): lo que en una coleccion seria
  // contenido solo si cambia entre paginas —enlaces, video embebido, srcset y JSON del
  // lightbox que salen de la imagen— se trata como contenido aunque no cambie.
  const tk = paginas.map((p) => ({ en: trocear(p.en), es: p.es ? trocear(p.es) : null }));
  const base = tk[0].en;
  // 1. Misma estructura en todas (y ES igual que EN)
  // La clase y el id cuentan: con solo el nombre, `div` frente a `div` «coincide» y la
  // divergencia se detecta tarde, dentro de otro contenedor.
  const firma = (ts) => ts.map((t) => (t.t === 'tag' ? `${t.cierre ? '/' : ''}${t.nombre}${t.cierre ? '' : `.${(t.attrs.find((a) => a.n === 'class')?.v ?? '').replace(/\s+/g, '+')}#${t.attrs.find((a) => a.n === 'id')?.v ?? ''}`}` : t.t === 'texto' ? (t.raw.trim() ? '#' : '_') : 'B')).join(' ');
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
  const referencias = {};
  let videoPendiente = null;
  const formatos = {};
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
      const jsonDeImagen = todoContenido && /class="w-json"/.test(t.raw) && ultimaImagen && valoresImagen(ultimaImagen)?.[0] && t.raw.includes(valoresImagen(ultimaImagen)[0]);
      if (vs.size > 1 || jsonDeImagen) {
        // El JSON del lightbox (script.w-json) repite la URL de la imagen que lo precede:
        // es un DERIVADO de esa imagen, comprobado en todas las paginas.
        if (!ultimaImagen || !/class="w-json"/.test(t.raw)) throw new Error(`[plantillas] bloque <script>/<style> que cambia entre paginas en el token ${i}: ${t.raw.slice(0, 100)}`);
        const pats = tk.map((x, j) => {
          const src = valoresImagen(ultimaImagen)[j];
          if (!x.en[i].raw.includes(src)) throw new Error(`[plantillas] ${paginas[j].slug}: w-json que no sale de la imagen ${ultimaImagen}`);
          return x.en[i].raw.split(src).join(`${MARCA}src${MARCA}`);
        });
        const distintos = [...new Set(pats)];
        if (distintos.length > 2) throw new Error(`[plantillas] w-json con mas de dos formatos en ${ultimaImagen}`);
        const clave = `${ultimaImagen}.json`;
        huecos[clave] = { tipo: 'derivado', alcance: 'pagina', de: ultimaImagen, modo: 'src', crudo: true, ...(distintos.length === 1 ? { patron: distintos[0] } : { patrones: distintos }) };
        // Dos formatos (JSON en varias lineas o en una): la lista decide cual por el
        // x-wf-template de la pagina (ver derivarConListas).
        if (distintos.length > 1) formatos[clave] = pats.map((pt) => distintos.indexOf(pt));
        plantilla.push(`${MARCA}${clave}${MARCA}`);
        continue;
      }
      plantilla.push(t.raw);
      continue;
    }
    if (t.t === 'texto') {
      const limpio = t.raw.trim();
      if (!limpio) { plantilla.push(t.raw); continue; }
      // Marcas de lista, heredado u opcional (dos opcionales seguidos van en un solo nodo).
      if (/^(?:\u0002[LWO]\d+\u0002)+$/.test(limpio)) {
        if (tk.some((x) => x.en[i].raw.trim() !== limpio)) throw new Error(`[plantillas] marcador de lista desalineado en el token ${i}`);
        plantilla.push(t.raw.replace(limpio, limpio.replace(/\u0002([LWO])(\d+)\u0002/g, (_m, l, n) => `${MARCA}${{ L: 'lista', W: 'heredado', O: 'opcional' }[l]}:${n}${MARCA}`)));
        continue;
      }
      const clave = nuevaClave(`s${seccion}.${ctx()}.t`);
      const porPagina = tk.map((x) => ({ en: decodificar(x.en[i].raw.trim()), ...(x.es ? { es: decodificar(x.es[i].raw.trim()) } : {}) }));
      hueco(clave, 'texto', porPagina, tk.some((x) => x.en[i].raw.includes('"') || x.es?.[i].raw.includes('"')) ? { comillas: 'literal' } : {});
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
    const refDef = !autocierre && !sinReferencias && REFERENCIAS.find((r) => r.abre.test(t.raw));
    if (refDef) {
      let prof = 0, c = i;
      for (; c < base.length; c++) {
        const q = base[c];
        if (q.t !== 'tag' || VACIOS.has(q.nombre) || q.raw.endsWith('/>')) continue;
        prof += q.cierre ? -1 : 1;
        if (prof === 0) break;
      }
      const html = (ts) => ts.slice(i, c + 1).map((q) => q.raw).join('');
      const porPagina = tk.map((x, j) => {
        const slug = refDef.slug(x.en[i].raw.match(refDef.abre)[1]);
        if (!slug) throw new Error(`[plantillas] ${paginas[j].slug}: ${x.en[i].raw} no corresponde a ningun ${refDef.coleccion}`);
        unirReferencias(referencias, { [refDef.coleccion]: { [slug]: { en: html(x.en), es: x.es ? html(x.es) : null } } });
        return { ref: slug };
      });
      hueco(`${claveEl}.ref`, 'referencia', porPagina, { coleccion: refDef.coleccion });
      plantilla.push(`${MARCA}${claveEl}.ref${MARCA}`);
      i = c;
      continue;
    }
    if (!autocierre) pila.push({ nombre: t.nombre, k });
    const tipoInput = t.attrs.find((a) => a.n === 'type')?.v;
    // Una <img> cuyo JUEGO de atributos cambia entre paginas (srcset/sizes/width/height
    // segun de donde sale la foto: /cms-img con sus derivados, /images/cliente con los
    // suyos, el placeholder SVG sin ninguno). La etiqueta entera se DERIVA del src: una
    // variante por prefijo de ruta, comprobada pagina a pagina. Contenido solo son el src
    // (hueco imagen) y el alt (hueco atributo); lo demas lo pone el codigo, como hoy.
    // Patron de la etiqueta de la pagina j: src, alt y la raiz del fichero (en srcset) marcados.
    const patronDe = (j) => {
      const t0 = tk[j].en[i];
      const srcA = t0.attrs.find((a) => a.n === 'src');
      const altV = t0.attrs.find((a) => a.n === 'alt');
      const partes = [[srcA.ini, srcA.v.length, `${MARCA}src${MARCA}`]];
      if (altV?.v != null) partes.push([altV.ini, altV.v.length, `${MARCA}alt${MARCA}`]);
      let patron = t0.raw;
      for (const [ini, largo, m] of partes.sort((x, y) => y[0] - x[0])) patron = patron.slice(0, ini) + m + patron.slice(ini + largo);
      const raiz0 = srcA.v.replace(/\.[a-z0-9]+$/i, '');
      return patron.split(`${MARCA}src${MARCA}`).map((trozo) => trozo.split(raiz0).join(`${MARCA}raiz${MARCA}`)).join(`${MARCA}src${MARCA}`);
    };
    const SIN_RESP = (pt) => pt.replace(/ (?:srcset|sizes|width|height)="[^"]*"/g, '');
    const conSrc = t.nombre === 'img' && tk.every((x) => x.en[i].attrs.some((a) => a.n === 'src' && a.v));
    const patrones = conSrc ? tk.map((_x, j) => patronDe(j)) : [];
    if (conSrc && new Set(patrones).size > 1) {
      // Lo unico que puede cambiar fuera del src y el alt es el juego responsive.
      if (new Set(patrones.map(SIN_RESP)).size > 1) throw new Error(`[plantillas] ${claveEl}: <img> que cambia en algo mas que src, alt y srcset/sizes/width/height`);
      const srcs = tk.map((x) => x.en[i].attrs.find((a) => a.n === 'src').v);
      const grupos = new Map();
      patrones.forEach((pt, j) => grupos.set(pt, [...(grupos.get(pt) ?? []), j]));
      const variantes = [];
      for (const [patron, js] of grupos) {
        const dirs = js.map((j) => srcs[j].split('/').slice(0, -1));
        let pre = dirs[0];
        for (const d of dirs) { let q = 0; while (q < pre.length && pre[q] === d[q]) q++; pre = pre.slice(0, q); }
        variantes.push({ prefijo: pre.join('/') + '/', patron, paginas: js });
      }
      // Cada pagina tiene que caer en SU variante por el prefijo mas largo que casa.
      const elegir = (src) => variantes.filter((v) => src.startsWith(v.prefijo)).sort((a, b) => b.prefijo.length - a.prefijo.length)[0];
      tk.forEach((x, j) => {
        const v = elegir(srcs[j]);
        if (!v || !v.paginas.includes(j)) throw new Error(`[plantillas] ${paginas[j].slug}: el src no explica que variante de <img> lleva (${claveEl})`);
        const alt = x.en[i].attrs.find((a) => a.n === 'alt')?.v ?? '';
        const out = v.patron.split(`${MARCA}src${MARCA}`).join(srcs[j]).split(`${MARCA}raiz${MARCA}`).join(srcs[j].replace(/\.[a-z0-9]+$/i, '')).split(`${MARCA}alt${MARCA}`).join(alt);
        if (out !== x.en[i].raw) throw new Error(`[plantillas] ${paginas[j].slug}: la variante de <img> no reproduce la etiqueta (${claveEl})\n   hoy: ${x.en[i].raw.slice(0, 160)}\n   sale: ${out.slice(0, 160)}`);
      });
      const noRaster = [...new Set(srcs.filter((v) => !RASTER.test(v)))];
      hueco(claveEl, 'imagen', srcs.map((src) => (RASTER.test(src) ? { src: decodificar(src) } : { vacia: true })), noRaster.length === 1 ? { respaldo: noRaster[0] } : {});
      if (noRaster.length > 1) throw new Error(`[plantillas] ${claveEl}: varias imagenes no raster`);
      hueco(`${claveEl}.alt`, 'atributo', tk.map((x, j) => ({ en: decodificar(x.en[i].attrs.find((a) => a.n === 'alt')?.v ?? ''), ...(x.es ? { es: decodificar(x.es[i].attrs.find((a) => a.n === 'alt')?.v ?? '') } : {}) })));
      huecos[`${claveEl}.etiqueta`] = { tipo: 'etiqueta', alcance: 'pagina', de: claveEl, alt: `${claveEl}.alt`, variantes: variantes.map(({ prefijo, patron }) => ({ prefijo, patron })) };
      ultimaImagen = claveEl; srcImagen[claveEl] = srcs;
      plantilla.push(`${MARCA}${claveEl}.etiqueta${MARCA}`);
      continue;
    }
    // El video embebido (embedly): width/height/title del iframe y el padding-top de su
    // caja dependen SOLO del proveedor (YouTube o Vimeo). Es diseño: lo pone el codigo
    // segun el proveedor del src, que es lo unico que se guarda.
    const proveedor = (src) => decodificar(src).match(/[?&]display_name=([^&]+)/)?.[1];
    if (t.nombre === 'iframe' && /\bembedly-embed\b/.test(t.attrs.find((a) => a.n === 'class')?.v ?? '')) {
      const srcs = tk.map((x) => x.en[i].attrs.find((a) => a.n === 'src')?.v);
      const patronIf = (j) => { const a = tk[j].en[i].attrs.find((x) => x.n === 'src'); const raw = tk[j].en[i].raw; return raw.slice(0, a.ini) + `${MARCA}src${MARCA}` + raw.slice(a.ini + a.v.length); };
      const pats = tk.map((_x, j) => patronIf(j));
      if (new Set(pats).size > 1 || videoPendiente) {
        const porProv = {};
        pats.forEach((pt, j) => {
          const pv = proveedor(srcs[j]);
          if (!pv) throw new Error(`[plantillas] ${paginas[j].slug}: video sin display_name (${claveEl})`);
          if (porProv[pv] && porProv[pv] !== pt) throw new Error(`[plantillas] ${claveEl}: el iframe de ${pv} no es igual en todas las paginas`);
          porProv[pv] = pt;
        });
        hueco(`${claveEl}.src`, 'valor', srcs.map((v) => ({ valor: decodificar(v) })));
        huecos[`${claveEl}.etiqueta`] = { tipo: 'etiqueta', alcance: 'pagina', por: 'proveedor', de: `${claveEl}.src`, variantes: Object.entries(porProv).map(([proveedor, patron]) => ({ proveedor, patron })) };
        if (videoPendiente) { huecos[videoPendiente].de = `${claveEl}.src`; videoPendiente = null; }
        plantilla.push(`${MARCA}${claveEl}.etiqueta${MARCA}`);
        continue;
      }
    }
    if (t.nombre === 'div' && /\bw-video\b/.test(t.attrs.find((a) => a.n === 'class')?.v ?? '')) {
      const estilos = tk.map((x) => x.en[i].attrs.find((a) => a.n === 'style')?.v);
      const sig = tk.map((x) => x.en[i + 1]);
      if (new Set(estilos).size > 1 && sig.every((q) => q.nombre === 'iframe')) {
        const mapa = {};
        estilos.forEach((st, j) => {
          const pv = proveedor(sig[j].attrs.find((a) => a.n === 'src')?.v ?? '');
          if (!pv || (mapa[pv] && mapa[pv] !== st)) throw new Error(`[plantillas] ${paginas[j].slug}: la proporcion del video no sale del proveedor (${claveEl})`);
          mapa[pv] = st;
        });
        const a = t.attrs.find((x) => x.n === 'style');
        const clave = `${claveEl}.style`;
        huecos[clave] = { tipo: 'derivado', alcance: 'pagina', modo: 'proveedor', de: null, mapa };
        videoPendiente = clave;
        plantilla.push(t.raw.slice(0, a.ini) + `${MARCA}${clave}${MARCA}` + t.raw.slice(a.ini + a.v.length));
        continue;
      }
    }
    // Sustituciones dentro de la etiqueta (de atras adelante para no mover posiciones)
    const subs = [];
    const valorEn = (j, n) => tk[j].en[i].attrs.find((a) => a.n === n)?.v;
    const valorEs = (j, n) => tk[j].es?.[i].attrs.find((a) => a.n === n)?.v;
    for (const a of t.attrs) {
      if (a.v == null) continue;
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
      } else if (a.n === 'src' && t.nombre === 'img' && varia && enTodas.every((v) => /\.svg$/i.test(v))) {
        // Iconos SVG que elige cada pagina (los «why choose» de las fichas): imagen de
        // contenido, como las raster. Sanity guarda SVG como asset de imagen.
        hueco(claveEl, 'imagen', enTodas.map((src) => ({ src: decodificar(src) })));
        subs.push([a.ini, a.v.length, claveEl]);
      } else if (a.n === 'href' && (varia || (todoContenido && t.nombre === 'a' && !/^(#|tel:|mailto:)/.test(a.v)))) {
        hueco(`${claveEl}.href`, 'enlace', enTodas.map((href) => ({ href: decodificar(href) })));
        subs.push([a.ini, a.v.length, `${claveEl}.href`]);
      } else if (a.n === 'srcset' && (varia || todoContenido)) {
        const src0 = valorEn(0, 'src');
        const raiz0 = src0.replace(/\.[a-z0-9]+$/i, '');
        const patron = a.v.split(raiz0).join(`${MARCA}raiz${MARCA}`);
        if (!patron.includes(`${MARCA}raiz${MARCA}`)) throw new Error(`[plantillas] ${claveEl}: srcset que no sale del src (${src0})`);
        tk.forEach((_x, j) => {
          const raiz = valorEn(j, 'src').replace(/\.[a-z0-9]+$/i, '');
          if (patron.split(`${MARCA}raiz${MARCA}`).join(raiz) !== valorEn(j, 'srcset')) throw new Error(`[plantillas] ${paginas[j].slug}: srcset que no sale del src en ${claveEl}`);
        });
        huecos[`${claveEl}.srcset`] = { tipo: 'derivado', alcance: 'pagina', de: claveEl, patron };
        subs.push([a.ini, a.v.length, `${claveEl}.srcset`]);
      } else if ((varia || (todoContenido && t.nombre === 'iframe' && a.n === 'src')) && ((t.nombre === 'iframe' && a.n === 'src') || (a.n === 'style' && /\bw-video\b/.test(t.attrs.find((x) => x.n === 'class')?.v ?? '')))) {
        // El video embebido (embedly) y su proporcion: contenido de la pagina, sin traducir.
        hueco(`${claveEl}.${a.n}`, 'valor', enTodas.map((v) => ({ valor: decodificar(v) })));
        subs.push([a.ini, a.v.length, `${claveEl}.${a.n}`]);
      } else if (varia) {
        throw new Error(`[plantillas] atributo «${a.n}» que cambia entre paginas en ${claveEl}: ${[...new Set(enTodas)].slice(0, 3).join(' | ')}`);
      }
    }
    let raw = t.raw;
    for (const [ini, largo, clave] of subs.sort((x, y) => y[0] - x[0])) raw = raw.slice(0, ini) + `${MARCA}${clave}${MARCA}` + raw.slice(ini + largo);
    plantilla.push(raw);
  }
  return { plantilla: plantilla.join(''), huecos, valores, compartidos, referencias, formatos };
}

/**
 * Plantilla de cada coleccion referenciada (la tarjeta de producto), derivada de las
 * tarjetas que salen en las paginas. Devuelve tambien el resolvedor para `lector`.
 */
export function derivarReferencias(d) {
  const r = {};
  for (const [col, porSlug] of Object.entries(d.referencias ?? {})) {
    const slugs = Object.keys(porSlug).sort();
    // El `data-product` de la tarjeta es la clave del producto (DATA_PRODUCT): lo pone el
    // codigo, no se guarda.
    const ID = `${MARCA}tarjeta.dataProduct${MARCA}`;
    const conId = (h, slug) => h && h.replace(`data-product="${DATA_PRODUCT[slug]}"`, `data-product="${ID}"`);
    const dr = derivar(slugs.map((slug) => ({ slug, en: conId(porSlug[slug].en, slug), es: conId(porSlug[slug].es, slug) })), '', { sinReferencias: true });
    dr.huecos['tarjeta.dataProduct'] = { tipo: 'valor', alcance: 'codigo', de: 'DATA_PRODUCT[slug] en scripts/lib/fichas.mjs' };
    if (Object.keys(dr.formatos).length) throw new Error(`[plantillas] la tarjeta de ${col} tiene formatos variables`);
    if (Object.keys(dr.compartidos).length) throw new Error(`[plantillas] la tarjeta de ${col} tiene textos comunes a todas: no hay donde guardarlos`);
    r[col] = { ...dr, slugs };
  }
  const resolver = (col, slug, idioma) => {
    const dr = r[col];
    const j = dr?.slugs.indexOf(slug) ?? -1;
    if (j < 0) throw new Error(`[plantillas] sin tarjeta para ${col} ${slug}`);
    const lec = lector(dr.huecos, dr.valores[j], {}, idioma);
    return rellenar(dr.plantilla, dr.huecos, (k) => (k === 'tarjeta.dataProduct' ? DATA_PRODUCT[slug] : lec(k)));
  };
  return { porColeccion: r, resolver };
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
    listas.push({ abre: m.index, desde, fin, items, wft: w ? { ini: m.index - w[0].length, raw: w[0] } : null });
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
  const d = derivarColeccion_(paginas);
  if (!paginas[0]?.cuerpo) return d;
  // El texto enriquecido es un solo hueco `cuerpo` (Portable Text en el documento).
  const vacio = `${paginas[0].cuerpo}></div>`;
  if (d.plantilla.split(vacio).length !== 2) throw new Error(`[plantillas] la plantilla no tiene un unico ${vacio}`);
  return { ...d, plantilla: d.plantilla.replace(vacio, `${paginas[0].cuerpo}>${MARCA}cuerpo${MARCA}</div>`), huecos: { ...d.huecos, cuerpo: { tipo: 'cuerpo' } } };
}

function derivarColeccion_(paginas) {
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
      if (process.env.PP_DEPURAR) console.error('[opcionales] contenedor', e.contenedor.slice(0, 90), '->', nuevos.map((o) => o.clave));
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
  const conWft = new Set(variables.filter((k) => info.some((x) => x.en[k].wft)));
  const conMarcas = (html, listas) => {
    let h = html;
    for (const k of [...variables].sort((a, b) => b - a)) {
      const l = listas[k];
      h = h.slice(0, l.desde) + `\u0002L${k}\u0002` + h.slice(l.fin);
      // El x-wf-template va justo delante de la lista; donde no esta, la marca va en su
      // sitio y el heredado queda vacio.
      if (l.wft) h = h.slice(0, l.wft.ini) + `\u0002W${k}\u0002` + h.slice(l.wft.ini + l.wft.raw.length);
      else if (conWft.has(k)) h = h.slice(0, l.abre) + `\u0002W${k}\u0002` + h.slice(l.abre);
    }
    return h;
  };
  const d = derivar(paginas.map((p, i) => ({ slug: p.slug, en: conMarcas(p.en, info[i].en), es: p.es ? conMarcas(p.es, info[i].es) : null })));
  if (Object.keys(d.formatos).length) throw new Error(`[plantillas] w-json con dos formatos fuera de una lista: ${Object.keys(d.formatos).join(', ')}`);
  d.heredados = paginas.map(() => ({}));
  const heredados = d.heredados;
  for (const k of variables) {
    const elementos = [];
    paginas.forEach((p, i) => info[i].en[k].items.forEach((it, j) => elementos.push({ slug: `${p.slug}#${j}`, pagina: i, en: it, es: info[i].es ? info[i].es[k].items[j] : null })));
    const di = derivar(elementos, `L${k}.`);
    unirReferencias(d.referencias, di.referencias);
    // El JSON del lightbox: en varias lineas en las galerias de Webflow (las que llevan
    // x-wf-template) y en una en las generadas despues. Se calcula, no se guarda.
    for (const [clave, idx] of Object.entries(di.formatos)) {
      const porLegado = {};
      elementos.forEach((e, j) => {
        const legado = info[e.pagina].en[k].wft ? 'legado' : 'nuevo';
        const pt = di.huecos[clave].patrones[idx[j]];
        if (porLegado[legado] && porLegado[legado] !== pt) throw new Error(`[plantillas] el formato del w-json no sale del x-wf-template (${e.slug})`);
        porLegado[legado] = pt;
      });
      const { patrones: _p, ...resto } = di.huecos[clave];
      di.huecos[clave] = { ...resto, porLegado };
    }
    d.huecos[`lista:${k}`] = { tipo: 'lista', alcance: 'pagina', plantilla: di.plantilla, huecos: di.huecos };
    Object.assign(d.compartidos, di.compartidos);
    paginas.forEach((_p, i) => { d.valores[i][`lista:${k}`] = elementos.map((e, j) => (e.pagina === i ? di.valores[j] : null)).filter(Boolean); });
    if (info.some((x) => x.en[k].wft)) {
      d.huecos[`heredado:${k}`] = { tipo: 'heredado', alcance: 'codigo' };
      info.forEach((x, i) => {
        if (x.es && x.es[k].wft?.raw !== x.en[k].wft?.raw) throw new Error(`[plantillas] ${paginas[i].slug}: x-wf-template distinto en ES`);
        heredados[i][`heredado:${k}`] = x.en[k].wft?.raw ?? '';
      });
    }
  }
  // 3. Cada bloque opcional, derivado con las paginas que lo tienen.
  void originales;
  opc.forEach((o, k) => {
    const conBloque = paginas.map((p, i) => (bloquesOpc[k][i] ? { slug: `${p.slug}~${o.clave}`, i, ...bloquesOpc[k][i] } : null)).filter(Boolean);
    const db = derivarColeccion(conBloque.map((x) => ({ slug: x.slug, en: x.en, es: x.es ?? null })));
    unirReferencias(d.referencias, db.referencias);
    const clave = `opcional:${k}`;
    d.huecos[clave] = { tipo: 'opcional', alcance: 'pagina', bloque: o.clave, plantilla: db.plantilla, huecos: db.huecos };
    // Un bloque sin nada propio de la pagina que esta justo donde esta el x-wf-template
    // (el `w-dyn-hide` «No items found.» de Webflow, oculto) es marcado heredado: su
    // presencia se calcula del x-wf-template, no se guarda.
    const soloComun = Object.entries(db.huecos).every(([kk, h]) => kk.startsWith('__') || h.alcance === 'compartido');
    const legado = Object.keys(d.huecos).filter((kk) => kk.startsWith('heredado:')).find((kk) => paginas.every((_p, i) => Boolean(d.heredados[i][kk]) === Boolean(bloquesOpc[k][i])));
    if (soloComun && legado) d.huecos[clave].siLegado = legado;
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
export function lector(huecos, valoresPagina, compartidos, idioma, heredados = {}, resolver = null) {
  return (clave) => {
    if (clave === '@legado') return heredados['@legado'];
    const h = huecos[clave];
    if (h.tipo === 'lista') return (valoresPagina[clave] ?? []).map((v) => lector(h.huecos, v, compartidos, idioma, { '@legado': Boolean(heredados[clave.replace('lista:', 'heredado:')]) }, resolver));
    if (h.tipo === 'opcional') {
      const v = valoresPagina[clave];
      if (!v) return null;
      const pre = h.huecos.__prefijoCompartidos;
      const comp = new Proxy({}, { get: (_t, k) => compartidos[pre + String(k)] });
      const her = new Proxy({}, { get: (_t, k) => heredados[pre + String(k)] });
      return lector(h.huecos, v, comp, idioma, her, resolver);
    }
    if (h.tipo === 'heredado') return heredados[clave];
    if (h.tipo === 'cuerpo') return ''; // la paridad compara con el cuerpo vaciado
    const v = h.alcance === 'compartido' ? compartidos[clave] : valoresPagina[clave];
    if (v == null) return undefined;
    if (h.tipo === 'imagen') return v.vacia ? h.respaldo : v.src;
    if (h.tipo === 'referencia') return resolver(h.coleccion, v.ref, idioma);
    if (h.tipo === 'enlace') return v.href;
    if (h.tipo === 'valor') return v.valor;
    return idioma === 'es' ? (v.es ?? v.en) : v.en;
  };
}

const normalizar = (h) => decodificar(h.replace(/<[^>]+>/g, (t) => t.replace(/\s+/g, ' ').replace(/\s*\/?>$/, '>')));

/**
 * Las paginas estaticas que se pintan desde su fragmento, con su ES tal como lo pinta
 * hoy el sitio: la home con HOME_ES (src/pages/es/index.astro) y el resto por el
 * catch-all /es/[...ruta] con su diccionario de PAGINAS_ES.
 */
export async function estaticasDe() {
  const { traducirHtml } = await cargarTs('src/i18n/index.ts');
  const { PAGINAS_ES, diccionarioDe } = await cargarTs('src/i18n/paginas.es.ts');
  const { HOME_ES } = await cargarTs('src/i18n/home.es.ts');
  const { MINIATURAS_ES } = await import('../lib/miniaturas.mjs');
  const { idDeRuta } = await import('../../src/lib/rutas-sanity.mjs');
  const meta = JSON.parse(await fs.readFile(path.join(RAIZ, 'src/contenido-migrado/estaticas/_meta.json'), 'utf8'));
  const rutas = ['/', ...PAGINAS_ES.map((p) => p.en)];
  const paginas = [];
  for (const ruta of rutas) {
    const en = await fs.readFile(path.join(RAIZ, 'src/contenido-migrado/estaticas', meta[ruta].fragmento), 'utf8');
    const dic = ruta === '/' ? { ...HOME_ES, ...MINIATURAS_ES } : diccionarioDe(PAGINAS_ES.find((p) => p.en === ruta));
    const id = idDeRuta(ruta).id;
    paginas.push({ ruta, id, slug: id.replace(/^page-/, ''), en, es: traducirHtml(en, dic).html });
  }
  return paginas;
}

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
    const es = dic ? traducirHtml(en, { ...COMUN_ES, ...dic }).html : null;
    if (c.cuerpo) paginas.push({ slug: item.slug, item, en: vaciarCuerpo(en, c.cuerpo), es: es && vaciarCuerpo(es, c.cuerpo), cuerpo: c.cuerpo });
    else paginas.push({ slug: item.slug, item, en, es });
  }
  return paginas;
}

/** Paridad: rellenar(plantilla, valores de la pagina) == fragmento, en EN y ES. */
export function paridad(d, paginas, resolver = null) {
  const fallos = [];
  paginas.forEach((p, i) => {
    for (const idioma of ['en', 'es']) {
      const original = p[idioma];
      if (!original) continue;
      const salida = rellenar(d.plantilla, d.huecos, lector(d.huecos, d.valores[i], d.compartidos, idioma, d.heredados?.[i], resolver));
      const a = normalizar(original), b = normalizar(salida);
      if (a !== b) {
        let k = 0; while (k < a.length && a[k] === b[k]) k++;
        fallos.push(`${p.slug} ${idioma}: difiere en ${k}\n      hoy:   …${a.slice(Math.max(0, k - 70), k + 70)}\n      salida:…${b.slice(Math.max(0, k - 70), k + 70)}`);
      }
    }
  });
  return fallos;
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes('--ndjson') && process.argv[2] !== 'page') {
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
  // La tarjeta de un producto referenciado: su plantilla (codigo) con su `tarjeta` (Sanity).
  const tarjetaPl = await fs.readFile(path.join(RAIZ, 'src/plantillas/product.tarjeta.html'), 'utf8').catch(() => null);
  const tarjetaHu = tarjetaPl && JSON.parse(await fs.readFile(path.join(RAIZ, 'src/plantillas/product.tarjeta.json'), 'utf8'));
  conv.tarjeta = (destino, idioma) => {
    const doc = docs.find((x) => x._id === destino._ref);
    if (!doc?.tarjeta) throw new Error(`[ndjson] ${destino._ref} sin tarjeta`);
    const slug = doc.slug.current;
    const lec = lectorSanity(tarjetaHu, { secciones: [doc.tarjeta] }, null, idioma, conv);
    return rellenar(tarjetaPl, tarjetaHu, (k) => (k === 'tarjeta.dataProduct' ? DATA_PRODUCT[slug] : lec(k)));
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
} else if (import.meta.url === `file://${process.argv[1]}` && process.argv[2] === 'page') {
  // Estaticas: una plantilla por pagina (src/plantillas/page-<id>.html), todo contenido.
  process.chdir(RAIZ);
  const paginas = await estaticasDe();
  await cerrarTs();
  let fallos = 0;
  if (process.argv.includes('--ndjson')) {
    // Contra lo que se importa: plantilla del codigo + documento page-<id> del NDJSON.
    const { lectorSanity } = await import('../../src/lib/plantilla-sanity.mjs');
    const { rutaDeId } = await import('../../src/lib/rutas-sanity.mjs');
    const { canonica } = await import('../../src/lib/canonica.mjs');
    const docs = (await fs.readFile(process.argv[process.argv.indexOf('--ndjson') + 1], 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
    const conv = {
      rutaImagen: (img) => '/' + path.relative(path.join(RAIZ, 'public'), img._sanityAsset.replace(/^image@file:\/\//, '')),
      hrefDe: (e) => (e.destino ? rutaDeId(e.destino._ref) : e.href) + (e.ancla ? `#${e.ancla}` : ''),
    };
    const hrefs = (h) => h.replace(/href="(\/(?!\/)[^"#?]*)([^"]*)"/g, (_t, r, resto) => `href="${canonica(r)}${resto}"`);
    for (const p of paginas) {
      const doc = docs.find((x) => x._id === p.id);
      const pl = await fs.readFile(path.join(RAIZ, `src/plantillas/${p.id}.html`), 'utf8');
      const hu = JSON.parse(await fs.readFile(path.join(RAIZ, `src/plantillas/${p.id}.json`), 'utf8'));
      for (const idioma of ['en', 'es']) {
        const a = normalizar(hrefs(p[idioma])), b = normalizar(hrefs(rellenar(pl, hu, lectorSanity(hu, doc, null, idioma, conv))));
        if (a !== b) { fallos++; let k = 0; while (k < a.length && a[k] === b[k]) k++; console.log(`  FALLO ${p.ruta} ${idioma} en ${k}\n    hoy:    …${a.slice(Math.max(0, k - 70), k + 70)}\n    sanity: …${b.slice(Math.max(0, k - 70), k + 70)}`); }
      }
    }
    console.log(JSON.stringify({ paginas: paginas.length, comparadas: paginas.length * 2, identicas: paginas.length * 2 - fallos }));
    process.exit(fallos ? 1 : 0);
  }
  for (const p of paginas) {
    const d = derivar([p], '', { sinReferencias: true, todoContenido: true });
    d.heredados = [{}];
    const f = paridad(d, [p]);
    fallos += f.length;
    const cuenta = (t) => Object.values(d.huecos).filter((h) => h.tipo === t).length;
    console.log(`${p.ruta.padEnd(32)} textos ${cuenta('texto')} atributos ${cuenta('atributo')} imagenes ${cuenta('imagen')} enlaces ${cuenta('enlace')} videos ${cuenta('valor')} · paridad ${2 - f.length}/2`);
    for (const x of f) console.log('  FALLO', x);
    if (process.argv.includes('--escribir') && !f.length) {
      await fs.writeFile(path.join(RAIZ, `src/plantillas/${p.id}.html`), d.plantilla);
      await fs.writeFile(path.join(RAIZ, `src/plantillas/${p.id}.json`), JSON.stringify(d.huecos, null, 1) + '\n');
    }
  }
  console.log(JSON.stringify({ paginas: paginas.length, comparadas: paginas.length * 2, identicas: paginas.length * 2 - fallos }));
  process.exit(fallos ? 1 : 0);
} else if (import.meta.url === `file://${process.argv[1]}`) {
  process.chdir(RAIZ);
  const tipo = process.argv[2];
  if (!COLECCIONES[tipo]) { console.error(`uso: plantillas.mjs <${Object.keys(COLECCIONES).join('|')}> [--escribir]`); process.exit(1); }
  const paginas = await paginasDe(tipo);
  await cerrarTs();
  const d = derivarColeccion(paginas);
  const refs = derivarReferencias(d);
  const fallos = paridad(d, paginas, refs.resolver);
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
    for (const [col, dr] of Object.entries(refs.porColeccion)) {
      await fs.writeFile(path.join(RAIZ, `src/plantillas/${col}.tarjeta.html`), dr.plantilla);
      await fs.writeFile(path.join(RAIZ, `src/plantillas/${col}.tarjeta.json`), JSON.stringify(dr.huecos, null, 1) + '\n');
      console.log(`  escrito src/plantillas/${col}.tarjeta.html y .json (${dr.slugs.length} tarjetas)`);
    }
    console.log(`  escrito src/plantillas/${tipo}.html y .json`);
  }
  process.exit(fallos.length ? 1 : 0);
}
