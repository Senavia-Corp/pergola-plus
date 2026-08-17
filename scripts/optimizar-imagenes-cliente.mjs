#!/usr/bin/env node
/**
 * Convierte las fotos que mando el cliente (handoff §6) a los AVIF que sirve el
 * sitio.
 *
 *     node scripts/optimizar-imagenes-cliente.mjs
 *
 * Lee de ~/Downloads y escribe en public/images/cliente/, que SI esta en git.
 * El mapa —que ruta del CMS sustituye cada foto— vive en IMAGENES_CLIENTE
 * (scripts/lib/transformar.mjs) y es el mismo que usa el transformador: una sola
 * fuente de verdad, asi que no pueden desincronizarse. Si se desincronizaran, el
 * HTML pediria un archivo que no existe y eso lo caza `npm run check:imagenes`.
 *
 * Los originales van de 796x548 a 4996x3747, y hay dos VERTICALES (3024x4032 y
 * 3055x3325). Todas caen en cajas con `object-fit:cover` y altura fija del CSS
 * migrado, asi que el recorte lo iba a hacer el navegador de todas formas —
 * centrado y a ciegas. Se hace aqui con `position:'attention'`, que elige la
 * region con mas detalle: en un retrato de una pergola eso es la pergola, no el
 * cielo ni el suelo.
 *
 * Sin este paso el sitio serviria 13,2 MB de JPEG en una tarjeta de 250px.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  IMAGENES_CLIENTE, RECORTE, rutaCliente, CLIENTE_ANCHO, CLIENTE_ALTO,
} from './lib/transformar.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ORIGEN = '/Users/senavia/Downloads';
const DESTINO = path.join(RAIZ, 'public/images/cliente');

// Calidad 62: medido contra los AVIF del CMS que sustituyen (157-341 KB a
// 1250x703). Por encima de 70 se pasa de 400 KB sin diferencia visible en una
// caja de 250px de alto.
const CALIDAD = 62;

await fs.mkdir(DESTINO, { recursive: true });

let hechas = 0;
const fallos = [];
const filas = [];

for (const [ruta, origen] of Object.entries(IMAGENES_CLIENTE)) {
  const entrada = path.join(ORIGEN, origen);
  const salida = path.join(RAIZ, 'public', rutaCliente(origen).slice(1));

  const info = await sharp(entrada).metadata().catch(() => null);
  if (!info) {
    fallos.push(`no se puede leer: ${origen}`);
    continue;
  }

  const posicion = RECORTE[origen] ?? 'attention';
  await sharp(entrada)
    .rotate() // respeta el EXIF: las fotos de iPhone vienen giradas por metadato
    .resize(CLIENTE_ANCHO, CLIENTE_ALTO, { fit: 'cover', position: posicion })
    .avif({ quality: CALIDAD })
    .toFile(salida);

  const antes = (await fs.stat(entrada)).size;
  const despues = (await fs.stat(salida)).size;
  hechas++;
  filas.push({
    origen,
    destino: rutaCliente(origen),
    sustituye: ruta,
    de: `${info.width}x${info.height}`,
    antes: (antes / 1024 / 1024).toFixed(1) + ' MB',
    despues: (despues / 1024).toFixed(0) + ' KB',
  });
}

for (const f of filas) {
  console.log(`  ${f.de.padStart(9)} -> ${CLIENTE_ANCHO}x${CLIENTE_ALTO}  ${f.antes.padStart(7)} -> ${f.despues.padStart(6)}  ${f.origen}`);
  console.log(`  ${' '.repeat(11)}sustituye ${f.sustituye}`);
}

if (fallos.length) {
  console.log(`\n  FALLO  ${fallos.length}:`);
  for (const f of fallos) console.log(`         ${f}`);
  process.exit(1);
}

const total = filas.reduce((n, f) => n + parseFloat(f.despues), 0);
console.log(`\n  ${hechas} imagenes en public/images/cliente/ (${(total / 1024).toFixed(1)} MB en total)`);
console.log('  ahora: node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs');
