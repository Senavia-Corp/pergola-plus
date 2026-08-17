# Borrador de política de privacidad — PARA REVISIÓN DEL CLIENTE

**Este documento NO está publicado.** Vive aquí a propósito.

## Por qué existe

`/articles/privacy-policy` llega vacía, y no es cosa de la migración: también está
vacía en producción. Cero palabras de cuerpo, frente a las 4.554 de
`terms-of-service`. Y el export del CMS lo enrarece más — el ítem «Privacy Policy» sí
tiene ~19.400 caracteres, pero empiezan por `<h1>Terms &amp; Conditions</h1>` y son
**el mismo contrato de obra** que el otro ítem.

Es decir: no hay política de privacidad en ninguna parte, y esa página está enlazada
desde el pie de las 113 páginas y desde el texto de consentimiento de los dos
formularios — justo donde se recogen datos personales.

## Por qué es un borrador y no está publicado

Una política de privacidad es un compromiso jurídico con el visitante y con el
regulador. El texto de abajo describe **solo lo que el sitio hace de verdad**, y eso
se puede verificar leyendo el código. Pero hay cinco cosas que dependen de cómo
trabaja la empresa y que **nadie puede contestar desde el código**. Están marcadas
`[PENDIENTE]`.

Publicar un texto plausible con esos huecos rellenados a ojo sería peor que la página
en blanco: sería afirmar por escrito cosas que quizá no son ciertas.

**Qué hacer con esto:** revisar los cinco `[PENDIENTE]`, contrastar con un abogado si
procede, y pegar el resultado en el campo `Content` del ítem «Privacy Policy» del CMS.
Al hacerlo hay que quitar la regla provisional de `scripts/lib/transformar.mjs` — el
propio código lanza un error avisando cuando detecta que el campo ya está relleno, así
que no se puede olvidar.

---

## Lo que el sitio hace, verificado en el código

Esto no es una suposición. Sale de `src/pages/api/lead.ts`, `src/lib/lead.ts` y del
HTML construido.

### Datos que se recogen

| Formulario | Campos |
|---|---|
| Presupuesto (`/contact-us/get-a-quote`) | Tipo de estructura, presupuesto estimado, plazo, mejoras marcadas, **dirección, ciudad y código postal**, nombre completo, correo, teléfono, consentimiento SMS |
| Contacto (`/contact-us/get-in-touch`) | Nombre, apellidos, correo, teléfono, tipo de proyecto, perfil (propietario, contratista…), mensaje, consentimiento SMS |
| Suscripción del pie (las 113 páginas) | Correo |

A cada envío el servidor añade: la página desde la que se envió, el idioma, la fecha y
hora, y si la verificación antibot pasó.

### Dónde van

1. Al registro (log) de la función en Vercel.
2. A un archivo local, solo en desarrollo.
3. A una URL de CRM, **si** se configura `LEAD_WEBHOOK_URL`. Hoy no lo está.

No se envía correo transaccional todavía: quedó fuera de alcance.

### Terceros que reciben algo

Solo dos, y están medidos sobre el HTML final:

- **OnceHub** (`cdn.oncehub.com`), únicamente en `/contact-us/schedule-a-visit`, para
  el calendario de citas. Se carga **diferido**, solo cuando el visitante se acerca al
  calendario, así que quien no baje hasta ahí no contacta con OnceHub. Al reservar,
  los datos de la cita los trata OnceHub.
- **La CDN de Webflow** (`d3e54v103j8qbb.cloudfront.net`), que sirve jQuery. No recibe
  datos del formulario; como cualquier CDN, ve la dirección IP al descargar el archivo.
- **Cloudflare Turnstile**, en cuanto se active: verifica que quien envía el
  formulario no es un bot. Hoy el secreto no está configurado.

**No hay analítica instalada.** Ni Google Analytics, ni Tag Manager, ni píxel de
Meta: comprobado, 0 páginas de 113. Las fuentes están autoalojadas, así que tampoco
hay peticiones a Google.

---

## Texto propuesto

> ### Privacy Policy
>
> **Last updated: [PENDIENTE — fecha en que se publique]**
>
> Pergola Plus Corp. («Pergola Plus Florida», «we», «us») operates
> pergolaplusflorida.com. This policy explains what personal information we collect
> through this website, why, and what you can do about it.
>
> #### What we collect
>
> We only collect what you type into one of our forms.
>
> - **Request a quote:** your name, email, phone number, and the street address, city
>   and ZIP code of the property, plus the details of the project you describe
>   (structure type, budget range, timeline and any enhancements you select).
> - **Contact us:** your name, email, phone number, the type of project, the role you
>   select, and your message.
> - **Newsletter:** your email address.
>
> Our server also records the page you submitted from, the language of that page, and
> the date and time.
>
> We do not use analytics, advertising pixels or tracking cookies on this site.
>
> #### Why we use it
>
> To answer you, prepare a proposal, schedule a site visit, and carry out the work if
> you hire us. If you tick the SMS box, we also use your phone number to send you
> project updates, scheduling messages and promotional information. You can stop those
> at any time by replying STOP.
>
> #### Who else sees it
>
> - **OnceHub**, only if you book a consultation on our scheduling page, handles your
>   booking details.
> - **Cloudflare** checks that form submissions are not automated.
> - [PENDIENTE — el CRM, la herramienta de correo o cualquier otro servicio al que
>   lleguen los leads, en cuanto se configure. Si no hay ninguno, decirlo.]
>
> **We do not sell your personal information, and we do not share it for advertising.**
> [PENDIENTE — confirmar que esto es cierto. Es una afirmación con consecuencias
> legales.]
>
> #### How long we keep it
>
> [PENDIENTE — cuánto tiempo se conservan los leads y los proyectos. Una respuesta
> habitual en construcción es: los presupuestos no convertidos, X años; los proyectos
> ejecutados, lo que exija la normativa de contratación y garantías de Florida.]
>
> #### Your choices
>
> Write to info@pergolaplusflorida.com or call (561) 710-8363 and we will tell you
> what we hold about you, correct it, or delete it.
>
> [PENDIENTE — si el negocio alcanza los umbrales de alguna ley estatal de privacidad
> (Florida Digital Bill of Rights, o CCPA si se atiende a residentes de California),
> aquí van los derechos concretos y el plazo de respuesta. Es una pregunta para un
> abogado, no para el código.]
>
> #### Children
>
> This site is not directed to children under 13 and we do not knowingly collect their
> information.
>
> #### Changes
>
> If we change this policy we will update the date at the top.
>
> #### Contact
>
> Pergola Plus Corp.
> 980 N Federal Hwy, Boca Raton, FL 33432
> info@pergolaplusflorida.com · (561) 710-8363

---

## Los cinco [PENDIENTE], juntos

1. Fecha de publicación.
2. El CRM o servicio de correo al que lleguen los leads, cuando se configure.
3. Confirmar por escrito que no se venden ni se comparten datos con fines publicitarios.
4. Cuánto tiempo se conservan los datos.
5. Qué leyes estatales de privacidad aplican y qué derechos concretos hay que listar.

Los cuatro primeros los contesta el cliente. El quinto es para un abogado.
