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
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Louvered roof pergola contractors in South Florida installing motorized aluminum pergolas with smart controls, rain sensors, and modern outdoor living design.':
        'Especialistas en pérgolas de techo de lamas en el sur de Florida instalando pérgolas de aluminio motorizadas con control inteligente, sensor de lluvia y diseño exterior actual.',
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
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Insulated roof pergola builders in South Florida designing custom aluminum patio covers engineered for heat reduction and all-weather protection.':
        'Constructores de pérgolas de techo aislado en el sur de Florida diseñando cubiertas de patio de aluminio a medida, pensadas para bajar el calor y proteger con cualquier tiempo.',
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

  'open-air-pergolas': {
    nombre: 'Pérgolas abiertas',
    title: 'Pérgolas abiertas de aluminio | Sur de Florida',
    description: 'Pérgolas de aluminio de estructura abierta que definen el patio sin cortar la brisa ni las vistas al cielo, sin mantenimiento.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Open-air pergola builders in South Florida creating architectural aluminum pergolas that define outdoor living spaces with modern design.':
        'Constructores de pérgolas abiertas en el sur de Florida creando pérgolas de aluminio que definen el espacio exterior con un diseño actual.',
      'Open-Air Pergolas': 'Pérgolas abiertas',
      'Timeless Elegance': 'Elegancia que no pasa de moda',
      'Maximum Cooling Airflow': 'Máxima ventilación',
      'Zero Maintenance': 'Cero mantenimiento',
      'Open-Air Pergola Contractors in South Florida': 'Especialistas en pérgolas abiertas en el sur de Florida',
      'Pergola Plus designs architectural open-air pergolas throughout South Florida. Crafted from premium aluminum, these custom structures define outdoor spaces while preserving airflow and open views. We serve Parkland, Plantation, Delray Beach, and surrounding communities, delivering durable, design-forward installations that enhance property value.':
        'Pergola Plus diseña pérgolas abiertas con criterio arquitectónico por todo el sur de Florida. Hechas en aluminio de gama alta, definen el espacio exterior sin cortar la ventilación ni las vistas. Trabajamos en Parkland, Plantation, Delray Beach y alrededores, con instalaciones duraderas y de buen diseño que suman valor a la propiedad.',
      'Open-Air Pergola Design Features': 'Qué trae una pérgola abierta',
      'Define your patio with clean architectural lines that preserve the breeze and uninterrupted sky views. Explore the premium materials and customizable details that give our open-air structures their bold, modern presence.':
        'Defina su patio con líneas limpias que dejan pasar la brisa y no tapan el cielo. Estos son los materiales y los detalles configurables que le dan presencia a nuestras estructuras abiertas.',
      'Premium Extruded Aluminum Structure': 'Estructura de aluminio extruido',
      'Built with high-grade powder-coated aluminum, these structures resist corrosion, fading, and structural fatigue — ideal for South Florida’s humid and coastal environments.':
        'Fabricadas en aluminio de alta calidad con recubrimiento en polvo, resisten la corrosión, la decoloración y la fatiga estructural. Justo lo que pide un ambiente húmedo y costero.',
      'Integrated Lighting Options': 'Iluminación integrada, si la quiere',
      'Optional LED lighting can be seamlessly incorporated into beams and rafters, allowing your outdoor space to transition effortlessly from daytime relaxation to evening entertaining.':
        'Se puede integrar iluminación LED en vigas y viguetas, para que el mismo espacio sirva de día para descansar y de noche para recibir.',
      'Freestanding or Attached Installation': 'Exenta o adosada',
      'Whether extending from your home or installed as a freestanding feature, each pergola is engineered for structural integrity and aesthetic cohesion.':
        'Tanto si sale de la casa como si va suelta en el jardín, cada pérgola se calcula para ser sólida y para encajar visualmente.',
      'Decorative Post Base &amp; Cap Options': 'Basas y remates decorativos',
      'Customize the architectural look of your pergola with a selection of decorative post bases and caps, adding a refined finishing touch to the overall design.':
        'Ajuste el aspecto de su pérgola con basas y remates de pilar decorativos, que dan ese acabado que se nota.',
      'Custom Beam &amp; Rafter Configurations': 'Vigas y viguetas a medida',
      'Select from modern minimalist profiles or more robust structural dimensions to complement your home’s architectural style and outdoor layout.':
        'Elija entre perfiles minimalistas o secciones más robustas, según el estilo de su casa y cómo tenga distribuido el exterior.',
      'Architectural Open-Frame Design': 'Estructura abierta con criterio',
      'Create a visually striking outdoor area while preserving airflow and open sky views. Our open-air pergolas define patios and pool decks with clean architectural lines that enhance your home’s exterior design.':
        'Consiga un exterior con carácter sin renunciar a la ventilación ni a las vistas. Nuestras pérgolas abiertas definen patios y bordes de piscina con líneas limpias que suman al conjunto.',
      'Discover open-air pergola designs that define outdoor spaces with architectural elegance. See how clean aluminum structures elevate patios without blocking airflow or views.':
        'Vea diseños de pérgolas abiertas que definen el exterior con elegancia, y cómo una estructura limpia de aluminio eleva un patio sin tapar el aire ni las vistas.',
      'Available in sophisticated powder-coated colors and optional wood-look textures, each open-air pergola is tailored to match your home’s style and landscape.':
        'Disponibles en colores con recubrimiento en polvo y, si quiere, texturas que imitan la madera. Cada pérgola abierta se ajusta al estilo de su casa y de su jardín.',
      'Watch how open-air aluminum pergolas define space with clean architectural lines, preserving airflow and views while elevating your outdoor design.':
        'Vea cómo una pérgola abierta de aluminio define el espacio con líneas limpias, sin cortar el aire ni las vistas.',
      'Open Air Pergolas FAQs': 'Preguntas sobre pérgolas abiertas',
      'Got questions? Learn about the benefits, durability, and custom aluminum pergola designs built for South Florida weather.':
        '¿Dudas? Ventajas, durabilidad y diseños a medida en aluminio, pensados para el tiempo del sur de Florida.',
      '1. Why choose an open-air pergola?': '1. ¿Por qué elegir una pérgola abierta?',
      'Open-air pergolas define your luxury outdoor living area with stunning architectural lines while preserving uninterrupted sky views and natural cooling breezes.':
        'Definen la zona de estar exterior con unas líneas que se ven, y a la vez dejan el cielo despejado y la brisa corriendo.',
      '2. Are they made of wood or metal?': '2. ¿Son de madera o de metal?',
      'We strictly use high-grade extruded aluminum. Unlike wood, our powder-coated metal pergolas will never rot, warp, or require staining in South Florida&#x27;s climate.':
        'Solo usamos aluminio extruido de alta calidad. A diferencia de la madera, no se pudre, no se alabea y no hay que barnizarlo.',
      '3. Can I add custom LED lighting?': '3. ¿Puedo añadir iluminación LED?',
      'Yes. Our structural beams seamlessly hide electrical wiring, allowing for elegant integrated LED lighting to transform your open-air patio into an evening retreat.':
        'Sí. Las vigas esconden el cableado, así que la iluminación LED queda integrada y el patio se puede usar también de noche.',
      '4. Do they boost property value?': '4. ¿Revalorizan la casa?',
      'Definitely. Permanent, high-end aluminum pergolas significantly elevate curb appeal, expand usable living space, and deliver a high ROI for luxury Florida homes.':
        'Sí. Una pérgola de aluminio permanente y bien hecha mejora la imagen de la casa, amplía el espacio útil y suele rendir bien como inversión.',
      '5. Are they built to Florida code?': '5. ¿Cumplen la normativa de Florida?',
      'Yes. Every custom open-air pergola we design is fully engineered, permitted, and professionally installed to meet stringent South Florida hurricane wind-load codes.':
        'Sí. Cada pérgola se calcula, se tramita y se instala para cumplir las exigentes cargas de viento por huracán del sur de Florida.',
    },
  },

  cabanas: {
    nombre: 'Cabañas',
    title: 'Cabañas de aluminio a medida | Sur de Florida',
    description: 'Cabañas de aluminio de inspiración resort, calculadas para resistir huracanes, con cortinas motorizadas y techo aislado opcionales.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Aluminum cabana contractors in South Florida building luxury backyard cabanas engineered for shade, privacy, and resort-style outdoor living.':
        'Constructores de cabañas de aluminio en el sur de Florida levantando cabañas de patio de gama alta, pensadas para dar sombra, privacidad y un exterior con aire de resort.',
      Cabanas: 'Cabañas',
      'Resort-Style Luxury': 'Lujo de resort',
      'Hurricane-Resistant': 'Resistente a huracanes',
      '100% Rust-Proof': '100% a prueba de óxido',
      'Aluminum Cabana Builders in South Florida': 'Constructores de cabañas de aluminio en el sur de Florida',
      'We design and construct custom aluminum cabanas across Miami-Dade, Broward, and Palm Beach County. These luxury outdoor retreats provide shaded comfort and privacy while elevating the overall aesthetic of your pool or backyard space. Serving Weston, Boca Raton, Lighthouse Point, and Jupiter, we create resort-style environments built for long-term performance.':
        'Diseñamos y construimos cabañas de aluminio a medida en Miami-Dade, Broward y Palm Beach. Son refugios exteriores que dan sombra, comodidad y privacidad, y que elevan la estética de la zona de piscina o del jardín. Trabajamos en Weston, Boca Ratón, Lighthouse Point y Jupiter, creando ambientes de resort hechos para durar.',
      'Luxury Cabana Features &amp; Enhancements': 'Qué trae una cabaña y qué se le puede añadir',
      'Designed to redefine outdoor living, our luxury cabanas combine privacy, comfort, and architectural elegance. Discover the premium features that transform your backyard into a personal resort-style oasis.':
        'Nuestras cabañas combinan privacidad, confort y buen diseño. Estas son las prestaciones que convierten un jardín en un oasis propio.',
      'Resort-Style Structural Design': 'Diseño de inspiración resort',
      'Transform your backyard into a luxury escape with a fully customized aluminum cabana designed for privacy, shade, and architectural elegance.':
        'Convierta su jardín en un refugio con una cabaña de aluminio totalmente a medida, pensada para dar privacidad, sombra y buen aspecto.',
      'Privacy Enhancements': 'Más privacidad',
      'Add motorized screens, decorative panels, or partial walls to enhance privacy and climate control while maintaining a sleek modern aesthetic.':
        'Añada cortinas motorizadas, paneles decorativos o muros parciales para ganar privacidad y control del ambiente sin perder una línea limpia.',
      'Integrated Ceiling &amp; Lighting Systems': 'Techo e iluminación integrados',
      'Finished ceilings with recessed lighting options create a polished, high-end look while supporting electrical customization for fans and entertainment systems.':
        'Los techos acabados con luz empotrada dan un aspecto cuidado y dejan la instalación lista para ventiladores y equipos de audio y vídeo.',
      'Fully Engineered Aluminum Frame': 'Estructura de aluminio calculada',
      'Constructed from premium aluminum components, our cabanas are engineered to meet Florida building codes while resisting corrosion and weather damage.':
        'Fabricadas con perfilería de aluminio de gama alta, se calculan para cumplir la normativa de Florida y para resistir la corrosión y el tiempo.',
      'Custom Roofing Options': 'Opciones de cubierta',
      'Choose from insulated panels or solid roofing systems to maximize shade, comfort, and year-round protection.':
        'Elija entre paneles aislados o cubierta sólida para sacar el máximo de sombra, confort y protección todo el año.',
      'Custom Privacy Curtains &amp; Drapery': 'Cortinas de exterior a medida',
      'Incorporate outdoor-grade privacy curtains and drapery for a softer aesthetic and adjustable privacy, allowing you to create an intimate sanctuary on demand.':
        'Incorpore cortinas de exterior para suavizar la estética y regular la privacidad, y tener un rincón recogido cuando le apetezca.',
      'Explore luxury aluminum cabana projects that transform backyards into private resort-style retreats. See how structure, shade, and design come together seamlessly.':
        'Vea cabañas de aluminio ya construidas que convierten jardines en refugios privados, y cómo encajan estructura, sombra y diseño.',
      'Choose from high-end color palettes and textured finishes that create a seamless extension of your home while delivering a bold, resort-inspired presence.':
        'Elija entre paletas de color de gama alta y acabados con textura, que prolongan la casa hacia fuera con una presencia de resort.',
      'Aluminum Cabanas FAQs': 'Preguntas sobre cabañas de aluminio',
      'Have questions about custom cabanas? Learn how our hurricane-rated structures elevate South Florida outdoor living.':
        '¿Dudas sobre las cabañas a medida? Así elevan el exterior nuestras estructuras homologadas frente a huracanes.',
      '1. Are aluminum cabanas permanent?': '1. ¿Las cabañas de aluminio son permanentes?',
      'Yes, our custom aluminum cabanas are permanent structures engineered for Miami. We handle all permits to ensure a luxury, hurricane-resistant outdoor living space.':
        'Sí. Son estructuras permanentes, calculadas para Miami. Nosotros gestionamos todos los permisos para que el resultado sea un espacio de lujo y resistente a huracanes.',
      '2. Can I add motorized screens?': '2. ¿Puedo añadir cortinas motorizadas?',
      'Absolutely. Enhance your South Florida cabana with motorized retractable screens and privacy panels for instant shade, weather control, and ultimate comfort.':
        'Por supuesto. Con cortinas motorizadas retráctiles y paneles de privacidad tiene sombra al momento, control del tiempo y mucho más confort.',
      '3. Are they hurricane-resistant?': '3. ¿Resisten un huracán?',
      'Yes. Every cabana built by Pergola Plus Florida is engineered to meet strict coastal wind-load codes, ensuring your luxury outdoor retreat withstands severe storms.':
        'Sí. Cada cabaña se calcula para cumplir las estrictas cargas de viento de la costa, de modo que aguante una tormenta seria.',
      '4. What maintenance is required?': '4. ¿Qué mantenimiento necesitan?',
      'Minimal. Our premium powder-coated extruded aluminum cabanas resist rust and corrosion, making them the perfect low-maintenance solution for humid coastal climates.':
        'Muy poco. El aluminio extruido con recubrimiento en polvo resiste el óxido y la corrosión, así que es la solución de bajo mantenimiento para un clima húmedo y costero.',
      '5. Can I add LED lights and fans?': '5. ¿Puedo poner luces LED y ventiladores?',
      'Yes! Our structural aluminum cabanas seamlessly integrate LED lighting, ceiling fans, and AV systems, transforming your backyard into a luxury nighttime oasis.':
        'Sí. La estructura integra sin problema iluminación LED, ventiladores de techo y equipos de audio y vídeo, para que el jardín funcione también de noche.',
    },
  },

  'screen-enclosures': {
    nombre: 'Cerramientos con mosquitero',
    title: 'Cerramientos con mosquitero | Sur de Florida',
    description: 'Cerramientos calculados para las cargas de viento de Florida, con malla de alta visibilidad y opción resistente a mascotas.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Screen enclosure contractors in South Florida installing custom aluminum screen rooms for patios and pool areas with code-compliant engineering.':
        'Especialistas en cerramientos con mosquitero en el sur de Florida instalando habitaciones de aluminio a medida para patios y piscinas, conforme a la normativa.',
      'Screen Enclosures': 'Cerramientos con mosquitero',
      'Expands Living Space': 'Amplía el espacio habitable',
      'High-Visibility Mesh': 'Malla de alta visibilidad',
      'Extreme Weather Rated': 'Homologado para tiempo extremo',
      'Screen Enclosure Contractors in South Florida': 'Especialistas en cerramientos con mosquitero en el sur de Florida',
      'Pergola Plus installs professionally engineered screen enclosures throughout South Florida. Our custom-built systems protect outdoor spaces from insects and debris while preserving airflow and visibility. We serve Davie, Coral Springs, Palm Beach Gardens, and surrounding cities with fully permitted, structurally sound enclosures designed for year-round usability.':
        'Pergola Plus instala cerramientos con mosquitero calculados por todo el sur de Florida. Protegen el exterior de insectos y suciedad sin cortar la ventilación ni las vistas. Trabajamos en Davie, Coral Springs, Palm Beach Gardens y alrededores, con cerramientos sólidos, con todos los permisos y pensados para usarse todo el año.',
      'Screen Enclosure Features &amp; Durability': 'Qué trae un cerramiento y cuánto aguanta',
      'Enjoy your pool and patio year-round, completely free from insects and debris. Explore the high-strength engineering, premium mesh options, and panoramic views provided by our custom-built enclosures.':
        'Disfrute de la piscina y del patio todo el año, sin insectos ni suciedad. Esta es la ingeniería, las mallas y las vistas panorámicas de nuestros cerramientos a medida.',
      'Pet-Resistant Screen Upgrades': 'Malla resistente a mascotas',
      'Opt for ultra-durable, pet-resistant mesh materials that withstand scratching and pawing, ensuring long-lasting protection and peace of mind for pet owners.':
        'Elija una malla ultrarresistente que aguanta arañazos y empujones, para que dure y usted no esté pendiente.',
      'Panoramic Screen Visibility': 'Vistas panorámicas',
      'High-clarity mesh materials maintain wide outdoor views while reducing glare and enhancing comfort.':
        'Las mallas de alta claridad mantienen las vistas abiertas, reducen los reflejos y se está más cómodo.',
      'Integrated Door Systems': 'Puertas integradas',
      'Professionally installed screen doors provide smooth access while maintaining structural durability and clean aesthetics.':
        'Puertas mosquiteras bien instaladas: se pasa con suavidad, aguantan y no rompen la estética.',
      'High-Strength Screen Systems': 'Mallas de alta resistencia',
      'Enjoy uninterrupted outdoor living without pests or debris. Our durable screening materials provide protection while preserving airflow and outdoor visibility.':
        'Vida al aire libre sin bichos ni hojas. Nuestras mallas protegen sin quitar ventilación ni vistas.',
      'Engineered Aluminum Framing': 'Estructura de aluminio calculada',
      'Fully engineered structural frames meet local wind-load requirements, ensuring long-term safety and performance in coastal conditions.':
        'Las estructuras se calculan para cumplir las cargas de viento locales, con la seguridad que pide la costa.',
      'Custom Configurations': 'Configuraciones a medida',
      'Each enclosure is custom-designed to fit patios, pools, and lanais with precision, ensuring seamless integration with your existing structure.':
        'Cada cerramiento se diseña a medida para encajar con precisión en patios, piscinas y porches, integrándose con lo que ya hay.',
      'View professionally installed screen enclosures that extend outdoor living while maintaining airflow and visibility. Discover clean integrations that enhance comfort year-round.':
        'Vea cerramientos ya instalados que amplían el exterior sin quitar aire ni vistas, integrados de forma limpia y cómodos todo el año.',
      'Frame finishes are available in modern, weather-resistant colors designed to integrate effortlessly with your patio, pool area, and existing architecture.':
        'Los acabados de la estructura están en colores actuales y resistentes a la intemperie, pensados para integrarse con el patio, la piscina y la casa.',
      'Screen Enclosures FAQs': 'Preguntas sobre cerramientos con mosquitero',
      'Have questions? Learn how our wind-rated screen enclosures keep South Florida bugs out while letting coastal breezes flow.':
        '¿Dudas? Así dejan fuera a los insectos nuestros cerramientos homologados sin cortar la brisa de la costa.',
      '1. Do enclosures block the breeze?': '1. ¿Un cerramiento corta la brisa?',
      'Not at all. Our premium pool screen enclosures feature high-visibility mesh that stops insects and debris while maximizing refreshing natural airflow on your patio.':
        'No. La malla de alta visibilidad frena insectos y suciedad, pero deja pasar el aire, que es justo lo que refresca el patio.',
      '2. Do they meet hurricane codes?': '2. ¿Cumplen la normativa antihuracán?',
      'Yes. Pergola Plus Florida builds every aluminum screen enclosure to strict structural engineering standards to withstand hurricane-force winds and coastal weather.':
        'Sí. Cada cerramiento se construye con criterios estrictos de cálculo estructural para aguantar vientos de huracán y el clima costero.',
      '3. Will the screen mesh sag easily?': '3. ¿La malla se descuelga con el tiempo?',
      'No. We install ultra-durable, high-tensile, and pet-resistant screening materials using precision tensioning to prevent sagging or tearing over years of heavy use.':
        'No. Instalamos mallas de alta tensión, muy resistentes y aptas para mascotas, con un tensado preciso que evita que se descuelguen o se rasguen.',
      '4. Are building permits required?': '4. ¿Hace falta permiso de obra?',
      'Yes, municipal permits are required. Our team expertly handles site surveys, engineering, and the full permitting process to ensure a legal, hassle-free installation.':
        'Sí, hace falta permiso municipal. Nos ocupamos del levantamiento, el cálculo y toda la tramitación para que la instalación sea legal y sin complicaciones.',
      '5. Can you fit my complex pool?': '5. ¿Podéis adaptaros a mi piscina, que es complicada?',
      'Absolutely. We custom-fabricate every aluminum frame to flawlessly integrate with your home&#x27;s unique architecture, multi-level decks, and custom pool layouts.':
        'Sí. Fabricamos cada estructura a medida para que encaje con la arquitectura de su casa, con decks a varios niveles y con piscinas de forma libre.',
    },
  },

  'motorized-screens': {
    nombre: 'Cortinas motorizadas',
    title: 'Cortinas motorizadas para patios | Sur de Florida',
    description: 'Cortinas retráctiles con mando o app, detección de obstáculos y carcasa oculta, integradas en pérgolas y porches.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Motorized screen installers in South Florida providing retractable patio screens for shade, privacy, and smart outdoor automation.':
        'Instaladores de cortinas motorizadas en el sur de Florida con cortinas retráctiles de patio para dar sombra, privacidad y automatización al exterior.',
      'Instant Bug Protection': 'Protección inmediata frente a insectos',
      'Retracts Invisibly': 'Se recoge y desaparece',
      'Coastal Wind Rated': 'Homologada para viento de costa',
      'Motorized Screen Installers in South Florida': 'Instaladores de cortinas motorizadas en el sur de Florida',
      'We provide premium motorized screen systems across Miami-Dade, Broward, and Palm Beach County. These retractable solutions offer on-demand shade, privacy, and wind control while seamlessly integrating into pergolas and covered patios. Serving Fort Lauderdale, Weston, Boca Raton, and Wellington, we bring automation and comfort to high-end outdoor spaces.':
        'Instalamos cortinas motorizadas de gama alta en Miami-Dade, Broward y Palm Beach. Son soluciones retráctiles que dan sombra, privacidad y control del viento cuando usted quiere, integradas en pérgolas y porches. Trabajamos en Fort Lauderdale, Weston, Boca Ratón y Wellington, llevando automatización y confort al exterior.',
      'Motorized Retractable Screen Features': 'Qué trae una cortina motorizada',
      'Instant shade, privacy, and climate control at the touch of a button. Learn how our seamlessly integrated motorized screens elevate your outdoor comfort while keeping insects and harsh weather at bay.':
        'Sombra, privacidad y control del ambiente al pulsar un botón. Así mejoran el confort nuestras cortinas motorizadas, dejando fuera insectos y mal tiempo.',
      'Weather-Resistant Mesh Options': 'Mallas resistentes a la intemperie',
      'Specialized screen fabrics reduce heat gain and glare while maintaining outward visibility and airflow.':
        'Tejidos técnicos que reducen el calor y los reflejos sin quitar la vista hacia fuera ni la ventilación.',
      'Smart Home Compatibility': 'Compatible con la domótica',
      'Compatible with modern smart systems, allowing control via mobile app or voice command for ultimate convenience.':
        'Compatible con los sistemas domóticos actuales, para manejarla desde el móvil o por voz.',
      'Retractable Automation System': 'Automatización del recogido',
      'Deploy or retract your screens instantly with remote or smart control, allowing flexible protection from sun, wind, and insects.':
        'Baje o suba las cortinas al momento con el mando o desde el móvil, y protéjase del sol, del viento o de los insectos según convenga.',
      'Obstacle Detection Technology': 'Detección de obstáculos',
      'Advanced built-in sensors automatically halt the screen&#x27;s descent if an obstacle is detected, ensuring the safety of children, pets, and outdoor furniture.':
        'Unos sensores detienen la bajada si detectan un obstáculo, por la seguridad de los niños, las mascotas y los muebles.',
      'Custom Sizing &amp; Configurations': 'Medidas y configuración a medida',
      'Each system is custom-measured to ensure smooth operation and complete coverage of your outdoor openings.':
        'Cada equipo se mide a medida para que funcione con suavidad y cubra el hueco por completo.',
      'Concealed Housing Design': 'Carcasa oculta',
      'Screens retract into discreet housings that preserve the clean lines of your pergola or patio structure.':
        'Las cortinas se recogen en carcasas discretas que no rompen las líneas de la pérgola ni del porche.',
      'See motorized screen systems in action, providing retractable shade, privacy, and wind control. Explore seamless integrations within high-end pergolas and patio spaces.':
        'Vea las cortinas motorizadas en funcionamiento, dando sombra, privacidad y control del viento, integradas en pérgolas y patios de gama alta.',
      'Customize housing and track colors to blend discreetly with your pergola or patio structure, maintaining clean lines and a cohesive architectural look.':
        'Elija el color de la carcasa y de las guías para que se integren con la pérgola o el porche y todo mantenga una línea limpia.',
      'Watch motorized screens deploy instantly for shade, privacy, and wind control — seamlessly integrated into high-end pergolas and patio systems.':
        'Vea cómo bajan las cortinas al momento para dar sombra, privacidad y control del viento, integradas en pérgolas y patios de gama alta.',
      'Motorized Screens FAQs': 'Preguntas sobre cortinas motorizadas',
      'Discover how our motorized screens provide privacy and bug protection for South Florida patios. Read FAQs to upgrade your space.':
        'Así dan privacidad y protección frente a insectos nuestras cortinas motorizadas en los patios del sur de Florida.',
      '1. How are screens controlled?': '1. ¿Cómo se manejan?',
      'Our motorized retractable screens operate smoothly via remote, wall switch, or smart home app, giving you instant outdoor climate control at the touch of a button.':
        'Con mando, con un pulsador de pared o desde la app de su sistema domótico. Control del ambiente exterior al momento.',
      '2. Can they withstand strong winds?': '2. ¿Aguantan viento fuerte?',
      'Yes. Featuring advanced edge-retention tracks, our heavy-duty screen systems stay securely locked in place, providing exceptional stability during Florida storms.':
        'Sí. Las guías de retención lateral mantienen la cortina sujeta en su sitio, con muy buena estabilidad durante las tormentas de Florida.',
      '3. Do they reduce patio heat?': '3. ¿Bajan la temperatura del patio?',
      'Absolutely. Our premium solar mesh fabrics block up to 95% of UV rays, drastically lowering patio temperatures and sun glare while maintaining comfortable airflow.':
        'Sí. Los tejidos solares bloquean hasta el 95% de los rayos UV, así que baja mucho la temperatura y el deslumbramiento, sin cortar la ventilación.',
      '4. Are they hidden when not in use?': '4. ¿Se ven cuando están recogidas?',
      'Yes! When retracted, the screens roll seamlessly into a sleek, concealed aluminum housing, preserving the clean architectural lines of your luxury outdoor space.':
        'No. Al recogerse se enrollan dentro de una carcasa de aluminio discreta, y las líneas del exterior quedan igual de limpias.',
      '5. Can you add them to my pergola?': '5. ¿Se pueden poner en mi pérgola actual?',
      'Yes, Pergola Plus Florida custom-measures and retrofits motorized retractable screens onto existing pergolas, lanais, or covered patios for enhanced bug protection.':
        'Sí. Medimos a medida e instalamos cortinas motorizadas en pérgolas, porches y patios cubiertos que ya existen.',
    },
  },

  carports: {
    nombre: 'Cocheras de aluminio',
    title: 'Cocheras de aluminio | Sur de Florida',
    description: 'Cocheras de aluminio calculadas para las cargas de viento de Florida, con drenaje oculto y acabados que se integran con la casa.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Aluminum carport builders in South Florida constructing custom vehicle protection structures engineered for sun, rain, and high-wind conditions.':
        'Constructores de cocheras de aluminio en el sur de Florida levantando estructuras a medida que protegen el coche del sol, la lluvia y el viento fuerte.',
      'Premium Sun Protection': 'Protección solar de verdad',
      'Custom Home Integration': 'Integrada con su casa',
      'Wind-Code Compliant': 'Cumple la normativa de viento',
      'Aluminum Carport Contractors in South Florida': 'Especialistas en cocheras de aluminio en el sur de Florida',
      'Pergola Plus designs and installs custom aluminum carports throughout South Florida. Engineered to protect vehicles from intense sun exposure and heavy rain, our structures combine durability with architectural refinement. We serve Boynton Beach, Jupiter, Davie, and Plantation with fully customized, professionally installed solutions.':
        'Pergola Plus diseña e instala cocheras de aluminio a medida por todo el sur de Florida. Están calculadas para proteger los coches del sol fuerte y de la lluvia, y son tan duraderas como cuidadas de diseño. Trabajamos en Boynton Beach, Jupiter, Davie y Plantation, con soluciones a medida e instalación profesional.',
      'Engineered Aluminum Carport Features': 'Qué trae una cochera de aluminio',
      'Delivering superior vehicle protection without sacrificing curb appeal. Explore the structural integrity, premium materials, and custom design elements that make our carports the ideal choice for Florida homes.':
        'Protege el coche sin afear la casa. Esta es la solidez, los materiales y el diseño a medida que hacen de nuestras cocheras la opción adecuada en Florida.',
      'Integrated Gutter &amp; Drainage System': 'Canalón y drenaje integrados',
      'Concealed internal drainage systems efficiently route rainwater away from your vehicles and driveway, preventing pooling and maintaining a clean, dry parking area.':
        'El drenaje va oculto por dentro y saca el agua de lluvia lejos de los coches y de la entrada, así que no se encharca y la zona queda limpia y seca.',
      'High-Performance Roofing Systems': 'Techos de altas prestaciones',
      'Choose from insulated, solid, or polycarbonate roofing options to protect vehicles from intense UV exposure, heavy rain, and environmental debris while maintaining a refined architectural appearance.':
        'Elija techo aislado, macizo o de policarbonato para proteger los coches del sol fuerte, de la lluvia y de la suciedad, sin renunciar a un buen acabado.',
      'Engineered Structural Aluminum Frame': 'Estructura de aluminio calculada',
      'Our aluminum carports are fully engineered to meet strict Florida building codes, including wind-load requirements for coastal environments. Designed for structural integrity and long-term durability, they provide reliable protection year after year.':
        'Nuestras cocheras se calculan para cumplir la normativa de Florida, incluidas las cargas de viento de la costa. Sólidas y duraderas, protegen año tras año.',
      'Each carport is custom-designed to align with your home’s architecture, rooflines, and exterior finishes, ensuring it enhances — not detracts from — property value.':
        'Cada cochera se diseña a medida para seguir la arquitectura de su casa, sus cubiertas y sus acabados, de modo que sume valor a la propiedad en vez de restarlo.',
      'Corrosion-Resistant Construction': 'Construcción que no se corroe',
      'Premium powder-coated aluminum resists rust, oxidation, and deterioration — making it ideal for South Florida’s humidity and salt-air exposure.':
        'El aluminio con recubrimiento en polvo no se oxida ni se degrada, así que va bien con la humedad y el aire salino del sur de Florida.',
      'Attached or Freestanding Options': 'Adosada o exenta',
      'Whether integrated into your home’s structure or installed as a freestanding solution, every system is engineered for stability and seamless visual cohesion.':
        'Se integre en la estructura de la casa o se monte exenta, cada cochera se calcula para ser estable y para verse como parte del conjunto.',
      'Browse custom aluminum carport installations designed to protect vehicles while complementing residential architecture with strength and style.':
        'Vea cocheras de aluminio ya instaladas: protegen los coches y acompañan a la arquitectura de la casa con solidez y estilo.',
      'Select from premium exterior finishes and contemporary tones that complement your home’s façade while ensuring long-lasting durability in Florida’s climate.':
        'Elija entre acabados exteriores de calidad y tonos actuales que acompañen a la fachada y aguanten el clima de Florida.',
      'Discover how custom aluminum carports protect vehicles from sun and rain while enhancing your home’s architectural presence.':
        'Vea cómo una cochera de aluminio a medida protege los coches del sol y de la lluvia mientras mejora la presencia de la casa.',
      'Aluminum Carports FAQs': 'Preguntas sobre cocheras de aluminio',
      'Find answers on our durable aluminum carports. We protect South Florida vehicles from harsh sun and severe tropical weather.':
        'Respuestas sobre nuestras cocheras de aluminio, que protegen los coches del sur de Florida del sol fuerte y del mal tiempo.',
      '1. Do carports block UV sun rays?': '1. ¿Frenan los rayos UV?',
      'Yes, our premium aluminum carports block harmful UV rays and intense South Florida heat, protecting your vehicle&#x27;s paint and interior from severe sun damage.':
        'Sí. Frenan los rayos UV y el calor fuerte del sur de Florida, así que la pintura y el interior del coche no se estropean con el sol.',
      '2. Are they built for high winds?': '2. ¿Aguantan viento fuerte?',
      'Every custom carport is structurally engineered to surpass Florida wind-load codes, guaranteeing top-tier hurricane protection and durability for your vehicles.':
        'Cada cochera se calcula para superar las cargas de viento que exige Florida, con la protección que hace falta frente a un huracán.',
      '3. Can the design match my home?': '3. ¿Puede ir a juego con mi casa?',
      'Absolutely. We offer fully custom modern carports with premium powder-coating to perfectly complement your home&#x27;s exterior, roofline, and luxury curb appeal.':
        'Sí. Las hacemos a medida y con recubrimiento en polvo, para que acompañen al exterior de su casa, a la cubierta y a la fachada.',
      '4. Will the aluminum carport rust?': '4. ¿Se oxida el aluminio?',
      'No. Our high-quality powder-coated aluminum resists rust, corrosion, and fading, ensuring a maintenance-free, durable parking structure for coastal environments.':
        'No. El aluminio con recubrimiento en polvo no se oxida, no se corroe y no pierde color: es una estructura duradera y sin mantenimiento, también en la costa.',
      '5. Do I need a building permit?': '5. ¿Hace falta permiso de obra?',
      'Yes, permanent carports require permits. Pergola Plus Florida handles the entire engineering and permitting process for a hassle-free, code-compliant installation.':
        'Sí, una cochera permanente lleva permiso. Nos ocupamos del cálculo y de toda la tramitación para que la instalación sea legal y sin complicaciones.',
    },
  },

  'polycarbonate-pergolas': {
    nombre: 'Pérgolas de policarbonato',
    title: 'Pérgolas con techo de policarbonato | Sur de Florida',
    description: 'Paneles translúcidos que bloquean el 99% de los UV, resisten impactos y dejan pasar la luz, sobre estructura de aluminio reforzada.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Polycarbonate pergola contractors in South Florida installing UV-protected translucent roofing systems for patios and poolside outdoor spaces.':
        'Especialistas en pérgolas de policarbonato en el sur de Florida instalando cubiertas traslúcidas con protección UV para patios y zonas de piscina.',
      '100% Waterproof Patio': 'Patio 100% estanco',
      'Advanced UV Protection': 'Protección UV avanzada',
      'Impact-Resistant Roofing': 'Techo resistente a impactos',
      'Polycarbonate Pergola Contractors in South Florida': 'Especialistas en pérgolas de policarbonato en el sur de Florida',
      'We install custom polycarbonate pergolas across Miami-Dade, Broward, and Palm Beach County. Featuring UV-blocking translucent panels and reinforced aluminum framing, these systems provide protection while maintaining natural light. Ideal for patios and pool areas in Boca Raton, Boynton Beach, and Fort Lauderdale, they combine performance, brightness, and modern design.':
        'Instalamos pérgolas de policarbonato a medida en Miami-Dade, Broward y Palm Beach. Llevan paneles translúcidos que frenan los UV sobre estructura de aluminio reforzada: protegen sin quitar la luz natural. Van muy bien en patios y zonas de piscina de Boca Ratón, Boynton Beach y Fort Lauderdale, con prestaciones, luminosidad y un diseño actual.',
      'Polycarbonate Pergola Features': 'Qué trae una pérgola de policarbonato',
      'Bathe your patio in natural light while staying protected from harsh UV rays and rain. Discover the benefits of pairing heavy-duty aluminum framing with advanced, impact-resistant translucent roofing.':
        'Luz natural en el patio y, a la vez, protección frente a los UV y la lluvia. Esto es lo que aporta unir una estructura de aluminio robusta a un techo translúcido resistente a impactos.',
      'UV-Blocking Translucent Panels': 'Paneles translúcidos que frenan los UV',
      'Advanced polycarbonate panels block harmful UV rays while allowing natural daylight to filter through, maintaining brightness without excessive heat exposure.':
        'Los paneles de policarbonato frenan los rayos dañinos y dejan pasar la luz del día, así que el espacio se queda luminoso sin acumular calor.',
      'Thermal Reflective Coating Options': 'Capa térmica reflectante opcional',
      'Upgrade your polycarbonate panels with specialized thermal reflective coatings that further reduce heat transmission, keeping your outdoor area exceptionally cool.':
        'Puede añadir a los paneles una capa térmica reflectante que reduce todavía más el paso del calor y mantiene el exterior mucho más fresco.',
      'Lightweight Structural System': 'Estructura ligera',
      'Engineered for strength without excessive bulk, these pergolas maintain clean lines and modern elegance.':
        'Calculadas para ser resistentes sin resultar pesadas, mantienen unas líneas limpias y actuales.',
      'High-strength panels resist cracking and damage from debris or storms, offering durability without sacrificing visual openness.':
        'Los paneles de alta resistencia no se agrietan ni se dañan con la suciedad ni con las tormentas, y aun así el espacio sigue viéndose abierto.',
      'Custom Tint &amp; Finish Options': 'Tintes y acabados a elegir',
      'Choose from various panel tints and frame colors to match your home’s architecture and outdoor aesthetic.':
        'Elija entre varios tintes de panel y colores de estructura para que todo vaya con su casa y con su exterior.',
      'Aluminum Reinforced Frame': 'Estructura de aluminio reforzada',
      'Powder-coated aluminum framing ensures long-term structural integrity in humid and coastal environments.':
        'La estructura de aluminio con recubrimiento en polvo aguanta a largo plazo en ambiente húmedo y costero.',
      'Browse custom polycarbonate pergola installations that balance natural light with UV protection. See how modern translucent roofing enhances outdoor areas with brightness and durability.':
        'Vea pérgolas de policarbonato ya instaladas, con ese equilibrio entre luz natural y protección UV, y cómo un techo translúcido mejora el exterior en luminosidad y en durabilidad.',
      'Customize your pergola with elegant frame colors and panel tint options that balance brightness, UV protection, and architectural cohesion with your outdoor design.':
        'Configure su pérgola con colores de estructura y tintes de panel que equilibren luz, protección UV y coherencia con el resto del exterior.',
      'Discover how translucent polycarbonate panels provide UV protection while maintaining natural light, combining durability and brightness in one sleek structure.':
        'Vea cómo los paneles translúcidos de policarbonato protegen de los UV sin quitar luz natural, uniendo durabilidad y luminosidad en una estructura de líneas limpias.',
      'Polycarbonate Pergolas FAQs': 'Preguntas sobre pérgolas de policarbonato',
      'Read our FAQs to see how our polycarbonate pergolas block UV rays and provide waterproof protection for South Florida homes.':
        'Así frenan los UV y dejan el patio seco nuestras pérgolas de policarbonato en el sur de Florida.',
      '1. Do polycarbonate roofs block UV?': '1. ¿El policarbonato frena los UV?',
      'Yes. Our advanced polycarbonate roofing panels are UV-treated to block 99% of harmful rays, protecting your skin and outdoor furniture while letting sunlight in.':
        'Sí. Los paneles llevan tratamiento UV y frenan el 99% de los rayos dañinos, protegiendo la piel y los muebles sin dejar el espacio a oscuras.',
      '2. Will the panels turn yellow?': '2. ¿Se ponen amarillos con el tiempo?',
      'No. We use architectural-grade polycarbonate with built-in UV stabilizers, specifically engineered to resist yellowing or clouding under the intense Florida sun.':
        'No. Usamos policarbonato de calidad arquitectónica con estabilizadores UV, formulado para no amarillear ni volverse opaco con el sol de Florida.',
      '3. Can they survive severe storms?': '3. ¿Aguantan una tormenta fuerte?',
      'Yes. Framed with heavy-duty aluminum, these impact-resistant translucent panels are engineered to exceed local wind-load requirements for ultimate storm durability.':
        'Sí. Sobre estructura de aluminio robusta, estos paneles resistentes a impactos se calculan para superar las cargas de viento que exige la normativa local.',
      '4. Do they keep the patio dry?': '4. ¿Dejan el patio seco?',
      'Absolutely. A polycarbonate pergola features a solid, watertight roof and integrated drainage to keep your outdoor lounge completely dry during heavy summer rain.':
        'Sí. El techo es estanco y lleva drenaje integrado, así que la zona de estar se queda seca aunque caiga una tromba de verano.',
      '5. Are the panel tints custom?': '5. ¿El tinte del panel se elige?',
      'Yes! We tailor every polycarbonate pergola to your home, offering custom frame colors and panel tint levels to perfectly match your outdoor aesthetic and shading needs.':
        'Sí. Adaptamos cada pérgola a su casa: color de estructura y nivel de tinte del panel a elegir según la estética y la sombra que necesite.',
    },
  },

  'solar-pergolas': {
    nombre: 'Pérgolas solares',
    title: 'Pérgolas solares | Sur de Florida',
    description: 'Estructuras preparadas para fotovoltaica: refuerzo de carga, cableado oculto y drenaje integrado, con orientación estudiada.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Solar roof structure contractors in South Florida designing engineered aluminum structures ready for solar panel integration and shaded outdoor living.':
        'Especialistas en pérgolas solares en el sur de Florida diseñando estructuras de aluminio preparadas para integrar paneles solares y dar sombra al exterior.',
      'Shade That Pays Back': 'Sombra que se paga sola',
      'Concealed Wiring': 'Cableado oculto',
      'Eco-Friendly Luxury': 'Lujo sostenible',
      'Solar Roof Structure Builders in South Florida': 'Constructores de estructuras solares en el sur de Florida',
      'We build solar-ready roof structures designed to integrate photovoltaic systems without compromising strength or aesthetics. Serving Miami-Dade, Broward, and Palm Beach County—including Boca Raton and Palm Beach Gardens—these engineered systems provide shade, weather protection, and long-term energy value.':
        'Construimos estructuras preparadas para llevar fotovoltaica sin perder resistencia ni estética. Trabajamos en Miami-Dade, Broward y Palm Beach —Boca Ratón y Palm Beach Gardens incluidas— con sistemas calculados que dan sombra, protegen del tiempo y aportan valor energético a largo plazo.',
      'Solar Pergola Integration &amp; Features': 'Qué trae una pérgola solar',
      'Shade your outdoor space while generating clean energy for your home. Discover the robust structural engineering and dual-purpose design that makes our solar pergolas a smart, sustainable, and stylish investment.':
        'Sombra en el exterior y energía limpia para la casa. Esta es la ingeniería y el diseño de doble función que convierten a nuestras pérgolas solares en una inversión sensata.',
      'Solar-Ready Structural Engineering': 'Cálculo preparado para solar',
      'Our roof structures are specifically engineered to support photovoltaic solar systems without compromising strength, alignment, or aesthetics. Structural integrity is prioritized from the foundation up.':
        'Nuestras estructuras se calculan para soportar sistemas fotovoltaicos sin ceder en resistencia, en alineación ni en estética. La solidez manda desde la cimentación.',
      'Reinforced Load Capacity': 'Capacidad de carga reforzada',
      'Built with reinforced aluminum framing, these systems are engineered to handle additional panel weight and wind resistance in high-exposure environments.':
        'Con estructura de aluminio reforzada, aguantan el peso extra de los paneles y el viento en zonas muy expuestas.',
      'Integrated Drainage &amp; Roofing Systems': 'Drenaje y cubierta integrados',
      'Advanced drainage channels and precision roofing integration protect your outdoor space from rain intrusion while maintaining a clean architectural finish.':
        'Los canales de drenaje y una cubierta bien resuelta impiden que entre el agua, y el acabado se mantiene limpio.',
      'Integrated Battery Storage Compatibility': 'Compatible con baterías',
      'Designed to seamlessly connect with home battery storage systems, allowing you to store the solar energy generated during the day for evening use or power outages.':
        'Se conecta con los sistemas de baterías domésticos, así que la energía que se genera de día queda guardada para la noche o para un apagón.',
      'Dual-Purpose Design': 'Diseño de doble función',
      'These structures provide shaded outdoor living space while simultaneously supporting renewable energy systems — combining lifestyle enhancement with long-term energy efficiency.':
        'Dan sombra para vivir el exterior y a la vez sostienen la instalación renovable: se gana en confort y en eficiencia a largo plazo.',
      'Custom Design &amp; Orientation': 'Diseño y orientación a medida',
      'Each structure is strategically positioned for both structural efficiency and ideal solar exposure, ensuring maximum performance and visual harmony.':
        'Cada estructura se sitúa buscando a la vez eficiencia estructural y la mejor exposición solar, para que rinda y para que se vea bien.',
      'Explore solar-ready roof structures that combine shaded outdoor living with structural support for integrated energy systems.':
        'Vea estructuras preparadas para solar que dan sombra al exterior y a la vez sostienen la instalación de energía.',
      'Choose structural finishes that align with your home’s design, combining clean modern colors with performance-driven materials built to last.':
        'Elija acabados que vayan con el diseño de su casa, con colores actuales y materiales pensados para durar.',
      'See how solar-ready roof structures combine shaded outdoor living with structural support for integrated energy systems.':
        'Vea cómo una estructura preparada para solar da sombra al exterior y a la vez sostiene la instalación de energía.',
      'Solar Pergolas FAQs': 'Preguntas sobre pérgolas solares',
      'Learn how our solar pergolas combine luxury shade with clean energy in South Florida. Read FAQs on permits and durability.':
        'Así unen sombra y energía limpia nuestras pérgolas solares en el sur de Florida, con lo que hay que saber de permisos y durabilidad.',
      '1. Can a pergola hold solar panels?': '1. ¿Una pérgola puede llevar paneles solares?',
      'Yes. Our dual-purpose solar pergolas create a luxurious shaded patio while structurally supporting a full array of solar panels to generate clean home energy.':
        'Sí. Nuestras pérgolas solares dan un patio con sombra y a la vez sostienen un campo entero de paneles para generar energía limpia.',
      '2. Is the frame strong enough?': '2. ¿La estructura aguanta?',
      'Definitely. We engineer these specific structures with reinforced load-bearing aluminum beams to safely support heavy photovoltaic panels and extreme wind uplift.':
        'Sí. Estas estructuras se calculan con vigas de aluminio reforzadas para soportar el peso de los paneles y la succión del viento.',
      '3. Is the lounge area waterproof?': '3. ¿La zona de estar queda seca?',
      'Yes. Our integrated sub-roofing and concealed drainage systems block rain effectively, ensuring the outdoor living space beneath your solar pergola stays fully dry.':
        'Sí. La subcubierta y el drenaje oculto frenan la lluvia, así que debajo de la pérgola no se moja nada.',
      '4. Do you orient it for max sun?': '4. ¿La orientáis para captar más sol?',
      'Yes. During the custom design phase, we optimize the height, pitch, and placement of your solar pergola to capture maximum south-facing sun exposure for energy gain.':
        'Sí. En el diseño ajustamos altura, inclinación y sitio para captar el máximo de sol hacia el sur.',
      '5. Do you handle all the permits?': '5. ¿Os encargáis de los permisos?',
      'Yes. Building a solar pergola requires structural and electrical permits. Our team manages the entire documentation process for a seamless, code-compliant project.':
        'Sí. Una pérgola solar lleva permiso de estructura y de electricidad. Nos ocupamos de toda la documentación para que el proyecto cumpla y avance sin trabas.',
    },
  },

  sukkha: {
    nombre: 'Sukkha 3000',
    title: 'Sukkha 3000 | Estructuras exteriores de lujo',
    description: 'El sistema Sukkha 3000: ingeniería modular, aluminio de alto rendimiento, diseño minimalista y automatización integrada.',
    dic: {
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Sukkha 3000 outdoor structure builders in South Florida delivering advanced engineered pergola systems with automation and modern architectural design.':
        'Constructores de estructuras Sukkha 3000 en el sur de Florida con sistemas de pérgola avanzados, automatizados y de diseño actual.',
      'Bespoke Luxury Design': 'Diseño de lujo a medida',
      'Category 5 Reinforced': 'Reforzada para categoría 5',
      'Smart-Home Automated': 'Automatizada con domótica',
      'Sukkha System Installers in South Florida': 'Instaladores del sistema Sukkha en el sur de Florida',
      'Pergola Plus installs the advanced Sukkha 3000 system across South Florida. This next-generation architectural structure combines modern design, automation, and superior engineering to create high-performance outdoor environments. Serving Fort Lauderdale, Delray Beach, Weston, and surrounding areas, we deliver premium solutions tailored to luxury residential properties.':
        'Pergola Plus instala el sistema Sukkha 3000 por todo el sur de Florida. Es una estructura de nueva generación que une diseño actual, automatización e ingeniería para crear exteriores de altas prestaciones. Trabajamos en Fort Lauderdale, Delray Beach, Weston y alrededores, con soluciones a medida para viviendas de alto nivel.',
      'Sukkha System Features': 'Qué trae el sistema Sukkha',
      'The absolute pinnacle of luxury outdoor architecture. Explore the advanced modular engineering, minimalist design, and smart automation capabilities that define the exclusive Sukkha 3000 structure.':
        'Lo más alto en arquitectura exterior de lujo. Esta es la ingeniería modular, el diseño minimalista y la automatización que definen al Sukkha 3000.',
      'Integrated Automation Technology': 'Automatización integrada',
      'Designed for seamless automation integration, this system supports motorized features, lighting systems, and advanced controls for a fully customized outdoor experience.':
        'Preparado para integrarse con la domótica, admite elementos motorizados, iluminación y controles avanzados para una experiencia hecha a su medida.',
      'High-Performance Aluminum Construction': 'Aluminio de altas prestaciones',
      'Constructed from premium-grade aluminum, the Sukkha 3000 is engineered to resist corrosion, structural fatigue, and environmental stress common in South Florida climates.':
        'Fabricado en aluminio de primera calidad, el Sukkha 3000 está calculado para resistir la corrosión, la fatiga estructural y el desgaste propio del clima del sur de Florida.',
      'Custom Configuration Capabilities': 'Configuración a medida',
      'Fully customizable in layout, size, finish, and integrated features, the Sukkha 3000 adapts to complex outdoor designs with precision.':
        'Distribución, tamaño, acabado y prestaciones se configuran por completo, así que el Sukkha 3000 se adapta con precisión a diseños exigentes.',
      'Architectural Minimalist Design': 'Diseño minimalista',
      'Its sleek structural profiles and refined finishes create a bold, modern statement that enhances high-end residential properties.':
        'Sus perfiles esbeltos y sus acabados cuidados marcan carácter y elevan las viviendas de alto nivel.',
      'Architectural Fascia Enhancements': 'Frentes arquitectónicos',
      'Enhance the visual impact of your structure with premium, customizable fascia wrap options that conceal hardware and elevate the modern, minimalist profile.':
        'Los frentes envolventes, configurables, esconden los herrajes y refuerzan el perfil minimalista de la estructura.',
      'Advanced Modular Engineering': 'Ingeniería modular avanzada',
      'The Sukkha 3000 is engineered with precision modular components that deliver superior strength, stability, and architectural flexibility — redefining modern outdoor structures.':
        'El Sukkha 3000 se construye con módulos de precisión que aportan resistencia, estabilidad y libertad arquitectónica, y redefinen lo que puede ser una estructura exterior.',
      'View Sukkha 3000 installations showcasing advanced engineering, minimalist design, and next-generation outdoor living performance.':
        'Vea instalaciones del Sukkha 3000, con su ingeniería, su diseño minimalista y sus prestaciones de nueva generación.',
      'The Sukkha 3000 offers a refined selection of architectural colors and textures, allowing complete customization while preserving its minimalist, high-end aesthetic.':
        'El Sukkha 3000 ofrece una selección cuidada de colores y texturas para personalizarlo por completo sin perder su estética minimalista.',
      'Sukkha Luxury Outdoor Structures - FAQ': 'Preguntas sobre el Sukkha 3000',
      'Discover the Sukkha 3000. Read FAQs on Pergola Plus Florida&#x27;s ultimate luxury, hurricane-proof architectural outdoor structure.':
        'Todo sobre el Sukkha 3000, la estructura exterior más alta de gama de Pergola Plus Florida, preparada para huracanes.',
      '1. What makes Sukkha 3000 unique?': '1. ¿Qué tiene de distinto el Sukkha 3000?',
      'The Sukkha 3000 is the pinnacle of luxury outdoor architecture, featuring proprietary modular engineering and minimalist design built specifically for high-end estates.':
        'Es lo más alto en arquitectura exterior de lujo: ingeniería modular propia y diseño minimalista, pensados para propiedades de alto nivel.',
      '2. Is the design customizable?': '2. ¿Se puede personalizar?',
      'Yes. Completely bespoke, the Sukkha 3000 offers custom dimensions, premium architectural finishes, and specialized fascia to complement your luxury property perfectly.':
        'Sí, por completo: dimensiones a medida, acabados de calidad y frentes específicos para que encaje con su propiedad.',
      '3. Can it withstand hurricanes?': '3. ¿Aguanta un huracán?',
      'Absolutely. Crafted from hyper-reinforced, marine-grade aluminum, the Sukkha 3000 is heavily engineered to surpass coastal building codes and endure extreme weather.':
        'Sí. En aluminio de grado marino muy reforzado, está calculado para superar la normativa de costa y aguantar tiempo extremo.',
      '4. Does it support smart home tech?': '4. ¿Admite domótica?',
      'Yes. The structure seamlessly hides motorized screen mechanisms, weather sensors, LED arrays, and AV equipment, delivering the ultimate automated luxury experience.':
        'Sí. La estructura esconde los mecanismos de las cortinas motorizadas, los sensores de clima, las tiras LED y el equipo audiovisual.',
      '5. Is it a permanent structure?': '5. ¿Es una estructura permanente?',
      'Yes. The Sukkha 3000 is a permanent, professionally engineered architectural addition that drastically increases real estate value and functional luxury for your home.':
        'Sí. El Sukkha 3000 es una ampliación arquitectónica permanente y calculada, que aumenta mucho el valor de la vivienda.',
    },
  },
};
