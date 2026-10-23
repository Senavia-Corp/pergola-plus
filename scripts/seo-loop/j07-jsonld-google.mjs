#!/usr/bin/env node
/**
 * J7 · check:jsonld-google (T4, T11, T12). Sobre el dist de produccion:
 *   - validator.schema.org (POST /validate con el HTML) con 0 errores y 0 avisos en una URL de
 *     cada plantilla (las 16 de scripts/perf/plantillas.mjs) y en la home ES;
 *   - en TODAS las paginas: 0 `Product` sin offers, review ni aggregateRating; dateModified >=
 *     datePublished; 0 aggregateRating o review (las reseñas son de Google: no se marcan como propias);
 *   - el NAP del nodo del negocio (/#negocio) = siteSettings de la instantanea del build
 *     (nombre, calle (+ suite solo si suiteEnTodoElSitio), ciudad, estado, CP y telefono principal).
 */
import { puerta, paginas, datos, contenidoBuild } from './lib/comun.mjs';
import { PLANTILLAS } from '../perf/plantillas.mjs';

const tipos = (n) => [n['@type']].flat();
const digitos = (t) => String(t ?? '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');

// validator.schema.org limita la frecuencia (429, y 405 mientras dura). Una URL por plantilla, una
// llamada cada 25 s y, si limita, reintentos a los 60, 120 y 240 s. Cada HTML ya validado queda en
// una cache por su sha256 (fuera del repo): el mismo HTML no se vuelve a mandar. «No pudo validar»
// es un FALLO, nunca un verde.
import crypto from 'node:crypto';
import fs from 'node:fs';
const CACHE = '/Users/senavia/Sites/pp-exports/loop-juez/validator-cache';
const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
let ultima = 0;
async function validar(html) {
  const clave = crypto.createHash('sha256').update(html).digest('hex');
  const f = `${CACHE}/${clave}.json`;
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  for (let i = 0; ; i++) {
    await espera(Math.max(0, ultima + 25000 - Date.now()));
    ultima = Date.now();
    try {
      const r = await fetch('https://validator.schema.org/validate', { method: 'POST', body: new URLSearchParams({ html }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const v = JSON.parse((await r.text()).replace(/^\)\]\}'\n?/, ''));
      fs.mkdirSync(CACHE, { recursive: true });
      fs.writeFileSync(f, JSON.stringify({ totalNumErrors: v.totalNumErrors, totalNumWarnings: v.totalNumWarnings, numObjects: v.numObjects }));
      return v;
    } catch (e) { if (i >= 3) throw new Error(`validator.schema.org no responde: ${e.message}`); await espera(60000 * 2 ** i); }
  }
}

await puerta('J7', 'check:jsonld-google', async () => {
  const fallos = [];
  const ss = contenidoBuild().docs.find((d) => d._id === 'siteSettings');
  const calle = ss.direccion.suiteEnTodoElSitio && ss.direccion.suite ? `${ss.direccion.calle}, ${ss.direccion.suite}` : ss.direccion.calle;
  let negocios = 0;
  for (const [r, html] of paginas()) {
    for (const n of datos(html).jsonld) {
      const t = tipos(n);
      if (t.includes('__ROTO__')) fallos.push(`${r}: JSON-LD que no parsea`);
      if (t.includes('Product') && !n.offers && !n.review && !n.aggregateRating) fallos.push(`${r}: Product sin offers, review ni aggregateRating`);
      if (n.datePublished && n.dateModified && new Date(n.dateModified) < new Date(n.datePublished)) fallos.push(`${r}: dateModified ${n.dateModified} < datePublished ${n.datePublished}`);
      if (JSON.stringify(n).match(/"(aggregateRating|review)"/)) fallos.push(`${r}: ${t.join('/')} con aggregateRating o review`);
      if (String(n['@id'] ?? '').endsWith('/#negocio') && n.address) {
        negocios++;
        const a = n.address;
        const mal = [[n.name, ss.nombreComercial], [a.streetAddress, calle], [a.addressLocality, ss.direccion.ciudad], [a.addressRegion, ss.direccion.estado], [a.postalCode, ss.direccion.cp]]
          .filter(([x, y]) => x !== y).map(([x, y]) => `«${x}» ≠ «${y}»`);
        if (digitos(n.telephone) !== digitos(ss.telefonoPrincipal)) mal.push(`tel ${n.telephone} ≠ ${ss.telefonoPrincipal}`);
        if (mal.length) fallos.push(`${r}: NAP del JSON-LD distinto de siteSettings: ${mal.join('; ')}`);
      }
    }
  }
  if (!negocios) fallos.push('ninguna pagina declara el nodo /#negocio con direccion');
  // El validador, al final: si no responde, las comprobaciones locales ya estan anotadas.
  try {
    const muestra = [...PLANTILLAS.map(([, r]) => r), '/es/'];
    for (const r of muestra) {
      const html = paginas().get(r);
      if (!html) { fallos.push(`${r}: no esta en el dist`); continue; }
      const v = await validar(html);
      if (v.totalNumErrors || v.totalNumWarnings) fallos.push(`${r}: validator.schema.org ${v.totalNumErrors} errores y ${v.totalNumWarnings} avisos`);
    }
  } catch (e) { fallos.push(`NO CORRIO: ${e.message}`); }
  return { fallos, extra: { nodosNegocio: negocios } };
});
