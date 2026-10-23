#!/usr/bin/env node
/**
 * J11 · check:geo (GEO, C7). Sobre el dist de produccion:
 *   - llms.txt existe, lista TODAS las URL indexables (EN y ES, URL absoluta) y lleva el NAP de
 *     siteSettings (nombre, calle, ciudad y telefono principal);
 *   - robots.txt segun §0: los rastreadores de entrenamiento (GPTBot, ClaudeBot, Google-Extended,
 *     Applebot-Extended, CCBot, meta-externalagent) PERMITIDOS; /api/ bloqueado en todos los grupos
 *     que permiten; Bytespider bloqueado; linea Sitemap;
 *   - el nodo del negocio (/#negocio) con sameAs >= 4 e IGUAL en / y en /es/;
 *   - cada BlogPosting con author y datePublished, y los posts de normativa con al menos un enlace a
 *     una fuente oficial (.gov, .fl.us, condado, Florida Building Code…) dentro de <main>.
 */
import fs from 'node:fs';
import path from 'node:path';
import { puerta, DIST, paginas, datos, indexables, enlaces, contenidoBuild, FUENTE_OFICIAL } from './lib/comun.mjs';

const ENTRENAMIENTO = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'meta-externalagent'];
const BLOQUEADOS = ['Bytespider'];
const NORMATIVA = ['pergola-permit-south-florida', 'pergola-building-codes-broward-palm-beach', 'hoa-rules-pergolas-south-florida', 'hurricane-resistant-pergolas-south-florida'];

/** robots.txt en grupos { agentes: [...], reglas: [['allow','/'], ...] } (RFC 9309). */
function grupos(txt) {
  const gs = []; let g = null, enAgentes = false;
  for (const l of txt.split('\n').map((x) => x.replace(/#.*/, '').trim()).filter(Boolean)) {
    const [k, ...v] = l.split(':'); const clave = k.trim().toLowerCase(); const valor = v.join(':').trim();
    if (clave === 'user-agent') { if (!enAgentes) { g = { agentes: [], reglas: [] }; gs.push(g); } g.agentes.push(valor.toLowerCase()); enAgentes = true; }
    else if (clave === 'allow' || clave === 'disallow') { g?.reglas.push([clave, valor]); enAgentes = false; }
    else enAgentes = false;
  }
  return gs;
}

await puerta('J11', 'check:geo', () => {
  const fallos = [];
  const ss = contenidoBuild().docs.find((d) => d._id === 'siteSettings');
  const llms = fs.existsSync(path.join(DIST, 'llms.txt')) ? fs.readFileSync(path.join(DIST, 'llms.txt'), 'utf8') : '';
  if (!llms) fallos.push('no hay llms.txt');
  else {
    const sitio = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8').match(/<loc>(https?:\/\/[^/]+)/)[1];
    const faltan = indexables().filter((r) => !llms.includes(`${sitio}${r})`) && !llms.includes(`${sitio}${r} `) && !llms.includes(`${sitio}${r}\n`));
    if (faltan.length) fallos.push(`llms.txt no lista ${faltan.length} URL indexables (p. ej. ${faltan.slice(0, 4).join(', ')})`);
    for (const [k, v] of [['nombre', ss.nombreComercial], ['calle', ss.direccion.calle], ['ciudad', ss.direccion.ciudad], ['telefono', ss.telefonoPrincipal]]) if (!llms.includes(v)) fallos.push(`llms.txt sin el ${k} de siteSettings («${v}»)`);
  }

  const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
  const gs = grupos(robots);
  const grupoDe = (ua) => gs.find((g) => g.agentes.includes(ua.toLowerCase())) ?? gs.find((g) => g.agentes.includes('*'));
  const bloqueaTodo = (g) => g?.reglas.some(([k, v]) => k === 'disallow' && v === '/');
  const bloqueaApi = (g) => g?.reglas.some(([k, v]) => k === 'disallow' && v.startsWith('/api'));
  for (const ua of ENTRENAMIENTO) { const g = grupoDe(ua); if (bloqueaTodo(g)) fallos.push(`robots.txt bloquea ${ua} (§0: se permiten los de entrenamiento)`); else if (!bloqueaApi(g)) fallos.push(`robots.txt no bloquea /api/ para ${ua}`); }
  for (const ua of BLOQUEADOS) if (!bloqueaTodo(grupoDe(ua))) fallos.push(`robots.txt no bloquea ${ua}`);
  for (const g of gs) if (!bloqueaTodo(g) && !bloqueaApi(g)) fallos.push(`robots.txt: el grupo ${g.agentes.join(', ')} no bloquea /api/`);
  if (!/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m.test(robots)) fallos.push('robots.txt sin linea Sitemap absoluta');

  const negocio = (r) => datos(paginas().get(r) ?? '').jsonld.find((n) => String(n['@id'] ?? '').endsWith('/#negocio') && n.address);
  const en = negocio('/'), es = negocio('/es/');
  if (!en || !es) fallos.push('falta el nodo /#negocio en / o en /es/');
  else {
    if ((en.sameAs ?? []).length < 4) fallos.push(`sameAs con ${(en.sameAs ?? []).length} perfiles (minimo 4)`);
    const distintas = [...new Set([...Object.keys(en), ...Object.keys(es)])].filter((k) => JSON.stringify(en[k]) !== JSON.stringify(es[k]));
    if (distintas.length) fallos.push(`la entidad cambia entre / y /es/ en: ${distintas.join(', ')}`);
  }

  for (const [r, html] of paginas()) {
    const bp = datos(html).jsonld.find((n) => [n['@type']].flat().includes('BlogPosting'));
    if (!bp) continue;
    if (!bp.author || (Array.isArray(bp.author) && !bp.author.length)) fallos.push(`${r}: BlogPosting sin author`);
    if (!bp.datePublished) fallos.push(`${r}: BlogPosting sin datePublished`);
    const slug = r.match(/\/post\/([^/]+)\//)?.[1];
    if (NORMATIVA.includes(slug) && !enlaces(html, { soloMain: true }).some((h) => FUENTE_OFICIAL.test(h))) fallos.push(`${r}: post de normativa sin enlace a una fuente oficial`);
  }
  return { fallos, extra: {} };
});
