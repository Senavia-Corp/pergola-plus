/**
 * Descarga los assets que el CDN de Webflow sirve y el export NO trae.
 *
 * El HTML renderizado pide cosas que no estan en images/ ni en los CSV:
 *   - variantes -p-500/-p-800/-p-1080 que el CDN genera al vuelo
 *   - archivos con el nombre codificado ("Generated-Image-February-11%2C-...",
 *     "appoiment%20.avif") que no coinciden con el nombre del export
 *   - iconos subidos al CMS que no aparecen en ninguna columna
 *   - el poster del video, referenciado con la ruta escapada
 *
 * Deducir la equivalencia seria adivinar. Se descargan: son pocas, pesan poco y
 * asi el srcset queda identico al original.
 *
 * Muta `mapa` y `locales` para que la reescritura posterior las resuelva.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { reescribirImagenes, PLACEHOLDERS } from './transformar.mjs';

export async function bajarFaltantes({ htmls, cuerpo, mapa, locales, destino }) {
  const pendientes = new Set();
  for (const html of htmls) {
    for (const u of reescribirImagenes(cuerpo(html), mapa, locales).sinResolver) {
      if (!PLACEHOLDERS[u]) pendientes.add(u);   // los placeholders los resuelve transformar()
    }
  }
  if (!pendientes.size) return { bajadas: 0, fallos: [] };

  const fallos = [];
  let bajadas = 0;
  for (const url of pendientes) {
    const nombre = decodeURIComponent(url.split('/').pop())
      .replace(/^[0-9a-f]{20,32}_/i, '')
      .replace(/[^\w.-]+/g, '-');            // el CDN admite espacios y comas; el disco mejor no
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await fs.writeFile(path.join(destino, nombre), Buffer.from(await r.arrayBuffer()));
      mapa[url] = { src: `/images/${nombre}` };   // resolucion por URL exacta
      locales.add(nombre);
      bajadas++;
    } catch (e) {
      fallos.push({ url, error: e.message });
    }
  }
  return { bajadas, fallos };
}
