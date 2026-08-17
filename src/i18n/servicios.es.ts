/**
 * Las 7 páginas de servicio en español.
 *
 * Cada entrada trae el `<head>` y su diccionario. Lo compartido —el bloque «Our
 * Process», las 10 tarjetas de proyecto, los encabezados recurrentes, el CTA final—
 * vive en `comun.es.ts` y se combina en la ruta: aquí solo va lo propio de cada
 * servicio, que son unas 30 cadenas por página en vez de 90.
 *
 * Registro de South Florida, no traducción literal. Los nombres de producto y de
 * marca no se tocan.
 *
 * Añadir un servicio traducido es una entrada aquí + su ruta en `TRADUCIDAS`
 * (src/i18n/rutas.mjs). Lo que no esté no existe en /es/.
 */

export interface ServicioEs {
  /** Nombre corto, para las migas y el JSON-LD. */
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

export const SERVICIOS_ES: Record<string, ServicioEs> = {
  pavers: {
    nombre: 'Adoquinado',
    title: 'Adoquinado de lujo | Sur de Florida',
    description: 'Patios, bordes de piscina y entradas de coche adoquinados sobre bases calculadas, con el drenaje que pide la lluvia de Florida.',
    dic: {
      'Paver Installation': 'Instalación de adoquinado',
      'Luxury Paver Installation in South Florida': 'Adoquinado de lujo en el sur de Florida',
      'Pergola Plus Florida provides premium paver installation services throughout Palm Beach and Broward County for high-end residential properties. From pool decks and patios to expansive outdoor entertainment areas, our paver systems are engineered for structural integrity, proper drainage, and long-term performance. If you&#x27;re searching for professional paver contractors in South Florida, our team delivers custom-designed surfaces that enhance curb appeal and withstand Florida’s heavy rain and sun exposure. We focus on permanent, professionally installed solutions that elevate your entire outdoor living environment.':
        'Pergola Plus Florida instala adoquinado de gama alta en Palm Beach y Broward para viviendas de alto nivel. Desde bordes de piscina y patios hasta grandes zonas de estar al aire libre, nuestros sistemas se calculan para aguantar, drenar bien y durar. Si busca profesionales del adoquinado en el sur de Florida, nuestro equipo hace superficies a medida que mejoran la fachada y resisten las lluvias fuertes y el sol de Florida. Buscamos soluciones permanentes y bien instaladas que eleven todo su espacio exterior.',
      'We design and install premium paver systems for luxury homes throughout Palm Beach and Broward County. Our custom patios, pool decks, and hardscape surfaces are built on reinforced foundations engineered for drainage performance and long-term structural stability.':
        'Diseñamos e instalamos adoquinado de gama alta para viviendas de lujo en Palm Beach y Broward. Nuestros patios, bordes de piscina y superficies de hardscape se levantan sobre bases reforzadas, calculadas para drenar bien y mantenerse estables con los años.',
      'Engineered Base Preparation': 'Preparación de la base',
      'Built on Structural Integrity': 'Se empieza por abajo',
      'We install high-performance concrete and stone pavers designed for strength, color retention, and long-term wear resistance. Selected for upscale residential properties, our materials resist fading, cracking, and moisture damage while delivering refined finishes that elevate curb appeal and outdoor living spaces.':
        'Instalamos adoquines de hormigón y piedra de alto rendimiento, elegidos por su resistencia, por cómo mantienen el color y por cómo aguantan el uso. Pensados para viviendas de alto nivel, resisten la decoloración, las grietas y la humedad, con acabados cuidados que mejoran la fachada y el espacio exterior.',
      'Premium-Grade Paver Materials': 'Adoquines de primera',
      'Durability Meets Architectural Design': 'Durabilidad con buen diseño',
      'Advanced Drainage Solutions': 'Drenaje bien resuelto',
      'Designed for Florida’s Heavy Rainfall': 'Pensado para las lluvias de Florida',
      'Proper drainage is critical in South Florida’s climate. We design paver systems with grading precision, permeable solutions, and integrated drainage channels to prevent water pooling and surface damage. Every installation protects both the hardscape and the surrounding foundation.':
        'En el clima del sur de Florida el drenaje lo es todo. Diseñamos el adoquinado con las pendientes medidas, soluciones permeables y canales integrados para que no se acumule agua ni se estropee la superficie. Cada instalación protege tanto el pavimento como la cimentación de alrededor.',
      'Precision Edge Restraint &amp; Reinforcement': 'Bordes y refuerzo con precisión',
      'Preventing Shifting and Separation': 'Que no se mueva ni se abra',
      'We install reinforced edge restraints and interlocking systems that maintain structural alignment over time. This prevents lateral movement, uneven settling, and joint separation — common issues in low-cost installations. Our method ensures long-term surface stability and aesthetic consistency.':
        'Instalamos bordes de contención reforzados y sistemas de traba que mantienen la alineación con el tiempo. Eso evita los desplazamientos laterales, los asentamientos desiguales y las juntas abiertas, que es lo que suele pasar en las instalaciones baratas. Así la superficie se mantiene estable y con buen aspecto.',
      'Custom Layout &amp; Design Integration': 'Trazado a medida e integración',
      'Architectural Outdoor Cohesion': 'Un exterior que va junto',
      'Every paver installation is custom designed to integrate seamlessly with pergolas, decks, driveways, and pool areas. We consider flow, elevation, material tone, and property aesthetics to create cohesive outdoor environments. The result is not just a surface upgrade — it’s a fully integrated outdoor transformation.':
        'Cada adoquinado se diseña a medida para integrarse con las pérgolas, los decks, la entrada de coche y la zona de piscina. Tenemos en cuenta los recorridos, los desniveles, el tono del material y la estética de la casa para que el exterior sea un conjunto. El resultado no es cambiar un suelo: es transformar el exterior entero.',
      'Browse our premium paver patios, pool decks, and hardscapes designed for structural performance, refined finishes, and long-term durability.':
        'Vea nuestros patios, bordes de piscina y hardscape adoquinados, hechos para rendir, durar y tener buen acabado.',
      'Common questions about professional paver installation in South Florida.':
        'Preguntas frecuentes sobre el adoquinado profesional en el sur de Florida.',
      'How long do professionally installed pavers last in Florida?':
        '¿Cuánto dura un adoquinado bien instalado en Florida?',
      'Professionally installed pavers in South Florida can last decades when built on a properly compacted and reinforced base. Our paver installation process prioritizes drainage planning and structural stability to prevent shifting or surface failure.':
        'Un adoquinado bien instalado en el sur de Florida puede durar décadas si va sobre una base bien compactada y reforzada. En nuestro proceso lo primero es planificar el drenaje y asegurar la estabilidad, que es lo que evita que se mueva o se hunda.',
      'Are pavers better than poured concrete for patios?':
        '¿Es mejor adoquinar un patio que hacerlo de hormigón?',
      'Pavers offer greater flexibility and crack resistance compared to poured concrete patios. In South Florida’s climate, paver systems handle heat expansion and heavy rainfall more effectively while providing elevated design options.':
        'El adoquinado tiene más flexibilidad y resiste mejor las grietas que una losa de hormigón. En el clima del sur de Florida absorbe mejor la dilatación por calor y las lluvias fuertes, y además da muchas más opciones de diseño.',
      'Do paver patios require drainage systems?': '¿Un patio adoquinado necesita drenaje?',
      'Yes. Proper grading and drainage are critical for paver patios in South Florida. Our paver contractors design installations that prevent water pooling, protect foundations, and maintain long-term structural integrity.':
        'Sí. Las pendientes y el drenaje son críticos en el sur de Florida. Diseñamos la instalación para que no se encharque, para proteger la cimentación y para que aguante con los años.',
      'How long does paver installation take?': '¿Cuánto se tarda en adoquinar?',
      'Paver installation timelines depend on size and base preparation. Most residential paver projects in Palm Beach and Broward County take several weeks, including excavation, compaction, and surface finishing.':
        'Depende del tamaño y de cuánta base haya que preparar. La mayoría de proyectos residenciales en Palm Beach y Broward llevan varias semanas, contando excavación, compactación y acabado.',
      'Do paver installations increase property value?': '¿Adoquinar revaloriza la propiedad?',
      'Luxury paver patios and driveways enhance curb appeal and outdoor functionality. Professionally installed pavers in South Florida can positively impact resale value and overall market appeal.':
        'Un patio o una entrada adoquinados mejoran la fachada y hacen el exterior más útil. Un buen adoquinado en el sur de Florida suele influir de forma positiva en el valor de reventa.',
      'As well as building in accordance with the latest codes to ensure your structure is safe, we strive to provide unique service, installation, quality, satisfaction, and reasonable pricing. Work with us and you won&#x27;t be disappointed. Beauty and security will last a lifetime.':
        'Además de construir conforme a la normativa vigente para que su estructura sea segura, nos esforzamos por dar un servicio, una instalación, una calidad y un precio que merezcan la pena. Trabaje con nosotros y no se arrepentirá: la belleza y la seguridad duran toda la vida.',
    },
  },
};
