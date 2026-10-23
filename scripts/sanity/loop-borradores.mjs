/**
 * Escribe en BORRADORES (`drafts.<id>`) los textos del loop SEO (docs/seo-loop/propuestas/F*.json).
 * Nunca publica ni toca un documento publicado (docs/seo-loop/00-ESPECIFICACION-LOOP.md §6).
 *
 *     (cd studio && npx sanity exec ../scripts/sanity/loop-borradores.mjs --with-user-token -- <propuestas...> [--aplicar])
 *
 * Propuestas: ficheros {ruta: {t, d, h1}} (t = seo.titulo, d = seo.descripcion, h1 = el H1) y uno de
 * alt {«alt en inglés»: «alt en español»} (nombre con «alt»), que rellena alt.es donde alt.es === alt.en.
 * El idioma sale de la ruta (/es/ → es).
 *
 * El H1 se busca por su texto actual en el documento: primero en un texto de sección cuya clave o _key
 * dice h1 o titulo, y si no hay, en el `titulo` o el `nombre` del documento (o en `h1Doc`, si el H1
 * vive en otro documento). Si no lo encuentra, para.
 *
 * Seguridad: si ya hay un borrador que no es del loop (no esta en el registro), no lo toca y lo anota.
 * El registro de lo escrito queda en docs/seo-loop/iteraciones/borradores-loop.json.
 * Sin --aplicar solo enseña lo que haria.
 *
 * --glosario: aplica scripts/sanity/es-florida.mjs (glosario del español de Florida) a todo el español de
 * todos los documentos (campos `.es` y el cuerpo de los posts), salvo los textos legales (§1), las
 * reseñas (texto literal de Google) y los sinónimos del buscador (no se ven y ayudan a buscar).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const { rutaDe } = await import(path.join(RAIZ, 'src/lib/rutas-sanity.mjs'));
const c = getCliClient({ apiVersion: '2025-02-19' });
const args = process.argv.slice(2).filter((a) => a !== '--');
const APLICAR = args.includes('--aplicar');
const GLOSARIO = args.includes('--glosario');
const ficheros = args.filter((a) => a.endsWith('.json')).map((f) => path.resolve(RAIZ, f));
const REGISTRO = path.join(RAIZ, 'docs/seo-loop/iteraciones/borradores-loop.json');
const registro = fs.existsSync(REGISTRO) ? JSON.parse(fs.readFileSync(REGISTRO, 'utf8')) : { documentos: {} };

// perspective raw: con la de por defecto (publicada) los borradores no se ven.
const publicados = await c.fetch('*[!(_id in path("drafts.**")) && !(_id in path("versions.**")) && !(_type match "sanity.*") && !(_type match "system.*")]', {}, { perspective: 'raw' });
const borradores = new Map((await c.fetch('*[_id in path("drafts.**")]', {}, { perspective: 'raw' })).map((d) => [d._id.slice(7), d]));
const porRuta = new Map();
for (const d of publicados) { try { porRuta.set(rutaDe(d).replace(/\/?$/, '/'), d); } catch { /* sin pagina */ } }

const trabajo = new Map(); // id -> documento (borrador) que se va a escribir
const cambios = [];
const avisos = [];
const base = (id) => {
  if (trabajo.has(id)) return trabajo.get(id);
  const b = borradores.get(id);
  if (b && !registro.documentos[id]) { avisos.push(`${id}: tiene un borrador que no es del loop; no se toca`); return null; }
  const pub = publicados.find((d) => d._id === id);
  const { _rev, _updatedAt, _createdAt, ...resto } = structuredClone(b ?? pub);
  const doc = { ...resto, _id: `drafts.${id}` };
  trabajo.set(id, doc);
  return doc;
};
const fijar = (doc, ruta, valor, nota) => {
  const partes = ruta.split('.');
  let x = doc;
  for (const p of partes.slice(0, -1)) x = x[p] ??= {};
  const antes = x[partes.at(-1)];
  if (antes === valor) return;
  x[partes.at(-1)] = valor;
  cambios.push({ id: doc._id.slice(7), campo: nota ?? ruta, antes: antes ?? null, despues: valor });
};
/** Objetos i18n del documento con su ruta legible, para buscar el H1 por su texto. */
const textos = (doc) => {
  const out = [];
  const v = (x, p) => {
    if (Array.isArray(x)) return x.forEach((y, i) => v(y, `${p}[${y?._key ?? i}]`));
    if (!x || typeof x !== 'object') return;
    if ('en' in x || 'es' in x) out.push({ obj: x, ruta: p });
    for (const [k, w] of Object.entries(x)) if (!k.startsWith('_')) v(w, `${p}.${k}`);
  };
  v(doc, '');
  return out;
};

/**
 * Markdown mínimo → Portable Text: «## » h2, «### » h3, «- » viñeta, el resto párrafos (separados por una
 * línea en blanco) y [texto](url) enlaces; «ref:<id>» enlaza a un documento del sitio (sale en su idioma).
 */
function bloques(md, prefijo) {
  let n = 0;
  return md.trim().split(/\n\s*\n|\n(?=- |#)/).map((trozo) => {
    const k = `${prefijo}${n++}`;
    const [, marca, resto] = trozo.trim().match(/^(### |## |- )?([\s\S]*)$/);
    const markDefs = [], children = [];
    let i = 0;
    for (const m of resto.replace(/\s*\n\s*/g, ' ').matchAll(/\[([^\]]+)\]\(([^)]+)\)|[^[]+|\[/g)) {
      if (!m[1]) { children.push({ _key: `${k}s${i++}`, _type: 'span', marks: [], text: m[0] }); continue; }
      const mk = `${k}m${markDefs.length}`;
      markDefs.push({ _key: mk, _type: 'enlace', ...(m[2].startsWith('ref:') ? { destino: { _type: 'reference', _ref: m[2].slice(4) } } : { href: m[2] }) });
      children.push({ _key: `${k}s${i++}`, _type: 'span', marks: [mk], text: m[1] });
    }
    const b = { _key: k, _type: 'block', style: { '## ': 'h2', '### ': 'h3' }[marca] ?? 'normal', markDefs, children };
    if (marca === '- ') Object.assign(b, { listItem: 'bullet', level: 1 });
    return b;
  });
}

if (GLOSARIO) {
  const { aFlorida } = await import(path.join(RAIZ, 'scripts/sanity/es-florida.mjs'));
  const g = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/seo-loop/glosario-es-florida.json'), 'utf8'));
  const res = g.prohibidos.map((p) => new RegExp(`(?<![\\p{L}])(${p.patron})(?![\\p{L}])`, 'iu'));
  const toca = (t) => typeof t === 'string' && res.some((r) => r.test(t));
  for (const pub of publicados) {
    if (/^(legalPage|review)-/.test(pub._id)) continue;
    // Primero sobre una copia: solo se abre borrador si hay algo que cambiar.
    const muestra = [];
    const recorrer = (x, ruta, enEs, cambiar) => {
      if (Array.isArray(x)) return x.forEach((y, i) => recorrer(y, `${ruta}[${y?._key ?? i}]`, enEs, cambiar));
      if (!x || typeof x !== 'object') return;
      if (/sinonimos/.test(ruta)) return;
      if (typeof x.es === 'string' && toca(x.es)) cambiar(x, 'es', `${ruta}.es`);
      if (enEs && x._type === 'span' && toca(x.text)) cambiar(x, 'text', `${ruta}.text`);
      for (const [k, v] of Object.entries(x)) if (!k.startsWith('_')) recorrer(v, `${ruta}.${k}`, enEs || (k === 'es' && Array.isArray(v)), cambiar);
    };
    recorrer(pub, '', false, (o, k, r) => muestra.push(r));
    if (!muestra.length) continue;
    const doc = base(pub._id); if (!doc) continue;
    recorrer(doc, '', false, (o, k, r) => { const nuevo = aFlorida(o[k]); if (nuevo !== o[k]) { cambios.push({ id: pub._id, campo: `${r.slice(1)} (glosario)`, antes: o[k], despues: nuevo }); o[k] = nuevo; } });
  }
}

for (const f of ficheros) {
  const prop = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (path.basename(f).includes('alt')) {
    for (const d of publicados) {
      for (const { obj, ruta } of textos(d)) {
        if (!/\.alt$/.test(ruta) || typeof obj.en !== 'string' || obj.en.trim() !== (obj.es ?? '').trim() || !prop[obj.en.trim()]) continue;
        const doc = base(d._id); if (!doc) continue;
        const destino = textos(doc).find((t) => t.ruta === ruta)?.obj;
        if (destino) { cambios.push({ id: d._id, campo: `${ruta.slice(1)}.es`, antes: destino.es, despues: prop[obj.en.trim()] }); destino.es = prop[obj.en.trim()]; }
      }
    }
    continue;
  }
  for (const [ruta, p] of Object.entries(prop)) {
    if (ruta.startsWith('_')) continue;
    // «@<id>»: campos de un documento sin pagina (siteSettings…), por su ruta con puntos.
    if (ruta.startsWith('@')) {
      const doc = base(ruta.slice(1)); if (!doc) continue;
      for (const [campo, valor] of Object.entries(p.set ?? {})) fijar(doc, campo, valor);
      // local: {en, es} en markdown mínimo → el campo `local` (bloqueI18n) de una ciudad o un condado.
      if (p.local) fijar(doc, 'local', { _type: 'bloqueI18n', ...Object.fromEntries(Object.entries(p.local).map(([i, md]) => [i, bloques(md, `l${i}`)])) }, 'local');
      // fuentes: {en, es} en markdown → bloques añadidos al cuerpo del post, antes de su último CTA (una vez).
      for (const [i, md] of Object.entries(p.fuentes ?? {})) {
        const cuerpo = doc.cuerpo[i];
        if (cuerpo.some((b) => b._key?.startsWith('fo'))) continue;
        const nuevos = bloques(md, `fo${i}`);
        const cta = cuerpo.findLastIndex((b) => b._type === 'botones');
        cuerpo.splice(cta === -1 ? cuerpo.length : cta, 0, ...nuevos);
        cambios.push({ id: doc._id.slice(7), campo: `cuerpo.${i} (fuentes oficiales)`, antes: null, despues: md });
      }
      // insertarSecciones: [{ posicion, bloque }] — una sección que falta (no pisa las que hay).
      for (const { posicion, bloque } of p.insertarSecciones ?? []) {
        if ((doc.secciones ?? []).some((x) => x._key === bloque._key)) continue;
        (doc.secciones ??= []).splice(posicion, 0, bloque);
        cambios.push({ id: doc._id.slice(7), campo: `secciones[${bloque._key}] (nueva)`, antes: null, despues: bloque.clave });
      }
      continue;
    }
    const es = ruta === '/es/' || ruta.startsWith('/es/');
    const idioma = es ? 'es' : 'en';
    const pub = porRuta.get(es ? (ruta === '/es/' ? '/' : ruta.slice(3)) : ruta);
    if (!pub) { avisos.push(`${ruta}: sin documento de Sanity`); continue; }
    const doc = base(pub._id); if (!doc) continue;
    if (p.t) fijar(doc, `seo.titulo.${idioma}`, p.t);
    if (p.d) fijar(doc, `seo.descripcion.${idioma}`, p.d);
    // h1Partes: un H1 partido en varios textos (con <span>), fijado trozo a trozo por su clave.
    for (const [clave, texto] of Object.entries({ ...p.h1Partes, ...p.textos })) {
      const t = (doc.secciones ?? []).flatMap((x) => x.textos ?? []).find((x) => x.clave === clave);
      if (!t) throw new Error(`${ruta}: no hay un texto con clave ${clave}`);
      cambios.push({ id: pub._id, campo: `${clave}.${idioma}${p.h1Partes?.[clave] ? ' (H1)' : ''}`, antes: t.texto[idioma], despues: texto });
      t.texto[idioma] = texto;
    }
    if (p.h1) {
      if (!p.h1Actual) throw new Error(`${ruta}: falta h1Actual (el texto del H1 de hoy, para encontrarlo)`);
      // h1Doc: el H1 vive en otro documento (el del estimador, p. ej.).
      const docH1 = p.h1Doc ? base(p.h1Doc) : doc; if (!docH1) continue;
      const todos = textos(docH1).filter((t) => typeof t.obj[idioma] === 'string' && t.obj[idioma].trim() === p.h1Actual);
      const enSeccion = todos.filter((t) => /secciones|textos/.test(t.ruta) && /h1|titulo/i.test(t.ruta));
      const elegidos = enSeccion.length ? enSeccion : todos.filter((t) => /^\.(titulo|nombre)$/.test(t.ruta));
      if (!elegidos.length) throw new Error(`${ruta}: no encuentro el H1 «${p.h1Actual}» en ${pub._id}`);
      for (const t of elegidos) { cambios.push({ id: docH1._id.slice(7), campo: `${t.ruta.slice(1)}.${idioma} (H1)`, antes: t.obj[idioma], despues: p.h1 }); t.obj[idioma] = p.h1; }
    }
  }
}

console.log(`${trabajo.size} borradores, ${cambios.length} cambios${APLICAR ? '' : ' (prueba: sin --aplicar no se escribe nada)'}`);
for (const a of avisos) console.log(`  AVISO  ${a}`);
if (!APLICAR) { for (const x of cambios.slice(0, 15)) console.log(`  ${x.id} ${x.campo}: «${x.antes}» → «${x.despues}»`); process.exit(0); }

const docs = [...trabajo.values()];
for (let i = 0; i < docs.length; i += 40) {
  const tx = c.transaction();
  for (const d of docs.slice(i, i + 40)) tx.createOrReplace(d);
  await tx.commit({ visibility: 'async' });
}
const ahora = new Date().toISOString();
for (const d of docs) registro.documentos[d._id.slice(7)] = ahora;
registro.ultimaEscritura = ahora;
(registro.tandas ??= []).push({ fecha: ahora, ficheros: ficheros.map((f) => path.relative(RAIZ, f)), documentos: docs.length, cambios });
fs.writeFileSync(REGISTRO, JSON.stringify(registro, null, 1));
console.log(`escritos ${docs.length} borradores (drafts.*). Registro: ${path.relative(RAIZ, REGISTRO)}`);
