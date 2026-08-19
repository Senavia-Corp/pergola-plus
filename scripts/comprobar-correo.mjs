#!/usr/bin/env node
/**
 * Puerta de los dos correos del circuito de leads.
 *
 *     npm run check:correo
 *     node scripts/comprobar-correo.mjs --dump acuse-es > /tmp/a.html
 *
 * Sin red, sin SMTP y sin variables: los dos constructores de src/lib/correo.ts son
 * PUROS. Lo unico que hace falta es node.
 *
 * Esta es la unica puerta automatica de este codigo: `npm run build` NO comprueba
 * tipos en este repo, asi que una clave mal escrita o una etiqueta que falta
 * saldrian en verde hasta que un lead real se encontrara un correo roto.
 *
 * La extension .ts en los imports es OBLIGATORIA: node resuelve los .ts del repo por
 * type-stripping, pero un especificador relativo SIN extension da ERR_MODULE_NOT_FOUND.
 * Por eso correo.ts va con cero imports y por eso lead.ts los lleva con extension.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { construirAcuse, construirAvisoLead, esc } from '../src/lib/correo.ts';
import { NEGOCIO } from '../src/lib/jsonld.ts';

const ejecutar = promisify(execFile);
const RAIZ = path.resolve(import.meta.dirname, '..');

let fallos = 0;
const decir = (ok, msg, detalle = '') => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    if (detalle) console.log(`         ${String(detalle).slice(0, 300)}`);
  }
};

const N = {
  nombre: NEGOCIO.nombre,
  telefono: NEGOCIO.telefono,
  email: NEGOCIO.email,
  calle: NEGOCIO.calle,
  ciudad: NEGOCIO.ciudad,
  region: NEGOCIO.region,
  postal: NEGOCIO.postal,
};

/** Un lead normal, con los campos que declara OBLIGATORIOS de api/lead.ts. */
const benigno = (idioma, formulario) => ({
  formulario,
  pagina: idioma === 'es' ? '/es/contact-us/get-a-quote' : '/contact-us/get-a-quote',
  idioma,
  recibido: '2026-08-18T15:30:00.000Z',
  verificado: true,
  campos: {
    'Full-Name': 'Ana María Pérez',
    email: 'ana@ejemplo.com',
    Phone: '(561) 710-8363',
    'Street-Address': '980 N Federal Hwy',
    City: 'Boca Raton',
    'ZIP-Code': '33432',
    'Shade-Structure': 'Louvered Roof',
    'Estimated-Project-Budget': '$20,000 - $30,000',
    'SMS-Consent': 'yes',
    Message: 'Quiero una pérgola.\nTengo dos patios.\nGracias & saludos.',
  },
});

/**
 * El mismo lead, hostil. Cada valor ataca una salida distinta:
 *   nombre    HTML suelto
 *   email     cabecera de mailto (? y & son separadores) + comilla en atributo
 *   telefono  <img onerror> colado entre digitos, que la regex TEL de api/lead.ts
 *             NO atrapa si se cuenta solo la longitud
 *   mensaje   etiqueta y salto de linea a la vez: prueba escapar-antes-de-partir
 */
const hostil = (idioma) => ({
  formulario: 'quote',
  pagina: '/contact-us/get-a-quote',
  idioma,
  recibido: '2026-08-18T15:30:00.000Z',
  verificado: false,
  campos: {
    'Full-Name': '<script>alert(1)</script>',
    email: 'a"b?subject=Hola&body=Malo@ejemplo.com',
    Phone: '561<img src=x onerror=alert(1)>710',
    Message: '<b>uno</b>\ndos & tres\n<img src=x onerror=alert(2)>',
    'Campo-Que-Nadie-Declaro': 'valor suelto',
  },
});

const IDIOMAS = ['en', 'es'];
const FORMULARIOS = ['quote', 'contact', 'footer', 'estimador'];

// --- volcado para mirarlo en el navegador ----------------------------------
const dump = process.argv.indexOf('--dump');
if (dump !== -1) {
  const que = process.argv[dump + 1] ?? 'acuse-es';
  const [tipo, idioma] = que.split('-');
  const d = benigno(idioma === 'es' ? 'es' : 'en', 'quote');
  process.stdout.write((tipo === 'aviso' ? construirAvisoLead(d, N) : construirAcuse(d, N)).html);
  process.exit(0);
}

console.log('\n[correo] plantillas\n');

// --- 1. se construyen los dos, en los dos idiomas, para los 3 formularios ---
const todos = [];
for (const i of IDIOMAS) {
  for (const f of FORMULARIOS) {
    const d = benigno(i, f);
    todos.push([`acuse ${i}/${f}`, construirAcuse(d, N)]);
    todos.push([`aviso ${i}/${f}`, construirAvisoLead(d, N)]);
  }
}
decir(todos.length === 16, `se construyen los 16 correos (2 tipos x 2 idiomas x 4 formularios)`);

for (const [nombre, c] of todos) {
  if (!c.asunto?.trim()) decir(false, `${nombre}: asunto vacio`);
  // El texto plano NO es opcional: hay quien lee en texto plano y un correo
  // solo-HTML puntua peor en los filtros de spam.
  if (!c.texto?.trim()) decir(false, `${nombre}: SIN alternativa de texto plano`);
  if (!c.html?.includes('<!doctype html>')) decir(false, `${nombre}: html sin doctype`);
}
decir(
  todos.every((t) => t[1].asunto?.trim() && t[1].texto?.trim() && t[1].html?.trim()),
  'los 12 traen asunto, texto plano y html',
);

// Nada a medio construir. `undefined` en un correo a un cliente es lo que se ve.
const rotos = todos.filter(([, c]) => /undefined|\[object Object\]|NaN/.test(c.html + c.texto));
decir(rotos.length === 0, 'ninguno cuela undefined / [object Object] / NaN', rotos.map((r) => r[0]).join(', '));

// --- 2. el correo no se rompe en clientes de correo -------------------------
console.log('\n[correo] compatibilidad');

const sinVar = todos.filter(([, c]) => c.html.includes('var(--'));
decir(sinVar.length === 0, 'ni una custom property (var(--x) no existe en Outlook)', sinVar.map((r) => r[0]).join(', '));

const sinAncho = todos.filter(([, c]) => !c.html.includes('width="600"'));
decir(sinAncho.length === 0, 'width="600" como ATRIBUTO (Outlook usa el motor de Word y se salta el estilo)');

const conFlex = todos.filter(([, c]) => /display:\s*(flex|grid)|position:\s*absolute/.test(c.html));
decir(conFlex.length === 0, 'nada de flex/grid/position: maqueta con tablas', conFlex.map((r) => r[0]).join(', '));

// --- 3. escapado: es la frontera de confianza -------------------------------
console.log('\n[correo] entrada hostil');

for (const i of IDIOMAS) {
  const d = hostil(i);
  const acuse = construirAcuse(d, N);
  const aviso = construirAvisoLead(d, N);

  for (const [nombre, c] of [[`acuse ${i}`, acuse], [`aviso ${i}`, aviso]]) {
    decir(!c.html.includes('<script>'), `${nombre}: el <script> del nombre sale escapado`);
    // Se comprueba que no hay ETIQUETA, no que no aparece la cadena: el texto
    // escapado `&lt;img src=x onerror=...&gt;` SI contiene "onerror=" y es
    // inofensivo — se pinta como texto. Lo que no puede existir es un <img de
    // verdad, y estas plantillas no emiten ninguna de estas etiquetas por su
    // cuenta, asi que cualquier aparicion vendria del lead.
    decir(
      !/<(script|img|svg|iframe|object|embed|style)\b/i.test(c.html),
      `${nombre}: el <img onerror> del telefono no llega a ser etiqueta`,
      (c.html.match(/<(script|img|svg|iframe|object|embed|style)\b[^>]*/i) ?? [''])[0],
    );
    decir(!c.html.includes('<b>uno</b>'), `${nombre}: la etiqueta del mensaje sale escapada`);
    // Escapar-primero-partir-despues: el <br> es NUESTRO, tiene que sobrevivir.
    decir(c.html.includes('<br>'), `${nombre}: el salto de linea se convierte en <br> propio`);
    // El ? y el & son separadores de cabecera en un mailto: un lead podria abrirle
    // al despacho el cliente de correo con asunto y cuerpo suyos.
    const mailtos = [...c.html.matchAll(/href="mailto:([^"]*)"/g)].map((m) => m[1]);
    const peligrosos = mailtos.filter((m) => /[?&"']/.test(m));
    decir(peligrosos.length === 0, `${nombre}: ningun mailto: admite cabeceras inyectadas`, peligrosos.join(' | '));
    const teles = [...c.html.matchAll(/href="tel:([^"]*)"/g)].map((m) => m[1]);
    const telSucio = teles.filter((t) => /[^0-9+]/.test(t));
    decir(telSucio.length === 0, `${nombre}: todo tel: son digitos y +`, telSucio.join(' | '));
  }

  // Un campo que nadie declaro tiene que APARECER, no tragarse. El dia que alguien
  // anada uno al formulario, el aviso lo enseña con nombre feo en vez de perderlo.
  decir(
    aviso.texto.includes('valor suelto'),
    `aviso ${i}: un campo no declarado se muestra igual (no se traga en silencio)`,
  );
}

decir(esc('<&">\'') === '&lt;&amp;&quot;&gt;&#39;', 'esc() cubre los cinco caracteres');

// --- 4. el aviso interno dice lo que hace falta para llamar ------------------
console.log('\n[correo] contenido del aviso');

for (const i of IDIOMAS) {
  const a = construirAvisoLead(benigno(i, 'quote'), N);
  decir(a.asunto.startsWith('[Lead]'), `aviso ${i}: el asunto empieza por [Lead]`);
  decir(a.html.includes('Ana Mar'), `aviso ${i}: lleva el nombre`);
  decir(a.texto.includes('(561) 710-8363'), `aviso ${i}: lleva el telefono del lead`);
  decir(
    a.texto.includes(i === 'es' ? 'Espanol' : 'English'),
    `aviso ${i}: dice en que idioma escribio (decide en que lengua se le llama)`,
  );
}

const sinVerificar = construirAvisoLead({ ...benigno('en', 'quote'), verificado: false }, N);
decir(
  /NO VERIFICADO/.test(sinVerificar.texto),
  'el aviso avisa cuando el lead no paso el antibot',
);

// --- 5. el acuse va en el idioma del visitante ------------------------------
const acuseEs = construirAcuse(benigno('es', 'quote'), N);
const acuseEn = construirAcuse(benigno('en', 'quote'), N);
decir(acuseEs.asunto.includes('Hemos recibido'), 'el acuse en español va en español');
decir(acuseEn.asunto.includes('We received'), 'el acuse en inglés va en inglés');
decir(acuseEs.asunto !== acuseEn.asunto, 'los dos asuntos son distintos de verdad');

// --- 6. lo que de verdad importa: que un lead perdido HAGA RUIDO ------------
console.log('\n[correo] entregarLead no miente');

// Se ejecuta en un cwd donde NO se puede escribir, sin SMTP y sin webhook: no queda
// ni un canal real. `ok` TIENE que ser false.
//
// Antes era `ok = log || archivo || webhook` y console.log no falla nunca, asi que
// ok era SIEMPRE true: el 500 del endpoint era codigo inalcanzable y el visitante
// veia "gracias" aunque su lead no hubiera llegado a ningun sitio.
const guion = `
  import { entregarLead } from ${JSON.stringify(path.join(RAIZ, 'src/lib/lead.ts'))};
  const r = await entregarLead({
    formulario: 'contact', pagina: '/x', idioma: 'en',
    recibido: new Date().toISOString(), verificado: false, campos: { email: 'a@b.co' },
  });
  process.stdout.write('RESULTADO' + JSON.stringify({ ok: r.ok, canales: r.canales }));
`;
try {
  const { stdout } = await ejecutar('node', ['--input-type=module', '-e', guion], {
    cwd: '/dev',                       // no se puede escribir: el canal archivo cae
    env: { ...process.env, LEAD_WEBHOOK_URL: '', SMTP_HOST: '', SMTP_USER: '', SMTP_PASS: '' },
    maxBuffer: 8 * 1024 * 1024,
  });
  const r = JSON.parse(stdout.slice(stdout.indexOf('RESULTADO') + 9));
  decir(r.ok === false, 'sin archivo, sin webhook y sin correo -> ok:false (el endpoint dara 500)');
  decir(r.canales.log === true, 'el log si sale, pero YA NO cuenta como entrega');
  decir(r.canales.correo === null, 'sin SMTP configurado el canal correo es null, no false');
} catch (e) {
  decir(false, 'no se pudo ejecutar la comprobacion de entregarLead', e.message);
}

console.log('');
if (fallos) {
  console.error(`[correo] ${fallos} fallo(s)\n`);
  process.exit(1);
}
console.log('[correo] en verde\n');
