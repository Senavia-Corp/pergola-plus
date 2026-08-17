/**
 * Cadenas que se repiten en CASI TODAS las páginas migradas.
 *
 * Salen de dos bloques que Webflow reutiliza en ~100 páginas: el CTA final
 * («Request your free Estimate») y los botones de los formularios. Tenerlas aquí
 * evita repetir las mismas seis traducciones en cada diccionario, que es donde se
 * cuela la variante ligeramente distinta que luego el cliente ve como incoherencia.
 *
 * Las claves son el texto EXACTO del fragmento migrado, entidades incluidas.
 */
export const COMUN_ES: Record<string, string> = {
  // --- CTA final, en ~100 páginas ---
  'Request your free Estimate': 'Solicite su presupuesto gratis',
  'Meet with our exterior designers for a free consultation. We&#x27;ll assess your space and goals to plan the installation of pergolas, patio covers, or pool enclosures.':
    'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Evaluamos su espacio y sus objetivos para planificar la instalación de pérgolas, cubiertas de patio o cerramientos de piscina.',
  'Get A Quote': 'Pedir presupuesto',
  'Get a Quote': 'Pedir presupuesto',
  'Schedule A Visit': 'Agendar una visita',

  // --- Enlaces y botones recurrentes ---
  'Explore More →': 'Ver más →',
  'Read More →': 'Leer más →',
  'More about us': 'Más sobre nosotros',
  'More About Us': 'Más sobre nosotros',
  'explore our work': 'ver nuestro trabajo',
  'View Our Work': 'Ver nuestro trabajo',
  'Read Client Reviews': 'Leer opiniones de clientes',
  'Go to the main page': 'Ir a la página principal',

  // --- Sellos de confianza, repetidos en las páginas interiores ---
  'Licensed &amp;Insured In Florida': 'Con licencia y seguro en Florida',
  'Over 10 Years of Experience': 'Más de 10 años de experiencia',
  'Premium Materials &amp; Guaranteed Installation':
    'Materiales premium e instalación garantizada',
  'Custom Designs Tailored to Your Space': 'Diseños a medida para su espacio',

  // --- Formularios ---
  'Please wait...': 'Espere...',
  'Oops! Something went wrong while submitting the form.':
    'Vaya. Algo ha fallado al enviar el formulario.',
  'Thank you! Your request has been successfully received.':
    'Gracias. Hemos recibido su solicitud.',
  'Our team is reviewing your project details and will contact you shortly with next steps and recommendations.':
    'Nuestro equipo está revisando los detalles de su proyecto y le contactará en breve con los siguientes pasos y nuestras recomendaciones.',
  'By submitting this form, you agree to our': 'Al enviar este formulario, acepta nuestros',
  // El nodo llega con y sin espacio final segun el formulario, asi que las dos.
  'Terms ': 'Términos ',
  Terms: 'Términos',
  'Privacy Policy.': 'Política de Privacidad.',
  'Privacy Policy': 'Política de Privacidad',
  'I consent to receive SMS communications from Pergola Plus Florida regarding project updates, design consultations, scheduling, and promotional information. I understand I may opt out at any time by replying STOP. Message and data rates may apply.':
    'Doy mi consentimiento para recibir comunicaciones por SMS de Pergola Plus Florida sobre actualizaciones del proyecto, consultas de diseño, citas e información promocional. Entiendo que puedo darme de baja en cualquier momento respondiendo STOP. Pueden aplicarse tarifas de mensajes y datos.',
  'Select one...': 'Seleccione una opción...',
};
