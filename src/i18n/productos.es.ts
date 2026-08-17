/**
 * Las fichas de producto en español.
 *
 * Mismo patrón que `servicios.es.ts`: aquí solo va lo propio de cada producto —unas
 * 34 cadenas de las 84 que tiene la página—, y lo compartido (la paleta de acabados,
 * el bloque de servicios, los teasers del blog, el proceso, las tarjetas de proyecto)
 * vive en `comun.es.ts`.
 *
 * Los nombres de sistema y de marca NO se traducen: FORTE, ECLIPSE, Sukkha 3000, NOA,
 * FPA. Sí se traducen los nombres de color, porque son etiquetas descriptivas de una
 * carta para que el cliente elija, no referencias de pedido.
 *
 * Añadir un producto traducido es una entrada aquí + su ruta en `TRADUCIDAS`
 * (src/i18n/rutas.mjs). Lo que no esté no existe en /es/.
 */

export interface ProductoEs {
  /** Nombre corto, para las migas y el JSON-LD. */
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

export const PRODUCTOS_ES: Record<string, ProductoEs> = {
  'motorized-louvered-pergolas': {
    nombre: 'Pérgolas de lamas motorizadas',
    title: 'Pérgolas de lamas motorizadas | Sur de Florida',
    description: 'Lamas de aluminio orientables con sensores de lluvia y viento, integración domótica y certificación NOA, instaladas en el sur de Florida.',
    dic: {
      'Motorized Louvered Pergolas': 'Pérgolas de lamas motorizadas',
      'Sun or Shade on Demand': 'Sol o sombra cuando quiera',
      'Smart Home Integrated': 'Integrada con la domótica',
      'NOA &amp; FPA Certified': 'Certificación NOA y FPA',
      'Louvered Roof Pergola Contractors in South Florida': 'Especialistas en pérgolas de techo de lamas en el sur de Florida',
      'Pergola Plus designs and installs premium louvered roof pergolas across Miami-Dade, Broward, and Palm Beach County. Our custom aluminum systems feature motorized louvers that provide precise control over sunlight, ventilation, and rain protection—engineered specifically for the South Florida climate. We serve cities including Boca Raton, Fort Lauderdale, Weston, Delray Beach, and Palm Beach Gardens, delivering durable, architecturally refined outdoor living solutions.':
        'Pergola Plus diseña e instala pérgolas de techo de lamas de gama alta en Miami-Dade, Broward y Palm Beach. Nuestros sistemas de aluminio a medida llevan lamas motorizadas que dan control preciso sobre el sol, la ventilación y la lluvia, calculados para el clima del sur de Florida. Trabajamos en Boca Ratón, Fort Lauderdale, Weston, Delray Beach y Palm Beach Gardens, entre otras, con soluciones duraderas y de buen diseño.',
      'Smart Motorized Louvered Pergola Features': 'Qué trae una pérgola de lamas motorizada',
      'Take absolute control of your outdoor environment with smart, adaptive shade. Discover the innovative technology, weather resistance, and automated features that set our bioclimatic pergolas apart.':
        'Tome el control total de su exterior con una sombra que se adapta. Estas son la tecnología, la resistencia y la automatización que distinguen a nuestras pérgolas bioclimáticas.',
      'Seamless Smart Home Integration': 'Integración con su domótica',
      'Sync your pergola&#x27;s operations with popular smart home platforms for intuitive voice control and automated scheduling.':
        'Conecte su pérgola con las principales plataformas domóticas para manejarla por voz y programarla sola.',
      'Motorized Adjustable Louvers': 'Lamas motorizadas y orientables',
      'Control sunlight, airflow, and shade with precision at the touch of a button. Our motorized aluminum louvers rotate smoothly to adapt instantly to changing weather conditions, giving you total environmental control without leaving your seat.':
        'Controle el sol, la ventilación y la sombra con precisión, pulsando un botón. Nuestras lamas de aluminio giran con suavidad y se adaptan al momento a cómo cambie el tiempo, sin que usted tenga que levantarse.',
      'Integrated Rain &amp; Wind Sensors': 'Sensores de lluvia y viento',
      'Advanced sensors automatically close the louvers when rain or strong winds are detected, protecting your outdoor furniture and flooring even when you&#x27;re away. Intelligent automation ensures year-round protection in South Florida’s unpredictable climate.':
        'Los sensores cierran las lamas solos en cuanto detectan lluvia o viento fuerte, protegiendo los muebles y el suelo aunque usted no esté en casa. Automatización que da tranquilidad todo el año en un clima tan cambiante como el del sur de Florida.',
      'Integrated LED Lighting &amp; Electrical': 'Iluminación LED y electricidad integradas',
      'Customizable LED strip lighting, dimmable ambiance options, and integrated electrical components transform your pergola into an evening entertainment space, enhancing both functionality and atmosphere.':
        'Tiras LED configurables, luz regulable e instalación eléctrica integrada convierten su pérgola en un sitio donde estar también de noche, ganando en uso y en ambiente.',
      'High-Grade Extruded Aluminum': 'Aluminio extruido de alta calidad',
      'Constructed from premium powder-coated aluminum, our structures resist rust, warping, and deterioration in coastal environments. Built for durability, they maintain their finish and structural integrity for years.':
        'Fabricadas en aluminio con recubrimiento en polvo, nuestras estructuras no se oxidan, no se deforman y no se degradan en ambiente costero. Mantienen el acabado y la solidez durante años.',
      'All-Weather Protection System': 'Protección con cualquier tiempo',
      'When fully closed, the interlocking louvers create a watertight seal with an integrated gutter system that channels water through concealed posts, keeping your outdoor space dry and usable in heavy rain.':
        'Al cerrarse del todo, las lamas encajan entre sí formando un sellado estanco, y un canalón integrado conduce el agua por dentro de los pilares. El exterior se queda seco y utilizable aunque llueva fuerte.',
      'Explore real installations of our motorized louvered roof pergolas across South Florida. See how homeowners transform patios and pool areas with precision shade control, modern design, and all-weather performance.':
        'Vea instalaciones reales de nuestras pérgolas de lamas motorizadas por el sur de Florida, y cómo transforman patios y zonas de piscina con control de sombra, diseño actual y protección con cualquier tiempo.',
      'Choose from modern architectural colors and refined finishes designed to complement luxury homes. From sleek matte tones to realistic wood-inspired textures, every detail is customizable.':
        'Elija entre colores actuales y acabados cuidados, pensados para acompañar a viviendas de lujo. Desde tonos mate hasta texturas que imitan la madera, todo es configurable.',
      'Experience total control over sun, shade, and rain. Watch how our motorized louver systems adjust in seconds, engineered for Florida’s climate and modern outdoor living.':
        'Control total sobre el sol, la sombra y la lluvia. Vea cómo nuestras lamas motorizadas se ajustan en segundos, calculadas para el clima de Florida.',
      'Motorized Louvered Pergolas FAQs': 'Preguntas sobre pérgolas de lamas motorizadas',
      'Questions about smart shade in Miami or Broward? Learn how our louvered pergolas offer custom rain and sun control.':
        '¿Dudas sobre sombra inteligente en Miami o Broward? Así funciona el control de sol y lluvia de nuestras pérgolas de lamas.',
      '1. How do louvered pergolas work?': '1. ¿Cómo funciona una pérgola de lamas?',
      'Motorized louvered pergolas use adjustable aluminum roof slats controlled via remote or app, allowing you to instantly adjust shade, sunlight, and patio airflow.':
        'Llevan lamas de aluminio orientables en el techo, que se manejan con mando o desde el móvil. Así ajusta al momento la sombra, la luz y la ventilación del patio.',
      '2. Are they safe in hurricanes?': '2. ¿Son seguras en un huracán?',
      'Yes. Our smart louvered roof systems are heavily engineered for Miami’s wind-load codes, delivering maximum structural strength and safety during severe storms.':
        'Sí. Nuestros techos de lamas se calculan para la normativa de carga de viento de Miami, con la resistencia estructural que exige una tormenta seria.',
      '3. Do they have rain sensors?': '3. ¿Llevan sensor de lluvia?',
      'Yes! Equipped with smart weather sensors, the automated roof closes instantly at the first drop of rain, protecting your outdoor furniture and patio year-round.':
        'Sí. Con sensores meteorológicos, el techo se cierra solo a la primera gota, protegiendo los muebles y el patio durante todo el año.',
      '4. Will the coastal salt rust it?': '4. ¿El salitre la va a oxidar?',
      'Never. We use marine-grade powder-coated extruded aluminum, guaranteeing your motorized pergola remains rust-free and pristine even in harsh oceanfront locations.':
        'No. Usamos aluminio extruido con recubrimiento en polvo de grado marino, así que la pérgola no se oxida ni pierde aspecto ni en primera línea de playa.',
      '5. How fast is the installation?': '5. ¿Cuánto se tarda en instalarla?',
      'Once custom fabrication and permitting are complete, our expert installers assemble your smart pergola in just a few days with minimal disruption to your property.':
        'Una vez fabricada a medida y con el permiso concedido, nuestro equipo la monta en unos pocos días y con las mínimas molestias.',
    },
  },

  'solid-roof-pergolas': {
    nombre: 'Pérgolas de techo aislado',
    title: 'Pérgolas de techo aislado | Sur de Florida',
    description: 'Paneles aislantes que cortan el calor radiante, con canalón oculto y preparación para ventiladores y televisión.',
    dic: {
      'Solid Roof Pergolas': 'Pérgolas de techo sólido',
      'Cools Patio Drastically': 'Baja mucho la temperatura del patio',
      'Ready for Fans &amp; TVs': 'Preparada para ventiladores y TV',
      'Hidden Gutter System': 'Canalón oculto',
      'Insulated Roof Pergola Contractors in South Florida': 'Especialistas en pérgolas de techo aislado en el sur de Florida',
      'Pergola Plus builds high-performance insulated roof pergolas throughout South Florida. Designed to significantly reduce heat transfer while providing full shade and weather protection, these systems create cooler, more comfortable outdoor environments. We serve Coral Springs, Davie, Wellington, Jupiter, and surrounding areas with fully engineered, custom-built structures made for long-term durability.':
        'Pergola Plus construye pérgolas de techo aislado de alto rendimiento por todo el sur de Florida. Reducen mucho la transmisión de calor y dan sombra total y protección frente al tiempo, para un exterior más fresco y cómodo. Trabajamos en Coral Springs, Davie, Wellington, Jupiter y alrededores, con estructuras calculadas y hechas a medida para durar.',
      'Insulated Solid Roof Pergola Features': 'Qué trae una pérgola de techo aislado',
      'Experience total coverage and unmatched thermal comfort for year-round usability. Learn how our insulated roof systems transform any patio into a protected, sophisticated extension of your indoor living space.':
        'Cobertura total y un confort térmico que se nota, para usar el patio todo el año. Así convierten nuestros techos aislados cualquier patio en una prolongación protegida de la casa.',
      'Thermal Insulated Roofing Panels': 'Paneles de techo con aislamiento térmico',
      'High-density insulated panels significantly minimize radiant heat, creating a noticeably cooler outdoor area even during peak South Florida summer temperatures.':
        'Los paneles aislantes de alta densidad cortan el calor radiante, así que la zona se nota más fresca incluso en lo más duro del verano en el sur de Florida.',
      'Solid All-Season Coverage': 'Cobertura total todo el año',
      'Unlike adjustable systems, insulated roofs provide continuous full coverage, ideal for homeowners seeking maximum protection and structural permanence.':
        'A diferencia de los sistemas orientables, el techo aislado cubre siempre y del todo. Es lo ideal si busca la máxima protección y una estructura permanente.',
      'Skylight Integration Capabilities': 'Posibilidad de integrar claraboyas',
      'Incorporate specialized weather-tight skylights into the solid roof design, balancing total rain protection with strategic pockets of natural sunlight.':
        'Se pueden integrar claraboyas estancas en el techo, para tener protección total frente a la lluvia sin renunciar a entradas de luz natural donde interesa.',
      'Integrated Ceiling Finishes': 'Techo con acabado interior',
      'Finished ceiling panels create a refined architectural look, concealing wiring and structural elements for a seamless aesthetic.':
        'Los paneles de techo acabados dan un aspecto cuidado y esconden el cableado y los elementos estructurales, para que se vea limpio.',
      'High Structural Load Capacity': 'Gran capacidad de carga',
      'Fully engineered and permit-ready, these systems meet strict wind-load requirements, ensuring safety and durability in coastal environments.':
        'Calculadas y listas para tramitar el permiso, cumplen los requisitos estrictos de carga de viento, con la seguridad y la durabilidad que pide la costa.',
      'Custom Lighting &amp; Fan Integration': 'Iluminación y ventiladores integrados',
      'Easily integrate ceiling fans, recessed lighting, and electrical outlets to extend usability and comfort throughout the year.':
        'Se integran sin problema ventiladores de techo, luz empotrada y enchufes, para ganar uso y confort durante todo el año.',
      'View completed insulated roof pergola projects designed for maximum shade and thermal comfort. Discover how permanent coverage creates cooler, more refined outdoor living spaces.':
        'Vea pérgolas de techo aislado ya terminadas, pensadas para dar la máxima sombra y confort térmico, y cómo una cubierta permanente hace el exterior más fresco y cuidado.',
      'Select from a curated palette of contemporary colors and clean finishes that enhance your home’s exterior while maintaining the durability and low maintenance of premium aluminum.':
        'Elija entre una paleta de colores actuales y acabados limpios que acompañan al exterior de su casa, con la durabilidad y el poco mantenimiento del aluminio de gama alta.',
      'See how insulated roof systems create full-time shade and superior heat reduction, delivering a cooler, quieter outdoor space built for year-round comfort.':
        'Vea cómo un techo aislado da sombra permanente y baja mucho el calor, para un exterior más fresco y silencioso, cómodo todo el año.',
      'Solid Roof Pergolas FAQs': 'Preguntas sobre pérgolas de techo sólido',
      'Have questions? Learn how our insulated aluminum solid roof pergolas provide ultimate heat and rain protection in South Florida.':
        '¿Dudas? Así protegen del calor y de la lluvia nuestras pérgolas de techo sólido de aluminio aislado en el sur de Florida.',
      '1. Does the solid roof block heat?': '1. ¿El techo sólido corta el calor?',
      'Yes! Our solid roof pergolas use high-density insulated panels to block 100% of radiant heat, keeping your Miami outdoor living space incredibly cool and comfortable.':
        'Sí. Usan paneles aislantes de alta densidad que bloquean el 100% del calor radiante, así que el exterior se mantiene fresco y cómodo.',
      '2. Are they fully waterproof?': '2. ¿Son totalmente estancas?',
      'Absolutely. The insulated aluminum panels interlock to form a sealed, waterproof roof with built-in gutters, providing total rain protection for outdoor kitchens.':
        'Sí. Los paneles de aluminio aislado encajan entre sí formando un techo sellado y estanco con canalón integrado, con protección total frente a la lluvia — también para una cocina exterior.',
      '3. Can I add a ceiling fan or TV?': '3. ¿Puedo poner un ventilador o una tele?',
      'Yes. The robust insulated roofing system features internal channels to hide wiring, allowing for clean installations of outdoor fans, LED lighting, and AV setups.':
        'Sí. El techo lleva canaletas internas para esconder el cableado, así que ventiladores, luz LED y equipos de audio y vídeo quedan instalados de forma limpia.',
      '4. What maintenance is needed?': '4. ¿Qué mantenimiento necesita?',
      'Virtually none. Constructed from premium powder-coated aluminum, our insulated patio covers will never rust, rot, or fade. Just an occasional rinse keeps them pristine.':
        'Prácticamente ninguno. Al ser de aluminio con recubrimiento en polvo, no se oxidan, no se pudren y no pierden color. Con enjuagarlas de vez en cuando basta.',
      '5. Are they permitted in Broward?': '5. ¿Necesitan permiso en Broward?',
      'Yes. As permanent load-bearing structures, they require permits. We provide full structural engineering and manage the approval process for complete code compliance.':
        'Sí. Al ser estructuras permanentes que soportan carga, requieren permiso. Nosotros aportamos el cálculo estructural completo y gestionamos la aprobación.',
    },
  },
};
