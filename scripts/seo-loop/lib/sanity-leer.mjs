/**
 * Lee del dataset lo que necesitan las puertas J6, J9 y J17 y lo deja en
 * .cache/seo-loop/sanity.json. SOLO LECTURA. Corre con la sesion del CLI:
 *
 *     (cd studio && npx sanity exec ../scripts/seo-loop/lib/sanity-leer.mjs --with-user-token)
 *
 *   - publicados: todos los documentos publicados;
 *   - loop: las versiones del loop. Con Releases, `versions.<release>.*`; en este plan
 *     (Free, limite de 0 Releases, comprobado el 23-oct-2026) son `drafts.*`;
 *   - releases: los documentos system.release (J17: ninguno publicado);
 *   - esquema: los campos de cada tipo (nombre, tipo, oculto fijo, oculto por funcion).
 * Nunca escribe y nunca imprime el token.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(import.meta.dirname, '../../..');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const { tipos } = await import(path.join(RAIZ, 'studio/schemas/index.ts'));
const c = getCliClient({ apiVersion: '2025-02-19' });

const RELEASE = fs.existsSync(path.join(RAIZ, 'docs/seo-loop/RELEASE.json'))
  ? JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/seo-loop/RELEASE.json'), 'utf8')) : { modo: 'borradores' };

const publicados = await c.fetch('*[!(_id in path("drafts.**")) && !(_id in path("versions.**")) && !(_type match "sanity.*") && !(_type match "system.*") && !(_id in path("_.**"))]', {}, { perspective: 'raw' });
const loop = RELEASE.modo === 'release'
  ? await c.fetch('*[_id in path($p)]', { p: `versions.${RELEASE.id}.**` }, { perspective: 'raw' })
  : await c.fetch('*[_id in path("drafts.**")]', {}, { perspective: 'raw' });
const releases = await c.fetch('*[_type == "system.release"]{_id, name, state, publishedAt, "titulo": metadata.title}', {}, { perspective: 'raw' });

// Esquema serializable: las funciones `hidden` se guardan como texto para evaluarlas luego.
const campo = (f) => ({
  name: f.name, type: f.type, of: f.of?.map((o) => o.type ?? o.name), to: f.to?.map((t) => t.type),
  fields: f.fields?.map(campo), oculto: f.hidden === true, ocultoFn: typeof f.hidden === 'function' ? String(f.hidden) : null,
  soloLectura: f.readOnly === true,
});
const esquema = Object.fromEntries(tipos.map((t) => [t.name, { type: t.type, fields: (t.fields ?? []).map(campo), of: t.of?.map((o) => o.type ?? o.name) }]));

fs.mkdirSync(path.join(RAIZ, '.cache/seo-loop'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, '.cache/seo-loop/sanity.json'), JSON.stringify({ leido: new Date().toISOString(), release: RELEASE, publicados, loop, releases, esquema }));
console.log(JSON.stringify({ publicados: publicados.length, loop: loop.length, releases: releases.length, tipos: Object.keys(esquema).length }));
