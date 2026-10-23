#!/usr/bin/env node
/**
 * J14 · check:canibalizacion (C4). Ninguna keyword principal de 04-MAPA-KEYWORDS.json es la de
 * dos URL indexables del MISMO idioma (una pagina y su gemela de hreflang no compiten entre si). Dos keywords son la misma si tienen las mismas palabras con significado
 * (sin orden, sin tildes, singular = plural): «pergola contractor boca raton» = «boca raton pergola contractors».
 */
import { puerta, indexables, mapaKeywords, tokens, esEs } from './lib/comun.mjs';

await puerta('J14', 'check:canibalizacion', () => {
  const mapa = mapaKeywords().urls;
  const porKw = new Map();
  for (const r of indexables()) {
    const e = mapa[r];
    if (!e || e.fueraDelLoop || !e.principal) continue; // J5 ya falla si falta
    const clave = (esEs(r) ? 'es: ' : 'en: ') + tokens(e.principal).map((t) => t.replace(/(es|s)$/, '')).sort().join(' ');
    (porKw.get(clave) ?? porKw.set(clave, []).get(clave)).push(`${r} («${e.principal}»)`);
  }
  const fallos = [...porKw].filter(([, rs]) => rs.length > 1).map(([k, rs]) => `«${k}» es la principal de ${rs.length} URL: ${rs.join(', ')}`);
  return { fallos, extra: { keywords: porKw.size } };
});
