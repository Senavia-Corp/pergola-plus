/**
 * Entrega de leads. ESTA es la unica costura del circuito.
 *
 * El envio de correo transaccional queda FUERA DE ALCANCE por decision del
 * proyecto: ni proveedor, ni plantillas, ni copy, ni claves. Lo que hay aqui es el
 * punto exacto donde se engancha cuando el cliente de los accesos.
 *
 * Tres canales, y se intenta con los tres siempre:
 *
 *   1. stdout en NDJSON     una linea por lead. En Vercel queda en los logs de la
 *                           funcion. Es el unico que no depende de nada.
 *   2. .leads/leads.ndjson  solo funciona donde el disco es de escritura, o sea en
 *                           local y en `astro preview`. En Vercel falla y se anota.
 *   3. LEAD_WEBHOOK_URL     si la variable esta definida. Es la via por la que el
 *                           cliente puede enchufar su CRM sin tocar codigo.
 *
 * Si fallan los tres, el endpoint devuelve 500 y lo registra como ERROR_ENTREGA.
 * Un lead que se pierde tiene que hacer ruido: el visitante ya escribio sus datos y
 * merece saber que no han llegado, en vez de un "gracias" que miente.
 *
 * AVISO HONESTO sobre el estado actual: mientras no haya correo ni webhook
 * configurados, en produccion el unico canal vivo es el log de Vercel. Eso NO es un
 * circuito de leads aceptable para un negocio — nadie mira los logs — y esta anotado
 * en docs/estado-final.md como pendiente de accesos del cliente. En local si queda
 * el archivo, que es lo que permite probar el circuito de punta a punta.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

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
  canales: { log: boolean; archivo: boolean; webhook: boolean | null };
  errores: string[];
}

const ARCHIVO = path.join(process.cwd(), '.leads', 'leads.ndjson');

export async function entregarLead(lead: Lead): Promise<ResultadoEntrega> {
  const linea = JSON.stringify({ tipo: 'LEAD', ...lead });
  const errores: string[] = [];
  const canales: ResultadoEntrega['canales'] = { log: false, archivo: false, webhook: null };

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
  const url = import.meta.env.LEAD_WEBHOOK_URL ?? process.env.LEAD_WEBHOOK_URL;
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

  const ok = canales.log || canales.archivo || canales.webhook === true;
  if (!ok) console.error(JSON.stringify({ tipo: 'ERROR_ENTREGA', errores, lead }));

  return { ok, canales, errores };

  // TODO(correo): aqui va el envio transaccional — acuse al visitante y aviso al
  // despacho. Fuera de alcance por decision del proyecto: ni proveedor, ni
  // plantillas, ni copy. Cuando se enganche, cuenta como un cuarto canal y entra
  // en el `ok` de arriba.
}
