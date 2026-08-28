#!/usr/bin/env node
/**
 * Deriva la imagen de `og:image` de las 10 fichas de producto.
 *
 *     node scripts/generar-og.mjs
 *
 * POR QUE HACE FALTA. Medido sobre el build antes de esto: `og:image` no existia
 * en NINGUNA de las 217 paginas, y `ogImage` era `null` en los diez productos de
 * `_items.json`. O sea, cualquier enlace compartido del sitio salia sin tarjeta, y
 * `producto()` (src/lib/jsonld.ts) nunca podia emitir `image` porque solo la emite
 * si le pasan una.
 *
 * POR QUE UN DERIVADO Y NO EL AVIF DEL HERO. El hero de cada ficha es AVIF, y AVIF
 * no esta en la lista de formatos que Google documenta para las imagenes de datos
 * estructurados (BMP, GIF, JPEG, PNG, WebP, SVG); los rastreadores de las redes
 * sociales tampoco lo pintan de forma fiable. Se deriva un JPEG de 1200x630 —la
 * medida que piden Open Graph y Twitter para la tarjeta grande— del MISMO hero que
 * ve el visitante, asi que la tarjeta no puede enseñar otra cosa que la pagina.
 *
 * EL FICHERO TIENE QUE ACABAR EN GIT, no solo en disco. `check:imagenes` lo
 * comprueba con `git ls-files` porque Vercel construye desde un CLON: una imagen
 * que solo existe en el disco de quien la genero se sirve como 404 en produccion y
 * en local todo pasa en verde. Por eso este script AVISA al final de lo que hay que
 * añadir al indice.
 *
 * NO ENTRA EN check:generadores a proposito. La salida es binaria y la produce
 * `sharp`, cuyo encoder puede cambiar de bytes entre versiones: exigir «regenerar
 * no cambia nada» convertiria una actualizacion de dependencia en un fallo de
 * puerta. Lo que si vigila una puerta es lo que importa —que el fichero exista, que
 * este en git y que la pagina lo pida—, y de eso se encarga `check:imagenes`.
 *
 * De donde sale el origen: del `<img class="image-4">` del hero de cada fragmento
 * migrado. No se mantiene una lista aparte, que es como se desincronizan.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const FRAG = path.join(RAIZ, 'src/contenido-migrado/products');
const PUBLIC = path.join(RAIZ, 'public');
const DESTINO = path.join(PUBLIC, 'images/og');

/** Open Graph y Twitter `summary_large_image`: 1200x630, relacion 1,91:1. */
export const OG_ANCHO = 1200;
export const OG_ALTO = 630;

/** Ruta publica del derivado de un slug. La comparten este script y el generador. */
export const rutaOg = (slug) => `/images/og/${slug}-${OG_ANCHO}x${OG_ALTO}.jpg`;

/** El `src` del hero de una ficha, leido del propio fragmento que se sirve. */
export function heroDeFragmento(html, slug) {
  const src = html.match(/<img[^>]*\ssrc="([^"]+)"[^>]*\sclass="image-4"/)?.[1]
    ?? html.match(/<img[^>]*\sclass="image-4"[^>]*\ssrc="([^"]+)"/)?.[1];
  if (!src) throw new Error(`[og] ${slug}: no encuentro el <img class="image-4"> del hero`);
  return src;
}

// Este modulo lo importa scripts/generar-detalle.mjs solo por `rutaOg`. Sin esta
// guarda, importarlo regeneraria las diez imagenes en cada pasada del generador.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  await fs.mkdir(DESTINO, { recursive: true });

  const ficheros = (await fs.readdir(FRAG)).filter((f) => f.endsWith('.html')).sort();
  const hechas = [];

  for (const f of ficheros) {
    const slug = f.slice(0, -5);
    const html = await fs.readFile(path.join(FRAG, f), 'utf8');
    const src = heroDeFragmento(html, slug);
    const origen = path.join(PUBLIC, src.replace(/^\//, ''));
    const meta = await sharp(origen).metadata();
    const salida = path.join(PUBLIC, rutaOg(slug).replace(/^\//, ''));

    await sharp(origen)
      // `cover` con el centro: el recorte es el que veria cualquier rastreador y
      // no depende de un punto focal elegido por la libreria, que cambia entre
      // versiones y no se puede revisar.
      .resize(OG_ANCHO, OG_ALTO, { fit: 'cover', position: 'centre' })
      // Submuestreo de croma por defecto (4:2:0) y no 4:4:4: son fotografias que
      // se ven a 600 px en una tarjeta de red social, y 4:4:4 duplicaba el peso
      // sin que se note. Medido: 216 KB -> 159 KB en la mas pesada.
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(salida);

    const { size } = await fs.stat(salida);
    hechas.push({ slug, src, origen: `${meta.width}x${meta.height}`, kb: Math.round(size / 1024) });
  }

  console.log('og:image de las fichas de producto\n');
  for (const h of hechas) {
    console.log(`  ${h.slug.padEnd(30)} ${h.origen.padStart(10)} -> ${OG_ANCHO}x${OG_ALTO}  ${String(h.kb).padStart(4)} KB`);
    console.log(`  ${' '.repeat(30)} ${h.src}`);
  }
  console.log(`\n  ${hechas.length} imagenes en public/images/og/`);
  console.log('\n  RECUERDA: `git add public/images/og` — check:imagenes usa `git ls-files`');
  console.log('  y Vercel construye desde un clon: en disco no basta.');
}
