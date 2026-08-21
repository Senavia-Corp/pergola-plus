#!/usr/bin/env node
/**
 * Convierte las fotos de los proyectos nuevos a los AVIF que sirve el sitio.
 *
 *     node scripts/optimizar-fotos-proyecto.mjs
 *
 * Escribe en public/cms-img/projects/<slug>/, que SI esta en git (.gitignore
 * excluye cms-img salvo projects/, precisamente para esto). El mapa de que foto va
 * donde vive en scripts/lib/proyectos-destacados.mjs, junto al resto de los datos
 * del proyecto, para que el fragmento, la tarjeta y el archivo no se puedan
 * desincronizar.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE NO SE REUSA optimizar-imagenes-cliente.mjs
 *
 * Aquel fuerza 2500x1406 —la relacion de las cajas de producto— y corre una reja
 * de SSIM contra el AVIF YA PUBLICADO para cazar que una IA le haya cambiado la
 * casa a una restauracion. Aqui no hay version anterior contra la que comparar
 * (son fotos nuevas) y las cajas no son las mismas, asi que esa reja no puede
 * correr y ese recorte no aplica. Compartir el script habria significado
 * debilitar su reja para las 12 fotos que si la necesitan.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LOS HEIC HAY QUE PASARLOS POR sips
 *
 * sharp NO puede abrir los tres HEIC de Elan: libheif corta con «Number of
 * references in iref box (48) exceeds the security limits of 16». No es un
 * problema de formato sino de ESTE fichero —son fotos de iPhone con muchas
 * referencias internas—, asi que no se arregla con un flag.
 *
 * sips (macOS) si los abre y ademas respeta la orientacion EXIF. Se convierte a
 * PNG intermedio en un temporal y de ahi sigue el camino normal. El PNG se borra
 * al terminar: lo que se versiona es el AVIF.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TAMANO
 *
 * Tope de 2000px en el lado largo y se CONSERVA LA RELACION NATIVA. Las fichas de
 * proyecto meten el hero y la galeria en cajas con object-fit:cover, asi que el
 * recorte fino lo hace el CSS; lo que importa aqui es no servir 4 MB.
 *
 * Las dos del Sukkah llegaron a 1024px (una por WhatsApp) y se quedan a su tamano
 * NATIVO: ampliar es inventar pixeles. Salen mas blandas que la mediana del sitio
 * y esta anotado en el aviso que imprime el script, para poder pedirle al cliente
 * los originales.
 *
 * La escalera de calidad y el techo de 300 KB son los mismos que
 * optimizar-imagenes-cliente.mjs, por el mismo motivo: se baja la CALIDAD antes
 * que el TAMANO, porque el tamano es lo que arregla la nitidez.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import { PROYECTOS } from './lib/proyectos-destacados.mjs';

const ejecutar = promisify(execFile);
const RAIZ = path.resolve(import.meta.dirname, '..');
const ORIGEN = path.join(os.homedir(), 'Downloads/Featured Projects');
const DESTINO = path.join(RAIZ, 'public/cms-img/projects');

const LADO_LARGO = 2000;
const CALIDADES = [62, 56, 50, 44, 38];
const TECHO = 300 * 1024;

/** Los HEIC no los abre sharp; se pasan por sips a un PNG temporal. */
async function leer(origen, temporal) {
  if (!/\.heic$/i.test(origen)) return sharp(origen, { failOn: 'none' });
  const png = path.join(temporal, `${path.basename(origen, path.extname(origen))}.png`);
  await ejecutar('sips', ['-s', 'format', 'png', origen, '--out', png]);
  return sharp(png, { failOn: 'none' });
}

/** La primera calidad que no pase del techo; si ninguna, la mas baja. */
async function aAvif(imagen) {
  let ultimo;
  for (const quality of CALIDADES) {
    ultimo = await imagen.clone().avif({ quality, effort: 6 }).toBuffer();
    if (ultimo.length <= TECHO) return { buf: ultimo, quality };
  }
  return { buf: ultimo, quality: CALIDADES.at(-1) };
}

const temporal = await fs.mkdtemp(path.join(os.tmpdir(), 'pp-proyectos-'));
const blandas = [];
let escritas = 0;

try {
  for (const proyecto of PROYECTOS) {
    const dir = path.join(DESTINO, proyecto.slug);
    await fs.mkdir(dir, { recursive: true });
    console.log(`\n  ${proyecto.slug}`);

    for (const foto of proyecto.fotos) {
      const origen = path.join(ORIGEN, foto.origen);
      if (!(await fs.stat(origen).catch(() => null))) {
        console.error(`    !! no existe: ${foto.origen}`);
        process.exitCode = 1;
        continue;
      }

      const imagen = await leer(origen, temporal);
      const { width, height } = await imagen.metadata();

      // Solo se REDUCE. `withoutEnlargement` deja las dos del Sukkah a 1024.
      const redimensionada = imagen.resize({
        width: width >= height ? LADO_LARGO : null,
        height: width >= height ? null : LADO_LARGO,
        withoutEnlargement: true,
        fit: 'inside',
      });

      const { buf, quality } = await aAvif(redimensionada);
      const salida = await sharp(buf).metadata();
      await fs.writeFile(path.join(dir, foto.archivo), buf);
      escritas++;

      const kb = (buf.length / 1024).toFixed(0);
      console.log(`    ${foto.archivo}`);
      console.log(`      ${width}x${height} -> ${salida.width}x${salida.height}  ${kb} KB  q${quality}`);

      if (Math.max(salida.width, salida.height) < LADO_LARGO) {
        blandas.push(`${proyecto.slug}/${foto.archivo} (${salida.width}x${salida.height}, el original no daba mas)`);
      }
    }
  }
} finally {
  await fs.rm(temporal, { recursive: true, force: true });
}

console.log(`\n  ${escritas} AVIF escritos en public/cms-img/projects/`);

if (blandas.length) {
  console.log('\n  POR DEBAJO DE 2000px — el original no daba para mas:\n');
  for (const b of blandas) console.log(`    · ${b}`);
  console.log('\n  No es un fallo: ampliar seria inventar pixeles. Si se quieren mas');
  console.log('  nitidas, hay que pedirle los originales al cliente.\n');
}

console.log('  Siguiente: `npm run medir:imagenes` y `git add public/cms-img src/lib/img-dim.json`.\n');
