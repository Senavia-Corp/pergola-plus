#!/usr/bin/env node
/**
 * J7 · check:jsonld-google (T4, T11, T12). Sobre el dist de produccion:
 *   - vocabulario, OBLIGATORIO y en TODAS las paginas: cada @type es una clase de schema.org y cada
 *     propiedad existe, no esta reemplazada (supersededBy) y vale para su tipo (domainIncludes, con
 *     herencia), contra el vocabulario fijado en datos/schemaorg-30.1-current-https.jsonld (su hash, en
 *     HASHES). Es lo que comprueba validator.schema.org; si no corre, J7 falla;
 *   - validator.schema.org (POST /validate con el HTML) con 0 errores y 0 avisos en una URL de
 *     cada plantilla (las 16 de scripts/perf/plantillas.mjs) y en la home ES, SI RESPONDE. Si Google
 *     lo corta con su CAPTCHA (redireccion a google.com/sorry) es «no disponible»: aviso con la
 *     evidencia, ni verde ni rojo, y mandan el vocabulario y las reglas locales;
 *   - en TODAS las paginas: 0 `Product` sin offers, review ni aggregateRating; dateModified >=
 *     datePublished; 0 aggregateRating o review (las reseñas son de Google: no se marcan como propias);
 *   - el NAP del nodo del negocio (/#negocio) = siteSettings de la instantanea del build
 *     (nombre, calle (+ suite solo si suiteEnTodoElSitio), ciudad, estado, CP y telefono principal).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import { puerta, paginas, datos, contenidoBuild } from './lib/comun.mjs';
import { PLANTILLAS } from '../perf/plantillas.mjs';

// Vocabulario de schema.org fijado (version 30.1, data/releases del repo schemaorg/schemaorg).
const VOCAB = JSON.parse(fs.readFileSync(new URL('./datos/schemaorg-30.1-current-https.jsonld', import.meta.url), 'utf8'))['@graph'];
const ids = (x) => [x ?? []].flat().map((y) => y['@id']);
const CLASES = new Map(VOCAB.filter((x) => [x['@type']].flat().includes('rdfs:Class')).map((x) => [x['@id'].slice(7), ids(x['rdfs:subClassOf']).map((i) => i.slice(7))]));
const PROPS = new Map(VOCAB.filter((x) => [x['@type']].flat().includes('rdf:Property')).map((x) => [x['@id'].slice(7), { dominio: ids(x['schema:domainIncludes']).map((i) => i.slice(7)), reemplazada: !!x['schema:supersededBy'] }]));
const ancestros = (t, vistos = new Set()) => { if (vistos.has(t)) return vistos; vistos.add(t); for (const p of CLASES.get(t) ?? []) ancestros(p, vistos); return vistos; };
/** Errores de vocabulario de un nodo y de los nodos anidados (los que llevan @type). */
function vocabulario(n, donde, out) {
  if (Array.isArray(n)) return n.forEach((x) => vocabulario(x, donde, out));
  if (!n || typeof n !== 'object') return;
  const t = n['@type'] ? tipos(n) : [];
  for (const x of t) if (!CLASES.has(x)) out.push(`${donde}: @type «${x}» no es una clase de schema.org`);
  const linaje = new Set(t.flatMap((x) => [...ancestros(x)]));
  for (const [k, v] of Object.entries(n)) {
    if (k.startsWith('@')) continue;
    const p = PROPS.get(k);
    if (!p) out.push(`${donde}: propiedad «${k}» no existe en schema.org`);
    else if (p.reemplazada) out.push(`${donde}: propiedad «${k}» reemplazada (supersededBy)`);
    else if (t.length && !p.dominio.some((d) => linaje.has(d))) out.push(`${donde}: «${k}» no vale para ${t.join('/')}`);
    vocabulario(v, `${donde} › ${k}`, out);
  }
}

const tipos = (n) => [n['@type']].flat();
const digitos = (t) => String(t ?? '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');

// validator.schema.org limita la frecuencia (429, y 405 mientras dura). Una URL por plantilla, una
// llamada cada 25 s y, si limita, reintentos a los 60, 120 y 240 s. Cada HTML ya validado queda en
// una cache por su sha256 (fuera del repo): el mismo HTML no se vuelve a mandar. «No pudo validar»
// es un FALLO, nunca un verde.
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
      const r = await fetch('https://validator.schema.org/validate', { method: 'POST', body: new URLSearchParams({ html }), redirect: 'manual' });
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
  let negocios = 0, nodos = 0;
  const vocab = [];
  for (const [r, html] of paginas()) {
    for (const n of datos(html).jsonld) {
      nodos++;
      vocabulario(n, r, vocab);
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
  if (!nodos) fallos.push('NO CORRIO: ningun nodo JSON-LD que validar');
  fallos.push(...new Set(vocab));
  const avisos = [];
  // El validador, al final: si no responde, las comprobaciones locales ya estan anotadas.
  try {
    // Sonda con un cuerpo minimo: con el HTML de una pagina, Google contesta 405 cuando bloquea; con
    // uno minimo, redirige a google.com/sorry (su CAPTCHA). Eso es «no disponible», no un rojo.
    const sonda = await fetch('https://validator.schema.org/validate', { method: 'POST', body: new URLSearchParams({ html: '<p></p>' }), redirect: 'manual' });
    const destino = sonda.headers.get('location') ?? '';
    if (/google\.com\/sorry/.test(destino)) throw Object.assign(new Error(`HTTP ${sonda.status} → ${destino.split('?')[0]} (CAPTCHA de Google)`), { noDisponible: true });
    const muestra = [...PLANTILLAS.map(([, r]) => r), '/es/'];
    for (const r of muestra) {
      const html = paginas().get(r);
      if (!html) { fallos.push(`${r}: no esta en el dist`); continue; }
      const v = await validar(html);
      if (v.totalNumErrors || v.totalNumWarnings) fallos.push(`${r}: validator.schema.org ${v.totalNumErrors} errores y ${v.totalNumWarnings} avisos`);
    }
  } catch (e) { if (e.noDisponible) avisos.push(`validator.schema.org no disponible: ${e.message}`); else fallos.push(`NO CORRIO: ${e.message}`); }
  return { fallos, extra: { nodosNegocio: negocios, nodos, vocabulario: 'schema.org 30.1', avisos } };
});
