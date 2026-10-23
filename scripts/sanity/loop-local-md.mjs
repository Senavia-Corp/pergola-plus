// Fuente del contenido local (F5, C5). Genera docs/seo-loop/propuestas/F5-local.json.
// Fuentes: docs/seo-loop/evidencia/fuentes-oficiales-2026-10-23.json (verificadas el 23-oct-2026).
//     node scripts/sanity/loop-local-md.mjs docs/seo-loop/propuestas/F5-local.json
import fs from 'node:fs';

const NOA = 'https://www.miamidade.gov/global/economy/board-and-code/product-approval.page';
const NOA_BUSCAR = 'https://www.miamidade.gov/building/pc-search_app.asp';
const BORA = 'https://www.broward.org/codeappeals';
const BROWARD = 'https://www.broward.org/Building';
const PBC = 'https://discover.pbc.gov/pzb/building/Pages/Permit-Center.aspx';
const FPA = 'https://www.floridabuilding.org/pr/pr_app_srch.aspx';
const MD_PERMISO = 'https://www.miamidade.gov/global/economy/building/how-to-apply-for-permit.page';

const T = {};

// ---------------------------------------------------------------- Miami-Dade
T['city-aventura-pergola-builders'] = {
  en: `## Do you need a permit for a pergola in Aventura?

Yes. A pergola bolted to a slab or attached to a home is permanent construction, so the City of Aventura's Building Division must approve the plans first. Aventura is in Miami-Dade County, which puts every structure inside the High Velocity Hurricane Zone of the Florida Building Code.

Applications are filed through the city's [Community Development web portal](https://aven.csqrcloud.com/community-etrakit/), and the [Building Division](https://www.cityofaventura.com/169/Building-Permits) publishes what a complete package contains. One detail homeowners rarely expect: Aventura's own FAQ warns that other agencies may need to review the plans before the city issues anything, including Miami-Dade Fire Rescue, the county's Regulatory and Economic Resources department, the Department of Health, the Water and Sewer Department and North Miami Beach Public Services. On a residential pergola that mostly means allowing extra lead time.

Much of Aventura lives in condominium towers and townhome communities between the Intracoastal and Biscayne Bay, so association approval is usually a second track running in parallel with the city permit.

Every aluminum product used on a Miami-Dade job needs a [Notice of Acceptance from Miami-Dade Product Control](${NOA}). You can check any NOA number yourself in the county's [product approval search](${NOA_BUSCAR}) before signing a contract.`,
  es: `## ¿Hace falta permiso para instalar una pérgola en Aventura?

Sí. Una pérgola anclada a una losa o adosada a la casa es una construcción permanente, así que la Building Division de la Ciudad de Aventura tiene que aprobar los planos antes. Aventura está en el condado de Miami-Dade, dentro de la High Velocity Hurricane Zone del Florida Building Code.

La solicitud se presenta en el [portal web de Community Development](https://aven.csqrcloud.com/community-etrakit/), y la [Building Division](https://www.cityofaventura.com/169/Building-Permits) publica qué documentos lleva un expediente completo. Un detalle que pocos propietarios esperan: las preguntas frecuentes de la propia ciudad advierten que otras agencias pueden tener que revisar los planos antes de que Aventura emita el permiso, entre ellas Miami-Dade Fire Rescue, el departamento de Regulatory and Economic Resources del condado, el Department of Health, el Water and Sewer Department y North Miami Beach Public Services. En una pérgola residencial, eso se traduce sobre todo en más tiempo de espera.

Buena parte de Aventura vive en torres de condominio y comunidades de townhomes entre el Intracoastal y la bahía de Biscayne, así que la aprobación de la asociación suele correr en paralelo con el permiso de la ciudad.

Cada producto de aluminio en una obra de Miami-Dade necesita una [Notice of Acceptance de Miami-Dade Product Control](${NOA}). Cualquier número de NOA se puede comprobar en el [buscador de aprobaciones de producto](${NOA_BUSCAR}) del condado antes de firmar un contrato.`,
};

T['city-coral-gables'] = {
  en: `## What does Coral Gables require for a pergola permit?

Coral Gables lists trellises and pergolas as their own permit type. The city asks for structural details with engineering calculations, elevations of every visible side, color photos, a material and color sample, and preliminary architectural plans approved by the Board of Architects.

That last item is what sets the City Beautiful apart. Before the Building Division of [Development Services](https://www.coralgables.com/department/development-services) looks at the engineering, the design itself goes to the Board of Architects, which reviews how the structure looks from the street and from neighboring lots. The city's [permit requirements document](https://www.coralgables.com/sites/default/files/2025-04/04-04-2025-FINAL-IH----PERMIT-REQUIREMENTS-FOR-DS-CH.pdf) also notes that anything encroaching on the public right-of-way needs a restrictive covenant.

Submissions and inspections run through the [Building Permits Self-Service Portal](https://coralgablesfl-energovpub.tylerhost.net/Apps/SelfService#/home). Because Coral Gables is in Miami-Dade, the wind design follows High Velocity Hurricane Zone rules and the aluminum system must carry a current [Miami-Dade Notice of Acceptance](${NOA}).

In practice, a Coral Gables pergola is designed twice: once for the architects, who care about proportion, color and materials, and once for the engineers, who care about uplift and anchoring. Planning both from the first sketch avoids redrawing the project halfway through review.`,
  es: `## ¿Qué pide Coral Gables para el permiso de una pérgola?

Coral Gables trata los enrejados (trellis) y las pérgolas como un tipo de permiso propio. La ciudad pide detalles estructurales con cálculos de ingeniería, elevaciones de cada lado visible, fotos a color, una muestra de material y color, y planos arquitectónicos preliminares aprobados por el Board of Architects.

Ese último requisito es lo que distingue a la City Beautiful. Antes de que la Building Division de [Development Services](https://www.coralgables.com/department/development-services) revise la ingeniería, el diseño pasa por el Board of Architects, que evalúa cómo se verá la estructura desde la calle y desde los lotes vecinos. El [documento de requisitos de permisos](https://www.coralgables.com/sites/default/files/2025-04/04-04-2025-FINAL-IH----PERMIT-REQUIREMENTS-FOR-DS-CH.pdf) de la ciudad añade que, si la obra invade el derecho de vía público, hace falta un restrictive covenant.

La solicitud y las inspecciones se tramitan en el [portal de autoservicio de permisos](https://coralgablesfl-energovpub.tylerhost.net/Apps/SelfService#/home). Como Coral Gables está en Miami-Dade, el cálculo de viento sigue las reglas de la High Velocity Hurricane Zone y el sistema de aluminio debe tener una [Notice of Acceptance de Miami-Dade](${NOA}) vigente.

En la práctica, una pérgola en Coral Gables se diseña dos veces: una para los arquitectos, que miran proporción, color y materiales, y otra para los ingenieros, que miran la succión del viento y el anclaje. Pensar en ambas desde el primer boceto evita rehacer planos a mitad de la revisión.`,
};

T['city-doral-pergola-builders'] = {
  en: `## Does a pergola in Doral need zoning approval?

Yes. Doral's Planning and Zoning Department lists patio and porch covers, trellises, gazebos, decks and summer kitchens among the residential projects that require zoning approval. That review comes on top of the building permit issued by the city's Building Department.

The department's guide, [When is zoning approval required](https://www.cityofdoral.com/files/assets/city/v/1/departments/planning-and-zoning/docs/when-is-zoning-approval-required.pdf), is worth reading before choosing a size and location, because setbacks and lot coverage are checked at that stage, not at the building inspection. Building plans then go to the [Doral Building Department](https://www.cityofdoral.com/Departments/Building-Department/About-Building-Department) through its [online permitting portal](https://doralfl-energovweb.tylerhost.net/apps/SelfService).

Doral is an inland city west of the airport, so it has no coastal construction line, but it is still in Miami-Dade and therefore inside the High Velocity Hurricane Zone. That means the same wind-load engineering and the same [Miami-Dade product approval](${NOA}) that apply on the beach also apply to a backyard in Doral Isles or Downtown Doral.

Many Doral homes also sit in planned communities with their own architectural guidelines, so the association's written approval is usually the first document to collect.`,
  es: `## ¿Una pérgola en Doral necesita aprobación de zoning?

Sí. El departamento de Planning and Zoning de Doral incluye los techos de patio y de porche, los enrejados, los gazebos, los decks y las cocinas de verano entre las obras residenciales que requieren aprobación de zoning. Esa revisión se suma al permiso de construcción que emite el Building Department de la ciudad.

Conviene leer la guía del departamento, [When is zoning approval required](https://www.cityofdoral.com/files/assets/city/v/1/departments/planning-and-zoning/docs/when-is-zoning-approval-required.pdf), antes de decidir tamaño y ubicación, porque los retiros y la ocupación del lote se comprueban en esa etapa y no en la inspección de obra. Después, los planos van al [Building Department de Doral](https://www.cityofdoral.com/Departments/Building-Department/About-Building-Department) a través de su [portal de permisos en línea](https://doralfl-energovweb.tylerhost.net/apps/SelfService).

Doral es una ciudad del interior, al oeste del aeropuerto, sin línea de construcción costera, pero sigue en Miami-Dade y por tanto dentro de la High Velocity Hurricane Zone. La misma ingeniería de cargas de viento y la misma [aprobación de producto de Miami-Dade](${NOA}) que se exigen frente a la playa se exigen en un patio de Doral Isles o de Downtown Doral.

Muchas casas de Doral están además en comunidades planificadas con sus propias normas de arquitectura, así que la aprobación por escrito de la asociación suele ser el primer documento que hay que conseguir.`,
};

T['city-key-biscayne-pergola-builders'] = {
  en: `## Who approves a pergola on Key Biscayne?

The Village of Key Biscayne's Building, Zoning and Planning Department reviews both the zoning and the construction side of a pergola. Applications are filed online through the village's Citizen Self Service Center, and the structure must meet Miami-Dade's High Velocity Hurricane Zone requirements.

The [Building, Zoning and Planning Department](https://keybiscayne.fl.gov/services/building_zoning_and_planning/index.php) keeps the forms and the zoning code in one place, and permits are tracked in the [Citizen Self Service Center](https://aca-prod.accela.com/keybiscayne/Default.aspx). The village has been reviewing its accessory-structure rules through a Zoning Ordinance Review Committee, so the safe move is to ask BZP for the current text on height, setbacks and materials before a design is finalized rather than relying on an older summary.

Key Biscayne is a barrier island: salt spray, sandy soils and direct exposure to the open Atlantic shape every decision, from the alloy and the powder coat to the depth of the footings. Aluminum hardware and fasteners have to be specified for a marine environment, and the whole system needs a current [Miami-Dade Notice of Acceptance](${NOA}).

Lots on the island are compact, so a pergola often has to share space with a pool, a deck and the required rear setback. Measuring the survey carefully at the start saves a round of corrections later.`,
  es: `## ¿Quién aprueba una pérgola en Key Biscayne?

El Building, Zoning and Planning Department del Village of Key Biscayne revisa tanto el zoning como la parte constructiva de una pérgola. La solicitud se presenta en línea en el Citizen Self Service Center del village, y la estructura debe cumplir los requisitos de la High Velocity Hurricane Zone de Miami-Dade.

El [Building, Zoning and Planning Department](https://keybiscayne.fl.gov/services/building_zoning_and_planning/index.php) reúne los formularios y el código de zoning, y los permisos se siguen en el [Citizen Self Service Center](https://aca-prod.accela.com/keybiscayne/Default.aspx). El village ha estado revisando sus normas de estructuras accesorias en un Zoning Ordinance Review Committee, así que lo prudente es pedir a BZP el texto vigente sobre altura, retiros y materiales antes de cerrar el diseño, en lugar de fiarse de un resumen antiguo.

Key Biscayne es una isla barrera: el salitre, los suelos arenosos y la exposición directa al Atlántico condicionan cada decisión, desde la aleación y la pintura en polvo hasta la profundidad de las zapatas. Los herrajes y la tornillería tienen que ser aptos para ambiente marino, y el sistema completo necesita una [Notice of Acceptance de Miami-Dade](${NOA}) vigente.

Los lotes de la isla son compactos, y la pérgola suele compartir espacio con la piscina, el deck y el retiro trasero obligatorio. Medir bien el survey desde el principio ahorra una ronda de correcciones.`,
};

T['city-miami-beach-pergola-design'] = {
  en: `## Does a pergola in a Miami Beach historic district need extra approval?

Yes. In a historic district or on a designated site, new construction needs a Certificate of Appropriateness from the Historic Preservation Board or from Planning staff. Some minor work, such as awnings and canopies, can be approved at staff level; the building permit comes after.

The [Planning Department's FAQ](https://www.miamibeachfl.gov/city-hall/planning/planning-faqs/) explains which projects stay at staff level and which go to a board. If a pergola needs a setback variance, it is heard by the Board of Adjustment, the Design Review Board or the Historic Preservation Board, depending on the property. Large parts of South Beach and North Beach fall inside local historic districts, so it is worth checking the address before drawing anything.

Once design approval is in hand, plans go to the [Miami Beach Building Department](https://www.miamibeachfl.gov/city-hall/building/) through the [Citizen's Self Service portal](https://eservices.miamibeachfl.gov/energovprod/selfservice#/home). The structure is engineered for the High Velocity Hurricane Zone and the aluminum system needs a current [Miami-Dade Notice of Acceptance](${NOA}).

On a barrier island with rising tides and salt air, the details that matter most are corrosion-resistant fasteners, drainage that does not dump onto a neighbor's lot, and footings sized for sandy fill.`,
  es: `## ¿Una pérgola en un distrito histórico de Miami Beach necesita una aprobación adicional?

Sí. En un distrito histórico o en un sitio designado, la obra nueva necesita un Certificate of Appropriateness del Historic Preservation Board o del personal de Planning. Algunas obras menores, como toldos y marquesinas, se aprueban a nivel de staff; el permiso de construcción viene después.

Las [preguntas frecuentes del departamento de Planning](https://www.miamibeachfl.gov/city-hall/planning/planning-faqs/) explican qué proyectos se quedan en staff y cuáles pasan a una junta. Si la pérgola necesita una variance de retiros, la revisa el Board of Adjustment, el Design Review Board o el Historic Preservation Board, según la propiedad. Buena parte de South Beach y North Beach está dentro de distritos históricos locales, así que conviene comprobar la dirección antes de dibujar nada.

Con la aprobación de diseño, los planos van al [Building Department de Miami Beach](https://www.miamibeachfl.gov/city-hall/building/) a través del [portal Citizen's Self Service](https://eservices.miamibeachfl.gov/energovprod/selfservice#/home). La estructura se calcula para la High Velocity Hurricane Zone y el sistema de aluminio necesita una [Notice of Acceptance de Miami-Dade](${NOA}) vigente.

En una isla barrera con mareas altas y aire salino, lo que más importa son la tornillería resistente a la corrosión, un desagüe que no descargue en el lote del vecino y unas zapatas dimensionadas para relleno arenoso.`,
};

T['city-miami-pergola-experts'] = {
  en: `## How do you apply for a pergola permit in the City of Miami?

Online, through iBuild, the City of Miami's permitting portal. The Building Department reviews the structural plans, and properties that are historically designated also need a Certificate of Appropriateness. Unincorporated addresses outside city limits are permitted by Miami-Dade County instead.

Start by confirming who has jurisdiction: an address with a Miami mailing label is not always inside the City of Miami. City properties apply through [iBuild](https://apps.miamigov.com/iBuildPortal/Account/LogOn?ReturnUrl=/iBuildPortal), described on the city's [building permits page](https://www.miami.gov/Permits-Construction/Apply-for-or-Manage-Building-Permits-iBuild); unincorporated ones follow [Miami-Dade's permit process](${MD_PERMISO}).

For homes in historic neighborhoods such as Coconut Grove, Morningside or Buena Vista, the city explains that any work on a designated property needs a [Certificate of Appropriateness](https://www.miami.gov/Permits-Construction/Historically-Designated-Properties/Repair-or-Renovate-a-Historic-Property), and that new construction or larger alterations usually need a Special COA reviewed by the Historic and Environmental Preservation Board.

Wherever the lot is, Miami is inside the High Velocity Hurricane Zone. The engineering has to show uplift resistance and anchoring for that zone, and each aluminum product needs a current [Miami-Dade Notice of Acceptance](${NOA}).`,
  es: `## ¿Cómo se solicita el permiso de una pérgola en la Ciudad de Miami?

En línea, por iBuild, el portal de permisos de la Ciudad de Miami. El Building Department revisa los planos estructurales, y las propiedades con designación histórica necesitan además un Certificate of Appropriateness. Las direcciones no incorporadas, fuera de los límites de la ciudad, las tramita el condado de Miami-Dade.

Lo primero es confirmar la jurisdicción: una dirección con código postal de Miami no siempre está dentro de la Ciudad de Miami. Las propiedades de la ciudad se tramitan en [iBuild](https://apps.miamigov.com/iBuildPortal/Account/LogOn?ReturnUrl=/iBuildPortal), descrito en la [página de permisos de construcción](https://www.miami.gov/Permits-Construction/Apply-for-or-Manage-Building-Permits-iBuild); las no incorporadas siguen el [proceso de permisos de Miami-Dade](${MD_PERMISO}).

Para las casas de barrios históricos como Coconut Grove, Morningside o Buena Vista, la ciudad explica que cualquier obra en una propiedad designada necesita un [Certificate of Appropriateness](https://www.miami.gov/Permits-Construction/Historically-Designated-Properties/Repair-or-Renovate-a-Historic-Property), y que la obra nueva o las alteraciones mayores suelen requerir un Special COA que revisa el Historic and Environmental Preservation Board.

Esté donde esté el lote, Miami está dentro de la High Velocity Hurricane Zone. La ingeniería tiene que demostrar resistencia a la succión y un anclaje adecuado para esa zona, y cada producto de aluminio necesita una [Notice of Acceptance de Miami-Dade](${NOA}) vigente.`,
};

T['city-sunny-isles-beach-pergola-builders'] = {
  en: `## Which agencies review a pergola permit in Sunny Isles Beach?

The Sunny Isles Beach Building Department checks each application against the city's zoning code, the Florida Building Code and other agencies' requirements. For new construction and additions, plans must also be approved by Miami-Dade's Water and Sewer Department (WASD) and environmental regulators (DERM).

The [Building Permits page](https://www.sibfl.gov/Building-Code/Building-Department/Building-Permits) of the [Building Department](https://www.sibfl.gov/Building-Code/Building-Department) explains that review chain, and applications are submitted through the city's [online permit portal](https://ci-sunnyislesbeach-fl.smartgovcommunity.com/ApplicationPublic/ApplicationHome). Whether a given pergola triggers the county reviews depends on its scope, so it is something to confirm with the city at the start rather than discover at the end.

Sunny Isles Beach is a narrow strip between the ocean and the Intracoastal, built mostly with high-rise condominiums and a smaller number of single-family streets in the Golden Shores area. On condominium property the association, and often its engineer, must approve anything fixed to a pool deck or terrace before the city sees it.

Being in Miami-Dade, every structure here is designed for the High Velocity Hurricane Zone, with aluminum systems that carry a current [Miami-Dade Notice of Acceptance](${NOA}) and hardware rated for constant salt exposure.`,
  es: `## ¿Qué agencias revisan el permiso de una pérgola en Sunny Isles Beach?

El Building Department de Sunny Isles Beach compara cada solicitud con el código de zoning de la ciudad, el Florida Building Code y los requisitos de otras agencias. En obra nueva y ampliaciones, los planos deben aprobarlos además el Water and Sewer Department (WASD) y el área ambiental (DERM) de Miami-Dade.

La [página de permisos](https://www.sibfl.gov/Building-Code/Building-Department/Building-Permits) del [Building Department](https://www.sibfl.gov/Building-Code/Building-Department) explica esa cadena de revisiones, y las solicitudes se presentan en el [portal de permisos en línea](https://ci-sunnyislesbeach-fl.smartgovcommunity.com/ApplicationPublic/ApplicationHome) de la ciudad. Si una pérgola concreta activa o no las revisiones del condado depende de su alcance, y es algo que conviene confirmar con la ciudad al principio y no descubrir al final.

Sunny Isles Beach es una franja estrecha entre el océano y el Intracoastal, con mayoría de condominios en altura y algunas calles de casas unifamiliares en la zona de Golden Shores. En un condominio, la asociación —y a menudo su ingeniero— tiene que aprobar cualquier cosa fijada a una terraza o a la cubierta de la piscina antes de que la vea la ciudad.

Al estar en Miami-Dade, cada estructura se calcula para la High Velocity Hurricane Zone, con sistemas de aluminio que tienen una [Notice of Acceptance de Miami-Dade](${NOA}) vigente y herrajes preparados para el salitre constante.`,
};

// ---------------------------------------------------------------- Broward
T['city-cooper-city-pergola-installation'] = {
  en: `## Is Cooper City in the High Velocity Hurricane Zone?

Yes. The Florida Building Code defines the High Velocity Hurricane Zone as Broward and Miami-Dade counties, so a pergola in Cooper City is engineered to the same wind standard as one on the coast. Permits are issued by the city's Building Division, which accepts electronic submittals.

The [Cooper City Building Division](https://www.coopercity.gov/page/building-division/) is part of Community Development, and its [electronic building permit submittal](https://www.coopercity.gov/page/electronic-building-permit-submittal/) page explains how to upload plans instead of carrying paper sets to City Hall.

Being twenty minutes inland does not lower the bar. In the HVHZ, plans for a permanent pergola are signed and sealed by a Florida-licensed engineer, and the aluminum system needs either a Florida product approval or a Miami-Dade Notice of Acceptance. Across Broward, questions about how the code is applied are settled by the county's [Board of Rules and Appeals](${BORA}), which issues formal interpretations that every Broward building official follows.

Cooper City is mostly single-family neighborhoods, many of them with homeowners associations such as those in Embassy Lakes or Monterra. Getting the association's written approval before the permit application keeps the two reviews from contradicting each other on color or placement.`,
  es: `## ¿Cooper City está en la High Velocity Hurricane Zone?

Sí. El Florida Building Code define la High Velocity Hurricane Zone como los condados de Broward y Miami-Dade, así que una pérgola en Cooper City se calcula con el mismo estándar de viento que una en la costa. Los permisos los emite la Building Division de la ciudad, que acepta solicitudes electrónicas.

La [Building Division de Cooper City](https://www.coopercity.gov/page/building-division/) forma parte de Community Development, y su página de [solicitud electrónica de permisos](https://www.coopercity.gov/page/electronic-building-permit-submittal/) explica cómo subir los planos en lugar de llevar juegos impresos a City Hall.

Estar a veinte minutos de la playa no rebaja la exigencia. En la HVHZ, los planos de una pérgola permanente los firma y sella un ingeniero con licencia de Florida, y el sistema de aluminio necesita una aprobación de producto de Florida o una Notice of Acceptance de Miami-Dade. En todo Broward, las dudas sobre cómo se aplica el código las resuelve el [Board of Rules and Appeals](${BORA}) del condado, que emite interpretaciones formales que siguen todos los funcionarios de construcción de Broward.

Cooper City es sobre todo de barrios unifamiliares, muchos con asociación de propietarios, como los de Embassy Lakes o Monterra. Conseguir la aprobación por escrito de la asociación antes de pedir el permiso evita que las dos revisiones se contradigan en color o ubicación.`,
};

T['city-coral-springs-installation'] = {
  en: `## What does Coral Springs check before approving a pergola?

Lot coverage. The zoning addendum to the Coral Springs building permit application requires a lot coverage worksheet for any project that adds to the existing footprint, such as patios, decks, pools and screen enclosures. The Building Department reviews the structure itself.

That worksheet, part of the city's [building permit application zoning addendum](https://www.coralsprings.gov/files/assets/public/v/6/documents/building/building-forms/099.1-building-permit-application-zoning-addendum-ada.pdf), is where many backyard projects run into trouble: a lot that already has a pool, a paver deck and a screen enclosure may have little coverage left. Measuring what is already built before sizing a pergola avoids a redesign.

Permits are filed through the city's [online permitting system, eTrakit](https://www.coralsprings.gov/Government/Departments/Building/Online-Permitting-eTrakit), and the [Coral Springs Building Department](https://www.coralsprings.gov/building) handles plan review and inspections. As a Broward city, Coral Springs is inside the High Velocity Hurricane Zone, so plans are sealed by a Florida engineer and the aluminum carries a Florida or Miami-Dade product approval. Code interpretations across the county come from Broward's [Board of Rules and Appeals](${BORA}).

Coral Springs grew as a planned city, and neighborhoods such as Eagle Trace or Heron Bay have association guidelines of their own that sit on top of the city's rules.`,
  es: `## ¿Qué revisa Coral Springs antes de aprobar una pérgola?

La ocupación del lote. El anexo de zoning de la solicitud de permiso de Coral Springs exige una hoja de cálculo de lot coverage en todo proyecto que amplíe la huella construida, como patios, decks, piscinas y screen enclosures. El Building Department revisa la estructura en sí.

Esa hoja, parte del [anexo de zoning de la solicitud de permiso](https://www.coralsprings.gov/files/assets/public/v/6/documents/building/building-forms/099.1-building-permit-application-zoning-addendum-ada.pdf), es donde se atascan muchos proyectos de patio: un lote que ya tiene piscina, deck de pavers y screen enclosure puede quedarse con poco margen. Medir lo que ya está construido antes de dimensionar la pérgola evita rediseñarla.

Los permisos se presentan en el [sistema de permisos en línea, eTrakit](https://www.coralsprings.gov/Government/Departments/Building/Online-Permitting-eTrakit), y el [Building Department de Coral Springs](https://www.coralsprings.gov/building) se encarga de la revisión de planos y de las inspecciones. Como ciudad de Broward, Coral Springs está dentro de la High Velocity Hurricane Zone: los planos van sellados por un ingeniero de Florida y el aluminio tiene aprobación de producto de Florida o de Miami-Dade. Las interpretaciones del código en todo el condado las da el [Board of Rules and Appeals](${BORA}) de Broward.

Coral Springs nació como ciudad planificada, y barrios como Eagle Trace o Heron Bay tienen sus propias normas de asociación, que se suman a las de la ciudad.`,
};

T['city-davie-installation'] = {
  en: `## What paperwork does the Town of Davie want for an outdoor structure?

Davie's Building Division says that because the town is in the High Velocity Hurricane Zone, even a shed needs plans signed and sealed by a Florida engineer, plus a State of Florida product approval or a Miami-Dade Notice of Acceptance. A permanent pergola is held to that same standard.

That answer comes from the [Building Division's own FAQ](https://www.davie-fl.gov/Faq.aspx?QID=266), and it is a good summary of what an aluminum pergola permit looks like here. The [Town of Davie Building Division](https://www.davie-fl.gov/206/Building) receives applications through its [Online Application Submittal system](https://davie-fl-us.avolvecloud.com/), where plans, approvals and inspection results stay in one file.

Davie still has a rural streak: ranchettes in the western part of town, horse properties and large lots off Orange Drive sit next to newer subdivisions. Big lots make freestanding pergolas popular, and a freestanding frame relies entirely on its footings, so the engineering of the foundation matters as much as the roof.

Product approvals can be checked by anyone in the [Florida Building Commission's product approval search](${FPA}). Broward's [Board of Rules and Appeals](${BORA}) publishes the county-wide interpretations that Davie's building official applies.`,
  es: `## ¿Qué documentos pide el Town of Davie para una estructura exterior?

La Building Division de Davie explica que, por estar el pueblo en la High Velocity Hurricane Zone, hasta un shed necesita planos firmados y sellados por un ingeniero de Florida y una aprobación de producto del Estado o una Notice of Acceptance de Miami-Dade. A una pérgola permanente se le exige lo mismo.

Esa respuesta sale de las [preguntas frecuentes de la propia Building Division](https://www.davie-fl.gov/Faq.aspx?QID=266) y resume bien cómo es el permiso de una pérgola de aluminio aquí. La [Building Division del Town of Davie](https://www.davie-fl.gov/206/Building) recibe las solicitudes en su [sistema de solicitud en línea](https://davie-fl-us.avolvecloud.com/), donde planos, aprobaciones y resultados de inspección quedan en un mismo expediente.

Davie conserva un aire rural: ranchettes en el oeste del pueblo, propiedades con caballos y lotes grandes junto a Orange Drive conviven con urbanizaciones más nuevas. En lotes grandes son habituales las pérgolas independientes, y una estructura independiente depende por completo de sus zapatas, así que la ingeniería de la cimentación importa tanto como el techo.

Cualquiera puede comprobar una aprobación de producto en el [buscador de la Florida Building Commission](${FPA}). El [Board of Rules and Appeals](${BORA}) de Broward publica las interpretaciones de alcance condal que aplica el funcionario de construcción de Davie.`,
};

T['city-fort-lauderdale-installation'] = {
  en: `## Where do you file a pergola permit in Fort Lauderdale?

In LauderBuild, the City of Fort Lauderdale's online citizen portal. The Building Services Division reviews the plans. If the home is a designated historic property, a Certificate of Appropriateness comes first, and only then does the application move on to the building review.

The [Development Services permitting page](https://www.fortlauderdale.gov/Government/Departments/Development-Services/Permitting-Services) links to [LauderBuild](https://aca3.accela.com/FTL), where applications, plan comments and inspections are tracked. For historic properties, the city's [Certificate of Appropriateness page](https://www.fortlauderdale.gov/Government/Departments/Development-Services/Urban-Design-and-Planning/Historic-Preservation/Certificate-of-Appropriateness) explains that Historic Preservation reviews any work that changes the exterior before Building does.

Fort Lauderdale has hundreds of miles of navigable canals, and a large share of its pergolas end up on waterfront patios in neighborhoods like Las Olas Isles, Rio Vista or the Harbor Beach area. Open water upwind means higher wind exposure in the engineering, and seawall setbacks and easements limit where posts can go.

Broward County is inside the High Velocity Hurricane Zone, so plans are signed and sealed and the aluminum system carries a Florida or Miami-Dade product approval. County-wide code interpretations come from Broward's [Board of Rules and Appeals](${BORA}).`,
  es: `## ¿Dónde se presenta el permiso de una pérgola en Fort Lauderdale?

En LauderBuild, el portal ciudadano en línea de la Ciudad de Fort Lauderdale. La Building Services Division revisa los planos. Si la casa es una propiedad histórica designada, primero va el Certificate of Appropriateness y solo después la solicitud pasa a la revisión de construcción.

La [página de permisos de Development Services](https://www.fortlauderdale.gov/Government/Departments/Development-Services/Permitting-Services) enlaza con [LauderBuild](https://aca3.accela.com/FTL), donde se siguen las solicitudes, los comentarios a los planos y las inspecciones. Para propiedades históricas, la [página del Certificate of Appropriateness](https://www.fortlauderdale.gov/Government/Departments/Development-Services/Urban-Design-and-Planning/Historic-Preservation/Certificate-of-Appropriateness) explica que Historic Preservation revisa cualquier obra que cambie el exterior antes que Building.

Fort Lauderdale tiene cientos de millas de canales navegables, y buena parte de sus pérgolas acaban en patios frente al agua en barrios como Las Olas Isles, Rio Vista o la zona de Harbor Beach. Con agua abierta a barlovento, la ingeniería considera una exposición al viento mayor, y los retiros y servidumbres del seawall limitan dónde pueden ir los postes.

El condado de Broward está dentro de la High Velocity Hurricane Zone: los planos van firmados y sellados, y el sistema de aluminio tiene aprobación de producto de Florida o de Miami-Dade. Las interpretaciones del código para todo el condado las da el [Board of Rules and Appeals](${BORA}) de Broward.`,
};

T['city-hollywood-pergola-installation'] = {
  en: `## Is a pergola exempt from permits in Hollywood under HB 803?

No. Since July 1, 2026, Hollywood exempts certain single-family work under $7,500 from permits, but the exemption excludes structural, electrical, plumbing, mechanical and gas work and any project in a flood hazard area. An anchored pergola is structural work, so it still needs a permit.

The city explains the new state law on its [HB 803 permit exemption page](https://www.hollywoodfl.org/1793/Building-Permit-Exemption-House-Bill-803). Pergola permits go to the [Hollywood Building Division](https://www.hollywoodfl.org/328/Building) through [Accela Citizen Access](https://aca-prod.accela.com/HOLLYWOOD/Default.aspx), where plans and inspection requests are filed online.

Hollywood stretches from the Broadwalk on the beach to the western neighborhoods past I-75, with the Intracoastal and many canal-front streets in between. East of US-1, flood zones and coastal exposure come up often in plan review; farther west, the questions are more about setbacks and association rules.

Because Broward is in the High Velocity Hurricane Zone, a Hollywood pergola is designed for that wind standard, with a Florida-licensed engineer's seal and an aluminum system that carries a Florida or Miami-Dade product approval. The county's [Board of Rules and Appeals](${BORA}) publishes the interpretations Broward building officials share.`,
  es: `## ¿Una pérgola en Hollywood queda exenta de permiso con la HB 803?

No. Desde el 1 de julio de 2026, Hollywood exime de permiso cierta obra en viviendas unifamiliares de menos de $7,500, pero la exención excluye la obra estructural, eléctrica, de plomería, mecánica y de gas, y cualquier proyecto en zona de riesgo de inundación. Una pérgola anclada es obra estructural y sigue necesitando permiso.

La ciudad explica la nueva ley estatal en su [página sobre la exención de la HB 803](https://www.hollywoodfl.org/1793/Building-Permit-Exemption-House-Bill-803). Los permisos de pérgola van a la [Building Division de Hollywood](https://www.hollywoodfl.org/328/Building) a través de [Accela Citizen Access](https://aca-prod.accela.com/HOLLYWOOD/Default.aspx), donde se presentan los planos y se piden las inspecciones en línea.

Hollywood va desde el Broadwalk, frente a la playa, hasta los barrios del oeste pasada la I-75, con el Intracoastal y muchas calles junto a canales en medio. Al este de la US-1, las zonas inundables y la exposición costera salen a menudo en la revisión de planos; más al oeste, las preguntas tienen más que ver con retiros y normas de asociación.

Como Broward está en la High Velocity Hurricane Zone, una pérgola en Hollywood se calcula para ese estándar de viento, con el sello de un ingeniero con licencia de Florida y un sistema de aluminio con aprobación de producto de Florida o de Miami-Dade. El [Board of Rules and Appeals](${BORA}) del condado publica las interpretaciones que comparten los funcionarios de construcción de Broward.`,
};

T['city-miramar-installation'] = {
  en: `## What survey does Miramar require for a shade structure?

A complete, current survey less than seven years old, signed and sealed by a surveyor and showing where the structure will go. Miramar's awnings and canopies package also asks for plans signed and sealed by a registered engineer or architect.

Those requirements come from the city's [awnings and canopies application package](https://miramarfl.gov/files/assets/public/v/3/buildingplanningzoning/documents/application-and-forms/awnings-canopies-application-package-fbc-2023-rev-dec.-2024.pdf), and a pergola application follows the same logic: the survey shows the setbacks, and the sealed plans show the engineering. Homeowners who bought years ago often find their closing survey is too old and have to order a new one, so that is worth checking first.

The [Building Division](https://www.miramarfl.gov/Departments/Building-Planning-Zoning/Building-Permits-Inspections) sits inside Miramar's Building, Planning and Zoning Department, which means zoning and construction review happen under one roof. Applications and inspections are handled in the [Permits and Inspections Self Services portal](https://miramarfl-energovweb.tylerhost.net/apps/SelfService#/home).

Miramar runs from the older eastern neighborhoods near University Drive to newer communities toward the Everglades, many with active associations. All of it is in Broward and therefore in the High Velocity Hurricane Zone, with code interpretations from the county's [Board of Rules and Appeals](${BORA}).`,
  es: `## ¿Qué survey pide Miramar para una estructura de sombra?

Un survey completo y actualizado, de menos de siete años, firmado y sellado por un agrimensor y con la ubicación prevista de la estructura. El paquete de toldos y marquesinas de Miramar pide además planos firmados y sellados por un ingeniero o arquitecto registrado.

Esos requisitos salen del [paquete de solicitud de toldos y marquesinas](https://miramarfl.gov/files/assets/public/v/3/buildingplanningzoning/documents/application-and-forms/awnings-canopies-application-package-fbc-2023-rev-dec.-2024.pdf) de la ciudad, y la solicitud de una pérgola sigue la misma lógica: el survey muestra los retiros y los planos sellados muestran la ingeniería. Quien compró su casa hace años suele descubrir que el survey del cierre es demasiado antiguo y tiene que encargar uno nuevo, así que conviene revisarlo primero.

La [Building Division](https://www.miramarfl.gov/Departments/Building-Planning-Zoning/Building-Permits-Inspections) está dentro del departamento de Building, Planning and Zoning de Miramar, de modo que zoning y construcción se revisan bajo el mismo techo. Las solicitudes y las inspecciones se gestionan en el [portal de autoservicio de permisos e inspecciones](https://miramarfl-energovweb.tylerhost.net/apps/SelfService#/home).

Miramar va desde los barrios más antiguos del este, cerca de University Drive, hasta comunidades nuevas hacia los Everglades, muchas con asociación activa. Todo está en Broward y por tanto en la High Velocity Hurricane Zone, con las interpretaciones del código que da el [Board of Rules and Appeals](${BORA}) del condado.`,
};

T['city-parkland-installation'] = {
  en: `## What is on Parkland's pergola checklist?

Parkland publishes a pergola checklist: the Broward County uniform building application for each trade, a recorded Notice of Commencement if the job exceeds $5,000, an HOA approval letter where one applies, a survey with dimensions and setbacks, signed and sealed plans, and the manufacturer's specifications.

The [Pergola Checklist](https://www.cityofparkland.org/DocumentCenter/View/21208/PERGOLA-CHECKLIST) is one of the clearest documents of its kind in Broward, and it is the list a contractor should be working from. Applications go to the [Parkland Building Department](https://www.cityofparkland.org/109/Building-Department) through [My Government Online](https://www.mgoconnect.org/cp/portal).

Most of Parkland is built out in gated communities such as Heron Bay, Parkland Golf and Country Club or Watercrest, where the association's architectural committee reviews color, height and placement. The checklist's request for an HOA letter is a reminder that the city expects that approval to be in hand before the building review starts.

Parkland is in Broward, inside the High Velocity Hurricane Zone, so the sealed plans must show wind design for that zone and the aluminum system needs a Florida or Miami-Dade product approval. County-wide code questions are resolved by Broward's [Board of Rules and Appeals](${BORA}).`,
  es: `## ¿Qué pide la lista de requisitos de Parkland para una pérgola?

Parkland publica una lista para pérgolas: la solicitud uniforme de construcción del condado de Broward por cada oficio, una Notice of Commencement registrada si la obra supera $5,000, la carta de aprobación de la HOA si corresponde, un survey con medidas y retiros, planos firmados y sellados y las especificaciones del fabricante.

La [Pergola Checklist](https://www.cityofparkland.org/DocumentCenter/View/21208/PERGOLA-CHECKLIST) es uno de los documentos más claros de su tipo en Broward, y es la lista con la que debería trabajar el contratista. Las solicitudes van al [Building Department de Parkland](https://www.cityofparkland.org/109/Building-Department) a través de [My Government Online](https://www.mgoconnect.org/cp/portal).

Casi todo Parkland está construido en comunidades cerradas como Heron Bay, Parkland Golf and Country Club o Watercrest, donde el comité de arquitectura de la asociación revisa color, altura y ubicación. Que la lista pida la carta de la HOA recuerda que la ciudad espera tener esa aprobación antes de empezar la revisión de construcción.

Parkland está en Broward, dentro de la High Velocity Hurricane Zone, así que los planos sellados deben mostrar el cálculo de viento para esa zona y el sistema de aluminio necesita aprobación de producto de Florida o de Miami-Dade. Las dudas sobre el código en todo el condado las resuelve el [Board of Rules and Appeals](${BORA}) de Broward.`,
};

T['city-pembroke-pines-pergola-installation'] = {
  en: `## Do you need an HOA affidavit for a pergola in Pembroke Pines?

Yes, even without an HOA. Pembroke Pines' gazebo, trellis and pergola checklist requires a Homeowners Association Affidavit of Awareness on every application, plus the Broward uniform permit application, a landscape compliance affidavit, sealed plans or product approvals, and a survey.

The [Gazebo, Trellis, Pergola Permit Checklist](https://www.ppines.com/DocumentCenter/View/14456/Trellis-Gazebo-Pergola) also asks for a Notice of Commencement when the job exceeds $5,000, and it notes that the application is reviewed by Building, Engineering and Zoning. Three disciplines means three sets of comments, so a complete first submittal saves weeks.

The city's [Apply for a Building Permit](https://www.ppines.com/1827/Apply-For-a-Building-Permit) page explains the process, and applications run through the [Development Hub](https://pembrokepinesfl-energovweb.tylerhost.net/apps/selfservice#/home). The landscape affidavit is unusual: it confirms the new structure does not remove required trees or landscaping, which matters on smaller lots in communities like Silver Lakes or Chapel Trail.

Pembroke Pines is in Broward and therefore inside the High Velocity Hurricane Zone. The engineering, the product approvals and the county's [Board of Rules and Appeals](${BORA}) interpretations all follow from that.`,
  es: `## ¿Hace falta una declaración de la HOA para una pérgola en Pembroke Pines?

Sí, aunque no haya HOA. La lista de requisitos de Pembroke Pines para gazebos, enrejados y pérgolas exige en toda solicitud una Homeowners Association Affidavit of Awareness, además de la solicitud uniforme de Broward, una declaración de cumplimiento de paisajismo, planos sellados o aprobaciones de producto, y un survey.

La [Gazebo, Trellis, Pergola Permit Checklist](https://www.ppines.com/DocumentCenter/View/14456/Trellis-Gazebo-Pergola) pide también una Notice of Commencement cuando la obra supera $5,000, e indica que la solicitud la revisan Building, Engineering y Zoning. Tres disciplinas son tres rondas de comentarios, así que una primera entrega completa ahorra semanas.

La página [Apply for a Building Permit](https://www.ppines.com/1827/Apply-For-a-Building-Permit) explica el proceso, y las solicitudes se tramitan en el [Development Hub](https://pembrokepinesfl-energovweb.tylerhost.net/apps/selfservice#/home). La declaración de paisajismo es poco habitual: confirma que la nueva estructura no elimina árboles ni jardinería obligatorios, algo que pesa en los lotes más pequeños de comunidades como Silver Lakes o Chapel Trail.

Pembroke Pines está en Broward y por tanto dentro de la High Velocity Hurricane Zone. De ahí salen la ingeniería, las aprobaciones de producto y las interpretaciones del [Board of Rules and Appeals](${BORA}) del condado.`,
};

T['city-weston-pergola-solutions'] = {
  en: `## How fast is a pergola permit in Weston?

Weston lists shed, pergola and gazebo permits, along with screen enclosures, among its Quick Permits, with a review cycle of three to five business days when the application is complete. Building Code Services handles the review.

That timeline comes from the city's [permitting services page](https://www.westonfl.org/government/permitting-services), and the condition matters: an incomplete package goes back to the applicant and the clock restarts. [Building Code Services](https://www.westonfl.org/government/building-code-services) is the department that reviews and inspects, and applications are submitted through Weston's [ePermits](https://www.westonfl.org/ePermits) system.

Almost every Weston neighborhood, from Savanna to Weston Hills, has a homeowners association with architectural review, and that approval usually takes longer than the city's quick review. Planning the HOA submittal first, with color and roof samples, keeps the whole project moving.

Weston sits at the western edge of Broward next to the Everglades, far from the ocean, but the High Velocity Hurricane Zone covers the entire county. Plans are signed and sealed by a Florida engineer, the aluminum carries a Florida or Miami-Dade approval, and the county's [Board of Rules and Appeals](${BORA}) sets the shared interpretations of the code.`,
  es: `## ¿Cuánto tarda el permiso de una pérgola en Weston?

Weston incluye los permisos de sheds, pérgolas y gazebos, igual que los de screen enclosures, entre sus Quick Permits, con un ciclo de revisión de tres a cinco días hábiles si la solicitud está completa. La revisión la hace Building Code Services.

Ese plazo sale de la [página de servicios de permisos](https://www.westonfl.org/government/permitting-services) de la ciudad, y la condición importa: un expediente incompleto vuelve al solicitante y el reloj empieza de nuevo. [Building Code Services](https://www.westonfl.org/government/building-code-services) es el departamento que revisa e inspecciona, y las solicitudes se presentan en el sistema [ePermits](https://www.westonfl.org/ePermits) de Weston.

Casi todos los barrios de Weston, de Savanna a Weston Hills, tienen asociación de propietarios con revisión de arquitectura, y esa aprobación suele tardar más que la revisión rápida de la ciudad. Preparar primero la entrega a la HOA, con muestras de color y de techo, mantiene el proyecto en marcha.

Weston está en el borde oeste de Broward, junto a los Everglades y lejos del océano, pero la High Velocity Hurricane Zone cubre todo el condado. Los planos los firma y sella un ingeniero de Florida, el aluminio tiene aprobación de Florida o de Miami-Dade, y el [Board of Rules and Appeals](${BORA}) del condado fija las interpretaciones comunes del código.`,
};

// ---------------------------------------------------------------- Palm Beach
T['city-boca-raton-pergola-contractor'] = {
  en: `## Where do you apply for a pergola permit in Boca Raton?

Through Boca eHub, the city's online portal. Building Permits and Inspections, part of Development Services, reviews the plans. Palm Beach County is outside the High Velocity Hurricane Zone, which covers only Broward and Miami-Dade, but the Florida Building Code wind design and product approvals still apply.

Before sizing anything, check the city's [setback information](https://www.myboca.us/1586/Setback-Information) for accessory structures, fences and pool enclosures. The city warns that the table does not apply to every single-family district and that subdivisions that are prior platted or have special setbacks should be confirmed with Zoning. The [Building Permits and Inspections](https://www.myboca.us/157/Building-Permits-and-Inspections) page links to [Boca eHub](https://bocaehub.com), where the application and inspections are tracked.

We are based in Boca Raton, and two of our published projects are here: an [attached FORTE Plus pergola on the Intracoastal](ref:project-attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton) and a [custom sukkah pergola at Boca Beach](ref:project-custom-sukkah-pergola-at-boca-beach). The Intracoastal project is an attached structure built for salt air, a common combination in Boca, where waterfront lots bring both the city's setback table and a marine environment into the design.

Aluminum systems used in Palm Beach County need a [Florida product approval](${FPA}), and permits for unincorporated addresses outside city limits go to the [county's Permit Center](${PBC}).`,
  es: `## ¿Dónde se solicita el permiso de una pérgola en Boca Raton?

En Boca eHub, el portal en línea de la ciudad. Building Permits and Inspections, dentro de Development Services, revisa los planos. El condado de Palm Beach está fuera de la High Velocity Hurricane Zone, que solo cubre Broward y Miami-Dade, pero el cálculo de viento del Florida Building Code y las aprobaciones de producto se siguen aplicando.

Antes de dimensionar nada, revise la [información de retiros](https://www.myboca.us/1586/Setback-Information) de la ciudad para estructuras accesorias, cercas y pool enclosures. La ciudad advierte que la tabla no aplica a todos los distritos unifamiliares y que, en subdivisiones prior platted o con retiros especiales, hay que confirmarlo con Zoning. La página de [Building Permits and Inspections](https://www.myboca.us/157/Building-Permits-and-Inspections) enlaza con [Boca eHub](https://bocaehub.com), donde se siguen la solicitud y las inspecciones.

Tenemos nuestra base en Boca Raton, y dos de nuestros proyectos publicados están aquí: una [pérgola FORTE Plus adosada sobre el Intracoastal](ref:project-attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton) y una [pérgola sukkah a medida en Boca Beach](ref:project-custom-sukkah-pergola-at-boca-beach). La del Intracoastal es una estructura adosada pensada para el salitre, una combinación habitual en Boca, donde los lotes frente al agua suman al diseño la tabla de retiros de la ciudad y el ambiente marino.

Los sistemas de aluminio en el condado de Palm Beach necesitan una [aprobación de producto de Florida](${FPA}), y los permisos de direcciones no incorporadas, fuera de la ciudad, van al [Permit Center del condado](${PBC}).`,
};

T['city-boynton-beach-contractors'] = {
  en: `## How strict is Boynton Beach about where an accessory structure sits?

Very. For sheds, Boynton Beach asks for a survey with the distance from each wall to the property line. Larger ones must meet the main house setbacks, and smaller ones stay at least 3 feet from rear and side lines, out of easements. Pergola placement is checked with the same care.

The city's [shed permit page](https://www.boynton-beach.org/468/Shed-Permit) spells those rules out, including landscape screening when the structure can be seen from the street or a neighbor. It is a useful preview of how plan reviewers look at anything built in a back yard. The [Boynton Beach Building Department](https://boynton-beach.org/202/Building-Department) takes applications through [SagesGov](https://www.sagesgov.com/boyntonbeach-fl), where plans and inspections are handled online.

Boynton Beach runs from the Intracoastal and the marina district west past Military Trail into large adult communities and newer subdivisions. East of US-1 the conversation is often about coastal exposure and salt; west of I-95, about association approvals and lot coverage.

Palm Beach County is outside the High Velocity Hurricane Zone, but pergolas still follow Florida Building Code wind design, and aluminum systems need a [Florida product approval](${FPA}). Addresses outside city limits are permitted by the [Palm Beach County Permit Center](${PBC}).`,
  es: `## ¿Qué tan estricta es Boynton Beach con la ubicación de una estructura accesoria?

Mucho. Para sheds, Boynton Beach pide un survey con la distancia de cada pared al lindero. Los más grandes deben cumplir los retiros de la casa, y los pequeños van al menos a 3 pies de los linderos trasero y laterales, fuera de servidumbres. La ubicación de una pérgola se revisa con el mismo cuidado.

La [página de permisos de sheds](https://www.boynton-beach.org/468/Shed-Permit) de la ciudad detalla esas reglas, incluida una pantalla vegetal cuando la estructura se ve desde la calle o desde el vecino. Es un buen anticipo de cómo miran los revisores cualquier cosa construida en un patio trasero. El [Building Department de Boynton Beach](https://boynton-beach.org/202/Building-Department) recibe las solicitudes en [SagesGov](https://www.sagesgov.com/boyntonbeach-fl), donde planos e inspecciones se gestionan en línea.

Boynton Beach va desde el Intracoastal y la zona de la marina hacia el oeste, pasada Military Trail, hasta grandes comunidades para adultos y urbanizaciones nuevas. Al este de la US-1 se habla sobre todo de exposición costera y salitre; al oeste de la I-95, de aprobaciones de asociación y ocupación del lote.

El condado de Palm Beach está fuera de la High Velocity Hurricane Zone, pero las pérgolas siguen el cálculo de viento del Florida Building Code y los sistemas de aluminio necesitan una [aprobación de producto de Florida](${FPA}). Las direcciones fuera de la ciudad las tramita el [Permit Center del condado de Palm Beach](${PBC}).`,
};

T['city-delray-beach-contractors'] = {
  en: `## Does a pergola in a Delray Beach historic district need a COA?

Yes. Any exterior improvement on a designated historic site or inside a historic district needs a Certificate of Appropriateness. For single-family homes and duplexes the COA is enough; other uses need a COA and a site plan. The building permit follows.

Delray has several local historic districts, including Old School Square, Marina and Nassau Park, and the city's [historic preservation applications page](https://www.delraybeachfl.gov/government/city-departments/development-services/historic-preservation/historic-preservation-applications) explains the COA process. Building plans then go to the [Building Division](https://www.delraybeachfl.gov/government/city-departments/development-services/building) through [ePlans](https://www.delraybeachfl.gov/government/city-departments/development-services/building/digital-permit-submissions-eplans), the city's digital submittal system.

Delray Beach is where we have built the most published work: a [FORTE pergola with a privacy wall and motorized screen](ref:project-forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach), another [FORTE pergola with a privacy wall and TV mount](ref:project-forte-pergola-with-privacy-wall-tv-mount-in-delray-beach), and a [FORTE Plus pergola with an outdoor kitchen](ref:project-forte-plus-pergola-with-outdoor-kitchen-in-delray-beach). Each one adds something beyond the roof, a wall, a screen or a kitchen, and those elements belong in the drawings from the start.

Palm Beach County is outside the High Velocity Hurricane Zone, but the Florida Building Code's wind design and [Florida product approvals](${FPA}) still apply.`,
  es: `## ¿Una pérgola en un distrito histórico de Delray Beach necesita un COA?

Sí. Toda mejora exterior en un sitio histórico designado o dentro de un distrito histórico necesita un Certificate of Appropriateness. En casas unifamiliares y dúplex basta con el COA; otros usos necesitan COA y site plan. Después viene el permiso de construcción.

Delray tiene varios distritos históricos locales, entre ellos Old School Square, Marina y Nassau Park, y la [página de solicitudes de preservación histórica](https://www.delraybeachfl.gov/government/city-departments/development-services/historic-preservation/historic-preservation-applications) de la ciudad explica el proceso del COA. Después, los planos van a la [Building Division](https://www.delraybeachfl.gov/government/city-departments/development-services/building) a través de [ePlans](https://www.delraybeachfl.gov/government/city-departments/development-services/building/digital-permit-submissions-eplans), el sistema de entrega digital de la ciudad.

Delray Beach es donde tenemos más obra publicada: una [pérgola FORTE con muro de privacidad y screen motorizado](ref:project-forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach), otra [pérgola FORTE con muro de privacidad y soporte para TV](ref:project-forte-pergola-with-privacy-wall-tv-mount-in-delray-beach) y una [pérgola FORTE Plus con cocina exterior](ref:project-forte-plus-pergola-with-outdoor-kitchen-in-delray-beach). Cada una suma algo más que el techo —un muro, un screen o una cocina—, y esos elementos deben estar en los planos desde el principio.

El condado de Palm Beach está fuera de la High Velocity Hurricane Zone, pero el cálculo de viento del Florida Building Code y las [aprobaciones de producto de Florida](${FPA}) se siguen aplicando.`,
};

T['city-jupiter-contractors'] = {
  en: `## Does the Town of Jupiter require a permit for a pergola?

Yes. The Town of Jupiter's residential permit brochure lists gazebos, arbors and pergolas, as well as screen enclosures and pool cages, among the work that needs a building permit. Packages are submitted to the Building Department through JCDS, the town's online system.

The town's [residential building permits brochure](https://www.jupiter.fl.us/DocumentCenter/View/13673/ResBuildingPermits_brochure_2017_Web) dates from 2017, but its list of permitted work is a clear answer to the most common question we hear. The [permit package submittal page](https://www.jupiter.fl.us/98/Permit-Package-Submittal) explains what to include, and applications run through the [Jupiter Community Development System](https://www.jupiter.fl.us/jcds).

Jupiter is a coastal town shaped by the Loxahatchee River, the Intracoastal and its inlet, and the town's [coastal management element](https://www.jupiter.fl.us/DocumentCenter/View/23325/5-Coastal-Mgt-Element-070720) shows how much of it sits near the water. Our [oceanfront pool deck and cabanas at Jupiter Ocean Club](ref:project-oceanfront-pool-deck-and-cabanas-at-jupiter-ocean-club) is a good example of what that means in practice: a resort deck a few hundred feet from the Atlantic, with cabanas and paving specified for salt air.

Palm Beach County is outside the High Velocity Hurricane Zone, but Florida Building Code wind loads near the coast are among the highest in the state, and the aluminum needs a [Florida product approval](${FPA}).`,
  es: `## ¿El Town of Jupiter exige permiso para una pérgola?

Sí. El folleto de permisos residenciales del Town of Jupiter incluye gazebos, arcos y pérgolas, igual que screen enclosures y pool cages, entre las obras que necesitan permiso de construcción. Los expedientes se presentan al Building Department a través de JCDS, el sistema en línea del pueblo.

El [folleto de permisos residenciales](https://www.jupiter.fl.us/DocumentCenter/View/13673/ResBuildingPermits_brochure_2017_Web) es de 2017, pero su lista de obras con permiso responde con claridad a la pregunta que más nos hacen. La [página de entrega del expediente](https://www.jupiter.fl.us/98/Permit-Package-Submittal) explica qué incluir, y las solicitudes se tramitan en el [Jupiter Community Development System](https://www.jupiter.fl.us/jcds).

Jupiter es un pueblo costero marcado por el río Loxahatchee, el Intracoastal y su inlet, y el [elemento de gestión costera](https://www.jupiter.fl.us/DocumentCenter/View/23325/5-Coastal-Mgt-Element-070720) del pueblo muestra cuánto de él está junto al agua. Nuestra [cubierta de piscina y cabañas frente al mar en Jupiter Ocean Club](ref:project-oceanfront-pool-deck-and-cabanas-at-jupiter-ocean-club) es un buen ejemplo de lo que eso significa en la práctica: una cubierta de resort a unos cientos de pies del Atlántico, con cabañas y pavimento elegidos para el salitre.

El condado de Palm Beach está fuera de la High Velocity Hurricane Zone, pero las cargas de viento del Florida Building Code cerca de la costa están entre las más altas del estado, y el aluminio necesita una [aprobación de producto de Florida](${FPA}).`,
};

T['city-palm-beach-contractors'] = {
  en: `## Does a pergola in the Town of Palm Beach go through design review?

Yes, always. Landmarked or historically significant buildings are reviewed by the Landmarks Preservation Commission; everything else goes to the Architectural Commission, ARCOM. Projects that need a variance, special exception or site plan also go to the Town Council.

The town explains that sequence on its [planning, zoning and development review page](https://townofpalmbeach.com/1292/Planning-Zoning-Development-Review). Design review comes before the building permit, so a pergola here is effectively presented to a commission, with drawings, materials and often photographs of the surroundings, before engineering is reviewed.

Building permits are handled by the [Planning, Zoning and Building Department](https://www.townofpalmbeach.com/1295/Building-Permits-and-Business-Tax-Receip) through the town's [Enterprise Permit and Licensing portal](https://townofpalmbeachfl-energovweb.tylerhost.net/apps/selfservice). On an island between the Atlantic and Lake Worth Lagoon, the town also has a [coastal protection program](https://townofpalmbeach.com/133/Coastal-Protection), and oceanfront lots carry extra coastal review.

The Town of Palm Beach is in Palm Beach County, outside the High Velocity Hurricane Zone, but wind loads on the barrier island are high, the air is salty year-round, and the aluminum must carry a [Florida product approval](${FPA}).`,
  es: `## ¿Una pérgola en el Town of Palm Beach pasa por revisión de diseño?

Sí, siempre. Los edificios protegidos o de valor histórico los revisa la Landmarks Preservation Commission; todo lo demás va a la Architectural Commission, ARCOM. Los proyectos que necesitan una variance, una excepción especial o un site plan van además al Town Council.

El pueblo explica ese orden en su [página de planificación, zoning y revisión de proyectos](https://townofpalmbeach.com/1292/Planning-Zoning-Development-Review). La revisión de diseño va antes del permiso de construcción, así que aquí una pérgola se presenta, en la práctica, ante una comisión —con planos, materiales y a menudo fotos del entorno— antes de que se revise la ingeniería.

Los permisos de construcción los lleva el [Planning, Zoning and Building Department](https://www.townofpalmbeach.com/1295/Building-Permits-and-Business-Tax-Receip) a través del [portal de permisos y licencias](https://townofpalmbeachfl-energovweb.tylerhost.net/apps/selfservice) del pueblo. En una isla entre el Atlántico y la laguna de Lake Worth, el pueblo tiene además un [programa de protección costera](https://townofpalmbeach.com/133/Coastal-Protection), y los lotes frente al mar llevan una revisión costera adicional.

El Town of Palm Beach está en el condado de Palm Beach, fuera de la High Velocity Hurricane Zone, pero las cargas de viento en la isla barrera son altas, el aire es salino todo el año y el aluminio debe tener una [aprobación de producto de Florida](${FPA}).`,
};

T['city-palm-beach-gardens'] = {
  en: `## Does a pergola need its own permit in Palm Beach Gardens?

Yes. The Palm Beach Gardens checklist for new homes, additions and renovations says accessory structures and screen enclosures need separate permits and applications. Even if the pergola is part of a larger remodel, it gets its own permit from the Building Division.

That rule is on the city's [single-family residential checklist](https://www.pbgfl.gov/DocumentCenter/View/342/New-Single-Family-ResidentialAddition-or-Renovation-Checklist-PDF), and it matters for scheduling: a pergola can be permitted and built on its own timeline instead of waiting for the rest of the house. The [Palm Beach Gardens Building Division](https://pbgfl.gov/194/Building-Division) takes applications through the city's [online permitting system](https://palmbeachgardensfl-energovweb.tylerhost.net/apps/SelfService#/home).

Much of the city is in golf and country club communities such as PGA National, Mirasol or BallenIsles, each with its own architectural review, so a pergola here typically has three approvals: the club or association, the city's zoning review and the building permit. Our [FORTE pergola with a partial privacy wall](ref:project-forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens) was built in Palm Beach Gardens.

Palm Beach County is outside the High Velocity Hurricane Zone; designs follow Florida Building Code wind loads with [Florida product approvals](${FPA}).`,
  es: `## ¿Una pérgola necesita su propio permiso en Palm Beach Gardens?

Sí. La lista de requisitos de Palm Beach Gardens para casas nuevas, ampliaciones y renovaciones indica que las estructuras accesorias y los screen enclosures necesitan permisos y solicitudes separados. Aunque la pérgola sea parte de una remodelación mayor, la Building Division le da su propio permiso.

Esa regla está en la [lista de requisitos residenciales unifamiliares](https://www.pbgfl.gov/DocumentCenter/View/342/New-Single-Family-ResidentialAddition-or-Renovation-Checklist-PDF) de la ciudad, y pesa en el calendario: la pérgola puede permisarse y construirse a su ritmo, sin esperar al resto de la casa. La [Building Division de Palm Beach Gardens](https://pbgfl.gov/194/Building-Division) recibe las solicitudes en el [sistema de permisos en línea](https://palmbeachgardensfl-energovweb.tylerhost.net/apps/SelfService#/home) de la ciudad.

Buena parte de la ciudad está en comunidades de golf y country club como PGA National, Mirasol o BallenIsles, cada una con su revisión de arquitectura, así que aquí una pérgola suele llevar tres aprobaciones: la del club o asociación, la revisión de zoning de la ciudad y el permiso de construcción. Nuestra [pérgola FORTE con muro de privacidad parcial](ref:project-forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens) se construyó en Palm Beach Gardens.

El condado de Palm Beach está fuera de la High Velocity Hurricane Zone; los diseños siguen las cargas de viento del Florida Building Code con [aprobaciones de producto de Florida](${FPA}).`,
};

T['city-royal-palm-beach-contractors'] = {
  en: `## What does Royal Palm Beach ask for to permit a screened or covered structure?

For a screen enclosure, the Village of Royal Palm Beach asks for an application, two sets of plans, a survey with the setbacks marked, product approvals and zoning approval. A pergola permit follows the same pattern of plans, survey and approvals.

Those requirements are on the village's [rules and regulations page](https://royalpalmbeachfl.gov/311/Rules-Regulations). The [Royal Palm Beach Building Department](https://www.royalpalmbeachfl.gov/246/Building) reviews plans through [ProjectDox](https://rpb-fl-us.avolvecloud.com/Login/Index/RoyalPalmBeach), its electronic plan review system, so the two sets of plans are usually uploaded rather than printed.

Royal Palm Beach is an inland village in central Palm Beach County, organized around lakes and canals that drain the area, with many homes backing onto water. That makes drainage and easements part of the conversation: posts cannot sit in a drainage or lake maintenance easement, and the survey is where those lines show up.

The village is outside the High Velocity Hurricane Zone, which covers only Broward and Miami-Dade, but pergolas still follow the Florida Building Code's wind design, and the aluminum system needs a [Florida product approval](${FPA}). Unincorporated addresses nearby are permitted by the [Palm Beach County Permit Center](${PBC}).`,
  es: `## ¿Qué pide Royal Palm Beach para permisar una estructura cubierta o con screen?

Para un screen enclosure, el Village of Royal Palm Beach pide la solicitud, dos juegos de planos, un survey con los retiros marcados, aprobaciones de producto y aprobación de zoning. El permiso de una pérgola sigue el mismo patrón de planos, survey y aprobaciones.

Esos requisitos están en la [página de normas y reglamentos](https://royalpalmbeachfl.gov/311/Rules-Regulations) del village. El [Building Department de Royal Palm Beach](https://www.royalpalmbeachfl.gov/246/Building) revisa los planos en [ProjectDox](https://rpb-fl-us.avolvecloud.com/Login/Index/RoyalPalmBeach), su sistema de revisión electrónica, así que los dos juegos de planos se suelen subir en lugar de imprimir.

Royal Palm Beach es un village del interior, en el centro del condado de Palm Beach, organizado alrededor de lagos y canales que drenan la zona, con muchas casas que dan al agua. Por eso el drenaje y las servidumbres entran en la conversación: los postes no pueden ir en una servidumbre de drenaje o de mantenimiento del lago, y el survey es donde aparecen esas líneas.

El village está fuera de la High Velocity Hurricane Zone, que solo cubre Broward y Miami-Dade, pero las pérgolas siguen el cálculo de viento del Florida Building Code y el sistema de aluminio necesita una [aprobación de producto de Florida](${FPA}). Las direcciones no incorporadas cercanas las tramita el [Permit Center del condado de Palm Beach](${PBC}).`,
};

T['city-wellington-contractors'] = {
  en: `## Does Wellington's HB 803 exemption cover a pergola?

No. Since July 1, 2026, certain residential work under $7,500 can be exempt from permits for single-family owners or their contractors in Wellington, but the exemption does not apply to structural, electrical, gas, plumbing, mechanical or pool barrier work. An anchored pergola is structural.

The village explains the new state law on its [HB 803 permit exemption page](https://www.wellingtonfl.gov/2412/House-Bill-803---Permit-Exemption). A pergola permit goes to the [Wellington Building Division](https://www.wellingtonfl.gov/214/Building) through the village's [Citizen Self Service portal](https://www.wellingtonfl.gov/SelfService).

Wellington is known for its equestrian estates and large lots, and our [FORTE pergola with an outdoor kitchen at Elan Polo Club](ref:project-forte-pergola-with-outdoor-kitchen-at-elan-polo-club) is a freestanding structure on a community amenity lawn, with louvered and solid roof sections, recessed lights, ceiling fans and a built-in outdoor kitchen. Lights and fans mean electrical work, which the exemption never covers. Gated communities and polo club neighborhoods add their own architectural review on top of the village's.

Wellington is in Palm Beach County, outside the High Velocity Hurricane Zone, but the Florida Building Code's wind design still governs, and aluminum systems need a [Florida product approval](${FPA}).`,
  es: `## ¿La exención de la HB 803 en Wellington cubre una pérgola?

No. Desde el 1 de julio de 2026, cierta obra residencial de menos de $7,500 puede quedar exenta de permiso en Wellington para dueños de vivienda unifamiliar o sus contratistas, pero la exención no aplica a obra estructural, eléctrica, de gas, de plomería, mecánica ni a barreras de piscina. Una pérgola anclada es estructural.

El village explica la nueva ley estatal en su [página sobre la exención de la HB 803](https://www.wellingtonfl.gov/2412/House-Bill-803---Permit-Exemption). El permiso de una pérgola va a la [Building Division de Wellington](https://www.wellingtonfl.gov/214/Building) a través del [portal Citizen Self Service](https://www.wellingtonfl.gov/SelfService) del village.

Wellington es conocido por sus fincas ecuestres y sus lotes grandes, y nuestra [pérgola FORTE con cocina exterior en Elan Polo Club](ref:project-forte-pergola-with-outdoor-kitchen-at-elan-polo-club) es una estructura independiente sobre el césped comunitario, con secciones de techo de lamas y de techo sólido, luces empotradas, ventiladores de techo y una cocina exterior integrada. Luces y ventiladores son obra eléctrica, que la exención nunca cubre. Las comunidades cerradas y los barrios de clubes de polo suman su propia revisión de arquitectura a la del village.

Wellington está en el condado de Palm Beach, fuera de la High Velocity Hurricane Zone, pero manda el cálculo de viento del Florida Building Code, y los sistemas de aluminio necesitan una [aprobación de producto de Florida](${FPA}).`,
};

T['city-west-palm-beach-contractors'] = {
  en: `## Where do you get a pergola permit in West Palm Beach?

From the Building Division of West Palm Beach's Development Services, through Civic Access, the city's online portal. In historic districts such as El Cid, Flamingo Park or Northwood Hills, exterior work also needs a Certificate of Appropriateness.

The city's [historic preservation FAQ](https://www.wpb.org/Departments/Development-Services/Planning-Division/Historic-Preservation/Historic-Preservation-FAQs) explains that the COA covers any change to the exterior, not interiors, and that the level of review, staff or Historic Preservation Board, depends on the scope. A pergola visible from the street in one of those districts is the kind of project that gets a closer look. Building plans go to the [Building Division](https://www.wpb.org/departments/development-services/building-division) through [Civic Access](https://westpalmbeachfl-energovpub.tylerhost.net/Apps/SelfService#/home).

Our [attached FORTE pergola in West Palm Beach](ref:project-attached-forte-pergola-in-west-palm-beach) shows a common situation here: a structure that extends an existing home, where the connection to the house is part of the engineering, not only the posts.

West Palm Beach is in Palm Beach County, outside the High Velocity Hurricane Zone, and aluminum systems need a [Florida product approval](${FPA}). Addresses outside city limits are permitted by the [Palm Beach County Permit Center](${PBC}).`,
  es: `## ¿Dónde se obtiene el permiso de una pérgola en West Palm Beach?

En la Building Division de Development Services de West Palm Beach, a través de Civic Access, el portal en línea de la ciudad. En distritos históricos como El Cid, Flamingo Park o Northwood Hills, la obra exterior necesita además un Certificate of Appropriateness.

Las [preguntas frecuentes de preservación histórica](https://www.wpb.org/Departments/Development-Services/Planning-Division/Historic-Preservation/Historic-Preservation-FAQs) de la ciudad explican que el COA cubre cualquier cambio exterior, no los interiores, y que el nivel de revisión —staff o Historic Preservation Board— depende del alcance. Una pérgola visible desde la calle en uno de esos distritos es justo el tipo de proyecto que se mira con más detalle. Los planos de construcción van a la [Building Division](https://www.wpb.org/departments/development-services/building-division) a través de [Civic Access](https://westpalmbeachfl-energovpub.tylerhost.net/Apps/SelfService#/home).

Nuestra [pérgola FORTE adosada en West Palm Beach](ref:project-attached-forte-pergola-in-west-palm-beach) muestra una situación habitual aquí: una estructura que prolonga una casa existente, donde la unión con la vivienda forma parte de la ingeniería, no solo los postes.

West Palm Beach está en el condado de Palm Beach, fuera de la High Velocity Hurricane Zone, y los sistemas de aluminio necesitan una [aprobación de producto de Florida](${FPA}). Las direcciones fuera de la ciudad las tramita el [Permit Center del condado de Palm Beach](${PBC}).`,
};

// ---------------------------------------------------------------- Condados
T['county-miami-dade-pergola-contractor'] = {
  en: `## Who issues pergola permits in Miami-Dade County?

It depends on the address. Each of the county's municipalities runs its own building department. In unincorporated Miami-Dade, properties whose folio number starts with 30, permits come from the county's Regulatory and Economic Resources department.

The county explains [how to apply for a permit](${MD_PERMISO}) on its [building portal](https://www.miamidade.gov/global/economy/building/home.page). What every jurisdiction in the county shares is the High Velocity Hurricane Zone: the Florida Building Code applies its strictest wind provisions to Miami-Dade and Broward, and Miami-Dade's own Product Control Section issues the [Notices of Acceptance](${NOA}) that aluminum systems, fasteners and screens are tested against. Anyone can look up an NOA in the county's [product approval search](${NOA_BUSCAR}).

Our city pages for [Miami](ref:city-miami-pergola-experts), [Miami Beach](ref:city-miami-beach-pergola-design), [Aventura](ref:city-aventura-pergola-builders), [Doral](ref:city-doral-pergola-builders), [Key Biscayne](ref:city-key-biscayne-pergola-builders) and [Sunny Isles Beach](ref:city-sunny-isles-beach-pergola-builders) explain what each building department adds on top of the county rules.`,
  es: `## ¿Quién emite los permisos de pérgolas en el condado de Miami-Dade?

Depende de la dirección. Cada municipio del condado tiene su propio departamento de construcción. En el Miami-Dade no incorporado, las propiedades cuyo número de folio empieza por 30, los permisos los da el departamento de Regulatory and Economic Resources del condado.

El condado explica [cómo solicitar un permiso](${MD_PERMISO}) en su [portal de construcción](https://www.miamidade.gov/global/economy/building/home.page). Lo que comparten todas las jurisdicciones del condado es la High Velocity Hurricane Zone: el Florida Building Code aplica sus disposiciones de viento más estrictas a Miami-Dade y Broward, y la Product Control Section de Miami-Dade emite las [Notices of Acceptance](${NOA}) con las que se ensayan los sistemas de aluminio, la tornillería y los screens. Cualquiera puede consultar una NOA en el [buscador de aprobaciones de producto](${NOA_BUSCAR}) del condado.

Nuestras páginas de [Miami](ref:city-miami-pergola-experts), [Miami Beach](ref:city-miami-beach-pergola-design), [Aventura](ref:city-aventura-pergola-builders), [Doral](ref:city-doral-pergola-builders), [Key Biscayne](ref:city-key-biscayne-pergola-builders) y [Sunny Isles Beach](ref:city-sunny-isles-beach-pergola-builders) explican qué añade cada departamento de construcción a las reglas del condado.`,
};

T['county-broward-county-pergola-contractor'] = {
  en: `## Who permits a pergola in Broward County?

The city the property is in. Broward's Building Code Division only permits unincorporated areas, the Broward Municipal Services District and cities that contract with it. Every Broward permit follows the High Velocity Hurricane Zone rules and the interpretations of the county's Board of Rules and Appeals.

The [Broward County Building Code Division](${BROWARD}) explains which areas it serves directly. The [Board of Rules and Appeals](${BORA}), known as BORA, is what makes Broward different from most of Florida: it adopts local amendments and issues formal interpretations of the Florida Building Code that every building official in the county applies, so a question settled in Fort Lauderdale is settled the same way in Weston.

As in Miami-Dade, plans for a permanent pergola are signed and sealed by a Florida-licensed engineer, and the aluminum system carries a [Florida product approval](${FPA}) or a Miami-Dade Notice of Acceptance. Our pages for [Fort Lauderdale](ref:city-fort-lauderdale-installation), [Coral Springs](ref:city-coral-springs-installation), [Parkland](ref:city-parkland-installation), [Pembroke Pines](ref:city-pembroke-pines-pergola-installation), [Weston](ref:city-weston-pergola-solutions) and the other Broward cities cover what each local department asks for.`,
  es: `## ¿Quién da el permiso de una pérgola en el condado de Broward?

La ciudad donde está la propiedad. La Building Code Division de Broward solo permisa las zonas no incorporadas, el Broward Municipal Services District y las ciudades que la contratan. Todo permiso en Broward sigue las reglas de la High Velocity Hurricane Zone y las interpretaciones del Board of Rules and Appeals del condado.

La [Building Code Division del condado de Broward](${BROWARD}) explica a qué zonas da servicio directo. El [Board of Rules and Appeals](${BORA}), conocido como BORA, es lo que distingue a Broward de casi toda Florida: adopta enmiendas locales y emite interpretaciones formales del Florida Building Code que aplica cada funcionario de construcción del condado, así que una duda resuelta en Fort Lauderdale se resuelve igual en Weston.

Como en Miami-Dade, los planos de una pérgola permanente los firma y sella un ingeniero con licencia de Florida, y el sistema de aluminio tiene una [aprobación de producto de Florida](${FPA}) o una Notice of Acceptance de Miami-Dade. Nuestras páginas de [Fort Lauderdale](ref:city-fort-lauderdale-installation), [Coral Springs](ref:city-coral-springs-installation), [Parkland](ref:city-parkland-installation), [Pembroke Pines](ref:city-pembroke-pines-pergola-installation), [Weston](ref:city-weston-pergola-solutions) y las demás ciudades de Broward cuentan qué pide cada departamento local.`,
};

T['county-palm-beach-county-pergola-contractor'] = {
  en: `## Is Palm Beach County in the High Velocity Hurricane Zone?

No. The Florida Building Code limits the High Velocity Hurricane Zone to Broward and Miami-Dade. Palm Beach County pergolas are still engineered for Florida Building Code wind speeds, which are high along the coast, and use systems with a Florida product approval.

In unincorporated Palm Beach County, permits come from the Building Division of the county's Planning, Zoning and Building Department, through its [Permit Center](${PBC}). Inside a municipality, the city's own building department issues the permit, and many of them add steps of their own: design review in the Town of Palm Beach, historic certificates in Delray Beach and West Palm Beach, separate accessory-structure permits in Palm Beach Gardens.

Product approvals can be checked in the [Florida Building Commission's product approval search](${FPA}). We are based in Boca Raton, and most of our published projects are in this county, from [Boca Raton](ref:city-boca-raton-pergola-contractor) and [Delray Beach](ref:city-delray-beach-contractors) to [Wellington](ref:city-wellington-contractors), [Palm Beach Gardens](ref:city-palm-beach-gardens) and [Jupiter](ref:city-jupiter-contractors). Each city page explains what its building department asks for.`,
  es: `## ¿El condado de Palm Beach está en la High Velocity Hurricane Zone?

No. El Florida Building Code limita la High Velocity Hurricane Zone a Broward y Miami-Dade. Las pérgolas del condado de Palm Beach se calculan igualmente para las velocidades de viento del Florida Building Code, que son altas junto a la costa, y usan sistemas con aprobación de producto de Florida.

En el condado de Palm Beach no incorporado, los permisos los da la Building Division del Planning, Zoning and Building Department del condado, a través de su [Permit Center](${PBC}). Dentro de un municipio, el permiso lo emite el departamento de construcción de la ciudad, y muchos añaden pasos propios: revisión de diseño en el Town of Palm Beach, certificados históricos en Delray Beach y West Palm Beach, permisos aparte para estructuras accesorias en Palm Beach Gardens.

Las aprobaciones de producto se pueden comprobar en el [buscador de la Florida Building Commission](${FPA}). Tenemos nuestra base en Boca Raton, y la mayoría de nuestros proyectos publicados están en este condado, de [Boca Raton](ref:city-boca-raton-pergola-contractor) y [Delray Beach](ref:city-delray-beach-contractors) a [Wellington](ref:city-wellington-contractors), [Palm Beach Gardens](ref:city-palm-beach-gardens) y [Jupiter](ref:city-jupiter-contractors). Cada página de ciudad explica qué pide su departamento de construcción.`,
};

// Comprobación: la respuesta (primer párrafo tras la pregunta) <= 60 palabras; ninguna ciudad sin enlace.
const salida = {};
for (const [id, t] of Object.entries(T)) {
  for (const [i, md] of Object.entries(t)) {
    const resp = md.split(/\n\s*\n/)[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const n = resp.trim().split(/\s+/).length;
    if (n > 60) throw new Error(`${id} ${i}: respuesta de ${n} palabras`);
    if (!/\]\(/.test(md)) throw new Error(`${id} ${i}: sin enlaces`);
    if (!md.split('\n')[0].endsWith('?')) throw new Error(`${id} ${i}: el H2 no es pregunta`);
  }
  salida[`@${id}`] = { local: t };
}
fs.writeFileSync(process.argv[2], JSON.stringify(salida, null, 1) + '\n');
console.log(Object.keys(salida).length, 'documentos');
