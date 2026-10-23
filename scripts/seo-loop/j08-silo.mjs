#!/usr/bin/env node
/**
 * J8 · check:silo (T3), en EN y en ES:
 *   - cada condado enlaza a todas sus ciudades (city.condado en la instantanea del build);
 *   - cada ciudad enlaza a su condado;
 *   - las migas de la ciudad (BreadcrumbList) son Home › Where We Work › Condado › Ciudad;
 *   - ninguna pagina indexable tiene menos de 3 enlaces entrantes (de otras paginas);
 *   - profundidad desde la home <= 3 clics para toda indexable.
 */
import { puerta, paginas, datos, indexables, enlaces, contenidoBuild } from './lib/comun.mjs';
import { rutaDe } from '../../src/lib/rutas-sanity.mjs';

const conBarra = (r) => (r.endsWith('/') ? r : `${r}/`);
const internos = (html) => [...new Set(enlaces(html).filter((h) => h.startsWith('/')).map((h) => conBarra(h.split(/[?#]/)[0])))];

await puerta('J8', 'check:silo', () => {
  const fallos = [];
  const docs = contenidoBuild().docs;
  const condados = new Map(docs.filter((d) => d._type === 'county').map((d) => [d._id, d]));
  const ciudades = docs.filter((d) => d._type === 'city');
  for (const pre of ['', '/es']) {
    for (const c of condados.values()) {
      const rc = conBarra(pre + rutaDe(c));
      const html = paginas().get(rc);
      if (!html) { fallos.push(`${rc}: el condado no esta en el dist`); continue; }
      const sale = new Set(internos(html));
      for (const ci of ciudades.filter((x) => x.condado?._ref === c._id)) {
        const r = conBarra(pre + rutaDe(ci));
        if (paginas().has(r) && !sale.has(r)) fallos.push(`${rc} no enlaza a su ciudad ${r}`);
      }
    }
    for (const ci of ciudades) {
      const r = conBarra(pre + rutaDe(ci));
      const html = paginas().get(r);
      if (!html) continue;
      const c = condados.get(ci.condado?._ref);
      if (!c) { fallos.push(`${r}: la ciudad no tiene condado en Sanity`); continue; }
      const rc = conBarra(pre + rutaDe(c));
      if (!internos(html).includes(rc)) fallos.push(`${r} no enlaza a su condado ${rc}`);
      const migas = datos(html).jsonld.find((n) => [n['@type']].flat().includes('BreadcrumbList'));
      const camino = (migas?.itemListElement ?? []).map((i) => conBarra(new URL(i.item?.['@id'] ?? i.item).pathname));
      const esperado = [conBarra(pre || '/'), conBarra(`${pre}/about-us/where-we-work`), rc, r];
      if (camino.join(' ') !== esperado.join(' ')) fallos.push(`${r}: migas ${camino.join(' › ') || '(ninguna)'}; se esperan ${esperado.join(' › ')}`);
    }
  }
  // Entrantes y profundidad sobre el grafo de enlaces del dist.
  const grafo = new Map([...paginas()].map(([r, h]) => [r, internos(h)]));
  const entrantes = new Map();
  for (const [r, sale] of grafo) for (const e of sale) if (e !== r) entrantes.set(e, (entrantes.get(e) ?? 0) + 1);
  const prof = new Map([['/', 0], ['/es/', 1]]);
  const cola = ['/', '/es/'];
  while (cola.length) { const r = cola.shift(); for (const e of grafo.get(r) ?? []) if (grafo.has(e) && !prof.has(e)) { prof.set(e, prof.get(r) + 1); cola.push(e); } }
  for (const r of indexables()) {
    if ((entrantes.get(r) ?? 0) < 3) fallos.push(`${r}: ${entrantes.get(r) ?? 0} enlaces entrantes (minimo 3)`);
    if (!prof.has(r) || prof.get(r) > 3) fallos.push(`${r}: profundidad ${prof.get(r) ?? 'inalcanzable'} (maximo 3)`);
  }
  return { fallos, extra: { condados: condados.size, ciudades: ciudades.length } };
});
