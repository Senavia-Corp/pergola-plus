/**
 * Entrega de leads. ESTA es la unica costura del circuito.
 *
 * El envio de correo transaccional queda FUERA DE ALCANCE por decision del
 * proyecto: ni proveedor, ni plantillas, ni copy, ni claves. Lo que hay aqui es el
 * punto exacto donde se engancha cuando el cliente de los accesos.
 *
 * Cuatro canales, y se intenta con todos siempre:
 *
 *   1. stdout en NDJSON     una linea por lead. En Vercel queda en los logs de la
 *                           funcion. Es rastro, NO entrega (ver abajo).
 *   2. .leads/leads.ndjson  solo funciona donde el disco es de escritura, o sea en
 *                           local y en `astro preview`. En Vercel falla y se anota.
 *   3. LEAD_WEBHOOK_URL     si la variable esta definida. Es la via por la que el
 *                           cliente puede enchufar su CRM sin tocar codigo.
 *   4. correo SMTP          aviso al despacho + acuse al visitante. Es el canal que
 *                           convierte esto en un circuito de leads de verdad.
 *
 * QUE CUENTA COMO ENTREGADO, Y POR QUE IMPORTA
 *
 * Hasta ahora era `ok = log || archivo || webhook`, y `console.log` no falla nunca:
 * en produccion `ok` era SIEMPRE true, el 500 de src/pages/api/lead.ts era codigo
 * inalcanzable y el visitante veia "gracias" pasara lo que pasara. La cabecera de
 * este fichero afirmaba justo lo contrario. Un lead que solo queda en un log es un
 * lead perdido: nadie mira los logs.
 *
 * Ahora el log NO cuenta. Entregar es que el lead haya llegado a un sitio donde
 * alguien lo va a ver: el archivo (local), el CRM, o el correo AL DESPACHO. El acuse
 * al visitante es cortesia y no entra en el computo — que le llegue su confirmacion
 * mientras el negocio no se entera no es una entrega, es una mentira mas educada.
 *
 * Si no entrega ninguno, el endpoint devuelve 500 y lo registra como ERROR_ENTREGA.
 * El visitante ya escribio sus datos y merece saber que no han llegado.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { construirAcuse, construirAvisoLead } from './correo.ts';
import { NEGOCIO } from './jsonld.ts';

/** El NAP que reciben las plantillas. Sale de NEGOCIO, que sigue siendo su unica
 *  fuente; correo.ts no lo importa porque tiene que cargarse con `node` pelado. */
const NEGOCIO_CORREO = {
  nombre: NEGOCIO.nombre,
  telefono: NEGOCIO.telefono,
  email: NEGOCIO.email,
  calle: NEGOCIO.calle,
  ciudad: NEGOCIO.ciudad,
  region: NEGOCIO.region,
  postal: NEGOCIO.postal,
};

export interface Lead {
  /** Formulario de origen: quote | contact | footer. */
  formulario: string;
  /** URL de la pagina donde se envio. */
  pagina: string;
  /** Idioma de la pagina, para saber en que lengua contestar. */
  idioma: string;
  /** Momento de la recepcion, en ISO. Lo pone el servidor, no el navegador. */
  recibido: string;
  /** false cuando Turnstile no se pudo verificar (ver src/pages/api/lead.ts). */
  verificado: boolean;
  /** Campos del formulario, ya validados y recortados. */
  campos: Record<string, string | string[]>;
}

export interface ResultadoEntrega {
  ok: boolean;
  canales: {
    log: boolean;
    archivo: boolean;
    /** null = no configurado. No es un fallo: es que no existe. */
    webhook: boolean | null;
    /** El aviso AL DESPACHO. null = SMTP sin configurar. */
    correo: boolean | null;
    /** El acuse al visitante. Cortesia: no cuenta para `ok`. */
    acuse: boolean | null;
  };
  errores: string[];
}

const ARCHIVO = path.join(process.cwd(), '.leads', 'leads.ndjson');

export async function entregarLead(lead: Lead): Promise<ResultadoEntrega> {
  const linea = JSON.stringify({ tipo: 'LEAD', ...lead });
  const errores: string[] = [];
  const canales: ResultadoEntrega['canales'] = {
    log: false, archivo: false, webhook: null, correo: null, acuse: null,
  };

  // 1. stdout. Va primero y en su propio try por lo que representa: es el canal
  //    que queda cuando todo lo demas no esta configurado.
  try {
    console.log(linea);
    canales.log = true;
  } catch (e) {
    errores.push(`log: ${(e as Error).message}`);
  }

  // 2. Archivo local. En Vercel el disco es de solo lectura fuera de /tmp, asi que
  //    aqui se espera que falle: se anota y no se considera un problema por si
  //    solo.
  try {
    await fs.mkdir(path.dirname(ARCHIVO), { recursive: true });
    await fs.appendFile(ARCHIVO, linea + '\n', 'utf8');
    canales.archivo = true;
  } catch (e) {
    errores.push(`archivo: ${(e as Error).message}`);
  }

  // 3. Webhook. Solo si esta configurado; si no lo esta, no es un fallo, es que no
  //    existe — de ahi el null en vez de false.
  const url = ENV('LEAD_WEBHOOK_URL');
  if (url) {
    canales.webhook = false;
    try {
      // Con timeout: sin el, un CRM que no contesta deja al visitante mirando el
      // boton de "Sending..." hasta que la funcion se muera por limite de tiempo.
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: linea,
        signal: AbortSignal.timeout(5000),
      });
      if (r.ok) canales.webhook = true;
      else errores.push(`webhook: HTTP ${r.status}`);
    } catch (e) {
      errores.push(`webhook: ${(e as Error).message}`);
    }
  }

  // 4. Correo. Dos envios y solo el primero cuenta: el aviso al despacho es la
  //    entrega, el acuse al visitante es cortesia.
  const r = await enviarCorreos(lead);
  canales.correo = r.aviso;
  canales.acuse = r.acuse;
  errores.push(...r.errores);

  // `log` NO entra. console.log no falla nunca, asi que incluirlo hacia que `ok`
  // fuera siempre true y que el 500 del endpoint no se alcanzara jamas.
  const ok = canales.archivo || canales.webhook === true || canales.correo === true;
  if (!ok) console.error(JSON.stringify({ tipo: 'ERROR_ENTREGA', errores, lead }));

  return { ok, canales, errores };
}

// ---------------------------------------------------------------------------

/**
 * SMTP generico: host, puerto, usuario y contrasena.
 *
 * Y no `service: 'gmail'`, aunque hoy detras haya un Gmail con App Password. Con el
 * atajo, mudarse al buzon del dominio del cliente en el traspaso es un cambio de
 * CODIGO; asi es un cambio de VARIABLES. Cuesta lo mismo escribirlo y ahorra el
 * despliegue que nadie quiere hacer el dia de la entrega.
 *
 * Nota para ese dia: un Gmail con App Password es la cuenta de UNA PERSONA. Se cae
 * cuando esa persona cambia la contrasena o rehace su 2FA, y en el traspaso el
 * cliente no la hereda. Vale para el deploy provisional bajo cuentas de SENAVIA, que
 * es para lo que esta; para produccion, un buzon del dominio con su SPF/DKIM.
 */
/**
 * Una variable, desde donde sea. `import.meta.env` es de Vite y NO existe bajo node
 * pelado: leerlo directo lanza TypeError, y eso impedia que la puerta cargara este
 * fichero para probarlo. El `?? {}` es lo que lo hace comprobable.
 */
const ENV = (k: string): string | undefined =>
  ((import.meta as { env?: Record<string, string> }).env ?? {})[k] ?? process.env[k];

async function enviarCorreos(lead: Lead) {
  const errores: string[] = [];
  const host = ENV('SMTP_HOST');
  const user = ENV('SMTP_USER');
  const pass = ENV('SMTP_PASS');
  const from = ENV('SMTP_FROM') ?? user;
  const para = ENV('LEAD_NOTIFY_TO') ?? user;

  // Sin configurar no es un fallo: es que el canal no existe. De ahi el null.
  if (!host || !user || !pass || !para) return { aviso: null, acuse: null, errores };

  let nodemailer;
  try {
    // Especificador LITERAL, no una variable. Con la variable, el rastreador de
    // dependencias del adaptador de Vercel no ve el paquete y NO lo empaqueta en la
    // funcion: el envio reventaria en produccion con "Cannot find module
    // nodemailer" y el sintoma seria un lead sin aviso. Sigue siendo dinamico para
    // no pagar el arranque en frio en las peticiones que no mandan correo.
    ({ default: nodemailer } = await import('nodemailer'));
  } catch (e) {
    errores.push(`correo: nodemailer no disponible: ${(e as Error).message}`);
    return { aviso: false, acuse: null, errores };
  }

  const puerto = Number(ENV('SMTP_PORT') ?? 587);
  const transporte = nodemailer.createTransport({
    host,
    port: puerto,
    secure: puerto === 465,
    auth: { user, pass },
  });

  const datos = {
    formulario: lead.formulario,
    pagina: lead.pagina,
    idioma: lead.idioma === 'es' ? ('es' as const) : ('en' as const),
    recibido: lead.recibido,
    verificado: lead.verificado,
    campos: lead.campos,
  };

  // El aviso al despacho. Este es el que decide si el lead esta entregado.
  let aviso = false;
  try {
    const m = construirAvisoLead(datos, NEGOCIO_CORREO);
    const responder = String(lead.campos.email ?? lead.campos.Email ?? '');
    await transporte.sendMail({
      from,
      to: para,
      subject: m.asunto,
      text: m.texto,
      html: m.html,
      // Para que «Responder» desde el aviso escriba al lead y no a uno mismo.
      // Solo si el email paso la validacion del endpoint.
      replyTo: responder && EMAIL_SIMPLE.test(responder) ? responder : undefined,
    });
    aviso = true;
  } catch (e) {
    // Un canal CONFIGURADO que falla tiene que hacer ruido aqui mismo, no solo
    // cuando fallan todos. En local el archivo sigue funcionando, asi que `ok`
    // seria true y un SMTP mal configurado no se notaria hasta produccion — que es
    // justo donde no se quiere descubrir.
    errores.push(`correo/aviso: ${(e as Error).message}`);
    console.error(`[correo] el aviso al despacho NO salio: ${(e as Error).message}`);
  }

  // El acuse al visitante. Cortesia: su fallo no marca el lead como perdido, pero se
  // anota — un acuse que no sale es un visitante esperando una respuesta que cree
  // que ya esta en camino.
  let acuse: boolean | null = null;
  const destino = String(lead.campos.email ?? lead.campos.Email ?? '');
  if (destino && EMAIL_SIMPLE.test(destino)) {
    acuse = false;
    try {
      const m = construirAcuse(datos, NEGOCIO_CORREO);
      await transporte.sendMail({ from, to: destino, subject: m.asunto, text: m.texto, html: m.html });
      acuse = true;
    } catch (e) {
      errores.push(`correo/acuse: ${(e as Error).message}`);
    }
  }

  return { aviso, acuse, errores };
}

/** Segunda validacion antes de meter el valor en una cabecera SMTP. El endpoint ya
 *  lo valido, pero entregarLead() es exportada y podria llamarse desde otro sitio. */
const EMAIL_SIMPLE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
