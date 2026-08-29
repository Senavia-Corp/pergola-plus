/**
 * El texto de la seccion «Especificaciones», en los dos idiomas.
 *
 * Los HECHOS (que filas hay, cuales entran en el grafo, de que cuelga cada enlace)
 * viven en `src/data/especificaciones.ts`; aqui solo va el copy. La bisagra entre
 * las dos mitades es el `id`.
 *
 * NI UNA CIFRA SIN FUENTE. Cada fila lleva anotado de donde sale, y todas las
 * fuentes estan dentro del repo. Lo que NO aparece en ningun sitio de estas cadenas,
 * y es una lista cerrada: ninguna velocidad de viento en mph, ninguna presion de
 * diseño en psf, ningun numero de NOA, ninguna aleacion (6005 / 6063), ningun
 * temple, ningun espesor de pared, ningun año de garantia, ningun reparto
 * estructura/motor/acabado, ninguna luz maxima en pies, ninguna medida de modulo,
 * ninguna condicion de financiacion y ningun tipo de interes. Todo eso esta en
 * `huecos`, que es donde tiene que estar hasta que el cliente lo aporte.
 *
 * LAS ETIQUETAS DE FILA NO SON ENCABEZADOS, y no es un detalle: `h1`, `h2`, `h3` y
 * `.button` llevan `text-transform: capitalize` en ingles, asi que un `<h3>` con
 * «In a power cut» saldria «In A Power Cut». Van en `<dt>`, que ademas es lo que
 * son: el termino de una lista de definiciones.
 *
 * EL ESPAÑOL NO PASA POR EL DICCIONARIO. El componente lee directamente
 * `SPECS_COPY[idioma]`, igual que hace `FaqBiblioteca` con `FAQS_COPY`, asi que no
 * hay ninguna cadena que pueda quedarse en ingles en /es/ por un `alt` olvidado.
 */
import type { Idioma } from './blog.es';
export type { Idioma } from './blog.es';

export interface CopyFila {
  etiqueta: string;
  valor: string;
}

export interface CopyEspecificaciones {
  titulo: string;
  entradilla: string;
  /** Rotulo y entradilla del bloque de huecos declarados. */
  huecosTitulo: string;
  huecosEntradilla: string;
  filas: Record<string, CopyFila>;
  /** Cada hueco es una frase: que es y por que no esta. */
  huecos: Record<string, string>;
  /** El texto de ancla de cada enlace de blog. Descriptivo, nunca «Read more». */
  enlaces: Record<string, string>;
}

export const SPECS_COPY: Record<Idioma, Record<string, CopyEspecificaciones>> = {
  en: {
    'motorized-louvered-pergolas': {
      titulo: 'Specifications, Including The Gaps',
      entradilla: 'Everything below is either something we can stand behind today or something we have not published yet, and we say which is which. If you are collecting three quotes, this is the part the other two will not put in writing.',
      huecosTitulo: 'Not published yet',
      huecosEntradilla: 'These are the numbers a buyer should ask three contractors for. We would rather leave them blank here than print one we cannot back up.',
      filas: {
        // Fuente: la pregunta `pergola-lamas-que-angulo`. El hedge «depending on the
        // system» va DENTRO del valor y no se quita: 140-170 es un rango del sector,
        // no una especificacion de nuestro producto.
        giro: { etiqueta: 'Louver rotation', valor: 'About 140 to 170 degrees, depending on the system' },
        // Fuente: las nueve fotos de obra, abiertas una a una. Cinco adosadas y
        // cuatro exentas; nada mas se puede afirmar del montaje.
        montaje: { etiqueta: 'Mounting', valor: 'Attached to the house, or freestanding over a deck or pool' },
        // Fuente: la respuesta 4 de la propia ficha, TEXTUAL. Es tambien el valor de
        // `Product.material`, y por eso tiene que coincidir palabra por palabra con
        // lo que se pinta. Sin aleacion, sin temple y sin espesor: eso es un hueco.
        material: { etiqueta: 'Frame material', valor: 'Marine-grade powder-coated extruded aluminum' },
        // Fuente: las fotos (bronce oscuro, blanco) y `div.color-section`. «Champan» NO:
        // no esta en la carta (white, desert sand, almond sand, adobe clay, spanish brown,
        // bronze cedar), no lo dice el cliente en docs/vivo/, y ningun alt de foto lo ve.
        // Lo introdujo c0a1e1c y lo quito F4a: citaba esta paleta como su propia fuente.
        acabado: { etiqueta: 'Frame finish', valor: 'Dark bronze or white, from the powder-coat palette and wood-grain textures' },
        // Fuente: el bloque `feature` + la pregunta `material-sensor-lluvia-falla`.
        sensores: { etiqueta: 'Weather sensors', valor: 'Rain and wind sensors close the louvers automatically, and the automation can be switched off' },
        domotica: { etiqueta: 'Smart home', valor: 'Integrates with the main smart home platforms for voice control and scheduling' },
        // Fuente: el bloque `feature` + la pregunta `material-lamas-mecanismo`.
        desague: { etiqueta: 'Drainage', valor: 'Interlocking louvers, integrated gutter, downspout concealed inside the posts' },
        // Fuente: la pregunta `material-lamas-sin-luz`. Es el argumento mas fuerte de
        // la pagina y nadie en el sector lo publica.
        apagon: { etiqueta: 'In a power cut', valor: 'The louvers hold their last position; manual override or battery backup can be specified' },
        // Fuente: la pregunta `pergola-lamas-cuanto-duran`.
        motor: { etiqueta: 'Motor', valor: 'A serviceable component: reached and replaced without dismantling the roof' },
        // Fuente: la pregunta `plazo-diseno-montaje`. El repo da un TOTAL, no un
        // desglose por fase: cuatro plazos por paso serian cuatro cifras inventadas.
        plazo: { etiqueta: 'Timeline', valor: 'Several weeks from permit approval to completion; the installation itself, a few days once materials are ready' },
        // Fuente: la pregunta `precio-pergola-aluminio`, en su formulacion EXACTA.
        // No se traduce a un numero ni a un precio por pie cuadrado.
        inversion: { etiqueta: 'Investment', valor: 'Mid five figures upward, depending on size, motorization, integration features and structural requirements' },
        // Fuente: NEGOCIO.condados (src/lib/jsonld.ts) y el pie del sitio.
        donde: { etiqueta: 'Where we build, and under what licence', valor: 'Miami-Dade, Broward and Palm Beach County. CGC1539940, licensed and insured in Florida' },
      },
      huecos: {
        medidas: 'Maximum clear span and module sizes. We size every roof from the structural calculation for your site, and we do not publish a catalogue span.',
        viento: 'Design wind speed, design pressure and the Miami-Dade NOA number. Each structure is engineered and permitted for its own address; we are not publishing a single figure until it is the one on your drawings.',
        aleacion: 'Aluminium alloy, temper and wall thickness. This is what separates two pergolas that look identical, and it belongs on the engineering, not in a marketing line.',
        garantia: 'Warranty term, and how it splits between structure, motor and finish. On a motorised roof those are three different warranties and we are not going to blur them into one word.',
        financiacion: 'Financing terms. Ask us: we would rather tell you on the phone than publish a rate that changes.',
      },
      enlaces: {
        compensa: 'Is a louvered roof worth it in Florida?',
        plazo: 'How long a pergola installation takes in Florida',
        permiso: 'When a pergola needs a permit in South Florida',
        coste: 'What a pergola actually costs in South Florida',
        huracan: 'What makes a pergola hurricane-resistant here',
      },
    },
  },

  es: {
    'motorized-louvered-pergolas': {
      titulo: 'Especificaciones, huecos incluidos',
      entradilla: 'Todo lo que sigue es, o algo que podemos sostener hoy, o algo que todavía no publicamos, y decimos cuál es cuál. Si está pidiendo tres presupuestos, ésta es la parte que los otros dos no le van a poner por escrito.',
      huecosTitulo: 'Todavía no publicado',
      huecosEntradilla: 'Éstos son los números que un comprador debería pedirle a tres contratistas. Preferimos dejarlos en blanco antes que publicar uno que no podamos respaldar.',
      filas: {
        giro: { etiqueta: 'Giro de las lamas', valor: 'Del orden de 140 a 170 grados, según el sistema' },
        montaje: { etiqueta: 'Montaje', valor: 'Adosada a la casa, o exenta sobre deck o piscina' },
        // Coincide palabra por palabra con la respuesta 4 traducida de la ficha, que
        // es de donde sale `Product.material` en español.
        material: { etiqueta: 'Material de la estructura', valor: 'Aluminio extruido con recubrimiento en polvo de grado marino' },
        acabado: { etiqueta: 'Acabado de la estructura', valor: 'Bronce oscuro o blanco, de la carta de recubrimiento en polvo y las texturas tipo madera' },
        sensores: { etiqueta: 'Sensores', valor: 'Los sensores de lluvia y viento cierran las lamas solos, y la automatización se puede desactivar' },
        domotica: { etiqueta: 'Domótica', valor: 'Se integra con las principales plataformas domóticas, para voz y programación' },
        desague: { etiqueta: 'Desagüe', valor: 'Lamas que encajan entre sí, canalón integrado y bajante oculta por dentro de los pilares' },
        apagon: { etiqueta: 'Si se va la luz', valor: 'Las lamas mantienen la última posición; se puede especificar accionamiento manual o batería de respaldo' },
        motor: { etiqueta: 'Motor', valor: 'Componente sustituible: se llega a él y se cambia sin desmontar el techo' },
        plazo: { etiqueta: 'Plazo', valor: 'Varias semanas desde la aprobación del permiso hasta el final; el montaje en sí, unos pocos días cuando el material ya está' },
        inversion: { etiqueta: 'Inversión', valor: 'A partir de una cifra media de cinco dígitos, según el tamaño, la motorización, los extras y lo que pida el cálculo' },
        donde: { etiqueta: 'Dónde construimos, y con qué licencia', valor: 'Miami-Dade, Broward y Palm Beach. CGC1539940, con licencia y seguro en Florida' },
      },
      huecos: {
        medidas: 'Luz máxima sin columna intermedia y medidas de módulo. Cada techo se dimensiona a partir del cálculo estructural de su parcela, y no publicamos una luz de catálogo.',
        viento: 'Velocidad de viento de diseño, presión de diseño y número de NOA de Miami-Dade. Cada estructura se calcula y se permisa para su dirección; no publicamos una cifra única hasta que sea la que va en sus planos.',
        aleacion: 'Aleación de aluminio, temple y espesor de pared. Es lo que separa a dos pérgolas que parecen iguales, y su sitio está en el cálculo, no en una línea de marketing.',
        garantia: 'Años de garantía, y cómo se reparte entre estructura, motor y acabado. En un techo motorizado son tres garantías distintas y no las vamos a resumir en una palabra.',
        financiacion: 'Condiciones de financiación. Pregúntenos: preferimos decírselo por teléfono antes que publicar un tipo que cambia.',
      },
      enlaces: {
        compensa: '¿Compensa un techo de lamas en Florida?',
        plazo: 'Cuánto se tarda en instalar una pérgola en Florida',
        permiso: 'Cuándo lleva permiso una pérgola en el sur de Florida',
        coste: 'Lo que cuesta de verdad una pérgola en el sur de Florida',
        huracan: 'Qué hace que una pérgola aguante un huracán aquí',
      },
    },
  },
};

/**
 * Las filas de una ficha, ya resueltas a copy. Lo usan el componente que las pinta y
 * el grafo que las declara — UNA fuente, dos salidas, imposible que divergan.
 */
export function filasDe(idioma: Idioma, slug: string, ids: string[]): CopyFila[] {
  const copy = SPECS_COPY[idioma][slug];
  if (!copy) throw new Error(`[especificaciones] "${slug}" no tiene copy en ${idioma}`);
  return ids.map((id) => {
    const f = copy.filas[id];
    if (!f) throw new Error(`[especificaciones] ${slug}: la fila "${id}" no tiene copy en ${idioma}`);
    return f;
  });
}
