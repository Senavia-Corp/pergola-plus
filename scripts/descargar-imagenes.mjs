#!/usr/bin/env node
/**
 * Fase 0.5 — PROMPT A: descarga y organizacion de imagenes.
 *
 * El export de Webflow NO trae las imagenes del CMS: los 14 CSV referencian
 * cientos de URLs que siguen en cdn.prod.website-files.com. Este script las baja
 * todas, las organiza y genera el manifest.
 *
 * Idempotente y reanudable: si el archivo ya existe con el mismo SHA-256, no se
 * vuelve a descargar. Si se corta, se relanza.
 *
 *   node scripts/descargar-imagenes.mjs
 */
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const EXPORT = '/Users/senavia/Downloads/Webflow Pergola Plus Florida';
const OUT = path.resolve(import.meta.dirname, '..', 'assets-migracion');
const CONCURRENCIA = 5;
const REINTENTOS = 3;

// ---------------------------------------------------------------------------
// Mapeo de campos. Verificado columna a columna contra los 14 CSV.
// OJO con los typos y las incoherencias del CMS original: estan a proposito.
//   - Services: 'Img Intro' se aparea con 'Metadata Image Intro' (Image, no Img)
//   - Projects: 'Metadescription' a secas es la meta de PAGINA, NO el alt.
//               El alt es 'Metadesciption Main Project Imagen' (sic, sin la r)
//   - Blog:     'Metadescripcion Imagen' es el alt; 'Metadescription SEO' no.
// ---------------------------------------------------------------------------
const COLECCIONES = [
  {
    csv: '- Products -', dir: 'products', tipo: 'product', ruta: '/products',
    campos: [
      { col: 'Main Image', rol: 'hero', alt: 'Metadescription Main Imagen' },
      { col: 'Img Cover', rol: 'cover', alt: 'Metadescription Img Cover' },
      { col: 'Img Intro', rol: 'intro', alt: 'Metadescription Img Intro' },
      { col: 'Img Color', rol: 'swatch', alt: 'Metadescription Img Color' },
      { col: 'Gallery', rol: 'gallery', alt: null, multi: true },
    ],
  },
  {
    csv: '- Services -', dir: 'services', tipo: 'service', ruta: '/services',
    campos: [
      { col: 'Img Cover', rol: 'cover', alt: 'Metadata Img Cover' },
      { col: 'Img Intro', rol: 'intro', alt: 'Metadata Image Intro' },
      { col: 'Img Feature 1', rol: 'feature', alt: 'Metadata Img Feature 1' },
      { col: 'Img Feature 2', rol: 'feature', alt: 'Metadata Img Feature 2' },
      { col: 'Img Feature 3', rol: 'feature', alt: 'Metadata Img Feature 3' },
      { col: 'Img Feature 4', rol: 'feature', alt: 'Metadata Img Feature 4' },
      { col: 'Img Feature 5', rol: 'feature', alt: 'Metadata Img Feature 5' },
      { col: 'Gallery', rol: 'gallery', alt: null, multi: true },
    ],
  },
  {
    csv: 'Blog Posts', dir: 'blog', tipo: 'post', ruta: '/post',
    campos: [
      { col: 'Main Image', rol: 'hero', alt: 'Metadescripcion Imagen' },
      { col: 'Thumbnail image', rol: 'thumbnail', alt: 'Metadescripcion Imagen' },
      { col: 'Post Body', rol: 'inline', richtext: true },
    ],
  },
  {
    csv: 'Projects', dir: 'projects', tipo: 'project', ruta: '/project',
    campos: [
      { col: 'Main Project Image', rol: 'hero', alt: 'Metadesciption Main Project Imagen' },
      { col: 'Project Gallery', rol: 'gallery', alt: null, multi: true },
    ],
  },
  {
    csv: 'Brands', dir: 'brands', tipo: 'brand', ruta: '/brands',
    campos: [
      { col: 'Logo', rol: 'brand-logo', alt: null },
      { col: 'Cover', rol: 'cover', alt: 'Metadata Cover' },
      { col: 'Brand Gallery', rol: 'gallery', alt: null, multi: true },
    ],
  },
  {
    csv: 'Countries', dir: 'locations', tipo: 'country', ruta: '/countries',
    campos: [
      { col: 'Cover', rol: 'cover', alt: 'Metadescription Cover' },
      { col: 'Img Intro', rol: 'intro', alt: 'Metadescription Img Intro' },
    ],
  },
  {
    csv: 'Pergolas Contractors', dir: 'locations', tipo: 'contractor', ruta: '/pergolas-contractors',
    campos: [
      { col: 'Image Post', rol: 'cover', alt: 'Metadata Image Post' },
      { col: 'Image Intro', rol: 'intro', alt: 'Metadata Image Intro' },
    ],
  },
  {
    csv: 'Industries', dir: 'industries', tipo: 'industry', ruta: null,
    campos: [{ col: 'Cover', rol: 'cover', alt: 'Metadata Cover' }],
  },
  {
    csv: 'Brochures', dir: 'brochures', tipo: 'brochure', ruta: null,
    campos: [{ col: 'Cover', rol: 'cover', alt: 'Metadata Cover' }],
  },
  {
    csv: 'Galleries', dir: 'galleries', tipo: 'gallery', ruta: null,
    campos: [{ col: 'Image', rol: 'gallery', alt: 'Metadescripcion' }],
  },
  {
    csv: 'Articles', dir: 'articles', tipo: 'article', ruta: '/articles',
    campos: [{ col: 'Content', rol: 'inline', richtext: true }],
  },
  // FAQs, Categories y Feature Products no tienen imagenes (verificado: la
  // columna Icon de Feature Products esta vacia en las 60 filas).
];

// Webflow encadena extensiones cuando reconvierte un asset: al subir un .jpg y
// convertirlo a AVIF, la URL queda ".jpg.avif". Si el patron para en la primera
// extension, la URL sale truncada y devuelve 403. Hay 2 casos asi en este CMS.
const EXT = 'jpg|jpeg|png|webp|avif|svg|gif';
const RX_URL = new RegExp(`https://[^\\s"'<>)\\];]+?\\.(?:${EXT})(?:\\.(?:${EXT}))*`, 'gi');
const RX_EXT_FINAL = new RegExp(`(?:\\.(?:${EXT}))+$`, 'i');
const RX_VARIANTE = /-p-\d+(?=(?:\.[a-z0-9]+)+$)/i;

// --- parser CSV (los campos traen HTML con comas y saltos de linea) ---------
function parseCSV(txt) {
  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);
  const filas = [];
  let campo = '', fila = [], enComillas = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (enComillas) {
      if (c === '"') {
        if (txt[i + 1] === '"') { campo += '"'; i++; } else enComillas = false;
      } else campo += c;
    } else if (c === '"') enComillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  const cab = filas.shift();
  return filas
    .filter((f) => f.some((v) => v !== ''))
    .map((f) => Object.fromEntries(cab.map((c, i) => [c, f[i] ?? ''])));
}

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';

/**
 * {cdn}/{siteId}/{hash24}_{slug-seo}.ext  ->  slug-seo.ext
 *
 * Dos trampas de Webflow, las dos vistas en las 23 portadas de folleto:
 *
 *  - Al RE-SUBIR un asset encadena hashes: "{nuevo}_{viejo}_Nombre.jpg". Quitar
 *    solo el primero dejaba el viejo pegado al slug.
 *  - Y re-codifica el nombre, asi que "%2520" es un espacio codificado DOS
 *    veces. Con un solo decode queda un "%20" literal que slugify convierte en
 *    "-20-": de ahi salia "brochure-20cover".
 */
function nombreDesdeUrl(url) {
  let base = url.split('/').pop().split('?')[0];
  for (let i = 0; i < 3 && /%[0-9a-f]{2}/i.test(base); i++) {
    try { base = decodeURIComponent(base); } catch { break; }
  }
  return base.replace(/^(?:[0-9a-f]{20,32}_)+/i, '');
}

/** Comprueba los magic bytes. Un HTML de error con extension .avif es un fallo. */
function formatoReal(buf) {
  if (buf.length < 12) return null;
  const a = buf.subarray(0, 12);
  if (a[0] === 0xff && a[1] === 0xd8 && a[2] === 0xff) return 'jpg';
  if (a[0] === 0x89 && a[1] === 0x50 && a[2] === 0x4e && a[3] === 0x47) return 'png';
  if (a.subarray(4, 8).toString('latin1') === 'ftyp') {
    const brand = a.subarray(8, 12).toString('latin1');
    if (brand.startsWith('avi')) return 'avif';
    if (brand.startsWith('hei') || brand.startsWith('mif')) return 'heic';
  }
  if (a.subarray(0, 4).toString('latin1') === 'RIFF' &&
      buf.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp';
  if (a.subarray(0, 4).toString('latin1') === 'GIF8') return 'gif';
  const t = buf.subarray(0, 400).toString('utf8').trimStart().toLowerCase();
  if (t.startsWith('<svg') || (t.startsWith('<?xml') && t.includes('<svg'))) return 'svg';
  if (t.startsWith('<!doctype html') || t.startsWith('<html')) return 'HTML';
  return null;
}

/** Dimensiones sin dependencias externas. */
function dimensiones(buf, fmt) {
  try {
    if (fmt === 'png') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (fmt === 'gif') return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    if (fmt === 'jpg') {
      let o = 2;
      while (o < buf.length - 9) {
        if (buf[o] !== 0xff) { o++; continue; }
        const m = buf[o + 1];
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m))
          return { height: buf.readUInt16BE(o + 5), width: buf.readUInt16BE(o + 7) };
        o += 2 + buf.readUInt16BE(o + 2);
      }
    }
    if (fmt === 'webp') {
      const t = buf.subarray(12, 16).toString('latin1');
      if (t === 'VP8X') return { width: (buf.readUIntLE(24, 3) & 0xffffff) + 1, height: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
      if (t === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (t === 'VP8L') { const b = buf.readUInt32LE(21); return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }; }
    }
    if (fmt === 'avif') {
      // ispe (image spatial extents) lleva ancho y alto en big-endian.
      const i = buf.indexOf(Buffer.from('ispe', 'latin1'));
      if (i > 0) return { width: buf.readUInt32BE(i + 8), height: buf.readUInt32BE(i + 12) };
    }
    if (fmt === 'svg') {
      const s = buf.subarray(0, 2000).toString('utf8');
      const vb = s.match(/viewBox\s*=\s*["']\s*[\d.-]+[ ,]+[\d.-]+[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
      if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
    }
  } catch {}
  return { width: null, height: null };
}

/**
 * Alt de respaldo, derivado del sujeto y el rol.
 * NO sustituye al alt original: se guarda aparte en `altDerivado` y se marca con
 * `altGenerado`. La Fase 1 usa `alt` para ser fiel al HTML original (las
 * galerias del sitio en vivo se sirven con alt=""); esto es la base para el
 * trabajo de accesibilidad posterior y para el campo requerido de Sanity.
 */
function derivarAlt(rol, subject, orden) {
  const n = (subject?.name || '').trim();
  if (!n) return null;
  const i = typeof orden === 'number' ? orden + 1 : null;
  switch (rol) {
    case 'gallery': return i ? `${n} — gallery image ${i}` : `${n} — gallery image`;
    case 'brand-logo': return `${n} logo`;
    case 'cover': return subject.type === 'brochure' ? `${n} brochure cover` : `${n} — cover image`;
    case 'hero': return `${n} — main image`;
    case 'thumbnail': return `${n} — thumbnail`;
    case 'intro': return `${n} — introduction image`;
    case 'feature': return `${n} — feature image`;
    case 'swatch': return `${n} — colour and finish options`;
    case 'inline': return n;
    default: return null;
  }
}

/**
 * Desempate entre las referencias a una MISMA imagen. Menor gana.
 *
 * Manda el alt: una columna que lo trae describe la imagen, y `Gallery` nunca lo
 * trae. A igualdad, el rol mas especifico. Lo que NO decide es el orden de
 * llegada — esa era justamente la moneda al aire.
 */
const ORDEN_ROL = ['hero', 'cover', 'intro', 'feature', 'swatch', 'thumbnail',
                   'brand-logo', 'site', 'inline', 'gallery'];
const rango = (r) => (r.alt ? 0 : 100) + (ORDEN_ROL.indexOf(r.rol) + 1 || 99);

// --- estado -----------------------------------------------------------------
const porSha = new Map();   // sha256 -> entrada del manifest
const porUrl = new Map();   // url    -> sha256
const errores = [];
let descargadas = 0, cacheadas = 0, variantesDescartadas = 0;

/** Alt recuperado del HTML estatico: basename del archivo -> alt. */
const altDesdeHtml = new Map();

/**
 * Cache de la ejecucion anterior: url -> {file, sha256}. Si el archivo sigue en
 * disco con ese sha, se salta la descarga. Es lo que hace el script reanudable
 * de verdad: sin esto, un relanzamiento vuelve a bajar las 501 imagenes.
 */
const cachePrevia = new Map();

async function bajar(url) {
  let ultimo;
  for (let i = 0; i < REINTENTOS; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'pergola-plus-migracion/1.0' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      ultimo = e;
      if (i < REINTENTOS - 1) await new Promise((s) => setTimeout(s, 500 * 2 ** i));
    }
  }
  throw ultimo;
}

/**
 * Registra una imagen. `origen` = local (Buffer ya leido) o remota (url).
 * `usedIn` es una LISTA: las referencias a una misma URL ya vienen fusionadas.
 */
async function registrar({ url, buf, dir, rol, alt, subject, usedIn = [] }) {
  if (RX_VARIANTE.test(nombreDesdeUrl(url))) { variantesDescartadas++; return null; }

  const yaSha = porUrl.get(url);
  if (yaSha) {                                   // misma URL vista antes
    const e = porSha.get(yaSha);
    e.usedIn.push(...usedIn);
    if (!e.alt && alt) e.alt = alt;
    return e;
  }

  if (!buf) {
    // Reanudable: si la ejecucion anterior ya la bajo y el archivo sigue en
    // disco con el mismo sha, no se vuelve a pedir a la red.
    const prev = cachePrevia.get(url);
    if (prev) {
      try {
        const enDisco = await fs.readFile(path.join(OUT, prev.file));
        if (createHash('sha256').update(enDisco).digest('hex') === prev.sha256) {
          buf = enDisco; cacheadas++;
        }
      } catch {}
    }
    if (!buf) {
      try { buf = await bajar(url); descargadas++; }
      catch (err) { errores.push({ url, error: String(err.message || err) }); return null; }
    }
  }

  const fmt = formatoReal(buf);
  if (!fmt || fmt === 'HTML') {
    errores.push({ url, error: `contenido no es imagen (detectado: ${fmt || 'desconocido'})` });
    return null;
  }

  const sha = createHash('sha256').update(buf).digest('hex');
  if (porSha.has(sha)) {                         // mismo archivo, otra URL
    const e = porSha.get(sha);
    e.sourceUrls.push(url);
    e.usedIn.push(...usedIn);
    if (!e.alt && alt) e.alt = alt;
    porUrl.set(url, sha);
    return e;
  }

  // Quita la cadena COMPLETA de extensiones ("foo.jpg.avif" -> "foo"), si no el
  // slug se queda un "-jpg" o "-avif" pegado al nombre.
  let nombre = slugify(nombreDesdeUrl(url).replace(RX_EXT_FINAL, '') || 'imagen');
  const rel = path.join(dir, `${rol}-${nombre}.${fmt}`);
  let destino = path.join(OUT, rel), relFinal = rel, n = 2;
  while (porSha.size && [...porSha.values()].some((e) => e.file === relFinal)) {
    relFinal = path.join(dir, `${rol}-${nombre}-${n++}.${fmt}`);
    destino = path.join(OUT, relFinal);
  }

  await fs.mkdir(path.dirname(destino), { recursive: true });
  // Reanudable: si ya esta en disco con el mismo sha, no reescribe.
  try {
    const prev = await fs.readFile(destino);
    if (createHash('sha256').update(prev).digest('hex') === sha) cacheadas++;
    else await fs.writeFile(destino, buf);
  } catch { await fs.writeFile(destino, buf); }

  const { width, height } = dimensiones(buf, fmt);
  const e = {
    file: relFinal, sha256: sha, bytes: buf.length, format: fmt, width, height,
    role: rol, subject, alt: alt || null,
    sourceUrls: [url], usedIn: [...usedIn],
  };
  porSha.set(sha, e); porUrl.set(url, sha);
  return e;
}

/** Cola con concurrencia limitada. */
async function enCola(tareas, n = CONCURRENCIA) {
  const activos = new Set();
  for (const t of tareas) {
    const p = t().finally(() => activos.delete(p));
    activos.add(p);
    if (activos.size >= n) await Promise.race(activos);
  }
  await Promise.all(activos);
}

// ---------------------------------------------------------------------------
async function main() {
  console.log('Fase 0.5 — descarga de imagenes\n');

  // ---- 0a. Cache de la ejecucion anterior ----------------------------------
  try {
    const prev = JSON.parse(await fs.readFile(path.join(OUT, 'manifest.json'), 'utf8'));
    for (const a of prev.assets || [])
      for (const u of a.sourceUrls || []) cachePrevia.set(u, { file: a.file, sha256: a.sha256 });
    console.log(`  cache previa: ${cachePrevia.size} urls conocidas`);
  } catch { /* primera ejecucion */ }

  // ---- 0b. Alt del HTML estatico -------------------------------------------
  // Las imagenes locales de images/ no llevan alt en ningun CSV, pero el HTML
  // si trae textos alt largos y descriptivos. Recuperarlos es gratis.
  const htmls = [];
  for (const d of ['', 'about-us', 'contact-us', 'resources']) {
    const dir = path.join(EXPORT, d);
    for (const f of await fs.readdir(dir))
      if (f.endsWith('.html')) htmls.push(path.join(dir, f));
  }
  for (const f of htmls) {
    const txt = await fs.readFile(f, 'utf8');
    for (const tag of txt.match(/<img[^>]*>/gi) || []) {
      const src = tag.match(/src\s*=\s*["']([^"']+)["']/i)?.[1];
      const alt = tag.match(/alt\s*=\s*["']([^"']*)["']/i)?.[1];
      if (!src || !alt?.trim()) continue;
      const base = path.basename(src.split('?')[0]);
      if (!altDesdeHtml.has(base)) altDesdeHtml.set(base, alt.trim());
    }
  }
  console.log(`  alt recuperados del HTML: ${altDesdeHtml.size}`);

  // ---- 1. Imagenes del CMS -------------------------------------------------
  // Se recogen TODAS las referencias antes de tocar la red, y una misma URL se
  // funde en una sola tarea. Antes se encolaba una tarea por referencia y ganaba
  // la que llegaba primero: como 55 URLs estan referenciadas dos o mas veces y en
  // 42 de ellas una columna trae alt y la otra no, el alt de esas 42 salia a cara
  // o cruz en cada ejecucion. Dos ejecuciones identicas daban manifests
  // distintos, y el manifest es lo que llevara el alt a Sanity.
  const ficheros = await fs.readdir(path.join(EXPORT, 'CMS'));
  const refs = new Map();

  const anotar = (r) => {
    const prev = refs.get(r.url);
    if (!prev) { refs.set(r.url, { ...r, usedIn: r.usedIn ? [r.usedIn] : [] }); return; }
    if (r.usedIn) prev.usedIn.push(r.usedIn);
    if (rango(r) < rango(prev))
      Object.assign(prev, { dir: r.dir, rol: r.rol, alt: r.alt, subject: r.subject });
  };

  for (const col of COLECCIONES) {
    const f = ficheros.find((x) => x.includes(col.csv));
    if (!f) { console.warn(`  !! sin CSV para ${col.csv}`); continue; }
    const filas = parseCSV(await fs.readFile(path.join(EXPORT, 'CMS', f), 'utf8'));

    for (const fila of filas) {
      const slug = fila.Slug || slugify(fila.Name || '');
      const subject = { type: col.tipo, slug, name: fila.Name || '' };
      const dir = path.join('content', col.dir, slug);

      for (const campo of col.campos) {
        const raw = fila[campo.col];
        if (!raw) continue;

        if (campo.richtext) {
          // <img alt="..." src="..."> — el alt vive en la propia etiqueta
          const tags = raw.match(/<img[^>]*>/gi) || [];
          tags.forEach((tag, i) => {
            const src = tag.match(/src\s*=\s*["']([^"']+)["']/i)?.[1];
            if (!src || !/^https?:/.test(src)) return;
            const alt = tag.match(/alt\s*=\s*["']([^"']*)["']/i)?.[1] || null;
            anotar({
              url: src, dir, rol: campo.rol, alt, subject,
              usedIn: col.ruta ? { route: `${col.ruta}/${slug}`, field: campo.col, order: i } : null,
            });
          });
          continue;
        }

        const urls = raw.match(RX_URL) || [];
        urls.forEach((url, i) => {
          anotar({
            url, dir, rol: campo.rol,
            alt: campo.alt ? fila[campo.alt] || null : null,
            subject,
            usedIn: col.ruta ? { route: `${col.ruta}/${slug}`, field: campo.col, order: i } : null,
          });
        });
      }
    }
  }

  // Orden fijo por URL: si mas adelante dos URLs distintas resultan tener los
  // MISMOS bytes, la que se queda con el nombre del archivo deja de depender de
  // cual respondio antes.
  const tareas = [...refs.values()]
    .sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0))
    .map((r) => () => registrar(r));

  console.log(`  ${refs.size} imagenes unicas referenciadas en el CMS -> descargando...`);
  await enCola(tareas);

  // ---- 1b. Imagenes que referencia el CSS ----------------------------------
  // El CSS se copia verbatim, asi que sus url() son rutas FIJAS: lo que apunta a
  // ../images/ tiene que existir en public/images/ si o si. Da igual que la
  // imagen parezca "contenido": si el CSS la pinta de fondo, es asset de diseno.
  // Sin esto, tres fondos de hero se quedan en negro.
  const cssRefs = new Set();
  const cssAbsolutas = new Set();
  for (const f of ['normalize.css', 'webflow.css', 'pergola-plus-florida.webflow.css']) {
    const css = await fs.readFile(path.join(EXPORT, 'css', f), 'utf8');
    for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
      const u = m[1].trim();
      if (u.startsWith('data:')) continue;
      if (/^https?:/.test(u)) cssAbsolutas.add(u);
      else cssRefs.add(path.basename(u));
    }
  }
  console.log(`  el CSS referencia ${cssRefs.size} imagenes locales y ${cssAbsolutas.size} absolutas`);

  // ---- 2. Imagenes locales de images/ --------------------------------------
  // Diseno (SVG + favicon/webclip) va PLANO a public/images/: el HTML las
  // referencia por ruta fija (/images/X.svg), asi que reorganizarlas en
  // subcarpetas romperia los enlaces sin ganar nada. La clasificacion se
  // guarda en el manifest como metadato, sin mover archivos.
  const DISENO_UI = new Set(['Arrow-faq.svg', 'Check-List-pergola.svg', 'schedule.svg', 'favicon.png', 'webclip.png']);
  const DISENO_SOCIAL = new Set(['Facebook.svg', 'Instagram.svg', 'Tiktok.svg', 'Youtube.svg', 'email.svg', 'phone.svg', 'phone_1.svg', 'location.svg']);
  const DISENO_LOGOS = new Set(['Logo-White.svg', 'bbb.svg']);

  const locales = await fs.readdir(path.join(EXPORT, 'images'));
  let disenoN = 0;
  for (const nombre of locales) {
    if (nombre.startsWith('.')) continue;
    const buf = await fs.readFile(path.join(EXPORT, 'images', nombre));
    // Una imagen que el CSS pinta de fondo es diseno aunque sea una foto.
    const esFondoCss = cssRefs.has(nombre);
    const esDiseno = nombre.endsWith('.svg') || DISENO_UI.has(nombre) || esFondoCss;

    if (esDiseno) {
      const grupo = esFondoCss ? 'css-background'
        : DISENO_SOCIAL.has(nombre) ? 'social'
        : DISENO_LOGOS.has(nombre) ? 'logos'
        : DISENO_UI.has(nombre) ? 'ui' : 'icons';
      await fs.mkdir(path.join(OUT, 'design'), { recursive: true });
      await fs.writeFile(path.join(OUT, 'design', nombre), buf);   // PLANO
      const fmt = formatoReal(buf) || path.extname(nombre).slice(1);
      const { width, height } = dimensiones(buf, fmt);
      porSha.set('local:' + nombre, {
        file: path.join('design', nombre), sha256: createHash('sha256').update(buf).digest('hex'),
        bytes: buf.length, format: fmt, width, height,
        role: grupo === 'icons' ? 'icon' : grupo === 'logos' ? 'brand-logo'
          : grupo === 'css-background' ? 'background' : grupo,
        assetClass: 'design', designGroup: grupo,
        subject: { type: 'site', slug: 'site', name: 'Pergola Plus Florida' },
        alt: altDesdeHtml.get(nombre) || null,
        sourceUrls: [`local:images/${nombre}`], usedIn: [],
        publicPath: `/images/${nombre}`,
      });
      disenoN++;
      continue;
    }

    if (RX_VARIANTE.test(nombre)) { variantesDescartadas++; continue; }
    await registrar({
      url: `local:images/${nombre}`, buf, dir: path.join('content', 'site'),
      rol: 'site',
      alt: altDesdeHtml.get(nombre) || null,   // alt largo del HTML original
      subject: { type: 'site', slug: 'site', name: 'Pergola Plus Florida' },
      usedIn: [],
    });
  }

  // ---- 2b. Assets absolutos del CSS (CDN de Webflow) -----------------------
  // pergola-plus-florida.webflow.css apunta al checkmark de las casillas
  // personalizadas en cloudfront. Es la UNICA dependencia externa del CSS y la
  // usan las 6 casillas del formulario de presupuesto. Se baja aqui; el parche
  // del url() lo aplica scripts/parchear-css.mjs.
  for (const url of cssAbsolutas) {
    const nombre = path.basename(url.split('?')[0]);
    try {
      const buf = await bajar(url); descargadas++;
      const fmt = formatoReal(buf);
      if (!fmt || fmt === 'HTML') { errores.push({ url, error: `no es imagen (${fmt})` }); continue; }
      await fs.mkdir(path.join(OUT, 'design'), { recursive: true });
      await fs.writeFile(path.join(OUT, 'design', nombre), buf);
      const { width, height } = dimensiones(buf, fmt);
      porSha.set('css:' + nombre, {
        file: path.join('design', nombre), sha256: createHash('sha256').update(buf).digest('hex'),
        bytes: buf.length, format: fmt, width, height,
        role: 'ui', assetClass: 'design', designGroup: 'css-absoluta',
        subject: { type: 'site', slug: 'site', name: 'Pergola Plus Florida' },
        alt: null, sourceUrls: [url], usedIn: [],
        publicPath: `/images/${nombre}`,
      });
      disenoN++;
    } catch (err) { errores.push({ url, error: String(err.message || err) }); }
  }

  // ---- 3. Manifest ---------------------------------------------------------
  const entradas = [...porSha.values()].map((e) => {
    const assetClass = e.assetClass || 'content';
    // Alt de respaldo para lo que el origen no trae (galerias, logos, folletos).
    // `alt` se queda como esta: la Fase 1 debe reproducir el original tal cual.
    const orden = e.usedIn?.[0]?.order;
    const altDerivado = e.alt ? null : derivarAlt(e.role, e.subject, orden);
    return { ...e, assetClass, altDerivado, altGenerado: !e.alt && !!altDerivado };
  }).sort((a, b) => a.file.localeCompare(b.file));

  const manifest = {
    generado: new Date().toISOString(),
    origen: EXPORT,
    resumen: {
      total: entradas.length,
      contenido: entradas.filter((e) => e.assetClass === 'content').length,
      diseno: entradas.filter((e) => e.assetClass === 'design').length,
      descargadas, cacheadas, variantesDescartadas,
      errores: errores.length,
      altOriginal: entradas.filter((e) => e.assetClass === 'content' && e.alt).length,
      altDerivado: entradas.filter((e) => e.altGenerado).length,
      sinNingunAlt: entradas.filter((e) => e.assetClass === 'content' && !e.alt && !e.altDerivado).length,
    },
    errors: errores,
    assets: entradas,
  };
  await fs.mkdir(OUT, { recursive: true });
  await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const r = manifest.resumen;
  console.log(`
  imagenes unicas    ${r.total}   (contenido ${r.contenido} · diseno ${r.diseno})
  descargadas        ${r.descargadas}
  ya en cache        ${r.cacheadas}
  variantes -p-NNN   ${r.variantesDescartadas} descartadas
  alt del origen     ${r.altOriginal}
  alt derivado       ${r.altDerivado}   (el origen no lo trae; se usa solo en Sanity)
  sin ningun alt     ${r.sinNingunAlt}
  ERRORES            ${r.errores}`);

  if (errores.length) {
    console.log('\n  --- ERRORES ---');
    for (const e of errores.slice(0, 40)) console.log(`   ${e.error}  ${e.url}`);
    if (errores.length > 40) console.log(`   ... y ${errores.length - 40} mas`);
  }
  console.log(`\n  manifest -> ${path.join(OUT, 'manifest.json')}`);
  if (errores.length) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
