#!/usr/bin/env node
/**
 * J6 · check:sanity-completo (C8, C9, T2). Sobre lo que lee lib/sanity-leer.mjs:
 *   - el documento efectivo es la version del loop (Release o `drafts.*`) si existe, y si no el
 *     publicado: «publicado + Release» de la especificacion;
 *   - todo campo del esquema rellenado, recorriendo objetos y listas, salvo los ocultos
 *     (`hidden: true` o su funcion `hidden` da true) y lo que permite 02-VACIOS-PERMITIDOS.json;
 *   - `alt.es` distinto de `alt.en` en toda imagen no decorativa;
 *   - `seo.indexable === false` <=> la pagina (EN y ES) lleva noindex en el dist de produccion.
 *
 *     node scripts/seo-loop/j06-sanity-completo.mjs [--inventario]
 *
 * Con --inventario imprime los campos vacios agrupados (para escribir los vacios permitidos).
 */
import fs from 'node:fs';
import path from 'node:path';
import { puerta, sanityLoop, vaciosPermitidos, paginas, datos, DIST } from './lib/comun.mjs';
import { rutaDe } from '../../src/lib/rutas-sanity.mjs';

const INVENTARIO = process.argv.includes('--inventario');
const vacio = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0)
  || (typeof v === 'string' && !v.trim());
const fnOculto = new Map();
const oculto = (campo, ctx) => {
  if (campo.oculto) return true;
  if (!campo.ocultoFn) return false;
  if (!fnOculto.has(campo.ocultoFn)) fnOculto.set(campo.ocultoFn, new Function(`return (${campo.ocultoFn})`)());
  try { return Boolean(fnOculto.get(campo.ocultoFn)(ctx)); } catch { return false; }
};
// Un patron del fichero de vacios: «faq.claves», «product.videoFicha», «*.tarjeta.elementos».
const casa = (patron, ruta) => new RegExp(`^${patron.split('.').map((p) => (p === '*' ? '[^.]+' : p.replace(/[[\]]/g, '\\$&'))).join('\\.')}(\\..*)?$`).test(ruta);

await puerta('J6', 'check:sanity-completo', () => {
  const s = sanityLoop();
  const { esquema } = s;
  const permitidos = vaciosPermitidos().campos;
  const efectivos = new Map(s.publicados.map((d) => [d._id, d]));
  for (const v of s.loop) efectivos.set(v._id.replace(/^drafts\.|^versions\.[^.]+\./, ''), { ...v, _id: v._id.replace(/^drafts\.|^versions\.[^.]+\./, '') });
  const vacios = [], altIguales = [];

  // Dentro de una lista (secciones, tarjetas…), una lista vacia es la estructura que fija la
  // plantilla del codigo para esa seccion («la seccion no la usa»), no un hueco. Y un enlace
  // lleva destino, href O ancla: basta uno.
  const ALTERNATIVAS = ['destino', 'href', 'ancla'];
  const recorrer = (valor, def, ruta, ctx, enLista = false) => {
    for (const campo of def.fields ?? []) {
      const v = valor?.[campo.name];
      const r = `${ruta}.${campo.name}`;
      if (oculto(campo, { document: ctx.document, parent: valor, value: v })) continue;
      if (vacio(v)) {
        if (enLista && campo.type === 'array') continue;
        if (ALTERNATIVAS.includes(campo.name) && ALTERNATIVAS.some((k) => !vacio(valor?.[k]))) continue;
        vacios.push({ id: ctx.document._id, ruta: r });
        continue;
      }
      const tipo = esquema[campo.type];
      if (campo.fields) recorrer(v, campo, r, ctx, enLista);
      else if (tipo?.fields) recorrer(v, tipo, r, ctx, enLista);
      if (Array.isArray(v)) for (const item of v) {
        const t = item && typeof item === 'object' ? esquema[item._type] : null;
        if (t?.fields) recorrer(item, t, `${r}[]`, ctx, true);
      }
      if (campo.name === 'alt' && v?.en?.trim() && v.en.trim() === v.es?.trim() && !valor?.decorativa) altIguales.push(`${ctx.document._id} ${r}: «${v.en}»`);
    }
  };
  for (const d of efectivos.values()) {
    const def = esquema[d._type];
    if (!def || def.type !== 'document') continue;
    recorrer(d, def, d._type, { document: d });
  }

  const noPermitidos = vacios.filter((x) => !permitidos.some((p) => casa(p.campo, x.ruta) && (!p.ids || p.ids.includes(x.id))));
  const fallos = [];
  const agrupar = (xs) => Object.entries(xs.reduce((a, x) => ((a[x.ruta] ??= []).push(x.id), a), {})).sort((a, b) => b[1].length - a[1].length);
  for (const [ruta, ids] of agrupar(noPermitidos)) fallos.push(`vacio ${ruta} ×${ids.length} (${ids.slice(0, 3).join(', ')}${ids.length > 3 ? '…' : ''})`);
  for (const a of altIguales) fallos.push(`alt.es = alt.en: ${a}`);

  // seo.indexable frente al noindex del build de produccion.
  if (!fs.existsSync(path.join(DIST, 'sitemap.xml'))) throw new Error('el dist no es de produccion (sin sitemap.xml)');
  for (const d of efectivos.values()) {
    if (!d.seo || !d.slug && d._type !== 'page') continue;
    let ruta; try { ruta = rutaDe(d); } catch { continue; }
    for (const r of [ruta, ruta === '/' ? '/es/' : `/es${ruta}`]) {
      const html = paginas().get(r.endsWith('/') ? r : `${r}/`);
      if (!html) continue;
      const ni = datos(html).noindex;
      if ((d.seo.indexable === false) !== ni) fallos.push(`${d._id}: seo.indexable=${d.seo.indexable} y ${r} ${ni ? 'lleva' : 'no lleva'} noindex`);
    }
  }

  if (INVENTARIO) {
    console.log('INVENTARIO de vacios (todos, antes de los permitidos):');
    for (const [ruta, ids] of agrupar(vacios)) console.log(`  ${String(ids.length).padStart(4)}  ${ruta}`);
  }
  return { fallos, extra: { documentos: efectivos.size, versionesLoop: s.loop.length, vacios: vacios.length, vaciosNoPermitidos: noPermitidos.length, altIguales: altIguales.length } };
});
