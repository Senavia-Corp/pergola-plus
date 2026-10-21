/**
 * Medidas de la imagen og (og:image:width / og:image:height), leidas del fichero de
 * public/ en el build. Solo rutas locales; una URL externa o un fichero que no esta
 * devuelve null y la etiqueta no sale (mejor ninguna medida que una inventada).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const cache = new Map();
export async function dimensionesOg(ruta) {
  if (!ruta?.startsWith('/') || ruta.startsWith('//')) return null;
  if (!cache.has(ruta)) {
    const f = path.join(process.cwd(), 'public', decodeURIComponent(ruta.split(/[?#]/)[0]));
    cache.set(ruta, fs.existsSync(f) ? sharp(f).metadata().then((m) => (m.width && m.height ? { ancho: m.width, alto: m.height } : null)) : Promise.resolve(null));
  }
  return cache.get(ruta);
}
