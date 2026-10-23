#!/usr/bin/env node
/**
 * J9 · check:lastmod (T5). Sitemap de produccion frente a la instantanea del build:
 *   - todo <lastmod> <= el _updatedAt del documento de esa URL (no se inventan fechas);
 *   - el de cada post (EN y ES) = el dateModified de su BlogPosting;
 *   - ninguno en el futuro respecto al build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { puerta, DIST, paginas, datos, contenidoBuild, leerJson } from './lib/comun.mjs';
import { rutaDe } from '../../src/lib/rutas-sanity.mjs';

await puerta('J9', 'check:lastmod', () => {
  const xml = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  const docs = contenidoBuild().docs;
  const porRuta = new Map();
  for (const d of docs) { try { const r = rutaDe(d); porRuta.set(r.endsWith('/') ? r : `${r}/`, d); } catch { /* sin pagina */ } }
  const build = new Date(leerJson('.cache/ultimo-build.json').fecha ?? Date.now());
  const fallos = [];
  let conFecha = 0;
  for (const u of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = u[1].match(/<loc>([^<]+)<\/loc>/)[1];
    const lastmod = u[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (!lastmod) continue;
    conFecha++;
    const ruta = new URL(loc).pathname;
    const sinEs = ruta === '/es/' ? '/' : ruta.replace(/^\/es\//, '/');
    const d = porRuta.get(sinEs);
    if (!d) { fallos.push(`${ruta}: lastmod ${lastmod} sin documento de Sanity detras`); continue; }
    if (new Date(lastmod) > new Date(d._updatedAt)) fallos.push(`${ruta}: lastmod ${lastmod} posterior al _updatedAt ${d._updatedAt}`);
    if (new Date(lastmod) > build) fallos.push(`${ruta}: lastmod ${lastmod} en el futuro`);
    if (d._type === 'post') {
      const bp = datos(paginas().get(ruta) ?? '').jsonld.find((n) => [n['@type']].flat().includes('BlogPosting'));
      if (!bp) fallos.push(`${ruta}: post sin BlogPosting`);
      else if (new Date(bp.dateModified).getTime() !== new Date(lastmod).getTime()) fallos.push(`${ruta}: lastmod ${lastmod} ≠ dateModified ${bp.dateModified}`);
    }
  }
  return { fallos, extra: { conLastmod: conFecha } };
});
