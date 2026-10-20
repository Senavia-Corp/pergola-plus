/**
 * Documentos. Ver el diseño (Fase 3, §2.2–2.3). `_id` de la migración: `<tipo>.<slug>`
 * (o `page.<ruta>`), determinista para que importar dos veces no cree nada nuevo.
 */
import { defineArrayMember, defineField, defineType } from 'sanity';
import { slugFijo, CON_PAGINA } from './objetos';

const seo = defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' });
const grupos = [
  { name: 'contenido', title: 'Contenido', default: true },
  { name: 'seo', title: 'SEO' },
];
const nombre = (title = 'Nombre') => defineField({ name: 'nombre', title, type: 'textoI18n', group: 'contenido', validation: (r) => r.required() });
const cuerpo = defineField({ name: 'secciones', title: 'Secciones', type: 'array', of: [{ type: 'seccion' }], group: 'contenido' });
const galeria = defineField({ name: 'galeria', title: 'Galería', type: 'array', of: [{ type: 'imagen' }], group: 'contenido' });
const ref = (name: string, title: string, a: string[]) =>
  defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'reference', to: a.map((type) => ({ type })) })], group: 'contenido' });
const vistaNombre = { select: { title: 'nombre.en', subtitle: 'slug.current' } };

// ---------------------------------------------------------------------------
// Singletons
// ---------------------------------------------------------------------------

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Datos del negocio',
  type: 'document',
  fields: [
    defineField({ name: 'nombreComercial', title: 'Nombre comercial', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'razonSocial', title: 'Razón social', type: 'string' }),
    defineField({
      name: 'direccion',
      title: 'Dirección',
      type: 'object',
      fields: [
        defineField({ name: 'calle', title: 'Calle', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'suite', title: 'Suite / local', type: 'string' }),
        defineField({
          name: 'suiteEnTodoElSitio',
          title: 'Mostrar la suite en todo el sitio',
          description: 'Desactivado: la suite solo aparece en la página de contacto (petición del 12-oct-2026).',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({ name: 'ciudad', title: 'Ciudad', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'estado', title: 'Estado', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'cp', title: 'Código postal', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'pais', title: 'País (código)', type: 'string', initialValue: 'US' }),
      ],
    }),
    defineField({
      name: 'telefonoPrincipal',
      title: 'Teléfono principal',
      description: 'Menú, pie, botón flotante, WhatsApp, mensajes de error de los formularios, datos estructurados y «Schedule a Visit».',
      type: 'string',
      validation: (r) => r.required().regex(/^\(\d{3}\) \d{3}-\d{4}$/, { name: '(561) 000-0000' }),
    }),
    defineField({
      name: 'telefonoContacto',
      title: 'Teléfono de la página de contacto',
      description: 'Solo las fichas Office/Phone de «Get in touch», en inglés y en español (petición del 12-oct-2026).',
      type: 'string',
      validation: (r) => r.regex(/^\(\d{3}\) \d{3}-\d{4}$/, { name: '(561) 000-0000' }),
    }),
    defineField({
      name: 'telefonoContactoEnTodoElSitio',
      title: 'Usar el teléfono de contacto en todo el sitio',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'correoPublico', title: 'Correo público', type: 'string', validation: (r) => r.required().email() }),
    defineField({ name: 'horario', title: 'Horario (texto)', type: 'textoI18n' }),
    defineField({
      name: 'horarioEstructurado',
      title: 'Horario (para Google)',
      type: 'object',
      options: { columns: 3 },
      fields: [
        defineField({ name: 'dias', title: 'Días', type: 'array', of: [{ type: 'string' }], options: { list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] } }),
        defineField({ name: 'abre', title: 'Abre (HH:MM)', type: 'string', validation: (r) => r.regex(/^\d{2}:\d{2}$/) }),
        defineField({ name: 'cierra', title: 'Cierra (HH:MM)', type: 'string', validation: (r) => r.regex(/^\d{2}:\d{2}$/) }),
      ],
    }),
    defineField({ name: 'notaCita', title: 'Nota de cita', type: 'textoI18n' }),
    defineField({ name: 'redes', title: 'Redes sociales', type: 'array', of: [{ type: 'url' }] }),
    defineField({ name: 'condadosServidos', title: 'Condados servidos', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'resumenResenas',
      title: 'Resumen de reseñas de Google',
      type: 'object',
      fields: [
        defineField({ name: 'media', title: 'Nota media', type: 'number', validation: (r) => r.min(1).max(5) }),
        defineField({ name: 'total', title: 'Número de reseñas', type: 'number', validation: (r) => r.min(0).integer() }),
        defineField({ name: 'leidoEl', title: 'Leído el', type: 'date' }),
        defineField({ name: 'fuente', title: 'Fuente', type: 'string' }),
      ],
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'imagen' }),
    defineField({ name: 'imagenOgPorDefecto', title: 'Imagen al compartir (por defecto)', type: 'imagen' }),
    defineField({
      name: 'videoHero',
      title: 'Vídeo de la portada',
      type: 'object',
      fields: [
        defineField({ name: 'mp4', title: 'MP4 (escritorio)', type: 'file' }),
        defineField({ name: 'mp4Movil', title: 'MP4 (móvil)', type: 'file' }),
        defineField({ name: 'webm', title: 'WebM', type: 'file' }),
        defineField({ name: 'poster', title: 'Fotograma de espera', type: 'imagen' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Datos del negocio' }) },
});

export const navigation = defineType({
  name: 'navigation',
  title: 'Menú y pie',
  type: 'document',
  fields: [
    defineField({
      name: 'menu',
      title: 'Menú',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'grupoMenu',
          type: 'object',
          fields: [
            defineField({ name: 'clave', title: 'Grupo', type: 'string', readOnly: true }),
            defineField({ name: 'texto', title: 'Texto', type: 'textoI18n' }),
            defineField({ name: 'destino', title: 'Lleva a', type: 'reference', to: CON_PAGINA.map((type) => ({ type })) }),
            defineField({ name: 'subgrupos', title: 'Columnas', type: 'array', of: [{ type: 'seccion' }] }),
          ],
          preview: { select: { title: 'texto.en', subtitle: 'clave' } },
        }),
      ],
    }),
    defineField({ name: 'pie', title: 'Pie', type: 'array', of: [{ type: 'seccion' }] }),
    defineField({ name: 'textos', title: 'Textos comunes (botones, avisos)', type: 'array', of: [{ type: 'textoClave' }] }),
  ],
  preview: { prepare: () => ({ title: 'Menú y pie' }) },
});

// ---------------------------------------------------------------------------
// Con página
// ---------------------------------------------------------------------------

export const page = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  groups: grupos,
  fields: [
    defineField({
      name: 'ruta',
      title: 'Ruta',
      description: 'Fija: la página la pinta una plantilla del código.',
      type: 'string',
      readOnly: true,
      validation: (r) => r.required(),
      group: 'contenido',
    }),
    defineField({ name: 'titulo', title: 'Título', type: 'textoI18n', group: 'contenido', validation: (r) => r.required() }),
    cuerpo,
    seo,
  ],
  preview: { select: { title: 'titulo.en', subtitle: 'ruta' } },
});

const filaEspecificacion = defineArrayMember({
  name: 'filaEspecificacion',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'Fila', type: 'string', readOnly: true }),
    defineField({ name: 'etiqueta', title: 'Etiqueta', type: 'textoI18n' }),
    defineField({ name: 'valor', title: 'Valor', type: 'textoLargoI18n' }),
    defineField({ name: 'enDatosEstructurados', title: 'En datos estructurados', type: 'boolean' }),
  ],
  preview: { select: { title: 'etiqueta.en', subtitle: 'valor.en' } },
});

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  groups: grupos,
  fields: [
    nombre(),
    slugFijo(),
    defineField({ name: 'resumen', title: 'Resumen (tarjetas y menú)', type: 'textoLargoI18n', group: 'contenido' }),
    defineField({ name: 'portada', title: 'Portada', type: 'imagen', group: 'contenido' }),
    cuerpo,
    defineField({
      name: 'especificaciones',
      title: 'Especificaciones',
      type: 'object',
      group: 'contenido',
      fields: [
        defineField({ name: 'filas', title: 'Filas', type: 'array', of: [filaEspecificacion] }),
        defineField({ name: 'material', title: 'Material', type: 'string' }),
      ],
    }),
    galeria,
    ref('marcas', 'Marcas', ['brand']),
    ref('faqsPromovidas', 'Preguntas frecuentes de la ficha', ['faq']),
    seo,
  ],
  preview: vistaNombre,
});

export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  groups: grupos,
  fields: [
    nombre(),
    slugFijo(),
    defineField({ name: 'resumen', title: 'Resumen (tarjetas y menú)', type: 'textoLargoI18n', group: 'contenido' }),
    defineField({ name: 'portada', title: 'Portada', type: 'imagen', group: 'contenido' }),
    cuerpo,
    galeria,
    ref('faqsPromovidas', 'Preguntas frecuentes de la ficha', ['faq']),
    seo,
  ],
  preview: vistaNombre,
});

export const brand = defineType({
  name: 'brand',
  title: 'Marca',
  type: 'document',
  groups: grupos,
  fields: [nombre(), slugFijo(), defineField({ name: 'logo', title: 'Logo', type: 'imagen', group: 'contenido' }), defineField({ name: 'portada', title: 'Portada', type: 'imagen', group: 'contenido' }), cuerpo, galeria, seo],
  preview: vistaNombre,
});

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  groups: grupos,
  fields: [
    nombre(),
    slugFijo(),
    defineField({ name: 'ubicacion', title: 'Ubicación', type: 'textoI18n', group: 'contenido' }),
    defineField({
      name: 'portada',
      title: 'Portada',
      description: 'En el portafolio, foto real del cliente siempre que exista.',
      type: 'imagen',
      group: 'contenido',
      validation: (r) =>
        r.custom((img: { procedencia?: string } | undefined) =>
          !img?.procedencia || img.procedencia === 'real-cliente' ? true : 'En el portafolio conviene una foto real del cliente',
        ).warning(),
    }),
    cuerpo,
    galeria,
    ref('productos', 'Productos', ['product']),
    defineField({ name: 'ordenDestacado', title: 'Orden en «Featured Projects» (vacío = no destacado)', type: 'number', group: 'contenido' }),
    seo,
  ],
  preview: vistaNombre,
});

export const post = defineType({
  name: 'post',
  title: 'Artículo del blog',
  type: 'document',
  groups: grupos,
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'textoI18n', group: 'contenido', validation: (r) => r.required() }),
    slugFijo('titulo.en'),
    defineField({ name: 'resumen', title: 'Resumen', type: 'textoLargoI18n', group: 'contenido' }),
    defineField({ name: 'principal', title: 'Imagen principal', type: 'imagen', group: 'contenido' }),
    defineField({ name: 'miniatura', title: 'Miniatura', type: 'imagen', group: 'contenido' }),
    defineField({
      name: 'tituloLargo',
      title: 'Título largo (bloque destacado y pestaña en español)',
      type: 'textoI18n',
      group: 'contenido',
    }),
    defineField({ name: 'cuerpo', title: 'Texto', type: 'bloqueI18n', group: 'contenido', validation: (r) => r.required() }),
    defineField({ name: 'categoria', title: 'Categoría', type: 'reference', to: [{ type: 'blogCategory' }], group: 'contenido', validation: (r) => r.required() }),
    defineField({ name: 'destacado', title: 'Destacado (sube en el listado)', type: 'boolean', initialValue: false, group: 'contenido' }),
    defineField({
      name: 'principalDelBlog',
      title: 'Artículo principal del blog',
      description: 'Solo uno a la vez: es el del bloque grande de la portada del blog.',
      type: 'boolean',
      initialValue: false,
      group: 'contenido',
    }),
    defineField({ name: 'fechaCreacion', title: 'Fecha de creación (ordena el listado)', type: 'datetime', group: 'contenido', validation: (r) => r.required() }),
    defineField({ name: 'fechaPublicacion', title: 'Fecha de publicación (la que se muestra)', type: 'datetime', group: 'contenido', validation: (r) => r.required() }),
    defineField({ name: 'fechaActualizacion', title: 'Última actualización', type: 'datetime', group: 'contenido' }),
    seo,
  ],
  orderings: [{ title: 'Más recientes', name: 'recientes', by: [{ field: 'fechaCreacion', direction: 'desc' }] }],
  preview: { select: { title: 'titulo.en', subtitle: 'slug.current', media: 'miniatura' } },
});

export const blogCategory = defineType({
  name: 'blogCategory',
  title: 'Categoría del blog',
  type: 'document',
  groups: grupos,
  fields: [
    nombre(),
    slugFijo(),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'textoLargoI18n', group: 'contenido' }),
    defineField({ name: 'tienePagina', title: 'Tiene página propia', type: 'boolean', initialValue: false, group: 'contenido' }),
    seo,
  ],
  preview: vistaNombre,
});

export const county = defineType({
  name: 'county',
  title: 'Condado',
  type: 'document',
  groups: grupos,
  fields: [nombre(), slugFijo(), defineField({ name: 'portada', title: 'Portada', type: 'imagen', group: 'contenido' }), cuerpo, seo],
  preview: vistaNombre,
});

export const city = defineType({
  name: 'city',
  title: 'Ciudad',
  type: 'document',
  groups: grupos,
  fields: [
    nombre(),
    slugFijo(),
    defineField({ name: 'condado', title: 'Condado', type: 'reference', to: [{ type: 'county' }], group: 'contenido', validation: (r) => r.required() }),
    defineField({ name: 'portada', title: 'Portada', type: 'imagen', group: 'contenido' }),
    cuerpo,
    seo,
  ],
  preview: vistaNombre,
});

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Texto legal',
  type: 'document',
  groups: grupos,
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'textoI18n', group: 'contenido', validation: (r) => r.required() }),
    slugFijo('titulo.en'),
    defineField({
      name: 'cuerpo',
      title: 'Texto',
      description: 'Si el español está vacío, la página no se publica en español.',
      type: 'bloqueI18n',
      group: 'contenido',
    }),
    seo,
  ],
  preview: { select: { title: 'titulo.en', subtitle: 'slug.current' } },
});

// ---------------------------------------------------------------------------
// Sin página propia
// ---------------------------------------------------------------------------

export const faqTopic = defineType({
  name: 'faqTopic',
  title: 'Tema de preguntas',
  type: 'document',
  fields: [
    defineField({ name: 'clave', title: 'Clave', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'nombre', title: 'Nombre', type: 'textoI18n', validation: (r) => r.required() }),
    defineField({ name: 'orden', title: 'Orden', type: 'number' }),
  ],
  preview: { select: { title: 'nombre.en', subtitle: 'clave' } },
});

export const faqTheme = defineType({
  name: 'faqTheme',
  title: 'Tema de preguntas (agrupación)',
  type: 'document',
  fields: [
    defineField({ name: 'clave', title: 'Clave', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'nombre', title: 'Nombre', type: 'textoI18n', validation: (r) => r.required() }),
    defineField({ name: 'orden', title: 'Orden', type: 'number' }),
  ],
  preview: { select: { title: 'nombre.en', subtitle: 'clave' } },
});

export const faq = defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({ name: 'idEstable', title: 'Identificador', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'pregunta', title: 'Pregunta', type: 'textoI18n', validation: (r) => r.required() }),
    defineField({ name: 'respuesta', title: 'Respuesta', type: 'textoLargoI18n', validation: (r) => r.required() }),
    defineField({ name: 'sinonimos', title: 'Sinónimos para el buscador (no se muestran)', type: 'textoI18n' }),
    defineField({ name: 'chip', title: 'Filtro', type: 'reference', to: [{ type: 'faqTopic' }], validation: (r) => r.required() }),
    defineField({ name: 'tema', title: 'Tema', type: 'reference', to: [{ type: 'faqTheme' }], validation: (r) => r.required() }),
    defineField({ name: 'origen', title: 'Origen', type: 'string', readOnly: true, options: { list: ['ficha', 'pagina', 'nueva'] } }),
    defineField({ name: 'enlace', title: 'Enlace «saber más»', type: 'reference', to: CON_PAGINA.map((type) => ({ type })) }),
    defineField({ name: 'destacada', title: 'Destacada', type: 'boolean' }),
    defineField({ name: 'claves', title: 'Términos que no se traducen', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'orden', title: 'Orden', type: 'number' }),
  ],
  preview: { select: { title: 'pregunta.en', subtitle: 'tema.clave' } },
});

export const review = defineType({
  name: 'review',
  title: 'Reseña de Google',
  type: 'document',
  description: 'Solo reseñas reales, copiadas de la ficha pública de Google.',
  fields: [
    defineField({ name: 'autor', title: 'Autor', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'idOrigen', title: 'Identificador de origen', type: 'string', readOnly: true }),
    defineField({ name: 'fecha', title: 'Fecha', type: 'date' }),
    defineField({ name: 'idioma', title: 'Idioma del texto', type: 'string', options: { list: ['en', 'es'] } }),
    defineField({ name: 'estrellas', title: 'Estrellas', type: 'number', validation: (r) => r.required().min(1).max(5).integer() }),
    defineField({ name: 'texto', title: 'Texto (tal como lo escribió)', type: 'text', validation: (r) => r.required() }),
    defineField({ name: 'respuestaDueno', title: 'Respuesta del negocio', type: 'text' }),
    defineField({ name: 'enlace', title: 'Enlace a la reseña', type: 'url' }),
    defineField({ name: 'fuente', title: 'Fuente', type: 'string', initialValue: 'google', readOnly: true }),
    defineField({ name: 'leidoEl', title: 'Leída el', type: 'date' }),
    defineField({ name: 'orden', title: 'Orden', type: 'number' }),
  ],
  preview: { select: { title: 'autor', subtitle: 'texto' } },
});

export const documentos = [siteSettings, navigation, page, product, service, brand, project, post, blogCategory, county, city, legalPage, faqTopic, faqTheme, faq, review];
