/**
 * Los dos correos de los formularios.
 *
 *   construirAcuse()      -> al visitante, a la direccion que escribio, en SU idioma.
 *   construirAvisoLead()  -> al despacho, con etiquetas bilingues EN / ES.
 *
 * Los dos son PUROS: mismos datos, mismo correo. Ni red, ni variables de entorno,
 * ni reloj — la fecha entra como parametro. Eso es lo que permite que
 * scripts/comprobar-correo.mjs los cargue con `node` a pelo y los compruebe de
 * verdad, que importa porque `npm run build` NO comprueba tipos en este repo.
 *
 * CERO IMPORTS, y es requisito, no preferencia:
 *
 *   - `import { NEGOCIO } from './jsonld'` no resuelve bajo node pelado
 *     (ERR_MODULE_NOT_FOUND: los especificadores relativos necesitan extension), y
 *     con extension se queja el editor. Por eso el NAP entra POR PARAMETRO;
 *     src/lib/jsonld.ts sigue siendo su unica fuente, solo cambia quien lo pasa.
 *   - `import.meta.env` aqui reventaria bajo node y hornearia valores en el
 *     artefacto. Este fichero no lee ni una variable de entorno.
 *
 * COMO SE ESCRIBE UN CORREO QUE NO SE ROMPE. Esto no es la web; el cliente de correo
 * mas usado del mundo renderiza como un navegador de 2003:
 *
 *   - Maqueta con TABLAS. Nada de flex, grid, position ni float.
 *   - CSS EN LINEA en cada elemento. Gmail borra el <style> del <head> en cuanto
 *     reenvias el mensaje.
 *   - NI UNA CUSTOM PROPERTY. var(--x) no existe en Outlook: hex literal.
 *   - 600 px, con width="600" COMO ATRIBUTO ademas del max-width, porque el
 *     renderizador de Word (Outlook de escritorio) ignora el estilo.
 *   - Alternativa de TEXTO PLANO siempre. No es opcional: hay quien lee en texto
 *     plano, y los filtros penalizan un correo solo-HTML.
 *   - Nada critico dentro de una imagen. Con las imagenes bloqueadas los dos
 *     correos tienen que entenderse enteros.
 */

export type Idioma = 'en' | 'es';

/** El NAP, tal cual sale de NEGOCIO en src/lib/jsonld.ts. */
export type Negocio = Readonly<{
  nombre: string;
  telefono: string;
  email: string;
  calle: string;
  ciudad: string;
  region: string;
  postal: string;
}>;

export type Correo = { asunto: string; texto: string; html: string };

/** Lo mismo que `Lead` en src/lib/lead.ts, sin arrastrar el import. */
export type DatosCorreo = Readonly<{
  formulario: string;
  pagina: string;
  idioma: Idioma;
  /** ISO. Lo pone el servidor. */
  recibido: string;
  verificado: boolean;
  campos: Readonly<Record<string, string | string[]>>;
}>;

// --- Escapado -------------------------------------------------------------

/**
 * TODO lo que llega del formulario lo escribe un desconocido y acaba dentro de
 * HTML, y parte dentro de un href. El endpoint valida forma, no intencion: el
 * telefono admite `(`, `)`, `+`, `.` y `-`, y el resto de campos admiten cualquier
 * cosa hasta su tope de longitud. Sin escapar, el aviso al despacho es una via de
 * inyeccion directa contra quien lo abre.
 *
 * Se escapa tambien la comilla simple, para que valga en atributos con ' .
 */
export const esc = (v: string): string =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Multilinea -> HTML. ESCAPAR PRIMERO, PARTIR DESPUES: al reves, el <br> que
 *  acabas de meter se escapa y el texto hostil no. */
const parrafo = (v: string): string => esc(v).replace(/\r?\n/g, '<br>');

/** tel:. Escapar no basta — se tira todo lo que no sea digito o +, que ademas es
 *  lo unico que entiende un marcador. */
const hrefTel = (v: string): string => 'tel:' + v.replace(/[^0-9+]/g, '');

/**
 * mailto:. Escapar tampoco basta. El EMAIL de src/pages/api/lead.ts exige una
 * arroba y un punto y prohibe espacios, pero NO prohibe ? ni &, y en un mailto
 * esos dos son SEPARADORES DE CABECERA: `a?subject=X&body=Y@x.com` pasa la
 * validacion, y al pulsar «Responder» se le abriria al despacho el cliente de
 * correo con asunto y cuerpo escritos por un desconocido. Se percent-codifica lo
 * estructural: la direccion se sigue leyendo y deja de poder inventar cabeceras.
 */
const hrefMail = (v: string): string =>
  'mailto:' +
  v.replace(/[%?&#"'<>\s]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));

/** Fecha legible en hora de Florida. El ISO va al lado: ese es la prueba. */
const fechaEt = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return (
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/New_York',
    }).format(d) + ' ET'
  );
};

// --- Vocabulario ----------------------------------------------------------

/** Los 4 formularios, con nombre legible en los dos idiomas. */
const FORMULARIO: Record<string, Record<Idioma, string>> = {
  quote: { en: 'Quote request', es: 'Solicitud de presupuesto' },
  contact: { en: 'Contact form', es: 'Formulario de contacto' },
  footer: { en: 'Newsletter signup', es: 'Alta en el boletin' },
  estimador: { en: 'Project estimator', es: 'Calculador de presupuesto' },
};

/**
 * Etiquetas de campo. Las claves son las del markup migrado de Webflow, con su
 * mayusculas-y-guiones tal cual: cambiarlas romperia la lista blanca OBLIGATORIOS
 * de src/pages/api/lead.ts.
 *
 * Lo que NO esta aqui no se pierde: cae en el de-slugificador de abajo. Es
 * deliberado — el dia que alguien anada un campo al formulario, el aviso lo
 * enseñara con un nombre feo pero LO ENSEÑARA, en vez de tragarselo en silencio.
 */
const ETIQUETA: Record<string, Record<Idioma, string>> = {
  'Full-Name': { en: 'Name', es: 'Nombre' },
  'First-Name': { en: 'First name', es: 'Nombre' },
  'Last-Name': { en: 'Last name', es: 'Apellidos' },
  email: { en: 'Email', es: 'Correo' },
  Email: { en: 'Email', es: 'Correo' },
  Phone: { en: 'Phone', es: 'Telefono' },
  'Phone-Number': { en: 'Phone', es: 'Telefono' },
  'Street-Address': { en: 'Address', es: 'Direccion' },
  City: { en: 'City', es: 'Ciudad' },
  'ZIP-Code': { en: 'ZIP', es: 'Codigo postal' },
  'Shade-Structure': { en: 'Product', es: 'Producto' },
  'Estimated-Project-Budget': { en: 'Budget', es: 'Presupuesto' },
  'Project-Type': { en: 'Project type', es: 'Tipo de proyecto' },
  Message: { en: 'Message', es: 'Mensaje' },
  'SMS-Consent': { en: 'SMS consent', es: 'Consentimiento SMS' },
  // Las del estimador. Sin entrada aqui no se perderian —deSlug() las convierte en
  // "Ground surface"— pero el aviso al despacho solo saca bilingue lo que esta en
  // este mapa, y este es el correo con el que el comercial prepara la llamada.
  'Project-Size': { en: 'Size', es: 'Tamano' },
  Mounting: { en: 'Mounting', es: 'Montaje' },
  'Ground-Surface': { en: 'Ground today', es: 'Suelo actual' },
  'New-Base': { en: 'New base', es: 'Base nueva' },
  Enhancements: { en: 'Enhancements', es: 'Mejoras' },
  County: { en: 'County', es: 'Condado' },
  Waterfront: { en: 'Waterfront', es: 'Frente al agua' },
  'HOA-Approval': { en: 'HOA approval', es: 'Aprobacion de comunidad' },
  'Budget-Fit': { en: 'Budget fit', es: 'Encaje de presupuesto' },
  'Estimate-Range': { en: 'Estimate', es: 'Estimado' },
  'Estimate-Open': { en: 'Still open', es: 'Sin definir' },
  'Steps-Completed': { en: 'Steps done', es: 'Pasos completados' },
};

/** `Estimated-Project-Budget` -> `Estimated project budget`. */
const deSlug = (k: string): string => {
  const s = k.replace(/[-_]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const etiqueta = (clave: string, i: Idioma): string => ETIQUETA[clave]?.[i] ?? deSlug(clave);

/** Varias casillas con el mismo `name` llegan como array. */
const valor = (v: string | string[]): string => (Array.isArray(v) ? v.join(', ') : v);

/**
 * Orden de presentacion. Lo primero que hay que poder leer en el aviso es a quien
 * se llama y en que telefono; el resto va detras en el orden en que llego.
 */
const PRIMERO = ['Full-Name', 'First-Name', 'Last-Name', 'Phone', 'Phone-Number', 'email', 'Email'];

const ordenar = (campos: Readonly<Record<string, string | string[]>>): [string, string][] => {
  const pares = Object.entries(campos).map(([k, v]) => [k, valor(v)] as [string, string]);
  const peso = (k: string) => {
    const i = PRIMERO.indexOf(k);
    return i === -1 ? PRIMERO.length : i;
  };
  return pares.filter(([, v]) => v !== '').sort((a, b) => peso(a[0]) - peso(b[0]));
};

// --- Copy -----------------------------------------------------------------

const COPIA = {
  en: {
    asuntoAcuse: 'We received your request — Pergola Plus Florida',
    saludo: 'Thank you for reaching out.',
    cuerpo:
      'We have received your request and a member of our team will get back to you '
      + 'shortly. Our office hours are Monday to Friday, 8:00 AM to 5:00 PM ET.',
    prisa: 'If your project is time-sensitive, calling us is the fastest way to reach a person.',
    resumen: 'What you sent us',
    llamar: 'Call us',
    firma: 'The Pergola Plus Florida team',
    noResponder:
      'This is an automated confirmation. You can reply to this message and it will '
      + 'reach our team.',
  },
  es: {
    asuntoAcuse: 'Hemos recibido tu solicitud — Pergola Plus Florida',
    saludo: 'Gracias por escribirnos.',
    cuerpo:
      'Hemos recibido tu solicitud y alguien de nuestro equipo te contestara en breve. '
      + 'Nuestro horario es de lunes a viernes, de 8:00 a 17:00 (hora de Florida).',
    prisa: 'Si tu proyecto es urgente, llamarnos es la via mas rapida para hablar con una persona.',
    resumen: 'Lo que nos enviaste',
    llamar: 'Llamanos',
    firma: 'El equipo de Pergola Plus Florida',
    noResponder:
      'Esta es una confirmacion automatica. Puedes responder a este mensaje y le '
      + 'llegara a nuestro equipo.',
  },
} as const;

// --- Piezas compartidas ---------------------------------------------------

const TINTA = '#1b1b1b';
const GRIS = '#6b6b6b';
const BORDE = '#e3e3e3';
const FONDO = '#f6f6f6';
const OSCURO = '#14312a';

const cabecera = (n: Negocio, titulo: string): string => `
<tr>
  <td align="left" bgcolor="${OSCURO}" style="background-color:${OSCURO};padding:20px 28px;">
    <div style="font:600 18px/1.3 Arial,Helvetica,sans-serif;color:#ffffff;">${esc(n.nombre)}</div>
    <div style="font:400 13px/1.4 Arial,Helvetica,sans-serif;color:#bcd6ce;padding-top:4px;">${esc(titulo)}</div>
  </td>
</tr>`;

const pie = (n: Negocio, nota: string): string => `
<tr>
  <td style="padding:20px 28px;border-top:1px solid ${BORDE};font:400 12px/1.6 Arial,Helvetica,sans-serif;color:${GRIS};">
    <div><strong style="color:${TINTA};">${esc(n.nombre)}</strong></div>
    <div>${esc(n.calle)}, ${esc(n.ciudad)}, ${esc(n.region)} ${esc(n.postal)}</div>
    <div><a href="${hrefTel(n.telefono)}" style="color:${GRIS};">${esc(n.telefono)}</a>
       · <a href="${hrefMail(n.email)}" style="color:${GRIS};">${esc(n.email)}</a></div>
    ${nota ? `<div style="padding-top:10px;">${esc(nota)}</div>` : ''}
  </td>
</tr>`;

/** El armazon. `width="600"` va como ATRIBUTO ademas de en el estilo: Outlook de
 *  escritorio usa el motor de Word y se salta el max-width. */
const documento = (titulo: string, interior: string): string => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)}</title>
</head>
<body style="margin:0;padding:0;background-color:${FONDO};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${FONDO};">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
           style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid ${BORDE};border-radius:6px;">
      ${interior}
    </table>
  </td></tr>
</table>
</body></html>`;

/** Tabla de campos. Se usa en los dos correos con etiquetas distintas. */
const tablaCampos = (pares: [string, string][], i: Idioma, bilingue: boolean): string =>
  pares
    .map(([k, v]) => {
      const et = bilingue && ETIQUETA[k]
        ? `${esc(ETIQUETA[k].en)} <span style="color:${GRIS};font-weight:400;">/ ${esc(ETIQUETA[k].es)}</span>`
        : esc(etiqueta(k, i));
      return `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid ${BORDE};font:600 13px/1.5 Arial,Helvetica,sans-serif;color:${TINTA};width:38%;vertical-align:top;">${et}</td>
        <td style="padding:8px 0 8px 12px;border-bottom:1px solid ${BORDE};font:400 13px/1.5 Arial,Helvetica,sans-serif;color:${TINTA};">${parrafo(v)}</td>
      </tr>`;
    })
    .join('');

const camposTexto = (pares: [string, string][], i: Idioma): string =>
  pares.map(([k, v]) => `  ${etiqueta(k, i)}: ${v}`).join('\n');

// --- Acuse al visitante ---------------------------------------------------

export function construirAcuse(d: DatosCorreo, n: Negocio): Correo {
  const i = d.idioma;
  const t = COPIA[i];
  const pares = ordenar(d.campos);

  const texto = [
    t.saludo,
    '',
    t.cuerpo,
    '',
    t.prisa,
    `${t.llamar}: ${n.telefono}`,
    '',
    `${t.resumen}:`,
    camposTexto(pares, i),
    '',
    t.firma,
    '',
    '---',
    t.noResponder,
    `${n.nombre} · ${n.calle}, ${n.ciudad}, ${n.region} ${n.postal}`,
  ].join('\n');

  const html = documento(
    t.asuntoAcuse,
    cabecera(n, FORMULARIO[d.formulario]?.[i] ?? d.formulario) +
      `
<tr><td style="padding:28px;">
  <p style="margin:0 0 14px;font:600 17px/1.4 Arial,Helvetica,sans-serif;color:${TINTA};">${esc(t.saludo)}</p>
  <p style="margin:0 0 14px;font:400 14px/1.7 Arial,Helvetica,sans-serif;color:${TINTA};">${esc(t.cuerpo)}</p>
  <p style="margin:0 0 20px;font:400 14px/1.7 Arial,Helvetica,sans-serif;color:${TINTA};">${esc(t.prisa)}</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr><td bgcolor="${OSCURO}" style="background-color:${OSCURO};border-radius:4px;">
      <a href="${hrefTel(n.telefono)}"
         style="display:inline-block;padding:12px 22px;font:600 14px/1 Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;">
        ${esc(t.llamar)} ${esc(n.telefono)}</a>
    </td></tr>
  </table>
  <p style="margin:0 0 8px;font:600 13px/1.4 Arial,Helvetica,sans-serif;color:${GRIS};text-transform:uppercase;letter-spacing:.04em;">${esc(t.resumen)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${tablaCampos(pares, i, false)}</table>
  <p style="margin:24px 0 0;font:400 14px/1.7 Arial,Helvetica,sans-serif;color:${TINTA};">${esc(t.firma)}</p>
</td></tr>` +
      pie(n, t.noResponder),
  );

  return { asunto: t.asuntoAcuse, texto, html };
}

// --- Aviso al despacho ----------------------------------------------------

export function construirAvisoLead(d: DatosCorreo, n: Negocio): Correo {
  const pares = ordenar(d.campos);
  const nombre = valor(d.campos['Full-Name'] ?? d.campos['First-Name'] ?? '') || '(sin nombre / no name)';
  const forma = FORMULARIO[d.formulario]?.en ?? d.formulario;
  const asunto = `[Lead] ${forma} — ${nombre}`;
  const cuando = fechaEt(d.recibido);

  // El aviso es INTERNO y lo lee quien va a llamar: se dice el idioma del lead
  // arriba del todo, porque decide en que lengua se le devuelve la llamada.
  const meta: [string, string][] = [
    ['Form / Formulario', forma],
    ['Language / Idioma', d.idioma === 'es' ? 'Espanol' : 'English'],
    ['Page / Pagina', d.pagina],
    ['Received / Recibido', cuando ? `${cuando}  (${d.recibido})` : d.recibido],
    ['Anti-bot', d.verificado ? 'Turnstile OK' : 'NO VERIFICADO — sin TURNSTILE_SECRET_KEY'],
  ];

  const texto = [
    asunto,
    '',
    ...meta.map(([k, v]) => `  ${k}: ${v}`),
    '',
    'Lead / Datos:',
    camposTexto(pares, 'en'),
    '',
    `${n.nombre} · ${n.telefono}`,
  ].join('\n');

  const filasMeta = meta
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 0;font:400 12px/1.5 Arial,Helvetica,sans-serif;color:${GRIS};width:38%;vertical-align:top;">${esc(k)}</td>
        <td style="padding:6px 0 6px 12px;font:400 12px/1.5 Arial,Helvetica,sans-serif;color:${TINTA};">${esc(v)}</td>
      </tr>`,
    )
    .join('');

  const correoLead = valor(d.campos.email ?? d.campos.Email ?? '');
  const telLead = valor(d.campos.Phone ?? d.campos['Phone-Number'] ?? '');

  const html = documento(
    asunto,
    cabecera(n, `New lead / Nuevo contacto — ${forma}`) +
      `
<tr><td style="padding:24px 28px 8px;">
  <p style="margin:0 0 4px;font:700 20px/1.3 Arial,Helvetica,sans-serif;color:${TINTA};">${esc(nombre)}</p>
  ${telLead ? `<p style="margin:0 0 2px;font:600 15px/1.5 Arial,Helvetica,sans-serif;"><a href="${hrefTel(telLead)}" style="color:${OSCURO};">${esc(telLead)}</a></p>` : ''}
  ${correoLead ? `<p style="margin:0;font:400 14px/1.5 Arial,Helvetica,sans-serif;"><a href="${hrefMail(correoLead)}" style="color:${OSCURO};">${esc(correoLead)}</a></p>` : ''}
</td></tr>
<tr><td style="padding:8px 28px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${filasMeta}</table>
</td></tr>
<tr><td style="padding:16px 28px 24px;">
  <p style="margin:0 0 8px;font:600 13px/1.4 Arial,Helvetica,sans-serif;color:${GRIS};text-transform:uppercase;letter-spacing:.04em;">Lead / Datos</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${tablaCampos(pares, 'en', true)}</table>
</td></tr>` +
      pie(n, ''),
  );

  return { asunto, texto, html };
}
