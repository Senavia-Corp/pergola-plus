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
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Newly installed large-format paver patio with tight uniform joints and a linear drain in Boca Raton, Florida.':
        'Patio de adoquín de gran formato recién instalado, con juntas apretadas y uniformes y sumidero lineal, en Boca Raton, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Luxury paver patio installation at modern South Florida residence with pool integration.':
        'Patio adoquinado de lujo instalado en una residencia moderna del sur de Florida, integrado con la piscina.',
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
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Custom engineered aluminum louvered pergola integrated into a contemporary waterfront home in West Palm Beach, Florida.':
        'Pérgola de lamas de aluminio calculada a medida e integrada en una vivienda contemporánea frente al agua en West Palm Beach, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Completed custom aluminum pergola installation at luxury South Florida residence with integrated lighting and modern architectural design.':
        'Pérgola de aluminio a medida terminada en una residencia de lujo del sur de Florida, con iluminación integrada y diseño actual.',
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
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Herringbone paver driveway with a soldier-course border sweeping up to a luxury home in Palm Beach, Florida.':
        'Entrada de coches adoquinada en espiga, con cenefa de remate, subiendo hasta una vivienda de lujo en Palm Beach, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Modern paver driveway installation at upscale South Florida residence.':
        'Entrada de coche adoquinada y de línea actual instalada en una residencia de alto nivel del sur de Florida.',
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

  concrete: {
    nombre: 'Hormigón estructural',
    title: 'Hormigón estructural | Sur de Florida',
    description: 'Losas armadas, cimentaciones de patio y pavimentos calculados para soportar pérgolas, decks y adoquinado, con permisos en regla.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Finished structural concrete patio slab with saw-cut joints and a clean square edge in Pompano Beach, Florida.':
        'Losa de hormigón estructural terminada, con juntas aserradas y canto recto y limpio, en Pompano Beach, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Structural concrete patio foundation installation at South Florida luxury property.':
        'Cimentación de hormigón estructural para patio instalada en una propiedad de lujo del sur de Florida.',
      'Structural Concrete Services': 'Servicios de hormigón estructural',
      'Structural Concrete Services in South Florida': 'Hormigón estructural en el sur de Florida',
      'Pergola Plus Florida provides structural concrete services for high-end residential outdoor projects across Palm Beach and Broward County. From reinforced pergola slabs and patio foundations to custom drive surfaces, every installation is engineered for strength, longevity, and code compliance. If you need professional concrete contractors in South Florida for a fully permitted project, our team ensures proper reinforcement, grading, and curing to support long-term structural performance. We build foundations that protect and enhance your outdoor investment.':
        'Pergola Plus Florida hace hormigón estructural para proyectos exteriores de alto nivel en Palm Beach y Broward. Desde losas armadas para pérgolas y cimentaciones de patio hasta pavimentos de acceso, cada trabajo se calcula para resistir, durar y cumplir normativa. Si necesita profesionales del hormigón en el sur de Florida para un proyecto con todos los permisos, cuidamos el armado, las pendientes y el curado para que aguante. Hacemos las bases que protegen su inversión.',
      'Our structural concrete services provide the engineered foundation behind luxury outdoor living projects across Palm Beach and Broward County. From reinforced pergola slabs to patio foundations and custom flatwork, every installation is designed for strength, longevity, and full code compliance.':
        'Nuestro hormigón estructural es la base calculada que hay debajo de los proyectos exteriores de lujo en Palm Beach y Broward. Desde losas armadas para pérgolas hasta cimentaciones de patio y soleras a medida, todo se diseña para resistir, durar y cumplir normativa.',
      'Reinforced Structural Slabs': 'Losas armadas',
      'Engineered for Load &amp; Longevity': 'Calculadas para el peso y para el tiempo',
      'Before pouring, we properly grade and compact the soil to ensure even support and long-term stability. Correct preparation prevents settlement issues and drainage problems — two of the most common failures in Florida concrete installations. Structural integrity begins beneath the surface.':
        'Antes de hormigonar, nivelamos y compactamos el terreno para que el apoyo sea uniforme y estable. Prepararlo bien evita asentamientos y problemas de drenaje, que son los dos fallos más habituales del hormigón en Florida. La solidez empieza debajo.',
      'Precision Grading &amp; Site Preparation': 'Nivelación y preparación del terreno',
      'Foundation Stability Starts Below': 'La estabilidad empieza abajo',
      'Code-Compliant &amp; Fully Permitted Work': 'Conforme a normativa y con permisos',
      'Built to Meet Florida Standards': 'Hecho según lo que pide Florida',
      'Our concrete projects meet local building codes and wind-load requirements across Palm Beach and Broward County. We manage inspections, permitting, and compliance to ensure your project is professionally executed from start to finish. This protects both safety and long-term property value.':
        'Nuestros trabajos de hormigón cumplen la normativa local y los requisitos de carga de viento de Palm Beach y Broward. Nos ocupamos de inspecciones, permisos y cumplimiento para que el proyecto salga bien de principio a fin. Eso protege la seguridad y el valor de la propiedad.',
      'Moisture &amp; Drainage Control Design': 'Control de humedad y drenaje',
      'South Florida’s heavy rainfall demands proper drainage planning. We incorporate slope control and moisture management strategies into every concrete installation to prevent water pooling, erosion, and foundation damage. Our approach ensures durability in high-humidity environments.':
        'Las lluvias del sur de Florida obligan a planificar el drenaje. Incorporamos control de pendientes y gestión de la humedad en cada trabajo para evitar encharcamientos, erosión y daños en la cimentación. Así aguanta en un ambiente húmedo.',
      'Integrated Outdoor Construction Support': 'La base del resto del proyecto',
      'The Structural Base for Luxury Additions': 'Lo que sostiene todo lo demás',
      'Our concrete services support pergolas, decks, paver systems, and full outdoor remodels. By engineering the foundation in-house, we ensure seamless integration between structural elements and surface finishes. This unified approach guarantees stability, alignment, and long-term performance across your entire outdoor project.':
        'Nuestro hormigón sostiene pérgolas, decks, adoquinado y remodelaciones exteriores integrales. Al calcular la base nosotros mismos, la estructura y los acabados encajan sin sorpresas. Ese enfoque unificado garantiza estabilidad, alineación y rendimiento en todo el proyecto.',
      'Discover our structural concrete projects engineered to support pergolas, patios, and driveways with long-term stability.':
        'Vea nuestros trabajos de hormigón estructural, calculados para sostener pérgolas, patios y entradas de coche con estabilidad a largo plazo.',
      'Answers about structural concrete services for outdoor projects.':
        'Respuestas sobre el hormigón estructural en proyectos exteriores.',
      'Why is reinforced concrete important for outdoor projects?': '¿Por qué es importante el hormigón armado en un proyecto exterior?',
      'Reinforced concrete provides structural support for pergolas, decks, patios, and driveways. Proper steel reinforcement and grading prevent cracking and settlement in South Florida soil conditions.':
        'El hormigón armado es lo que sostiene pérgolas, decks, patios y entradas de coche. Un buen armado y una buena nivelación evitan grietas y asentamientos en los suelos del sur de Florida.',
      'How long does concrete take to fully cure?': '¿Cuánto tarda el hormigón en curar del todo?',
      'Concrete gains initial strength within days but continues curing for several weeks. Proper curing ensures long-term durability and climate resistance for South Florida construction projects.':
        'El hormigón coge resistencia inicial en días, pero sigue curando durante varias semanas. Curarlo bien es lo que le da durabilidad y aguante frente al clima.',
      'Do structural concrete projects require permits?': '¿Hace falta permiso para un trabajo de hormigón estructural?',
      'Many structural concrete installations require permits in Palm Beach and Broward County. Professional concrete contractors manage documentation, inspections, and code compliance.':
        'Muchos trabajos de hormigón estructural requieren permiso en Palm Beach y Broward. Nosotros gestionamos la documentación, las inspecciones y el cumplimiento normativo.',
      'Can concrete slabs support pergolas and decks?': '¿Una losa de hormigón puede sostener una pérgola o un deck?',
      'Yes. Engineered concrete slabs provide the structural foundation required for aluminum pergolas, composite decks, and outdoor kitchens in South Florida residential properties.':
        'Sí. Una losa calculada es la base que necesitan las pérgolas de aluminio, los decks de composite y las cocinas exteriores en las viviendas del sur de Florida.',
      'How long does structural concrete last?': '¿Cuánto dura el hormigón estructural?',
      'When properly reinforced and professionally installed, structural concrete in South Florida can last decades, supporting luxury outdoor living structures.':
        'Bien armado y bien ejecutado, el hormigón estructural en el sur de Florida dura décadas sosteniendo las estructuras de exterior.',
    },
  },

  'deck-builders': {
    nombre: 'Decks',
    title: 'Constructores de decks a medida | Sur de Florida',
    description: 'Decks de composite y aluminio calculados para el ambiente costero, con permisos e instalación profesional.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Multi-level grey composite deck with black horizontal cable railing at a home in West Palm Beach, Florida.':
        'Tarima composite gris a varios niveles, con barandilla de cable horizontal negra, en una vivienda de West Palm Beach, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Premium composite deck installation at South Florida luxury residence.':
        'Instalación de deck de composite de gama alta en una residencia de lujo del sur de Florida.',
      'Deck Builders': 'Constructores de decks',
      'Custom Deck Builders in South Florida': 'Decks a medida en el sur de Florida',
      'Pergola Plus Florida designs and builds custom composite and aluminum decks for luxury homes throughout Palm Beach and Broward County. Our deck systems are engineered for coastal durability, structural stability, and seamless architectural integration. If you&#x27;re searching for deck builders near you or experienced deck contractors in South Florida, we deliver fully permitted, professionally installed outdoor decks built for Florida living. Each project is tailored to enhance pool areas, outdoor kitchens, and pergola systems while increasing long-term property value.':
        'Pergola Plus Florida diseña y construye decks a medida de composite y aluminio para viviendas de lujo en Palm Beach y Broward. Se calculan para aguantar la costa, mantenerse estables e integrarse en la arquitectura. Si busca quién le monte un deck en el sur de Florida, entregamos decks con todos los permisos e instalación profesional, hechos para vivir en Florida. Cada proyecto se ajusta para mejorar la zona de piscina, la cocina exterior y las pérgolas, y para sumar valor.',
      'We design and build custom composite and aluminum deck systems for high-end residential properties across Palm Beach and Broward County. Our decks are engineered for structural stability, coastal durability, and seamless architectural integration.':
        'Diseñamos y construimos decks a medida de composite y aluminio para viviendas de alto nivel en Palm Beach y Broward, calculados para mantenerse estables, aguantar la costa e integrarse en la arquitectura.',
      'Reinforced Structural Framing': 'Estructura reforzada',
      'Built for Stability &amp; Load Performance': 'Estable y preparado para el peso',
      'We specialize in composite and aluminum decking systems engineered for fade resistance, moisture protection, and minimal maintenance. Designed to outperform traditional wood decks, these materials withstand Florida’s sun, humidity, and rain while maintaining their refined appearance year after year.':
        'Trabajamos con decks de composite y aluminio pensados para no decolorarse, resistir la humedad y pedir poco mantenimiento. Rinden mucho más que una tarima de madera: aguantan el sol, la humedad y la lluvia de Florida manteniendo el buen aspecto año tras año.',
      'Premium Composite &amp; Aluminum Decking': 'Composite y aluminio de gama alta',
      'Low Maintenance. High Performance.': 'Poco mantenimiento. Mucho rendimiento.',
      'Custom Layout &amp; Elevation Design': 'Trazado y niveles a medida',
      'Architecturally Integrated Outdoor Living': 'Integrado en la arquitectura',
      'Every deck is custom designed to complement your home’s elevation, outdoor flow, and entertainment areas. From multi-level platforms to seamless poolside transitions, we create layouts that enhance usability while preserving architectural harmony.':
        'Cada deck se diseña a medida para encajar con los niveles de su casa, con cómo se mueve uno por el exterior y con las zonas de estar. Desde plataformas a varias alturas hasta transiciones limpias hacia la piscina, buscamos que se use mejor sin romper la armonía del conjunto.',
      'Our deck systems are designed to resist heat expansion, moisture absorption, and heavy rainfall exposure. With corrosion-resistant fasteners and reinforced substructures, we ensure long-term durability even in coastal environments.':
        'Nuestros decks se diseñan para aguantar la dilatación por calor, la absorción de humedad y las lluvias fuertes. Con fijaciones resistentes a la corrosión y subestructura reforzada, duran incluso en primera línea de costa.',
      'Fully Permitted &amp; Professionally Installed': 'Con permisos e instalación profesional',
      'Code-Compliant Construction': 'Construcción conforme a normativa',
      'We manage permitting, inspections, and compliance with local building codes throughout Palm Beach and Broward County. Our professional installation process ensures structural integrity and long-term reliability. This is a permanent, value-enhancing addition — not a temporary backyard upgrade.':
        'Nos ocupamos de permisos, inspecciones y cumplimiento de la normativa local en Palm Beach y Broward. Nuestro proceso garantiza solidez estructural y fiabilidad a largo plazo. Esto es una mejora permanente que suma valor, no un apaño de jardín.',
      'Explore our custom composite and aluminum decks designed for coastal durability and seamless outdoor integration.':
        'Vea nuestros decks a medida de composite y aluminio, hechos para aguantar la costa e integrarse en el exterior.',
      'Common questions about custom deck construction in South Florida.':
        'Preguntas frecuentes sobre decks a medida en el sur de Florida.',
      'What is the best decking material for Florida homes?': '¿Qué material es mejor para un deck en Florida?',
      'Composite and aluminum decking systems are ideal for South Florida because they resist moisture, UV exposure, and warping. They outperform traditional wood decks in humid coastal climates.':
        'El composite y el aluminio son lo ideal en el sur de Florida porque resisten la humedad, los rayos UV y no se alabean. Rinden mucho más que la madera en un clima costero y húmedo.',
      'Do custom decks require permits?': '¿Hace falta permiso para un deck a medida?',
      'Yes. Most elevated deck installations require permits. Our deck builders manage engineering, inspections, and building code compliance across Palm Beach and Broward County.':
        'Sí. Casi todos los decks elevados requieren permiso. Nos ocupamos del cálculo, las inspecciones y el cumplimiento normativo en Palm Beach y Broward.',
      'How long does a composite deck last?': '¿Cuánto dura un deck de composite?',
      'Composite decks in South Florida can last 25 years or more with minimal maintenance, making them a durable investment for luxury outdoor living environments.':
        'Un deck de composite en el sur de Florida puede durar 25 años o más con muy poco mantenimiento, así que es una inversión que sale a cuenta.',
      'Can decks integrate with pergolas?': '¿Se puede integrar un deck con una pérgola?',
      'Custom deck builders design composite and aluminum decks that integrate seamlessly with pergolas, paver patios, and pool areas for cohesive outdoor living design.':
        'Sí. Diseñamos decks de composite y aluminio que se integran con pérgolas, patios adoquinados y zonas de piscina para que el exterior sea un conjunto.',
      'Does installing a deck increase property value?': '¿Instalar un deck revaloriza la casa?',
      'A professionally installed deck enhances usability and curb appeal. High-end deck construction in South Florida can positively impact resale value.':
        'Un deck bien instalado hace el exterior más útil y mejora la imagen de la casa. En el sur de Florida suele influir de forma positiva en el valor de reventa.',
    },
  },

  'fence-solutions': {
    nombre: 'Vallado',
    title: 'Instalación de vallado | Sur de Florida',
    description: 'Vallado de aluminio y cerramientos de privacidad calculados para resistir el viento y la corrosión de la costa, con permisos y visto bueno de la HOA.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Dark aluminum horizontal-slat privacy fence running along a landscaped property edge in Boca Raton, Florida.':
        'Valla de intimidad de aluminio oscuro con lamas horizontales, a lo largo del lindero ajardinado de la parcela, en Boca Raton, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Premium aluminum fence installation at luxury South Florida residence.':
        'Instalación de vallado de aluminio de gama alta en una residencia de lujo del sur de Florida.',
      'Fence Solutions': 'Soluciones de vallado',
      'Premium Fence Installation in South Florida': 'Vallado de gama alta en el sur de Florida',
      'Pergola Plus Florida provides premium fence installation services throughout Palm Beach and Broward County for upscale residential properties. Our aluminum and modern privacy fencing systems are engineered for wind resistance, corrosion protection, and long-term structural performance in South Florida’s climate. If you&#x27;re searching for fence contractors in South Florida, our team delivers fully compliant, professionally installed solutions that enhance security and architectural cohesion. We focus on durable, low-maintenance fencing that complements your home while providing lasting privacy and protection.':
        'Pergola Plus Florida instala vallado de gama alta en Palm Beach y Broward para viviendas de alto nivel. Nuestros sistemas de aluminio y de privacidad se calculan para resistir el viento, la corrosión y el paso del tiempo en el clima del sur de Florida. Si busca profesionales del vallado en el sur de Florida, entregamos soluciones que cumplen normativa y están bien instaladas, que dan seguridad y encajan con la arquitectura. Buscamos vallado duradero y de poco mantenimiento, que acompañe a su casa y dé privacidad y protección de verdad.',
      'We design and install high-quality fencing systems for luxury residential properties across Palm Beach and Broward County. Our aluminum and modern privacy fences are engineered for durability, wind resistance, and long-term performance in South Florida’s coastal climate.':
        'Diseñamos e instalamos vallado de calidad para viviendas de lujo en Palm Beach y Broward. Nuestras vallas de aluminio y de privacidad se calculan para durar, resistir el viento y rendir en el clima costero del sur de Florida.',
      'High-Performance Aluminum Systems': 'Aluminio de alto rendimiento',
      'Engineered for Coastal Durability': 'Calculado para aguantar la costa',
      'We install fencing systems with reinforced posts and secure anchoring methods designed to withstand high wind conditions. Our installations meet local building standards and provide structural reliability during storm seasons — protecting both safety and investment value.':
        'Instalamos vallado con postes reforzados y anclajes seguros, pensados para aguantar rachas fuertes. Cumplen la normativa local y responden en temporada de tormentas, protegiendo tanto la seguridad como la inversión.',
      'Wind-Resistant Structural Installation': 'Instalación que resiste el viento',
      'Built to Meet Florida Wind Loads': 'Según las cargas de viento de Florida',
      'Custom Privacy &amp; Security Solutions': 'Privacidad y seguridad a medida',
      'Designed Around Your Property Layout': 'Diseñado sobre su parcela',
      'From full-privacy perimeter fencing to decorative security enclosures, every project is custom designed to fit your property’s layout and lifestyle needs. We balance visibility, airflow, and protection while maintaining architectural consistency with your home.':
        'Desde un cerramiento perimetral opaco hasta un vallado decorativo de seguridad, cada proyecto se diseña a medida de su parcela y de cómo vive usted la casa. Equilibramos visibilidad, ventilación y protección sin romper la coherencia con la vivienda.',
      'Architectural Design Integration': 'Integración con el diseño',
      'Enhancing Curb Appeal &amp; Cohesion': 'Que sume a la fachada, no que la rompa',
      'We carefully select fence styles, colors, and layouts that complement your home’s exterior finishes and landscape design. The result is a cohesive look that enhances curb appeal rather than appearing as an afterthought.':
        'Elegimos el estilo, el color y el trazado del vallado para que acompañen a los acabados exteriores y al jardín. El resultado es un conjunto coherente que mejora la fachada, en vez de parecer algo añadido después.',
      'HOA &amp; Code-Compliant Installation': 'Conforme a normativa y a la HOA',
      'Professional Management from Start to Finish': 'Gestión profesional de principio a fin',
      'We manage permitting requirements and ensure compliance with local building codes and HOA guidelines throughout Palm Beach and Broward County. Our structured installation process guarantees proper inspections, alignment, and long-term structural stability.':
        'Nos ocupamos de los permisos y de que todo cumpla la normativa local y las normas de la comunidad en Palm Beach y Broward. Nuestro proceso garantiza las inspecciones en regla, la alineación correcta y la estabilidad a largo plazo.',
      'Browse our modern aluminum and privacy fencing systems built for wind resistance, security, and architectural cohesion.':
        'Vea nuestros vallados de aluminio y de privacidad, hechos para resistir el viento, dar seguridad y encajar con la casa.',
      'Important questions about fence installation in South Florida.':
        'Las preguntas importantes sobre instalación de vallado en el sur de Florida.',
      'What is the best fence material for South Florida properties?': '¿Qué material es mejor para vallar en el sur de Florida?',
      'Aluminum fencing is ideal for South Florida due to corrosion resistance and wind durability. It performs better than wood fencing in humid and coastal environments.':
        'El aluminio es lo ideal en el sur de Florida por su resistencia a la corrosión y al viento. Rinde mucho mejor que la madera en ambientes húmedos y costeros.',
      'Do fence installations require permits?': '¿Hace falta permiso para instalar un vallado?',
      'Permit requirements vary by city and HOA guidelines. Professional fence contractors manage compliance and ensure code-approved installation across Palm Beach and Broward County.':
        'Depende del municipio y de las normas de la comunidad. Nosotros gestionamos el cumplimiento y nos aseguramos de que la instalación esté aprobada en Palm Beach y Broward.',
      'How long does aluminum fencing last in Florida?': '¿Cuánto dura un vallado de aluminio en Florida?',
      'Powder-coated aluminum fences can last decades in South Florida with minimal maintenance, even in high-humidity and salt-exposed environments.':
        'Un vallado de aluminio con recubrimiento en polvo puede durar décadas en el sur de Florida con muy poco mantenimiento, incluso con mucha humedad y salitre.',
      'Are aluminum fences wind resistant?': '¿El vallado de aluminio resiste el viento?',
      'Yes. Professionally installed aluminum fences are engineered with reinforced posts and secure anchoring systems designed to withstand Florida wind loads.':
        'Sí. Un vallado de aluminio bien instalado lleva postes reforzados y anclajes calculados para las cargas de viento de Florida.',
      'Does installing a fence increase home value?': '¿Vallar revaloriza la casa?',
      'High-quality fencing enhances privacy, security, and curb appeal, contributing to increased property value in South Florida residential markets.':
        'Un buen vallado aporta privacidad, seguridad y mejor imagen, y eso suele traducirse en más valor en el mercado residencial del sur de Florida.',
    },
  },

  'full-outdoor-remodel': {
    nombre: 'Remodelación exterior integral',
    title: 'Remodelación exterior integral | Sur de Florida',
    description: 'Remodelamos el exterior entero: patio, adoquinado, hormigón, decks, vallado, pérgolas, cortinas motorizadas, iluminación y drenaje en un solo proyecto.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Full outdoor remodel with large-format pavers, a louvered pergola and an outdoor kitchen in Delray Beach, Florida.':
        'Remodelación exterior integral con adoquín de gran formato, pérgola de lamas y cocina exterior, en Delray Beach, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla. Ojo: no
      // llega por TEXTOS_CLIENTE sino por el alias de PORTADAS en transformar.mjs,
      // que se aplica despues.
      'Full outdoor remodel completed at a South Florida residence with pergola integration.':
        'Remodelación exterior integral terminada en una residencia del sur de Florida, con la pérgola integrada.',
      'Full Outdoor Remodel': 'Remodelación exterior integral',
      'Complete Outdoor Remodeling in South Florida': 'Remodelación exterior integral en el sur de Florida',
      'Pergola Plus Florida remodels entire outdoor spaces across Palm Beach and Broward County. A full outdoor remodel brings the patio, the hardscape, the shade structures, the lighting and the drainage under one design, one set of permits and one crew — pavers and driveways, structural concrete, decks and fencing, custom pergolas and motorized screens. If you&#x27;re searching for outdoor remodeling contractors in South Florida, we deliver custom-designed, fully permitted renovations that enhance functionality and increase property value. Each project is approached with architectural precision and long-term performance in mind.':
        'Pergola Plus Florida remodela exteriores completos por todo Palm Beach y Broward. Una remodelación exterior integral reúne el patio, el adoquinado, las estructuras de sombra, la iluminación y el drenaje bajo un mismo diseño, un mismo juego de permisos y un mismo equipo: adoquines y entradas de coche, hormigón estructural, decks y cercas, pérgolas a medida y cortinas motorizadas. Si busca quién le remodele el exterior en el sur de Florida, entregamos remodelaciones a medida y con todos los permisos, que mejoran el uso del espacio y suman valor. Cada proyecto se aborda con precisión arquitectónica y mirando al largo plazo.',
      'We transform entire exteriors into refined, fully integrated outdoor living environments across Palm Beach and Broward County. A full outdoor remodel combines structural work, premium pavers and driveways, decks and fencing, pergola integration, and lighting and drainage, all designed for long-term durability in South Florida’s climate.':
        'Convertimos exteriores enteros en espacios cuidados y bien integrados en Palm Beach y Broward. Una remodelación exterior integral combina trabajo estructural, adoquinado y entradas de coche de gama alta, decks y cercas, pérgolas integradas, iluminación y drenaje, todo pensado para durar en el clima del sur de Florida.',
      'One Project, the Whole Exterior': 'Un solo proyecto para todo el exterior',
      'A Single Plan Instead of Five Contractors': 'Un plan en vez de cinco contratistas',
      'Paving, concrete, decking, fencing, shade structures and drainage are drawn together from the start instead of bolted on one at a time. One design, one set of permits and one crew means levels line up, materials match and nothing has to be undone later to make room for the next trade.':
        'Adoquinado, hormigón, deck, cercas, sombra y drenaje se dibujan juntos desde el principio, en vez de irse añadiendo de uno en uno. Con un solo diseño, un solo juego de permisos y un solo equipo, los niveles cuadran, los materiales pegan entre sí y no hay que deshacer nada para hacerle sitio al siguiente gremio.',
      'We install high-performance pavers and refined surface materials selected for durability, color retention, and architectural elegance. Designed to withstand Florida’s sun and heavy rain, our materials enhance aesthetics while maintaining long-term performance.':
        'Instalamos adoquines de alto rendimiento y pavimentos elegidos por su durabilidad, por cómo mantienen el color y por cómo quedan. Pensados para aguantar el sol y las lluvias de Florida, mejoran la estética sin renunciar al rendimiento.',
      'Premium Paver &amp; Surface Finishes': 'Adoquinado y acabados de gama alta',
      'Elevated Materials for Lasting Beauty': 'Materiales que envejecen bien',
      'Integrated Pergolas &amp; Shade Systems': 'Pérgolas y sombra integradas',
      'Expanding Comfort &amp; Functionality': 'Más confort y más uso',
      'We seamlessly integrate pergolas, insulated roof systems, and motorized screens into the remodel. This creates shaded, climate-controlled outdoor environments that extend usability year-round while maintaining architectural cohesion.':
        'Integramos pérgolas, techos aislados y cortinas motorizadas en la remodelación. Así queda un exterior con sombra y temperatura controlada que se puede usar todo el año, y todo sigue encajando con la casa.',
      'Custom Outdoor Living Design': 'Diseño exterior a medida',
      'Architecturally Cohesive Layouts': 'Distribuciones que van con la casa',
      'Every outdoor remodel is custom designed to improve flow between indoor and outdoor spaces. We consider elevation, traffic patterns, entertainment areas, and surrounding landscaping to create a seamless extension of your home’s architecture.':
        'Cada remodelación se diseña a medida para que se pase mejor del interior al exterior. Tenemos en cuenta los desniveles, por dónde se camina, las zonas de estar y el jardín, para que el exterior sea una continuación natural de la casa.',
      'Professional Project Management': 'Gestión profesional del proyecto',
      'We manage permitting, inspections, and compliance with local regulations across Palm Beach and Broward County. Our structured installation process ensures long-term durability, structural integrity, and peace of mind. Every outdoor remodel is treated as a permanent investment in your property.':
        'Nos ocupamos de permisos, inspecciones y cumplimiento de la normativa local en Palm Beach y Broward. Nuestro proceso asegura durabilidad, solidez estructural y tranquilidad. Tratamos cada remodelación como una inversión permanente en su propiedad.',
      'View our outdoor transformations featuring structural work, premium finishes, and integrated outdoor living design.':
        'Vea nuestras remodelaciones de exteriores, con trabajo estructural, acabados de gama alta y diseño exterior integrado.',
      'Common questions about full outdoor remodels in South Florida.':
        'Preguntas frecuentes sobre remodelaciones exteriores integrales en el sur de Florida.',
      'Do outdoor remodels require permits in South Florida?': '¿Hace falta permiso para remodelar el exterior en el sur de Florida?',
      'Structural outdoor remodeling projects almost always require permits, and a remodel that touches paving, concrete and a roofed structure needs several at once. We manage the engineering documentation and the building inspections in Palm Beach and Broward County.':
        'Las remodelaciones que tocan estructura casi siempre requieren permiso, y una que toca adoquinado, hormigón y una estructura techada necesita varios a la vez. Nosotros gestionamos la documentación de cálculo y las inspecciones en Palm Beach y Broward.',
      'How long does a full outdoor remodel take?': '¿Cuánto se tarda en remodelar el exterior?',
      'Timelines vary based on scope and materials. Most South Florida outdoor remodels take several weeks including demolition, preparation, and installation — and running the trades under one schedule is usually faster than hiring them separately.':
        'Depende del alcance y de los materiales. La mayoría de remodelaciones exteriores en el sur de Florida llevan varias semanas, contando demolición, preparación e instalación, y llevar todos los gremios con un mismo calendario suele salir más rápido que contratarlos por separado.',
      'Can pergolas be added during an outdoor remodel?': '¿Se puede añadir una pérgola durante la remodelación?',
      'Yes, and it is the cheapest moment to do it. Integrating aluminum pergolas, motorized screens, and premium paver systems while the ground is already open creates a cohesive outdoor living environment without paying twice for the same groundwork.':
        'Sí, y es el momento más barato para hacerlo. Integrar pérgolas de aluminio, cortinas motorizadas y adoquinado de gama alta con el terreno ya abierto deja el exterior como un conjunto y evita pagar dos veces la misma obra de base.',
      'Will an outdoor remodel increase property value?': '¿Remodelar el exterior revaloriza la casa?',
      'A professionally remodeled exterior enhances usability and curb appeal on every side of the house, not just the back. Luxury outdoor remodeling in South Florida can improve resale value.':
        'Un exterior bien remodelado se usa más y mejora la imagen de la casa por todos sus lados, no solo por detrás. En el sur de Florida suele mejorar el valor de reventa.',
      'What materials are best for outdoor renovations?': '¿Qué materiales son mejores para remodelar el exterior?',
      'High-performance pavers, reinforced concrete slabs, and aluminum shade systems are ideal materials for durable outdoor remodeling in South Florida’s climate.':
        'Adoquines de alto rendimiento, losas de hormigón armado y sistemas de sombra de aluminio son lo ideal para que una remodelación aguante el clima del sur de Florida.',
    },
  },
};
