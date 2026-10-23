# Registro de peticiones del cliente y su coste SEO

**Fuente:** Gmail de `sebastian@senaviacorp.com`, unos 210 hilos con Daniel (`daniel@pergolaplusflorida.com`) y Adrian (`adrian@pergolaplusflorida.com`), leídos el 23-oct-2026. A eso se suma el registro del repo (`docs/decisiones.md`, `docs/redirects.md`, `docs/estado-final.md`).

**Fichero de propiedad humana.** El loop lo lee y **no lo edita**: su SHA-256 se fija en la fase 0. Solo Senavia añade filas.

**Límites de la fuente:**
- Las correcciones de texto del 6-mar-2026 vienen en 5 capturas que no se pueden leer como texto.
- El documento de cambios de ene-2026 (un Google Doc) y el Figma no están en los correos.
- Parte del feedback llegó por WhatsApp.

Si el loop encuentra en el sitio un texto que parece escrito por el cliente y no está en esta tabla, **no lo cambia: lo propone** (§3).

---

## 1. Peticiones que el loop no deshace

**Regla para todas las filas:** el loop respeta la petición tal cual. Si choca con una buena práctica SEO, deja la versión del cliente y anota el coste en `05-CONFLICTOS-SEO-CLIENTE.md`, con la cita, la fecha y el hilo. Así queda constancia de que fue una decisión del cliente.

| ID | Fecha | Quién | Hilo | Petición (cita) | Elemento | ¿Choca con el SEO? | Qué hace el loop |
|---|---|---|---|---|---|---|---|
| R1 | 11-ago-2026 | Daniel | «Desactivación de widgets» (`19fcee21df196c17`) | Hero: «Live Outdoors. Beautifully.» / «South Florida's trusted experts in outdoor remodels, hardscape, and custom shade structures…» | H1 y subtítulo de la home (EN; su traducción en ES) | **Sí.** El H1 no lleva la keyword («pergola contractor South Florida»): la home pierde su señal on-page más fuerte para la consulta principal | **Mantiene el H1.** Lleva la keyword al `<title>`, a la descripción, al subtítulo (que ya dice «South Florida's trusted experts») y al primer H2. Lo anota en conflictos con la alternativa: lema como antetítulo y H1 «Custom Pergolas & Louvered Roofs in South Florida» |
| R2 | 29-sep-2026 | Daniel | «Preview del sitio» (`1a01f7a1105937f8`) | «Diversify your descriptions! Write them for the human reading the menu» (contra repetir «pergola contractors in South Florida») | Descripciones del menú | No: es buena práctica | No vuelve a meter frases de keyword en el menú ni en el texto visible. **Límite general: nada de keyword stuffing** |
| R3 | 29-sep-2026 | Daniel | ídem | «Pergolas & Patio Covers»; «Apollo»; «Change to Sukkah everywhere»; «Licensed & Insured»; «© 2026»; «Leave it all to us» | Menú, marca, producto, slugs, pie, tarjetas de proceso | No | Respeta los nombres y los slugs `/brands/apollo/` y `/products/sukkah/` |
| R4 | 6-mar-2026 | Daniel | «Follow-Up Meeting» (`19cc3b782d6aa002`) | «quitar "About Us" ahí» (segundo módulo de producto); los nombres de producto del módulo de la home, como enlaces | Fichas y home | No | No reintroduce «About Us» en las fichas. Mantiene los enlaces |
| R5 | 27-feb-2026 | Daniel (notas de la reunión) | «Website Review» (`19ca0ed004976124`) | Carrusel de marcas solo en la home; la licencia en About y en el pie; quitar la página «Service»; vídeo en el hero; sin imágenes de IA | Varias | Neutro | No añade carruseles de marcas fuera de la home ni imágenes de IA. La licencia se queda en About y en el pie |
| R6 | 15-ago-2025 | Adrian (lo propuso Senavia y él aceptó) | «Voicemail…» (`198af8824870d203`) | Que no lleguen leads de Central Florida: «South Florida» en títulos y metas | `<title>` y descripciones | No: refuerza la intención local | **Todos los títulos y descripciones nuevos llevan «South Florida», «FL» o una ciudad o condado del sur de Florida.** Es una puerta del juez (§4.2 de la especificación) |
| R7 | 15-abr-2025 | Adrian | «Ajustes pagina web P+» (`195fc7e3bc45b13f`) | Menú Resources: «Our Brands, Featured Projects, News & Blog, Customer Testimonials»; «Our Outdoors Solutions» | Menú y módulo | No | Respeta el orden y el nombre |
| R8 | 23-abr-2025 | Adrian | ídem | «ajusté los titulos de los proyectos un poco para tema SEO» | Títulos de los 10 proyectos | Leve: algunos pasan de 60 caracteres | **Mantiene el H1 del proyecto.** Solo acorta el `<title>` si pasa de 60, conservando las palabras de Adrian (ciudad, sistema). Lo anota |
| R9 | 12-oct-2026 | Daniel | «Preview del sitio» | «nuestra dirección le falta "Suite 110"»; teléfono «(561) 292-5054»; «APROBADO – pueden continuar» | Contacto | **Contradicción de NAP** (§2) | No cambia el NAP del sitio ni del JSON-LD. Lo deja en conflictos como decisión del cliente |
| R10 | 29-sep / 30-sep-2026 | Daniel | ídem | «family-owned», «no-obligation», «Sukkah 3000» confirmados | Textos | No | Los puede usar como hechos |
| R11 | 4-sep-2026 | Daniel | «Terms y Privacy Policy» (`1a06e7c4b5c8a74e`) | Cláusulas de privacidad y SMS en los términos | Legal | — | **Fuera del loop** (excluido: términos y privacidad) |
| R12 | 28-dic-2025 | Daniel | «Ads disapproved» (`19b6666913e51a46`) | Los anuncios apuntaban a `/aluminum-pergolas` | URL | — | Mantiene el 301 `/aluminum-pergolas` → `/products/` |
| R13 | — | Senavia, compromiso escrito (13-may-2026) | «Seguimiento Proyecto · Website Redesign» (`19e215f360d56c1d`) | «Las palabras clave del H1 mantendrán la estrategia SEO actual» y «Preservaremos la arquitectura del sitio» | H1 y URL | Limita los cambios de estructura | **No cambia slugs de páginas existentes ni la jerarquía del menú.** Fusionar posts o crear páginas nuevas (con 301) entra como **propuesta en la Release**, no en producción. Ningún H1 pierde la keyword que ya tiene |

## 2. Datos de negocio: qué es firme y qué se contradice

El loop usa solo los datos **firmes**. Los contradictorios no los resuelve: los anota en conflictos.

| Dato | Firme | Contradicción (decide el cliente) |
|---|---|---|
| Razón social | «Pergola Plus Florida llc» (texto de SMS de Daniel, 4-sep-2026) | La licencia `CGC1539940` está a nombre de **DE HOME VENTURES LLC** (DBPR, 23-oct-2026), con Daniel Eilemberg Hochman de cualificador. Los términos dicen «PERGOLA PLUS CORP». La firma de Adrian lleva «Tiki Hut Company USA Inc. / CGC 1506223» |
| Licencia | `CGC1539940`, activa hasta el 31-08-2028 (DBPR) | A qué entidad se anuncia (ver arriba). El loop **no** la mete en el JSON-LD (`hasCredential`) hasta que el cliente confirme la entidad |
| Dirección | 980 N Federal Hwy, Boca Raton, FL 33432 | «Suite 110»: Daniel la pidió en contacto (sale en 2 páginas, por `suiteEnTodoElSitio: false`). Su firma dice «Suite 110 **PMB 1051**»: PMB es un buzón privado. Google no admite un buzón como dirección visible de GBP |
| Teléfono | (561) 710-8363 en 217 páginas y en el JSON-LD | Adrian (7-ene-2026): centralizar en 710-8363. Daniel (12-oct-2026): «(561) 292-5054», hoy solo en contacto (`telefonoContacto`) |
| Zona de servicio | Sur de Florida, foco en Palm Beach y Broward; no Central Florida | En los hilos de anuncios el cliente dice que hay «áreas de Miami… que no trabajamos»: **Coral Gables**, Palmetto Bay y Hialeah (quién lo dijo, a confirmar en el hilo), y el sitio tiene `/pergolas-contractors/coral-gables/`. Coral Springs, Margate y Lauderhill están excluidas de los anuncios por la calidad de los leads, no del servicio |
| Años de experiencia | — (no está escrito por el cliente) | El sitio dice «Years of Experience» y «over ten years». El loop no añade cifras nuevas |
| Horario | — | El sitio dice L–V 8:00–17:00, y Adrian bloqueó los martes para citas. El loop no lo cambia |
| Equipo | Daniel Eilemberg (dueño) y Adrian Saravia | Para firmar los posts hace falta el OK de la persona |

## 3. Lo que no está registrado

Una petición del cliente puede no estar en esta tabla: capturas ilegibles, WhatsApp, el Google Doc. Por eso, si un cambio toca **texto visible que no salió de una plantilla de Webflow ni de Senavia** (hero, titulares de sección, nombres de producto o servicio, textos de proyecto), el loop lo deja como **propuesta** en `05-CONFLICTOS-SEO-CLIENTE.md`, no como cambio. Los textos SEO de buscador (`seo.titulo`, `seo.descripcion`) y los alt sí los cambia en la Release: no son texto visible de la página.
