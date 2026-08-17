/**
 * Las 25 paginas de ubicacion en español.
 *
 * Cada una tiene solo CINCO cadenas propias: el <title>, el <h1>, el subtitulo del
 * hero, el encabezado de la seccion y su parrafo. El resto de la pagina —los sellos,
 * el "Why choose us?", el proceso, las tarjetas de proyecto, las zonas de servicio,
 * las reseñas y el CTA— es identico en las 25 y vive en `comun.es.ts`.
 *
 * Los NOMBRES DE CIUDAD y de condado no se traducen: son toponimos y ademas la
 * consulta que hace un vecino de Boca Raton en Google dice "Boca Raton", no otra
 * cosa. "Boca Raton" se queda tal cual, sin tilde, porque asi se llama la ciudad.
 *
 * Añadir una ubicacion traducida es una entrada aqui + su ruta en `TRADUCIDAS`
 * (src/i18n/rutas.mjs). Lo que no este no existe en /es/.
 */

export interface UbicacionEs {
  /** Nombre corto, para las migas y el JSON-LD. */
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

/** El title es identico en las 25 salvo la ciudad. */
const titulo = (ciudad: string) => `Pérgolas en ${ciudad}, FL | Aluminio y techos de lamas`;

export const UBICACIONES_ES: Record<string, UbicacionEs> = {
  'aventura-pergola-builders': {
    nombre: 'Aventura',
    title: titulo('Aventura'),
    description:
      'Pérgolas de aluminio a medida y techos de lamas motorizados para los condominios y las casas frente al agua de Aventura.',
    dic: {
      'Aventura Pergola Builders': 'Pérgolas en Aventura',
      'Premier pergola contractors serving Aventura’s luxury condos and waterfront homes. Elevate your outdoor lifestyle with a custom aluminum pergola, motorized louvered roof, or architectural shade system engineered for coastal durability and modern sophistication.':
        'Somos los especialistas en pérgolas de los condominios de lujo y las casas frente al agua de Aventura. Mejore su exterior con una pérgola de aluminio a medida, un techo de lamas motorizado o una estructura de sombra calculada para aguantar la costa y para verse actual.',
      'Custom Pergola Design &amp; Installation in Aventura': 'Diseño e instalación de pérgolas a medida en Aventura',
      'Aventura homeowners choose our custom aluminum pergolas for their sleek design and coastal durability. We engineer modern shade structures that complement luxury condos and waterfront residences while improving comfort, airflow, and long-term property value in South Florida’s tropical environment.':
        'En Aventura eligen nuestras pérgolas de aluminio a medida por su diseño limpio y porque aguantan la costa. Calculamos estructuras de sombra actuales que acompañan a los condominios de lujo y a las casas frente al agua, y que aportan confort, ventilación y valor a la propiedad en el clima tropical del sur de Florida.',
    },
  },

  'boca-raton-pergola-contractor': {
    nombre: 'Boca Raton',
    title: titulo('Boca Raton'),
    description:
      'Pérgolas de aluminio y techos motorizados a medida en Boca Raton, calculados para el calor, la humedad y el aire salino.',
    dic: {
      'Boca Raton Pergola Contractor': 'Pérgolas en Boca Raton',
      'Boca Raton’s trusted contractors for premium pergolas and custom shade structures. Transform your backyard with a refined aluminum pergola or motorized roof system built for elegance, performance, and long-term coastal resilience.':
        'En Boca Raton somos el equipo de confianza para pérgolas y estructuras de sombra a medida. Transforme su jardín con una pérgola de aluminio cuidada o un techo motorizado hecho para verse bien, rendir y aguantar la costa.',
      'Luxury Aluminum Pergolas in Boca Raton': 'Pérgolas de aluminio de gama alta en Boca Raton',
      'Boca Raton residents rely on our premium aluminum pergolas to elevate upscale outdoor living. We design and install custom-engineered shade systems that enhance architectural harmony, provide lasting durability, and withstand Florida’s heat, humidity, and coastal exposure.':
        'En Boca Raton cuentan con nuestras pérgolas de aluminio para elevar el exterior. Diseñamos e instalamos sistemas de sombra calculados a medida que acompañan a la arquitectura de la casa, duran y aguantan el calor, la humedad y el aire salino de Florida.',
    },
  },

  'boynton-beach-contractors': {
    nombre: 'Boynton Beach',
    title: titulo('Boynton Beach'),
    description:
      'Pérgolas de aluminio y techos de lamas a medida en Boynton Beach, con poco mantenimiento y confort todo el año.',
    dic: {
      'Boynton Beach Pergola Contractors': 'Pérgolas en Boynton Beach',
      'Expert pergola contractors serving Boynton Beach homeowners seeking elevated outdoor living. Experience the comfort of a custom aluminum pergola or louvered roof system designed for durability, airflow, and modern backyard style.':
        'Trabajamos en Boynton Beach para quien quiere sacarle partido a su exterior. Descubra lo cómoda que es una pérgola de aluminio a medida o un techo de lamas pensado para durar, para ventilar y para un jardín actual.',
      'High-End Pergola Builders in Boynton Beach': 'Pérgolas de gama alta en Boynton Beach',
      'Boynton Beach homeowners trust our team to deliver expertly engineered aluminum pergolas built for performance and refined aesthetics. Each custom structure enhances backyard functionality while offering low maintenance, structural strength, and year-round outdoor comfort.':
        'En Boynton Beach confían en nosotros para pérgolas de aluminio bien calculadas, que rinden y se ven bien. Cada estructura a medida saca más partido al jardín, da poco trabajo, es sólida y se disfruta todo el año.',
    },
  },

  'cooper-city-pergola-installation': {
    nombre: 'Cooper City',
    title: titulo('Cooper City'),
    description:
      'Instalación de pérgolas de aluminio y estructuras de sombra motorizadas en Cooper City, calculadas para el clima de Florida.',
    dic: {
      'Cooper City Pergola Installation': 'Pérgolas en Cooper City',
      'Custom pergola contractors proudly serving Cooper City. Enhance your outdoor space with an engineered aluminum pergola or motorized shade structure built for structural integrity and year-round Florida performance.':
        'Instalamos pérgolas a medida en Cooper City. Mejore su exterior con una pérgola de aluminio calculada o una estructura de sombra motorizada, sólida y pensada para rendir todo el año en Florida.',
      'Custom Outdoor Pergolas in Cooper City': 'Pérgolas exteriores a medida en Cooper City',
      'In Cooper City, we build custom aluminum pergolas that balance modern design with structural integrity. Our engineered shade systems enhance backyard living, provide dependable durability, and perform reliably against South Florida’s heat and seasonal storms.':
        'En Cooper City construimos pérgolas de aluminio a medida que equilibran diseño actual y solidez. Nuestros sistemas de sombra mejoran el jardín, duran y responden bien al calor y a las tormentas del sur de Florida.',
    },
  },

  'coral-gables': {
    nombre: 'Coral Gables',
    title: titulo('Coral Gables'),
    description:
      'Pérgolas de aluminio a medida para las casas mediterráneas y contemporáneas de Coral Gables.',
    dic: {
      'Coral Gables Pergola Builders': 'Pérgolas en Coral Gables',
      'Premier pergola specialists serving Coral Gables’ luxury estates. Complement Mediterranean or contemporary architecture with a custom aluminum pergola or motorized roof system crafted for elegance and lasting durability.':
        'Somos especialistas en pérgolas para las propiedades de lujo de Coral Gables. Acompañe la arquitectura mediterránea o contemporánea de su casa con una pérgola de aluminio a medida o un techo motorizado hecho para verse bien y durar.',
      'Premium Pergola Contractors in Coral Gables': 'Pérgolas de gama alta en Coral Gables',
      'Coral Gables properties benefit from our architecturally refined aluminum pergolas. Designed to complement Mediterranean and contemporary homes alike, our custom shade systems deliver elegance, durability, and enhanced outdoor comfort built for Florida’s climate.':
        'Las propiedades de Coral Gables ganan con nuestras pérgolas de aluminio de línea cuidada. Diseñadas para encajar tanto con casas mediterráneas como contemporáneas, aportan elegancia, durabilidad y más confort exterior en el clima de Florida.',
    },
  },

  'coral-springs-installation': {
    nombre: 'Coral Springs',
    title: titulo('Coral Springs'),
    description:
      'Pérgolas de aluminio y techos de lamas a medida en Coral Springs, para un jardín cómodo y eficiente.',
    dic: {
      'Coral Springs Pergola Installation': 'Pérgolas en Coral Springs',
      'Trusted pergola contractors in Coral Springs delivering modern aluminum shade systems. Upgrade your backyard with a custom pergola or louvered roof built for performance, comfort, and long-term structural strength.':
        'En Coral Springs instalamos sistemas de sombra de aluminio actuales. Renueve su jardín con una pérgola a medida o un techo de lamas hecho para rendir, para estar cómodo y para aguantar.',
      'Custom Aluminum Pergolas in Coral Springs': 'Pérgolas de aluminio a medida en Coral Springs',
      'Coral Springs homeowners choose our engineered aluminum pergolas to create stylish, functional outdoor environments. We design durable shade systems that improve backyard comfort, support energy efficiency, and withstand South Florida’s demanding weather conditions.':
        'En Coral Springs eligen nuestras pérgolas de aluminio calculadas para crear exteriores útiles y con estilo. Diseñamos sistemas de sombra que duran, que mejoran el confort del jardín, que ayudan con la factura y que aguantan el tiempo del sur de Florida.',
    },
  },

  'davie-installation': {
    nombre: 'Davie',
    title: titulo('Davie'),
    description:
      'Pérgolas de aluminio a medida y techos de lamas motorizados en Davie, integrados en el jardín.',
    dic: {
      'Davie Pergola Installation': 'Pérgolas en Davie',
      'High-end pergola contractors serving Davie homeowners. Create a refined outdoor retreat with a custom aluminum pergola or motorized louvered system engineered for durability and architectural harmony.':
        'Instalamos pérgolas de gama alta en Davie. Cree un refugio exterior con una pérgola de aluminio a medida o un sistema de lamas motorizado, calculado para durar y para encajar con la casa.',
      'Luxury Pergola Installation in Davie': 'Pérgolas de gama alta en Davie',
      'Davie residents partner with us for custom aluminum pergolas that elevate outdoor living with structural precision. Our shade systems integrate seamlessly into residential landscapes while providing strength, durability, and dependable performance in Florida’s climate.':
        'En Davie trabajan con nosotros para tener pérgolas de aluminio a medida, precisas y que elevan el exterior. Nuestros sistemas de sombra se integran en el jardín y aportan resistencia, durabilidad y buen comportamiento en el clima de Florida.',
    },
  },

  'delray-beach-contractors': {
    nombre: 'Delray Beach',
    title: titulo('Delray Beach'),
    description:
      'Pérgolas de aluminio y sistemas de sombra motorizados a medida para patios y zonas de piscina de Delray Beach.',
    dic: {
      'Delray Beach Pergola Contractors': 'Pérgolas en Delray Beach',
      'Luxury pergola contractors in Delray Beach specializing in modern aluminum and motorized shade systems. Redefine your patio or pool area with a custom structure built for coastal performance and elevated outdoor living.':
        'En Delray Beach estamos especializados en pérgolas de aluminio actuales y en sistemas de sombra motorizados. Dele otra vida a su patio o a su zona de piscina con una estructura a medida hecha para la costa.',
      'Custom Patio Pergolas in Delray Beach': 'Pérgolas de patio a medida en Delray Beach',
      'In Delray Beach, we design contemporary aluminum pergolas engineered for coastal performance and modern aesthetics. Our custom structures transform patios and pool areas into comfortable, high-end outdoor living spaces built to last.':
        'En Delray Beach diseñamos pérgolas de aluminio contemporáneas, calculadas para la costa y con una estética actual. Nuestras estructuras a medida convierten patios y zonas de piscina en espacios cómodos y de gama alta hechos para durar.',
    },
  },

  'doral-pergola-builders': {
    nombre: 'Doral',
    title: titulo('Doral'),
    description:
      'Pérgolas de aluminio de líneas limpias y techos de lamas automatizados a medida en Doral.',
    dic: {
      'Doral Pergola Builders': 'Pérgolas en Doral',
      'Premier pergola contractors serving contemporary homes in Doral. Install a custom aluminum pergola or automated louvered roof system designed for sleek aesthetics, structural precision, and lasting resilience.':
        'Trabajamos con las casas contemporáneas de Doral. Instale una pérgola de aluminio a medida o un techo de lamas automatizado, de líneas limpias, bien calculado y hecho para aguantar.',
      'Modern Aluminum Pergolas in Doral': 'Pérgolas de aluminio actuales en Doral',
      'Doral homeowners invest in our sleek aluminum pergolas designed for clean architectural lines and long-term resilience. Each custom shade structure enhances modern residences while delivering strength, minimal maintenance, and refined outdoor functionality.':
        'En Doral apuestan por nuestras pérgolas de aluminio de línea limpia, pensadas para durar. Cada estructura de sombra a medida mejora una vivienda actual y aporta resistencia, poco mantenimiento y un exterior que funciona.',
    },
  },

  'fort-lauderdale-installation': {
    nombre: 'Fort Lauderdale',
    title: titulo('Fort Lauderdale'),
    description:
      'Pérgolas de aluminio y techos motorizados para las casas frente al agua de Fort Lauderdale, con humedad, salitre y sol fuerte.',
    dic: {
      'Fort Lauderdale Pergola Installation': 'Pérgolas en Fort Lauderdale',
      'Fort Lauderdale’s trusted coastal pergola contractors. Transform your waterfront property with a custom aluminum pergola or motorized roof system engineered to withstand humidity, salt air, and intense sun.':
        'En Fort Lauderdale somos el equipo de confianza para la costa. Transforme su casa frente al agua con una pérgola de aluminio a medida o un techo motorizado calculado para la humedad, el salitre y el sol fuerte.',
      'Luxury Outdoor Pergolas in Fort Lauderdale': 'Pérgolas exteriores de gama alta en Fort Lauderdale',
      'Fort Lauderdale properties demand coastal-grade performance, and our aluminum pergolas deliver. We design custom-engineered shade systems that enhance waterfront homes, maximize airflow, and withstand humidity, salt air, and intense sun exposure.':
        'Las propiedades de Fort Lauderdale exigen prestaciones de costa, y nuestras pérgolas de aluminio las dan. Diseñamos sistemas de sombra calculados a medida que mejoran las casas frente al agua, aprovechan la brisa y aguantan la humedad, el salitre y el sol.',
    },
  },

  'hollywood-pergola-installation': {
    nombre: 'Hollywood',
    title: titulo('Hollywood'),
    description:
      'Pérgolas de aluminio y techos de lamas a medida en Hollywood, para recibir y para disfrutar el jardín todo el año.',
    dic: {
      'Hollywood Pergola Installation': 'Pérgolas en Hollywood',
      'Professional pergola contractors serving Hollywood homeowners seeking refined outdoor spaces. Experience the comfort of a custom aluminum pergola or louvered roof system designed for durability and year-round enjoyment.':
        'Instalamos pérgolas en Hollywood para quien busca un exterior cuidado. Descubra lo cómoda que es una pérgola de aluminio a medida o un techo de lamas hecho para durar y para disfrutarse todo el año.',
      'High-End Pergola Installation in Hollywood': 'Pérgolas de gama alta en Hollywood',
      'Hollywood homeowners choose our aluminum pergolas for their balance of style and structural durability. Our custom installations create refined outdoor environments ideal for entertaining, relaxing, and year-round enjoyment in South Florida.':
        'En Hollywood eligen nuestras pérgolas de aluminio por su equilibrio entre estilo y solidez. Nuestras instalaciones a medida crean exteriores cuidados para recibir, para descansar y para disfrutar todo el año en el sur de Florida.',
    },
  },

  'jupiter-contractors': {
    nombre: 'Jupiter',
    title: titulo('Jupiter'),
    description:
      'Pérgolas de aluminio a medida en Jupiter, calculadas para el salitre y el sol de la costa.',
    dic: {
      'Jupiter Pergola Contractors': 'Pérgolas en Jupiter',
      'Coastal-grade pergola contractors serving Jupiter residences. Enhance your backyard with a custom aluminum pergola or motorized shade structure built to resist salt air and Florida’s intense sun exposure.':
        'Trabajamos con material de costa en las viviendas de Jupiter. Mejore su jardín con una pérgola de aluminio a medida o una estructura de sombra motorizada hecha para resistir el salitre y el sol de Florida.',
      'Custom Pergola Builders in Jupiter': 'Pérgolas a medida en Jupiter',
      'Jupiter residents rely on our engineered aluminum pergolas built to handle salt air and coastal sun. Each custom shade structure enhances outdoor living spaces while delivering strength, corrosion resistance, and architectural appeal.':
        'En Jupiter cuentan con nuestras pérgolas de aluminio calculadas para el salitre y el sol de la costa. Cada estructura de sombra a medida mejora el exterior y aporta resistencia, protección frente a la corrosión y buen aspecto.',
    },
  },

  'key-biscayne-pergola-builders': {
    nombre: 'Key Biscayne',
    title: titulo('Key Biscayne'),
    description:
      'Pérgolas de aluminio resistentes a la corrosión para las propiedades frente al mar de Key Biscayne.',
    dic: {
      'Key Biscayne Pergola Builders': 'Pérgolas en Key Biscayne',
      'Luxury pergola contractors in Key Biscayne delivering corrosion-resistant aluminum shade systems. Elevate your oceanfront property with a custom pergola or motorized roof engineered for coastal conditions.':
        'En Key Biscayne instalamos sistemas de sombra de aluminio que no se corroen. Eleve su propiedad frente al mar con una pérgola a medida o un techo motorizado calculado para la costa.',
      'Luxury Coastal Pergolas in Key Biscayne': 'Pérgolas de costa de gama alta en Key Biscayne',
      'Key Biscayne homeowners select our premium aluminum pergolas for superior corrosion resistance and modern elegance. We design custom shade systems that protect against coastal elements while elevating refined outdoor living environments.':
        'En Key Biscayne eligen nuestras pérgolas de aluminio por lo bien que resisten la corrosión y por su elegancia actual. Diseñamos sistemas de sombra a medida que protegen de la costa y elevan el exterior.',
    },
  },

  'miami-beach-pergola-design': {
    nombre: 'Miami Beach',
    title: titulo('Miami Beach'),
    description:
      'Pérgolas de aluminio y techos de lamas motorizados para las casas frente al agua de Miami Beach.',
    dic: {
      'Miami Beach Pergola Builders': 'Pérgolas en Miami Beach',
      'Premier pergola contractors serving Miami Beach waterfront homes. Fall in love with the outdoors under a custom aluminum pergola or motorized louvered roof designed for modern architecture and coastal durability.':
        'Trabajamos con las casas frente al agua de Miami Beach. Vuelva a enamorarse de su exterior bajo una pérgola de aluminio a medida o un techo de lamas motorizado, pensado para la arquitectura actual y para aguantar la costa.',
      'Modern Waterfront Pergolas in Miami Beach': 'Pérgolas frente al agua en Miami Beach',
      'Miami Beach properties benefit from our luxury aluminum pergolas crafted for contemporary architecture and waterfront living. Each custom installation delivers clean design, structural durability, and elevated outdoor comfort suited for coastal conditions.':
        'Las propiedades de Miami Beach ganan con nuestras pérgolas de aluminio, hechas para la arquitectura contemporánea y para vivir frente al agua. Cada instalación a medida aporta diseño limpio, solidez y más confort exterior en un entorno costero.',
    },
  },

  'miami-pergola-experts': {
    nombre: 'Miami',
    title: titulo('Miami'),
    description:
      'Pérgolas de aluminio a medida y techos de lamas motorizados en Miami, calculados para el clima de Florida.',
    dic: {
      'Miami Pergola Builders': 'Pérgolas en Miami',
      'Miami’s trusted contractors for custom pergolas and architectural shade systems. Upgrade your backyard with an aluminum pergola or motorized louvered roof engineered for Florida’s climate and luxury outdoor living.':
        'En Miami somos el equipo de confianza para pérgolas a medida y estructuras de sombra. Renueve su jardín con una pérgola de aluminio o un techo de lamas motorizado calculado para el clima de Florida.',
      'Custom Aluminum Pergolas in Miami': 'Pérgolas de aluminio a medida en Miami',
      'Miami homeowners trust our team to design custom aluminum pergolas that complement both modern and traditional residences. We engineer durable shade systems focused on performance, architectural harmony, and long-term outdoor value.':
        'En Miami confían en nosotros para diseñar pérgolas de aluminio a medida que van bien tanto con una casa actual como con una tradicional. Calculamos sistemas de sombra duraderos, centrados en rendir, en encajar con la casa y en aportar valor a largo plazo.',
    },
  },

  'miramar-installation': {
    nombre: 'Miramar',
    title: titulo('Miramar'),
    description:
      'Pérgolas de aluminio a medida y techos motorizados en Miramar, integrados en la vivienda.',
    dic: {
      'Miramar Pergola Installation': 'Pérgolas en Miramar',
      'Professional pergola contractors serving Miramar homeowners. Enhance your backyard with a custom aluminum pergola or motorized roof system built for durability, performance, and seamless architectural integration.':
        'Instalamos pérgolas en Miramar. Mejore su jardín con una pérgola de aluminio a medida o un techo motorizado hecho para durar, para rendir y para integrarse con la casa.',
      'Premium Pergola Builders in Miramar': 'Pérgolas de gama alta en Miramar',
      'Miramar residents enhance backyard living with our custom aluminum pergolas built for strength and aesthetic refinement. Each structure provides dependable shade, structural durability, and seamless integration into residential layouts.':
        'En Miramar mejoran su jardín con nuestras pérgolas de aluminio a medida, resistentes y cuidadas de diseño. Cada estructura da sombra fiable, aguanta y se integra sin costuras en la vivienda.',
    },
  },

  'palm-beach-contractors': {
    nombre: 'Palm Beach',
    title: titulo('Palm Beach'),
    description:
      'Pérgolas de aluminio y sistemas de sombra motorizados a medida para las propiedades de Palm Beach.',
    dic: {
      'Palm Beach Pergola Contractors': 'Pérgolas en Palm Beach',
      'Elite pergola contractors serving Palm Beach properties. Experience elevated outdoor living with a custom aluminum pergola or motorized shade system engineered for architectural harmony and coastal resilience.':
        'Trabajamos con las propiedades de Palm Beach. Viva su exterior de otra manera con una pérgola de aluminio a medida o un sistema de sombra motorizado, calculado para encajar con la casa y para aguantar la costa.',
      'High-End Pergolas in Palm Beach': 'Pérgolas de gama alta en Palm Beach',
      'Palm Beach properties demand exceptional craftsmanship, and our aluminum pergolas meet that standard. We design sophisticated shade structures engineered for coastal resilience, architectural harmony, and elevated outdoor living.':
        'Las propiedades de Palm Beach exigen un acabado excelente, y nuestras pérgolas de aluminio están a esa altura. Diseñamos estructuras de sombra cuidadas, calculadas para la costa, que encajan con la casa y elevan el exterior.',
    },
  },

  'palm-beach-gardens': {
    nombre: 'Palm Beach Gardens',
    title: titulo('Palm Beach Gardens'),
    description:
      'Pérgolas de aluminio y techos de lamas automatizados a medida para las propiedades de Palm Beach Gardens.',
    dic: {
      'Palm Beach Gardens Pergola Contractors': 'Pérgolas en Palm Beach Gardens',
      'Luxury pergola contractors serving Palm Beach Gardens estates. Install a refined aluminum pergola or automated louvered roof system crafted for elegance, durability, and sophisticated outdoor comfort.':
        'Trabajamos con las propiedades de Palm Beach Gardens. Instale una pérgola de aluminio cuidada o un techo de lamas automatizado, hecho para verse bien, durar y dar confort.',
      'Luxury Pergola Design in Palm Beach Gardens': 'Pérgolas de gama alta en Palm Beach Gardens',
      'Palm Beach Gardens homeowners choose our refined aluminum pergolas tailored to luxury estates and landscaped properties. Our custom-engineered shade systems deliver durability, elegance, and lasting outdoor comfort.':
        'En Palm Beach Gardens eligen nuestras pérgolas de aluminio, hechas a la medida de propiedades de lujo y de jardines cuidados. Nuestros sistemas de sombra calculados a medida duran, se ven bien y dan confort.',
    },
  },

  'parkland-installation': {
    nombre: 'Parkland',
    title: titulo('Parkland'),
    description:
      'Pérgolas de aluminio calculadas y techos de lamas motorizados a medida en Parkland.',
    dic: {
      'Parkland Pergola Installation': 'Pérgolas en Parkland',
      'Custom pergola contractors serving Parkland’s upscale residences. Transform your backyard with an engineered aluminum pergola or motorized louvered roof built for strength, comfort, and modern design.':
        'Instalamos pérgolas a medida en las viviendas de Parkland. Transforme su jardín con una pérgola de aluminio calculada o un techo de lamas motorizado, resistente, cómodo y de diseño actual.',
      'Custom Pergola Installation in Parkland': 'Pérgolas a medida en Parkland',
      'Parkland residents rely on our custom aluminum pergolas to expand outdoor living with structural confidence. Our engineered shade systems enhance backyard design while providing durability and long-term performance.':
        'En Parkland cuentan con nuestras pérgolas de aluminio a medida para ampliar el exterior sobre seguro. Nuestros sistemas de sombra calculados mejoran el jardín y aportan durabilidad y buen comportamiento a largo plazo.',
    },
  },

  'pembroke-pines-pergola-installation': {
    nombre: 'Pembroke Pines',
    title: titulo('Pembroke Pines'),
    description:
      'Pérgolas de aluminio a medida y techos motorizados en Pembroke Pines, de poco mantenimiento.',
    dic: {
      'Pembroke Pines Pergola Installation': 'Pérgolas en Pembroke Pines',
      'Trusted pergola contractors in Pembroke Pines delivering high-performance aluminum shade systems. Upgrade your outdoor space with a custom pergola or motorized roof designed for durability and refined aesthetics.':
        'En Pembroke Pines instalamos sistemas de sombra de aluminio de altas prestaciones. Renueve su exterior con una pérgola a medida o un techo motorizado pensado para durar y para verse bien.',
      'Modern Pergola Builders in Pembroke Pines': 'Pérgolas actuales en Pembroke Pines',
      'Pembroke Pines homeowners select our modern aluminum pergolas to create comfortable, architecturally clean outdoor spaces. Each custom structure is built for strength, low maintenance, and year-round usability.':
        'En Pembroke Pines eligen nuestras pérgolas de aluminio actuales para crear exteriores cómodos y de línea limpia. Cada estructura a medida está hecha para resistir, para dar poco trabajo y para usarse todo el año.',
    },
  },

  'royal-palm-beach-contractors': {
    nombre: 'Royal Palm Beach',
    title: titulo('Royal Palm Beach'),
    description:
      'Pérgolas de aluminio y techos de lamas automatizados a medida en Royal Palm Beach.',
    dic: {
      'Royal Palm Beach Pergola Contractors': 'Pérgolas en Royal Palm Beach',
      'Professional pergola contractors serving Royal Palm Beach homes. Enhance your patio with a custom aluminum pergola or automated louvered roof engineered for structural integrity and long-term reliability.':
        'Instalamos pérgolas en las casas de Royal Palm Beach. Mejore su patio con una pérgola de aluminio a medida o un techo de lamas automatizado, calculado para ser sólido y fiable a largo plazo.',
      'Luxury Outdoor Pergolas in Royal Palm Beach': 'Pérgolas exteriores de gama alta en Royal Palm Beach',
      'Royal Palm Beach residents trust our aluminum pergolas to combine timeless design with engineered durability. We create custom shade systems built for Florida’s climate and lasting structural reliability.':
        'En Royal Palm Beach confían en nuestras pérgolas de aluminio, que unen un diseño que no pasa de moda y una durabilidad calculada. Creamos sistemas de sombra a medida para el clima de Florida, hechos para aguantar.',
    },
  },

  'sunny-isles-beach-pergola-builders': {
    nombre: 'Sunny Isles Beach',
    title: titulo('Sunny Isles Beach'),
    description:
      'Pérgolas de aluminio resistentes a la corrosión y techos motorizados frente al mar en Sunny Isles Beach.',
    dic: {
      'Sunny Isles Beach Pergola Builders': 'Pérgolas en Sunny Isles Beach',
      'Premier coastal pergola contractors in Sunny Isles Beach. Install a corrosion-resistant aluminum pergola or motorized roof system designed for oceanfront durability and luxury outdoor appeal.':
        'Somos especialistas en costa en Sunny Isles Beach. Instale una pérgola de aluminio que no se corroe o un techo motorizado pensado para aguantar frente al mar y para verse bien.',
      'Custom Coastal Pergolas in Sunny Isles Beach': 'Pérgolas de costa a medida en Sunny Isles Beach',
      'Sunny Isles Beach homeowners invest in our coastal-engineered aluminum pergolas for corrosion resistance and contemporary elegance. Our custom shade systems are designed for oceanfront durability and luxury outdoor comfort.':
        'En Sunny Isles Beach apuestan por nuestras pérgolas de aluminio calculadas para la costa, que no se corroen y tienen una elegancia contemporánea. Nuestros sistemas de sombra a medida están hechos para aguantar frente al mar y para dar confort.',
    },
  },

  'wellington-contractors': {
    nombre: 'Wellington',
    title: titulo('Wellington'),
    description:
      'Pérgolas de aluminio y sistemas de lamas motorizados a medida en Wellington.',
    dic: {
      'Wellington Pergola Contractors': 'Pérgolas en Wellington',
      'Luxury pergola contractors serving Wellington estates and residential properties. Elevate your outdoor lifestyle with a custom aluminum pergola or motorized louvered system built for performance and sophistication.':
        'Trabajamos con las fincas y las viviendas de Wellington. Mejore su exterior con una pérgola de aluminio a medida o un sistema de lamas motorizado hecho para rendir y para verse bien.',
      'High-End Pergola Installation in Wellington': 'Pérgolas de gama alta en Wellington',
      'Wellington properties benefit from our custom aluminum pergolas crafted for both sophistication and structural integrity. Each engineered shade solution enhances outdoor functionality while providing durability and refined design.':
        'Las propiedades de Wellington ganan con nuestras pérgolas de aluminio a medida, cuidadas y sólidas a la vez. Cada solución de sombra calculada mejora el uso del exterior y aporta durabilidad y buen diseño.',
    },
  },

  'west-palm-beach-contractors': {
    nombre: 'West Palm Beach',
    title: titulo('West Palm Beach'),
    description:
      'Pérgolas de aluminio y techos automatizados a medida para las casas frente al agua de West Palm Beach.',
    dic: {
      'West Palm Beach Pergola Contractors': 'Pérgolas en West Palm Beach',
      'High-end pergola contractors serving West Palm Beach waterfront homes. Create a refined outdoor retreat with a custom aluminum pergola or automated roof system engineered for coastal resilience.':
        'Trabajamos con las casas frente al agua de West Palm Beach. Cree un refugio exterior cuidado con una pérgola de aluminio a medida o un techo automatizado calculado para aguantar la costa.',
      'Luxury Pergola Builders in West Palm Beach': 'Pérgolas de gama alta en West Palm Beach',
      'West Palm Beach homeowners choose our high-end aluminum pergolas tailored to waterfront estates and upscale residences. Our custom-engineered shade systems provide durability, comfort, and architectural cohesion.':
        'En West Palm Beach eligen nuestras pérgolas de aluminio de gama alta, hechas a la medida de propiedades frente al agua y de viviendas de alto nivel. Nuestros sistemas de sombra calculados a medida aportan durabilidad, confort y coherencia con la casa.',
    },
  },

  'weston-pergola-solutions': {
    nombre: 'Weston',
    title: titulo('Weston'),
    description:
      'Pérgolas de aluminio a medida y techos de lamas motorizados en Weston, resistentes y de buen diseño.',
    dic: {
      'Weston Pergola Installation': 'Pérgolas en Weston',
      'Modern pergola contractors serving Weston homeowners seeking premium outdoor upgrades. Install a custom aluminum pergola or motorized louvered roof designed for structural performance and elegant backyard living.':
        'Instalamos pérgolas actuales en Weston para quien quiere mejorar su exterior. Ponga una pérgola de aluminio a medida o un techo de lamas motorizado, pensado para rendir y para un jardín cuidado.',
      'Custom Aluminum Pergolas in Weston': 'Pérgolas de aluminio a medida en Weston',
      'Weston residents enhance backyard living with our modern aluminum pergolas designed for strength and aesthetic appeal. We build durable, custom shade systems engineered for performance and long-term reliability.':
        'En Weston mejoran su jardín con nuestras pérgolas de aluminio actuales, resistentes y con buen aspecto. Construimos sistemas de sombra a medida, duraderos y calculados para rendir y ser fiables.',
    },
  },
};
