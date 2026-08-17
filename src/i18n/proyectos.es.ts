/**
 * Las 10 fichas de proyecto en español.
 *
 * Cada una tiene solo DOS cadenas propias: el <h1> y el parrafo que lo describe. El
 * resto de la pagina es el shell y los bloques comunes, que ya viven en `comun.es.ts`.
 *
 * Los NOMBRES DE SISTEMA (FORTE, FORTE Plus, ECLIPSE) y los toponimos no se traducen.
 *
 * Añadir un proyecto traducido es una entrada aqui + su ruta en `TRADUCIDAS`.
 */

export interface ProyectoEs {
  /** Nombre corto, para las migas. */
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

export const PROYECTOS_ES: Record<string, ProyectoEs> = {
  'attached-forte-pergola-in-west-palm-beach': {
    nombre: 'Pérgola FORTE adosada en West Palm Beach',
    title: 'Pérgola FORTE adosada en West Palm Beach | Aluminio',
    description:
      'Pérgola de aluminio FORTE adosada a la vivienda en West Palm Beach, calculada para la normativa de Florida.',
    dic: {
      'Attached FORTE Pergola in West Palm Beach | Aluminum Contractor':
        'Pérgola FORTE adosada en West Palm Beach | Aluminio',
      'This custom attached FORTE pergola project in West Palm Beach, Palm Beach County, was designed to seamlessly extend the home’s structure while enhancing outdoor living functionality. Engineered to meet or exceed Florida building codes, this aluminum pergola system provides durable shade and structural performance suited to South Florida’s coastal climate. The attached design ensures architectural continuity while maximizing usable patio space. Our licensed team completed the installation using high-quality materials and craftsman-level precision, delivering a residential outdoor structure built for durability, performance, and long-term value.':
        'Esta pérgola FORTE adosada a medida en West Palm Beach, condado de Palm Beach, se diseñó para prolongar la estructura de la casa y sacarle más partido al exterior. Calculada para cumplir o superar la normativa de Florida, esta pérgola de aluminio da sombra duradera y aguanta el clima costero del sur de Florida. Al ir adosada, mantiene la continuidad arquitectónica y aprovecha al máximo el patio. Nuestro equipo con licencia hizo la instalación con materiales de calidad y precisión de oficio, entregando una estructura hecha para durar, para rendir y para aportar valor.',
    },
  },
  'attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton': {
    nombre: 'Pérgola FORTE Plus adosada en Boca Raton',
    title: 'Pérgola FORTE Plus en Boca Raton | Instalación de costa',
    description:
      'Pérgola FORTE Plus adosada en una propiedad frente al Intracoastal en Boca Raton, calculada para ambiente marino.',
    dic: {
      'Attached FORTE Plus Pergola in Boca Raton | Coastal Installation':
        'Pérgola FORTE Plus en Boca Raton | Instalación de costa',
      'This custom attached FORTE Plus pergola project in Boca Raton, Palm Beach County was designed for a luxury waterfront property along the Intracoastal. Engineered to meet or exceed Florida building codes, this aluminum pergola system provides structural shade performance and long-term coastal durability suited to South Florida’s marine environment. The attached design seamlessly integrates with the existing residence, enhancing outdoor living while maintaining architectural continuity. Installed by our licensed South Florida team using high-quality materials and craftsman-level precision, this project delivers durability, refined aesthetics, and engineered reliability in a demanding waterfront setting.':
        'Esta pérgola FORTE Plus adosada a medida en Boca Raton, condado de Palm Beach, se diseñó para una propiedad de lujo frente al Intracoastal. Calculada para cumplir o superar la normativa de Florida, da sombra con solidez estructural y aguanta a largo plazo el ambiente marino del sur de Florida. Al ir adosada, se integra con la casa y amplía el exterior sin romper la continuidad arquitectónica. La instaló nuestro equipo con licencia con materiales de calidad y precisión de oficio: durabilidad, buen acabado y fiabilidad calculada en un entorno exigente frente al agua.',
    },
  },
  'eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach': {
    nombre: 'Cabañas ECLIPSE y pérgola FORTE en Riviera Beach',
    title: 'Cabañas ECLIPSE y pérgola FORTE en Riviera Beach | Comercial',
    description:
      'Proyecto comercial de hostelería en Riviera Beach: cabañas ECLIPSE y pérgola FORTE de aluminio para uso intensivo.',
    dic: {
      'ECLIPSE Cabanas &amp; FORTE Pergola in Riviera Beach | Commercial Project':
        'Cabañas ECLIPSE y pérgola FORTE en Riviera Beach | Comercial',
      'This commercial ECLIPSE cabanas and FORTE pergola project in Riviera Beach, Palm Beach County was developed for a hospitality environment requiring durability, architectural integration, and long-term performance. Engineered to meet or exceed Florida building codes, these aluminum shade structures provide reliable sun protection while maintaining a refined, modern aesthetic suited for high-traffic commercial use. The combination of ECLIPSE cabanas and FORTE pergola systems creates defined outdoor spaces designed for guest comfort and operational functionality. Installed by our licensed South Florida team using high-quality materials and craftsman-level precision, this project delivers structural integrity and coastal durability tailored to hospitality applications.':
        'Este proyecto comercial de cabañas ECLIPSE y pérgola FORTE en Riviera Beach, condado de Palm Beach, se hizo para un local de hostelería que necesitaba durabilidad, integración arquitectónica y buen rendimiento a largo plazo. Calculadas para cumplir o superar la normativa de Florida, estas estructuras de aluminio protegen del sol y mantienen una estética cuidada y actual, apta para el trasiego de un local. Juntas crean zonas exteriores bien definidas, cómodas para el cliente y prácticas para el negocio. Las instaló nuestro equipo con licencia con materiales de calidad y precisión de oficio: solidez y durabilidad de costa aplicadas a la hostelería.',
    },
  },
  'forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens': {
    nombre: 'Pérgola FORTE con muro parcial en Palm Beach Gardens',
    title: 'Pérgola FORTE en Palm Beach Gardens | Aluminio',
    description:
      'Pérgola FORTE de aluminio con muro de privacidad parcial en Palm Beach Gardens.',
    dic: {
      'FORTE Pergola in Palm Beach Gardens | Aluminum Contractor':
        'Pérgola FORTE en Palm Beach Gardens | Aluminio',
      'This custom FORTE pergola project in Palm Beach Gardens, Palm Beach County, features a partial privacy wall designed to enhance architectural definition and outdoor comfort. Engineered to meet or exceed Florida building codes, this aluminum pergola system provides structured shade and long-term durability suited for South Florida’s coastal environment. The partial privacy wall adds visual separation while maintaining airflow and modern design continuity. Our licensed team completed the full installation using high-quality materials and craftsman-level precision. The result is a refined outdoor living space that blends performance, privacy, and structural integrity. This custom FORTE pergola project in Palm Beach Gardens, Palm Beach County, features a partial privacy wall designed to enhance architectural definition and outdoor comfort. Engineered to meet or exceed Florida building codes, this aluminum pergola system provides structured shade and long-term durability suited for South Florida’s coastal environment. The partial privacy wall adds visual separation while maintaining airflow and modern design continuity. Our licensed team completed the full installation using high-quality materials and craftsman-level precision. The result is a refined outdoor living space that blends performance, privacy, and structural integrity.':
        'Esta pérgola FORTE a medida en Palm Beach Gardens, condado de Palm Beach, lleva un muro de privacidad parcial que define mejor el espacio y hace el exterior más cómodo. Calculada para cumplir o superar la normativa de Florida, da sombra bien resuelta y aguanta el ambiente costero del sur de Florida. El muro parcial separa visualmente sin cortar la ventilación ni romper la línea del diseño. Nuestro equipo con licencia hizo la instalación completa con materiales de calidad y precisión de oficio. El resultado es un exterior cuidado que une prestaciones, privacidad y solidez.',
    },
  },
  'forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach': {
    nombre: 'Pérgola FORTE con cortina motorizada en Delray Beach',
    title: 'Pérgola FORTE en Delray Beach | Cortina motorizada',
    description:
      'Pérgola FORTE con muro de privacidad y cortina de sombra motorizada en Delray Beach.',
    dic: {
      'FORTE Pergola in Delray Beach | Motorized Screen System':
        'Pérgola FORTE en Delray Beach | Cortina motorizada',
      'This custom FORTE pergola project in Delray Beach, Palm Beach County features an integrated privacy wall and motorized shade screen system designed for enhanced comfort and architectural definition. Engineered to meet and exceed Florida building codes, this aluminum pergola structure provides durable shade, automated climate control, and modern outdoor functionality tailored to South Florida’s coastal conditions. Our licensed team managed the complete design-build process using high-quality materials and craftsman-level installation standards. The result is a refined outdoor living space that enhances privacy, performance, and long-term structural reliability.':
        'Esta pérgola FORTE a medida en Delray Beach, condado de Palm Beach, lleva integrados un muro de privacidad y una cortina de sombra motorizada para ganar en confort y en definición. Calculada para cumplir y superar la normativa de Florida, da sombra duradera, control automático del ambiente y un exterior que funciona en las condiciones costeras del sur de Florida. Nuestro equipo con licencia llevó el diseño y la obra completos, con materiales de calidad y montaje de oficio. El resultado es un exterior cuidado, con más privacidad, mejor rendimiento y fiabilidad a largo plazo.',
    },
  },
  'forte-pergola-with-privacy-wall-tv-mount-in-delray-beach': {
    nombre: 'Pérgola FORTE con muro y televisor en Delray Beach',
    title: 'Pérgola FORTE con muro de privacidad en Delray Beach',
    description:
      'Pérgola FORTE con muro de privacidad y soporte de televisor para una zona de ocio exterior en Delray Beach.',
    dic: {
      'FORTE Pergola with Privacy Wall in Delray Beach | Contractor':
        'Pérgola FORTE con muro de privacidad en Delray Beach',
      'This custom FORTE pergola project in Delray Beach, Palm Beach County features an integrated privacy wall and mounted outdoor TV system designed to create a refined outdoor entertainment space. Engineered to meet or exceed Florida building codes, this aluminum pergola structure provides durable shade, architectural definition, and long-term structural performance suited to South Florida’s coastal climate. The privacy wall enhances separation and wind protection, while the integrated TV mount supports modern outdoor living functionality. Installed by our licensed South Florida team using high-quality materials and craftsman-level precision, this residential project delivers performance, comfort, and architectural cohesion.':
        'Esta pérgola FORTE a medida en Delray Beach, condado de Palm Beach, lleva un muro de privacidad y un televisor de exterior para crear una zona de ocio al aire libre. Calculada para cumplir o superar la normativa de Florida, da sombra duradera, define el espacio y aguanta el clima costero del sur de Florida. El muro aísla y frena el viento, y el soporte de televisor añade el uso que hoy se le pide a un exterior. La instaló nuestro equipo con licencia con materiales de calidad y precisión de oficio: prestaciones, confort y coherencia con la casa.',
    },
  },
  'forte-pergolas-in-greenacres-pool-patio': {
    nombre: 'Pérgolas FORTE en Greenacres',
    title: 'Pérgolas FORTE en Greenacres | Patio de piscina',
    description:
      'Pérgolas FORTE de aluminio para el patio de piscina de una vivienda en Greenacres.',
    dic: {
      'FORTE Pergolas in Greenacres | Pool Patio Installation':
        'Pérgolas FORTE en Greenacres | Patio de piscina',
      'This custom FORTE pergola project in Greenacres, Palm Beach County, was designed to enhance a residential pool patio with engineered shade and modern architectural definition. Built to meet or exceed Florida building codes, these aluminum pergolas provide durable sun protection and long-term structural performance tailored to South Florida’s coastal climate. The integration with the pool patio creates a cohesive outdoor living environment that balances functionality and refined design. Our licensed team completed the installation using high-quality materials and craftsman-level precision, delivering a residential outdoor structure built for durability, performance, and aesthetic value.':
        'Estas pérgolas FORTE a medida en Greenacres, condado de Palm Beach, se diseñaron para mejorar el patio de piscina de una vivienda con sombra calculada y una línea arquitectónica actual. Construidas para cumplir o superar la normativa de Florida, protegen del sol y aguantan el clima costero del sur de Florida. Al integrarse con el patio de piscina, el exterior queda cohesionado y equilibra uso y diseño. Nuestro equipo con licencia hizo la instalación con materiales de calidad y precisión de oficio.',
    },
  },
  'forte-plus-aluminum-carport-installation-in-pompano-beach': {
    nombre: 'Cochera FORTE Plus en Pompano Beach',
    title: 'Cochera FORTE Plus en Pompano Beach | Aluminio',
    description:
      'Cochera de aluminio FORTE Plus en Pompano Beach, calculada para superar la normativa de Florida.',
    dic: {
      'FORTE Plus Carport in Pompano Beach | Aluminum Contractor':
        'Cochera FORTE Plus en Pompano Beach | Aluminio',
      'This FORTE Plus aluminum carport project in Pompano Beach, Broward County, was engineered to meet and exceed current Florida building codes while delivering modern architectural styling and long-term durability. Designed for a residential property in South Florida, this custom aluminum structure provides reliable vehicle protection against sun, rain, and coastal exposure. Our team managed the full installation process using high-quality materials and detailed, craftsman-level workmanship to ensure structural integrity and refined aesthetics. Built specifically for South Florida’s climate and code requirements, this FORTE Plus carport enhances functionality while complementing the home’s outdoor environment.':
        'Esta cochera de aluminio FORTE Plus en Pompano Beach, condado de Broward, se calculó para cumplir y superar la normativa vigente de Florida, con una estética actual y con durabilidad a largo plazo. Diseñada para una vivienda del sur de Florida, protege los coches del sol, de la lluvia y de la exposición a la costa. Nuestro equipo llevó todo el montaje con materiales de calidad y un acabado de oficio, cuidando la solidez y el aspecto. Hecha a la medida del clima y de la normativa del sur de Florida, suma uso sin desentonar con la casa.',
    },
  },
  'forte-plus-pergola-with-outdoor-kitchen-in-delray-beach': {
    nombre: 'Pérgola FORTE Plus con cocina exterior en Delray Beach',
    title: 'Pérgola FORTE Plus en Delray Beach | Cocina exterior',
    description:
      'Pérgola FORTE Plus con cocina exterior integrada en Delray Beach.',
    dic: {
      'FORTE Plus Pergola in Delray Beach | Outdoor Kitchen':
        'Pérgola FORTE Plus en Delray Beach | Cocina exterior',
      'This custom FORTE Plus pergola project in Delray Beach, Palm Beach County, features a fully integrated outdoor kitchen designed to create a seamless luxury outdoor living environment. Engineered to meet or exceed Florida building codes, this aluminum pergola system provides durable shade, structural integrity, and architectural cohesion tailored to South Florida’s coastal climate. The integration of the outdoor kitchen enhances functionality while maintaining clean, modern design lines. Our licensed team completed the full installation using high-quality materials and craftsman-level precision, delivering a refined residential outdoor space built for long-term performance.':
        'Esta pérgola FORTE Plus a medida en Delray Beach, condado de Palm Beach, lleva una cocina exterior totalmente integrada para crear un exterior de lujo sin costuras. Calculada para cumplir o superar la normativa de Florida, da sombra duradera, es sólida y encaja con la casa en el clima costero del sur de Florida. La cocina suma uso sin romper las líneas limpias del diseño. Nuestro equipo con licencia hizo la instalación completa con materiales de calidad y precisión de oficio.',
    },
  },
  'forte-plus-pergolas-in-hillsboro-beach-estate': {
    nombre: 'Pérgolas FORTE Plus en Hillsboro Beach',
    title: 'Pérgolas FORTE Plus en Hillsboro Beach | Finca de lujo',
    description:
      'Pérgolas FORTE Plus en una finca frente a la playa en Hillsboro Beach, calculadas para el salitre.',
    dic: {
      'FORTE Plus Pergolas in Hillsboro Beach | Luxury Estate':
        'Pérgolas FORTE Plus en Hillsboro Beach | Finca de lujo',
      'This custom FORTE Plus pergola project in Hillsboro Beach, Broward County was designed for a luxury beachfront estate requiring structural durability and refined architectural integration. Engineered to meet or exceed Florida building codes, these aluminum pergola systems provide long-term performance in demanding coastal and salt-air conditions. Positioned at the front of the estate facing the beach, the structures enhance outdoor living while preserving open waterfront views. Installed by our licensed South Florida team using high-quality materials and craftsman-level precision, this project delivers engineered strength, modern design, and luxury outdoor functionality tailored for oceanfront properties.':
        'Estas pérgolas FORTE Plus a medida en Hillsboro Beach, condado de Broward, se diseñaron para una finca de lujo frente a la playa que exigía durabilidad estructural y una integración cuidada. Calculadas para cumplir o superar la normativa de Florida, aguantan a largo plazo unas condiciones de costa y de salitre exigentes. Colocadas en el frente de la finca, mirando a la playa, amplían el exterior sin tapar las vistas al agua. Las instaló nuestro equipo con licencia con materiales de calidad y precisión de oficio.',
    },
  },
};
