#!/usr/bin/env node
/**
 * J10 · check:es-florida (C3). 0 apariciones de los `prohibidos` de glosario-es-florida.json en
 * las paginas /es/ del dist: texto visible del body, <title>, meta description y alt de las
 * imagenes. Sin /es/articles/ (textos legales, fuera del loop: §1.4 y §1.5).
 * «Boca Ratón» esta en el glosario: el nombre oficial va sin tilde.
 */
import { puerta, paginas, datos, textoVisible, decodificar } from './lib/comun.mjs';
import { glosario } from './lib/comun.mjs';

await puerta('J10', 'check:es-florida', () => {
  const reglas = glosario().prohibidos.map((p) => ({ ...p, re: new RegExp(`(?<![\\p{L}])(${p.patron})(?![\\p{L}])`, 'giu') }));
  const cuenta = Object.fromEntries(reglas.map((r) => [r.patron, { n: 0, rutas: new Set() }]));
  let revisadas = 0;
  for (const [ruta, html] of paginas()) {
    if (!(ruta === '/es/' || ruta.startsWith('/es/')) || ruta.startsWith('/es/articles/')) continue;
    revisadas++;
    const d = datos(html);
    const alts = [...html.matchAll(/<img\s[^>]*\salt="([^"]*)"/g)].map((m) => decodificar(m[1]));
    const texto = [d.title, d.description, ...textoVisible(html), ...alts].join('\n');
    for (const r of reglas) {
      const n = texto.match(r.re)?.length ?? 0;
      if (n) { cuenta[r.patron].n += n; cuenta[r.patron].rutas.add(ruta); }
    }
  }
  if (!revisadas) throw new Error('no hay paginas /es/ en el dist');
  const fallos = reglas.filter((r) => cuenta[r.patron].n)
    .map((r) => `«${r.patron}» ×${cuenta[r.patron].n} en ${cuenta[r.patron].rutas.size} paginas (usar: ${r.usar}), p. ej. ${[...cuenta[r.patron].rutas].slice(0, 3).join(', ')}`);
  return { fallos, extra: { paginasEs: revisadas, apariciones: Object.fromEntries(Object.entries(cuenta).map(([k, v]) => [k, v.n])) } };
});
