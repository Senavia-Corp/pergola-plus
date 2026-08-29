/**
 * El texto de las preguntas frecuentes, en los dos idiomas.
 *
 * Los HECHOS de cada pregunta (chip, tema, enlace, claves) viven en
 * `src/data/faqs.ts`; aqui solo va el copy. La bisagra entre las dos mitades es
 * el `id`, igual que en el estimador.
 *
 * POR QUE ANIDADO Y NO PLANO. `scripts/comprobar-i18n.mjs` cosecha el diccionario
 * global de todos los *.es.ts con el regex /'clave':\s*'valor'/. Con esta forma
 * anidada ese regex no casa ni una vez, asi que las preguntas inglesas NO entran
 * en el diccionario y no pueden dar falsos positivos en la comprobacion de
 * atributos. Con la forma plana ('Do I need a permit?': '¿Hace falta permiso?')
 * si entrarian.
 *
 * EL ESPANOL INCOMPLETO NO ROMPE. `FaqBiblioteca.astro` filtra las que no tienen
 * copy en `es` y avisa por consola, igual que hace `traducidos` en blog.es.ts.
 * Eso permite publicar una tanda de preguntas en ingles y traducirlas despues sin
 * que /es/resources/faq baje del 98 % que exige check:i18n.
 */
import type { Chip, Tema } from '../data/faqs';
import { FAQS } from '../data/faqs';
export type { Idioma } from './blog.es';
import type { Idioma } from './blog.es';

export interface CopyFaq {
  pregunta: string;
  respuesta: string;
  /**
   * Sinonimos TRADUCIBLES que no salen en el texto visible: "papeles tramite
   * licencia" para la de permisos. Es lo que hace que el buscador encuentre
   * "papeles" cuando la pregunta dice "permiso". Las claves que NO se traducen
   * (marcas, siglas) van en `claves` de faqs.ts, no aqui.
   */
  claves?: string;
}

export interface TextosFaq {
  todo: string;
  buscarEtiqueta: string;
  buscarPista: string;
  /** `{tema}` se sustituye por el nombre del tema. Una sola llave: check:paginas veta `{{`. */
  filtrandoPor: string;
  quitarFiltro: string;
  /** `{n}` se sustituye por el numero de resultados. */
  resultado: string;
  resultados: string;
  vacio: string;
  verMas: string;
  navFiltros: string;
  filtrarPor: string;
  /** `{n}` y `{tema}` se sustituyen. Una sola llave: check:paginas veta `{{`. */
  verTodas: string;
  ctaTitulo: string;
  ctaTexto: string;
  ctaBoton: string;
}

export const CHIPS_COPY: Record<Idioma, Record<Chip, string>> = {
  en: {
    permisos: 'Permits & Code',
    precios: 'Pricing & Timelines',
    pergolas: 'Pergolas & Roofs',
    sombra: 'Shade & Enclosures',
    obra: 'Hardscape & Construction',
    materiales: 'Materials & Care',
  },
  es: {
    permisos: 'Permisos y normativa',
    precios: 'Precios y plazos',
    pergolas: 'Pérgolas y techos',
    sombra: 'Sombra y cerramientos',
    obra: 'Obra y exteriores',
    materiales: 'Materiales y mantenimiento',
  },
};

export const TEMAS_COPY: Record<Idioma, Record<Tema, string>> = {
  en: {
    'motorized-louvered-pergolas': 'Motorized Louvered Pergolas',
    'solid-roof-pergolas': 'Insulated Solid Roof Pergolas',
    'open-air-pergolas': 'Open-Air Pergolas',
    'polycarbonate-pergolas': 'Polycarbonate Roof Pergolas',
    'solar-pergolas': 'Solar Roof Pergolas',
    sukkha: 'Sukkha 3000 System',
    cabanas: 'Custom Aluminum Cabanas',
    carports: 'Aluminum Carports',
    'screen-enclosures': 'Screen Enclosures',
    'motorized-screens': 'Motorized Screens',
    'pergola-design-construction': 'Custom Pergola Design & Build',
    pavers: 'Paver Installation',
    driveways: 'Paver Driveways',
    concrete: 'Structural Concrete',
    'deck-builders': 'Custom Decks',
    'fence-solutions': 'Fence Installation',
    'full-outdoor-remodel': 'Full Outdoor Remodel',
    'general-pergolas': 'Pergolas & Roof Systems',
    'general-permisos': 'Permits, Code & HOA',
    'general-precios': 'Pricing & Value',
    'general-materiales': 'Materials & Maintenance',
    'general-proceso': 'Process & Timelines',
    'general-empresa': 'Working With Pergola Plus',
  },
  es: {
    'motorized-louvered-pergolas': 'Pérgolas de lamas motorizadas',
    'solid-roof-pergolas': 'Pérgolas de techo aislado',
    'open-air-pergolas': 'Pérgolas abiertas',
    'polycarbonate-pergolas': 'Pérgolas de policarbonato',
    'solar-pergolas': 'Pérgolas solares',
    sukkha: 'Sistema Sukkha 3000',
    cabanas: 'Cabañas de aluminio',
    carports: 'Carports de aluminio',
    'screen-enclosures': 'Cerramientos con mosquitero',
    'motorized-screens': 'Cortinas motorizadas',
    'pergola-design-construction': 'Pérgolas a medida',
    pavers: 'Adoquinado',
    driveways: 'Entradas de coche',
    concrete: 'Hormigón estructural',
    'deck-builders': 'Decks',
    'fence-solutions': 'Vallado',
    'full-outdoor-remodel': 'Remodelación exterior integral',
    'general-pergolas': 'Pérgolas y techos',
    'general-permisos': 'Permisos, normativa y comunidad',
    'general-precios': 'Precios y valor',
    'general-materiales': 'Materiales y mantenimiento',
    'general-proceso': 'Proceso y plazos',
    'general-empresa': 'Trabajar con Pergola Plus',
  },
};

export const TEXTOS_FAQ: Record<Idioma, TextosFaq> = {
  en: {
    todo: 'All',
    buscarEtiqueta: 'Search the FAQ library',
    buscarPista: 'Search questions…',
    filtrandoPor: 'Filtering by: {tema}',
    quitarFiltro: 'Remove filter',
    resultado: '{n} question',
    resultados: '{n} questions',
    vacio: 'No questions match your search. Try another word, or ask us directly and we will answer it.',
    verMas: 'More about {tema}',
    navFiltros: 'Filter questions by category',
    filtrarPor: 'Filter by category',
    verTodas: 'See all {n} questions about {tema}',
    ctaTitulo: 'Need more information?',
    ctaTexto: 'Reach out to our team for specifics about your project',
    ctaBoton: 'Contact Us',
  },
  es: {
    todo: 'Todo',
    buscarEtiqueta: 'Buscar en la biblioteca de preguntas',
    buscarPista: 'Buscar preguntas…',
    filtrandoPor: 'Filtrando por: {tema}',
    quitarFiltro: 'Quitar el filtro',
    resultado: '{n} pregunta',
    resultados: '{n} preguntas',
    vacio: 'No hay preguntas que coincidan. Pruebe con otra palabra, o escríbanos y se la respondemos.',
    verMas: 'Más sobre {tema}',
    navFiltros: 'Filtrar las preguntas por categoría',
    filtrarPor: 'Filtrar por categoría',
    verTodas: 'Ver las {n} preguntas sobre {tema}',
    ctaTitulo: '¿Necesita más información?',
    ctaTexto: 'Hable con nuestro equipo y le contamos lo que aplique a su proyecto',
    ctaBoton: 'Contacto',
  },
};

export const FAQS_COPY: Record<Idioma, Record<string, CopyFaq>> = {
  en: {
    'permiso-sur-florida': {
      'pregunta': 'Do I need a permit to install a pergola in South Florida?',
      'respuesta':
        'Yes. In Palm Beach, Broward, and Miami-Dade counties, pergolas typically require permits, especially if they are attached to the home or include a motorized roof system. Structural calculations, wind-load engineering, and site plans are often required. In Miami-Dade, product approvals or NOA documentation may also apply. Working with a licensed contractor ensures your project meets local building codes and passes inspections properly.',
    },
    'huracan-homologacion': {
      'pregunta': 'Are aluminum pergolas hurricane-rated for Florida storms?',
      'respuesta':
        'High-quality aluminum pergolas can be engineered to meet South Florida wind-load requirements. Properly designed systems are built to withstand high wind speeds when installed according to structural specifications. Motorized louvered roof systems can also be designed to meet code requirements, depending on engineering and anchoring methods. Structural integrity is critical in coastal environments.',
    },
    'precio-pergola-aluminio': {
      'pregunta': 'How much does a custom aluminum pergola cost in Palm Beach, Broward, or Miami-Dade?',
      'respuesta':
        'Custom aluminum pergolas in South Florida typically range from the mid five figures upward, depending on size, motorization, integration features, and structural requirements. Motorized louvered systems are a premium investment due to engineering, automation, and electrical integration. Every project is custom-designed, so pricing reflects materials, permitting, and installation complexity.',
    },
    'pergola-vs-lamas': {
      'pregunta':
        'What is the difference between a standard pergola and a motorized louvered roof system?',
      'respuesta':
        'A standard pergola provides fixed shade through slats or beams. A motorized louvered roof system allows adjustable louvers that open and close electronically, offering full sun, partial shade, or complete rain protection. Louvered systems provide superior versatility, climate control, and functionality, making them ideal for high-end outdoor living spaces.',
    },
    'plazo-diseno-montaje': {
      'pregunta': 'How long does the installation process take from design to completion?',
      'respuesta':
        'The full process typically includes consultation, design development, engineering, permitting, fabrication, and installation. In South Florida, permitting timelines vary by municipality, but most projects take several weeks from approval to completion. Installation itself is usually completed within a few days once materials are ready.',
    },
    'revalorizacion-vivienda': {
      'pregunta': 'Will a pergola increase my property value?',
      'respuesta':
        'Yes, when professionally designed and installed, a custom aluminum pergola enhances curb appeal, functionality, and overall outdoor living experience. In high-value markets like Palm Beach and waterfront Broward or Miami properties, well-integrated outdoor structures can increase perceived and resale value by expanding usable living space.',
    },
    'integraciones-luz-ventilador': {
      'pregunta': 'Can the pergola be integrated with lighting, fans, screens, or outdoor kitchens?',
      'respuesta':
        'Absolutely. Modern pergola systems can integrate LED lighting, ceiling fans, retractable screens, heaters, drainage systems, and even smart-home controls. When planned correctly during the design phase, these integrations create a seamless and fully functional outdoor environment.',
    },
    'aluminio-vs-madera': {
      'pregunta': 'Are aluminum pergolas better than wood for South Florida’s climate?',
      'respuesta':
        'In humid and coastal environments, aluminum significantly outperforms wood in durability and maintenance. Wood structures require regular sealing, staining, and are vulnerable to rot, warping, and termites. Powder-coated aluminum offers corrosion resistance, structural strength, and minimal upkeep—ideal for South Florida conditions.',
    },
    'hoa-urbanizacion': {
      'pregunta': 'Do HOA approvals apply for pergolas in gated communities?',
      'respuesta':
        'Yes, most gated communities and HOAs require architectural approval before construction begins. Requirements vary by community and may include design review, color selection, height limitations, and placement guidelines. A professional contractor can provide drawings and documentation to streamline HOA approval.',
    },
    'lamas-lluvia-drenaje': {
      'pregunta': 'How do motorized louvered systems handle heavy rain and drainage?',
      'respuesta':
        'High-end motorized louvered systems are designed with integrated gutter systems that channel water into concealed drainage pathways within the posts. When closed, the louvers create a watertight seal that directs rain away from the seating area, allowing the space to remain usable during storms.',
    },
    'cabanas-permanente': {
      'pregunta': 'Are aluminum cabanas permanent?',
      'respuesta':
        'Yes, our custom aluminum cabanas are permanent structures engineered for Miami. We handle all permits to ensure a luxury, hurricane-resistant outdoor living space.',
    },
    'cabanas-cortinas': {
      'pregunta': 'Can I add motorized screens?',
      'respuesta':
        'Absolutely. Enhance your South Florida cabana with motorized retractable screens and privacy panels for instant shade, weather control, and ultimate comfort.',
    },
    'cabanas-huracan': {
      'pregunta': 'Are they hurricane-resistant?',
      'respuesta':
        'Yes. Every cabana built by Pergola Plus Florida is engineered to meet strict coastal wind-load codes, ensuring your luxury outdoor retreat withstands severe storms.',
    },
    'cabanas-mantenimiento': {
      'pregunta': 'What maintenance is required?',
      'respuesta':
        'Minimal. Our premium powder-coated extruded aluminum cabanas resist rust and corrosion, making them the perfect low-maintenance solution for humid coastal climates.',
    },
    'cabanas-luz-ventilador': {
      'pregunta': 'Can I add LED lights and fans?',
      'respuesta':
        'Yes! Our structural aluminum cabanas seamlessly integrate LED lighting, ceiling fans, and AV systems, transforming your backyard into a luxury nighttime oasis.',
    },
    'carports-uv': {
      'pregunta': 'Do carports block UV sun rays?',
      'respuesta':
        'Yes, our premium aluminum carports block harmful UV rays and intense South Florida heat, protecting your vehicle&#x27;s paint and interior from severe sun damage.',
    },
    'carports-viento': {
      'pregunta': 'Are they built for high winds?',
      'respuesta':
        'Every custom carport is structurally engineered to surpass Florida wind-load codes, guaranteeing top-tier hurricane protection and durability for your vehicles.',
    },
    'carports-diseno': {
      'pregunta': 'Can the design match my home?',
      'respuesta':
        'Absolutely. We offer fully custom modern carports with premium powder-coating to perfectly complement your home&#x27;s exterior, roofline, and luxury curb appeal.',
    },
    'carports-oxido': {
      'pregunta': 'Will the aluminum carport rust?',
      'respuesta':
        'No. Our high-quality powder-coated aluminum resists rust, corrosion, and fading, ensuring a maintenance-free, durable parking structure for coastal environments.',
    },
    'carports-permiso': {
      'pregunta': 'Do I need a building permit?',
      'respuesta':
        'Yes, permanent carports require permits. Pergola Plus Florida handles the entire engineering and permitting process for a hassle-free, code-compliant installation.',
    },
    'louvered-funcionamiento': {
      'pregunta': 'How do louvered pergolas work?',
      'respuesta':
        'Motorized louvered pergolas use adjustable aluminum roof slats controlled via remote or app, allowing you to instantly adjust shade, sunlight, and patio airflow.',
    },
    'louvered-huracan': {
      'pregunta': 'Are they safe in hurricanes?',
      'respuesta':
        'Yes. Our smart louvered roof systems are heavily engineered for Miami’s wind-load codes, delivering maximum structural strength and safety during severe storms.',
    },
    'louvered-sensor-lluvia': {
      'pregunta': 'Do they have rain sensors?',
      'respuesta':
        'Yes! Equipped with smart weather sensors, the automated roof closes instantly at the first drop of rain, protecting your outdoor furniture and patio year-round.',
    },
    'louvered-salitre': {
      'pregunta': 'Will the coastal salt rust it?',
      'respuesta':
        'Never. We use marine-grade powder-coated extruded aluminum, guaranteeing your motorized pergola remains rust-free and pristine even in harsh oceanfront locations.',
    },
    'louvered-plazo': {
      'pregunta': 'How fast is the installation?',
      'respuesta':
        'Once custom fabrication and permitting are complete, our expert installers assemble your smart pergola in just a few days with minimal disruption to your property.',
    },
    'screens-control': {
      'pregunta': 'How are screens controlled?',
      'respuesta':
        'Our motorized retractable screens operate smoothly via remote, wall switch, or smart home app, giving you instant outdoor climate control at the touch of a button.',
    },
    'screens-viento': {
      'pregunta': 'Can they withstand strong winds?',
      'respuesta':
        'Yes. Featuring advanced edge-retention tracks, our heavy-duty screen systems stay securely locked in place, providing exceptional stability during Florida storms.',
    },
    'screens-calor': {
      'pregunta': 'Do they reduce patio heat?',
      'respuesta':
        'Absolutely. Our premium solar mesh fabrics block up to 95% of UV rays, drastically lowering patio temperatures and sun glare while maintaining comfortable airflow.',
    },
    'screens-ocultas': {
      'pregunta': 'Are they hidden when not in use?',
      'respuesta':
        'Yes! When retracted, the screens roll seamlessly into a sleek, concealed aluminum housing, preserving the clean architectural lines of your luxury outdoor space.',
    },
    'screens-anadir-pergola': {
      'pregunta': 'Can you add them to my pergola?',
      'respuesta':
        'Yes, Pergola Plus Florida custom-measures and retrofits motorized retractable screens onto existing pergolas, lanais, or covered patios for enhanced bug protection.',
    },
    'open-air-por-que': {
      'pregunta': 'Why choose an open-air pergola?',
      'respuesta':
        'Open-air pergolas define your luxury outdoor living area with stunning architectural lines while preserving uninterrupted sky views and natural cooling breezes.',
    },
    'open-air-material': {
      'pregunta': 'Are they made of wood or metal?',
      'respuesta':
        'We strictly use high-grade extruded aluminum. Unlike wood, our powder-coated metal pergolas will never rot, warp, or require staining in South Florida&#x27;s climate.',
    },
    'open-air-iluminacion': {
      'pregunta': 'Can I add custom LED lighting?',
      'respuesta':
        'Yes. Our structural beams seamlessly hide electrical wiring, allowing for elegant integrated LED lighting to transform your open-air patio into an evening retreat.',
    },
    'open-air-revalorizacion': {
      'pregunta': 'Do they boost property value?',
      'respuesta':
        'Definitely. Permanent, high-end aluminum pergolas significantly elevate curb appeal, expand usable living space, and deliver a high ROI for luxury Florida homes.',
    },
    'open-air-normativa': {
      'pregunta': 'Are they built to Florida code?',
      'respuesta':
        'Yes. Every custom open-air pergola we design is fully engineered, permitted, and professionally installed to meet stringent South Florida hurricane wind-load codes.',
    },
    'polycarbonate-uv': {
      'pregunta': 'Do polycarbonate roofs block UV?',
      'respuesta':
        'Yes. Our advanced polycarbonate roofing panels are UV-treated to block 99% of harmful rays, protecting your skin and outdoor furniture while letting sunlight in.',
    },
    'polycarbonate-amarilleo': {
      'pregunta': 'Will the panels turn yellow?',
      'respuesta':
        'No. We use architectural-grade polycarbonate with built-in UV stabilizers, specifically engineered to resist yellowing or clouding under the intense Florida sun.',
    },
    'polycarbonate-tormentas': {
      'pregunta': 'Can they survive severe storms?',
      'respuesta':
        'Yes. Framed with heavy-duty aluminum, these impact-resistant translucent panels are engineered to exceed local wind-load requirements for ultimate storm durability.',
    },
    'polycarbonate-lluvia': {
      'pregunta': 'Do they keep the patio dry?',
      'respuesta':
        'Absolutely. A polycarbonate pergola features a solid, watertight roof and integrated drainage to keep your outdoor lounge completely dry during heavy summer rain.',
    },
    'polycarbonate-tintes': {
      'pregunta': 'Are the panel tints custom?',
      'respuesta':
        'Yes! We tailor every polycarbonate pergola to your home, offering custom frame colors and panel tint levels to perfectly match your outdoor aesthetic and shading needs.',
    },
    'enclosures-brisa': {
      'pregunta': 'Do enclosures block the breeze?',
      'respuesta':
        'Not at all. Our premium pool screen enclosures feature high-visibility mesh that stops insects and debris while maximizing refreshing natural airflow on your patio.',
    },
    'enclosures-normativa': {
      'pregunta': 'Do they meet hurricane codes?',
      'respuesta':
        'Yes. Pergola Plus Florida builds every aluminum screen enclosure to strict structural engineering standards to withstand hurricane-force winds and coastal weather.',
    },
    'enclosures-mosquitera': {
      'pregunta': 'Will the screen mesh sag easily?',
      'respuesta':
        'No. We install ultra-durable, high-tensile, and pet-resistant screening materials using precision tensioning to prevent sagging or tearing over years of heavy use.',
    },
    'enclosures-permiso': {
      'pregunta': 'Are building permits required?',
      'respuesta':
        'Yes, municipal permits are required. Our team expertly handles site surveys, engineering, and the full permitting process to ensure a legal, hassle-free installation.',
    },
    'enclosures-piscina': {
      'pregunta': 'Can you fit my complex pool?',
      'respuesta':
        'Absolutely. We custom-fabricate every aluminum frame to flawlessly integrate with your home&#x27;s unique architecture, multi-level decks, and custom pool layouts.',
    },
    'solar-paneles': {
      'pregunta': 'Can a pergola hold solar panels?',
      'respuesta':
        'Yes. Our dual-purpose solar pergolas create a luxurious shaded patio while structurally supporting a full array of solar panels to generate clean home energy.',
    },
    'solar-estructura': {
      'pregunta': 'Is the frame strong enough?',
      'respuesta':
        'Definitely. We engineer these specific structures with reinforced load-bearing aluminum beams to safely support heavy photovoltaic panels and extreme wind uplift.',
    },
    'solar-estanqueidad': {
      'pregunta': 'Is the lounge area waterproof?',
      'respuesta':
        'Yes. Our integrated sub-roofing and concealed drainage systems block rain effectively, ensuring the outdoor living space beneath your solar pergola stays fully dry.',
    },
    'solar-orientacion': {
      'pregunta': 'Do you orient it for max sun?',
      'respuesta':
        'Yes. During the custom design phase, we optimize the height, pitch, and placement of your solar pergola to capture maximum south-facing sun exposure for energy gain.',
    },
    'solar-permisos': {
      'pregunta': 'Do you handle all the permits?',
      'respuesta':
        'Yes. Building a solar pergola requires structural and electrical permits. Our team manages the entire documentation process for a seamless, code-compliant project.',
    },
    'solid-roof-calor': {
      'pregunta': 'Does the solid roof block heat?',
      'respuesta':
        'Yes! Our solid roof pergolas use high-density insulated panels to block 100% of radiant heat, keeping your Miami outdoor living space incredibly cool and comfortable.',
    },
    'solid-roof-estanqueidad': {
      'pregunta': 'Are they fully waterproof?',
      'respuesta':
        'Absolutely. The insulated aluminum panels interlock to form a sealed, waterproof roof with built-in gutters, providing total rain protection for outdoor kitchens.',
    },
    'solid-roof-ventilador-tv': {
      'pregunta': 'Can I add a ceiling fan or TV?',
      'respuesta':
        'Yes. The robust insulated roofing system features internal channels to hide wiring, allowing for clean installations of outdoor fans, LED lighting, and AV setups.',
    },
    'solid-roof-mantenimiento': {
      'pregunta': 'What maintenance is needed?',
      'respuesta':
        'Virtually none. Constructed from premium powder-coated aluminum, our insulated patio covers will never rust, rot, or fade. Just an occasional rinse keeps them pristine.',
    },
    'solid-roof-permiso-broward': {
      'pregunta': 'Are they permitted in Broward?',
      'respuesta':
        'Yes. As permanent load-bearing structures, they require permits. We provide full structural engineering and manage the approval process for complete code compliance.',
    },
    'sukkha-diferencia': {
      'pregunta': 'What makes Sukkha 3000 unique?',
      'respuesta':
        'The Sukkha 3000 is the pinnacle of luxury outdoor architecture, featuring proprietary modular engineering and minimalist design built specifically for high-end estates.',
    },
    'sukkha-personalizacion': {
      'pregunta': 'Is the design customizable?',
      'respuesta':
        'Yes. Completely bespoke, the Sukkha 3000 offers custom dimensions, premium architectural finishes, and specialized fascia to complement your luxury property perfectly.',
    },
    'sukkha-huracan': {
      'pregunta': 'Can it withstand hurricanes?',
      'respuesta':
        'Absolutely. Crafted from hyper-reinforced, marine-grade aluminum, the Sukkha 3000 is heavily engineered to surpass coastal building codes and endure extreme weather.',
    },
    'sukkha-domotica': {
      'pregunta': 'Does it support smart home tech?',
      'respuesta':
        'Yes. The structure seamlessly hides motorized screen mechanisms, weather sensors, LED arrays, and AV equipment, delivering the ultimate automated luxury experience.',
    },
    'sukkha-permanente': {
      'pregunta': 'Is it a permanent structure?',
      'respuesta':
        'Yes. The Sukkha 3000 is a permanent, professionally engineered architectural addition that drastically increases real estate value and functional luxury for your home.',
    },
    'concrete-armado': {
      'pregunta': 'Why is reinforced concrete important for outdoor projects?',
      'respuesta':
        'Reinforced concrete provides structural support for pergolas, decks, patios, and driveways. Proper steel reinforcement and grading prevent cracking and settlement in South Florida soil conditions.',
    },
    'concrete-fraguado': {
      'pregunta': 'How long does concrete take to fully cure?',
      'respuesta':
        'Concrete gains initial strength within days but continues curing for several weeks. Proper curing ensures long-term durability and climate resistance for South Florida construction projects.',
    },
    'concrete-permiso': {
      'pregunta': 'Do structural concrete projects require permits?',
      'respuesta':
        'Many structural concrete installations require permits in Palm Beach and Broward County. Professional concrete contractors manage documentation, inspections, and code compliance.',
    },
    'concrete-soporte': {
      'pregunta': 'Can concrete slabs support pergolas and decks?',
      'respuesta':
        'Yes. Engineered concrete slabs provide the structural foundation required for aluminum pergolas, composite decks, and outdoor kitchens in South Florida residential properties.',
    },
    'concrete-durabilidad': {
      'pregunta': 'How long does structural concrete last?',
      'respuesta':
        'When properly reinforced and professionally installed, structural concrete in South Florida can last decades, supporting luxury outdoor living structures.',
    },
    'decks-material': {
      'pregunta': 'What is the best decking material for Florida homes?',
      'respuesta':
        'Composite and aluminum decking systems are ideal for South Florida because they resist moisture, UV exposure, and warping. They outperform traditional wood decks in humid coastal climates.',
    },
    'decks-permiso': {
      'pregunta': 'Do custom decks require permits?',
      'respuesta':
        'Yes. Most elevated deck installations require permits. Our deck builders manage engineering, inspections, and building code compliance across Palm Beach and Broward County.',
    },
    'decks-durabilidad': {
      'pregunta': 'How long does a composite deck last?',
      'respuesta':
        'Composite decks in South Florida can last 25 years or more with minimal maintenance, making them a durable investment for luxury outdoor living environments.',
    },
    'decks-pergola': {
      'pregunta': 'Can decks integrate with pergolas?',
      'respuesta':
        'Custom deck builders design composite and aluminum decks that integrate seamlessly with pergolas, paver patios, and pool areas for cohesive outdoor living design.',
    },
    'decks-revalorizacion': {
      'pregunta': 'Does installing a deck increase property value?',
      'respuesta':
        'A professionally installed deck enhances usability and curb appeal. High-end deck construction in South Florida can positively impact resale value.',
    },
    'driveways-material': {
      'pregunta': 'What is the best driveway material for South Florida homes?',
      'respuesta':
        'Concrete pavers are ideal for driveway installation in South Florida due to their load-bearing strength and flexibility. Reinforced paver driveways resist cracking better than poured concrete under heavy rain and sun exposure.',
    },
    'driveways-permiso': {
      'pregunta': 'Do driveway installations require permits?',
      'respuesta':
        'Permit requirements vary by city. Our driveway contractors in Palm Beach and Broward County manage permitting, inspections, and compliance to ensure your driveway installation meets local building standards.',
    },
    'driveways-durabilidad': {
      'pregunta': 'How long does a paver driveway last?',
      'respuesta':
        'A professionally installed paver driveway in South Florida can last decades when built on a reinforced foundation. Proper compaction and drainage are essential for long-term performance.',
    },
    'driveways-sustitucion': {
      'pregunta': 'Can you replace an old concrete driveway?',
      'respuesta':
        'Yes. We remove damaged concrete and install custom paver or reinforced concrete driveway systems engineered for improved durability and enhanced curb appeal in South Florida.',
    },
    'driveways-revalorizacion': {
      'pregunta': 'Will a new driveway increase property value?',
      'respuesta':
        'A luxury driveway enhances first impressions and architectural cohesion. Professionally installed driveways in South Florida can improve resale value and overall property marketability.',
    },
    'fences-material': {
      'pregunta': 'What is the best fence material for South Florida properties?',
      'respuesta':
        'Aluminum fencing is ideal for South Florida due to corrosion resistance and wind durability. It performs better than wood fencing in humid and coastal environments.',
    },
    'fences-permiso': {
      'pregunta': 'Do fence installations require permits?',
      'respuesta':
        'Permit requirements vary by city and HOA guidelines. Professional fence contractors manage compliance and ensure code-approved installation across Palm Beach and Broward County.',
    },
    'fences-durabilidad': {
      'pregunta': 'How long does aluminum fencing last in Florida?',
      'respuesta':
        'Powder-coated aluminum fences can last decades in South Florida with minimal maintenance, even in high-humidity and salt-exposed environments.',
    },
    'fences-viento': {
      'pregunta': 'Are aluminum fences wind resistant?',
      'respuesta':
        'Yes. Professionally installed aluminum fences are engineered with reinforced posts and secure anchoring systems designed to withstand Florida wind loads.',
    },
    'fences-revalorizacion': {
      'pregunta': 'Does installing a fence increase home value?',
      'respuesta':
        'High-quality fencing enhances privacy, security, and curb appeal, contributing to increased property value in South Florida residential markets.',
    },
    'patio-permiso': {
      'pregunta': 'Do outdoor remodels require permits in South Florida?',
      'respuesta':
        'Structural outdoor remodeling projects almost always require permits, and a remodel that touches paving, concrete and a roofed structure needs several at once. We manage the engineering documentation and the building inspections in Palm Beach and Broward County.',
    },
    'patio-plazo': {
      'pregunta': 'How long does a full outdoor remodel take?',
      'respuesta':
        'Timelines vary based on scope and materials. Most South Florida outdoor remodels take several weeks including demolition, preparation, and installation — and running the trades under one schedule is usually faster than hiring them separately.',
    },
    'patio-pergola': {
      'pregunta': 'Can pergolas be added during an outdoor remodel?',
      'respuesta':
        'Yes, and it is the cheapest moment to do it. Integrating aluminum pergolas, motorized screens, and premium paver systems while the ground is already open creates a cohesive outdoor living environment without paying twice for the same groundwork.',
    },
    'patio-revalorizacion': {
      'pregunta': 'Will an outdoor remodel increase property value?',
      'respuesta':
        'A professionally remodeled exterior enhances usability and curb appeal on every side of the house, not just the back. Luxury outdoor remodeling in South Florida can improve resale value.',
    },
    'patio-material': {
      'pregunta': 'What materials are best for outdoor renovations?',
      'respuesta':
        'High-performance pavers, reinforced concrete slabs, and aluminum shade systems are ideal materials for durable outdoor remodeling in South Florida’s climate.',
    },
    'pavers-durabilidad': {
      'pregunta': 'How long do professionally installed pavers last in Florida?',
      'respuesta':
        'Professionally installed pavers in South Florida can last decades when built on a properly compacted and reinforced base. Our paver installation process prioritizes drainage planning and structural stability to prevent shifting or surface failure.',
    },
    'pavers-vs-hormigon': {
      'pregunta': 'Are pavers better than poured concrete for patios?',
      'respuesta':
        'Pavers offer greater flexibility and crack resistance compared to poured concrete patios. In South Florida’s climate, paver systems handle heat expansion and heavy rainfall more effectively while providing elevated design options.',
    },
    'pavers-drenaje': {
      'pregunta': 'Do paver patios require drainage systems?',
      'respuesta':
        'Yes. Proper grading and drainage are critical for paver patios in South Florida. Our paver contractors design installations that prevent water pooling, protect foundations, and maintain long-term structural integrity.',
    },
    'pavers-plazo': {
      'pregunta': 'How long does paver installation take?',
      'respuesta':
        'Paver installation timelines depend on size and base preparation. Most residential paver projects in Palm Beach and Broward County take several weeks, including excavation, compaction, and surface finishing.',
    },
    'pavers-revalorizacion': {
      'pregunta': 'Do paver installations increase property value?',
      'respuesta':
        'Luxury paver patios and driveways enhance curb appeal and outdoor functionality. Professionally installed pavers in South Florida can positively impact resale value and overall market appeal.',
    },
    'pergola-build-permiso': {
      'pregunta': 'Do I need a permit to build a pergola in South Florida?',
      'respuesta':
        'Yes. Most custom pergolas require permits in Palm Beach and Broward County. As experienced pergola contractors in South Florida, we handle structural engineering drawings, wind-load calculations, permit applications, and inspections to ensure full building code compliance.',
    },
    'pergola-build-material': {
      'pregunta': 'What is the best material for a pergola in Florida’s climate?',
      'respuesta':
        'Aluminum pergolas and motorized louvered roof systems are ideal for South Florida due to corrosion resistance, humidity durability, and minimal maintenance. Unlike wood pergolas, aluminum structures withstand salt air, heavy rain, and intense UV exposure.',
    },
    'pergola-build-plazo': {
      'pregunta': 'How long does custom pergola installation take?',
      'respuesta':
        'Custom pergola installation timelines vary based on design complexity and permitting approval. Most pergola projects in Palm Beach and Broward County take several weeks, including engineering, fabrication, inspections, and professional installation.',
    },
    'pergola-build-lamas-inversion': {
      'pregunta': 'Are motorized louvered pergolas worth the investment?',
      'respuesta':
        'Motorized louvered pergolas provide adjustable shade, rain protection, and ventilation control. For luxury outdoor living in South Florida, they improve year-round usability, enhance comfort, and increase long-term property value.',
    },
    'pergola-build-precio': {
      'pregunta': 'How much does a custom pergola cost in South Florida?',
      'respuesta':
        'Custom pergola costs depend on size, materials, and engineering requirements. Premium aluminum pergolas in South Florida are long-term structural investments designed for durability, architectural integration, and enhanced resale value.',
    },
    'permiso-cuanto-tarda': {
      'pregunta': 'How long does it take to get a pergola permit in South Florida?',
      'respuesta':
        'Review times vary by municipality. In most Palm Beach, Broward and Miami-Dade jurisdictions a residential pergola permit takes several weeks from submittal to issuance, and longer if the plan examiner returns comments. Coastal and historic districts add review layers. We submit the engineering package up front to keep the file moving instead of collecting corrections.',
      'claves': 'permit timeline approval review submittal',
    },
    'permiso-quien-lo-tramita': {
      'pregunta': 'Do you handle the permit, or does the homeowner?',
      'respuesta':
        'We do. As a licensed contractor we pull the permit under our license, prepare the site plan and structural package, coordinate the engineer\'s sealed drawings and meet the inspector at each required inspection. You sign the owner authorization and we carry the rest.',
      'claves': 'who pulls permit contractor license paperwork',
    },
    'permiso-sin-permiso-riesgo': {
      'pregunta': 'What happens if a pergola is built without a permit?',
      'respuesta':
        'Unpermitted structures create real problems: code enforcement can order removal, the work has to be opened up for after-the-fact inspection, and an open violation surfaces during a title search and can stall a sale or refinance. Insurers may also decline a wind claim on a structure that was never inspected.',
      'claves': 'unpermitted violation code enforcement fine title sale',
    },
    'permiso-noa-que-es': {
      'pregunta': 'What is an NOA and when does my project need one?',
      'respuesta':
        'A Notice of Acceptance is Miami-Dade\'s product approval: documentation that a specific system passed the impact and wind-load testing the High-Velocity Hurricane Zone requires. Miami-Dade and Broward sit in the HVHZ, so louvered roofs, screens and enclosures generally need either an NOA or a Florida Product Approval on file with the permit.',
      'claves': 'NOA notice acceptance product approval HVHZ certification',
    },
    'permiso-hvhz-que-es': {
      'pregunta': 'What does the High-Velocity Hurricane Zone mean for my build?',
      'respuesta':
        'Miami-Dade and Broward are the only two counties in the state inside the HVHZ, and the Florida Building Code applies a stricter chapter there: higher design wind speeds, tested products and tighter anchoring detail. In practice it means more engineering and approved components, not a different-looking pergola.',
      'claves': 'HVHZ high velocity hurricane zone wind speed code',
    },
    'permiso-palm-beach': {
      'pregunta': 'How is permitting different in Palm Beach County?',
      'respuesta':
        'Palm Beach sits outside the HVHZ, so design wind speeds are generally lower than in Miami-Dade and product approval requirements are less rigid. That said, each municipality runs its own building department, and towns along the coast and inside gated communities frequently add architectural review on top of the county permit.',
      'claves': 'Palm Beach county permitting municipality coastal',
    },
    'permiso-broward': {
      'pregunta': 'What does Broward County require for a pergola permit?',
      'respuesta':
        'Broward is inside the HVHZ, so the file needs sealed structural drawings, wind-load calculations for the exposure category of your address, a site plan showing setbacks, and product approval for any tested component. Cities like Fort Lauderdale, Weston and Coral Springs each run their own review on top of that.',
      'claves': 'Broward permit requirements sealed drawings setbacks',
    },
    'permiso-miami-dade': {
      'pregunta': 'What does Miami-Dade require that other counties don\'t?',
      'respuesta': 'Miami-Dade applies the strictest reading of the HVHZ chapter. Tested components need HVHZ-level documentation on file — a Miami-Dade NOA or a statewide Florida Product Approval issued for HVHZ use — and reviewers there are the least tolerant of gaps in it. Beachfront and barrier-island addresses draw a higher exposure category, which drives the anchoring and the post sizing.',
      'claves': 'Miami-Dade NOA product approval exposure coastal',
    },
    'permiso-retranqueos': {
      'pregunta': 'How close to the property line can a pergola be built?',
      'respuesta':
        'Setbacks are set by local zoning, not by the building code, and they differ between municipalities and between zoning districts inside the same city. Rear and side setbacks for an accessory structure are commonly measured to the outer edge of the roof, not the post. We check your parcel\'s zoning before drawing anything.',
      'claves': 'setback property line zoning distance easement',
    },
    'permiso-electricidad': {
      'pregunta': 'Does adding lights or a motor need a separate electrical permit?',
      'respuesta':
        'Yes. Motorized louvers, fans, heaters and integrated lighting are pulled as a separate electrical permit alongside the structural one, and the work has to be done by a licensed electrician on a GFCI-protected exterior circuit. It runs in parallel, so it does not usually add time.',
      'claves': 'electrical permit wiring GFCI licensed electrician motor',
    },
    'permiso-inspecciones': {
      'pregunta': 'What inspections does a pergola project go through?',
      'respuesta':
        'Typically a footing or slab-anchor inspection before concrete, a structural inspection once the frame and anchors are in, an electrical rough and final if there is power, and a final building inspection that closes the permit. We schedule and attend all of them.',
      'claves': 'inspection footing final rough close permit inspector',
    },
    'permiso-cierre-expediente': {
      'pregunta': 'How do I know the permit was actually closed out?',
      'respuesta':
        'A closed permit shows a passed final inspection in the building department\'s public record, and most jurisdictions let you look it up online by address. Ask for that record at handover. An open permit left behind by a previous contractor is one of the most common surprises during a sale.',
      'claves': 'closed permit final record lookup open permit sale',
    },
    'permiso-hoa-plazo': {
      'pregunta': 'How long does HOA architectural approval usually take?',
      'respuesta':
        'Most architectural review committees meet on a fixed calendar, often monthly, so the wait depends on where your submittal lands. We prepare the drawing set, color selections and material specs in the format the community asks for, which is what usually prevents a second round.',
      'claves': 'HOA architectural review committee ARC approval timeline',
    },
    'permiso-hoa-rechazo': {
      'pregunta': 'What if the HOA rejects the design?',
      'respuesta': 'Rejections are usually about a specific detail — the color, the height, how visible it is from the street — not the structure itself. We revise the affected item and resubmit. Because the HOA review runs before we file for the building permit, most revisions at that stage cost time rather than money; one that changes the structure enough to need re-engineering is the exception, and we tell you before doing it.',
      'claves': 'HOA rejected denied resubmit revision color height',
    },
    'permiso-carga-viento': {
      'pregunta': 'What wind speed is a pergola engineered to?',
      'respuesta': 'The design wind speed comes from the Florida Building Code map for your address and its exposure category, not from a marketing number. For a risk category II home across Miami-Dade, Broward and Palm Beach, that ultimate design speed generally lands somewhere between 150 and 175 mph depending on the parcel. The engineer sizes posts, footings and anchors to the figure for your address.',
      'claves': 'wind speed mph design load engineering exposure category',
    },
    'permiso-piscina-barrera': {
      'pregunta': 'Does a screen enclosure count as a pool safety barrier?',
      'respuesta':
        'It can. Florida\'s pool safety law accepts an enclosure that fully surrounds the pool and meets the barrier requirements, including self-closing and self-latching doors with the latch at the required height. Whether yours qualifies depends on how the enclosure meets the house and the doors on that run.',
      'claves': 'pool safety barrier enclosure self-closing latch code',
    },
    'permiso-ampliar-existente': {
      'pregunta': 'Can you permit an addition to a structure someone else built?',
      'respuesta':
        'Only if the existing structure was permitted and closed out. If it was, we engineer the addition to tie into it. If it was not, the existing work usually has to be legalized first, which means opening it for inspection and bringing it to current code before anything new is approved.',
      'claves': 'addition existing structure legalize after the fact permit',
    },
    'permiso-anclaje-losa': {
      'pregunta': 'Can a pergola be anchored to an existing patio slab?',
      'respuesta':
        'Sometimes. The engineer needs the slab thickness, its reinforcement and its edge distance to confirm it can take the uplift and overturning loads. Many older patio slabs are too thin, and the usual answer is to cut in footings at each post rather than trust the slab.',
      'claves': 'anchor existing slab footing uplift thickness rebar',
    },
    'permiso-alquiler-vacacional': {
      'pregunta': 'Are the rules different for a rental or commercial property?',
      'respuesta':
        'Yes. Commercial and multi-family projects are reviewed under a different occupancy classification, often with accessibility requirements, and short-term rentals can carry extra municipal conditions. We scope those before design so the drawings are right the first time.',
      'claves': 'commercial rental multifamily occupancy accessibility ADA',
    },
    'permiso-arbol': {
      'pregunta': 'Do I need approval to remove a tree that is in the way?',
      'respuesta':
        'Usually yes. Most South Florida municipalities protect trees above a certain trunk diameter and require a removal or relocation permit, sometimes with a replacement planting. It is worth checking early, because a protected tree can move where the structure goes.',
      'claves': 'tree removal permit protected diameter relocation landscape',
    },
    'permiso-servidumbre': {
      'pregunta': 'What if the best spot falls on a utility easement?',
      'respuesta':
        'Nothing permanent can sit on an easement: the utility has the right to dig it up and is not obliged to put your structure back. The survey shows where the easement runs, and the design either shifts clear of it or, in some cases, the utility grants a written encroachment agreement.',
      'claves': 'easement utility survey encroachment setback drainage',
    },
    'permiso-topografico': {
      'pregunta': 'Do I need a survey of my property to permit the work?',
      'respuesta':
        'For anything anchored to the ground, yes: the building department wants a site plan drawn over a current signed and sealed survey showing the structure, the setbacks and any easements. If your survey is recent and reflects the property as it stands, it can usually be reused.',
      'claves': 'survey site plan sealed signed property boundary',
    },
    'permiso-costa-corrosion-codigo': {
      'pregunta': 'Are there extra requirements within a certain distance of the ocean?',
      'respuesta':
        'Yes. Addresses near the coast draw a higher wind exposure category, which increases the design loads, and some jurisdictions add corrosion-resistance requirements for fasteners and hardware. Barrier-island and coastal construction control line properties can carry an additional state review.',
      'claves': 'coastal ocean exposure category corrosion fasteners barrier island',
    },
    'permiso-planos-sellados': {
      'pregunta': 'Why do the drawings need an engineer\'s seal?',
      'respuesta':
        'Because the plan examiner is reviewing a structure that has to resist hurricane wind, and Florida requires a licensed engineer to take professional responsibility for those calculations. The seal is what makes the load path — roof to beam to post to footing to soil — an enforceable, inspectable design.',
      'claves': 'sealed drawings engineer PE stamp calculations load path',
    },
    'permiso-cocina-exterior': {
      'pregunta': 'Does an outdoor kitchen under the pergola need its own permits?',
      'respuesta':
        'Usually more than one: electrical for the circuits, plumbing if there is a sink, and gas if there is a grill line. Clearances between a heat source and a combustible or a low roof are checked at inspection, so the layout is worth resolving during design, not on site.',
      'claves': 'outdoor kitchen grill gas plumbing sink clearance permit',
    },
    'permiso-vecino': {
      'pregunta': 'Does my neighbour have to agree to the project?',
      'respuesta':
        'Not as a rule. Zoning setbacks already fix how close to the line you can build, and meeting them is what matters legally. Neighbour consent only enters the picture where the design crosses onto their property or a shared easement, or where an HOA rule requires notification.',
      'claves': 'neighbour consent property line dispute setback notification',
    },
    'permiso-seguro-vivienda': {
      'pregunta': 'Will a permitted pergola affect my homeowners insurance?',
      'respuesta':
        'Tell your carrier either way. A permitted, engineered structure is what an insurer expects to see and is what makes a wind claim on it defensible; an unpermitted one can be excluded. Some carriers also want the structure listed so it is covered rather than treated as an unscheduled improvement.',
      'claves': 'insurance homeowners wind claim coverage carrier policy',
    },
    'permiso-impuestos': {
      'pregunta': 'Does a permitted structure raise my property taxes?',
      'respuesta':
        'It can. The property appraiser picks up permitted improvements and may adjust the assessed value of the parcel. The effect depends on your county\'s assessment and any homestead cap that applies, so it is a question for the appraiser\'s office rather than for a contractor.',
      'claves': 'property tax assessed value appraiser homestead millage',
    },
    'permiso-generador-solar': {
      'pregunta': 'What extra approvals does a solar pergola need?',
      'respuesta':
        'On top of the structural and electrical permits, a grid-tied array needs an interconnection agreement with your utility and, in many jurisdictions, a separate solar review. The structure also has to be engineered for the added dead load and the uplift on the panels themselves.',
      'claves': 'solar interconnection utility net metering array permit',
    },
    'permiso-cambios-en-obra': {
      'pregunta': 'Can the design change once the permit is issued?',
      'respuesta':
        'Small field adjustments are normal. Anything that moves the structure, changes its size or alters the load path needs a revision filed with the building department before it is built, because the inspector checks the work against the approved drawings. Revisions are routine but they take review time.',
      'claves': 'revision change order approved drawings field change inspector',
    },
    'precio-que-incluye': {
      'pregunta': 'What is included in a Pergola Plus quote?',
      'respuesta':
        'Design, structural engineering and sealed drawings, permit filing and fees, fabrication, delivery, installation and the inspections through to permit close-out. Anything that is not included — a slab, an electrical panel upgrade, landscaping repair — is listed as its own line rather than left to be discovered later.',
      'claves': 'included quote scope price line items exclusions',
    },
    'precio-por-que-varia': {
      'pregunta': 'Why do two pergolas of the same size cost different amounts?',
      'respuesta':
        'Span drives steel and aluminium sizing, so a structure with fewer posts costs more than the same footprint with more. On top of that: attached or freestanding, motorized or fixed, the exposure category of the address, whether footings have to be cut into an existing patio, and the finish.',
      'claves': 'price varies span posts attached motorized finish exposure',
    },
    'precio-financiacion': {
      'pregunta': 'Do you offer financing?',
      'respuesta':
        'Financing options are available for qualifying projects and we can walk you through what is current at the time of your quote. Terms, rates and approval come from the lender, not from us, so the honest answer is that it depends on the program and your credit.',
      'claves': 'financing payment plan loan monthly credit lender',
    },
    'precio-forma-de-pago': {
      'pregunta': 'How is payment structured?',
      'respuesta': 'In stages tied to milestones — a deposit to start design and engineering, a payment when materials are released to fabrication, and the balance at completion. Florida law does not cap the deposit, but it does attach duties to a large one: a contractor who takes more than 10% of the contract price up front has to apply for permits within 30 days and start work within 90. The schedule is written into the contract before anything is signed.',
      'claves': 'payment schedule deposit milestone balance contract draw',
    },
    'precio-presupuesto-gratis': {
      'pregunta': 'Is the estimate free, and what happens at the first visit?',
      'respuesta':
        'The consultation and estimate are free. We measure the space, look at the slab, the roofline and where power can come from, talk through how you actually want to use the area, and leave you with a scope and a number rather than a range you cannot plan around.',
      'claves': 'free estimate consultation site visit measure quote',
    },
    'precio-cuanto-cuesta-cabana': {
      'pregunta': 'What does a custom aluminum cabana cost?',
      'respuesta':
        'A cabana is priced like a small building rather than like a shade cover: it carries a solid roof, often walls or screens, and usually power. Expect it above a comparable open pergola of the same footprint. Size, roof type and whether it is plumbed move the number most.',
      'claves': 'cabana cost price pool house cost per square foot',
    },
    'precio-cuanto-cuesta-cerramiento': {
      'pregunta': 'How is a screen enclosure priced?',
      'respuesta':
        'Mostly by the enclosed volume and the span of the roof, because those set the aluminium sizing. A tall dome over a large pool costs considerably more than a low mansard over a patio of the same floor area. Screen type, door count and any existing footer to reuse also matter.',
      'claves': 'screen enclosure price cost pool cage dome mansard',
    },
    'precio-motorizada-vs-fija': {
      'pregunta': 'How much more is a motorized louvered roof than a fixed one?',
      'respuesta':
        'A motorized louvered system is a meaningful step up, not a small upgrade: it adds the louver mechanism, motors, controls, the sensor package, the integrated gutter and an electrical permit. Whether that is worth it depends on how often you would actually change the roof position.',
      'claves': 'motorized vs fixed price upgrade louvered cost difference',
    },
    'precio-mantenimiento-anual': {
      'pregunta': 'What does a pergola cost to maintain each year?',
      'respuesta':
        'For powder-coated aluminium, close to nothing: rinsing and a mild wash a few times a year is the whole routine. Motorized systems add a periodic check of the mechanism and the sensors. The recurring cost people forget is not the structure, it is the electricity for lighting and heaters.',
      'claves': 'maintenance cost annual upkeep cleaning service running cost',
    },
    'precio-garantia-cubre': {
      'pregunta': 'What does the warranty actually cover?',
      'respuesta':
        'Two separate things, and it is worth keeping them apart: the manufacturer\'s warranty on the system — frame, finish, motors, fabric — and our workmanship warranty on the installation itself. Terms differ by product line, so the specific coverage for your system is listed in your contract.',
      'claves': 'warranty coverage manufacturer workmanship finish motor terms',
    },
    'precio-garantia-transferible': {
      'pregunta': 'Does the warranty transfer if I sell the house?',
      'respuesta':
        'It depends on the manufacturer and the product line; some are transferable to the first subsequent owner, sometimes with a registration step and a window to do it in. If resale is on your mind, ask before you choose the system, not after.',
      'claves': 'warranty transfer sell house new owner registration resale',
    },
    'precio-plazo-total': {
      'pregunta': 'What is the realistic total timeline from signing to finished?',
      'respuesta':
        'Design and engineering, then permitting, then fabrication, then a short installation. The permit is almost always the longest and least predictable stage, and it is the one nobody controls. Installation itself is usually a matter of days once the material is on site.',
      'claves': 'timeline schedule how long start finish lead time',
    },
    'precio-obra-molestias': {
      'pregunta': 'How disruptive is the installation?',
      'respuesta':
        'Less than most exterior work. The noisy part is cutting and pouring footings, which is usually a day. After that it is assembly. We need access for a crew and a delivery, and the pool or patio is out of use while the structure goes up, not for the whole project.',
      'claves': 'disruption noise mess access crew pool use during',
    },
    'precio-lluvia-retrasos': {
      'pregunta': 'What happens to the schedule during the rainy season?',
      'respuesta':
        'Concrete and lifting work stop in a storm, so the summer months carry more weather days. We build that into the schedule rather than promising a date the sky decides. A named storm in the forecast also means securing loose material on site before it arrives.',
      'claves': 'rain season schedule delay weather summer storm hurricane',
    },
    'precio-sobrecostes': {
      'pregunta': 'What typically causes a project to go over the quoted price?',
      'respuesta':
        'Almost always something found underground or a change you ask for. Unmarked utilities, a slab that turns out too thin to anchor to, or rock where the footing goes are the common ones. Anything discovered is priced and approved as a written change order before we carry on.',
      'claves': 'overrun extra cost change order surprise hidden condition',
    },
    'precio-comparar-presupuestos': {
      'pregunta': 'How do I compare two quotes that are far apart?',
      'respuesta':
        'Read what each one excludes, not what it includes. Check whether engineering, permit fees and inspections are in the number, what the aluminium wall thickness and the finish are, whether the wind rating matches your address, and who holds the licence pulling the permit.',
      'claves': 'compare quotes bids cheaper apples to apples exclusions',
    },
    'precio-barato-riesgo': {
      'pregunta': 'Why is the cheapest quote usually the most expensive one?',
      'respuesta':
        'Because the savings normally come from somewhere structural: thinner extrusion, fewer or shallower footings, no sealed engineering, or no permit at all. Those choices are invisible on day one and decisive in a storm — and an unpermitted structure resurfaces when you sell.',
      'claves': 'cheapest quote risk thin aluminium no permit corner cutting',
    },
    'precio-deposito-cancelacion': {
      'pregunta': 'Can I cancel after signing, and what happens to the deposit?',
      'respuesta':
        'Florida gives consumers a right to cancel certain home solicitation contracts within a short window after signing, and the terms in your contract govern the rest. Once engineering is done and material is cut to your dimensions, those costs have been incurred and are not recoverable.',
      'claves': 'cancel deposit refund contract cooling off right rescind',
    },
    'precio-precio-fijo': {
      'pregunta': 'Is the quoted price fixed, or does it move with material costs?',
      'respuesta':
        'The contract price is what governs. Aluminium is a commodity and quotes carry a validity period for that reason — if you sign inside it, the number holds. What changes the price after signing is a change in scope, not a change in the market.',
      'claves': 'fixed price locked material cost aluminium escalation validity',
    },
    'precio-retorno-inversion': {
      'pregunta': 'Does an outdoor structure pay for itself at resale?',
      'respuesta':
        'Rarely dollar for dollar, and anyone promising that is guessing. What a well-integrated, permitted structure does reliably is add usable square footage and make the listing photograph better, which affects time on market as much as price. Treat it as living space you get to use now.',
      'claves': 'ROI resale value return investment appraisal listing',
    },
    'precio-fases': {
      'pregunta': 'Can the project be split into phases to spread the cost?',
      'respuesta':
        'Often yes, and the trick is deciding what has to be right the first time. Structure, footings and any conduit are worth doing up front, because retrofitting them later means opening finished work. Screens, lighting, heaters and a kitchen can genuinely come later if the structure was designed for them.',
      'claves': 'phases budget stage later add on future proof conduit',
    },
    'precio-tasas-permiso': {
      'pregunta': 'Are permit fees part of the quote or billed separately?',
      'respuesta':
        'They are in the quote. Municipal fees are usually calculated from the declared value of the work, so they are not identical between two towns for the same structure, and we carry them as a line item rather than as a surprise at the end.',
      'claves': 'permit fee cost municipal separate line item valuation',
    },
    'precio-losa-aparte': {
      'pregunta': 'Is the concrete slab included in a pergola price?',
      'respuesta':
        'Not by default. A pergola needs footings, which are included; a finished floor underneath it — slab, pavers, deck — is separate work with its own scope and price. We quote both when you want them together, but they are always shown as separate lines.',
      'claves': 'slab included concrete floor pavers deck footing separate',
    },
    'precio-visita-necesaria': {
      'pregunta': 'Can you quote from photos and measurements I send?',
      'respuesta':
        'We can give you a working range that way, and it is useful early. We cannot commit to a contract price without seeing the site, because the things that move the number — slab condition, where power is, access for a delivery, the roofline you are attaching to — do not show up in photos.',
      'claves': 'remote quote photos measurements estimate without visit',
    },
    'precio-descuento-temporada': {
      'pregunta': 'Is there a cheaper time of year to build?',
      'respuesta':
        'Prices do not swing seasonally, but schedules do. Demand climbs ahead of the winter season, so booking in the slower, wetter months usually buys you a faster slot rather than a lower price — which, given permit timelines, is often the more valuable of the two.',
      'claves': 'season cheaper best time year discount schedule availability',
    },
    'precio-plazo-cerramiento': {
      'pregunta': 'How long does a pool enclosure take to build?',
      'respuesta':
        'Fabrication is the long pole: the frame is cut to your pool\'s geometry, so nothing is off the shelf. Once material arrives, erecting the frame and screening it is usually a matter of days for a typical residential cage, longer for a large dome with multiple doors.',
      'claves': 'enclosure timeline how long build screen cage fabrication',
    },
    'precio-reparar-vs-sustituir': {
      'pregunta': 'Is it cheaper to rescreen an old enclosure or replace it?',
      'respuesta':
        'If the aluminium frame is sound and the footings are intact, rescreening is far cheaper and is the right call. Replacement makes sense when the frame is corroded at the base, the fasteners are failing, or the structure predates the wind code your address is now held to.',
      'claves': 'rescreen replace repair old enclosure corroded frame cost',
    },
    'precio-adoquin-vs-hormigon-coste': {
      'pregunta': 'Are pavers more expensive than poured concrete?',
      'respuesta':
        'Up front, usually yes. Over time the gap narrows: a cracked concrete slab is repaired by replacing a section that will not match, while a damaged paver is lifted and swapped individually. If you ever need to get under the surface for a pipe, pavers go back down invisibly.',
      'claves': 'pavers vs concrete cost price cheaper long term repair',
    },
    'precio-emergencia-tormenta': {
      'pregunta': 'Do you handle repairs after a storm?',
      'respuesta':
        'Yes, for systems we installed and, where we can, for others. After a named storm the queue is long across the whole industry, so the honest expectation is triage: safety and weather-tightness first, cosmetic repairs after. Photograph damage before touching anything for your claim.',
      'claves': 'storm damage repair hurricane after claim emergency service',
    },
    'precio-quien-instala': {
      'pregunta': 'Do you subcontract the installation?',
      'respuesta':
        'The structural installation is done by our own crews. Specialist trades that require their own licence — electrical, plumbing, gas — are performed by licensed subcontractors under the permit, which is how the code requires it. You get one point of contact either way.',
      'claves': 'subcontract crew in house installer licensed trades',
    },
    'material-aluminio-extruido': {
      'pregunta': 'What kind of aluminium are the structures made from?',
      'respuesta':
        'Extruded structural aluminium, not roll-formed sheet. Extrusion is what allows a thick, consistent wall and internal chambers for wiring and drainage. Wall thickness is the number worth asking about when you compare quotes, because it is where cost is quietly removed.',
      'claves': 'extruded aluminium alloy wall thickness gauge structural',
    },
    'material-lacado': {
      'pregunta': 'What is powder coating and why does it matter here?',
      'respuesta':
        'It is a dry finish baked onto the metal, which gives a harder, thicker and more UV-stable film than wet paint. In a salt-air climate the finish is the corrosion barrier, so its quality is not a cosmetic question. Architectural-grade coatings carry their own warranty against chalking and fade.',
      'claves': 'powder coat finish paint UV fade chalking AAMA anodized',
    },
    'material-colores': {
      'pregunta': 'What colours and finishes can I choose from?',
      'respuesta':
        'Standard architectural colours cover the range most homes want — whites and off-whites, bronzes, greys, black — plus wood-grain finishes that read like timber from a few feet away without behaving like it. Custom colours are possible and add lead time.',
      'claves': 'colours finishes wood grain bronze white black custom RAL',
    },
    'material-color-oscuro-calor': {
      'pregunta': 'Does a dark colour make the space hotter?',
      'respuesta':
        'The metal itself gets hotter to the touch, yes. Whether the space under it feels hotter depends much more on whether the roof is solid, insulated or louvered and on how air moves through. An insulated solid roof in a dark finish stays cooler underneath than an uninsulated light one.',
      'claves': 'dark colour heat black hot touch temperature insulated',
    },
    'material-salitre-primera-linea': {
      'pregunta': 'How does aluminium hold up directly on the ocean?',
      'respuesta':
        'Aluminium does not rust, but salt is still aggressive: it attacks at the weak points, which are cut edges, fasteners and any dissimilar metal in contact. Front-line addresses call for marine-grade hardware and stainless fasteners, and rinsing with fresh water is worth doing regularly.',
      'claves': 'salt air oceanfront corrosion stainless fasteners marine grade',
    },
    'material-galvanica': {
      'pregunta': 'Why can\'t I just use any screws for a repair?',
      'respuesta':
        'Because putting the wrong metal against aluminium sets up galvanic corrosion: the aluminium becomes the sacrificial one and eats away at the contact point. It is a slow, invisible failure that shows up years later as a loose fastener. Use what the manufacturer specifies.',
      'claves': 'galvanic corrosion screws fasteners dissimilar metal repair',
    },
    'material-limpieza': {
      'pregunta': 'How should I clean the structure?',
      'respuesta':
        'Rinse with a hose and wash with mild soap and a soft cloth. Skip abrasive pads, solvents and bleach — they take the finish off, and the finish is the protection. Do not use a pressure washer on the coating or into a louver mechanism.',
      'claves': 'clean wash soap pressure washer bleach solvent maintenance',
    },
    'material-moho-verdin': {
      'pregunta': 'How do I deal with mildew or green film on the frame?',
      'respuesta':
        'That growth sits on the surface, not in the metal, and comes off with mild soap and water. It reappears fastest where shade and damp meet, so trimming back planting that touches the frame does more than repeated cleaning. Avoid chlorine-based cleaners near screen fabric.',
      'claves': 'mildew mould algae green stains cleaning shade damp',
    },
    'material-madera-vs-aluminio-detalle': {
      'pregunta': 'Isn\'t real wood warmer looking than aluminium?',
      'respuesta':
        'It is, on day one. The trade in South Florida is that timber outdoors here needs sealing on a cycle and is exposed to rot, warping and termites, and a pergola is the hardest thing to maintain because you are working overhead. Wood-grain powder coating is how most clients split the difference.',
      'claves': 'wood vs aluminium look warm timber rot termites sealing',
    },
    'material-vinilo-pvc': {
      'pregunta': 'What about vinyl or PVC pergolas?',
      'respuesta':
        'Vinyl is maintenance-light and cheaper, but it is not a structural material at the spans people want here, so it usually hides a metal or timber core, and it softens and can discolour under sustained Florida sun. For anything that has to carry a wind load, aluminium is the material to argue about.',
      'claves': 'vinyl PVC pergola plastic cheaper structural sun discolour',
    },
    'material-policarbonato-vida': {
      'pregunta': 'How long do polycarbonate roof panels last?',
      'respuesta':
        'Quality multiwall panels carry a co-extruded UV layer and a manufacturer warranty measured in years against yellowing and loss of light transmission. The layer only works facing out, so orientation at installation matters as much as the panel you buy.',
      'claves': 'polycarbonate lifespan yellowing UV layer warranty panels',
    },
    'material-policarbonato-ruido': {
      'pregunta': 'Is a polycarbonate roof noisy in the rain?',
      'respuesta': 'Noticeably more than an insulated solid roof, yes — it is a thin panel and rain drums on it. Multiwall panels are quieter than single-skin, because the air chambers damp the impact. If you want to hold a conversation through a downpour, an insulated roof is the honest answer.',
      'claves': 'polycarbonate rain noise loud drumming sound insulated',
    },
    'material-techo-aislado': {
      'pregunta': 'What is inside an insulated solid roof panel?',
      'respuesta':
        'An insulating core bonded between two aluminium skins, which is what makes the panel both structural and thermally useful. It spans without a visible frame underneath, keeps the underside cooler than a bare metal roof, and gives you a clean flat ceiling to mount a fan or a light to.',
      'claves': 'insulated panel core foam sandwich ceiling fan mount span',
    },
    // Fuente: la carta de caracteristicas del cliente, «Skylight Integration
    // Capabilities: incorporate specialized weather-tight skylights into the solid
    // roof design». Sin medidas ni numero de unidades: eso no lo dice nadie.
    'material-techo-aislado-lucernario': {
      'pregunta': 'Can you put a skylight in a solid roof?',
      'respuesta':
        'Yes. Weather-tight skylights can be designed into the panel layout, which is the usual answer when a solid roof would otherwise leave a room or a window darker than it was. Where they go is a design decision taken with the structure, not something added afterwards, so it belongs in the drawing stage.',
      'claves': 'skylight solid roof daylight panel layout',
    },
    // Fuente: «Integrated Ceiling Finishes … concealing wiring and structural
    // elements» y «Custom Lighting & Fan Integration» de la carta del cliente, mas la
    // pregunta `solid-roof-ventilador-tv`. Lo que se ve en las fotos: ventiladores,
    // focos empotrados y un techo continuo sin estructura vista.
    'solid-roof-techo-visto': {
      'pregunta': 'What does the ceiling look like from underneath?',
      'respuesta':
        'A finished, continuous ceiling, not the underside of a metal deck. The panels carry internal channels for the wiring, so ceiling fans, recessed lighting and outlets are mounted into the ceiling instead of surface-run, and the structure stays hidden. The finish can be plain from the powder-coat palette or a wood-look texture.',
      'claves': 'ceiling finish wiring fan recessed lighting wood look',
    },
    // Fuente: el chip del cliente «Hidden Gutter System» y la respuesta
    // `solid-roof-estanqueidad` («interlock to form a sealed, waterproof roof with
    // built-in gutters»), reescrita para quitarle el «Absolutely» y el «total».
    'solid-roof-desague-oculto': {
      'pregunta': 'Where does the rain go?',
      'respuesta':
        'The panels interlock and the roof drains into a gutter built into the beam, so there is no separate gutter bolted on afterwards and nothing runs down the face of the structure. Keeping that channel clear is most of the maintenance: a blocked gutter is the usual reason water turns up where it should not.',
      'claves': 'drainage gutter beam rain runoff maintenance',
    },
    'material-mosquitera-tipos': {
      'pregunta': 'What screen mesh options are there?',
      'respuesta':
        'Standard fibreglass insect mesh, tighter no-see-um mesh for coastal and waterfront lots, solar screen that cuts heat and glare at the cost of some view, and heavy pet-resistant mesh for the lower panels. They can be mixed on the same enclosure, panel by panel.',
      'claves': 'screen mesh types no-see-um solar pet resistant fibreglass',
    },
    'material-mosquitera-duracion': {
      'pregunta': 'How often does screen mesh need replacing?',
      'respuesta':
        'Sun is what ages it, so the south and west panels go first and the shaded ones outlast them by years. Expect to rescreen the exposed faces before the whole cage. Individual panels are replaceable without touching the frame, which is the point of the spline system.',
      'claves': 'screen replace rescreen lifespan sun panel spline',
    },
    'material-lamas-mecanismo': {
      'pregunta': 'What maintenance does a motorized louvered roof need?',
      'respuesta':
        'Keep the gutters and the post drainage clear — a blocked channel is the most common cause of water where it should not be. Beyond that: rinse the louvers, check the sensors still respond, and have the mechanism looked at periodically. Do not pressure wash into the drive.',
      'claves': 'louvered maintenance service gutter drainage sensor motor clean',
    },
    'material-lamas-sin-luz': {
      'pregunta': 'What happens to a motorized roof in a power cut?',
      'respuesta':
        'The louvers hold their last position — they do not fall open. Systems can be specified with a manual override or a battery backup so you can close them during an outage, which is worth having in a region where the outage and the storm arrive together.',
      'claves': 'power cut outage motorized manual override battery backup',
    },
    'material-sensor-lluvia-falla': {
      'pregunta': 'Can the rain sensor close the roof while I\'m underneath?',
      'respuesta': 'That is what it is for, and it will. The louvers move slowly, and many systems offer obstruction detection — worth confirming for the one you choose, because it is not universal. If you would rather decide yourself you can disable the automation and drive it manually. Most people leave it on precisely because it works when nobody is home.',
      'claves': 'rain sensor automatic close safety obstruction override manual',
    },
    'material-domotica': {
      'pregunta': 'Does it integrate with Alexa, Google Home or a control system?',
      'respuesta':
        'Most motorized systems do, either natively or through a bridge, and a professionally installed control system can drive the roof, the screens, the lights and the fans from one scene. Decide this during design: running the control wiring later means opening finished work.',
      'claves': 'smart home Alexa Google Control4 Savant automation integration',
    },
    'material-ventilador-peso': {
      'pregunta': 'Can I hang a ceiling fan or a TV from the structure?',
      'respuesta':
        'Yes, if it is planned. A fan needs a rated mounting point and a beam able to take the dynamic load, and a TV needs a bracket, a conduit route and somewhere shaded enough that the screen survives. Both are easy in design and awkward as an afterthought.',
      'claves': 'ceiling fan TV mount hang weight bracket conduit beam',
    },
    'material-calefactor': {
      'pregunta': 'Can heaters be mounted under the roof?',
      'respuesta':
        'Electric infrared heaters are the usual choice because they need no gas line and have defined clearances to combustibles that are easy to meet under an aluminium roof. They draw real current, so the circuit has to be sized at design time rather than shared with the lighting.',
      'claves': 'heater infrared electric gas patio clearance circuit winter',
    },
    'material-iluminacion': {
      'pregunta': 'What lighting works best in an outdoor structure?',
      'respuesta':
        'Integrated LED in the beams or the louver blades for ambient light, plus a separate switched circuit for task lighting over a kitchen or a table. Fittings need an exterior rating and, near the coast, a housing that will not corrode. Warm colour temperature reads better outdoors than cool.',
      'claves': 'lighting LED integrated dimmable outdoor rated warm colour',
    },
    'material-drenaje-adonde': {
      'pregunta': 'Where does the water from the roof actually go?',
      'respuesta':
        'Into an integrated gutter and down through the inside of the posts, so there is no visible downpipe. What matters is where it comes out at the bottom: discharged against the house or onto a patio it becomes a different problem, so the outlet gets tied into drainage or directed away from the slab.',
      'claves': 'drainage gutter downspout post water discharge grading',
    },
    'material-cortinas-viento': {
      'pregunta': 'How much wind can motorized screens take?',
      'respuesta':
        'Each system has a rated wind speed above which it should be retracted, and better systems retract automatically on a wind sensor. Screens are a comfort and shade product, not a hurricane shutter — the rating to look for is on the specific fabric and track, not on the brand.',
      'claves': 'screen wind rating retract sensor hurricane shutter speed',
    },
    'material-cortinas-privacidad': {
      'pregunta': 'Do screens give privacy at night?',
      'respuesta':
        'The opposite, if the light is on inside. Mesh screens work by contrast: they hide the darker side. During the day you see out and others do not see in; after dark that reverses. For evening privacy you want a blackout or a dense solar fabric, not insect mesh.',
      'claves': 'privacy screen night see through blackout solar fabric shade',
    },
    'material-cristal-vs-mosquitera': {
      'pregunta': 'Should I enclose with glass instead of screen?',
      'respuesta':
        'Glass turns an outdoor room into a conditioned one, which changes the permit classification, the structure and the cost substantially. Screen keeps it outdoors: airflow, no air conditioning load, far cheaper. Choose by whether you want the space to be inside or outside, not by looks.',
      'claves': 'glass enclosure vs screen windows conditioned space sunroom',
    },
    'material-suelo-bajo': {
      'pregunta': 'What flooring works best under a pergola?',
      'respuesta':
        'Anything that drains and does not cook bare feet. Pavers and porcelain over a drainage layer are the common answers; light colours stay usable at midday, dark stone does not. If the structure is louvered, remember the floor gets wet, so pick something with slip resistance.',
      'claves': 'flooring under pergola pavers porcelain travertine hot slip',
    },
    'material-abejas-nidos': {
      'pregunta': 'Do wasps and lizards get inside the hollow sections?',
      'respuesta':
        'They try. Open beam ends and unsealed cavities are an invitation, which is why end caps and sealed penetrations are part of a proper installation rather than a detail. If something has already moved in, the fix is clearing it and closing the opening, not spraying repeatedly.',
      'claves': 'wasps nest lizards insects hollow beam end cap sealed pest',
    },
    'material-repintar': {
      'pregunta': 'Can the structure be repainted a different colour later?',
      'respuesta':
        'It can be refinished on site, but it will not be a factory powder coat and it will not last like one. If you think the colour may change with a future renovation, a neutral is the safer bet. Fading on a quality architectural finish is slow enough that most people never repaint.',
      'claves': 'repaint refinish colour change field paint fade recoat',
    },
    'material-reciclable': {
      'pregunta': 'Is an aluminium structure a sustainable choice?',
      'respuesta':
        'Aluminium is energy-intensive to produce and then almost indefinitely recyclable without losing properties, so the case rests on lifespan: a structure that stands for decades and is recycled at the end beats one replaced twice. Not needing sealants and stains every few years counts too.',
      'claves': 'sustainable recyclable eco environment green aluminium lifespan',
    },
    'material-huracan-desmontar': {
      'pregunta': 'Do I need to take anything down before a hurricane?',
      'respuesta':
        'The structure stays: it was engineered for that. Retract motorized screens and awnings, close or open the louvers as the manufacturer specifies for your system, and clear the space of furniture, planters and anything else that becomes a projectile. Clear the gutters too.',
      'claves': 'hurricane prep before storm retract screens furniture secure',
    },
    'pergola-adosada-vs-exenta': {
      'pregunta': 'Attached or freestanding — which should I choose?',
      'respuesta':
        'Attached extends the house, needs no posts on the wall side and usually feels like part of the home. Freestanding goes anywhere, does not load your roof structure and is easier to permit on an older house. If your fascia or truss cannot take the load, freestanding is not a style choice, it is the answer.',
      'claves': 'attached freestanding wall mounted ledger house fascia',
    },
    'pergola-tamano-tipico': {
      'pregunta': 'What size pergola do I actually need?',
      'respuesta':
        'Work backwards from the furniture. A dining set for six wants roughly 12 by 16 feet to leave room to pull chairs out; a lounge seating group wants more depth than width. Then add for the sun angle: at this latitude a low afternoon sun reaches a long way under a roof.',
      'claves': 'size dimensions how big square feet furniture dining lounge',
    },
    'pergola-orientacion': {
      'pregunta': 'Does which way the pergola faces matter?',
      'respuesta':
        'A great deal. A west-facing patio takes the hardest sun of the day and benefits most from adjustable louvers or a side screen; a south-facing one gets sun for longer but higher overhead, which a fixed roof handles well. Orientation should drive the roof type, not the other way round.',
      'claves': 'orientation facing west south sun angle afternoon shade',
    },
    'pergola-cuanta-sombra': {
      'pregunta': 'How much shade does an open-air pergola actually give?',
      'respuesta':
        'Less than people expect at midday and more in the morning and evening, because fixed slats block sun by angle. Slat depth and spacing set the trade-off between shade and light. If you want reliable shade at 2pm in July, a louvered or solid roof is the honest recommendation.',
      'claves': 'shade coverage open air slats spacing midday sun percentage',
    },
    'pergola-lluvia-abierta': {
      'pregunta': 'Can I use an open-air pergola when it rains?',
      'respuesta':
        'No — an open slat roof sheds nothing. That is the trade for the light and airflow. If you want to keep using the space through a Florida afternoon storm you need a louvered roof that closes, an insulated solid roof, or a retractable canopy added underneath.',
      'claves': 'rain open air pergola wet shelter canopy retractable',
    },
    'pergola-convertir-existente': {
      'pregunta': 'Can my existing pergola be upgraded to a louvered roof?',
      'respuesta':
        'Only if the existing posts, beams and footings were engineered for the extra dead load and the different uplift a closed roof creates. A closed roof catches wind that an open slat frame lets through, so this is a structural question first. Often the frame is replaced and only the slab is reused.',
      'claves': 'upgrade retrofit existing pergola convert louvered roof add',
    },
    'pergola-lamas-que-angulo': {
      'pregunta': 'How far do the louvers actually rotate?',
      'respuesta': 'Typically through about 140 to 170 degrees depending on the system, which is what lets you go from fully open sky to a closed roof and stop anywhere in between. The useful positions in practice are closed for rain, part-open for filtered light, and open for evening.',
      'claves': 'louver rotation degrees angle open closed position tilt',
    },
    'pergola-lamas-cuanto-duran': {
      'pregunta': 'How long do the motors last, and can they be replaced?',
      'respuesta':
        'Motors are a serviceable component, not a sealed part of the structure: they are designed to be reached and swapped without dismantling the roof. Life depends on cycles and on whether water is getting where it should not, which is why keeping the drainage clear matters.',
      'claves': 'motor lifespan replace service repair actuator cycles',
    },
    'pergola-solar-cuanto-produce': {
      'pregunta': 'How much power can a solar pergola realistically produce?',
      'respuesta':
        'It scales with roof area and orientation, not with ambition. A pergola-sized array is typically a useful supplement — pool pump, lighting, EV top-up — rather than a whole-house system. The design conversation should start with your consumption, not with the number of panels that fit.',
      'claves': 'solar output kW production panels offset pool pump EV',
    },
    'pergola-solar-sombra-debajo': {
      'pregunta': 'Is it fully shaded and dry under a solar pergola?',
      'respuesta':
        'Shaded, yes — the panels are opaque. Dry depends on how they are mounted: panels laid with sealed joints and a gutter behave like a solid roof, panels on rails with gaps do not. If you want a dry lounge underneath, that has to be specified, not assumed.',
      'claves': 'solar panels shade dry underneath waterproof gaps rails',
    },
    'pergola-sukkha-diferencia-detalle': {
      'pregunta': 'Who is the Sukkha 3000 system for?',
      'respuesta':
        'It suits projects that want a defined, engineered system with a known configuration rather than a fully bespoke one-off — faster to specify, faster to permit, and priced accordingly. If your space has unusual geometry or an awkward tie-in, a custom design is the better fit.',
      'claves': 'Sukkha 3000 system who for suitable configuration bespoke',
    },
    'pergola-cuantos-pilares': {
      'pregunta': 'Can I have a pergola with fewer posts in the way?',
      'respuesta':
        'Yes, and it is the most common request. Fewer posts means longer spans, which means deeper beams and bigger footings, so it costs more and the structure looks heavier overhead. Cantilevering one edge is often a better answer than removing a post from the middle.',
      'claves': 'posts columns fewer open span cantilever clear view beam',
    },
    'pergola-altura': {
      'pregunta': 'How high should the roof be?',
      'respuesta':
        'High enough to clear doors and to let the low sun in, low enough to still feel like a room and to actually shade you. Around eight to ten feet of clear height suits most homes. Going higher lets in more afternoon sun from the side, which is the opposite of what people expect.',
      'claves': 'height ceiling clearance how tall feet low sun',
    },
    'pergola-piscina-cloro': {
      'pregunta': 'Is it a problem to build right over a pool?',
      'respuesta':
        'No, but it changes the detailing. Chlorine and salt-chlorinated water are corrosive in vapour form, so hardware specification matters more, and anything mounted overhead has to be safe to service without draining the pool. Footings also have to clear the pool shell and its plumbing.',
      'claves': 'over pool chlorine salt water corrosion shell plumbing footing',
    },
    'pergola-viento-ruido': {
      'pregunta': 'Do aluminium structures rattle or hum in the wind?',
      'respuesta':
        'A properly assembled one does not. Noise in wind almost always means something is loose — a fastener backed out, an end cap missing, a screen track not fully seated. It is worth chasing rather than living with, because a rattle is a component working itself further loose.',
      'claves': 'noise rattle hum wind vibration loose fastener creaking',
    },
    'pergola-carport-coche': {
      'pregunta': 'Will a carport actually fit my vehicle?',
      'respuesta':
        'Measure height, not just length. A standard sedan is easy; a lifted truck, a van with a roof rack or an RV needs clear height specified up front, and roof-mounted accessories are what usually catch people out. Post placement also has to leave room to open the doors.',
      'claves': 'carport size height RV truck van clearance door swing',
    },
    'pergola-carport-granizo': {
      'pregunta': 'Does a carport protect the car from more than sun?',
      'respuesta':
        'Sun is the main one here, and it is not trivial: constant UV is what fades paint and cracks dashboards. A solid roof also keeps rain and falling debris off. What an open carport does not do is protect from wind-driven rain or from anything travelling sideways in a storm.',
      'claves': 'carport protection sun UV paint hail debris rain wind',
    },
    'pergola-cabana-bano': {
      'pregunta': 'Can a cabana include a bathroom or an outdoor shower?',
      'respuesta':
        'Yes, and it is a common request next to a pool, but it changes the project: plumbing permits, a drainage connection and, for a bathroom, ventilation requirements. Running the supply and waste lines is far cheaper before the surrounding hardscape goes down than after.',
      'claves': 'cabana bathroom shower plumbing pool house toilet drainage',
    },
    'pergola-cabana-almacen': {
      'pregunta': 'Can a cabana double as pool equipment storage?',
      'respuesta':
        'It can, and it is a good use of the volume, but keep the equipment side separate and ventilated: pool chemicals and salt systems corrode metal and electronics in an enclosed space. A louvered or screened door on that bay handles it without giving up the look.',
      'claves': 'cabana storage pool equipment chemicals pump ventilation',
    },
    'pergola-cerramiento-mansarda': {
      'pregunta': 'Mansard, gable or dome — what\'s the difference?',
      'respuesta':
        'It is mostly about height and how the roof sheds. A flat or mansard cage is lower and cheaper and suits a patio; a gable or dome gains headroom over a pool and handles water better on a large span. Local wind requirements sometimes rule out the tallest option.',
      'claves': 'mansard gable dome hip enclosure roof style height span',
    },
    'pergola-cerramiento-hojas': {
      'pregunta': 'Do enclosures keep leaves and pollen out of the pool?',
      'respuesta':
        'Leaves and larger debris, yes, and that is the saving most owners notice: less skimming and less pump load. Pollen is fine enough to pass through insect mesh. A tighter no-see-um mesh catches more of it at the cost of some airflow and some view.',
      'claves': 'leaves debris pollen pool cleaning skimmer maintenance mesh',
    },
    'pergola-cortinas-instalar-despues': {
      'pregunta': 'Can motorized screens be added to a pergola I already have?',
      'respuesta':
        'Often yes. What the retrofit needs is somewhere solid to mount the cassette and the side tracks, a straight enough opening for the fabric to run in, and a power route. Timber and older frames sometimes need reinforcement first, which is worth checking before ordering.',
      'claves': 'retrofit add screens existing pergola cassette track power',
    },
    'pergola-cortinas-mascotas': {
      'pregunta': 'Will a dog or cat wreck the screens?',
      'respuesta':
        'Standard insect mesh, probably, at the height they reach. The usual answer is pet-resistant mesh on the lower panels and normal mesh above, which keeps the view and the airflow where it counts. On motorized screens, a fabric with a heavier weave is the equivalent option.',
      'claves': 'pet dog cat claws damage screen mesh resistant lower panel',
    },
    'pergola-cortinas-cuantas': {
      'pregunta': 'Do I need screens on all four sides?',
      'respuesta':
        'Rarely. Most spaces need one or two: the side the afternoon sun comes from and the side facing a neighbour or a road. Screening every opening turns an outdoor room into a box and costs four times as much. Start with the worst side and add later if the tracks are planned for.',
      'claves': 'how many screens sides four all around partial coverage',
    },
    'pergola-cerramiento-mascota': {
      'pregunta': 'Can I add a pet door to an enclosure?',
      'respuesta':
        'Yes, and it is easier to build in than to cut in later. It goes in a framed panel rather than in the mesh itself, so the structure and the screen tension are unaffected. Position matters: away from the pool side if the point is to keep the animal out of the water.',
      'claves': 'pet door dog flap enclosure panel install cut later',
    },
    'pergola-policarbonato-vs-macizo': {
      'pregunta': 'Polycarbonate or an insulated solid roof?',
      'respuesta':
        'Polycarbonate keeps the space bright and is cheaper; an insulated roof is quieter in rain, much cooler underneath and gives you a flat ceiling to mount things to. If the area sits against a north wall or a dark room, polycarbonate protects the daylight you would otherwise lose.',
      'claves': 'polycarbonate vs solid roof insulated light bright cooler choice',
    },
    'pergola-nieve-carga': {
      'pregunta': 'Are these structures rated for snow load?',
      'respuesta':
        'Not relevant here — South Florida structures are engineered for wind uplift, which is a different and in many ways harder problem. If you are having something shipped to a northern state, the engineering has to be redone for snow; a Florida wind package does not transfer.',
      'claves': 'snow load north cold climate rating transfer engineering',
    },
    'pergola-fabricacion-medida': {
      'pregunta': 'Is anything standard, or is every project custom?',
      'respuesta':
        'The components are standard — extrusions, brackets, louver blades, panel systems — and the configuration is custom. That is deliberate: standard parts mean a replacement is available in five years, while the dimensions still match your space rather than forcing your space to match a kit.',
      'claves': 'custom standard kit off the shelf components replacement parts',
    },
    'pergola-comercial': {
      'pregunta': 'Do you build for restaurants, hotels and HOAs?',
      'respuesta':
        'Yes. Commercial work runs on a different track: occupancy classification, accessibility, sometimes fire-rating questions and usually a stricter programme because the space is earning money while it is closed. The structures are the same family of systems, engineered to the commercial load case.',
      'claves': 'commercial restaurant hotel HOA amenity business project',
    },
    'pergola-garantia-viento': {
      'pregunta': 'Is the structure guaranteed to survive a hurricane?',
      'respuesta':
        'No honest contractor guarantees that, and be wary of one who does. What is guaranteed is that it was engineered and permitted to the design wind speed for your address and inspected against those drawings. Above the design event, nothing on any property is a certainty.',
      'claves': 'hurricane guarantee survive warranty wind damage claim',
    },
    'obra-adoquin-hundimiento': {
      'pregunta': 'Why do paver patios sink or go uneven?',
      'respuesta':
        'Almost always the base, not the pavers. A compacted aggregate base of the right depth is what carries the load; skimp on it or fail to compact in lifts and the surface settles in the first wet season. Edge restraint is the other half — without it the field spreads outward.',
      'claves': 'pavers sinking settling uneven base compaction edge restraint',
    },
    'obra-adoquin-sellado': {
      'pregunta': 'Should paver patios be sealed?',
      'respuesta':
        'Optional, and it is a trade. Sealing deepens the colour, resists staining and locks the joint sand, but it has to be redone periodically and a gloss sealer can be slippery when wet — which matters around a pool. Many owners seal a driveway and leave a pool deck bare.',
      'claves': 'seal pavers sealer gloss slippery stain joint sand reapply',
    },
    'obra-adoquin-hierba': {
      'pregunta': 'How do I stop weeds growing between pavers?',
      'respuesta':
        'Weeds germinate in the joint from seed landing on top, not from below through a proper base. Polymeric jointing sand is the usual defence and it hardens to resist both washout and germination. Topping up the joints every few years does more than any spray.',
      'claves': 'weeds grass between pavers joint sand polymeric ants',
    },
    'obra-adoquin-piscina-caliente': {
      'pregunta': 'Which paver stays coolest around a pool?',
      'respuesta':
        'Colour matters more than material: a light travertine or a pale concrete paver is walkable barefoot at midday where a dark stone is not. Texture helps too — a shell-stone or tumbled finish reflects and grips better than a smooth dark surface.',
      'claves': 'cool pavers barefoot hot pool deck travertine shell stone colour',
    },
    'obra-adoquin-entrada-coche': {
      'pregunta': 'Is a paver driveway built differently from a patio?',
      'respuesta':
        'Yes, and the difference is under the surface: a driveway needs a deeper compacted base and usually a thicker paver to take vehicle loads, plus attention to where the tyres turn. A patio base under a driveway is the single most common reason a drive ruts within a couple of years.',
      'claves': 'driveway base depth thickness vehicle load rutting patio difference',
    },
    'obra-entrada-manchas-aceite': {
      'pregunta': 'Can oil stains be removed from a paver driveway?',
      'respuesta':
        'Usually, and this is where pavers beat concrete: a stain that will not lift comes out by replacing the individual units, and if you kept a few spares from the original pallet the repair is invisible. Fresh oil responds to a degreaser; old oil that has soaked in rarely does.',
      'claves': 'oil stain driveway remove degreaser replace paver spare',
    },
    'obra-hormigon-grietas': {
      'pregunta': 'Why does concrete crack, and can it be prevented?',
      'respuesta':
        'Concrete shrinks as it cures and it will crack; the question is where. Control joints are cut so it cracks along a line you chose instead of across the middle. Reinforcement, a proper mix and correct curing control the width, not the existence, of cracking.',
      'claves': 'concrete crack control joint shrinkage reinforcement curing',
    },
    'obra-hormigon-pisar': {
      'pregunta': 'How soon can I walk or park on new concrete?',
      'respuesta':
        'Foot traffic usually after a day or so, vehicles considerably longer — concrete keeps gaining strength for weeks and reaches its design strength well after it looks finished. Parking early is how a new driveway gets its first permanent scar. We give you the dates for your pour.',
      'claves': 'walk park new concrete cure time strength days vehicle',
    },
    'obra-hormigon-vs-adoquin-cual': {
      'pregunta': 'When is poured concrete the better choice over pavers?',
      'respuesta':
        'When you want a large unbroken surface, when the budget is tight, or under something that will be built on top later. Concrete is also easier to keep clean. Pavers win on repairability, on access to what is buried underneath, and on not showing a patch.',
      'claves': 'concrete vs pavers when better choice slab large clean',
    },
    'obra-drenaje-patio': {
      'pregunta': 'How do you keep water from pooling on a patio?',
      'respuesta':
        'With slope, first: a small fall away from the house across the whole surface moves more water than any drain. Where slope alone cannot do it — a courtyard, a low spot, a patio hemmed in by the house — a channel drain or a dry well takes the rest.',
      'claves': 'drainage patio pooling water slope grading channel drain dry well',
    },
    'obra-patio-cuanto-dura-obra': {
      'pregunta': 'Can I use my yard while the patio is being remodelled?',
      'respuesta':
        'Partly. Demolition and base work need machine access and the area is genuinely a building site for those days. We stage the work so the pool equipment and the way into the house stay reachable, but expect the outdoor space itself to be out of use until the surface is down.',
      'claves': 'during construction yard access use pool equipment mess stage',
    },
    'obra-patio-por-donde-empezar': {
      'pregunta': 'What order should an outdoor project be done in?',
      'respuesta':
        'Anything that goes under the surface first: drainage, conduit, plumbing, footings. Then the structure, then the hardscape, then the planting. Doing the paving before the pergola footings means cutting up new work, which is the most common and most avoidable mistake.',
      'claves': 'order sequence phases first hardscape pergola conduit drainage',
    },
    'obra-deck-material-cual': {
      'pregunta': 'Composite or wood decking in Florida?',
      'respuesta':
        'Composite, for most people here. Wood needs sealing on a cycle and is exposed to rot and termites in this climate; composite does not. The trade is heat — dark composite gets hot underfoot — and cost up front. Choose a light colour if the deck is in full sun.',
      'claves': 'composite wood decking Florida trex heat rot termites',
    },
    'obra-deck-sobre-hormigon': {
      'pregunta': 'Can a deck be built over an existing concrete slab?',
      'respuesta':
        'Yes, and it is a good way to rescue a cracked or ugly slab without demolition. The framing sits on sleepers with a gap for drainage and airflow underneath. The catch is height: the finished deck ends up a few inches higher, which can affect a door threshold.',
      'claves': 'deck over concrete slab sleepers existing height threshold',
    },
    'obra-valla-aluminio-vs-pvc': {
      'pregunta': 'Aluminium, vinyl or wood fencing?',
      'respuesta':
        'Aluminium for a see-through boundary that survives salt air and meets pool code; vinyl for privacy with no painting; wood for the look, accepting the maintenance. In a hurricane zone, a solid fence catches wind that a picket aluminium one lets through, which changes the post spec.',
      'claves': 'fence aluminium vinyl wood privacy pool code wind',
    },
    'obra-valla-piscina-normativa': {
      'pregunta': 'What does pool fencing have to comply with?',
      'respuesta':
        'Florida\'s pool safety requirements set a minimum height, a maximum gap between pickets and at the bottom, no horizontal members a child can climb, and self-closing self-latching gates with the latch above a set height. A decorative fence that misses any of those does not qualify as a barrier.',
      'claves': 'pool fence code height gap picket gate latch barrier safety',
    },
    'obra-valla-lindero': {
      'pregunta': 'Who owns and maintains a fence on the property line?',
      'respuesta':
        'It depends on where it actually sits, which is what the survey tells you. A fence built inside your line is yours; one straddling the line is usually shared, and that is worth agreeing in writing with the neighbour before it goes up rather than after it needs replacing.',
      'claves': 'fence property line ownership neighbour shared survey maintain',
    },
    'obra-valla-huracan': {
      'pregunta': 'Do fences survive hurricanes here?',
      'respuesta':
        'Aluminium picket fencing generally does, because wind passes through it. Solid vinyl and wood privacy fences are the ones that go down, since they act as a sail and load the posts hard. Post depth and spacing, and whether the posts are set in concrete, decide the outcome.',
      'claves': 'fence hurricane wind survive privacy solid post concrete depth',
    },
    'obra-hormigon-espesor': {
      'pregunta': 'How thick should a patio or driveway slab be?',
      'respuesta':
        'Thicker under vehicles than under furniture, and the reinforcement matters as much as the depth. What actually governs is the sub-base: a correctly compacted base under a modest slab outperforms a thick slab poured on soft ground, which is where most failures start.',
      'claves': 'slab thickness inches driveway patio rebar mesh sub base',
    },
    'obra-cuanto-dura-adoquin': {
      'pregunta': 'How long should a paver installation last?',
      'respuesta':
        'Decades, if the base was right — the units themselves outlast the installation. What ages is the joint sand and the edge restraint, and both are serviceable. An installation that looks tired after five years is telling you about its base, not about its pavers.',
      'claves': 'pavers lifespan how long last decades base joint edge',
    },
    'obra-reutilizar-adoquin': {
      'pregunta': 'Can my existing pavers be lifted and reused?',
      'respuesta':
        'Often yes, and it is a real saving when the pavers are sound but the base has failed. Expect some breakage on lifting and some colour difference where the exposed surface has weathered differently. Budget for a percentage of replacements from the same range if it is still made.',
      'claves': 'reuse existing pavers lift relay salvage breakage colour match',
    },
    'obra-pergola-sobre-deck': {
      'pregunta': 'Can a pergola sit on top of a deck?',
      'respuesta':
        'Yes, but the posts have to carry through the deck to their own footings in the ground — they cannot land on the deck framing, which was never designed for uplift. That means planning the post locations before the deck boards go down, or cutting them later.',
      'claves': 'pergola on deck posts through footing framing uplift',
    },
    'obra-riego-jardin': {
      'pregunta': 'What happens to my irrigation and landscape lighting?',
      'respuesta':
        'Both get cut during excavation if nobody locates them first, and both are cheap to reroute before the work and expensive to chase afterwards. We mark and cap what is in the way, and reconnect or re-route as part of the scope rather than leaving you with dead zones.',
      'claves': 'irrigation sprinkler landscape lighting cut reroute repair damage',
    },
    'obra-cesped-reparar': {
      'pregunta': 'Will the lawn be wrecked by machinery?',
      'respuesta':
        'Access routes take a beating, and it is honest to expect that rather than to promise otherwise. We protect what we can with boards and keep traffic to one path. Restoring the affected strip with fresh sod is normally quoted as its own line so you can decide.',
      'claves': 'lawn grass damage machinery access sod repair restore protection',
    },
    'obra-entrada-ancho': {
      'pregunta': 'How wide should a driveway be?',
      'respuesta':
        'Wide enough to open a car door without stepping into planting, which is more than people draw. A single lane wants room to walk alongside; a double needs enough width that two cars can both be used at once. The turning area matters more than the straight run.',
      'claves': 'driveway width single double car door turning apron size',
    },
    'obra-entrada-acera': {
      'pregunta': 'Can I change where the driveway meets the road?',
      'respuesta':
        'That connection sits in the public right of way, so it needs approval from the municipality or the county — sometimes a separate right-of-way permit — and there are rules on width, sight lines and how the apron meets the sidewalk. It is doable, it just is not a private decision.',
      'claves': 'driveway apron street right of way curb cut sidewalk permit',
    },
    'obra-suelo-arena-florida': {
      'pregunta': 'Does Florida\'s sandy soil cause problems for footings?',
      'respuesta':
        'Sand is actually a decent bearing material when it is confined and compacted; the problems are organic material, fill of unknown origin and a high water table. That is why footing depth comes from the engineer for your site rather than from a standard detail.',
      'claves': 'sandy soil Florida footing bearing water table fill muck',
    },
    'obra-licencia-contratista': {
      'pregunta': 'How do I check a contractor is actually licensed and insured?',
      'respuesta':
        'Licences are public: Florida\'s DBPR database and the county\'s local registration both let you search by name. Ask for a certificate of insurance sent directly by the insurer rather than a copy, and confirm workers\' compensation as well as liability. Do this before any deposit.',
      'claves': 'licensed insured verify DBPR license check insurance workers comp',
    },
    'obra-lien-garantia': {
      'pregunta': 'What is a construction lien and should I worry about it?',
      'respuesta':
        'Under Florida\'s Construction Lien Law, subcontractors and suppliers who are not paid can place a lien on your property even if you paid the contractor. Protect yourself by asking for lien releases from subs and suppliers as payments are made. Any legitimate contractor expects that request.',
      'claves': 'lien construction law release waiver subcontractor supplier unpaid',
    },
    'obra-contrato-que-mirar': {
      'pregunta': 'What should the contract actually spell out?',
      'respuesta':
        'Scope with exclusions listed, the payment schedule tied to milestones, who pulls the permit, what the warranty covers and for how long, how change orders are priced and approved, and what happens on weather delays. If any of those is a conversation rather than a clause, get it written down.',
      'claves': 'contract terms scope exclusions payment change order warranty',
    },
  },
  es: {
    'permiso-sur-florida': {
      'pregunta': '¿Hace falta permiso para instalar una pérgola en el sur de Florida?',
      'respuesta':
        'Sí. En Palm Beach, Broward y Miami-Dade la pérgola normalmente lleva permiso, sobre todo si va anclada a la casa o si el techo es motorizado. Suelen pedir cálculo estructural, memoria de cargas de viento y plano de situación. En Miami-Dade puede hacer falta además la aprobación del producto o la NOA. Con un contratista con licencia, la obra cumple la normativa local y pasa las inspecciones.',
    },
    'huracan-homologacion': {
      'pregunta': '¿Están las pérgolas de aluminio homologadas para huracanes?',
      'respuesta':
        'Una pérgola de aluminio de calidad se puede calcular para cumplir las cargas de viento del sur de Florida. Bien diseñada y bien instalada, aguanta vientos fuertes. Los techos de lamas motorizados también pueden calcularse para cumplir, según la ingeniería y los anclajes. En la costa, la solidez estructural es lo que manda.',
    },
    'precio-pergola-aluminio': {
      'pregunta':
        '¿Cuánto cuesta una pérgola de aluminio a medida en Palm Beach, Broward o Miami-Dade?',
      'respuesta':
        'En el sur de Florida, una pérgola de aluminio a medida suele partir de una cifra media de cinco dígitos, según el tamaño, la motorización, los extras y lo que pida el cálculo. Los sistemas de lamas motorizados son la opción más cara por la ingeniería, la automatización y la parte eléctrica. Cada proyecto se diseña a medida, así que el precio recoge materiales, permisos y dificultad de montaje.',
    },
    'pergola-vs-lamas': {
      'pregunta': '¿En qué se diferencia una pérgola normal de un techo de lamas motorizado?',
      'respuesta':
        'Una pérgola normal da una sombra fija, con listones o vigas. Un techo de lamas motorizado lleva lamas que se abren y se cierran con un motor, así que puede tener sol pleno, media sombra o protección total frente a la lluvia. Las lamas dan mucha más versatilidad y control del ambiente, y por eso encajan en exteriores de gama alta.',
    },
    'plazo-diseno-montaje': {
      'pregunta': '¿Cuánto se tarda desde el diseño hasta terminar la instalación?',
      'respuesta':
        'El proceso completo pasa por la consulta, el desarrollo del diseño, el cálculo, los permisos, la fabricación y el montaje. En el sur de Florida los plazos de permiso cambian según el municipio, pero la mayoría de proyectos tarda varias semanas desde la aprobación. El montaje en sí suele resolverse en pocos días cuando el material ya está.',
    },
    'revalorizacion-vivienda': {
      'pregunta': '¿Una pérgola revaloriza la casa?',
      'respuesta':
        'Sí. Bien diseñada y bien instalada, una pérgola de aluminio a medida mejora la fachada, el uso del espacio y la vida al aire libre. En mercados altos como Palm Beach o las propiedades frente al agua de Broward y Miami, una estructura bien integrada sube el valor percibido y el de reventa, porque amplía el espacio que se puede usar.',
    },
    'integraciones-luz-ventilador': {
      'pregunta': '¿Se puede integrar con iluminación, ventiladores, cortinas o cocina exterior?',
      'respuesta':
        'Sí. Una pérgola actual admite iluminación LED, ventiladores de techo, cortinas retráctiles, calefactores, drenaje e incluso control domótico. Si se planifica en la fase de diseño, todo queda integrado y el exterior funciona de verdad.',
    },
    'aluminio-vs-madera': {
      'pregunta': '¿Es mejor el aluminio que la madera en el clima del sur de Florida?',
      'respuesta':
        'En ambiente húmedo y costero, el aluminio gana con claridad en durabilidad y en mantenimiento. La madera hay que sellarla y teñirla cada cierto tiempo, y se pudre, se comba y le entran termitas. El aluminio con recubrimiento en polvo no se corroe, aguanta y casi no da trabajo.',
    },
    'hoa-urbanizacion': {
      'pregunta': '¿Hace falta la aprobación de la comunidad en una urbanización cerrada?',
      'respuesta':
        'Sí. Casi todas las urbanizaciones cerradas y comunidades piden la aprobación de su comité antes de empezar. Los requisitos cambian según la comunidad: revisión del diseño, elección del color, límites de altura y dónde se puede colocar. Un contratista profesional aporta planos y documentación para que la aprobación salga rápido.',
    },
    'lamas-lluvia-drenaje': {
      'pregunta': '¿Cómo se comporta un techo de lamas con lluvia fuerte?',
      'respuesta':
        'Los sistemas de lamas de gama alta llevan canalón integrado que conduce el agua por dentro de los pilares. Al cerrarse, las lamas forman un sellado estanco que aparta la lluvia de la zona de estar, así que el espacio se sigue usando aunque llueva.',
    },
    'cabanas-permanente': {
      'pregunta': '¿Las cabañas de aluminio son permanentes?',
      'respuesta':
        'Sí. Son estructuras permanentes, calculadas para Miami. Nosotros gestionamos todos los permisos para que el resultado sea un espacio de lujo y resistente a huracanes.',
    },
    'cabanas-cortinas': {
      'pregunta': '¿Puedo añadir cortinas motorizadas?',
      'respuesta':
        'Por supuesto. Con cortinas motorizadas retráctiles y paneles de privacidad tiene sombra al momento, control del tiempo y mucho más confort.',
    },
    'cabanas-huracan': {
      'pregunta': '¿Resisten un huracán?',
      'respuesta':
        'Sí. Cada cabaña se calcula para cumplir las estrictas cargas de viento de la costa, de modo que aguante una tormenta seria.',
    },
    'cabanas-mantenimiento': {
      'pregunta': '¿Qué mantenimiento necesitan?',
      'respuesta':
        'Muy poco. El aluminio extruido con recubrimiento en polvo resiste el óxido y la corrosión, así que es la solución de bajo mantenimiento para un clima húmedo y costero.',
    },
    'cabanas-luz-ventilador': {
      'pregunta': '¿Puedo poner luces LED y ventiladores?',
      'respuesta':
        'Sí. La estructura integra sin problema iluminación LED, ventiladores de techo y equipos de audio y vídeo, para que el jardín funcione también de noche.',
    },
    'carports-uv': {
      'pregunta': '¿Frenan los rayos UV?',
      'respuesta':
        'Sí. Frenan los rayos UV y el calor fuerte del sur de Florida, así que la pintura y el interior del coche no se estropean con el sol.',
    },
    'carports-viento': {
      'pregunta': '¿Aguantan viento fuerte?',
      'respuesta':
        'Cada cochera se calcula para superar las cargas de viento que exige Florida, con la protección que hace falta frente a un huracán.',
    },
    'carports-diseno': {
      'pregunta': '¿Puede ir a juego con mi casa?',
      'respuesta':
        'Sí. Las hacemos a medida y con recubrimiento en polvo, para que acompañen al exterior de su casa, a la cubierta y a la fachada.',
    },
    'carports-oxido': {
      'pregunta': '¿Se oxida el aluminio?',
      'respuesta':
        'No. El aluminio con recubrimiento en polvo no se oxida, no se corroe y no pierde color: es una estructura duradera y sin mantenimiento, también en la costa.',
    },
    'carports-permiso': {
      'pregunta': '¿Hace falta permiso de obra?',
      'respuesta':
        'Sí, una cochera permanente lleva permiso. Nos ocupamos del cálculo y de toda la tramitación para que la instalación sea legal y sin complicaciones.',
    },
    'louvered-funcionamiento': {
      'pregunta': '¿Cómo funciona una pérgola de lamas?',
      'respuesta':
        'Llevan lamas de aluminio orientables en el techo, que se manejan con mando o desde el móvil. Así ajusta al momento la sombra, la luz y la ventilación del patio.',
    },
    'louvered-huracan': {
      'pregunta': '¿Son seguras en un huracán?',
      'respuesta':
        'Sí. Nuestros techos de lamas se calculan para la normativa de carga de viento de Miami, con la resistencia estructural que exige una tormenta seria.',
    },
    'louvered-sensor-lluvia': {
      'pregunta': '¿Llevan sensor de lluvia?',
      'respuesta':
        'Sí. Con sensores meteorológicos, el techo se cierra solo a la primera gota, protegiendo los muebles y el patio durante todo el año.',
    },
    'louvered-salitre': {
      'pregunta': '¿El salitre la va a oxidar?',
      'respuesta':
        'No. Usamos aluminio extruido con recubrimiento en polvo de grado marino, así que la pérgola no se oxida ni pierde aspecto ni en primera línea de playa.',
    },
    'louvered-plazo': {
      'pregunta': '¿Cuánto se tarda en instalarla?',
      'respuesta':
        'Una vez fabricada a medida y con el permiso concedido, nuestro equipo la monta en unos pocos días y con las mínimas molestias.',
    },
    'screens-control': {
      'pregunta': '¿Cómo se manejan?',
      'respuesta':
        'Con mando, con un pulsador de pared o desde la app de su sistema domótico. Control del ambiente exterior al momento.',
    },
    'screens-viento': {
      'pregunta': '¿Aguantan viento fuerte?',
      'respuesta':
        'Sí. Las guías de retención lateral mantienen la cortina sujeta en su sitio, con muy buena estabilidad durante las tormentas de Florida.',
    },
    'screens-calor': {
      'pregunta': '¿Bajan la temperatura del patio?',
      'respuesta':
        'Sí. Los tejidos solares bloquean hasta el 95% de los rayos UV, así que baja mucho la temperatura y el deslumbramiento, sin cortar la ventilación.',
    },
    'screens-ocultas': {
      'pregunta': '¿Se ven cuando están recogidas?',
      'respuesta':
        'No. Al recogerse se enrollan dentro de una carcasa de aluminio discreta, y las líneas del exterior quedan igual de limpias.',
    },
    'screens-anadir-pergola': {
      'pregunta': '¿Se pueden poner en mi pérgola actual?',
      'respuesta':
        'Sí. Medimos a medida e instalamos cortinas motorizadas en pérgolas, porches y patios cubiertos que ya existen.',
    },
    'open-air-por-que': {
      'pregunta': '¿Por qué elegir una pérgola abierta?',
      'respuesta':
        'Definen la zona de estar exterior con unas líneas que se ven, y a la vez dejan el cielo despejado y la brisa corriendo.',
    },
    'open-air-material': {
      'pregunta': '¿Son de madera o de metal?',
      'respuesta':
        'Solo usamos aluminio extruido de alta calidad. A diferencia de la madera, no se pudre, no se alabea y no hay que barnizarlo.',
    },
    'open-air-iluminacion': {
      'pregunta': '¿Puedo añadir iluminación LED?',
      'respuesta':
        'Sí. Las vigas esconden el cableado, así que la iluminación LED queda integrada y el patio se puede usar también de noche.',
    },
    'open-air-revalorizacion': {
      'pregunta': '¿Revalorizan la casa?',
      'respuesta':
        'Sí. Una pérgola de aluminio permanente y bien hecha mejora la imagen de la casa, amplía el espacio útil y suele rendir bien como inversión.',
    },
    'open-air-normativa': {
      'pregunta': '¿Cumplen la normativa de Florida?',
      'respuesta':
        'Sí. Cada pérgola se calcula, se tramita y se instala para cumplir las exigentes cargas de viento por huracán del sur de Florida.',
    },
    'polycarbonate-uv': {
      'pregunta': '¿El policarbonato frena los UV?',
      'respuesta':
        'Sí. Los paneles llevan tratamiento UV y frenan el 99% de los rayos dañinos, protegiendo la piel y los muebles sin dejar el espacio a oscuras.',
    },
    'polycarbonate-amarilleo': {
      'pregunta': '¿Se ponen amarillos con el tiempo?',
      'respuesta':
        'No. Usamos policarbonato de calidad arquitectónica con estabilizadores UV, formulado para no amarillear ni volverse opaco con el sol de Florida.',
    },
    'polycarbonate-tormentas': {
      'pregunta': '¿Aguantan una tormenta fuerte?',
      'respuesta':
        'Sí. Sobre estructura de aluminio robusta, estos paneles resistentes a impactos se calculan para superar las cargas de viento que exige la normativa local.',
    },
    'polycarbonate-lluvia': {
      'pregunta': '¿Dejan el patio seco?',
      'respuesta':
        'Sí. El techo es estanco y lleva drenaje integrado, así que la zona de estar se queda seca aunque caiga una tromba de verano.',
    },
    'polycarbonate-tintes': {
      'pregunta': '¿El tinte del panel se elige?',
      'respuesta':
        'Sí. Adaptamos cada pérgola a su casa: color de estructura y nivel de tinte del panel a elegir según la estética y la sombra que necesite.',
    },
    'enclosures-brisa': {
      'pregunta': '¿Un cerramiento corta la brisa?',
      'respuesta':
        'No. La malla de alta visibilidad frena insectos y suciedad, pero deja pasar el aire, que es justo lo que refresca el patio.',
    },
    'enclosures-normativa': {
      'pregunta': '¿Cumplen la normativa antihuracán?',
      'respuesta':
        'Sí. Cada cerramiento se construye con criterios estrictos de cálculo estructural para aguantar vientos de huracán y el clima costero.',
    },
    'enclosures-mosquitera': {
      'pregunta': '¿La malla se descuelga con el tiempo?',
      'respuesta':
        'No. Instalamos mallas de alta tensión, muy resistentes y aptas para mascotas, con un tensado preciso que evita que se descuelguen o se rasguen.',
    },
    'enclosures-permiso': {
      'pregunta': '¿Hace falta permiso de obra?',
      'respuesta':
        'Sí, hace falta permiso municipal. Nos ocupamos del levantamiento, el cálculo y toda la tramitación para que la instalación sea legal y sin complicaciones.',
    },
    'enclosures-piscina': {
      'pregunta': '¿Podéis adaptaros a mi piscina, que es complicada?',
      'respuesta':
        'Sí. Fabricamos cada estructura a medida para que encaje con la arquitectura de su casa, con decks a varios niveles y con piscinas de forma libre.',
    },
    'solar-paneles': {
      'pregunta': '¿Una pérgola puede llevar paneles solares?',
      'respuesta':
        'Sí. Nuestras pérgolas solares dan un patio con sombra y a la vez sostienen un campo entero de paneles para generar energía limpia.',
    },
    'solar-estructura': {
      'pregunta': '¿La estructura aguanta?',
      'respuesta':
        'Sí. Estas estructuras se calculan con vigas de aluminio reforzadas para soportar el peso de los paneles y la succión del viento.',
    },
    'solar-estanqueidad': {
      'pregunta': '¿La zona de estar queda seca?',
      'respuesta':
        'Sí. La subcubierta y el drenaje oculto frenan la lluvia, así que debajo de la pérgola no se moja nada.',
    },
    'solar-orientacion': {
      'pregunta': '¿La orientáis para captar más sol?',
      'respuesta':
        'Sí. En el diseño ajustamos altura, inclinación y sitio para captar el máximo de sol hacia el sur.',
    },
    'solar-permisos': {
      'pregunta': '¿Os encargáis de los permisos?',
      'respuesta':
        'Sí. Una pérgola solar lleva permiso de estructura y de electricidad. Nos ocupamos de toda la documentación para que el proyecto cumpla y avance sin trabas.',
    },
    'solid-roof-calor': {
      'pregunta': '¿El techo sólido corta el calor?',
      'respuesta':
        'Sí. Usan paneles aislantes de alta densidad que bloquean el 100% del calor radiante, así que el exterior se mantiene fresco y cómodo.',
    },
    'solid-roof-estanqueidad': {
      'pregunta': '¿Son totalmente estancas?',
      'respuesta':
        'Sí. Los paneles de aluminio aislado encajan entre sí formando un techo sellado y estanco con canalón integrado, con protección total frente a la lluvia — también para una cocina exterior.',
    },
    'solid-roof-ventilador-tv': {
      'pregunta': '¿Puedo poner un ventilador o una tele?',
      'respuesta':
        'Sí. El techo lleva canaletas internas para esconder el cableado, así que ventiladores, luz LED y equipos de audio y vídeo quedan instalados de forma limpia.',
    },
    'solid-roof-mantenimiento': {
      'pregunta': '¿Qué mantenimiento necesita?',
      'respuesta':
        'Prácticamente ninguno. Al ser de aluminio con recubrimiento en polvo, no se oxidan, no se pudren y no pierden color. Con enjuagarlas de vez en cuando basta.',
    },
    'solid-roof-permiso-broward': {
      'pregunta': '¿Necesitan permiso en Broward?',
      'respuesta':
        'Sí. Al ser estructuras permanentes que soportan carga, requieren permiso. Nosotros aportamos el cálculo estructural completo y gestionamos la aprobación.',
    },
    'sukkha-diferencia': {
      'pregunta': '¿Qué tiene de distinto el Sukkha 3000?',
      'respuesta':
        'Es lo más alto en arquitectura exterior de lujo: ingeniería modular propia y diseño minimalista, pensados para propiedades de alto nivel.',
    },
    'sukkha-personalizacion': {
      'pregunta': '¿Se puede personalizar?',
      'respuesta':
        'Sí, por completo: dimensiones a medida, acabados de calidad y frentes específicos para que encaje con su propiedad.',
    },
    'sukkha-huracan': {
      'pregunta': '¿Aguanta un huracán?',
      'respuesta':
        'Sí. En aluminio de grado marino muy reforzado, está calculado para superar la normativa de costa y aguantar tiempo extremo.',
    },
    'sukkha-domotica': {
      'pregunta': '¿Admite domótica?',
      'respuesta':
        'Sí. La estructura esconde los mecanismos de las cortinas motorizadas, los sensores de clima, las tiras LED y el equipo audiovisual.',
    },
    'sukkha-permanente': {
      'pregunta': '¿Es una estructura permanente?',
      'respuesta':
        'Sí. El Sukkha 3000 es una ampliación arquitectónica permanente y calculada, que aumenta mucho el valor de la vivienda.',
    },
    'concrete-armado': {
      'pregunta': '¿Por qué es importante el hormigón armado en un proyecto exterior?',
      'respuesta':
        'El hormigón armado es lo que sostiene pérgolas, decks, patios y entradas de coche. Un buen armado y una buena nivelación evitan grietas y asentamientos en los suelos del sur de Florida.',
    },
    'concrete-fraguado': {
      'pregunta': '¿Cuánto tarda el hormigón en curar del todo?',
      'respuesta':
        'El hormigón coge resistencia inicial en días, pero sigue curando durante varias semanas. Curarlo bien es lo que le da durabilidad y aguante frente al clima.',
    },
    'concrete-permiso': {
      'pregunta': '¿Hace falta permiso para un trabajo de hormigón estructural?',
      'respuesta':
        'Muchos trabajos de hormigón estructural requieren permiso en Palm Beach y Broward. Nosotros gestionamos la documentación, las inspecciones y el cumplimiento normativo.',
    },
    'concrete-soporte': {
      'pregunta': '¿Una losa de hormigón puede sostener una pérgola o un deck?',
      'respuesta':
        'Sí. Una losa calculada es la base que necesitan las pérgolas de aluminio, los decks de composite y las cocinas exteriores en las viviendas del sur de Florida.',
    },
    'concrete-durabilidad': {
      'pregunta': '¿Cuánto dura el hormigón estructural?',
      'respuesta':
        'Bien armado y bien ejecutado, el hormigón estructural en el sur de Florida dura décadas sosteniendo las estructuras de exterior.',
    },
    'decks-material': {
      'pregunta': '¿Qué material es mejor para un deck en Florida?',
      'respuesta':
        'El composite y el aluminio son lo ideal en el sur de Florida porque resisten la humedad, los rayos UV y no se alabean. Rinden mucho más que la madera en un clima costero y húmedo.',
    },
    'decks-permiso': {
      'pregunta': '¿Hace falta permiso para un deck a medida?',
      'respuesta':
        'Sí. Casi todos los decks elevados requieren permiso. Nos ocupamos del cálculo, las inspecciones y el cumplimiento normativo en Palm Beach y Broward.',
    },
    'decks-durabilidad': {
      'pregunta': '¿Cuánto dura un deck de composite?',
      'respuesta':
        'Un deck de composite en el sur de Florida puede durar 25 años o más con muy poco mantenimiento, así que es una inversión que sale a cuenta.',
    },
    'decks-pergola': {
      'pregunta': '¿Se puede integrar un deck con una pérgola?',
      'respuesta':
        'Sí. Diseñamos decks de composite y aluminio que se integran con pérgolas, patios adoquinados y zonas de piscina para que el exterior sea un conjunto.',
    },
    'decks-revalorizacion': {
      'pregunta': '¿Instalar un deck revaloriza la casa?',
      'respuesta':
        'Un deck bien instalado hace el exterior más útil y mejora la imagen de la casa. En el sur de Florida suele influir de forma positiva en el valor de reventa.',
    },
    'driveways-material': {
      'pregunta': '¿Qué material es mejor para una entrada de coche en el sur de Florida?',
      'respuesta':
        'El adoquín de hormigón es lo ideal por cómo soporta el peso y por su flexibilidad. Una entrada adoquinada y reforzada resiste mejor las grietas que una losa de hormigón cuando llueve fuerte y aprieta el sol.',
    },
    'driveways-permiso': {
      'pregunta': '¿Hace falta permiso para hacer una entrada de coche?',
      'respuesta':
        'Depende del municipio. Nosotros gestionamos permisos, inspecciones y cumplimiento en Palm Beach y Broward para que su entrada cumpla la normativa local.',
    },
    'driveways-durabilidad': {
      'pregunta': '¿Cuánto dura una entrada adoquinada?',
      'respuesta':
        'Una entrada adoquinada bien instalada en el sur de Florida puede durar décadas si va sobre una base reforzada. La compactación y el drenaje son lo que marca la diferencia.',
    },
    'driveways-sustitucion': {
      'pregunta': '¿Se puede sustituir una entrada de hormigón vieja?',
      'respuesta':
        'Sí. Retiramos el hormigón dañado e instalamos una entrada de adoquín a medida o de hormigón reforzado, calculada para durar más y mejorar la fachada.',
    },
    'driveways-revalorizacion': {
      'pregunta': '¿Una entrada nueva revaloriza la casa?',
      'respuesta':
        'Una buena entrada mejora la primera impresión y la coherencia del conjunto. Bien instalada, suele mejorar el valor de reventa y lo fácil que resulta vender la casa.',
    },
    'fences-material': {
      'pregunta': '¿Qué material es mejor para vallar en el sur de Florida?',
      'respuesta':
        'El aluminio es lo ideal en el sur de Florida por su resistencia a la corrosión y al viento. Rinde mucho mejor que la madera en ambientes húmedos y costeros.',
    },
    'fences-permiso': {
      'pregunta': '¿Hace falta permiso para instalar un vallado?',
      'respuesta':
        'Depende del municipio y de las normas de la comunidad. Nosotros gestionamos el cumplimiento y nos aseguramos de que la instalación esté aprobada en Palm Beach y Broward.',
    },
    'fences-durabilidad': {
      'pregunta': '¿Cuánto dura un vallado de aluminio en Florida?',
      'respuesta':
        'Un vallado de aluminio con recubrimiento en polvo puede durar décadas en el sur de Florida con muy poco mantenimiento, incluso con mucha humedad y salitre.',
    },
    'fences-viento': {
      'pregunta': '¿El vallado de aluminio resiste el viento?',
      'respuesta':
        'Sí. Un vallado de aluminio bien instalado lleva postes reforzados y anclajes calculados para las cargas de viento de Florida.',
    },
    'fences-revalorizacion': {
      'pregunta': '¿Vallar revaloriza la casa?',
      'respuesta':
        'Un buen vallado aporta privacidad, seguridad y mejor imagen, y eso suele traducirse en más valor en el mercado residencial del sur de Florida.',
    },
    'patio-permiso': {
      'pregunta': '¿Hace falta permiso para remodelar el exterior en el sur de Florida?',
      'respuesta':
        'Las remodelaciones que tocan estructura casi siempre requieren permiso, y una que toca adoquinado, hormigón y una estructura techada necesita varios a la vez. Nosotros gestionamos la documentación de cálculo y las inspecciones en Palm Beach y Broward.',
    },
    'patio-plazo': {
      'pregunta': '¿Cuánto se tarda en remodelar el exterior?',
      'respuesta':
        'Depende del alcance y de los materiales. La mayoría de remodelaciones exteriores en el sur de Florida llevan varias semanas, contando demolición, preparación e instalación, y llevar todos los gremios con un mismo calendario suele salir más rápido que contratarlos por separado.',
    },
    'patio-pergola': {
      'pregunta': '¿Se puede añadir una pérgola durante la remodelación?',
      'respuesta':
        'Sí, y es el momento más barato para hacerlo. Integrar pérgolas de aluminio, cortinas motorizadas y adoquinado de gama alta con el terreno ya abierto deja el exterior como un conjunto y evita pagar dos veces la misma obra de base.',
    },
    'patio-revalorizacion': {
      'pregunta': '¿Remodelar el exterior revaloriza la casa?',
      'respuesta':
        'Un exterior bien remodelado se usa más y mejora la imagen de la casa por todos sus lados, no solo por detrás. En el sur de Florida suele mejorar el valor de reventa.',
    },
    'patio-material': {
      'pregunta': '¿Qué materiales son mejores para remodelar el exterior?',
      'respuesta':
        'Adoquines de alto rendimiento, losas de hormigón armado y sistemas de sombra de aluminio son lo ideal para que una remodelación aguante el clima del sur de Florida.',
    },
    'pavers-durabilidad': {
      'pregunta': '¿Cuánto dura un adoquinado bien instalado en Florida?',
      'respuesta':
        'Un adoquinado bien instalado en el sur de Florida puede durar décadas si va sobre una base bien compactada y reforzada. En nuestro proceso lo primero es planificar el drenaje y asegurar la estabilidad, que es lo que evita que se mueva o se hunda.',
    },
    'pavers-vs-hormigon': {
      'pregunta': '¿Es mejor adoquinar un patio que hacerlo de hormigón?',
      'respuesta':
        'El adoquinado tiene más flexibilidad y resiste mejor las grietas que una losa de hormigón. En el clima del sur de Florida absorbe mejor la dilatación por calor y las lluvias fuertes, y además da muchas más opciones de diseño.',
    },
    'pavers-drenaje': {
      'pregunta': '¿Un patio adoquinado necesita drenaje?',
      'respuesta':
        'Sí. Las pendientes y el drenaje son críticos en el sur de Florida. Diseñamos la instalación para que no se encharque, para proteger la cimentación y para que aguante con los años.',
    },
    'pavers-plazo': {
      'pregunta': '¿Cuánto se tarda en adoquinar?',
      'respuesta':
        'Depende del tamaño y de cuánta base haya que preparar. La mayoría de proyectos residenciales en Palm Beach y Broward llevan varias semanas, contando excavación, compactación y acabado.',
    },
    'pavers-revalorizacion': {
      'pregunta': '¿Adoquinar revaloriza la propiedad?',
      'respuesta':
        'Un patio o una entrada adoquinados mejoran la fachada y hacen el exterior más útil. Un buen adoquinado en el sur de Florida suele influir de forma positiva en el valor de reventa.',
    },
    'pergola-build-permiso': {
      'pregunta': '¿Hace falta permiso para construir una pérgola en el sur de Florida?',
      'respuesta':
        'Sí. La mayoría de pérgolas a medida requieren permiso en Palm Beach y Broward. Nosotros nos ocupamos de los planos de cálculo, las cargas de viento, la solicitud de permisos y las inspecciones, para que todo cumpla la normativa.',
    },
    'pergola-build-material': {
      'pregunta': '¿Cuál es el mejor material para una pérgola en el clima de Florida?',
      'respuesta':
        'El aluminio y los techos de lamas motorizados son lo ideal en el sur de Florida: resisten la corrosión, aguantan la humedad y apenas necesitan mantenimiento. A diferencia de la madera, el aluminio soporta el salitre, las lluvias fuertes y el sol.',
    },
    'pergola-build-plazo': {
      'pregunta': '¿Cuánto se tarda en instalar una pérgola a medida?',
      'respuesta':
        'Depende de lo complejo que sea el diseño y de cuánto tarde el permiso. La mayoría de proyectos en Palm Beach y Broward llevan varias semanas, contando cálculo, fabricación, inspecciones e instalación.',
    },
    'pergola-build-lamas-inversion': {
      'pregunta': '¿Merecen la pena las pérgolas de lamas motorizadas?',
      'respuesta':
        'Las pérgolas de lamas motorizadas dan sombra regulable, protección frente a la lluvia y control de la ventilación. En el sur de Florida eso significa poder usar el exterior todo el año, más confort y más valor a largo plazo.',
    },
    'pergola-build-precio': {
      'pregunta': '¿Cuánto cuesta una pérgola a medida en el sur de Florida?',
      'respuesta':
        'El precio depende del tamaño, los materiales y lo que exija el cálculo. Una pérgola de aluminio de gama alta en el sur de Florida es una inversión estructural a largo plazo, pensada para durar, integrarse en la casa y mejorar el valor de reventa.',
    },
    'permiso-cuanto-tarda': {
      'pregunta': '¿Cuánto se tarda en conseguir el permiso de una pérgola en el sur de Florida?',
      'respuesta':
        'Depende del municipio. En la mayoría de jurisdicciones de Palm Beach, Broward y Miami-Dade el permiso residencial de una pérgola tarda varias semanas desde que se presenta, y más si el revisor devuelve comentarios. Las zonas costeras e históricas añaden revisiones. Nosotros presentamos el paquete de ingeniería completo desde el principio para que el expediente avance en vez de ir acumulando correcciones.',
      'claves': 'permiso plazo tramite licencia papeles ayuntamiento',
    },
    'permiso-quien-lo-tramita': {
      'pregunta': '¿El permiso lo tramitan ustedes o el propietario?',
      'respuesta':
        'Lo tramitamos nosotros. Como contratista con licencia sacamos el permiso a nuestro nombre, preparamos el plano de situación y el paquete estructural, coordinamos los planos sellados por el ingeniero y recibimos al inspector en cada visita. Usted solo firma la autorización del propietario.',
      'claves': 'quien tramita permiso contratista licencia papeleo',
    },
    'permiso-sin-permiso-riesgo': {
      'pregunta': '¿Qué pasa si se construye una pérgola sin permiso?',
      'respuesta': 'Una obra sin permiso da problemas de verdad: el departamento de code enforcement puede ordenar el desmontaje, hay que abrir lo construido para una inspección a posteriori, y el permiso abierto sale en la búsqueda de título y puede frenar una venta o una refinanciación. Además, el seguro puede rechazar un parte por viento sobre una estructura que nunca se inspeccionó.',
      'claves': 'sin permiso infraccion code enforcement multa venta titulo seguro',
    },
    'permiso-noa-que-es': {
      'pregunta': '¿Qué es una NOA y cuándo la necesita mi proyecto?',
      'respuesta':
        'La Notice of Acceptance es la homologación de producto de Miami-Dade: el documento que acredita que un sistema concreto superó los ensayos de impacto y carga de viento que exige la zona de vientos altos. Miami-Dade y Broward están en esa zona, así que los techos de lamas, las cortinas y los cerramientos suelen necesitar NOA o Florida Product Approval en el expediente del permiso.',
      'claves': 'NOA homologacion producto aprobacion certificacion',
    },
    'permiso-hvhz-que-es': {
      'pregunta': '¿Qué implica la zona de vientos altos (HVHZ) en mi obra?',
      'respuesta':
        'Miami-Dade y Broward son los dos únicos condados del estado dentro de la HVHZ, y allí el código de edificación de Florida aplica un capítulo más estricto: velocidades de viento de cálculo más altas, productos ensayados y anclajes más detallados. En la práctica significa más ingeniería y componentes homologados, no una pérgola con otro aspecto.',
      'claves': 'zona vientos altos huracan codigo velocidad viento',
    },
    'permiso-palm-beach': {
      'pregunta': '¿En qué se diferencia el permiso en el condado de Palm Beach?',
      'respuesta':
        'Palm Beach queda fuera de la HVHZ, así que las velocidades de viento de cálculo suelen ser menores que en Miami-Dade y la homologación de producto es menos rígida. Aun así, cada municipio tiene su propio departamento de edificación, y los pueblos de la costa y las urbanizaciones cerradas suelen añadir una revisión arquitectónica encima del permiso del condado.',
      'claves': 'Palm Beach condado permiso municipio costa',
    },
    'permiso-broward': {
      'pregunta': '¿Qué pide el condado de Broward para el permiso de una pérgola?',
      'respuesta':
        'Broward está dentro de la HVHZ, así que el expediente lleva planos estructurales sellados, cálculo de cargas de viento para la categoría de exposición de su dirección, plano de situación con los retranqueos y homologación de cada componente ensayado. Ciudades como Fort Lauderdale, Weston o Coral Springs hacen además su propia revisión.',
      'claves': 'Broward permiso requisitos planos sellados retranqueo',
    },
    'permiso-miami-dade': {
      'pregunta': '¿Qué exige Miami-Dade que no exijan los demás condados?',
      'respuesta': 'Miami-Dade aplica la lectura más estricta del capítulo de vientos altos. Los componentes ensayados necesitan documentación de nivel HVHZ en el expediente —NOA de Miami-Dade o Florida Product Approval emitida para uso en HVHZ— y allí son los más exigentes con que no falte nada. Las direcciones en primera línea de playa y en las islas de barrera entran en una categoría de exposición más alta, y eso condiciona los anclajes y la sección de los pilares.',
      'claves': 'Miami-Dade NOA homologacion exposicion costa',
    },
    'permiso-retranqueos': {
      'pregunta': '¿A qué distancia del lindero se puede construir una pérgola?',
      'respuesta':
        'Los retranqueos los fija el planeamiento local, no el código de edificación, y cambian entre municipios y entre zonas de un mismo municipio. En una construcción auxiliar, el retranqueo trasero y lateral suele medirse al borde exterior del techo, no al pilar. Comprobamos la calificación de su parcela antes de dibujar nada.',
      'claves': 'retranqueo lindero distancia parcela servidumbre planeamiento',
    },
    'permiso-electricidad': {
      'pregunta': '¿Poner luces o un motor necesita permiso eléctrico aparte?',
      'respuesta':
        'Sí. Las lamas motorizadas, los ventiladores, los calefactores y la iluminación integrada van con un permiso eléctrico independiente del estructural, y los tiene que ejecutar un electricista con licencia sobre un circuito exterior protegido con diferencial. Se tramita en paralelo, así que normalmente no alarga el plazo.',
      'claves': 'permiso electrico instalacion diferencial electricista motor',
    },
    'permiso-inspecciones': {
      'pregunta': '¿Qué inspecciones pasa una pérgola?',
      'respuesta':
        'Normalmente una inspección de cimentación o de anclaje a la losa antes de hormigonar, una estructural con el pórtico y los anclajes montados, una eléctrica en obra y otra final si hay corriente, y la inspección final de edificación que cierra el permiso. Las concertamos y las atendemos nosotros.',
      'claves': 'inspeccion cimentacion final cierre permiso inspector',
    },
    'permiso-cierre-expediente': {
      'pregunta': '¿Cómo sé que el permiso quedó realmente cerrado?',
      'respuesta':
        'Un permiso cerrado figura con la inspección final superada en el registro público del departamento de edificación, y en casi todos los municipios se puede consultar por dirección desde la web. Pídalo en la entrega. Un permiso abierto que dejó un contratista anterior es una de las sorpresas más habituales al vender.',
      'claves': 'permiso cerrado registro consulta abierto venta',
    },
    'permiso-hoa-plazo': {
      'pregunta': '¿Cuánto tarda la aprobación de la comunidad?',
      'respuesta':
        'Casi todos los comités de revisión arquitectónica se reúnen con un calendario fijo, a menudo mensual, así que la espera depende de dónde caiga su solicitud. Nosotros preparamos los planos, la carta de colores y las fichas de material en el formato que pide la comunidad, que es lo que suele evitar una segunda vuelta.',
      'claves': 'comunidad HOA comite aprobacion plazo urbanizacion',
    },
    'permiso-hoa-rechazo': {
      'pregunta': '¿Y si la comunidad rechaza el diseño?',
      'respuesta': 'Los rechazos casi siempre van por un detalle concreto —el color, la altura, lo que se ve desde la calle—, no por la estructura. Se corrige ese punto y se vuelve a presentar. Como la revisión de la comunidad va antes de pedir el permiso de obra, la mayoría de correcciones en esa fase cuestan tiempo y no dinero; la excepción es una que cambie la estructura lo bastante como para rehacer el cálculo, y eso se le dice antes de hacerlo.',
      'claves': 'comunidad rechaza denegado corregir color altura',
    },
    'permiso-carga-viento': {
      'pregunta': '¿Para qué velocidad de viento se calcula una pérgola?',
      'respuesta': 'La velocidad de cálculo sale del mapa del código de edificación de Florida para su dirección y su categoría de exposición, no de una cifra de folleto. Para una vivienda de categoría de riesgo II en Miami-Dade, Broward o Palm Beach, esa velocidad última de cálculo suele moverse entre 150 y 175 mph según la parcela. El ingeniero dimensiona pilares, zapatas y anclajes a partir de la cifra de su dirección.',
      'claves': 'velocidad viento mph carga calculo ingenieria exposicion',
    },
    'permiso-piscina-barrera': {
      'pregunta': '¿Un cerramiento con mosquitero vale como barrera de seguridad de la piscina?',
      'respuesta':
        'Puede valer. La ley de seguridad en piscinas de Florida admite un cerramiento que rodee por completo el vaso y cumpla los requisitos de barrera, incluidas puertas con cierre y pestillo automáticos a la altura exigida. Que el suyo cumpla depende de cómo encuentre el cerramiento con la casa y de las puertas de ese tramo.',
      'claves': 'piscina barrera seguridad cerramiento cierre pestillo',
    },
    'permiso-ampliar-existente': {
      'pregunta': '¿Pueden legalizar una ampliación sobre algo que construyó otro?',
      'respuesta':
        'Solo si lo existente tenía permiso y quedó cerrado. Si lo tenía, calculamos la ampliación para que enlace con ello. Si no lo tenía, normalmente hay que legalizar primero lo que hay: abrirlo para inspección y ponerlo al código vigente antes de que aprueben nada nuevo.',
      'claves': 'ampliacion existente legalizar posteriori permiso',
    },
    'permiso-anclaje-losa': {
      'pregunta': '¿Se puede anclar una pérgola a la losa del patio que ya existe?',
      'respuesta':
        'A veces. El ingeniero necesita el espesor de la losa, su armado y la distancia al borde para confirmar que aguanta el levantamiento y el vuelco. Muchas losas de patio antiguas se quedan cortas, y lo normal es abrir zapatas bajo cada pilar en vez de fiarlo a la losa.',
      'claves': 'anclaje losa existente zapata levantamiento espesor armado',
    },
    'permiso-alquiler-vacacional': {
      'pregunta': '¿Cambian las normas en un alquiler o en un local comercial?',
      'respuesta':
        'Sí. Los proyectos comerciales y en edificios de varias viviendas se revisan con otra clasificación de uso, muchas veces con requisitos de accesibilidad, y el alquiler de corta estancia puede llevar condiciones municipales añadidas. Lo delimitamos antes de diseñar para que los planos salgan bien a la primera.',
      'claves': 'comercial alquiler plurifamiliar uso accesibilidad',
    },
    'permiso-arbol': {
      'pregunta': '¿Hace falta permiso para quitar un árbol que estorba?',
      'respuesta':
        'Normalmente sí. Casi todos los municipios del sur de Florida protegen los árboles por encima de cierto diámetro de tronco y exigen permiso de tala o trasplante, a veces con una reposición. Conviene mirarlo pronto, porque un árbol protegido puede cambiar dónde va la estructura.',
      'claves': 'arbol tala permiso protegido trasplante jardin',
    },
    'permiso-servidumbre': {
      'pregunta': '¿Y si el mejor sitio cae sobre una servidumbre?',
      'respuesta':
        'Sobre una servidumbre no puede haber nada permanente: la compañía tiene derecho a levantarla y no está obligada a reponer lo que usted puso. El levantamiento topográfico enseña por dónde pasa, y el diseño se aparta o, en algún caso, la compañía concede por escrito una autorización de ocupación.',
      'claves': 'servidumbre levantamiento ocupacion retranqueo drenaje',
    },
    'permiso-topografico': {
      'pregunta': '¿Necesito un levantamiento topográfico de la parcela?',
      'respuesta':
        'Para cualquier cosa anclada al terreno, sí: el departamento de edificación pide un plano de situación dibujado sobre un levantamiento vigente, firmado y sellado, con la estructura, los retranqueos y las servidumbres. Si el suyo es reciente y refleja la parcela tal y como está, normalmente se puede reutilizar.',
      'claves': 'levantamiento topografico plano situacion lindero parcela',
    },
    'permiso-costa-corrosion-codigo': {
      'pregunta': '¿Hay requisitos añadidos cerca del mar?',
      'respuesta': 'Sí. Las direcciones próximas a la costa entran en una categoría de exposición al viento más alta, lo que sube las cargas de cálculo, y algunos municipios añaden exigencias de resistencia a la corrosión en tornillería y herrajes. Las parcelas en islas de barrera o pasada la línea de control costero pueden llevar además una revisión estatal.',
      'claves': 'costa mar exposicion corrosion tornilleria isla barrera',
    },
    'permiso-planos-sellados': {
      'pregunta': '¿Por qué los planos tienen que ir sellados por un ingeniero?',
      'respuesta': 'Porque el revisor está examinando una estructura que debe resistir viento de huracán, y Florida exige que un ingeniero con licencia asuma la responsabilidad profesional de ese cálculo. El sello es lo que convierte el recorrido de cargas —techo, viga, pilar, zapata, terreno— en un diseño exigible e inspeccionable.',
      'claves': 'planos sellados ingeniero con licencia calculo cargas',
    },
    'permiso-cocina-exterior': {
      'pregunta': '¿Una cocina exterior bajo la pérgola lleva permisos propios?',
      'respuesta':
        'Normalmente más de uno: eléctrico para los circuitos, fontanería si hay fregadero y gas si hay barbacoa con toma. Las distancias entre un foco de calor y un material combustible o un techo bajo se comprueban en la inspección, así que el reparto conviene resolverlo en el diseño y no en obra.',
      'claves': 'cocina exterior barbacoa gas fontaneria fregadero distancia',
    },
    'permiso-vecino': {
      'pregunta': '¿Mi vecino tiene que dar su conformidad?',
      'respuesta':
        'Por norma general, no. Los retranqueos del planeamiento ya fijan a qué distancia del lindero se puede construir, y cumplirlos es lo que cuenta legalmente. La conformidad del vecino solo entra en juego si el diseño invade su parcela o una servidumbre compartida, o si una norma de la comunidad exige avisar.',
      'claves': 'vecino conformidad lindero conflicto retranqueo aviso',
    },
    'permiso-seguro-vivienda': {
      'pregunta': '¿Una pérgola con permiso afecta al seguro del hogar?',
      'respuesta':
        'Avise a su compañía en cualquier caso. Una estructura con permiso y con cálculo es lo que el seguro espera encontrar y lo que hace defendible un parte por viento; una sin permiso puede quedar excluida. Algunas compañías además quieren que figure en la póliza para cubrirla y no tratarla como una mejora no declarada.',
      'claves': 'seguro hogar viento parte cobertura poliza compania',
    },
    'permiso-impuestos': {
      'pregunta': '¿Una obra con permiso sube el impuesto sobre la propiedad?',
      'respuesta': 'Puede subirlo. La oficina de tasación del condado (property appraiser) registra las mejoras con permiso y puede ajustar el valor tasado de la parcela. El efecto depende de la tasación de su condado y del tope anual que le aplique la exención de homestead, si la tiene, así que es una consulta para esa oficina y no para el contratista.',
      'claves': 'impuesto propiedad valor tasado tasacion homestead exencion',
    },
    'permiso-generador-solar': {
      'pregunta': '¿Qué aprobaciones añade una pérgola solar?',
      'respuesta':
        'Además del permiso estructural y el eléctrico, una instalación conectada a red necesita acuerdo de conexión con la compañía y, en muchos municipios, una revisión solar aparte. La estructura además hay que calcularla para el peso propio añadido y para el levantamiento sobre los propios paneles.',
      'claves': 'solar conexion red compania compensacion permiso',
    },
    'permiso-cambios-en-obra': {
      'pregunta': '¿Se puede cambiar el diseño con el permiso ya concedido?',
      'respuesta':
        'Los ajustes pequeños en obra son normales. Todo lo que mueva la estructura, cambie su tamaño o altere el recorrido de cargas hay que presentarlo como modificación en el departamento de edificación antes de ejecutarlo, porque el inspector compara lo hecho con los planos aprobados. Las modificaciones son rutina, pero consumen plazo de revisión.',
      'claves': 'modificacion cambio planos aprobados obra inspector',
    },
    'precio-que-incluye': {
      'pregunta': '¿Qué incluye un presupuesto de Pergola Plus?',
      'respuesta':
        'Diseño, cálculo estructural con planos sellados, tramitación y tasas del permiso, fabricación, transporte, montaje y las inspecciones hasta cerrar el permiso. Lo que no entra —una losa, ampliar el cuadro eléctrico, reponer el jardín— va como partida propia en vez de aparecer luego.',
      'claves': 'incluye presupuesto alcance precio partidas excluido',
    },
    'precio-por-que-varia': {
      'pregunta': '¿Por qué dos pérgolas del mismo tamaño no cuestan lo mismo?',
      'respuesta':
        'La luz entre apoyos manda en la sección del material, así que una estructura con menos pilares cuesta más que la misma superficie con más. A eso se suma: adosada o exenta, motorizada o fija, la categoría de exposición de la dirección, si hay que abrir zapatas en un patio ya hecho, y el acabado.',
      'claves': 'precio varia luz pilares adosada motorizada acabado',
    },
    'precio-financiacion': {
      'pregunta': '¿Ofrecen financiación?',
      'respuesta':
        'Hay opciones de financiación para proyectos que cumplan los requisitos, y le explicamos las que estén vigentes cuando le pasemos el presupuesto. Las condiciones, el tipo y la aprobación los pone la entidad, no nosotros, así que la respuesta honesta es que depende del programa y de su perfil.',
      'claves': 'financiacion pago plazos prestamo mensual credito',
    },
    'precio-forma-de-pago': {
      'pregunta': '¿Cómo se estructura el pago?',
      'respuesta': 'Por hitos: una entrada para arrancar diseño e ingeniería, un pago cuando el material entra en fabricación y el resto al terminar. La ley de Florida no fija un tope a la entrada, pero sí impone obligaciones cuando es alta: el contratista que cobra por adelantado más del 10 % del precio del contrato tiene que solicitar los permisos en 30 días y empezar la obra en 90. El calendario de pagos queda escrito en el contrato antes de firmar nada.',
      'claves': 'pago calendario entrada hito resto contrato',
    },
    'precio-presupuesto-gratis': {
      'pregunta': '¿El presupuesto es gratis y qué pasa en la primera visita?',
      'respuesta':
        'La consulta y el presupuesto son gratis. Medimos el espacio, miramos la losa, el alero y de dónde puede salir la corriente, hablamos de cómo va a usar la zona de verdad, y le dejamos un alcance y una cifra, no una horquilla con la que no se puede planificar.',
      'claves': 'presupuesto gratis consulta visita medir cifra',
    },
    'precio-cuanto-cuesta-cabana': {
      'pregunta': '¿Cuánto cuesta una cabaña de aluminio a medida?',
      'respuesta':
        'Una cabaña se presupuesta como una construcción pequeña, no como un simple techo de sombra: lleva cubierta maciza, muchas veces paredes o mosquitero, y casi siempre corriente. Cuente con que salga por encima de una pérgola abierta de la misma superficie. Lo que más mueve la cifra es el tamaño, el tipo de cubierta y si lleva fontanería.',
      'claves': 'cabana precio coste caseta piscina superficie',
    },
    'precio-cuanto-cuesta-cerramiento': {
      'pregunta': '¿Cómo se presupuesta un cerramiento con mosquitero?',
      'respuesta':
        'Sobre todo por el volumen cerrado y por la luz de la cubierta, que son los que fijan la sección del aluminio. Una cúpula alta sobre una piscina grande cuesta bastante más que una mansarda baja sobre un patio de la misma superficie. También cuentan el tipo de malla, el número de puertas y si hay zuncho aprovechable.',
      'claves': 'cerramiento mosquitero precio piscina cupula mansarda',
    },
    'precio-motorizada-vs-fija': {
      'pregunta': '¿Cuánto más cuesta un techo de lamas motorizado que uno fijo?',
      'respuesta':
        'Un sistema de lamas motorizado es un salto de verdad, no una mejora pequeña: añade el mecanismo de lamas, los motores, el control, los sensores, el canalón integrado y un permiso eléctrico. Que compense depende de cuántas veces vaya a cambiar de verdad la posición del techo.',
      'claves': 'motorizada fija precio diferencia lamas coste',
    },
    'precio-mantenimiento-anual': {
      'pregunta': '¿Cuánto cuesta mantener una pérgola al año?',
      'respuesta':
        'Con aluminio lacado, casi nada: enjuagar y lavar con jabón suave un par de veces al año es toda la rutina. Los sistemas motorizados añaden una revisión periódica del mecanismo y los sensores. El gasto recurrente que se olvida no es la estructura, es la luz de la iluminación y los calefactores.',
      'claves': 'mantenimiento coste anual limpieza revision gasto',
    },
    'precio-garantia-cubre': {
      'pregunta': '¿Qué cubre exactamente la garantía?',
      'respuesta':
        'Dos cosas distintas, y conviene no mezclarlas: la garantía del fabricante sobre el sistema —estructura, acabado, motores, tejido— y nuestra garantía de ejecución sobre el montaje. Las condiciones cambian según la gama, así que la cobertura concreta de su sistema figura en el contrato.',
      'claves': 'garantia cobertura fabricante ejecucion acabado motor',
    },
    'precio-garantia-transferible': {
      'pregunta': '¿La garantía se transfiere si vendo la casa?',
      'respuesta':
        'Depende del fabricante y de la gama; algunas se transfieren al primer comprador posterior, a veces con un trámite de registro y un plazo para hacerlo. Si tiene la reventa en la cabeza, pregúntelo antes de elegir el sistema, no después.',
      'claves': 'garantia transferir vender casa comprador registro',
    },
    'precio-plazo-total': {
      'pregunta': '¿Cuál es el plazo real desde la firma hasta terminar?',
      'respuesta':
        'Diseño e ingeniería, luego permiso, luego fabricación y un montaje corto. El permiso es casi siempre la fase más larga y la menos previsible, y es la que no controla nadie. El montaje en sí suele resolverse en días una vez el material está en obra.',
      'claves': 'plazo calendario cuanto tarda inicio fin fabricacion',
    },
    'precio-obra-molestias': {
      'pregunta': '¿Cuántas molestias da el montaje?',
      'respuesta':
        'Menos que casi cualquier otra obra exterior. La parte ruidosa es abrir y hormigonar las zapatas, normalmente un día. A partir de ahí es montaje. Necesitamos acceso para el equipo y para una entrega, y la piscina o el patio quedan fuera de uso mientras se levanta la estructura, no durante todo el proyecto.',
      'claves': 'molestias ruido suciedad acceso equipo piscina obra',
    },
    'precio-lluvia-retrasos': {
      'pregunta': '¿Qué pasa con el calendario en época de lluvias?',
      'respuesta':
        'El hormigonado y el izado se paran con tormenta, así que los meses de verano acumulan más días perdidos por tiempo. Lo contamos en el calendario en vez de prometer una fecha que decide el cielo. Y si hay una tormenta con nombre en el parte, hay que asegurar el material suelto de la obra antes de que llegue.',
      'claves': 'lluvia temporada retraso tiempo verano tormenta huracan',
    },
    'precio-sobrecostes': {
      'pregunta': '¿Qué suele hacer que un proyecto se salga del presupuesto?',
      'respuesta':
        'Casi siempre algo que aparece bajo tierra o un cambio que pide usted. Instalaciones no señalizadas, una losa que resulta demasiado fina para anclar, o roca donde va la zapata son los casos habituales. Todo lo que aparece se valora y se aprueba por escrito como modificación antes de seguir.',
      'claves': 'sobrecoste extra modificacion imprevisto oculto',
    },
    'precio-comparar-presupuestos': {
      'pregunta': '¿Cómo comparo dos presupuestos muy distintos?',
      'respuesta':
        'Lea lo que cada uno excluye, no lo que incluye. Mire si la ingeniería, las tasas del permiso y las inspecciones van dentro de la cifra, qué espesor de pared y qué acabado lleva el aluminio, si la homologación de viento corresponde a su dirección, y a nombre de quién se saca el permiso.',
      'claves': 'comparar presupuestos ofertas barato exclusiones licencia',
    },
    'precio-barato-riesgo': {
      'pregunta': '¿Por qué el presupuesto más barato suele salir el más caro?',
      'respuesta':
        'Porque el ahorro sale casi siempre de algo estructural: perfil con menos pared, zapatas menos o más someras, sin ingeniería sellada, o directamente sin permiso. Esas decisiones no se ven el primer día y son decisivas en una tormenta — y una obra sin permiso reaparece cuando vende.',
      'claves': 'barato riesgo perfil fino sin permiso recortes',
    },
    'precio-deposito-cancelacion': {
      'pregunta': '¿Puedo cancelar después de firmar? ¿Qué pasa con la entrada?',
      'respuesta':
        'Florida reconoce al consumidor un derecho de desistimiento en ciertos contratos a domicilio dentro de un plazo corto tras la firma, y el resto lo regula su contrato. Una vez hecha la ingeniería y cortado el material a sus medidas, ese coste ya está incurrido y no se recupera.',
      'claves': 'cancelar entrada devolucion contrato desistimiento plazo',
    },
    'precio-precio-fijo': {
      'pregunta': '¿El precio del presupuesto es cerrado o se mueve con el material?',
      'respuesta':
        'Manda el precio del contrato. El aluminio es materia prima y por eso los presupuestos llevan plazo de validez: si firma dentro de él, la cifra se mantiene. Lo que cambia el precio después de firmar es un cambio de alcance, no un cambio de mercado.',
      'claves': 'precio cerrado fijo material aluminio validez',
    },
    'precio-retorno-inversion': {
      'pregunta': '¿Una estructura exterior se paga sola al vender?',
      'respuesta': 'Rara vez dólar por dólar, y quien prometa eso está adivinando. Lo que sí hace de forma fiable una estructura bien integrada y con permiso es añadir superficie utilizable y mejorar las fotos del anuncio, lo que afecta al tiempo en mercado tanto como al precio. Tómelo como espacio de vida que además disfruta ya.',
      'claves': 'rentabilidad reventa valor inversion tasacion anuncio',
    },
    'precio-fases': {
      'pregunta': '¿Se puede hacer por fases para repartir el gasto?',
      'respuesta':
        'Muchas veces sí, y la clave es decidir qué tiene que quedar bien a la primera. Estructura, zapatas y cualquier tubo de paso conviene dejarlos hechos, porque meterlos después obliga a abrir lo acabado. Las cortinas, la iluminación, los calefactores y la cocina sí pueden venir luego si la estructura se diseñó para ellos.',
      'claves': 'fases presupuesto etapas ampliar despues tubo',
    },
    'precio-tasas-permiso': {
      'pregunta': '¿Las tasas del permiso van en el presupuesto o aparte?',
      'respuesta':
        'Van en el presupuesto. Las tasas municipales se calculan normalmente sobre el valor declarado de la obra, así que no son idénticas entre dos municipios para la misma estructura, y las llevamos como partida y no como sorpresa al final.',
      'claves': 'tasas permiso coste municipal partida valor obra',
    },
    'precio-losa-aparte': {
      'pregunta': '¿La losa de hormigón entra en el precio de la pérgola?',
      'respuesta':
        'Por defecto no. Una pérgola necesita zapatas, y esas sí van incluidas; el suelo acabado de debajo —losa, adoquín, deck— es otra obra con su alcance y su precio. Presupuestamos las dos cuando las quiere juntas, pero siempre van como partidas separadas.',
      'claves': 'losa incluida hormigon suelo adoquin deck zapata',
    },
    'precio-visita-necesaria': {
      'pregunta': '¿Pueden presupuestar con fotos y medidas que yo mande?',
      'respuesta':
        'Así le damos una horquilla de trabajo, y sirve para orientarse al principio. No podemos comprometer un precio de contrato sin ver el sitio, porque lo que mueve la cifra —el estado de la losa, dónde está la corriente, el acceso para una entrega, el alero al que se ancla— no sale en las fotos.',
      'claves': 'presupuesto a distancia fotos medidas sin visita',
    },
    'precio-descuento-temporada': {
      'pregunta': '¿Hay una época del año más barata para construir?',
      'respuesta':
        'Los precios no se mueven por temporada; los plazos sí. La demanda sube antes de la temporada de invierno, así que contratar en los meses más flojos y más lluviosos suele comprarle un hueco antes, no un precio menor — que, con los plazos de permiso, muchas veces vale más.',
      'claves': 'temporada barato mejor epoca descuento hueco disponibilidad',
    },
    'precio-plazo-cerramiento': {
      'pregunta': '¿Cuánto se tarda en montar un cerramiento de piscina?',
      'respuesta':
        'Lo que marca el plazo es la fabricación: la estructura se corta a la geometría de su piscina, así que no hay nada de catálogo. Con el material en obra, levantar el pórtico y colocar la malla suele ser cuestión de días en un cerramiento residencial normal, y más en una cúpula grande con varias puertas.',
      'claves': 'cerramiento plazo cuanto tarda malla fabricacion',
    },
    'precio-reparar-vs-sustituir': {
      'pregunta': '¿Sale más barato remallar un cerramiento viejo o sustituirlo?',
      'respuesta':
        'Si la estructura de aluminio está sana y las zapatas intactas, remallar es mucho más barato y es lo correcto. Sustituir tiene sentido cuando el perfil está corroído por la base, la tornillería está fallando, o la estructura es anterior al código de viento que hoy se le exige a su dirección.',
      'claves': 'remallar sustituir reparar cerramiento viejo corroido coste',
    },
    'precio-adoquin-vs-hormigon-coste': {
      'pregunta': '¿El adoquín es más caro que el hormigón vertido?',
      'respuesta':
        'De entrada, normalmente sí. Con el tiempo la diferencia se estrecha: una losa de hormigón agrietada se repara sustituyendo un paño que no va a casar, mientras que un adoquín dañado se levanta y se cambia de uno en uno. Y si alguna vez hay que abrir para una tubería, el adoquín se repone sin que se note.',
      'claves': 'adoquin hormigon precio coste barato reparacion',
    },
    'precio-emergencia-tormenta': {
      'pregunta': '¿Atienden reparaciones después de una tormenta?',
      'respuesta':
        'Sí, en los sistemas que hemos instalado y, cuando podemos, en otros. Tras una tormenta con nombre la cola es larga en todo el sector, así que lo honesto es esperar triaje: primero seguridad y estanqueidad, después lo estético. Fotografíe los daños antes de tocar nada, para el parte del seguro.',
      'claves': 'tormenta daños reparacion huracan parte urgencia',
    },
    'precio-quien-instala': {
      'pregunta': '¿Subcontratan el montaje?',
      'respuesta':
        'El montaje estructural lo hace nuestro propio equipo. Los oficios que exigen licencia propia —electricidad, fontanería, gas— los ejecutan subcontratistas con licencia dentro del permiso, que es como lo exige el código. En cualquier caso usted tiene un único interlocutor.',
      'claves': 'subcontrata equipo propio instalador licencia oficios',
    },
    'material-aluminio-extruido': {
      'pregunta': '¿De qué aluminio están hechas las estructuras?',
      'respuesta':
        'Aluminio estructural extruido, no chapa conformada. La extrusión es lo que permite una pared gruesa y constante y cámaras interiores para el cableado y el drenaje. El espesor de pared es el dato que conviene preguntar al comparar presupuestos, porque es de donde se recorta coste sin que se vea.',
      'claves': 'aluminio extruido aleacion espesor pared estructural',
    },
    'material-lacado': {
      'pregunta': '¿Qué es el lacado en polvo y por qué importa aquí?',
      'respuesta': 'Es un acabado en seco que se hornea sobre el metal, y da una película más dura, más gruesa y más estable frente al UV que la pintura líquida. En clima de salitre el acabado hace de barrera contra la corrosión, así que su calidad no es una cuestión estética. Los recubrimientos de gama arquitectónica llevan garantía propia contra la pulverulencia y la pérdida de color.',
      'claves': 'lacado polvo acabado pintura UV decoloracion anodizado',
    },
    'material-colores': {
      'pregunta': '¿Entre qué colores y acabados puedo elegir?',
      'respuesta': 'La carta arquitectónica estándar cubre lo que pide casi cualquier vivienda —blancos y roturas de blanco, bronces, grises, negro— más los acabados imitación madera, que a unos pies de distancia pasan por madera sin comportarse como ella. Los colores a medida son posibles y añaden plazo.',
      'claves': 'colores acabados imitacion madera bronce blanco negro',
    },
    'material-color-oscuro-calor': {
      'pregunta': '¿Un color oscuro da más calor?',
      'respuesta':
        'El metal se calienta más al tacto, sí. Que la zona de debajo se note más caliente depende mucho más de si la cubierta es maciza, aislada o de lamas, y de cómo circule el aire. Una cubierta maciza aislada en color oscuro queda más fresca por debajo que una clara sin aislar.',
      'claves': 'color oscuro calor negro temperatura aislada',
    },
    'material-salitre-primera-linea': {
      'pregunta': '¿Cómo aguanta el aluminio en primera línea de mar?',
      'respuesta':
        'El aluminio no se oxida, pero el salitre sigue siendo agresivo: ataca por los puntos débiles, que son los cantos cortados, la tornillería y cualquier metal distinto en contacto. En primera línea toca herraje de grado marino y tornillería inoxidable, y conviene enjuagar con agua dulce con cierta frecuencia.',
      'claves': 'salitre mar corrosion inoxidable tornilleria grado marino',
    },
    'material-galvanica': {
      'pregunta': '¿Por qué no puedo poner cualquier tornillo en una reparación?',
      'respuesta':
        'Porque juntar el metal equivocado con el aluminio provoca corrosión galvánica: el aluminio hace de sacrificado y se va comiendo por el punto de contacto. Es un fallo lento e invisible que aparece años después como un tornillo flojo. Use lo que especifique el fabricante.',
      'claves': 'corrosion galvanica tornillo herraje metales distintos',
    },
    'material-limpieza': {
      'pregunta': '¿Cómo se limpia la estructura?',
      'respuesta':
        'Enjuague con manguera y lave con jabón suave y un paño blando. Nada de estropajos abrasivos, disolventes ni lejía: se llevan el acabado, y el acabado es la protección. Y no use hidrolimpiadora sobre el lacado ni dentro del mecanismo de las lamas.',
      'claves': 'limpiar lavar jabon hidrolimpiadora lejia disolvente',
    },
    'material-moho-verdin': {
      'pregunta': '¿Qué hago con el moho o el verdín en la estructura?',
      'respuesta':
        'Eso está en la superficie, no en el metal, y sale con jabón suave y agua. Reaparece antes donde coinciden sombra y humedad, así que despejar la vegetación que toca la estructura hace más que limpiar una y otra vez. Evite limpiadores con cloro cerca del tejido de las mosquiteras.',
      'claves': 'moho verdin algas manchas limpieza sombra humedad',
    },
    'material-madera-vs-aluminio-detalle': {
      'pregunta': '¿La madera de verdad no queda más cálida que el aluminio?',
      'respuesta':
        'Queda, el primer día. El intercambio en el sur de Florida es que la madera a la intemperie aquí hay que sellarla cada cierto tiempo y está expuesta a pudrición, alabeo y termitas, y una pérgola es lo más incómodo de mantener porque se trabaja por encima de la cabeza. El lacado imitación madera es como lo resuelve la mayoría.',
      'claves': 'madera aluminio aspecto calido pudricion termitas sellado',
    },
    'material-vinilo-pvc': {
      'pregunta': '¿Y las pérgolas de vinilo o PVC?',
      'respuesta':
        'El vinilo da poco mantenimiento y es más barato, pero no es un material estructural para las luces que se piden aquí, así que normalmente esconde un alma de metal o de madera, y con el sol continuo de Florida se reblandece y puede virar de color. Para algo que tiene que aguantar carga de viento, el material a discutir es el aluminio.',
      'claves': 'vinilo PVC plastico barato estructural sol color',
    },
    'material-policarbonato-vida': {
      'pregunta': '¿Cuánto duran los paneles de policarbonato?',
      'respuesta':
        'Los paneles de celdas de calidad llevan una capa UV coextrusionada y garantía de fabricante medida en años contra el amarilleo y la pérdida de transmisión de luz. Esa capa solo funciona hacia fuera, así que la orientación en el montaje importa tanto como el panel que compre.',
      'claves': 'policarbonato duracion amarilleo capa UV garantia panel',
    },
    'material-policarbonato-ruido': {
      'pregunta': '¿Un techo de policarbonato hace ruido con la lluvia?',
      'respuesta': 'Bastante más que una cubierta maciza aislada, sí: es un panel fino y la lluvia repica. Los paneles de celdas suenan menos que los de una sola capa, porque las cámaras de aire amortiguan el impacto. Si quiere poder conversar durante un aguacero, la respuesta honesta es cubierta aislada.',
      'claves': 'policarbonato lluvia ruido repique sonido aislada',
    },
    'material-techo-aislado': {
      'pregunta': '¿Qué lleva dentro un panel de cubierta maciza aislada?',
      'respuesta': 'Un núcleo aislante encolado entre dos chapas de aluminio, y eso es lo que hace el panel estructural y térmicamente útil a la vez. Salva la luz sin estructura vista por debajo, mantiene la cara de abajo más fresca que una cubierta de metal desnudo, y le deja un techo plano y limpio donde colgar un ventilador o una luz.',
      'claves': 'panel aislado nucleo sandwich techo ventilador luz',
    },
    'material-techo-aislado-lucernario': {
      'pregunta': '¿Se le puede poner un tragaluz a una cubierta maciza?',
      'respuesta':
        'Sí. Se pueden diseñar tragaluces estancos dentro del reparto de paneles, que suele ser la respuesta cuando una cubierta maciza dejaría más oscura una habitación o una ventana que antes tenían luz. Dónde van es una decisión de diseño que se toma con la estructura, no algo que se añade después, así que entra en la fase de planos.',
      'claves': 'tragaluz cubierta maciza luz natural reparto paneles',
    },
    'solid-roof-techo-visto': {
      'pregunta': '¿Cómo se ve el techo por debajo?',
      'respuesta':
        'Como un techo acabado y continuo, no como el reverso de una chapa. Los paneles llevan canales por dentro para el cableado, así que los ventiladores, los focos empotrados y los enchufes van montados en el propio techo en vez de por fuera, y la estructura queda oculta. El acabado puede ser liso, de la carta de recubrimiento en polvo, o con textura tipo madera.',
      'claves': 'techo acabado cableado ventilador focos textura madera',
    },
    'solid-roof-desague-oculto': {
      'pregunta': '¿Por dónde se va el agua de lluvia?',
      'respuesta':
        'Los paneles encajan entre sí y la cubierta desagua por un canalón integrado en la viga, así que no hay un canalón atornillado por fuera ni agua bajando por la cara de la estructura. Mantener ese canal limpio es casi todo el mantenimiento: un canalón atascado es el motivo habitual de que aparezca agua donde no toca.',
      'claves': 'desague canalon viga lluvia mantenimiento',
    },
    'material-mosquitera-tipos': {
      'pregunta': '¿Qué tipos de malla hay?',
      'respuesta':
        'Mosquitera estándar de fibra de vidrio, malla más tupida anti-jején para parcelas costeras y frente al agua, malla solar que corta calor y deslumbramiento a cambio de algo de vistas, y malla reforzada anti-mascotas para los paños bajos. Se pueden mezclar en el mismo cerramiento, paño a paño.',
      'claves': 'malla mosquitera tipos jejen solar mascotas fibra vidrio',
    },
    'material-mosquitera-duracion': {
      'pregunta': '¿Cada cuánto hay que cambiar la malla?',
      'respuesta':
        'Lo que la envejece es el sol, así que los paños sur y oeste caen primero y los de sombra les sacan años. Cuente con remallar las caras expuestas antes que el cerramiento entero. Los paños se cambian de uno en uno sin tocar la estructura, que es justo para lo que está el sistema de junquillo.',
      'claves': 'malla cambiar remallar duracion sol paño junquillo',
    },
    'material-lamas-mecanismo': {
      'pregunta': '¿Qué mantenimiento pide un techo de lamas motorizado?',
      'respuesta':
        'Mantener limpios los canalones y el drenaje de los pilares: un canal atascado es la causa más habitual de que aparezca agua donde no debe. Aparte de eso: enjuagar las lamas, comprobar que los sensores siguen respondiendo y revisar el mecanismo cada cierto tiempo. No meta hidrolimpiadora en el accionamiento.',
      'claves': 'lamas mantenimiento revision canalon drenaje sensor motor',
    },
    'material-lamas-sin-luz': {
      'pregunta': '¿Qué pasa con un techo motorizado si se va la luz?',
      'respuesta':
        'Las lamas se quedan en la última posición: no se abren solas. El sistema puede llevar accionamiento manual de emergencia o batería de respaldo para poder cerrarlas durante un corte, algo que conviene tener en una zona donde el corte y la tormenta llegan juntos.',
      'claves': 'corte luz apagon motorizado manual bateria respaldo',
    },
    'material-sensor-lluvia-falla': {
      'pregunta': '¿El sensor de lluvia puede cerrar el techo estando yo debajo?',
      'respuesta': 'Para eso está, y lo hará. Las lamas se mueven despacio y muchos sistemas ofrecen detección de obstáculos — conviene confirmarlo en el que elija, porque no lo llevan todos. Si prefiere decidir usted, puede desactivar la automatización y manejarlo a mano. Casi todo el mundo lo deja puesto precisamente porque funciona cuando no hay nadie en casa.',
      'claves': 'sensor lluvia cierre automatico seguridad obstaculo manual',
    },
    'material-domotica': {
      'pregunta': '¿Se integra con Alexa, Google Home o un sistema de control?',
      'respuesta':
        'La mayoría de sistemas motorizados sí, de forma nativa o con una pasarela, y un sistema de control instalado por profesionales puede mover el techo, las cortinas, la luz y los ventiladores desde una sola escena. Decídalo en el diseño: pasar el cableado de control después obliga a abrir lo acabado.',
      'claves': 'domotica Alexa Google automatizacion integracion escena',
    },
    'material-ventilador-peso': {
      'pregunta': '¿Puedo colgar un ventilador de techo o una tele de la estructura?',
      'respuesta':
        'Sí, si va previsto. Un ventilador necesita un punto de anclaje homologado y una viga capaz de asumir la carga dinámica, y una tele necesita soporte, recorrido de tubo y un sitio con sombra suficiente para que la pantalla aguante. Las dos cosas son fáciles en diseño e incómodas como ocurrencia posterior.',
      'claves': 'ventilador techo tele colgar peso soporte tubo viga',
    },
    'material-calefactor': {
      'pregunta': '¿Se pueden montar calefactores bajo el techo?',
      'respuesta':
        'Los calefactores eléctricos por infrarrojos son la opción habitual porque no necesitan toma de gas y tienen distancias a materiales combustibles fáciles de cumplir bajo una cubierta de aluminio. Consumen de verdad, así que el circuito hay que dimensionarlo en el diseño y no compartirlo con la iluminación.',
      'claves': 'calefactor infrarrojo electrico gas distancia circuito invierno',
    },
    'material-iluminacion': {
      'pregunta': '¿Qué iluminación funciona mejor en una estructura exterior?',
      'respuesta':
        'LED integrado en las vigas o en las propias lamas para la luz ambiente, más un circuito conmutado aparte para la luz de trabajo sobre una cocina o una mesa. Las luminarias tienen que ser de exterior y, cerca de la costa, con carcasa que no se corroa. La temperatura de color cálida sienta mejor fuera que la fría.',
      'claves': 'iluminacion LED integrada regulable exterior calida',
    },
    'material-drenaje-adonde': {
      'pregunta': '¿A dónde va realmente el agua del techo?',
      'respuesta':
        'A un canalón integrado y baja por dentro de los pilares, así que no hay bajante a la vista. Lo que importa es por dónde sale abajo: descargada contra la casa o sobre el patio se convierte en otro problema, así que la salida se conecta al drenaje o se dirige lejos de la losa.',
      'claves': 'drenaje canalon bajante pilar agua salida pendiente',
    },
    'material-cortinas-viento': {
      'pregunta': '¿Cuánto viento aguantan las cortinas motorizadas?',
      'respuesta':
        'Cada sistema tiene una velocidad de viento homologada por encima de la cual debe recogerse, y los mejores se recogen solos con un sensor de viento. Una cortina es un producto de confort y sombra, no una persiana de huracán: el dato a mirar es el del tejido y la guía concretos, no el de la marca.',
      'claves': 'cortina viento homologacion recoger sensor persiana huracan',
    },
    'material-cortinas-privacidad': {
      'pregunta': '¿Las cortinas dan intimidad de noche?',
      'respuesta':
        'Al revés, si tiene la luz encendida dentro. Las mallas funcionan por contraste: ocultan el lado más oscuro. De día usted ve fuera y desde fuera no le ven; al anochecer se invierte. Para intimidad de noche hace falta un tejido opaco o una malla solar densa, no mosquitera.',
      'claves': 'intimidad privacidad cortina noche opaco solar tejido',
    },
    'material-cristal-vs-mosquitera': {
      'pregunta': '¿Mejor cerrar con cristal que con mosquitera?',
      'respuesta':
        'El cristal convierte una estancia exterior en una climatizada, y eso cambia la clasificación del permiso, la estructura y bastante el coste. La mosquitera lo deja fuera: ventilación, sin carga de aire acondicionado, mucho más barato. Elija por si quiere que ese espacio sea interior o exterior, no por estética.',
      'claves': 'cristal cerramiento acristalado ventana climatizado galeria',
    },
    'material-suelo-bajo': {
      'pregunta': '¿Qué suelo funciona mejor bajo una pérgola?',
      'respuesta':
        'Cualquiera que drene y no achicharre los pies descalzos. Adoquín y porcelánico sobre una capa drenante son las respuestas habituales; los colores claros siguen siendo pisables a mediodía, la piedra oscura no. Si la estructura es de lamas, recuerde que el suelo se moja: elija algo con resistencia al deslizamiento.',
      'claves': 'suelo bajo pergola adoquin porcelanico travertino caliente deslizante',
    },
    'material-abejas-nidos': {
      'pregunta': '¿Se meten avispas o lagartijas dentro de los perfiles?',
      'respuesta':
        'Lo intentan. Los extremos de viga abiertos y las cámaras sin sellar son una invitación, y por eso los tapones de remate y los pasos sellados forman parte de un montaje bien hecho y no son un detalle. Si ya se ha metido algo, la solución es vaciarlo y cerrar el hueco, no insistir con el insecticida.',
      'claves': 'avispas nido lagartija insectos perfil hueco tapon sellado',
    },
    'material-repintar': {
      'pregunta': '¿Se puede repintar la estructura de otro color más adelante?',
      'respuesta':
        'Se puede repintar en obra, pero no será un lacado de fábrica ni durará como él. Si cree que el color puede cambiar con una reforma futura, un neutro es la apuesta segura. La pérdida de color en un acabado arquitectónico de calidad es tan lenta que la mayoría no repinta nunca.',
      'claves': 'repintar cambiar color pintar en obra decoloracion',
    },
    'material-reciclable': {
      'pregunta': '¿Una estructura de aluminio es una opción sostenible?',
      'respuesta':
        'El aluminio cuesta mucha energía de producir y luego es reciclable casi indefinidamente sin perder propiedades, así que el argumento está en la vida útil: una estructura que aguanta décadas y se recicla al final gana a una que se sustituye dos veces. Y no necesitar selladores y tintes cada pocos años también cuenta.',
      'claves': 'sostenible reciclable ecologico medio ambiente vida util',
    },
    'material-huracan-desmontar': {
      'pregunta': '¿Hay que desmontar algo antes de un huracán?',
      'respuesta':
        'La estructura se queda: para eso se calculó. Recoja las cortinas motorizadas y los toldos, deje las lamas como indique el fabricante para su sistema, y despeje la zona de muebles, macetas y de cualquier cosa que se convierta en proyectil. Limpie también los canalones.',
      'claves': 'huracan preparar tormenta recoger cortinas muebles asegurar',
    },
    'pergola-adosada-vs-exenta': {
      'pregunta': '¿Adosada o exenta? ¿Cuál elijo?',
      'respuesta':
        'La adosada prolonga la casa, no necesita pilares del lado del muro y suele integrarse mejor. La exenta va a cualquier sitio, no carga sobre su cubierta y es más fácil de tramitar en una casa antigua. Si su alero o su cercha no pueden con la carga, la exenta no es una cuestión de estilo: es la respuesta.',
      'claves': 'adosada exenta pared muro alero casa',
    },
    'pergola-tamano-tipico': {
      'pregunta': '¿Qué tamaño de pérgola necesito de verdad?',
      'respuesta': 'Empiece por los muebles. Una mesa de seis pide del orden de 12 por 16 pies para poder retirar las sillas; un tresillo de exterior pide más fondo que ancho. Y luego sume por el ángulo del sol: en esta latitud el sol bajo de la tarde se cuela mucho por debajo de un techo.',
      'claves': 'tamano medidas dimensiones pies muebles comedor salon',
    },
    'pergola-orientacion': {
      'pregunta': '¿Importa hacia dónde mira la pérgola?',
      'respuesta': 'Muchísimo. Un patio orientado al oeste se lleva el sol más duro del día y es el que más gana con lamas orientables o una cortina lateral; uno orientado al sur tiene sol más horas pero más alto, y eso lo lleva mejor una cubierta fija. La orientación debería decidir el tipo de techo, y no al revés.',
      'claves': 'orientacion oeste sur sol angulo tarde sombra',
    },
    'pergola-cuanta-sombra': {
      'pregunta': '¿Cuánta sombra da realmente una pérgola abierta?',
      'respuesta':
        'Menos de lo que se espera a mediodía y más por la mañana y por la tarde, porque los listones fijos cortan el sol por ángulo. El canto y la separación de los listones fijan el equilibrio entre sombra y luz. Si quiere sombra fiable a las dos de la tarde en julio, lo honesto es recomendar lamas o cubierta maciza.',
      'claves': 'sombra cobertura abierta listones separacion mediodia',
    },
    'pergola-lluvia-abierta': {
      'pregunta': '¿Se puede usar una pérgola abierta cuando llueve?',
      'respuesta':
        'No: un techo de listones no desvía nada. Ese es el precio de la luz y la ventilación. Si quiere seguir usando el espacio durante una tormenta de tarde en Florida, necesita lamas que cierren, una cubierta maciza aislada, o un toldo retráctil añadido por debajo.',
      'claves': 'lluvia pergola abierta mojar refugio toldo retractil',
    },
    'pergola-convertir-existente': {
      'pregunta': '¿Se puede convertir mi pérgola actual en una de lamas?',
      'respuesta':
        'Solo si los pilares, las vigas y las zapatas que ya hay se calcularon para el peso propio añadido y para el levantamiento distinto que genera un techo cerrado. Un techo cerrado agarra el viento que un emparrillado abierto deja pasar, así que esto es antes que nada una pregunta estructural. Muchas veces se sustituye el pórtico y solo se aprovecha la losa.',
      'claves': 'convertir reformar pergola existente lamas ampliar',
    },
    'pergola-lamas-que-angulo': {
      'pregunta': '¿Cuánto giran realmente las lamas?',
      'respuesta': 'Del orden de 140 a 170 grados según el sistema, que es lo que permite pasar de cielo abierto a un techo cerrado, parando en cualquier punto intermedio. Las posiciones útiles en la práctica son cerrada para la lluvia, entreabierta para luz tamizada, y abierta al atardecer.',
      'claves': 'lamas giro grados angulo abierta cerrada posicion',
    },
    'pergola-lamas-cuanto-duran': {
      'pregunta': '¿Cuánto duran los motores y se pueden sustituir?',
      'respuesta':
        'Los motores son un componente sustituible, no una pieza sellada de la estructura: están pensados para llegar a ellos y cambiarlos sin desmontar el techo. Su vida depende de los ciclos y de si le está entrando agua donde no debe, que es justo por lo que importa mantener el drenaje limpio.',
      'claves': 'motor duracion sustituir reparar accionamiento ciclos',
    },
    'pergola-solar-cuanto-produce': {
      'pregunta': '¿Cuánto puede producir de verdad una pérgola solar?',
      'respuesta':
        'Escala con la superficie de cubierta y la orientación, no con las ganas. Una instalación del tamaño de una pérgola suele ser un complemento útil —bomba de la piscina, iluminación, recarga del coche— más que un sistema para toda la casa. La conversación de diseño empieza por su consumo, no por cuántos paneles caben.',
      'claves': 'solar produccion kW paneles compensar bomba piscina coche',
    },
    'pergola-solar-sombra-debajo': {
      'pregunta': '¿Debajo de una pérgola solar hay sombra y se está seco?',
      'respuesta':
        'Sombra sí: los paneles son opacos. Que esté seco depende del montaje: paneles con juntas selladas y canalón se comportan como una cubierta maciza, paneles sobre rieles con huecos no. Si quiere una zona de estar seca debajo, eso hay que especificarlo, no darlo por hecho.',
      'claves': 'solar paneles sombra seco estanco huecos rieles',
    },
    'pergola-sukkha-diferencia-detalle': {
      'pregunta': '¿Para quién es el sistema Sukkha 3000?',
      'respuesta':
        'Encaja en proyectos que quieren un sistema definido y calculado, con una configuración conocida, en vez de una pieza única a medida: se especifica antes, se tramita antes y el precio lo refleja. Si su espacio tiene una geometría rara o un encuentro complicado, encaja mejor un diseño a medida.',
      'claves': 'Sukkha 3000 sistema para quien configuracion a medida',
    },
    'pergola-cuantos-pilares': {
      'pregunta': '¿Puedo tener una pérgola con menos pilares en medio?',
      'respuesta':
        'Sí, y es la petición más habitual. Menos pilares significa más luz entre apoyos, y eso significa vigas de más canto y zapatas más grandes: cuesta más y la estructura se ve más pesada por arriba. Voladizar un borde suele ser mejor respuesta que quitar un pilar del centro.',
      'claves': 'pilares columnas menos luz voladizo vista viga',
    },
    'pergola-altura': {
      'pregunta': '¿A qué altura debe quedar el techo?',
      'respuesta': 'Lo bastante alto para librar las puertas y dejar entrar el sol bajo, lo bastante bajo para que siga pareciendo una estancia y para que dé sombra de verdad. Entre 8 y 10 pies de altura libre encaja en casi cualquier casa. Subir más deja entrar más sol de tarde por el lateral, que es justo lo contrario de lo que la gente espera.',
      'claves': 'altura techo libre pies sol bajo',
    },
    'pergola-piscina-cloro': {
      'pregunta': '¿Es problema construir justo encima de la piscina?',
      'respuesta':
        'No, pero cambia los detalles. El cloro y el agua con cloración salina son corrosivos en forma de vapor, así que la especificación de herrajes importa más, y todo lo que quede colgado arriba tiene que poder revisarse sin vaciar la piscina. Las zapatas además tienen que librar el vaso y su fontanería.',
      'claves': 'encima piscina cloro sal corrosion vaso fontaneria zapata',
    },
    'pergola-viento-ruido': {
      'pregunta': '¿Las estructuras de aluminio vibran o silban con el viento?',
      'respuesta':
        'Una bien montada, no. El ruido con viento casi siempre significa que algo está flojo: un tornillo que se ha salido, un tapón de remate que falta, una guía de cortina mal asentada. Conviene perseguirlo y no convivir con ello, porque un traqueteo es una pieza que se está soltando más.',
      'claves': 'ruido vibracion viento traqueteo tornillo flojo crujido',
    },
    'pergola-carport-coche': {
      'pregunta': '¿Cabe de verdad mi coche en el carport?',
      'respuesta':
        'Mida la altura, no solo el largo. Un turismo normal es fácil; una pickup elevada, una furgoneta con baca o una autocaravana necesitan altura libre definida desde el principio, y lo que suele pillar a la gente son los accesorios del techo. La posición de los pilares también tiene que dejar abrir las puertas.',
      'claves': 'carport tamano altura autocaravana furgoneta puertas',
    },
    'pergola-carport-granizo': {
      'pregunta': '¿Un carport protege el coche de algo más que del sol?',
      'respuesta':
        'El sol es lo principal aquí, y no es poca cosa: el UV constante es lo que apaga la pintura y agrieta los salpicaderos. Una cubierta maciza además aparta la lluvia y lo que caiga de los árboles. Lo que un carport abierto no hace es proteger de la lluvia batiente ni de nada que viaje de lado en una tormenta.',
      'claves': 'carport proteccion sol UV pintura granizo lluvia viento',
    },
    'pergola-cabana-bano': {
      'pregunta': '¿Una cabaña puede llevar baño o ducha exterior?',
      'respuesta':
        'Sí, y es una petición habitual junto a la piscina, pero cambia el proyecto: permisos de fontanería, conexión de saneamiento y, si hay baño, requisitos de ventilación. Pasar la acometida y el desagüe sale mucho más barato antes de ejecutar el pavimento de alrededor que después.',
      'claves': 'cabana bano ducha fontaneria caseta piscina saneamiento',
    },
    'pergola-cabana-almacen': {
      'pregunta': '¿Una cabaña puede hacer también de almacén de la depuradora?',
      'respuesta':
        'Puede, y es buen aprovechamiento del volumen, pero mantenga esa parte separada y ventilada: los químicos de piscina y los sistemas de sal corroen metal y electrónica en un espacio cerrado. Una puerta de lamas o con mosquitero en ese hueco lo resuelve sin renunciar al aspecto.',
      'claves': 'cabana almacen depuradora quimicos bomba ventilacion',
    },
    'pergola-cerramiento-mansarda': {
      'pregunta': 'Mansarda, a dos aguas o cúpula: ¿en qué se diferencian?',
      'respuesta':
        'Sobre todo en altura y en cómo evacúa la cubierta. Un cerramiento plano o de mansarda queda más bajo, cuesta menos y encaja en un patio; el de dos aguas o la cúpula ganan altura sobre la piscina y evacúan mejor en luces grandes. Los requisitos de viento locales a veces descartan la opción más alta.',
      'claves': 'mansarda dos aguas cupula cerramiento cubierta altura luz',
    },
    'pergola-cerramiento-hojas': {
      'pregunta': '¿Un cerramiento evita las hojas y el polen en la piscina?',
      'respuesta':
        'Las hojas y lo grueso sí, y ese es el ahorro que más se nota: menos recoger y menos trabajo de bomba. El polen es lo bastante fino como para atravesar una mosquitera normal. Una malla anti-jején más tupida retiene más, a costa de algo de ventilación y de vistas.',
      'claves': 'hojas suciedad polen piscina limpieza skimmer malla',
    },
    'pergola-cortinas-instalar-despues': {
      'pregunta': '¿Se pueden añadir cortinas motorizadas a una pérgola que ya tengo?',
      'respuesta':
        'Muchas veces sí. Lo que necesita la reforma es un sitio firme donde anclar el cofre y las guías laterales, un hueco lo bastante recto para que el tejido corra, y por dónde llevar la corriente. Las estructuras de madera y las antiguas a veces piden refuerzo antes, y conviene comprobarlo antes de pedir nada.',
      'claves': 'añadir cortinas pergola existente cofre guia corriente',
    },
    'pergola-cortinas-mascotas': {
      'pregunta': '¿Un perro o un gato van a destrozar las cortinas?',
      'respuesta':
        'La mosquitera normal, probablemente sí, a la altura a la que llegan. La solución habitual es malla anti-mascotas en los paños bajos y malla normal arriba, que conserva las vistas y la ventilación donde importan. En cortinas motorizadas, el equivalente es un tejido de trama más gruesa.',
      'claves': 'mascota perro gato uñas daño malla resistente paño bajo',
    },
    'pergola-cortinas-cuantas': {
      'pregunta': '¿Necesito cortinas en los cuatro lados?',
      'respuesta':
        'Rara vez. Casi todos los espacios necesitan una o dos: la del sol de tarde y la que da al vecino o a la calle. Cerrar todos los huecos convierte una estancia exterior en una caja y cuesta cuatro veces más. Empiece por el peor lado y amplíe después si las guías van previstas.',
      'claves': 'cuantas cortinas lados cuatro parcial cobertura',
    },
    'pergola-cerramiento-mascota': {
      'pregunta': '¿Se puede poner una puerta para mascotas en el cerramiento?',
      'respuesta': 'Sí, y es más fácil dejarla prevista que abrirla después. Va en un paño con marco, no en la propia malla, así que no afecta ni a la estructura ni al tensado. La posición importa: lejos del lado de la piscina si de lo que se trata es de que el animal no se meta en el agua.',
      'claves': 'puerta mascota perro gato cerramiento paño instalar',
    },
    'pergola-policarbonato-vs-macizo': {
      'pregunta': '¿Policarbonato o cubierta maciza aislada?',
      'respuesta':
        'El policarbonato mantiene el espacio luminoso y cuesta menos; la cubierta aislada suena menos con lluvia, queda mucho más fresca por debajo y da un techo plano donde colgar cosas. Si la zona da contra un muro al norte o a una habitación oscura, el policarbonato salva la luz natural que si no se pierde.',
      'claves': 'policarbonato cubierta maciza aislada luz fresca eleccion',
    },
    'pergola-nieve-carga': {
      'pregunta': '¿Están calculadas para carga de nieve?',
      'respuesta':
        'Aquí no aplica: en el sur de Florida se calculan para levantamiento por viento, que es un problema distinto y en muchos aspectos más exigente. Si va a enviar algo a un estado del norte, el cálculo hay que rehacerlo para nieve; un paquete de viento de Florida no sirve.',
      'claves': 'nieve carga norte frio calculo trasladar',
    },
    'pergola-fabricacion-medida': {
      'pregunta': '¿Hay algo estándar o todo es a medida?',
      'respuesta':
        'Los componentes son estándar —perfiles, herrajes, lamas, sistemas de panel— y la configuración es a medida. Es a propósito: con piezas estándar dentro de cinco años hay recambio, mientras que las dimensiones siguen ajustándose a su espacio en vez de obligar a su espacio a ajustarse a un kit.',
      'claves': 'a medida estandar kit catalogo componentes recambio',
    },
    'pergola-comercial': {
      'pregunta': '¿Trabajan para restaurantes, hoteles y comunidades?',
      'respuesta':
        'Sí. La obra comercial va por otra vía: clasificación de uso, accesibilidad, a veces cuestiones de resistencia al fuego y casi siempre un plazo más estricto porque el espacio deja de facturar mientras está cerrado. Las estructuras son la misma familia de sistemas, calculadas para la hipótesis de carga comercial.',
      'claves': 'comercial restaurante hotel comunidad negocio proyecto',
    },
    'pergola-garantia-viento': {
      'pregunta': '¿Está garantizado que la estructura aguante un huracán?',
      'respuesta':
        'Ningún contratista honesto garantiza eso, y desconfíe del que lo haga. Lo que sí está garantizado es que se calculó y se tramitó para la velocidad de viento de cálculo de su dirección, y que se inspeccionó contra esos planos. Por encima del evento de cálculo, en ninguna propiedad hay certezas.',
      'claves': 'huracan garantia aguantar viento daño parte',
    },
    'obra-adoquin-hundimiento': {
      'pregunta': '¿Por qué se hunde o se desnivela un patio de adoquín?',
      'respuesta':
        'Casi siempre por la base, no por el adoquín. Lo que reparte la carga es una base de zahorra compactada con el espesor correcto; si se escatima o no se compacta por tongadas, la superficie se asienta en la primera temporada de lluvias. La otra mitad es el confinamiento de borde: sin él, el paño se abre hacia fuera.',
      'claves': 'adoquin hundimiento asiento desnivel base compactacion borde',
    },
    'obra-adoquin-sellado': {
      'pregunta': '¿Hay que sellar el adoquín?',
      'respuesta':
        'Es opcional y tiene contrapartida. El sellado aviva el color, protege de manchas y fija la arena de junta, pero hay que repetirlo cada cierto tiempo y un sellador brillante resbala en mojado, cosa que importa alrededor de una piscina. Mucha gente sella la entrada de coches y deja la playa de piscina sin sellar.',
      'claves': 'sellar adoquin sellador brillo resbala mancha arena junta',
    },
    'obra-adoquin-hierba': {
      'pregunta': '¿Cómo evito que salga hierba entre los adoquines?',
      'respuesta':
        'La hierba germina en la junta a partir de semilla que cae encima, no desde abajo si la base está bien hecha. La defensa habitual es arena polimérica de junta, que endurece y resiste tanto el lavado como la germinación. Rellenar las juntas cada pocos años hace más que cualquier herbicida.',
      'claves': 'hierba mala hierba adoquin junta arena polimerica hormigas',
    },
    'obra-adoquin-piscina-caliente': {
      'pregunta': '¿Qué adoquín se mantiene más fresco junto a la piscina?',
      'respuesta':
        'Importa más el color que el material: un travertino claro o un adoquín de hormigón pálido se pisa descalzo a mediodía donde una piedra oscura no. La textura también ayuda: un acabado tipo piedra concha o envejecido refleja y agarra mejor que una superficie oscura y lisa.',
      'claves': 'adoquin fresco descalzo caliente piscina travertino color',
    },
    'obra-adoquin-entrada-coche': {
      'pregunta': '¿Una entrada de coches se construye distinto que un patio?',
      'respuesta':
        'Sí, y la diferencia está bajo la superficie: una entrada necesita una base compactada de más espesor y normalmente un adoquín más grueso para asumir la carga de vehículos, además de cuidado donde giran las ruedas. Una base de patio bajo una entrada es la razón más habitual de que se hagan roderas en un par de años.',
      'claves': 'entrada coche base espesor carga vehiculo roderas patio',
    },
    'obra-entrada-manchas-aceite': {
      'pregunta': '¿Se quitan las manchas de aceite de una entrada de adoquín?',
      'respuesta':
        'Normalmente sí, y aquí es donde el adoquín gana al hormigón: una mancha que no sale se resuelve cambiando las piezas afectadas, y si guardó unos cuantos adoquines del palé original la reparación no se nota. El aceite fresco responde a un desengrasante; el viejo, ya absorbido, casi nunca.',
      'claves': 'aceite mancha entrada quitar desengrasante cambiar adoquin',
    },
    'obra-hormigon-grietas': {
      'pregunta': '¿Por qué se agrieta el hormigón? ¿Se puede evitar?',
      'respuesta':
        'El hormigón retrae al fraguar y va a agrietar; la cuestión es dónde. Las juntas de retracción se cortan para que agriete por una línea elegida y no por el medio. El armado, una buena dosificación y un curado correcto controlan el ancho de la fisura, no que exista.',
      'claves': 'hormigon grieta fisura junta retraccion armado curado',
    },
    'obra-hormigon-pisar': {
      'pregunta': '¿Cuándo puedo pisar o aparcar sobre hormigón nuevo?',
      'respuesta': 'A pie normalmente al día siguiente; con vehículos, bastante más: el hormigón sigue ganando resistencia durante semanas y alcanza la de proyecto mucho después de parecer terminado. Aparcar antes de tiempo es la forma más habitual de que una entrada nueva se lleve su primera marca permanente. Le damos las fechas de su hormigonado.',
      'claves': 'pisar aparcar hormigon nuevo curado resistencia dias',
    },
    'obra-hormigon-vs-adoquin-cual': {
      'pregunta': '¿Cuándo es mejor hormigón vertido que adoquín?',
      'respuesta':
        'Cuando quiere una superficie grande y continua, cuando el presupuesto aprieta, o debajo de algo que se va a construir encima después. El hormigón también es más fácil de mantener limpio. El adoquín gana en reparabilidad, en poder acceder a lo enterrado, y en no dejar un parche a la vista.',
      'claves': 'hormigon adoquin cuando mejor losa grande limpio',
    },
    'obra-drenaje-patio': {
      'pregunta': '¿Cómo se evita que se encharque el patio?',
      'respuesta':
        'Con pendiente, lo primero: una caída pequeña en sentido contrario a la casa a lo largo de toda la superficie mueve más agua que cualquier sumidero. Donde la pendiente sola no llega —un patio interior, un punto bajo, un patio encajonado por la casa— lo remata un canal de drenaje o un pozo filtrante.',
      'claves': 'drenaje patio encharcar agua pendiente canal pozo filtrante',
    },
    'obra-patio-cuanto-dura-obra': {
      'pregunta': '¿Puedo usar el jardín mientras reforman el patio?',
      'respuesta':
        'En parte. El derribo y la base necesitan acceso de máquina y esos días la zona es una obra de verdad. Organizamos el trabajo para que la depuradora y la entrada a la casa sigan accesibles, pero cuente con que el espacio exterior en sí quede fuera de uso hasta que esté puesto el pavimento.',
      'claves': 'durante obra jardin acceso uso depuradora suciedad fases',
    },
    'obra-patio-por-donde-empezar': {
      'pregunta': '¿En qué orden se hace una obra exterior?',
      'respuesta':
        'Primero todo lo que va enterrado: drenaje, tubos, fontanería, zapatas. Después la estructura, después el pavimento y por último la plantación. Ejecutar el pavimento antes que las zapatas de la pérgola significa romper obra nueva, y ese es el error más habitual y más evitable.',
      'claves': 'orden secuencia fases primero pavimento pergola tubo drenaje',
    },
    'obra-deck-material-cual': {
      'pregunta': '¿Deck de composite o de madera en Florida?',
      'respuesta':
        'Composite, para casi todo el mundo aquí. La madera hay que sellarla cada cierto tiempo y en este clima está expuesta a pudrición y termitas; el composite no. El intercambio es el calor —el composite oscuro se pone caliente al pisarlo— y el coste inicial. Elija un color claro si el deck está a pleno sol.',
      'claves': 'composite madera deck Florida calor pudricion termitas',
    },
    'obra-deck-sobre-hormigon': {
      'pregunta': '¿Se puede montar un deck sobre una losa de hormigón que ya existe?',
      'respuesta': 'Sí, y es una buena forma de rescatar una losa agrietada o fea sin derribarla. El entramado apoya sobre rastreles dejando hueco para drenaje y ventilación por debajo. La pega es la altura: el deck acabado queda unas pulgadas más alto, y eso puede afectar al umbral de una puerta.',
      'claves': 'deck sobre hormigon losa rastrel existente altura umbral',
    },
    'obra-valla-aluminio-vs-pvc': {
      'pregunta': '¿Valla de aluminio, de PVC o de madera?',
      'respuesta':
        'Aluminio para un cerramiento transparente que aguanta el salitre y cumple la normativa de piscinas; PVC para intimidad sin pintar; madera por estética, asumiendo el mantenimiento. En zona de huracanes, una valla ciega agarra el viento que una de barrotes de aluminio deja pasar, y eso cambia la especificación de los postes.',
      'claves': 'valla aluminio PVC madera intimidad piscina viento',
    },
    'obra-valla-piscina-normativa': {
      'pregunta': '¿Qué tiene que cumplir una valla de piscina?',
      'respuesta':
        'La normativa de seguridad en piscinas de Florida fija altura mínima, separación máxima entre barrotes y por abajo, prohibición de travesaños horizontales por los que un niño pueda trepar, y puertas con cierre y pestillo automáticos con el pestillo por encima de cierta altura. Una valla decorativa que falle en cualquiera de esos puntos no cuenta como barrera.',
      'claves': 'valla piscina normativa altura separacion barrote puerta pestillo',
    },
    'obra-valla-lindero': {
      'pregunta': '¿De quién es y quién mantiene una valla en el lindero?',
      'respuesta':
        'Depende de dónde esté realmente, y eso lo dice el levantamiento topográfico. Una valla construida dentro de su línea es suya; una a caballo del lindero suele ser compartida, y eso conviene acordarlo por escrito con el vecino antes de levantarla, no cuando haya que cambiarla.',
      'claves': 'valla lindero propiedad vecino compartida levantamiento',
    },
    'obra-valla-huracan': {
      'pregunta': '¿Las vallas aguantan los huracanes aquí?',
      'respuesta':
        'Las de barrotes de aluminio normalmente sí, porque el viento las atraviesa. Las que caen son las ciegas de PVC y de madera, que hacen de vela y cargan mucho los postes. Lo que decide el resultado es la profundidad y la separación de los postes, y si van recibidos con hormigón.',
      'claves': 'valla huracan viento aguantar ciega poste hormigon profundidad',
    },
    'obra-hormigon-espesor': {
      'pregunta': '¿Qué espesor debe tener una losa de patio o de entrada?',
      'respuesta':
        'Más bajo vehículos que bajo muebles, y el armado importa tanto como el canto. Lo que de verdad manda es la subbase: una base bien compactada bajo una losa modesta rinde más que una losa gruesa vertida sobre terreno blando, que es donde empiezan casi todos los fallos.',
      'claves': 'losa espesor canto entrada patio armadura mallazo subbase',
    },
    'obra-cuanto-dura-adoquin': {
      'pregunta': '¿Cuánto debería durar un adoquinado?',
      'respuesta':
        'Décadas, si la base se hizo bien: las piezas duran más que el propio montaje. Lo que envejece es la arena de junta y el confinamiento de borde, y las dos cosas se pueden reponer. Un adoquinado que a los cinco años parece cansado le está hablando de su base, no de sus adoquines.',
      'claves': 'adoquin duracion cuanto dura decadas base junta borde',
    },
    'obra-reutilizar-adoquin': {
      'pregunta': '¿Se pueden levantar y reutilizar mis adoquines actuales?',
      'respuesta':
        'Muchas veces sí, y es un ahorro real cuando el adoquín está sano pero la base ha fallado. Cuente con alguna rotura al levantarlos y con diferencias de color donde la cara vista se ha envejecido de otra forma. Presupueste un porcentaje de reposición de la misma gama, si se sigue fabricando.',
      'claves': 'reutilizar adoquin levantar recuperar rotura color',
    },
    'obra-pergola-sobre-deck': {
      'pregunta': '¿Puede ir una pérgola encima de un deck?',
      'respuesta':
        'Sí, pero los pilares tienen que atravesar el deck hasta sus propias zapatas en el terreno: no pueden apoyar sobre el entramado del deck, que nunca se calculó para levantamiento. Eso obliga a decidir dónde van los pilares antes de colocar las tablas, o a cortarlas después.',
      'claves': 'pergola sobre deck pilar zapata entramado levantamiento',
    },
    'obra-riego-jardin': {
      'pregunta': '¿Qué pasa con el riego y con la iluminación del jardín?',
      'respuesta':
        'Los dos se cortan al excavar si nadie los localiza antes, y los dos son baratos de desviar antes de la obra y caros de perseguir después. Marcamos y taponamos lo que estorba, y reconectamos o desviamos como parte del alcance en vez de dejarle zonas muertas.',
      'claves': 'riego aspersor iluminacion jardin cortar desviar reparar',
    },
    'obra-cesped-reparar': {
      'pregunta': '¿La maquinaria va a destrozar el césped?',
      'respuesta':
        'Las rutas de acceso se llevan lo suyo, y es más honesto anticiparlo que prometer lo contrario. Protegemos lo que se puede con tableros y concentramos el paso en un único camino. Reponer la franja afectada con tepe nuevo suele ir presupuestado como partida propia para que decida usted.',
      'claves': 'cesped daño maquinaria acceso tepe reponer proteccion',
    },
    'obra-entrada-ancho': {
      'pregunta': '¿Qué ancho debe tener una entrada de coches?',
      'respuesta':
        'El suficiente para abrir la puerta del coche sin pisar el jardín, que es más de lo que se suele dibujar. Un carril necesita sitio para caminar al lado; uno doble necesita ancho para poder usar los dos coches a la vez. La zona de maniobra importa más que el tramo recto.',
      'claves': 'entrada ancho carril doble puerta coche maniobra',
    },
    'obra-entrada-acera': {
      'pregunta': '¿Puedo cambiar por dónde la entrada llega a la calle?',
      'respuesta':
        'Ese encuentro está en dominio público, así que necesita autorización del municipio o del condado —a veces un permiso de ocupación aparte— y hay reglas de ancho, visibilidad y de cómo entrega el vado a la acera. Se puede hacer; simplemente no es una decisión privada.',
      'claves': 'entrada vado calle dominio publico bordillo acera permiso',
    },
    'obra-suelo-arena-florida': {
      'pregunta': '¿La arena del suelo de Florida da problemas a las zapatas?',
      'respuesta':
        'La arena es en realidad un terreno de apoyo aceptable cuando está confinada y compactada; los problemas son la materia orgánica, los rellenos de origen desconocido y el nivel freático alto. Por eso la profundidad de la zapata la fija el ingeniero para su parcela y no un detalle estándar.',
      'claves': 'arena suelo Florida zapata apoyo freatico relleno',
    },
    'obra-licencia-contratista': {
      'pregunta': '¿Cómo compruebo que un contratista tiene licencia y seguro?',
      'respuesta':
        'Las licencias son públicas: la base de datos del DBPR de Florida y el registro del condado permiten buscar por nombre. Pida el certificado de seguro enviado directamente por la aseguradora, no una copia, y confirme que cubre accidentes de trabajo además de responsabilidad civil. Haga esto antes de entregar ninguna señal.',
      'claves': 'licencia asegurado verificar DBPR comprobar seguro',
    },
    'obra-lien-garantia': {
      'pregunta': '¿Qué es un gravamen de obra y debería preocuparme?',
      'respuesta':
        'Con la ley de gravámenes de construcción de Florida, los subcontratistas y proveedores que no cobran pueden inscribir un gravamen sobre su propiedad aunque usted ya le haya pagado al contratista. Protéjase pidiendo renuncias de gravamen de subcontratistas y proveedores a medida que paga. Cualquier contratista legítimo espera esa petición.',
      'claves': 'gravamen lien ley construccion renuncia subcontratista proveedor',
    },
    'obra-contrato-que-mirar': {
      'pregunta': '¿Qué debe dejar claro el contrato?',
      'respuesta':
        'El alcance con las exclusiones listadas, el calendario de pagos ligado a hitos, quién saca el permiso, qué cubre la garantía y durante cuánto, cómo se valoran y aprueban las modificaciones, y qué pasa con los retrasos por tiempo. Si alguno de esos puntos es una conversación y no una cláusula, pida que se escriba.',
      'claves': 'contrato condiciones alcance exclusiones pago modificacion garantia',
    },
  },
};


/* ------------------------------------------------------------------ guardas --
 * Corren en build (este modulo lo importa FaqBiblioteca.astro). Revientan
 * `astro build` en vez de dejar pasar una biblioteca con ids que no cuadran o a
 * medio traducir sin que nadie se entere.                                      */

const vistos = new Set<string>();
for (const f of FAQS) {
  if (vistos.has(f.id)) throw new Error(`[faqs] id repetido: "${f.id}"`);
  vistos.add(f.id);
  if (!FAQS_COPY.en[f.id]) throw new Error(`[faqs] "${f.id}" no tiene copy en ingles`);
  if (f.enlace && !f.enlace.startsWith('/'))
    throw new Error(`[faqs] "${f.id}" tiene un enlace que no es interno: ${f.enlace}`);
}

for (const idioma of ['en', 'es'] as const) {
  for (const [id, c] of Object.entries(FAQS_COPY[idioma])) {
    if (!vistos.has(id))
      throw new Error(`[faqs] copy huerfano en ${idioma}: "${id}" no esta en FAQS`);
    // Las 85 de ficha vienen numeradas en el markup migrado ("1. How do..."). El
    // prefijo se limpia UNA VEZ al escribir el dato, nunca en el render: un
    // .replace() ahi se comeria una pregunta que empiece por año ("2026 code...").
    if (/^\d+\.\s/.test(c.pregunta))
      throw new Error(
        `[faqs] "${id}" (${idioma}) conserva el prefijo numerado de la ficha: "${c.pregunta.slice(0, 40)}"`,
      );
  }
}

/** Las que tienen copy en el idioma pedido. En `en` son todas, por la guarda de arriba. */
export const traducidas = (idioma: Idioma) =>
  idioma === 'en' ? FAQS : FAQS.filter((f) => FAQS_COPY.es[f.id]);

/**
 * Los pares P/R de unos `id` concretos, en el idioma pedido.
 *
 * Misma fuente que pinta el componente, para que el `FAQPage` del JSON-LD no pueda
 * declarar una pregunta que la pagina no muestra. Lanza si falta el copy: publicar
 * un par a medias es peor que no publicarlo.
 */
export const porId = (idioma: Idioma, ids: string[]) =>
  ids.map((id) => {
    const c = FAQS_COPY[idioma][id];
    if (!c) throw new Error(`[faqs] "${id}" no tiene copy en ${idioma}`);
    return { pregunta: c.pregunta, respuesta: c.respuesta };
  });

/**
 * Las preguntas que entran en el JSON-LD, en el idioma pedido.
 *
 * NO van las 95 (ni las ~245 de manana): un FAQPage completo son ~76 KB en crudo
 * duplicando en el <head> texto que ya esta en el <body>, y desde agosto de 2023
 * Google reserva el resultado enriquecido de FAQ a administracion publica y
 * salud. Un conjunto pequeno y curado vale mas que un volcado.
 */
export const destacadas = (idioma: Idioma) =>
  traducidas(idioma)
    .filter((f) => f.destacada)
    .map((f) => ({
      pregunta: FAQS_COPY[idioma][f.id].pregunta,
      respuesta: FAQS_COPY[idioma][f.id].respuesta,
    }));
