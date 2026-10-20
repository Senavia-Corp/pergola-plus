import type { StructureResolver } from 'sanity/structure';

/** Orden del panel lateral: lo que el cliente edita mas, arriba. Singletons como un solo documento. */
const unico = (S: Parameters<StructureResolver>[0], tipo: string, titulo: string) =>
  S.listItem().title(titulo).id(tipo).child(S.document().schemaType(tipo).documentId(tipo).title(titulo));

export const estructura: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      unico(S, 'siteSettings', 'Datos del negocio'),
      unico(S, 'navigation', 'Menú y pie'),
      S.divider(),
      S.documentTypeListItem('page').title('Páginas'),
      S.documentTypeListItem('product').title('Productos'),
      S.documentTypeListItem('service').title('Servicios'),
      S.documentTypeListItem('project').title('Proyectos'),
      S.documentTypeListItem('brand').title('Marcas'),
      S.divider(),
      S.documentTypeListItem('post').title('Blog: artículos'),
      S.documentTypeListItem('blogCategory').title('Blog: categorías'),
      S.documentTypeListItem('faq').title('Preguntas frecuentes'),
      S.documentTypeListItem('faqTopic').title('Preguntas: filtros'),
      S.documentTypeListItem('faqTheme').title('Preguntas: temas'),
      S.documentTypeListItem('review').title('Reseñas de Google'),
      S.divider(),
      S.documentTypeListItem('county').title('Condados'),
      S.documentTypeListItem('city').title('Ciudades'),
      S.documentTypeListItem('legalPage').title('Textos legales'),
      S.documentTypeListItem('plantilla').title('Textos comunes de colecciones'),
      S.divider(),
      unico(S, 'estimador', 'Estimador de proyectos'),
    ]);
