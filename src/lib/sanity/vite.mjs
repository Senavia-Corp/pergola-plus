/**
 * `__PP_AJUSTES__`: el documento `siteSettings` de la instantanea, horneado en el build
 * como constante de Vite (`define`); null si el build lee del repo.
 *
 * Por que una constante y no `sanity()`: src/lib/jsonld.ts (NEGOCIO) lo importa tambien
 * la funcion de servidor /api/lead, que corre en Vercel sin la instantanea. Asi la
 * funcion lleva dentro los datos del negocio con que se construyo el sitio (el NAP del
 * correo es el mismo que el de la pagina) y no lee nada en tiempo de ejecucion. Y un
 * script que importe jsonld.ts con Node a secas (comprobar-correo.mjs) ve la constante
 * sin definir y cae al repo, sin romper.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

export function ajustesSanity(raiz = process.cwd()) {
  let doc = null;
  if (process.env.PP_FUENTE === 'sanity') {
    const f = path.join(raiz, '.cache/sanity/contenido.json');
    doc = JSON.parse(readFileSync(f, 'utf8')).docs.find((d) => d._id === 'siteSettings');
    if (!doc) throw new Error('[sanity] la instantanea no trae siteSettings');
  }
  return { __PP_AJUSTES__: JSON.stringify(doc) };
}
