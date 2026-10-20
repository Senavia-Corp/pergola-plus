/**
 * Contenido de Sanity para el build (PP_FUENTE=sanity). Corre ANTES de `astro build`.
 *
 *     PP_FUENTE=sanity node scripts/sanity/instantanea.mjs
 *
 * 1. Lee TODOS los documentos publicados del dataset por la API publica, sin la CDN (un
 *    build que lanza el webhook justo al publicar tiene que ver lo publicado), sin token (el
 *    dataset es publico) y los deja en .cache/sanity/contenido.json. Un solo viaje y una
 *    sola foto del dataset para todo el build: ninguna pagina ve otra version.
 * 2. Imagenes. Cada imagen migrada guarda su `origen` (la ruta de public/ de la que
 *    salio); mientras el asset sea ese fichero (el sha1 va en el id del asset) se pinta
 *    esa ruta, con su srcset de siempre. Si el editor cambio la foto, el asset nuevo se
 *    descarga de cdn.sanity.io a public/cms-img/sanity/<sha1>.<ext> (no va a git).
 * 3. Cerrado si falta algo: si la API no responde, o faltan los singletons, o una imagen
 *    no se puede resolver, lanza y el build no publica.
 *
 * Con PP_FUENTE distinto de `sanity` no hace nada: el build lee del repo como siempre.
 */
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { partesAsset } from '../../src/lib/sanity/assets.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
export const SALIDA = path.join(RAIZ, '.cache/sanity/contenido.json');
const PROYECTO = process.env.SANITY_PROJECT_ID ?? 'n0ct9t3k';
const DATASET = process.env.SANITY_DATASET ?? 'production';
const VERSION = process.env.SANITY_API_VERSION ?? '2025-01-01';
const SINGLETONS = ['siteSettings', 'navigation', 'estimador'];

async function consulta(q) {
  const u = new URL(`https://${PROYECTO}.api.sanity.io/v${VERSION}/data/query/${DATASET}`);
  u.searchParams.set('query', q);
  for (let intento = 1; ; intento++) {
    try {
      const r = await fetch(u);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return (await r.json()).result;
    } catch (e) {
      if (intento >= 3) throw new Error(`[sanity] la API no responde (${e.message}): no se construye sin contenido`);
      await new Promise((ok) => setTimeout(ok, 1000 * intento));
    }
  }
}

const sha1 = (f) => crypto.createHash('sha1').update(readFileSync(f)).digest('hex');
export async function instantanea() {
  const docs = await consulta('*[!(_id in path("drafts.**")) && !(_type match "sanity.*") && !(_id in path("_.**"))] | order(_id asc)');
  for (const s of SINGLETONS) if (!docs.some((d) => d._id === s)) throw new Error(`[sanity] falta el documento ${s}: no se construye`);

  // Rutas de cada imagen: `origen` si el fichero sigue siendo el del asset; si no, la descarga.
  const origenes = {};
  const descargas = new Map();
  const visitar = (x) => {
    if (Array.isArray(x)) return x.forEach(visitar);
    if (!x || typeof x !== 'object') return;
    if (x.asset?._ref?.startsWith('image-')) {
      const { sha1: h, ancho, alto, ext } = partesAsset(x.asset._ref);
      const local = x.origen && path.join(RAIZ, 'public', x.origen);
      if (local && existsSync(local)) {
        origenes[x.origen] ??= sha1(local);
        if (origenes[x.origen] === h) return;
      }
      descargas.set(h, { url: `https://cdn.sanity.io/images/${PROYECTO}/${DATASET}/${h}-${ancho}x${alto}.${ext}`, ruta: `/cms-img/sanity/${h}.${ext}` });
    }
    Object.values(x).forEach(visitar);
  };
  visitar(docs);
  for (const { url, ruta } of descargas.values()) {
    const destino = path.join(RAIZ, 'public', ruta);
    if (existsSync(destino)) continue;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`[sanity] no se puede descargar ${url}: HTTP ${r.status}`);
    await fs.mkdir(path.dirname(destino), { recursive: true });
    await fs.writeFile(destino, Buffer.from(await r.arrayBuffer()));
  }
  const contenido = { leido: new Date().toISOString(), proyecto: PROYECTO, dataset: DATASET, docs, origenes };
  await fs.mkdir(path.dirname(SALIDA), { recursive: true });
  await fs.writeFile(SALIDA, JSON.stringify(contenido));
  return { documentos: docs.length, imagenesDescargadas: descargas.size };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.env.PP_FUENTE !== 'sanity') {
    console.log('[sanity] PP_FUENTE no es «sanity»: el build lee del repo');
  } else {
    console.log('[sanity]', JSON.stringify(await instantanea()));
  }
}
