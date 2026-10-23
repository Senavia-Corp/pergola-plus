#!/usr/bin/env node
/**
 * J5 · check:seo-estricto (C1, C2, C8, T10, R6). Sobre el dist de PRODUCCION, cada URL indexable:
 *   - tiene entrada en 04-MAPA-KEYWORDS.json (o `fueraDelLoop`, p. ej. los legales de §1);
 *   - <title> de 30–60 caracteres y description de 110–160; un solo H1;
 *   - la keyword principal en el title y en la description, y en el H1 salvo `excepcionH1`
 *     R1 (hero de la home) o R8 (titulos de proyecto de Adrian), del registro del cliente;
 *   - «South Florida» / «sur de Florida», «FL», una ciudad o un condado del sur de Florida en el
 *     title o en la description (R6);
 *   - og:image:alt presente y, en /es/, distinto del de su gemela inglesa (alt en su idioma);
 * y 0 titulos duplicados entre las indexables.
 */
import { puerta, paginas, datos, indexables, mapaKeywords, contieneKw, contenidoBuild, esEs, gemeloEn, norm } from './lib/comun.mjs';

// Lugares del sur de Florida que no tienen pagina pero salen en proyectos (R6).
const OTROS_LUGARES = ['Greenacres', 'Pompano Beach', 'Riviera Beach', 'Hillsboro Beach', 'Boca Beach', 'Lake Worth', 'Lantana', 'Highland Beach', 'Lighthouse Point', 'Deerfield Beach', 'Tamarac', 'Plantation', 'Sunrise', 'Margate', 'Lauderhill', 'Hialeah', 'Palmetto Bay', 'Coconut Creek', 'Elan Polo Club', 'Jupiter Ocean Club'];
const EXCEPCIONES_H1 = new Set(['R1', 'R8']);

await puerta('J5', 'check:seo-estricto', () => {
  const mapa = mapaKeywords().urls;
  const docs = contenidoBuild().docs;
  const lugares = [...docs.filter((d) => ['city', 'county'].includes(d._type)).map((d) => d.nombre?.en), ...OTROS_LUGARES]
    .filter(Boolean).map((l) => norm(l.replace(/\s*County$/i, '')));
  const local = (t) => /\bFL\b/.test(t) || /south florida|sur de florida/.test(norm(t)) || lugares.some((l) => ` ${norm(t)} `.includes(` ${l} `));
  const fallos = [], titulos = new Map();
  const rutas = indexables();
  for (const r of rutas) {
    const d = datos(paginas().get(r));
    const e = mapa[r];
    if (!e) { fallos.push(`${r}: sin entrada en 04-MAPA-KEYWORDS.json`); continue; }
    if (e.fueraDelLoop) continue;
    (titulos.get(d.title) ?? titulos.set(d.title, []).get(d.title)).push(r);
    if (d.title.length < 30 || d.title.length > 60) fallos.push(`${r}: title de ${d.title.length} (30–60) «${d.title}»`);
    if (d.description.length < 110 || d.description.length > 160) fallos.push(`${r}: description de ${d.description.length} (110–160)`);
    if (d.h1.length !== 1) fallos.push(`${r}: ${d.h1.length} H1`);
    const kw = e.principal;
    if (!kw) { fallos.push(`${r}: la entrada del mapa no tiene keyword principal`); continue; }
    if (!contieneKw(d.title, kw)) fallos.push(`${r}: el title no lleva «${kw}» («${d.title}»)`);
    if (!contieneKw(d.description, kw)) fallos.push(`${r}: la description no lleva «${kw}»`);
    if (e.excepcionH1 && !EXCEPCIONES_H1.has(e.excepcionH1)) fallos.push(`${r}: excepcionH1 «${e.excepcionH1}» no es R1 ni R8`);
    if (!e.excepcionH1 && d.h1.length === 1 && !contieneKw(d.h1[0], kw)) fallos.push(`${r}: el H1 no lleva «${kw}» («${d.h1[0]}»)`);
    if (!local(d.title) && !local(d.description)) fallos.push(`${r}: ni el title ni la description nombran South Florida, FL, una ciudad o un condado (R6)`);
    if (!d.ogImageAlt) fallos.push(`${r}: sin og:image:alt`);
    else if (esEs(r)) {
      const en = paginas().get(gemeloEn(r));
      if (en && datos(en).ogImageAlt === d.ogImageAlt) fallos.push(`${r}: og:image:alt en inglés (igual que ${gemeloEn(r)})`);
    }
  }
  for (const [t, rs] of titulos) if (rs.length > 1) fallos.push(`title duplicado «${t}»: ${rs.join(', ')}`);
  return { fallos, extra: { indexables: rutas.length } };
});
