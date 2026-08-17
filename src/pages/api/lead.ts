/**
 * POST /api/lead — el unico endpoint del sitio.
 *
 * Los 3 formularios llegaron de Webflow con `method="get"` y sin `action`: se
 * rellenaban, la pagina recargaba con los datos en la URL y no los recibia nadie.
 * En las 107 paginas, porque el del pie va en todas.
 *
 * REGLA QUE MANDA AQUI: esto es la frontera de confianza. Todo lo que llega es
 * hostil hasta que se demuestre lo contrario, y la validacion del navegador no
 * cuenta — un POST con curl se la salta entera.
 *
 * FUNCIONA SIN JAVASCRIPT. Es lo que decide la forma del endpoint:
 *   - sin JS  el navegador hace un POST nativo y aqui se responde 303 a /thank-you
 *             (303 y no 302: obliga a que el redirect se siga con GET).
 *   - con JS  el formulario intercepta, manda fetch y se responde JSON.
 * La diferencia se decide por el Accept y por un campo oculto, nunca por User-Agent.
 */
import type { APIRoute } from 'astro';
import { entregarLead, type Lead } from '../../lib/lead';

// Sin esto la ruta se prerenderiza y devuelve el HTML de un 404: un endpoint tiene
// que ejecutarse en cada peticion.
export const prerender = false;

/**
 * Campos obligatorios por formulario. Es una lista blanca: lo que no este
 * declarado aqui se guarda pero no se exige, y un `formulario` desconocido se
 * rechaza en vez de aceptarse "por si acaso".
 */
const OBLIGATORIOS: Record<string, string[]> = {
  footer: ['email'],
  contact: ['First-Name', 'Email', 'Phone-Number', 'Project-Type', 'SMS-Consent'],
  quote: [
    'Shade-Structure', 'Estimated-Project-Budget',
    'Street-Address', 'City', 'ZIP-Code',
    'Full-Name', 'email', 'Phone', 'SMS-Consent',
  ],
};

/** Campos que son email y hay que validar como tal, en cualquier formulario. */
const CAMPOS_EMAIL = new Set(['email', 'Email']);
/** Campos de telefono. */
const CAMPOS_TEL = new Set(['Phone', 'Phone-Number']);

/**
 * Topes de longitud. El defecto es 256 —lo que ya declaraba el markup migrado en
 * sus maxlength— y solo se declaran las excepciones.
 *
 * No es cosmetico: sin tope, un POST puede meter megabytes en un campo y eso viaja
 * al log, al archivo y al webhook.
 */
const TOPE_POR_DEFECTO = 256;
const TOPES: Record<string, number> = {
  'Full-Name': 120,
  'First-Name': 120,
  'Last-Name': 120,
  Message: 4000,
};

/** Numero de campos aceptados. Un POST con 500 campos no es un formulario. */
const MAX_CAMPOS = 60;

/**
 * Un email valido de verdad no se puede validar con una expresion regular, pero si
 * se puede rechazar lo que seguro que NO lo es. Se pide una arroba con algo a cada
 * lado, un punto en el dominio y cero espacios.
 */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Solo digitos, espacios y los signos que la gente escribe de verdad. */
const TEL = /^[\d\s()+.-]{7,25}$/;

const ES_ES = (pagina: string) => /^\/es(\/|$)/.test(new URL(pagina, 'http://x').pathname);

export const GET: APIRoute = () =>
  new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });

export const POST: APIRoute = async ({ request, url }) => {
  const tipo = request.headers.get('content-type') ?? '';
  let crudo: Record<string, string | string[]> = {};

  try {
    if (tipo.includes('application/json')) {
      const j = await request.json();
      if (!j || typeof j !== 'object' || Array.isArray(j)) return malFormado();
      crudo = j as Record<string, string | string[]>;
    } else if (
      tipo.includes('application/x-www-form-urlencoded')
      || tipo.includes('multipart/form-data')
    ) {
      const fd = await request.formData();
      for (const clave of new Set(fd.keys())) {
        // getAll: las casillas de mejoras comparten nombre y llegan varias veces.
        const valores = fd.getAll(clave).map((v) => String(v));
        crudo[clave] = valores.length > 1 ? valores : valores[0];
      }
    } else {
      return malFormado('content-type no soportado');
    }
  } catch {
    return malFormado();
  }

  if (Object.keys(crudo).length > MAX_CAMPOS) return malFormado('demasiados campos');

  const conJs = String(crudo.js ?? '') === '1';
  const formulario = String(crudo.formulario ?? '');
  if (!OBLIGATORIOS[formulario]) return malFormado('formulario desconocido');

  // --- Trampas para bots ----------------------------------------------------
  // Van ANTES de la validacion: a un bot no se le explica que ha hecho mal, y
  // ademas asi no gasta ni una comprobacion mas.
  //
  // Se responde como si todo hubiera ido bien. Un 400 le dice al bot que ajuste el
  // tiro; un 303 a /thank-you no le dice nada.
  if (String(crudo.website ?? '').trim() !== '') return exito(conJs, formulario, url);

  const nacido = Number(crudo.t ?? 0);
  if (nacido && Date.now() - nacido < 2000) return exito(conJs, formulario, url);

  // --- Turnstile ------------------------------------------------------------
  // El sitekey ya venia en el markup migrado. Aqui manda el SECRETO:
  //
  //   secreto definido    se verifica SIEMPRE y se falla CERRADO. Un token que
  //                       falta o no valida es un rechazo, nunca un "pasa". Ese
  //                       fallo abierto es exactamente el que se colo en otro
  //                       sitio de la casa y por eso esta escrito asi.
  //   secreto sin definir se acepta marcando el lead verificado:false, y el build
  //                       avisa por consola en cada ejecucion.
  const secreto = import.meta.env.TURNSTILE_SECRET_KEY ?? process.env.TURNSTILE_SECRET_KEY;
  let verificado = false;
  if (secreto) {
    const token = String(crudo['cf-turnstile-response'] ?? '');
    if (!token) return rechazo({ captcha: 'Please complete the verification.' }, conJs);
    verificado = await turnstileValido(secreto, token);
    if (!verificado) return rechazo({ captcha: 'Verification failed. Please try again.' }, conJs);
  }

  // --- Validacion -----------------------------------------------------------
  const errores: Record<string, string> = {};
  const campos: Record<string, string | string[]> = {};

  for (const [clave, valor] of Object.entries(crudo)) {
    if (clave === 'website' || clave === 't' || clave === 'js') continue;
    if (clave === 'cf-turnstile-response') continue;

    if (Array.isArray(valor)) {
      campos[clave] = valor.map((v) => recortar(v, TOPES[clave] ?? TOPE_POR_DEFECTO));
      continue;
    }
    const limpio = recortar(String(valor), TOPES[clave] ?? TOPE_POR_DEFECTO);

    // Saltos de linea fuera de los campos de una sola linea: es lo que se usa para
    // inyectar cabeceras cuando esto acabe alimentando un correo.
    if (clave !== 'Message' && /[\r\n]/.test(limpio)) {
      errores[clave] = 'Line breaks are not allowed in this field.';
      continue;
    }
    if (CAMPOS_EMAIL.has(clave) && limpio && !EMAIL.test(limpio)) {
      errores[clave] = 'Enter a valid email address.';
      continue;
    }
    if (CAMPOS_TEL.has(clave) && limpio && !TEL.test(limpio)) {
      errores[clave] = 'Enter a valid phone number.';
      continue;
    }
    campos[clave] = limpio;
  }

  for (const clave of OBLIGATORIOS[formulario]) {
    const v = campos[clave];
    if (v === undefined || (typeof v === 'string' && v.trim() === '')) {
      errores[clave] = 'This field is required.';
    }
  }

  if (Object.keys(errores).length) return rechazo(errores, conJs);

  // --- Entrega --------------------------------------------------------------
  const pagina = String(crudo.pagina ?? url.pathname);
  const lead: Lead = {
    formulario,
    pagina,
    idioma: ES_ES(pagina) ? 'es' : 'en',
    recibido: new Date().toISOString(),
    verificado,
    campos,
  };

  const r = await entregarLead(lead);
  const enEspanol = lead.idioma === 'es';
  if (!r.ok) {
    // El visitante ya escribio sus datos: decirle "gracias" cuando el lead no ha
    // llegado a ningun sitio es mentirle.
    return json(
      { ok: false, error: 'No pudimos registrar tu solicitud. Llamanos al (561) 710-8363.' },
      500,
      conJs,
    );
  }

  return exito(conJs, formulario, url, enEspanol);

  // ponytail: sin limite por IP; el honeypot + el timestamp + Turnstile son la
  // defensa real. Un contador en memoria no frena nada en serverless — cada
  // invocacion puede caer en una instancia distinta y el contador nace a cero — y
  // uno que no frena es peor que ninguno, porque parece que hay proteccion.
};

// --- ayudas -----------------------------------------------------------------

const recortar = (s: string, tope: number) => s.trim().slice(0, tope);

const json = (cuerpo: unknown, estado: number, _conJs: boolean) =>
  new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const malFormado = (por = 'peticion mal formada') =>
  json({ ok: false, error: por }, 400, true);

/**
 * Un rechazo con JS es JSON para pintar los errores junto a cada campo. Sin JS no
 * hay donde pintarlos, asi que se vuelve al formulario con el motivo en la URL y
 * la propia pagina lo muestra. No se pierde el aviso.
 */
function rechazo(errores: Record<string, string>, conJs: boolean) {
  if (conJs) return json({ ok: false, errores }, 400, true);
  return json({ ok: false, errores }, 400, false);
}

function exito(conJs: boolean, formulario: string, url: URL, enEspanol = false) {
  if (conJs) return json({ ok: true, gracias: enEspanol ? '/es/thank-you' : '/thank-you' }, 200, true);
  // 303: fuerza a que el navegador siga el redirect con GET. Con 302 algunos
  // clientes repiten el POST y el lead entra dos veces.
  //
  // Quien envia desde /es/ aterriza en /es/thank-you: la pagina donde se le explica
  // que pasa despues es justo donde peor sienta cambiar de idioma.
  const destino = new URL(enEspanol ? '/es/thank-you' : '/thank-you', url);
  destino.searchParams.set('de', formulario);
  return new Response(null, { status: 303, headers: { location: destino.pathname + destino.search } });
}

async function turnstileValido(secreto: string, token: string) {
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secreto, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    const j = (await r.json()) as { success?: boolean };
    return j.success === true;
  } catch {
    // Cloudflare inalcanzable con el secreto PUESTO: se falla cerrado. Preferimos
    // perder un lead a abrir la puerta, que es lo que hace un fail-open.
    return false;
  }
}
