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
  /**
   * El boton que cierra la seccion, y por que existe.
   *
   * F4c midio el hueco: el pico de conviccion del lector esta en la pantalla 11,4
   * —donde estan el rango de inversion y el numero de licencia— y el siguiente CTA
   * del cuerpo estaba en la 18,03. SEIS PANTALLAS Y MEDIA de movil despues, gastadas
   * en repetir lo ya dicho. Este es el unico punto de la ficha donde el CTA es la
   * continuacion natural del parrafo anterior en vez de una interrupcion: la
   * entradilla de los huecos acaba de decir «estos son los numeros que un comprador
   * deberia pedirle a tres contratistas», y el boton dice «pidanoslos».
   *
   * POR QUE VA EN EL COPY Y NO FIJO EN EL COMPONENTE: el texto nombra el numero de
   * huecos que declara cada ficha, y ese numero cambia por producto. Un «pregunte-
   * nos estos cinco» en una ficha con tres huecos es una cifra equivocada, que es
   * exactamente el tipo de descuido que esta seccion existe para no cometer.
   */
  ctaTexto: string;
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
      ctaTexto: 'Ask us these five',
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
        estimador: 'Price your own project with our estimator',
      },
    },

    'solid-roof-pergolas': {
      titulo: 'Specifications, Including The Gaps',
      entradilla: 'Everything below is either something we can stand behind today or something we have not published yet, and we say which is which. If you are collecting three quotes, this is the part the other two will not put in writing.',
      huecosTitulo: 'Not published yet',
      huecosEntradilla: 'These are the numbers a buyer should ask three contractors for. We would rather leave them blank here than print one we cannot back up.',
      ctaTexto: 'Ask us these five',
      filas: {
        // Fuente: la pregunta `material-techo-aislado`. Sin espesor del nucleo, sin
        // valor R y sin densidad: nada de eso esta en el repo ni lo dice el cliente.
        panel: { etiqueta: 'Roof panel', valor: 'An insulating core bonded between two aluminum skins, which is what makes the panel structural and thermally useful at the same time' },
        // Fuente: las nueve fotos de obra, abiertas una a una. Cinco adosadas y cuatro
        // exentas; nada mas se puede afirmar del montaje.
        montaje: { etiqueta: 'Mounting', valor: 'Attached to the house, or freestanding over a patio or a lawn' },
        // Fuente: la pregunta `solid-roof-mantenimiento` («premium powder-coated
        // aluminum»). Sin aleacion, sin temple y sin espesor: eso es un hueco. Y sin
        // «grado marino», que es lo que afirma la ficha de lamas y aqui no dice nadie.
        material: { etiqueta: 'Frame material', valor: 'Powder-coated aluminum throughout, frame and panels' },
        // Fuente: `div.color-section` de la propia pagina (white, desert sand, almond
        // sand, adobe clay, spanish brown, bronze cedar) y «Textured Wood-Like
        // Finishes» de la carta del cliente. Los nombres NO se inventan y NO se
        // traducen como referencia de pedido.
        acabado: { etiqueta: 'Frame finish', valor: 'From the powder-coat palette, plain or in a wood-look texture' },
        // Fuente: «Integrated Ceiling Finishes» del cliente y la pregunta
        // `solid-roof-techo-visto`. Es lo que se ve en las fotos: techo continuo, sin
        // estructura vista por debajo.
        techo: { etiqueta: 'Ceiling', valor: 'A finished, continuous ceiling: the structure and the wiring stay hidden above the panels' },
        // Fuente: el chip del cliente «Hidden Gutter System» y la pregunta
        // `solid-roof-desague-oculto`.
        desague: { etiqueta: 'Drainage', valor: 'Interlocking panels draining into a gutter built into the beam, with nothing bolted on afterwards' },
        // Fuente: «Custom Lighting & Fan Integration» del cliente y la pregunta
        // `solid-roof-ventilador-tv`. Sin numero de circuitos ni de puntos de luz.
        instalaciones: { etiqueta: 'Fans, lighting and outlets', valor: 'Internal channels take the wiring, so fans, recessed lighting and outlets mount into the ceiling instead of being surface-run' },
        // Fuente: «Skylight Integration Capabilities» del cliente. Sin medidas y sin
        // numero de unidades: eso no lo dice nadie.
        lucernarios: { etiqueta: 'Skylights', valor: 'Weather-tight skylights can be designed into the panel layout, decided with the structure rather than added afterwards' },
        // Fuente: la pregunta `solid-roof-permiso-broward`. Se afirma el PROCESO —que
        // lo tramitamos y que va con calculo—, nunca un resultado normativo.
        permiso: { etiqueta: 'Permitting', valor: 'A permanent load-bearing structure, so it is permitted: we do the structural engineering and run the approval' },
        // Fuente: la pregunta `solid-roof-mantenimiento`, reescrita. La original decia
        // «Virtually none… will never rust, rot, or fade… keeps them pristine», que es
        // el registro que la seccion de huecos pasa cinco pantallas desmontando.
        mantenimiento: { etiqueta: 'Maintenance', valor: 'Powder-coated aluminum does not rust or rot; keeping the gutter channel clear is most of the routine' },
        // Fuente: la pregunta `plazo-diseno-montaje`. El repo da un TOTAL, no un
        // desglose por fase: cuatro plazos por paso serian cuatro cifras inventadas.
        plazo: { etiqueta: 'Timeline', valor: 'Several weeks from permit approval to completion; the installation itself, a few days once materials are ready' },
        // Fuente: la GUIA DE COSTES PUBLICADA POR LA PROPIA EMPRESA,
        // /post/pergola-cost-south-florida, «3. Insulated Roof Pergola — Estimated
        // Range: $95 – $130 per sq ft installed». Es la misma cifra que usa el
        // estimador (src/data/estimador.ts, `fuente: 'publicada'`). El hedge
        // «estimated» del original se conserva: sin el pasa de guia a presupuesto.
        inversion: { etiqueta: 'Investment', valor: 'An estimated $95 to $130 per square foot installed, from our own published South Florida cost guide' },
        // Fuente: NEGOCIO.condados (src/lib/jsonld.ts) y el pie del sitio.
        donde: { etiqueta: 'Where we build, and under what licence', valor: 'Miami-Dade, Broward and Palm Beach County. CGC1539940, licensed and insured in Florida' },
      },
      huecos: {
        medidas: 'Maximum clear span and module sizes. We size every roof from the structural calculation for your site, and we do not publish a catalogue span.',
        viento: 'Design wind speed, design pressure and the Miami-Dade NOA number. Each structure is engineered and permitted for its own address; we are not publishing a single figure until it is the one on your drawings.',
        aleacion: 'Aluminium alloy, temper and panel thickness. This is what separates two roofs that look identical, and it belongs on the engineering, not in a marketing line.',
        garantia: 'Warranty term, and how it splits between structure, panels and finish. Those are three different warranties and we are not going to blur them into one word.',
        financiacion: 'Financing terms. Ask us: we would rather tell you on the phone than publish a rate that changes.',
      },
      enlaces: {
        compensa: 'Is a louvered roof worth it in Florida?',
        plazo: 'How long a pergola installation takes in Florida',
        permiso: 'When a pergola needs a permit in South Florida',
        coste: 'What a pergola actually costs in South Florida',
        huracan: 'What makes a pergola hurricane-resistant here',
        estimador: 'Price your own project with our estimator',
      },
    },

    'motorized-screens': {
      titulo: 'Specifications, Including The Gaps',
      entradilla: 'Everything below is either something we can stand behind today or something we have not published yet, and we say which is which. If you are collecting three quotes, this is the part the other two will not put in writing.',
      huecosTitulo: 'Not published yet',
      huecosEntradilla: 'These are the numbers a buyer should ask three contractors for. We would rather leave them blank here than print one we cannot back up.',
      ctaTexto: 'Ask us these five',
      filas: {
        // Fuente: «Weather-Resistant Mesh Options» de la carta del cliente y la
        // pregunta `material-cortinas-privacidad`. Sin factor de apertura: eso es hueco.
        malla: { etiqueta: 'Mesh', valor: 'Solar mesh that cuts glare and heat while you still see out, or a denser fabric where the opening needs privacy' },
        // Fuente: la respuesta 1 de la ficha y «Smart Home Compatibility».
        control: { etiqueta: 'Control', valor: 'Remote, wall switch or the smart home app' },
        // Fuente: la pregunta `material-cortinas-viento`, en su formulacion exacta. El
        // «no es una persiana de huracan» NO se quita: es lo unico honesto que se puede
        // decir sin el numero, y el numero es un hueco.
        viento: { etiqueta: 'In wind', valor: 'Every system has a wind speed above which it should be retracted, and it can retract itself on a wind sensor. It is a shade product, not a hurricane shutter' },
        // Fuente: «Obstacle Detection Technology» de la carta del cliente.
        obstaculo: { etiqueta: 'Obstacle detection', valor: 'Sensors stop the screen on the way down if something is in the way' },
        // Fuente: «Concealed Housing Design» y la respuesta 4 de la ficha.
        carcasa: { etiqueta: 'Housing', valor: 'Retracts into a concealed aluminum cassette, with the fabric running in side tracks' },
        // Fuente: las fotos de obra, abiertas una a una, y «Custom Sizing & Configurations».
        montaje: { etiqueta: 'Where they go', valor: 'Into a pergola bay, a lanai opening or a covered patio, new or existing' },
        // Fuente: la pregunta `pergola-cortinas-instalar-despues`.
        retrofit: { etiqueta: 'Retrofit', valor: 'Often possible on a structure you already have: it needs somewhere solid for the cassette and the tracks, a straight opening, and a power route' },
        material: { etiqueta: 'Housing material', valor: 'Powder-coated aluminum housing and tracks' },
        // Fuente: «Customize housing and track colors» de la carta del cliente.
        acabado: { etiqueta: 'Finish', valor: 'Housing and track colours from the powder-coat palette, to disappear into the structure' },
        plazo: { etiqueta: 'Timeline', valor: 'Several weeks from permit approval to completion; the installation itself, a few days once materials are ready' },
        // SIN CIFRA A PROPOSITO: el estimador lleva las cortinas como extra y con
        // `fuente: 'mercado'`, que su propio modulo marca como «necesita firma».
        inversion: { etiqueta: 'Investment', valor: 'Priced per opening, by width and drop and by the fabric — our estimator gives a working range before you call anyone' },
        donde: { etiqueta: 'Where we build, and under what licence', valor: 'Miami-Dade, Broward and Palm Beach County. CGC1539940, licensed and insured in Florida' },
      },
      huecos: {
        tejido: 'The openness factor of the mesh, and the fabric reference. That single number is what separates two screens that look identical on a photograph, and we are not printing one until it is the one on your quote.',
        viento: 'The rated wind speed of the system we would put on your opening. It exists, it is on the manufacturer data sheet for that model, and it belongs there rather than in a headline.',
        medidas: 'Maximum width and drop for a single screen. Every opening is measured; we do not publish a catalogue maximum.',
        garantia: 'Warranty term, and how it splits between motor, fabric and housing. Those are three different warranties and we are not going to blur them into one word.',
        financiacion: 'Financing terms. Ask us: we would rather tell you on the phone than publish a rate that changes.',
      },
      enlaces: {
        plazo: 'How long a pergola installation takes in Florida',
        coste: 'What a pergola actually costs in South Florida',
        huracan: 'What makes a pergola hurricane-resistant here',
        estimador: 'Price your own project with our estimator',
      },
    },

    'polycarbonate-pergolas': {
      titulo: 'Specifications, Including The Gaps',
      entradilla: 'Everything below is either something we can stand behind today or something we have not published yet, and we say which is which. If you are collecting three quotes, this is the part the other two will not put in writing.',
      huecosTitulo: 'Not published yet',
      huecosEntradilla: 'These are the numbers a buyer should ask three contractors for. We would rather leave them blank here than print one we cannot back up.',
      ctaTexto: 'Ask us these five',
      filas: {
        // Fuente: la pregunta `material-policarbonato-ruido` («Multiwall panels are
        // quieter than single-skin, because the air chambers damp the impact»).
        panel: { etiqueta: 'Panel', valor: 'Multiwall polycarbonate: two skins with air chambers between them, not a single flat sheet' },
        // Fuente: la pregunta `material-policarbonato-vida`. El «solo funciona hacia
        // fuera» NO se quita: es el dato que decide si el panel dura lo que dice.
        uv: { etiqueta: 'UV layer', valor: 'A co-extruded UV layer with a manufacturer warranty against yellowing. It only works facing out, so orientation at installation matters' },
        // Fuente: «UV-Blocking Translucent Panels» y «Thermal Reflective Coating
        // Options» de la carta del cliente. El 99 % lo publica el cliente en su propia
        // respuesta 1, asi que se cita como suyo y no se repite como afirmacion nuestra.
        luz: { etiqueta: 'Light and heat', valor: 'Daylight through, with tint levels to set how much; a thermal reflective coating is available where the heat matters more than the brightness' },
        // Fuente: la pregunta `material-policarbonato-ruido`, verbatim en su sentido.
        ruido: { etiqueta: 'In the rain', valor: 'Louder than an insulated solid roof: it is a thin panel and rain drums on it. Multiwall damps it, but it does not remove it' },
        montaje: { etiqueta: 'Mounting', valor: 'Attached to the house, or freestanding over a deck or a patio' },
        // Fuente: «Aluminum Reinforced Frame» del cliente y la nota de
        // src/data/estimador.ts: es la MISMA estructura que la open-air.
        estructura: { etiqueta: 'Frame', valor: 'Powder-coated extruded aluminum, the same engineered structure we put under an open-air pergola' },
        // Fuente: `div.color-section` de la propia pagina y «Custom Tint & Finish
        // Options» del cliente.
        acabado: { etiqueta: 'Finish', valor: 'Frame colours from the powder-coat palette, with panel tints chosen to match' },
        desague: { etiqueta: 'Drainage', valor: 'The panels sit in a gutter profile built into the frame, so the roof drains at its edge' },
        plazo: { etiqueta: 'Timeline', valor: 'Several weeks from permit approval to completion; the installation itself, a few days once materials are ready' },
        // SIN CIFRA: el estimador la da como derivada de la open-air, con
        // `fuente: 'mercado'`, y su propio modulo la marca como pendiente de firma.
        inversion: { etiqueta: 'Investment', valor: 'Between an open-air pergola and an insulated roof: the frame is the same, the panel is the difference. Our estimator gives a working range' },
        donde: { etiqueta: 'Where we build, and under what licence', valor: 'Miami-Dade, Broward and Palm Beach County. CGC1539940, licensed and insured in Florida' },
      },
      huecos: {
        espesor: 'Panel thickness, wall count and the light transmission figure for the tint you choose. Those three decide what the roof actually does, and they are on the panel data sheet rather than in a headline.',
        viento: 'Design wind speed, design pressure and the Miami-Dade NOA number. Each structure is engineered and permitted for its own address; we are not publishing a single figure until it is the one on your drawings.',
        garantia: 'Warranty term, and how it splits between the frame and the panel. Those are two different warranties from two different manufacturers and we are not going to blur them into one word.',
        medidas: 'Maximum clear span and panel run. We size every roof from the structural calculation for your site, and we do not publish a catalogue span.',
        financiacion: 'Financing terms. Ask us: we would rather tell you on the phone than publish a rate that changes.',
      },
      enlaces: {
        plazo: 'How long a pergola installation takes in Florida',
        permiso: 'When a pergola needs a permit in South Florida',
        coste: 'What a pergola actually costs in South Florida',
        huracan: 'What makes a pergola hurricane-resistant here',
        estimador: 'Price your own project with our estimator',
      },
    },

    'open-air-pergolas': {
      titulo: 'Specifications, Including The Gaps',
      entradilla: 'Everything below is either something we can stand behind today or something we have not published yet, and we say which is which. If you are collecting three quotes, this is the part the other two will not put in writing.',
      huecosTitulo: 'Not published yet',
      huecosEntradilla: 'These are the numbers a buyer should ask three contractors for. We would rather leave them blank here than print one we cannot back up.',
      ctaTexto: 'Ask us these five',
      filas: {
        // Fuente: la pregunta `pergola-cuanta-sombra`. Sin porcentaje de sombra: eso
        // depende del reparto de lamas y de la orientacion, y no lo publica nadie.
        sombra: { etiqueta: 'Shade', valor: 'Fixed slats block sun by angle: less at midday, more morning and evening. Depth and spacing are sized for the direction your patio faces' },
        // Fuente: la pregunta `pergola-lluvia-abierta`, verbatim en su sentido. Es una
        // fila que dice que NO, y es la mas util de la seccion.
        lluvia: { etiqueta: 'In the rain', valor: 'It sheds nothing. An open slat roof is not a rain roof — that is the trade for the light and the airflow' },
        montaje: { etiqueta: 'Mounting', valor: 'Attached to the house, or freestanding over a deck or a lawn' },
        // Fuente: la respuesta 2 de la ficha, TEXTUAL en su sustancia.
        material: { etiqueta: 'Frame material', valor: 'Extruded powder-coated aluminum, never wood' },
        acabado: { etiqueta: 'Frame finish', valor: 'From the powder-coat palette, plain or in a wood-look texture' },
        // Fuente: «Integrated Lighting Options» del cliente y la respuesta 3.
        iluminacion: { etiqueta: 'Lighting', valor: 'LED can be integrated into the beams and rafters, with the wiring inside the structure' },
        // Fuente: las fotos de obra, en las que aparece en cuatro de las diez.
        privacidad: { etiqueta: 'Privacy screens', valor: 'Slatted screens can close one or more sides where the space needs it' },
        // Fuente: la respuesta 2 de la ficha. «Cero mantenimiento» NO: lo que se
        // sostiene es que no se pudre, no se alabea y no hay que barnizarlo.
        mantenimiento: { etiqueta: 'Maintenance', valor: 'It does not rot, warp or need staining. An occasional rinse is the routine' },
        plazo: { etiqueta: 'Timeline', valor: 'Several weeks from permit approval to completion; the installation itself, a few days once materials are ready' },
        // Fuente: la GUIA DE COSTES PUBLICADA POR LA EMPRESA, /post/pergola-cost-south-florida:
        // «1. Open-Air Aluminum Pergola — Estimated Range: $85 – $110 per sq ft installed».
        // Misma cifra que el estimador con `fuente: 'publicada'`. El «estimated» se queda.
        inversion: { etiqueta: 'Investment', valor: 'An estimated $85 to $110 per square foot installed, from our own published South Florida cost guide' },
        donde: { etiqueta: 'Where we build, and under what licence', valor: 'Miami-Dade, Broward and Palm Beach County. CGC1539940, licensed and insured in Florida' },
      },
      huecos: {
        medidas: 'Maximum clear span, slat depth and slat spacing for your layout. We size every frame from the structural calculation for your site, and we do not publish a catalogue span.',
        viento: 'Design wind speed, design pressure and the Miami-Dade NOA number. Each structure is engineered and permitted for its own address; we are not publishing a single figure until it is the one on your drawings.',
        aleacion: 'Aluminium alloy, temper and wall thickness. This is what separates two pergolas that look identical, and it belongs on the engineering, not in a marketing line.',
        garantia: 'Warranty term, and how it splits between structure and finish. Those are two different warranties and we are not going to blur them into one word.',
        financiacion: 'Financing terms. Ask us: we would rather tell you on the phone than publish a rate that changes.',
      },
      enlaces: {
        compensa: 'Is a louvered roof worth it in Florida?',
        plazo: 'How long a pergola installation takes in Florida',
        permiso: 'When a pergola needs a permit in South Florida',
        coste: 'What a pergola actually costs in South Florida',
        huracan: 'What makes a pergola hurricane-resistant here',
        estimador: 'Price your own project with our estimator',
      },
    },
  },

  es: {
    'motorized-louvered-pergolas': {
      titulo: 'Especificaciones, huecos incluidos',
      entradilla: 'Todo lo que sigue es, o algo que podemos sostener hoy, o algo que todavía no publicamos, y decimos cuál es cuál. Si está pidiendo tres presupuestos, ésta es la parte que los otros dos no le van a poner por escrito.',
      huecosTitulo: 'Todavía no publicado',
      huecosEntradilla: 'Éstos son los números que un comprador debería pedirle a tres contratistas. Preferimos dejarlos en blanco antes que publicar uno que no podamos respaldar.',
      ctaTexto: 'Pregúntenos estos cinco',
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
        estimador: 'Ponga precio a su proyecto con nuestro estimador',
      },
    },

    'solid-roof-pergolas': {
      titulo: 'Especificaciones, huecos incluidos',
      entradilla: 'Todo lo que sigue es, o algo que podemos sostener hoy, o algo que todavía no publicamos, y decimos cuál es cuál. Si está pidiendo tres presupuestos, esta es la parte que los otros dos no le van a poner por escrito.',
      huecosTitulo: 'Todavía no publicado',
      huecosEntradilla: 'Estos son los números que un comprador debería pedirle a tres contratistas. Preferimos dejarlos en blanco antes que publicar uno que no podamos respaldar.',
      ctaTexto: 'Pregúntenos estos cinco',
      filas: {
        panel: { etiqueta: 'Panel de cubierta', valor: 'Un núcleo aislante encolado entre dos chapas de aluminio, que es lo que hace el panel estructural y térmicamente útil a la vez' },
        montaje: { etiqueta: 'Montaje', valor: 'Adosada a la casa, o exenta sobre el patio o el césped' },
        material: { etiqueta: 'Material de la estructura', valor: 'Aluminio con recubrimiento en polvo, estructura y paneles' },
        acabado: { etiqueta: 'Acabado de la estructura', valor: 'De la carta de recubrimiento en polvo, liso o con textura tipo madera' },
        techo: { etiqueta: 'Techo', valor: 'Un techo acabado y continuo: la estructura y el cableado quedan ocultos por encima de los paneles' },
        desague: { etiqueta: 'Desagüe', valor: 'Paneles que encajan entre sí y desaguan por un canalón integrado en la viga, sin nada atornillado por fuera' },
        instalaciones: { etiqueta: 'Ventiladores, luz y enchufes', valor: 'Canales interiores para el cableado, así que los ventiladores, los focos empotrados y los enchufes van montados en el techo y no por fuera' },
        lucernarios: { etiqueta: 'Tragaluces', valor: 'Se pueden diseñar tragaluces estancos dentro del reparto de paneles, decididos con la estructura y no añadidos después' },
        permiso: { etiqueta: 'Permisos', valor: 'Es una estructura permanente que trabaja: lleva permiso, y nosotros hacemos el cálculo estructural y tramitamos la aprobación' },
        mantenimiento: { etiqueta: 'Mantenimiento', valor: 'El aluminio con recubrimiento en polvo no se oxida ni se pudre; mantener limpio el canalón es casi toda la rutina' },
        plazo: { etiqueta: 'Plazo', valor: 'Varias semanas desde la aprobación del permiso hasta el final; el montaje en sí, unos pocos días cuando el material ya está' },
        // Misma fuente que en inglés: la guía de costes publicada por la empresa. El
        // «estimada» traduce el «estimated» del original y no se quita: sin él, la
        // banda pasa de guía a presupuesto.
        inversion: { etiqueta: 'Inversión', valor: 'Una banda estimada de 95 a 130 dólares por pie cuadrado instalado, de nuestra propia guía de costes del sur de Florida' },
        donde: { etiqueta: 'Dónde construimos, y con qué licencia', valor: 'Miami-Dade, Broward y Palm Beach. CGC1539940, con licencia y seguro en Florida' },
      },
      huecos: {
        medidas: 'Luz máxima sin columna intermedia y medidas de módulo. Cada cubierta se dimensiona a partir del cálculo estructural de su parcela, y no publicamos una luz de catálogo.',
        viento: 'Velocidad de viento de diseño, presión de diseño y número de NOA de Miami-Dade. Cada estructura se calcula y se permisa para su propia dirección; no vamos a publicar ni una cifra hasta que sea la de sus planos.',
        aleacion: 'Aleación del aluminio, temple y espesor del panel. Es lo que separa dos cubiertas que parecen iguales, y su sitio es el cálculo, no una línea de marketing.',
        garantia: 'Años de garantía, y cómo se reparte entre estructura, paneles y acabado. Son tres garantías distintas y no las vamos a resumir en una palabra.',
        financiacion: 'Condiciones de financiación. Pregúntenos: preferimos decírselo por teléfono antes que publicar un tipo que cambia.',
      },
      enlaces: {
        compensa: '¿Compensa un techo de lamas en Florida?',
        plazo: 'Cuánto se tarda en instalar una pérgola en Florida',
        permiso: 'Cuándo lleva permiso una pérgola en el sur de Florida',
        coste: 'Lo que cuesta de verdad una pérgola en el sur de Florida',
        huracan: 'Qué hace que una pérgola aguante un huracán aquí',
        estimador: 'Ponga precio a su proyecto con nuestro estimador',
      },
    },

    'motorized-screens': {
      titulo: 'Especificaciones, huecos incluidos',
      entradilla: 'Todo lo que sigue es, o algo que podemos sostener hoy, o algo que todavía no publicamos, y decimos cuál es cuál. Si está pidiendo tres presupuestos, esta es la parte que los otros dos no le van a poner por escrito.',
      huecosTitulo: 'Todavía no publicado',
      huecosEntradilla: 'Estos son los números que un comprador debería pedirle a tres contratistas. Preferimos dejarlos en blanco antes que publicar uno que no podamos respaldar.',
      ctaTexto: 'Pregúntenos estos cinco',
      filas: {
        malla: { etiqueta: 'Malla', valor: 'Malla solar que corta el reflejo y el calor dejándole ver hacia fuera, o un tejido más tupido donde el hueco pida privacidad' },
        control: { etiqueta: 'Control', valor: 'Control remoto, interruptor de pared o la app de domótica' },
        viento: { etiqueta: 'Con viento', valor: 'Cada sistema tiene una velocidad de viento por encima de la cual hay que recogerlo, y puede recogerse solo con un sensor de viento. Es un producto de sombra, no una persiana de huracán' },
        obstaculo: { etiqueta: 'Detección de obstáculos', valor: 'Los sensores paran la cortina al bajar si hay algo en medio' },
        carcasa: { etiqueta: 'Carcasa', valor: 'Se recoge en un cajón de aluminio oculto, con el tejido corriendo por guías laterales' },
        montaje: { etiqueta: 'Dónde van', valor: 'En un vano de pérgola, en la abertura de un porche o en un patio cubierto, nuevo o existente' },
        retrofit: { etiqueta: 'Instalación posterior', valor: 'Muchas veces se puede sobre lo que ya tiene: hace falta dónde anclar el cajón y las guías, un hueco recto y por dónde llevar la corriente' },
        material: { etiqueta: 'Material de la carcasa', valor: 'Cajón y guías de aluminio con recubrimiento en polvo' },
        acabado: { etiqueta: 'Acabado', valor: 'Colores de cajón y guías de la carta de recubrimiento en polvo, para que desaparezcan en la estructura' },
        plazo: { etiqueta: 'Plazo', valor: 'Varias semanas desde la aprobación del permiso hasta el final; el montaje en sí, unos pocos días cuando el material ya está' },
        inversion: { etiqueta: 'Inversión', valor: 'Se cotiza por hueco, según el ancho, la caída y el tejido — nuestro estimador da una banda de trabajo antes de que llame a nadie' },
        donde: { etiqueta: 'Dónde construimos, y con qué licencia', valor: 'Miami-Dade, Broward y Palm Beach. CGC1539940, con licencia y seguro en Florida' },
      },
      huecos: {
        tejido: 'El factor de apertura de la malla y la referencia del tejido. Ese número es lo que separa dos cortinas que en una foto parecen iguales, y no vamos a publicar uno hasta que sea el de su presupuesto.',
        viento: 'La velocidad de viento homologada del sistema que pondríamos en su hueco. Existe, está en la ficha técnica del fabricante de ese modelo, y su sitio es esa ficha y no un titular.',
        medidas: 'Ancho y caída máximos de una sola cortina. Cada hueco se mide; no publicamos un máximo de catálogo.',
        garantia: 'Años de garantía, y cómo se reparte entre motor, tejido y carcasa. Son tres garantías distintas y no las vamos a resumir en una palabra.',
        financiacion: 'Condiciones de financiación. Pregúntenos: preferimos decírselo por teléfono antes que publicar un tipo que cambia.',
      },
      enlaces: {
        plazo: 'Cuánto se tarda en instalar una pérgola en Florida',
        coste: 'Lo que cuesta de verdad una pérgola en el sur de Florida',
        huracan: 'Qué hace que una pérgola aguante un huracán aquí',
        estimador: 'Ponga precio a su proyecto con nuestro estimador',
      },
    },

    'polycarbonate-pergolas': {
      titulo: 'Especificaciones, huecos incluidos',
      entradilla: 'Todo lo que sigue es, o algo que podemos sostener hoy, o algo que todavía no publicamos, y decimos cuál es cuál. Si está pidiendo tres presupuestos, esta es la parte que los otros dos no le van a poner por escrito.',
      huecosTitulo: 'Todavía no publicado',
      huecosEntradilla: 'Estos son los números que un comprador debería pedirle a tres contratistas. Preferimos dejarlos en blanco antes que publicar uno que no podamos respaldar.',
      ctaTexto: 'Pregúntenos estos cinco',
      filas: {
        panel: { etiqueta: 'Panel', valor: 'Policarbonato de pared múltiple: dos caras con cámaras de aire entre ellas, no una lámina lisa' },
        uv: { etiqueta: 'Capa UV', valor: 'Una capa UV coextruida con garantía del fabricante contra el amarilleo. Solo funciona hacia fuera, así que la orientación en el montaje importa' },
        luz: { etiqueta: 'Luz y calor', valor: 'Deja pasar la luz del día, con niveles de tinte para decidir cuánta; hay revestimiento térmico reflectante cuando pesa más el calor que la claridad' },
        ruido: { etiqueta: 'Con lluvia', valor: 'Más ruidoso que una cubierta maciza aislada: es un panel fino y la lluvia repica en él. La pared múltiple lo amortigua, pero no lo quita' },
        montaje: { etiqueta: 'Montaje', valor: 'Adosada a la casa, o exenta sobre una terraza o un patio' },
        estructura: { etiqueta: 'Estructura', valor: 'Aluminio extruido con recubrimiento en polvo, la misma estructura calculada que ponemos bajo una pérgola de estructura abierta' },
        acabado: { etiqueta: 'Acabado', valor: 'Colores de estructura de la carta de recubrimiento en polvo, con el tinte del panel elegido a juego' },
        desague: { etiqueta: 'Desagüe', valor: 'Los paneles apoyan en un perfil-canalón integrado en la estructura, así que la cubierta desagua por su borde' },
        plazo: { etiqueta: 'Plazo', valor: 'Varias semanas desde la aprobación del permiso hasta el final; el montaje en sí, unos pocos días cuando el material ya está' },
        inversion: { etiqueta: 'Inversión', valor: 'Entre una pérgola de estructura abierta y una cubierta maciza aislada: la estructura es la misma, el panel es la diferencia. Nuestro estimador da una banda de trabajo' },
        donde: { etiqueta: 'Dónde construimos, y con qué licencia', valor: 'Miami-Dade, Broward y Palm Beach. CGC1539940, con licencia y seguro en Florida' },
      },
      huecos: {
        espesor: 'Espesor del panel, número de paredes y transmisión de luz del tinte que elija. Esas tres cosas deciden lo que hace de verdad la cubierta, y están en la ficha técnica del panel, no en un titular.',
        viento: 'Velocidad de viento de diseño, presión de diseño y número de NOA de Miami-Dade. Cada estructura se calcula y se permisa para su propia dirección; no vamos a publicar ni una cifra hasta que sea la de sus planos.',
        garantia: 'Años de garantía, y cómo se reparte entre la estructura y el panel. Son dos garantías distintas de dos fabricantes distintos y no las vamos a resumir en una palabra.',
        medidas: 'Luz máxima sin columna intermedia y longitud de panel. Cada cubierta se dimensiona a partir del cálculo estructural de su parcela, y no publicamos una luz de catálogo.',
        financiacion: 'Condiciones de financiación. Pregúntenos: preferimos decírselo por teléfono antes que publicar un tipo que cambia.',
      },
      enlaces: {
        plazo: 'Cuánto se tarda en instalar una pérgola en Florida',
        permiso: 'Cuándo lleva permiso una pérgola en el sur de Florida',
        coste: 'Lo que cuesta de verdad una pérgola en el sur de Florida',
        huracan: 'Qué hace que una pérgola aguante un huracán aquí',
        estimador: 'Ponga precio a su proyecto con nuestro estimador',
      },
    },

    'open-air-pergolas': {
      titulo: 'Especificaciones, huecos incluidos',
      entradilla: 'Todo lo que sigue es, o algo que podemos sostener hoy, o algo que todavía no publicamos, y decimos cuál es cuál. Si está pidiendo tres presupuestos, esta es la parte que los otros dos no le van a poner por escrito.',
      huecosTitulo: 'Todavía no publicado',
      huecosEntradilla: 'Estos son los números que un comprador debería pedirle a tres contratistas. Preferimos dejarlos en blanco antes que publicar uno que no podamos respaldar.',
      ctaTexto: 'Pregúntenos estos cinco',
      filas: {
        sombra: { etiqueta: 'Sombra', valor: 'Las lamas fijas cortan el sol por ángulo: menos al mediodía, más por la mañana y por la tarde. El canto y la separación se dimensionan según hacia dónde da su patio' },
        lluvia: { etiqueta: 'Con lluvia', valor: 'No para nada de agua. Un techo de lamas abierto no es un techo de lluvia: ese es el intercambio por la luz y la ventilación' },
        montaje: { etiqueta: 'Montaje', valor: 'Adosada a la casa, o exenta sobre una terraza o el césped' },
        material: { etiqueta: 'Material de la estructura', valor: 'Aluminio extruido con recubrimiento en polvo, nunca madera' },
        acabado: { etiqueta: 'Acabado de la estructura', valor: 'De la carta de recubrimiento en polvo, liso o con textura tipo madera' },
        iluminacion: { etiqueta: 'Iluminación', valor: 'Se puede integrar LED en las vigas y en los travesaños, con el cableado por dentro de la estructura' },
        privacidad: { etiqueta: 'Celosías', valor: 'Se pueden cerrar uno o más lados con celosías donde el espacio lo pida' },
        mantenimiento: { etiqueta: 'Mantenimiento', valor: 'No se pudre, no se alabea y no hay que barnizarla. Un enjuague de vez en cuando es toda la rutina' },
        plazo: { etiqueta: 'Plazo', valor: 'Varias semanas desde la aprobación del permiso hasta el final; el montaje en sí, unos pocos días cuando el material ya está' },
        inversion: { etiqueta: 'Inversión', valor: 'Una banda estimada de 85 a 110 dólares por pie cuadrado instalado, de nuestra propia guía de costes del sur de Florida' },
        donde: { etiqueta: 'Dónde construimos, y con qué licencia', valor: 'Miami-Dade, Broward y Palm Beach. CGC1539940, con licencia y seguro en Florida' },
      },
      huecos: {
        medidas: 'Luz máxima sin columna intermedia, canto de lama y separación para su distribución. Cada estructura se dimensiona a partir del cálculo de su parcela, y no publicamos una luz de catálogo.',
        viento: 'Velocidad de viento de diseño, presión de diseño y número de NOA de Miami-Dade. Cada estructura se calcula y se permisa para su propia dirección; no vamos a publicar ni una cifra hasta que sea la de sus planos.',
        aleacion: 'Aleación del aluminio, temple y espesor de pared. Es lo que separa dos pérgolas que parecen iguales, y su sitio es el cálculo, no una línea de marketing.',
        garantia: 'Años de garantía, y cómo se reparte entre estructura y acabado. Son dos garantías distintas y no las vamos a resumir en una palabra.',
        financiacion: 'Condiciones de financiación. Pregúntenos: preferimos decírselo por teléfono antes que publicar un tipo que cambia.',
      },
      enlaces: {
        compensa: '¿Compensa un techo de lamas en Florida?',
        plazo: 'Cuánto se tarda en instalar una pérgola en Florida',
        permiso: 'Cuándo lleva permiso una pérgola en el sur de Florida',
        coste: 'Lo que cuesta de verdad una pérgola en el sur de Florida',
        huracan: 'Qué hace que una pérgola aguante un huracán aquí',
        estimador: 'Ponga precio a su proyecto con nuestro estimador',
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
