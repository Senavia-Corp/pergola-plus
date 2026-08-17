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
          },
  },

  'pergola-design-construction': {
    nombre: 'Pérgolas a medida',
    title: 'Diseño y construcción de pérgolas | Sur de Florida',
    description: 'Pérgolas de aluminio a medida con cálculo estructural y permisos, pensadas para el calor, la humedad y el viento de Florida.',
    dic: {
      'Pergola Design &amp; Construction': 'Diseño y construcción de pérgolas',
      'Custom Pergola Design &amp; Construction in South Florida': 'Diseño y construcción de pérgolas a medida en el sur de Florida',
      'Pergola Plus Florida delivers fully engineered pergola design and construction services across Palm Beach and Broward County. We specialize in custom aluminum pergolas, insulated roof systems, and modern louvered structures designed specifically for Florida’s heat, humidity, and wind exposure. Every project is professionally designed, structurally engineered, and permitted to ensure long-term durability and compliance. Whether you&#x27;re searching for pergola builders near you or a high-end outdoor structure contractor in South Florida, we create architectural outdoor spaces that increase comfort, elevate aesthetics, and add lasting property value.':
        'Pergola Plus Florida diseña y construye pérgolas con cálculo estructural completo en Palm Beach y Broward. Estamos especializados en pérgolas de aluminio a medida, techos aislados y estructuras modernas de lamas, pensadas para el calor, la humedad y el viento de Florida. Cada proyecto se proyecta, se calcula y se tramita para que dure y cumpla normativa. Tanto si busca quién le monte una pérgola cerca como un contratista de estructuras exteriores de gama alta en el sur de Florida, creamos espacios que ganan en confort, en estética y en valor.',
      'We design and build fully engineered pergola systems for upscale homes across Palm Beach and Broward County. Our custom aluminum and louvered pergolas are developed with structural precision, permitting expertise, and long-term durability in mind.':
        'Diseñamos y construimos pérgolas con cálculo estructural completo para viviendas de alto nivel en Palm Beach y Broward. Nuestras pérgolas de aluminio y de lamas se desarrollan con precisión estructural, con los permisos en regla y pensando en que duren.',
      'Fully Engineered &amp; Permitted Structures': 'Estructuras calculadas y con permisos',
      'Built to Code. Designed for Longevity.': 'Conforme a normativa. Hecho para durar.',
      'We specialize in high-performance aluminum pergolas, insulated roof systems, and motorized louvered roofs engineered for heat control, corrosion resistance, and durability. Designed specifically for South Florida’s humidity and salt exposure, our systems outperform traditional wood structures while maintaining a modern architectural aesthetic.':
        'Trabajamos con pérgolas de aluminio de alto rendimiento, techos aislados y techos de lamas motorizados, calculados para controlar el calor, resistir la corrosión y durar. Pensados para la humedad y el salitre del sur de Florida, rinden mucho más que una estructura de madera y mantienen una estética actual.',
      'Premium Aluminum &amp; Louvered Systems': 'Aluminio y sistemas de lamas de gama alta',
      'Advanced Materials for Coastal Performance': 'Materiales que aguantan la costa',
      'Custom Architectural Integration': 'Integración con la arquitectura',
      'Every pergola is custom-designed to integrate seamlessly with your home’s architecture. We consider rooflines, elevations, finishes, and outdoor flow to ensure a cohesive result. The outcome is not just shade — it’s a refined outdoor extension that enhances the entire property.':
        'Cada pérgola se diseña a medida para integrarse con la arquitectura de su casa. Tenemos en cuenta las líneas de cubierta, los desniveles, los acabados y cómo se mueve uno por el exterior, para que el conjunto vaya junto. El resultado no es solo sombra: es una prolongación de la casa que revaloriza toda la propiedad.',
      'Built for Florida’s Heat, Rain &amp; Wind': 'Hecho para el calor, la lluvia y el viento de Florida',
      'Our pergolas are engineered to withstand intense sun exposure, heavy rainfall, and high wind conditions. With reinforced anchoring systems and corrosion-resistant finishes, we deliver structures built specifically for Florida’s coastal climate — ensuring performance that lasts for decades.':
        'Nuestras pérgolas se calculan para aguantar sol intenso, lluvias fuertes y viento. Con anclajes reforzados y acabados resistentes a la corrosión, entregamos estructuras hechas para el clima costero de Florida, con un rendimiento que se mantiene durante décadas.',
      'Seamless Outdoor Living Integration': 'Todo el exterior, en un conjunto',
      'Expand Comfort Beyond Interior Walls': 'El confort no se acaba en la pared',
      'Our pergolas integrate effortlessly with outdoor kitchens, decks, paver patios, and motorized screens. We design complete outdoor living environments — not standalone structures. This holistic approach ensures visual harmony, functional flow, and maximum return on investment.':
        'Nuestras pérgolas se integran con cocinas exteriores, decks, patios adoquinados y cortinas motorizadas. Diseñamos espacios exteriores completos, no estructuras sueltas. Así todo encaja visualmente, se usa mejor y la inversión rinde más.',
      'Explore our custom aluminum and louvered pergolas built across South Florida, engineered for durability, architectural integration, and elevated outdoor living.':
        'Vea nuestras pérgolas de aluminio y de lamas construidas por el sur de Florida, calculadas para durar, integrarse en la arquitectura y elevar el espacio exterior.',
      'Answers to common questions about custom pergola design and installation in South Florida.':
        'Respuestas a las preguntas más habituales sobre diseño e instalación de pérgolas a medida en el sur de Florida.',
      'Do I need a permit to build a pergola in South Florida?': '¿Hace falta permiso para construir una pérgola en el sur de Florida?',
      'Yes. Most custom pergolas require permits in Palm Beach and Broward County. As experienced pergola contractors in South Florida, we handle structural engineering drawings, wind-load calculations, permit applications, and inspections to ensure full building code compliance.':
        'Sí. La mayoría de pérgolas a medida requieren permiso en Palm Beach y Broward. Nosotros nos ocupamos de los planos de cálculo, las cargas de viento, la solicitud de permisos y las inspecciones, para que todo cumpla la normativa.',
      'What is the best material for a pergola in Florida’s climate?': '¿Cuál es el mejor material para una pérgola en el clima de Florida?',
      'Aluminum pergolas and motorized louvered roof systems are ideal for South Florida due to corrosion resistance, humidity durability, and minimal maintenance. Unlike wood pergolas, aluminum structures withstand salt air, heavy rain, and intense UV exposure.':
        'El aluminio y los techos de lamas motorizados son lo ideal en el sur de Florida: resisten la corrosión, aguantan la humedad y apenas necesitan mantenimiento. A diferencia de la madera, el aluminio soporta el salitre, las lluvias fuertes y el sol.',
      'How long does custom pergola installation take?': '¿Cuánto se tarda en instalar una pérgola a medida?',
      'Custom pergola installation timelines vary based on design complexity and permitting approval. Most pergola projects in Palm Beach and Broward County take several weeks, including engineering, fabrication, inspections, and professional installation.':
        'Depende de lo complejo que sea el diseño y de cuánto tarde el permiso. La mayoría de proyectos en Palm Beach y Broward llevan varias semanas, contando cálculo, fabricación, inspecciones e instalación.',
      'Are motorized louvered pergolas worth the investment?': '¿Merecen la pena las pérgolas de lamas motorizadas?',
      'Motorized louvered pergolas provide adjustable shade, rain protection, and ventilation control. For luxury outdoor living in South Florida, they improve year-round usability, enhance comfort, and increase long-term property value.':
        'Las pérgolas de lamas motorizadas dan sombra regulable, protección frente a la lluvia y control de la ventilación. En el sur de Florida eso significa poder usar el exterior todo el año, más confort y más valor a largo plazo.',
      'How much does a custom pergola cost in South Florida?': '¿Cuánto cuesta una pérgola a medida en el sur de Florida?',
      'Custom pergola costs depend on size, materials, and engineering requirements. Premium aluminum pergolas in South Florida are long-term structural investments designed for durability, architectural integration, and enhanced resale value.':
        'El precio depende del tamaño, los materiales y lo que exija el cálculo. Una pérgola de aluminio de gama alta en el sur de Florida es una inversión estructural a largo plazo, pensada para durar, integrarse en la casa y mejorar el valor de reventa.',
    },
  },

  driveways: {
    nombre: 'Entradas de coche',
    title: 'Entradas de coche a medida | Sur de Florida',
    description: 'Entradas adoquinadas sobre bases reforzadas, con las pendientes y el drenaje calculados para las lluvias de Florida.',
    dic: {
      'Driveway Design &amp; Installation': 'Diseño e instalación de entradas de coche',
      'Custom Driveway Installation in South Florida': 'Entradas de coche a medida en el sur de Florida',
      'Pergola Plus Florida designs and installs luxury driveway systems across Palm Beach and Broward County for upscale residential properties. Our custom paver and concrete driveways are built on reinforced foundations engineered for durability, load-bearing performance, and climate resilience. If you&#x27;re searching for driveway contractors in South Florida, we deliver architecturally cohesive installations that enhance curb appeal and withstand heavy rainfall, sun exposure, and daily vehicle use. We focus on structural precision and long-term performance to ensure your driveway remains both functional and visually refined for years to come.':
        'Pergola Plus Florida diseña e instala entradas de coche de gama alta en Palm Beach y Broward para viviendas de alto nivel. Nuestras entradas de adoquín y de hormigón se levantan sobre bases reforzadas, calculadas para durar, soportar el peso y aguantar el clima. Si busca profesionales para su entrada de coche en el sur de Florida, hacemos instalaciones que encajan con la arquitectura, mejoran la fachada y resisten las lluvias fuertes, el sol y el paso diario de vehículos. Nos centramos en la precisión estructural para que su entrada siga siendo funcional y bonita durante años.',
      'We design and install luxury driveway systems for upscale homes across Palm Beach and Broward County. Our custom paver driveways are built on reinforced foundations engineered for durability, load-bearing performance, and long-term resilience in Florida’s climate. Homeowners searching for driveway contractors in South Florida choose us for our precision craftsmanship, permitting expertise, and architectural approach. Every driveway is designed to complement your home’s exterior while increasing curb appeal and property value.':
        'Diseñamos e instalamos entradas de coche de gama alta para viviendas de alto nivel en Palm Beach y Broward, sobre bases reforzadas y calculadas para durar y soportar el peso en el clima de Florida. Quien busca profesionales en el sur de Florida nos elige por el acabado, por saber tramitar los permisos y por el enfoque arquitectónico. Cada entrada se diseña para acompañar al exterior de su casa y sumar valor.',
      'Reinforced Structural Foundations': 'Bases estructurales reforzadas',
      'Built to Handle Vehicle Load &amp; Time': 'Preparado para el peso y para los años',
      'We install high-performance pavers selected for load resistance, color retention, and architectural refinement. Designed for upscale residences, our materials resist fading, staining, and surface deterioration caused by sun exposure and heavy rainfall. The result is a driveway that elevates curb appeal while delivering long-term durability.':
        'Instalamos adoquines de alto rendimiento, elegidos por cómo soportan el peso, cómo mantienen el color y cómo quedan. Pensados para viviendas de alto nivel, resisten la decoloración, las manchas y el deterioro por sol y lluvia. El resultado es una entrada que mejora la fachada y aguanta.',
      'Premium Paver &amp; Surface Materials': 'Adoquines y pavimentos de primera',
      'Designed for Strength and Curb Appeal': 'Resistencia y buena imagen',
      'Precision Grading &amp; Drainage Control': 'Pendientes y drenaje al milímetro',
      'Engineered for Florida Rainfall': 'Calculado para la lluvia de Florida',
      'Proper grading is critical in South Florida’s climate. We design driveway systems with calculated slope and integrated drainage solutions to prevent water pooling and foundation damage. This ensures surface longevity while protecting your home’s structural integrity during heavy rain events.':
        'En el sur de Florida las pendientes lo son todo. Diseñamos la entrada con la inclinación calculada y drenaje integrado para que no se encharque ni se dañe la cimentación. Así la superficie dura y la casa queda protegida cuando llueve fuerte.',
      'Custom Architectural Layouts': 'Trazados a medida',
      'Every driveway we build is custom designed to complement your home’s architecture, color palette, and exterior finishes. From contemporary linear patterns to elegant stone-inspired designs, we create cohesive curb appeal that enhances overall property aesthetics and long-term value.':
        'Cada entrada se diseña a medida para acompañar a la arquitectura de su casa, a sus colores y a sus acabados. Desde trazados lineales contemporáneos hasta diseños inspirados en la piedra, buscamos que la fachada vaya junta y que eso se note en el valor.',
      'Professional Installation from Start to Finish': 'Instalación profesional de principio a fin',
      'We manage permitting requirements and ensure full compliance with local building codes across Palm Beach and Broward County. Our professional installation process guarantees structural reliability, proper inspections, and peace of mind. This is a long-term investment executed with precision and accountability.':
        'Nos ocupamos de los permisos y de que todo cumpla la normativa local de Palm Beach y Broward. Nuestro proceso garantiza fiabilidad estructural, las inspecciones en regla y tranquilidad. Es una inversión a largo plazo, ejecutada con precisión y con alguien que responde.',
      'View our luxury driveway installations built on reinforced foundations, combining structural strength with refined curb appeal.':
        'Vea nuestras entradas de coche sobre bases reforzadas, que unen resistencia estructural y buena imagen.',
      'Key questions about custom driveway installation in South Florida.':
        'Las preguntas clave sobre entradas de coche a medida en el sur de Florida.',
      'What is the best driveway material for South Florida homes?': '¿Qué material es mejor para una entrada de coche en el sur de Florida?',
      'Concrete pavers are ideal for driveway installation in South Florida due to their load-bearing strength and flexibility. Reinforced paver driveways resist cracking better than poured concrete under heavy rain and sun exposure.':
        'El adoquín de hormigón es lo ideal por cómo soporta el peso y por su flexibilidad. Una entrada adoquinada y reforzada resiste mejor las grietas que una losa de hormigón cuando llueve fuerte y aprieta el sol.',
      'Do driveway installations require permits?': '¿Hace falta permiso para hacer una entrada de coche?',
      'Permit requirements vary by city. Our driveway contractors in Palm Beach and Broward County manage permitting, inspections, and compliance to ensure your driveway installation meets local building standards.':
        'Depende del municipio. Nosotros gestionamos permisos, inspecciones y cumplimiento en Palm Beach y Broward para que su entrada cumpla la normativa local.',
      'How long does a paver driveway last?': '¿Cuánto dura una entrada adoquinada?',
      'A professionally installed paver driveway in South Florida can last decades when built on a reinforced foundation. Proper compaction and drainage are essential for long-term performance.':
        'Una entrada adoquinada bien instalada en el sur de Florida puede durar décadas si va sobre una base reforzada. La compactación y el drenaje son lo que marca la diferencia.',
      'Can you replace an old concrete driveway?': '¿Se puede sustituir una entrada de hormigón vieja?',
      'Yes. We remove damaged concrete and install custom paver or reinforced concrete driveway systems engineered for improved durability and enhanced curb appeal in South Florida.':
        'Sí. Retiramos el hormigón dañado e instalamos una entrada de adoquín a medida o de hormigón reforzado, calculada para durar más y mejorar la fachada.',
      'Will a new driveway increase property value?': '¿Una entrada nueva revaloriza la casa?',
      'A luxury driveway enhances first impressions and architectural cohesion. Professionally installed driveways in South Florida can improve resale value and overall property marketability.':
        'Una buena entrada mejora la primera impresión y la coherencia del conjunto. Bien instalada, suele mejorar el valor de reventa y lo fácil que resulta vender la casa.',
    },
  },
};
