#!/usr/bin/env node
/**
 * Trae las resenas de Google Business Profile y reescribe el snapshot local.
 *
 *     node scripts/traer-resenas.mjs
 *
 * Escribe `src/data/reviews-google.json`, que es lo que lee `src/lib/reviews.ts`
 * y de ahi el carrusel. NO se ejecuta en el build: se corre a mano (o desde un
 * cron) y el resultado se comitea.
 *
 * POR QUE NO EN EL BUILD. Si el fetch viviera dentro del build de Vercel, una
 * caida de Google o un refresh token caducado tumbaria el despliegue entero. Con
 * el snapshot, lo peor que pasa es que las resenas sean de ayer. Es el mismo
 * criterio que ya usa el repo con `bajar-fuentes.mjs` y con las imagenes: el
 * despliegue no depende de que un tercero conteste.
 *
 * POR QUE GBP Y NO LA PLACES API
 *
 *   Places API              Business Profile API
 *   ----------              --------------------
 *   maximo 5 resenas        todas
 *   prohibido cachear su    son contenido del propio negocio: el snapshot no
 *   contenido (solo el      choca con la restriccion de cache de Maps Platform
 *   place_id esta exento)
 *   sin respuesta del       trae `reviewReply`
 *   dueno
 *   SKU Enterprise +        cuota gratuita del perfil propio
 *   Atmosphere
 *
 * Un `reviews-google.json` comiteado con contenido de Places seria justo el
 * patron que su politica prohibe. Con GBP no.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * QUE HACE FALTA ANTES DE QUE ESTO FUNCIONE  (nada de esto lo puede hacer el
 * codigo: son pasos en la consola de Google con la cuenta DUENA del perfil)
 *
 *   1. Habilitar en Google Cloud, en el mismo proyecto:
 *        - My Business Account Management API
 *        - My Business Business Information API
 *        - Google My Business API   (es la que sirve `reviews`; hay que pedir
 *                                    acceso en el formulario de GBP APIs)
 *   2. Crear credenciales OAuth 2.0 de tipo «Aplicacion de escritorio».
 *   3. Autorizar una vez con el scope `https://www.googleapis.com/auth/business.manage`
 *      y guardar el refresh token.
 *   4. Poner en `.env` (esta en .gitignore):
 *
 *        GBP_CLIENT_ID=...
 *        GBP_CLIENT_SECRET=...
 *        GBP_REFRESH_TOKEN=...
 *        GBP_ACCOUNT=accounts/123456789012345678901
 *        GBP_LOCATION=locations/12345678901234567890
 *
 *      `GBP_ACCOUNT` y `GBP_LOCATION` salen de `accounts.list` y
 *      `accounts.locations.list`; si no estan, este script los lista y termina,
 *      para no obligar a buscarlos a mano.
 *
 * ESTE SCRIPT NO SE HA PODIDO EJECUTAR TODAVIA: el perfil no esta aprovisionado.
 * Esta escrito contra la forma documentada de la API y falla RUIDOSAMENTE en cada
 * paso en vez de escribir un JSON a medias. Si la respuesta no encaja, lo dice y
 * no toca el fichero.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const SALIDA = path.join(RAIZ, 'src/data/reviews-google.json');

// `.env` a mano: el repo no trae dotenv y no merece la pena una dependencia para
// cinco variables que solo lee este script.
for (const linea of (await fs.readFile(path.join(RAIZ, '.env'), 'utf8').catch(() => '')).split('\n')) {
  const m = linea.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const { GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN, GBP_ACCOUNT, GBP_LOCATION } = process.env;

const faltan = Object.entries({ GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN })
  .filter(([, v]) => !v).map(([k]) => k);
if (faltan.length) {
  console.error(`  FALTA en .env: ${faltan.join(', ')}`);
  console.error('  Ver la cabecera de este fichero: son 4 pasos en la consola de Google.');
  process.exit(1);
}

/** Access token a partir del refresh token. Dura una hora; no se guarda. */
async function token() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GBP_CLIENT_ID,
      client_secret: GBP_CLIENT_SECRET,
      refresh_token: GBP_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`OAuth ${r.status}: ${j.error_description ?? j.error ?? '?'}`);
  return j.access_token;
}

const acceso = await token();
const pedir = async (url) => {
  const r = await fetch(url, { headers: { authorization: `Bearer ${acceso}` } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status} ${url}\n  ${JSON.stringify(j).slice(0, 400)}`);
  return j;
};

// --- Si no sabemos cuenta/ubicacion, se listan y se sale ---------------------
// Mejor que fallar con «404 not found» y dejar al siguiente buscando en la
// documentacion cual era el formato del id.
if (!GBP_ACCOUNT || !GBP_LOCATION) {
  console.log('Faltan GBP_ACCOUNT y/o GBP_LOCATION. Esto es lo que ve esta cuenta:\n');
  const cuentas = await pedir('https://mybusinessaccountmanagement.googleapis.com/v1/accounts');
  for (const c of cuentas.accounts ?? []) {
    console.log(`  GBP_ACCOUNT=${c.name}   ${c.accountName ?? ''}`);
    const locs = await pedir(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${c.name}/locations`
      + '?readMask=name,title&pageSize=100',
    ).catch((e) => ({ _error: e.message }));
    for (const l of locs.locations ?? []) console.log(`     GBP_LOCATION=${l.name}   ${l.title ?? ''}`);
    if (locs._error) console.log(`     !! ${locs._error}`);
  }
  console.log('\nPon las dos en .env y vuelve a ejecutar.');
  process.exit(1);
}

// --- Resenas, paginadas ------------------------------------------------------
const crudas = [];
let pageToken = '';
do {
  const url = `https://mybusiness.googleapis.com/v4/${GBP_ACCOUNT}/${GBP_LOCATION}/reviews`
    + `?pageSize=50${pageToken ? `&pageToken=${pageToken}` : ''}`;
  const j = await pedir(url);
  crudas.push(...(j.reviews ?? []));
  pageToken = j.nextPageToken ?? '';
} while (pageToken);

const ESTRELLAS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

/**
 * Idioma de la resena.
 *
 * GBP no devuelve el idioma. Se detecta con la MISMA heuristica de palabras
 * funcionales que usa `comprobar-i18n.mjs`, y por una razon concreta: el valor de
 * este campo decide si `check:i18n` cuenta esa resena como «sin traducir» en
 * /es/. Que las dos partes usen el mismo criterio evita que una resena espanola
 * se etiquete `en` y desaparezca del recuento, o al reves.
 *
 * Si no hay senal clara se deja 'en', que es el idioma del sitio original.
 */
const ES = /\b(el|la|los|las|un|una|de|que|con|para|por|más|muy|nos|nuestro|pero|todo|está|fue)\b/i;
const EN = /\b(the|and|with|your|our|for|from|that|this|are|will|have|which|you)\b/i;
const idiomaDe = (t) => {
  const es = (t.match(new RegExp(ES, 'gi')) ?? []).length;
  const en = (t.match(new RegExp(EN, 'gi')) ?? []).length;
  return es > en ? 'es' : 'en';
};

// Se descartan las resenas SIN TEXTO (solo estrellas). No es filtrar opiniones:
// una tarjeta con nombre, cinco estrellas y el cuerpo vacio no dice nada y ademas
// deja un hueco en el carrusel. Se cuentan aparte y se informa.
const sinTexto = crudas.filter((r) => !r.comment?.trim()).length;

/**
 * A donde apunta «leer esta resena en Google».
 *
 * LA API DE GBP NO DEVUELVE UN PERMALINK POR RESENA. Lo he comprobado: `review.name`
 * es `accounts/{a}/locations/{l}/reviews/{id}`, un identificador interno, no una
 * URL publica. Asi que el enlace lleva a la LISTA de resenas de la ficha, que es
 * la unica direccion publica y estable que existe — y ahi estan todas, incluida
 * esa.
 *
 * Inventarse un permalink que parezca funcionar y lleve a otro sitio seria peor
 * que esto: el visitante hace clic justamente para comprobar que la resena es
 * real.
 *
 * `GBP_PLACE_ID` es opcional. Sin el no hay enlace y el componente simplemente no
 * lo pinta; el place_id es ademas el UNICO dato de Google que se puede almacenar
 * indefinidamente segun su politica.
 */
const fichaResenas = process.env.GBP_PLACE_ID
  ? `https://search.google.com/local/reviews?placeid=${encodeURIComponent(process.env.GBP_PLACE_ID)}`
  : '';
if (!fichaResenas) {
  console.log('  AVISO  GBP_PLACE_ID no esta en .env: las resenas iran sin enlace a Google.');
}

const resenas = crudas
  .filter((r) => r.comment?.trim())
  .map((r) => ({
    id: r.reviewId ?? r.name?.split('/').pop(),
    autor: r.reviewer?.displayName ?? 'Google user',
    rating: ESTRELLAS[r.starRating] ?? 0,
    fechaISO: r.createTime,
    texto: r.comment.trim(),
    idioma: idiomaDe(r.comment),
    'respuestaDueño': r.reviewReply?.comment?.trim() ?? null,
    urlOrigen: fichaResenas,
  }))
  .filter((r) => {
    const ok = r.id && r.rating && r.fechaISO;
    if (!ok) console.error(`  !! resena descartada por venir incompleta: ${JSON.stringify(r).slice(0, 120)}`);
    return ok;
  });

if (!resenas.length) {
  console.error('  La API contesto pero no hay ni una resena con texto. NO se toca el snapshot.');
  process.exit(1);
}

const anterior = JSON.parse(await fs.readFile(SALIDA, 'utf8'));
await fs.writeFile(SALIDA, JSON.stringify({
  ...anterior,
  actualizado: new Date().toISOString(),
  perfil: { ...anterior.perfil, url: fichaResenas || anterior.perfil?.url || null },
  resenas,
}, null, 2) + '\n');

const media = resenas.reduce((s, r) => s + r.rating, 0) / resenas.length;
console.log(`  ${resenas.length} resenas con texto  (media ${media.toFixed(2)})`);
if (sinTexto) console.log(`  ${sinTexto} solo con estrellas, sin texto: no entran en el carrusel`);
console.log(`  idiomas: ${JSON.stringify(resenas.reduce((a, r) => ({ ...a, [r.idioma]: (a[r.idioma] ?? 0) + 1 }), {}))}`);
console.log(`  -> ${path.relative(RAIZ, SALIDA)}`);
console.log('\n  Ahora: npm run build && npm run check');
