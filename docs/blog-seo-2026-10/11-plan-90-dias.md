# Plan de medición a 90 días

Hoy no hay línea base. No hay acceso a Search Console, Bing Webmaster ni GA4 en esta
sesión, y —más importante— **el sitio nuevo todavía no sirve en el dominio**: el Webflow
en vivo sigue ahí, y los builds sin `PUBLIC_ES_PRODUCCION=1` llevan `Disallow: /`.

Así que el día 0 no es hoy: **el día 0 es el primer día que el dominio sirva este sitio
con `PUBLIC_ES_PRODUCCION=1`.** Medir antes de eso no mide nada.

---

## Paso 0 — antes de poder medir

| | Qué | Quién |
|---|---|---|
| 0.1 | Desplegar con `PUBLIC_ES_PRODUCCION=1` para que haya sitemap y `robots.txt` abierto | Cliente / Senavia |
| 0.2 | Verificar la propiedad en Search Console **y** en Bing Webmaster Tools | Cliente |
| 0.3 | Enviar `sitemap.xml` en los dos | Cliente |
| 0.4 | Confirmar que GA4 recibe datos del dominio nuevo | Cliente |
| 0.5 | Comprobar las 21 URLs con la inspección de URL de GSC (es la única fuente que dice «indexado») | — |

Hasta que 0.1 y 0.2 estén hechos, **todo lo demás está bloqueado**, y eso es un hecho
sobre el calendario, no una excusa.

---

## Línea base (día 0, a capturar en cuanto haya acceso)

Por cada una de las 21 URLs, en EN y ES:

**Search Console** — clics, impresiones, CTR, posición media, consultas, estado de
cobertura, y rendimiento de búsqueda generativa si está disponible para la propiedad.

**Bing Webmaster Tools** — impresiones y clics; y en AI Performance, si la propiedad lo
tiene: páginas citadas, total de citaciones, consultas de grounding y Topics Portfolio.
El Topics Portfolio se lee como indicador **direccional**, nunca como cuota de mercado.

**GA4** — sesiones orgánicas, sesiones con interacción, envíos de formulario por página
de origen.

> Un apunte que vale los 90 días: **clics ≠ sesiones ≠ envíos de formulario ≠ leads
> cualificados.** Son cuatro números distintos y mezclarlos es la forma más común de
> contarse una historia bonita.

---

## Calendario

### Día 30 — ¿se está rastreando e indexando?

Es demasiado pronto para posiciones. Lo que se mira:

- Las 21 URLs EN + 21 ES, ¿indexadas? (inspección de URL)
- ¿Errores de cobertura nuevos?
- ¿El sitemap se lee sin error en GSC y en Bing?
- ¿Alguna página del blog pierde impresiones respecto a la línea base? Eso sería señal
  de un problema de migración, no de contenido.

**Qué NO esperar a 30 días:** cambios de posición atribuibles a este trabajo.

### Día 60 — ¿cambia el comportamiento?

- Impresiones y CTR por URL frente a la línea base.
- Consultas nuevas por artículo: ¿aparecen las de normativa y ciudad?
- ¿Las 5 ciudades enlazadas desde el artículo de códigos reciben tráfico interno?
  (GA4, navegación entre páginas)
- Bing AI Performance: ¿hay páginas citadas? ¿cuáles?

### Día 90 — ¿hay efecto comercial?

- Clics y posición media por URL.
- Sesiones orgánicas al blog y navegación del blog a `/contact-us/*`.
- **Envíos de formulario cuyo origen es un artículo**: es la métrica que importa, y la
  que conecta este trabajo con el negocio.
- Revisión de los dos pares de posible canibalización (`09`, sección E2) **con datos
  reales**: si dos artículos se reparten las mismas consultas, entonces y solo entonces
  se decide.

---

## Observación de búsqueda generativa

Si se quiere registrar, el formato es este, y se registra **lo observado**:

| Plataforma | Consulta | Fecha | Locale | URL citada | ¿Menciona la marca? | Observación |
|---|---|---|---|---|---|---|

Tres reglas:

1. Se registra lo que se vio, con su fecha. Una citación observada **no garantiza** que
   vuelva a aparecer: estas respuestas no son deterministas.
2. No existe una «posición en IA». No se inventa esa métrica.
3. No se extrapola de una observación a «estamos en AI Overviews».

---

## Qué NO podrá atribuirse a este trabajo

Conviene dejarlo escrito ahora, no cuando lleguen los números:

- **La migración entera.** El dominio pasa de un Webflow a este sitio. Ese cambio mueve
  el tráfico por su cuenta, y mucho más que las imágenes del blog.
- **Los 37 redirects 301** del mapa de dominio, que cambian qué URL recibe qué.
- **Estacionalidad.** Florida, exteriores, temporada de huracanes: la demanda se mueve
  sola.
- **Lo que haga la competencia**, y lo que haga Google con sus propios resultados.

Lo que **sí** es atribuible, y es lo único que conviene defender como tal:

- Los 42 CTA que antes no llevaban a ninguna parte y ahora llevan: cualquier clic desde
  un artículo a `/contact-us/*` es un camino que **antes no existía**.
- Los 69 enlaces internos: el blog deja de ser 21 páginas aisladas.
- Las 40 imágenes reales: no se mide en clics, se mide en que la página deja de
  contradecir su propia afirmación de ser un contratista con licencia.

---

## Lo que hay que mirar aunque nadie lo pida

Una comprobación barata, en cada revisión:

```bash
npm run check
```

Y en concreto, el aviso de `check:imagenes` sobre imágenes huérfanas. Si las 93
imágenes de IA que quedaron sin uso siguen ahí dentro de 90 días, es que nadie tomó la
decisión de `10-validaciones.md` §4.
