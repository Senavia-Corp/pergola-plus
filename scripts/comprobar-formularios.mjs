#!/usr/bin/env node
/**
 * Puerta del circuito de leads. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:formularios
 *
 * QUE ESTABA ROTO
 *
 * Los 3 formularios llegaron de Webflow con `method="get"` y sin `action`: se
 * rellenaban, la pagina recargaba con los datos en la URL y no los recibia nadie.
 * En las 107 paginas, porque el del pie va en todas. Y el de presupuesto traia
 * ademas tres campos distintos —producto, presupuesto y plazo— con el MISMO name e
 * id, mas la casilla de consentimiento compartiendo nombre con una de mejoras: con
 * method=get daba igual, en un POST de verdad se pisan.
 *
 * COMO SE COMPRUEBA
 *
 * En dos mitades, porque son dos fallos distintos:
 *
 *   1. Estatico sobre el HTML servido: que los 3 formularios apunten al endpoint,
 *      que ninguno conserve method="get", que lleven los campos ocultos y la
 *      trampa, y que no queden name/id duplicados dentro de un mismo formulario.
 *   2. De verdad, con `astro preview` levantado y `fetch`: un envio valido escribe
 *      un lead, un requerido ausente da 400, un email invalido da 400, la trampa
 *      descarta en silencio y un GET da 405.
 *
 * La primera mitad sola no vale: un formulario puede apuntar al endpoint y el
 * endpoint aceptar basura. La segunda sola tampoco: el endpoint puede estar
 * perfecto y el formulario seguir sin `action`.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { raizHtml } from './lib/dist.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = await raizHtml();
const LEADS = path.join(RAIZ, '.leads/leads.ndjson');
const PUERTO = 4331; // fuera del 4321 de dev y del 4330 del panel del navegador

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 8)) console.log(`         ${d}`);
    if (detalle.length > 8) console.log(`         ... y ${detalle.length - 8} mas`);
  }
};

// ---------------------------------------------------------------------------
// 1 · Estatico sobre el HTML servido
// ---------------------------------------------------------------------------

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));

/** Los 3 formularios, con la pagina donde vive cada uno. */
const ESPERADOS = [
  { id: 'email-form', origen: 'quote', pagina: 'contact-us/get-a-quote/index.html' },
  { id: 'wf-form-Contact-Page-Form', origen: 'contact', pagina: 'contact-us/get-in-touch/index.html' },
  { id: 'wf-form-Footer-Form', origen: 'footer', pagina: 'index.html' },
];

const conGet = [];
const sinAction = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  for (const [, attrs] of html.matchAll(/<form\s([^>]*)>/g)) {
    if (/\bmethod="get"/i.test(attrs)) conGet.push(`${rel}: ${attrs.slice(0, 70)}`);
    if (!/\baction="/.test(attrs)) sinAction.push(`${rel}: ${attrs.slice(0, 70)}`);
  }
}
decir(conGet.length === 0, 'ningun formulario conserva method="get"', conGet);

// data-turnstile-sitekey en el markup hace que webflow.js cargue Turnstile y deje
// TODOS los formularios de la pagina en "enviando", con el submit deshabilitado,
// esperando un widget que este sitio no renderiza. Medido en
// /contact-us/get-a-quote: los dos formularios de la pagina, muertos desde la carga.
// El sitekey vive en .env.example, que es donde va una clave de configuracion.
const conSitekey = htmls.filter((rel) => false); // se rellena abajo
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (html.includes('data-turnstile-sitekey')) conSitekey.push(rel);
}
decir(
  conSitekey.length === 0,
  'ninguna pagina lleva data-turnstile-sitekey en el markup',
  conSitekey,
);
// El estimador es una calculadora: su <form> no envia nada y su submit lo corta un
// preventDefault. Sin `action` un Enter haria un GET a la propia pagina y se
// perderia lo escrito, asi que se exige el manejador en vez del action.
const soloCalculadora = (s) => /id="est-form"/.test(s);
decir(
  sinAction.filter((s) => !soloCalculadora(s)).length === 0,
  'ningun formulario que envie se queda sin action',
  sinAction.filter((s) => !soloCalculadora(s)),
);
decir(
  await llevaCodigo('project-estimator/index.html', 'est-form'),
  'el formulario del estimador corta su propio submit (preventDefault)',
);

for (const { id, origen, pagina } of ESPERADOS) {
  const html = await fs.readFile(path.join(DIST, pagina), 'utf8');
  // Por atributo y no por posicion: el orden dentro de <form ...> cambia en cuanto
  // el transformador anade algo delante, y buscar `<form id="..."` daba un falso
  // "no esta" con el formulario perfectamente en su sitio.
  const abre = new RegExp(`<form\\s[^>]*\\bid="${id}"`).exec(html);
  if (!abre) { decir(false, `${id}: no esta en ${pagina}`); continue; }
  const form = html.slice(abre.index, html.indexOf('</form>', abre.index));

  decir(/action="\/api\/lead"/.test(form), `${id} postea a /api/lead`);
  decir(/\bmethod="post"/.test(form), `${id} usa POST`);
  decir(
    new RegExp(`name="formulario" value="${origen}"`).test(form),
    `${id} declara su origen (${origen})`,
  );
  for (const oculto of ['pagina', 't', 'js']) {
    decir(new RegExp(`name="${oculto}"`).test(form), `${id} lleva el campo oculto "${oculto}"`);
  }
  decir(/class="pp-trampa"/.test(form) && /name="website"/.test(form), `${id} lleva la trampa`);

  decir(/data-wf-no-turnstile/.test(form), `${id} apaga el Turnstile de webflow.js`);

  // Duplicados DENTRO del formulario. Es el bug que traia el de presupuesto: con
  // id repetido se rompe el <label for> y en un POST los valores se pisan.
  for (const attr of ['id', 'name']) {
    const vistos = new Map();
    for (const [, v] of form.matchAll(new RegExp(`(?<!data-)\\b${attr}="([^"]+)"`, 'g'))) {
      vistos.set(v, (vistos.get(v) ?? 0) + 1);
    }
    // Las casillas de un grupo y los radios comparten `name` a proposito.
    const grupos = new Set(['Type']);
    const repes = [...vistos].filter(([v, n]) => n > 1 && !(attr === 'name' && grupos.has(v)));
    decir(repes.length === 0, `${id} no repite ${attr} dentro del formulario`,
      repes.map(([v, n]) => `${attr}="${v}" x${n}`));
  }
}

// El endpoint tiene que salir como FUNCION, no como pagina prerenderizada. Si
// alguien quita el `export const prerender = false`, /api/lead se convierte en un
// HTML estatico y un POST contra el devuelve 405 del CDN: los formularios dejarian
// de enviar y ninguna otra puerta lo notaria.
//
// El adaptador de Vercel no escribe en dist/server sino en .vercel/output: la
// primera version de esta comprobacion miraba dist/server y fallaba con el endpoint
// perfectamente construido.
const funciones = path.join(RAIZ, '.vercel/output/_functions/chunks');
const chunks = await fs.readdir(funciones).catch(() => []);
decir(
  chunks.some((f) => /^lead[._-]/.test(f)),
  'el endpoint se empaqueta como funcion de servidor (.vercel/output/_functions)',
  chunks.length ? [`hay ${chunks.length} chunks y ninguno es lead*`] : ['no hay chunks: falta el adaptador?'],
);
decir(
  !(await fs.stat(path.join(DIST, 'api/lead/index.html')).then(() => true).catch(() => false)),
  '/api/lead NO se ha prerenderizado como pagina',
);

// ---------------------------------------------------------------------------
// 2 · El circuito, de verdad
// ---------------------------------------------------------------------------

// El aviso de entrega tiene que seguir estando. Es lo unico que separa «los leads
// llegan» de «los leads se pierden en un log que nadie mira», y ese fallo no da
// error: los formularios responden 303 y el visitante ve "gracias" igual.
const config = await fs.readFile(path.join(RAIZ, 'astro.config.mjs'), 'utf8');
decir(
  /LEAD_WEBHOOK_URL/.test(config) && /\[leads\]/.test(config),
  'el build avisa si no hay a donde entregar los leads',
);

const antes = await fs.readFile(LEADS, 'utf8').then((s) => s.split('\n').filter(Boolean).length).catch(() => 0);

// `astro dev` y no `astro preview` por dos razones, las dos medidas:
//
//   1. El adaptador de Vercel NO trae servidor de preview: `astro preview` muere
//      con "Preview server process exited before becoming ready". El endpoint solo
//      se puede ejecutar en local con el servidor de desarrollo, que corre el MISMO
//      src/pages/api/lead.ts. Lo que cambia es el empaquetado, y de eso se ocupa la
//      comprobacion estatica de arriba.
//   2. Astro 7 tiene el dev server SINGLETON: si ya hay uno, `astro dev --port otro`
//      no levanta nada, informa de donde esta el que hay y termina. Una puerta que
//      diera eso por bueno se quedaria colgada esperando en un puerto vacio, asi que
//      primero se pregunta y solo se arranca si no hay ninguno.
let servidor = null;
let base = await servidorEnMarcha();

if (base) {
  console.log(`  ---   reutilizando el servidor de desarrollo de ${base}`);
} else {
  servidor = spawn('npx', ['astro', 'dev', '--port', String(PUERTO)], {
    cwd: RAIZ, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env },
  });
  base = `http://localhost:${PUERTO}`;
}

const matar = () => {
  // Solo se mata el que ha arrancado esta puerta: cargarse el que ya estaba seria
  // apagarle el servidor a quien lo estuviera usando.
  if (servidor) { try { servidor.kill('SIGTERM'); } catch { /* ya estaba muerto */ } }
};
process.on('exit', matar);

if (!await esperarServidor(`${base}/api/lead`)) {
  decir(false, `no hay servidor que responda en ${base}`);
  matar();
  process.exit(1);
}

/**
 * Envia como lo haria un NAVEGADOR, con su cabecera Origin.
 *
 * Hace falta porque Astro trae proteccion CSRF de serie: un POST cuyo Origin no
 * coincide con el sitio recibe "403 Cross-site POST form submissions are forbidden"
 * antes de llegar al endpoint. La primera version de esta puerta no mandaba Origin y
 * sacaba 403 en todo, con el endpoint perfectamente bien.
 *
 * Es una proteccion que queremos: se comprueba aparte, mas abajo.
 */
const enviar = (cuerpo, cabeceras = {}) =>
  fetch(`${base}/api/lead`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: base,
      ...cabeceras,
    },
    body: new URLSearchParams(cuerpo),
    redirect: 'manual',
  });

const VALIDO = {
  formulario: 'contact', pagina: '/contact-us/get-in-touch',
  'First-Name': 'Puerta', 'Last-Name': 'Automatica',
  Email: 'puerta@example.com', 'Phone-Number': '561-710-8363',
  'Project-Type': 'Residential', 'SMS-Consent': 'on',
  Message: 'Lead de prueba de check:formularios.',
};

// a) Envio valido SIN JavaScript -> 303 a /thank-you
const r1 = await enviar(VALIDO);
decir(r1.status === 303, `envio valido sin JS -> 303 (dio ${r1.status})`);
decir(
  (r1.headers.get('location') ?? '').startsWith('/thank-you'),
  `redirige a /thank-you (dio "${r1.headers.get('location')}")`,
);

// b) ...y deja el lead escrito
const despues = await fs.readFile(LEADS, 'utf8').then((s) => s.split('\n').filter(Boolean).length).catch(() => 0);
decir(despues === antes + 1, `el lead queda registrado (${antes} -> ${despues})`);
if (despues > antes) {
  const ultimo = JSON.parse((await fs.readFile(LEADS, 'utf8')).trim().split('\n').pop());
  decir(ultimo.campos.Email === VALIDO.Email, 'el lead guarda el email que se envio');
  decir(ultimo.formulario === 'contact', 'el lead guarda su formulario de origen');
  decir(ultimo.verificado === false, 'sin TURNSTILE_SECRET_KEY el lead va marcado verificado:false');
}

// a2) El mismo envio desde /es/ aterriza en /es/thank-you.
//
// Quien rellena un formulario en español y cae en una pagina de gracias en ingles se
// queda sin saber que pasa despues, justo despues de dar sus datos. Lo decide
// `pagina`, no una cabecera del navegador: es el unico dato que dice de que version
// del sitio salio el envio.
const r1es = await enviar({ ...VALIDO, pagina: '/es/contact-us/get-in-touch', Email: 'puerta.es@example.com' });
decir(
  (r1es.headers.get('location') ?? '').startsWith('/es/thank-you'),
  `un envio desde /es/ redirige a /es/thank-you (dio "${r1es.headers.get('location')}")`,
);

// c) Con JavaScript -> 200 y JSON
const r2 = await enviar({ ...VALIDO, js: '1', Email: 'puerta2@example.com' });
decir(r2.status === 200, `envio valido con JS -> 200 (dio ${r2.status})`);
decir((await r2.json()).ok === true, 'responde {ok:true}');

// d) Requerido ausente -> 400 con el campo senalado
const sinNombre = { ...VALIDO, js: '1' };
delete sinNombre['First-Name'];
const r3 = await enviar(sinNombre);
decir(r3.status === 400, `requerido ausente -> 400 (dio ${r3.status})`);
decir(!!(await r3.json()).errores?.['First-Name'], 'el 400 dice QUE campo falta');

// e) Email invalido -> 400
const r4 = await enviar({ ...VALIDO, js: '1', Email: 'esto-no-es-un-email' });
decir(r4.status === 400, `email invalido -> 400 (dio ${r4.status})`);
decir(!!(await r4.json()).errores?.Email, 'el 400 senala el email');

// f) La trampa descarta EN SILENCIO: se responde como un envio bueno para no
//    ensenarle al bot que ha sido descubierto.
const antesTrampa = await cuentaLeads();
const r5 = await enviar({ ...VALIDO, website: 'https://spam.example' });
decir(r5.status === 303, `trampa rellena -> responde 303 como si nada (dio ${r5.status})`);
decir(await cuentaLeads() === antesTrampa, 'y NO registra el lead');

// g) Timestamp demasiado reciente -> descartado igual
const antesRapido = await cuentaLeads();
const r6 = await enviar({ ...VALIDO, t: String(Date.now()) });
decir(r6.status === 303, `enviado en menos de 2s -> 303 (dio ${r6.status})`);
decir(await cuentaLeads() === antesRapido, 'y tampoco registra el lead');

// h) GET -> 405
const r7 = await fetch(`${base}/api/lead`);
decir(r7.status === 405, `GET a /api/lead -> 405 (dio ${r7.status})`);

// h2) CSRF: un POST desde otro origen se rechaza ANTES de llegar al endpoint. Lo
//     hace Astro de serie (security.checkOrigin) y se comprueba aqui para que nadie
//     lo desactive sin darse cuenta: sin esto, cualquier pagina de internet puede
//     hacer que el navegador de un visitante mande leads con su sesion.
const antesCsrf = await cuentaLeads();
const rCsrf = await fetch(`${base}/api/lead`, {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded', origin: 'https://malicioso.example' },
  body: new URLSearchParams(VALIDO),
  redirect: 'manual',
});
decir(rCsrf.status === 403, `POST desde otro origen -> 403 (dio ${rCsrf.status})`);
decir(await cuentaLeads() === antesCsrf, 'y no registra el lead');

// i) Formulario desconocido -> 400. Es la lista blanca: sin ella, cualquiera puede
//    inventarse un origen y colarlo en el registro de leads.
const r8 = await enviar({ ...VALIDO, js: '1', formulario: 'inventado' });
decir(r8.status === 400, `formulario desconocido -> 400 (dio ${r8.status})`);

// j) JSON tambien vale
const r9 = await fetch(`${base}/api/lead`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ ...VALIDO, js: '1', Email: 'json@example.com' }),
});
decir(r9.status === 200, `POST en JSON -> 200 (dio ${r9.status})`);

// k) Tope de longitud: un mensaje enorme se recorta, no tumba nada.
const r10 = await enviar({ ...VALIDO, js: '1', Message: 'x'.repeat(9000) });
decir(r10.status === 200, `mensaje de 9000 caracteres -> 200 (dio ${r10.status})`);
const ultimo = JSON.parse((await fs.readFile(LEADS, 'utf8')).trim().split('\n').pop());
decir(ultimo.campos.Message.length === 4000, `y se recorta a 4000 (quedo ${ultimo.campos.Message.length})`);

matar();

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log('\n  Todo en verde.');

// --- ayudas -----------------------------------------------------------------

/**
 * Comprueba que el codigo de una pagina contiene una marca, mirando tanto el
 * modulo INLINE como los `<script src>`. Astro decide solo cual de los dos usa
 * segun el tamano del script, asi que hay que aceptar los dos: mirar solo el HTML
 * daba un falso negativo con el manejador perfectamente puesto.
 */
async function llevaCodigo(pagina, marca) {
  const html = await fs.readFile(path.join(DIST, pagina), 'utf8');
  const inline = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)];
  if (inline.some((m) => m[1].includes(marca) && m[1].includes('preventDefault'))) return true;
  for (const [, src] of html.matchAll(/<script type="module" src="([^"]+)"/g)) {
    const js = await fs.readFile(path.join(DIST, src.replace(/^\//, '')), 'utf8').catch(() => '');
    if (js.includes(marca) && js.includes('preventDefault')) return true;
  }
  return false;
}

async function cuentaLeads() {
  return fs.readFile(LEADS, 'utf8').then((s) => s.split('\n').filter(Boolean).length).catch(() => 0);
}

/**
 * URL del servidor de desarrollo que ya este en marcha, o null.
 *
 * Se le pregunta a Astro en vez de sondear puertos a mano: `astro dev status`
 * escribe una linea JSON con la URL cuando hay uno.
 */
async function servidorEnMarcha() {
  return new Promise((resolver) => {
    const p = spawn('npx', ['astro', 'dev', 'status'], { cwd: RAIZ, stdio: ['ignore', 'pipe', 'pipe'] });
    let salida = '';
    p.stdout.on('data', (d) => { salida += d; });
    p.stderr.on('data', (d) => { salida += d; });
    p.on('close', () => resolver(salida.match(/running at (http:\/\/\S+?)[\s"),]/)?.[1] ?? null));
    p.on('error', () => resolver(null));
  });
}

/** Espera a que el servidor conteste. Sondea en vez de dormir un rato fijo: una
 *  espera fija es la receta del test que falla una vez de cada veinte. */
async function esperarServidor(url) {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(url, { method: 'GET' });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return false;
}
