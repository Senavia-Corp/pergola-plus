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
  limpiar: string;
  /** `{tema}` se sustituye por el nombre del tema. Una sola llave: check:paginas veta `{{`. */
  filtrandoPor: string;
  quitarFiltro: string;
  /** `{n}` se sustituye por el numero de resultados. */
  resultado: string;
  resultados: string;
  vacio: string;
  verMas: string;
  navFiltros: string;
  migaHome: string;
  migaRecursos: string;
  migaFaq: string;
  etiquetaMigas: string;
  filtrarPor: string;
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
    'patio-remodeling': 'Patio Remodeling',
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
    'patio-remodeling': 'Reforma de patio',
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
    limpiar: 'Clear search',
    filtrandoPor: 'Filtering by: {tema}',
    quitarFiltro: 'Remove filter',
    resultado: '{n} question',
    resultados: '{n} questions',
    vacio: 'No questions match your search. Try another word, or ask us directly and we will answer it.',
    verMas: 'More about {tema}',
    navFiltros: 'Filter questions by category',
    migaHome: 'Home',
    migaRecursos: 'Resources',
    migaFaq: 'FAQ',
    etiquetaMigas: 'Breadcrumb',
    filtrarPor: 'Filter by category',
    ctaTitulo: 'Need more information?',
    ctaTexto: 'Reach out to our team for specifics about your project',
    ctaBoton: 'Contact Us',
  },
  es: {
    todo: 'Todo',
    buscarEtiqueta: 'Buscar en la biblioteca de preguntas',
    buscarPista: 'Buscar preguntas…',
    limpiar: 'Limpiar la búsqueda',
    filtrandoPor: 'Filtrando por: {tema}',
    quitarFiltro: 'Quitar el filtro',
    resultado: '{n} pregunta',
    resultados: '{n} preguntas',
    vacio: 'No hay preguntas que coincidan. Pruebe con otra palabra, o escríbanos y se la respondemos.',
    verMas: 'Más sobre {tema}',
    navFiltros: 'Filtrar las preguntas por categoría',
    migaHome: 'Inicio',
    migaRecursos: 'Recursos',
    migaFaq: 'Preguntas frecuentes',
    etiquetaMigas: 'Migas de pan',
    filtrarPor: 'Filtrar por categoría',
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
      'pregunta': 'Do patio remodels require permits in South Florida?',
      'respuesta':
        'Structural patio remodeling projects often require permits. Professional patio contractors manage engineering documentation and building inspections in Palm Beach and Broward County.',
    },
    'patio-plazo': {
      'pregunta': 'How long does patio remodeling take?',
      'respuesta':
        'Patio remodeling timelines vary based on scope and materials. Most South Florida patio renovation projects take several weeks including demolition, preparation, and installation.',
    },
    'patio-pergola': {
      'pregunta': 'Can pergolas be added during patio remodeling?',
      'respuesta':
        'Yes. Patio remodeling contractors integrate aluminum pergolas, motorized screens, and premium paver systems to create cohesive outdoor living environments.',
    },
    'patio-revalorizacion': {
      'pregunta': 'Will remodeling my patio increase property value?',
      'respuesta':
        'A professionally remodeled patio enhances usability and curb appeal. Luxury patio remodeling in South Florida can improve resale value.',
    },
    'patio-material': {
      'pregunta': 'What materials are best for patio renovations?',
      'respuesta':
        'High-performance pavers, reinforced concrete slabs, and aluminum shade systems are ideal materials for durable patio remodeling in South Florida’s climate.',
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
      'pregunta': '¿Hace falta permiso para reformar un patio en el sur de Florida?',
      'respuesta':
        'Las reformas que tocan estructura suelen requerir permiso. Nosotros gestionamos la documentación de cálculo y las inspecciones en Palm Beach y Broward.',
    },
    'patio-plazo': {
      'pregunta': '¿Cuánto se tarda en reformar un patio?',
      'respuesta':
        'Depende del alcance y de los materiales. La mayoría de reformas en el sur de Florida llevan varias semanas, contando demolición, preparación e instalación.',
    },
    'patio-pergola': {
      'pregunta': '¿Se puede añadir una pérgola durante la reforma?',
      'respuesta':
        'Sí. Integramos pérgolas de aluminio, cortinas motorizadas y adoquinado de gama alta para que el exterior quede como un conjunto.',
    },
    'patio-revalorizacion': {
      'pregunta': '¿Reformar el patio revaloriza la casa?',
      'respuesta':
        'Un patio bien reformado se usa más y mejora la imagen de la casa. En el sur de Florida suele mejorar el valor de reventa.',
    },
    'patio-material': {
      'pregunta': '¿Qué materiales son mejores para reformar un patio?',
      'respuesta':
        'Adoquines de alto rendimiento, losas de hormigón armado y sistemas de sombra de aluminio son lo ideal para que una reforma aguante el clima del sur de Florida.',
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
