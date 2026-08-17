#!/usr/bin/env node
/**
 * Prepara el lote que hay que subir a Higgsfield a mano.
 *
 *     node scripts/preparar-higgsfield.mjs
 *
 * Lee `auditoria-imagenes/cola-higgsfield.json` y deja en
 * `~/Downloads/higgsfield-in/` los originales mas un INSTRUCCIONES.md de
 * copiar-pegar.
 *
 * POR QUE ES UN PASO MANUAL. Higgsfield no expone la API de upscale en nuestro
 * plan, asi que la generacion la hace una persona en higgsfield.ai. Lo unico que
 * puede hacer el codigo es que ese rato sea mecanico: los ficheros ya puestos, el
 * tamano objetivo de cada uno calculado, y un solo prompt que sirve para todos.
 *
 * LOS NOMBRES SON EL CONTRATO. Los ficheros vuelven a `~/Downloads/higgsfield-out/`
 * identificados SOLO por su nombre, asi que una colision al aplanar las rutas
 * anidadas de cms-img escribiria la foto de un post encima de la de otro y nadie
 * se enteraria. `auditar-nitidez.mjs` ya desambigua con `__2`, `__3`...; aqui se
 * verifica que no queda ninguna repetida antes de copiar nada.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(RAIZ, 'public');
const DESTINO = '/Users/senavia/Downloads/higgsfield-in';

const cola = JSON.parse(
  await fs.readFile(path.join(RAIZ, 'auditoria-imagenes/cola-higgsfield.json'), 'utf8'),
);

if (!cola.imagenes.length) {
  console.log('  La cola esta vacia: no hay ninguna imagen por debajo de los umbrales.');
  process.exit(0);
}

// Invariante antes de tocar el disco: dos entradas con el mismo nombre harian que
// la vuelta fuese ambigua, y el error se veria semanas despues como "esa foto no
// es la de ese proyecto".
const cuenta = new Map();
for (const i of cola.imagenes) cuenta.set(i.archivo, (cuenta.get(i.archivo) ?? 0) + 1);
const repetidos = [...cuenta].filter(([, n]) => n > 1);
if (repetidos.length) {
  console.error('  FALLO  nombres repetidos en la cola: la vuelta seria ambigua.');
  for (const [n, c] of repetidos) console.error(`         ${n}  x${c}`);
  process.exit(1);
}

await fs.rm(DESTINO, { recursive: true, force: true });
await fs.mkdir(DESTINO, { recursive: true });

for (const i of cola.imagenes) {
  await fs.copyFile(path.join(PUBLIC, i.ruta.slice(1)), path.join(DESTINO, i.archivo));
}

const PROMPT = (w, h) =>
  `Restore and upscale this exact photograph to ${w}x${h}px. Recover real
 photographic detail and micro-texture: wood grain, aluminum edges, screen
 mesh, foliage, concrete. Keep the identical composition, framing, crop,
 colors, lighting and every object exactly as they are. Do NOT add, remove,
 move or redesign anything. Do NOT alter text, signage, logos, license plates
 or faces. Do NOT change the number of posts, beams, louvers or panels. No
 oversharpening, no HDR look, no plastic skin, no color shift, no added
 watermark. Photorealistic, natural, clean edges.`;

const conColision = cola.imagenes.filter((i) => i.colision);

const md = [
  '# Lote para Higgsfield',
  '',
  `**${cola.imagenes.length} imagenes** de las ${cola.total} que sirve el sitio.`,
  `Generado por \`node scripts/preparar-higgsfield.mjs\` a partir de la auditoria.`,
  '',
  '## Que hacer',
  '',
  '1. Entra en <https://higgsfield.ai/ai-image-upscaler>.',
  '2. Sube **una** imagen de esta carpeta.',
  '3. Modo **image-to-image / upscale**, con **fidelidad ALTA al original** y',
  '   **creatividad al minimo**. Activa *restore* y *denoise* si estan disponibles.',
  '4. Pega el prompt de esa imagen (columna «Prompt» de la tabla: solo cambia el',
  '   tamano objetivo).',
  '5. Descarga el resultado y **guardalo en `~/Downloads/higgsfield-out/` con el',
  '   MISMO nombre de archivo** con el que esta aqui. La extension puede cambiar',
  '   (PNG, JPEG, WebP: da igual, se recodifica a AVIF luego); **el nombre no**.',
  '',
  '> **El nombre es lo unico que identifica cada foto en la vuelta.** Si dos acaban',
  '> llamandose igual, una sobrescribe a la otra y el sitio acaba enseñando la casa',
  '> de otro cliente en el proyecto equivocado.',
  '',
  '## No hace falta hacerlas todas de una vez',
  '',
  `Son ${cola.imagenes.length} subidas de una en una. La tabla esta **ordenada por`,
  'gravedad**, asi que se puede parar donde se quiera: las de arriba son las que mas',
  'se notan (menos pixeles de los que pide su hueco) y las de abajo, las que menos.',
  '',
  'La integracion acepta lotes parciales — solo mira lo que haya en',
  '`~/Downloads/higgsfield-out/`— asi que se puede hacer en varias tandas sin perder',
  'nada. Las que falten siguen en la cola para la siguiente.',
  '',
  'Un orden razonable si hay que elegir: primero las que salen en **muchas paginas**',
  '(ultima columna) y las de la home, porque son las que ve mas gente.',
  '',
  '## Que NO hace falta que salga perfecto',
  '',
  'No hay que revisar nada aqui. Al volver, `node scripts/integrar-higgsfield.mjs`',
  'rechaza automaticamente lo que cambie la relacion de aspecto mas de un 1%, lo que',
  'no llegue a 1.8x los pixeles, lo que no gane nitidez y lo que se aleje',
  'estructuralmente del original. Genera ademas un montaje antes/despues de cada una',
  'para mirarlas de una en una. Es preferible que sobre y se rechace a que se cuele',
  'una foto retocada de mas.',
  '',
  '## Las imagenes',
  '',
  '| # | Archivo | Ahora | Objetivo | Por que | Prompt |',
  '|---|---|---|---|---|---|',
  ...cola.imagenes.map((i, n) =>
    `| ${n + 1} | \`${i.archivo}\` | ${i.actual.width}x${i.actual.height}`
    + ` | **${i.objetivo.width}x${i.objetivo.height}** | ${i.motivos.join('; ')}`
    + ` | \`${i.objetivo.width}x${i.objetivo.height}\` |`),
  '',
  ...(conColision.length ? [
    '### Nombres desambiguados',
    '',
    'Estos venian de rutas distintas con el mismo nombre de archivo. Se les ha puesto',
    'un sufijo `__N`; **devuelvelos con ese sufijo**, no con el nombre original.',
    '',
    '| Archivo aqui | Ruta real en el sitio |',
    '|---|---|',
    ...conColision.map((i) => `| \`${i.archivo}\` | \`${i.ruta}\` |`),
    '',
  ] : []),
  '## El prompt',
  '',
  'El mismo para todas; solo cambia `{ANCHO}x{ALTO}`, que esta en la tabla de arriba.',
  '',
  '```',
  PROMPT('{ANCHO}', '{ALTO}'),
  '```',
  '',
  '## Cuando termines',
  '',
  '```bash',
  'node scripts/integrar-higgsfield.mjs            # juzga y genera comparativas',
  '# mira auditoria-imagenes/comparativas/ una a una',
  'node scripts/integrar-higgsfield.mjs --aplicar  # escribe las aprobadas',
  '```',
  '',
].join('\n');

await fs.writeFile(path.join(DESTINO, 'INSTRUCCIONES.md'), md);

console.log(`  ${cola.imagenes.length} originales -> ${DESTINO}/`);
if (conColision.length) console.log(`  ${conColision.length} con nombre desambiguado (__N)`);
console.log(`  instrucciones -> ${DESTINO}/INSTRUCCIONES.md`);
console.log(`\n  Los resultados van a /Users/senavia/Downloads/higgsfield-out/ con el MISMO nombre.\n`);
