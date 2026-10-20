/**
 * Purga y union del CSS de Webflow por pagina. Sin dependencias: ~120 lineas.
 *
 * QUE RESUELVE. Las 217 paginas cargaban 5 hojas bloqueantes (41 KB gz) y el 76–83 %
 * de `pergola-plus-florida.webflow.css` no se usaba en ninguna pagina concreta
 * (Lighthouse `unused-css-rules`). Es CSS de un exportador: trae las reglas de las
 * 34 plantillas del sitio en cada pagina.
 *
 * COMO. Se tokeniza la hoja en reglas (con los bloques @media/@supports anidados) y,
 * por pagina, se conservan SOLO los selectores cuyas clases, ids y etiquetas
 * existen en el HTML servido o en la lista blanca de clases de runtime
 * (scripts/lib/clases-runtime.json: las que ponen webflow.js y los scripts propios
 * al abrir menus, dropdowns, FAQ, estimador y formularios; la escribe
 * scripts/perf/clases-runtime.mjs midiendo el DOM antes y despues de cada
 * interaccion). Es CONSERVADOR a proposito:
 *   - `:not(...)`, `:is(...)`, `:where(...)`, `:has(...)` se tratan como «puede
 *     coincidir» (se vacian antes de mirar las clases);
 *   - los selectores de atributo, pseudo-clases y pseudo-elementos no descartan;
 *   - @font-face, @keyframes, @import y @charset se conservan enteros;
 *   - una etiqueta solo descarta si NO aparece en la pagina (html/body/* siempre).
 * Lo que se tira es lo que no puede aplicar: una clase que ni esta en el HTML ni la
 * pone ningun script. El diff visual de F2 (375/768/1440 x 16 plantillas) y la sonda
 * (menu, dropdown, FAQ, estimador, multipaso) son la prueba, no este comentario.
 *
 * Solo se purgan las TRES hojas de Webflow (normalize, webflow.css y la del sitio).
 * El CSS propio (_astro/*.css) se une sin purgar: sus clases las ponen scripts
 * propios en estados que una lista blanca medida puede no haber visto, y pesa 11 KB.
 */

/** Divide una hoja en nodos: {tipo:'regla', sel, cuerpo} | {tipo:'bloque', pre, hijos} | {tipo:'crudo', texto}. */
export function parsear(css) {
  const s = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let i = 0;
  const leerBloque = () => { // s[i] === '{'
    let prof = 0, j = i;
    for (; j < s.length; j++) {
      const c = s[j];
      if (c === '"' || c === "'") { const q = c; j++; while (j < s.length && s[j] !== q) { if (s[j] === '\\') j++; j++; } continue; }
      if (c === '{') prof++;
      else if (c === '}') { prof--; if (prof === 0) break; }
    }
    const dentro = s.slice(i + 1, j);
    i = j + 1;
    return dentro;
  };
  const nodos = [];
  while (i < s.length) {
    const inicio = i;
    while (i < s.length && /\s/.test(s[i])) i++;
    if (i >= s.length) break;
    let j = i;
    while (j < s.length && s[j] !== '{' && s[j] !== ';') j++;
    const cabecera = s.slice(i, j).trim();
    if (s[j] === ';' || j >= s.length) { nodos.push({ tipo: 'crudo', texto: cabecera + ';' }); i = j + 1; continue; }
    i = j;
    const dentro = leerBloque();
    if (/^@(media|supports|container|layer)\b/.test(cabecera)) nodos.push({ tipo: 'bloque', pre: cabecera, hijos: parsear(dentro) });
    else if (cabecera.startsWith('@')) nodos.push({ tipo: 'crudo', texto: `${cabecera}{${dentro}}` });
    else nodos.push({ tipo: 'regla', sel: cabecera, cuerpo: dentro.trim() });
    if (i === inicio) i++;
  }
  return nodos;
}

/** Separa selectores por comas de primer nivel (no dentro de parentesis). */
const partirSelectores = (sel) => {
  const out = []; let prof = 0, act = '';
  for (const c of sel) {
    if (c === '(') prof++; else if (c === ')') prof--;
    if (c === ',' && prof === 0) { out.push(act.trim()); act = ''; } else act += c;
  }
  if (act.trim()) out.push(act.trim());
  return out;
};

const SIEMPRE = new Set(['html', 'body', '*', 'from', 'to']);

/** true si el selector PUEDE coincidir en una pagina con esas clases/ids/etiquetas. */
export function puedeCoincidir(selector, clases, ids, etiquetas) {
  let s = selector;
  // Lo que va dentro de :not/:is/:where/:has no descarta: se vacia.
  for (let k = 0; k < 4; k++) s = s.replace(/:(?:not|is|where|has|nth-child|nth-of-type|nth-last-child)\(([^()]*)\)/g, '');
  s = s.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, ' ');   // pseudo
  s = s.replace(/\[[^\]]*\]/g, ' ');                   // atributos
  for (const m of s.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)) if (!clases.has(m[1].replace(/\\/g, ''))) return false;
  for (const m of s.matchAll(/#((?:\\.|[A-Za-z0-9_-])+)/g)) if (!ids.has(m[1].replace(/\\/g, ''))) return false;
  const sinClases = s.replace(/[.#](?:\\.|[A-Za-z0-9_-])+/g, ' ');
  for (const m of sinClases.matchAll(/(^|[\s>+~])([a-zA-Z][a-zA-Z0-9-]*)/g)) {
    const t = m[2].toLowerCase();
    if (!SIEMPRE.has(t) && !etiquetas.has(t)) return false;
  }
  return true;
}

/** Devuelve el CSS purgado para una pagina. */
export function purgar(nodos, clases, ids, etiquetas) {
  const out = [];
  for (const n of nodos) {
    if (n.tipo === 'crudo') { out.push(n.texto); continue; }
    if (n.tipo === 'bloque') {
      const dentro = purgar(n.hijos, clases, ids, etiquetas);
      if (dentro.trim()) out.push(`${n.pre}{${dentro}}`);
      continue;
    }
    const vivos = partirSelectores(n.sel).filter((sel) => puedeCoincidir(sel, clases, ids, etiquetas));
    if (vivos.length && n.cuerpo) out.push(`${vivos.join(',')}{${n.cuerpo}}`);
  }
  return out.join('\n');
}

/** Clases, ids y etiquetas del HTML servido (atributos class/id y nombres de tag). */
export function tokensDe(html) {
  const clases = new Set(), ids = new Set(), etiquetas = new Set();
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (c) clases.add(c);
  for (const m of html.matchAll(/\sid="([^"]*)"/g)) ids.add(m[1]);
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)/g)) etiquetas.add(m[1].toLowerCase());
  // Las que pone el script inline del <head> sobre <html> antes de pintar.
  clases.add('w-mod-js'); clases.add('w-mod-touch');
  return { clases, ids, etiquetas };
}

/** Minificado minimo y seguro: espacios y saltos de linea sobrantes.
 *  `:` NO entra en la lista: en un selector el espacio de delante es el combinador
 *  descendiente (`html[lang=es] :is(h1,…)`), y quitarlo lo convierte en
 *  `html[lang=es]:is(h1,…)`, que no casa nunca. Medido en F2: la version española
 *  volvio a salir con «Pedir Presupuesto» y «Cabañas De Aluminio» en mayusculas. */
export const compactar = (css) => css
  .replace(/\s*\n\s*/g, '\n').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').replace(/\n+/g, '');

// ---------------------------------------------------------------------------
// Union por pagina, sobre dist/ (F2, paso 1 y 2)
// ---------------------------------------------------------------------------
import { createHash } from 'node:crypto';
import fsSync from 'node:fs';
import pathMod from 'node:path';

/** Que hojas se purgan: PP_PURGA=webflow (solo las tres de Webflow) o todas (por
 *  defecto). Con solo Webflow quedaban 11-14 KB de CSS propio sin usar por pagina
 *  (BaseLayout.css lleva blog, FAQ, menu, tarjetas... para todas las rutas). */
const SOLO_WEBFLOW = process.env.PP_PURGA === 'webflow';
const PURGABLES = new Set(['/css/normalize.css', '/css/webflow.css', '/css/pergola-plus-florida.webflow.css']);
const purgable = (href) => !SOLO_WEBFLOW || PURGABLES.has(href);

/**
 * Sustituye las N <link rel="stylesheet"> del <head> por UNA hoja construida para la
 * pagina: normalize -> webflow -> sitio (las tres purgadas) -> CSS propio, en el
 * mismo orden que ya traia el <head> (el orden de la cascada es un contrato: ver los
 * comentarios de BaseLayout.astro).
 *
 * `modo`: 'enlace' escribe /_astro/pp-<hash>.css y deja un <link>; 'inline' mete la
 * hoja en un <style> del <head> (cero peticiones bloqueantes; se paga en bytes de
 * HTML, ~12 KB gz por pagina). Se decide midiendo: ver 01-PLAN-Y-DECISIONES.md.
 *
 * `ctx` se comparte entre paginas: cache de hojas parseadas y de resultados por
 * clave (misma hoja purgada para el mismo conjunto de tokens no se recalcula).
 */
export function unirCss(html, { raiz, safelist, modo = 'enlace', ctx }) {
  ctx.hojas ??= new Map();     // href -> {css, nodos}
  ctx.resultados ??= new Map(); // clave -> css final
  ctx.escritas ??= new Map();   // hash -> nombre de fichero
  const links = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map((m) => m[0]);
  if (links.length < 2) return { html, hojas: links.length };
  const hrefs = links.map((l) => decodeURIComponent(l.match(/href="([^"]+)"/)[1]));

  const { clases, ids, etiquetas } = tokensDe(html);
  for (const c of safelist) clases.add(c);
  const claveTokens = [...clases].sort().join(' ') + '|' + [...ids].sort().join(' ') + '|' + [...etiquetas].sort().join(' ');

  const partes = [];
  for (const href of hrefs) {
    if (!ctx.hojas.has(href)) {
      let css = fsSync.readFileSync(pathMod.join(raiz, href), 'utf8');
      // Las url() relativas se resolvian contra /css/ (o /_astro/); inline en el
      // <head> de /services/pavers/ se resolverian contra esa ruta. Medido: 404 de
      // /services/images/intracoastal-... en la primera prueba. Se absolutizan
      // contra la carpeta de la hoja antes de moverla.
      const carpeta = href.replace(/[^/]*$/, '');
      css = css.replace(/url\(\s*(['"]?)(?!data:|https?:|\/|#)([^'")]+)\1\s*\)/g, (t, q, rel) => {
        const abs = pathMod.posix.normalize(carpeta + rel);
        return `url(${q}${abs}${q})`;
      });
      ctx.hojas.set(href, { css, nodos: purgable(href) ? parsear(css) : null });
    }
    const h = ctx.hojas.get(href);
    if (!h.nodos) { partes.push(h.css); continue; }
    const k = href + '::' + createHash('sha1').update(claveTokens).digest('hex');
    if (!ctx.resultados.has(k)) ctx.resultados.set(k, compactar(purgar(h.nodos, clases, ids, etiquetas)));
    partes.push(ctx.resultados.get(k));
  }
  const css = partes.join('\n');
  let etiqueta;
  if (modo === 'inline') {
    etiqueta = `<style>${css}</style>`;
  } else {
    const hash = createHash('sha256').update(css).digest('base64url').slice(0, 10);
    const nombre = `/_astro/pp-${hash}.css`;
    if (!ctx.escritas.has(hash)) { fsSync.writeFileSync(pathMod.join(raiz, nombre), css); ctx.escritas.set(hash, nombre); }
    etiqueta = `<link rel="stylesheet" href="${nombre}">`;
  }
  let salida = html.replace(links[0], etiqueta);
  for (const l of links.slice(1)) salida = salida.replace(l, '');
  return { html: salida, hojas: links.length, bytes: css.length };
}

// ---------------------------------------------------------------------------
// /js/*.js con hash en el nombre (F6): para servirlos `immutable` sin riesgo
// ---------------------------------------------------------------------------
/**
 * jquery-3.5.1.min.js y webflow.js se sirven desde /js/ sin hash: con cache-control
 * immutable, un cambio de contenido con el mismo nombre se quedaria un año en la
 * cache de quien ya lo tuviera. Se copia cada uno a /js/<nombre>.<hash10>.js y se
 * reescribe el src en el HTML; el `integrity` sigue valiendo (mismo contenido). El
 * fichero sin hash se sigue sirviendo por si alguien lo tiene enlazado.
 */
export function versionarJs(html, { raiz, ctx }) {
  ctx.js ??= new Map();
  return html.replace(/(<script\b[^>]*\ssrc=")(\/js\/[^"]+?)(\.js")/g, (t, a, base, z) => {
    const rel = base + '.js';
    if (!ctx.js.has(rel)) {
      const abs = pathMod.join(raiz, rel);
      if (!fsSync.existsSync(abs)) { ctx.js.set(rel, null); return t; }
      const hash = createHash('sha256').update(fsSync.readFileSync(abs)).digest('base64url').slice(0, 10);
      const nuevo = `${base}.${hash}.js`;
      fsSync.copyFileSync(abs, pathMod.join(raiz, nuevo));
      ctx.js.set(rel, nuevo);
    }
    const nuevo = ctx.js.get(rel);
    return nuevo ? `${a}${nuevo}"` : t;
  });
}
