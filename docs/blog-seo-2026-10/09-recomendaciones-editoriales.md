# Recomendaciones editoriales — pendientes de aprobación

Nada de este documento está aplicado. El encargo autoriza automáticamente las
correcciones técnicas y de formato; lo que pida **redacción nueva o una afirmación
nueva** se documenta y se decide. El texto de los 21 artículos sigue siendo el del
cliente, palabra por palabra.

---

## A. Correcciones factuales críticas

**Ninguna detectada.** No se ha encontrado en los 21 artículos una afirmación
demostrablemente falsa. Lo que hay es lo de la sección B: afirmaciones plausibles y
probablemente correctas que **no llevan fuente**.

---

## B. Afirmaciones que necesitan respaldo antes de poder defenderse

Estas aparecen en varios artículos y son del tipo que, en Florida y para un contratista
con licencia, conviene poder sostener por escrito. **No se ha tocado ninguna cifra.**

| # | Afirmación | Dónde | Qué habría que comprobar | Prioridad |
|---|---|---|---|---|
| B1 | «170–175+ mph wind loads» | 7 artículos | Qué exige el FBC vigente para la zona de cada condado, y qué dice la documentación del fabricante para cada producto | **Alta** |
| B2 | «Structural integrity meets HVHZ standards» | hurricane-resistant | HVHZ es Miami-Dade y Broward. ¿Aplica a los productos que se instalan en Palm Beach? La frase tal cual puede leerse como que todo producto cumple HVHZ | **Alta** |
| B3 | «$85 – $150+ per square foot installed» y las horquillas por tipo | 2 artículos | Que siguen siendo las vigentes en 2026. Un precio desactualizado en una página de costes es la afirmación que más caro sale | **Alta** |
| B4 | Plazos de permiso «2–6 weeks» por municipio | 3 artículos | Los plazos reales varían mucho por municipio y por temporada | Media |
| B5 | «Miami-Dade product approvals (in many cases)» | building-codes | Qué productos tienen NOA y cuáles no | Media |
| B6 | Profundidades de zapata y «$3,000 – $10,000+» | 2 artículos | Depende del cálculo de cada obra; conviene marcarlo como orientativo | Media |
| B7 | «Increased Property Value» como beneficio | is-a-louvered-roof, luxury-ideas | No hay fuente. O se respalda con un estudio citable o se reformula como beneficio cualitativo | Media |

**Propuesta:** no reescribir los artículos. Añadir **una línea de contexto** al pie de
los de normativa y precio, del tipo *«Rangos orientativos a <fecha>. El cálculo
estructural y el permiso se determinan por obra.»* Es poco texto, es verdad, y cambia
mucho la defendibilidad. Necesita el visto bueno del cliente porque es texto nuevo.

---

## C. Mejoras de respuesta (AEO) que piden texto nuevo

| # | Qué | Dónde | Por qué |
|---|---|---|---|
| C1 | El artículo de códigos nombra 8 ciudades en dos listas sueltas, sin decir qué cambia en cada una | pergola-building-codes | Hoy la lista no responde «¿y en mi ciudad?». Una frase por ciudad lo convertiría en la respuesta real. Las 8 ya tienen página propia y 5 están enlazadas |
| C2 | «¿Cuánto sube el valor de mi casa?» se afirma de pasada y no se responde | 2 artículos | Ver B7 |
| C3 | El artículo de garantías no existe en el blog, aunque hay `/resources/warranties` | — | Un enlace desde los artículos de materiales y huracán cubriría la consulta sin crear artículo nuevo. **No se ha hecho**: ninguno de los dos nombra la garantía en un nodo de texto propio que se pueda enlazar sin añadir prosa |

---

## D. Enlaces internos que hoy no se pueden poner

De los 21 artículos, **11 llevan 3 enlaces y 2 llevan solo 2**, por debajo de la
horquilla de 3–5 del encargo. No es por falta de destinos relevantes: es porque
enlazar exige un **nodo de texto completo** (ver `01-arquitectura.md`), y esos
artículos no nombran más destinos en un nodo propio.

Dos caminos, los dos con texto nuevo y por tanto pendientes:

1. **Mínimo:** convertir alguna mención suelta en elemento de lista. Cambia el formato,
   no el contenido.
2. **Mejor:** la frase por ciudad de C1, que de paso da anclaje natural a las 8
   ciudades.

| Artículo | Enlaces hoy | Destinos relevantes sin anclaje disponible |
|---|---|---|
| aluminum-vs-wood-pergolas-humid-climate | 2 | `/products/solid-roof-pergolas`, `/resources/warranties` |
| building-custom-pergola-south-florida | 3 | `/post/pergola-permit-south-florida`, `/post/hoa-rules-pergolas-south-florida` |
| hurricane-resistant-pergolas-south-florida | 3 | `/products/motorized-louvered-pergolas`, `/resources/warranties` |
| how-long-pergola-installation-florida | 4 | `/services/pergola-design-construction` |

---

## E. Opcionales

| # | Qué | Nota |
|---|---|---|
| E1 | 46 `<title>` y 3 meta description fuera de la horquilla orientativa | **Recomendación: dejarlos.** Son copy del cliente y describen bien su artículo. El encargo dice expresamente que no se recorten solo para cumplir una cifra, y Google reescribe títulos por su cuenta igualmente |
| E2 | `plan-pergola-south-florida-backyard` y `building-custom-pergola-south-florida` se solapan en intención | **No es canibalización confirmada**: uno planifica y otro construye. Requiere datos de Search Console para decidir. No fusionar, no redirigir |
| E3 | Las 148 fotos de `public/photos/` | Enseñan cosas que el sitio no tiene hoy (lamas abiertas en detalle, cortinas motorizadas en funcionamiento, pérgolas de **madera** real, cerramientos de mosquitera). Varias podrían ser fichas de proyecto nuevas. Necesitan que el cliente diga obra y ciudad |

---

## Canibalización — clasificación completa

Evaluada por intención, no por palabras compartidas.

| Clasificación | Pares |
|---|---|
| **SIN CONFLICTO** | 17 de los 21 artículos: intenciones distintas y claras |
| **SOLAPAMIENTO POSIBLE** | `plan-pergola-…` ↔ `building-custom-…` (planificar vs construir) · `pergola-cost-south-florida` ↔ `aluminum-pergola-cost-boca-raton-vs-fort-lauderdale` (general vs comparativa por ciudad) |
| **SOLAPAMIENTO DE INTENCIÓN CONFIRMADO** | ninguno |
| **REQUIERE MÁS DATOS** | los dos pares de arriba, con Search Console |

**No se ha fusionado ni eliminado ningún artículo, ni creado ningún redirect.** El
encargo lo prohíbe y, sin datos de rendimiento, sería una decisión a ciegas.
