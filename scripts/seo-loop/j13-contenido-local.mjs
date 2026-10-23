#!/usr/bin/env node
/**
 * J13 · check:contenido-local (C5, C6). Ciudades indexables, EN y ES por separado, sobre el texto
 * visible de <main> en shingles de 5 palabras:
 *   - >= 150 palabras propias: palabras cubiertas por algun shingle que no sale en ninguna otra ciudad;
 *   - al menos una cita: un enlace a fuente oficial (FUENTE_OFICIAL) o a un proyecto propio de esa
 *     ciudad (/project/... cuyo nombre la nombra, o PROYECTO_CIUDAD);
 *   - Jaccard medio entre ciudades < 0,70;
 * y 0 paginas indexables con un hero `wf-placeholder`.
 */
import { puerta, paginas, indexables, textoVisible, enlaces, norm, contenidoBuild, FUENTE_OFICIAL } from './lib/comun.mjs';
import { rutaDe } from '../../src/lib/rutas-sanity.mjs';

const N = 5, MIN_PROPIAS = 150, JACCARD_MAX = 0.7;
// Proyectos cuyo nombre no dice la ciudad (informe 08 §3.3: Elan Polo Club esta en Wellington; Boca Beach, en Boca Raton).
const PROYECTO_CIUDAD = { 'forte-pergola-with-outdoor-kitchen-at-elan-polo-club': 'Wellington', 'custom-sukkah-pergola-at-boca-beach': 'Boca Raton' };

await puerta('J13', 'check:contenido-local', () => {
  const fallos = [];
  const docs = contenidoBuild().docs;
  const idx = new Set(indexables());
  const proyectos = docs.filter((d) => d._type === 'project').map((d) => ({ slug: d.slug.current, nombre: d.nombre?.en ?? '' }));
  let jaccardMedio = {};
  for (const pre of ['', '/es']) {
    const ciudades = docs.filter((d) => d._type === 'city').map((d) => ({ d, r: `${pre}${rutaDe(d)}`.replace(/\/?$/, '/') })).filter((c) => idx.has(c.r));
    for (const c of ciudades) {
      c.palabras = norm(textoVisible(paginas().get(c.r), { soloMain: true }).join(' ')).split(' ');
      c.sh = new Set(c.palabras.slice(0, -N + 1).map((_, i) => c.palabras.slice(i, i + N).join(' ')));
    }
    const cuenta = new Map();
    for (const c of ciudades) for (const s of c.sh) cuenta.set(s, (cuenta.get(s) ?? 0) + 1);
    for (const c of ciudades) {
      const cubiertas = new Set();
      c.palabras.slice(0, -N + 1).forEach((_, i) => { if (cuenta.get(c.palabras.slice(i, i + N).join(' ')) === 1) for (let k = 0; k < N; k++) cubiertas.add(i + k); });
      if (cubiertas.size < MIN_PROPIAS) fallos.push(`${c.r}: ${cubiertas.size} palabras propias (minimo ${MIN_PROPIAS})`);
      const nombre = c.d.nombre?.en ?? '';
      const suyos = proyectos.filter((p) => norm(p.nombre).includes(norm(nombre)) || PROYECTO_CIUDAD[p.slug] === nombre).map((p) => p.slug);
      const hrefs = enlaces(paginas().get(c.r), { soloMain: true });
      const cita = hrefs.some((h) => FUENTE_OFICIAL.test(h)) || hrefs.some((h) => suyos.some((s) => h.includes(`/project/${s}`)));
      if (!cita) fallos.push(`${c.r}: sin cita a fuente oficial ni proyecto propio de ${nombre} enlazado`);
    }
    let suma = 0, pares = 0;
    for (let i = 0; i < ciudades.length; i++) for (let j = i + 1; j < ciudades.length; j++) {
      const a = ciudades[i].sh, b = ciudades[j].sh;
      let inter = 0; for (const s of a) if (b.has(s)) inter++;
      suma += inter / (a.size + b.size - inter); pares++;
    }
    const media = pares ? suma / pares : 0;
    jaccardMedio[pre || 'en'] = Number(media.toFixed(3));
    if (media >= JACCARD_MAX) fallos.push(`Jaccard medio entre ciudades ${pre || '(en)'} = ${media.toFixed(3)} (debe ser < ${JACCARD_MAX})`);
  }
  for (const r of idx) if (paginas().get(r).includes('wf-placeholder')) fallos.push(`${r}: lleva wf-placeholder`);
  return { fallos, extra: { jaccardMedio } };
});
