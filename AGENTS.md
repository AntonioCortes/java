# Guía de Desarrollo y Contexto del Proyecto (`AGENTS.md`)

## 1. ¿De qué va este proyecto?

Esta página web es una **SPA (Single Page Application)** de documentación y apuntes técnicos sobre **Java y su ecosistema** (Java SE, Spring Boot, Maven, Gradle, Librerías como Lombok/Hibernate/Apache HTTP Client y Patrones de Diseño). También puede ejecutarse como aplicación de escritorio mediante Electron (`npm start`, ver [ELECTRON.md](./ELECTRON.md)).

A nivel técnico, la web está construida sobre la plantilla base **`base-webpage`** (`https://antoniocortes.github.io/base-webpage/`), que utiliza:
- **WebComponents nativos** generados dinámicamente mediante `createComponent`.
- **Generación automática de navegación** (`Navbar` y `Sidebar`) a partir de archivos de configuración JSON.
- **Bootstrap 5.1**, **Bootstrap Icons 1.7.0**, **jQuery 3.6.0** y **Highlight.js 11.3.1** (tema Monokai con botón de copiado).

---

## 2. Anatomía y Estructura del Proyecto

La aplicación se divide en los siguientes conceptos clave:

- **Vista (`Navbar`)**: Cada enlace de la barra superior (`Java`, `Spring Boot`, `Maven`, `Gradle`, `Librerías`, `Patrones de Diseño`). Engloba un `sidebar` propio y múltiples `contenidos`. La vista que se carga por defecto al abrir la web es la que tiene la clave `"mainView"` en `components/common/assets/constants.json`.
- **Icono de la vista**: Archivo SVG en `components/<vista>/common/assets/img/logo.svg` que cambia en el navbar según la vista activa.
- **Sidebar**: Menú lateral de la vista activa definido en `components/<vista>/common/assets/sidebar.json`. Se divide en dos zonas:
  1. `pageContent`: Enlaces internos a los WebComponents de la vista (permite submenús desplegables anidados recursivamente). Al cambiar de vista se carga automáticamente el **primer componente** listado en su `sidebar.json`.
  2. `links`: Enlaces externos a páginas de documentación oficial.
- **Contenido (`Componente`)**: Cada tema concreto que se renderiza en la zona principal (`<main id="content">`). Está formado por una carpeta con un archivo `.html`, un archivo `.js` que registra el WebComponent y, opcionalmente, una carpeta `assets/` (`img/`, `gif/`).

### Estructura de carpetas

```text
/
├── components/
│   ├── common/
│   │   ├── assets/
│   │   │   ├── constants.json       # Configuración global del Navbar (Vistas)
│   │   │   └── svg/simple-arrow.svg
│   │   ├── navbar.html              # NO MODIFICAR
│   │   └── sidebar.html             # NO MODIFICAR
│   └── <vista>/                     # Ej: java, springboot, maven, gradle, librerias, design-patterns
│       ├── common/
│       │   └── assets/
│       │       ├── img/logo.svg     # Icono que se muestra en el Navbar para esta vista
│       │       └── sidebar.json     # Configuración del menú lateral de esta vista
│       └── <contenido>/             # Puede estar agrupado en subcarpetas temáticas
│           ├── assets/              # Opcional: img/ o gif/ propios de este componente
│           ├── <contenido>.html     # HTML que se inyecta en la zona principal
│           └── <contenido>.js       # Registro del WebComponent
├── js/
│   └── components-imports.js        # Archivo donde se importan TODOS los .js de los componentes
├── index.html                       # HTML principal de la SPA (NO MODIFICAR)
└── README.md
```

> **Archivos que NO se deben modificar**: `index.html`, `components/common/navbar.html` y `components/common/sidebar.html`.

---

## 3. Cómo añadir contenido a la página

### A. Crear un nuevo Contenido (Componente) dentro de una Vista

1. **Crear la carpeta y los archivos del componente**:
   Dentro de `components/<vista>/.../<nuevo-contenido>/`, crear `<nuevo-contenido>.html` y `<nuevo-contenido>.js` (y la carpeta `assets/img/` o `assets/gif/` si necesita imágenes).

2. **Definir el WebComponent en `<nuevo-contenido>.js`**:
   Usar **siempre** esta plantilla exacta sustituyendo `tagName` y `htmlFilename`:
   ```javascript
   import { createComponent } from "https://antoniocortes.github.io/base-webpage/js/component-generator.js";

   const tagName = 'component-<vista>-<ruta>-<nuevo-contenido>';
   const htmlFilename = '<nuevo-contenido>.html';

   const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
   createComponent(tagName, baseUrl + htmlFilename);
   ```
   - **Regla para `tagName`**: Debe empezar **siempre** por la palabra `component-` seguida de la ruta lógica en kebab-case (por ejemplo: `'component-springboot-capas-principales-controladores-controlador-rest'`).

3. **Importar el componente en `js/components-imports.js`**:
   Añadir el `import` con ruta relativa en la sección correspondiente del archivo `js/components-imports.js`:
   ```javascript
   import '../components/<vista>/<ruta>/<nuevo-contenido>/<nuevo-contenido>.js';
   ```

4. **Añadir el enlace en el Sidebar de la vista (`components/<vista>/common/assets/sidebar.json`)**:
   - **Enlace directo** dentro de `pageContent`:
     ```json
     {
         "text": "Texto visible en el sidebar",
         "content": "component-<vista>-<ruta>-<nuevo-contenido>"
     }
     ```
   - **Submenú desplegable** (anidable recursivamente cambiando `content` por una lista y añadiendo `contentId`):
     - **IMPORTANTE sobre `"text"` en submenús desplegables**: El valor de `"text"` de un submenú desplegable **NUNCA debe contener barras `/` ni caracteres especiales** (como `()`, `.`, `:`), ya que `sidebar.js` construye el selector `id` del desplegable de Bootstrap a partir de `"text"` y una barra `/` rompe el selector CSS impidiendo que el submenú se despliegue.
     ```json
     {
         "text": "Nombre del Submenú",
         "contentId": "identificadorUnico",
         "content": [
             {
                 "text": "Texto visible en el sidebar",
                 "content": "component-<vista>-<ruta>-<nuevo-contenido>"
             }
         ]
     }
     ```
   - **Enlaces a documentación externa** (dentro de la lista `links` al final del `sidebar.json`):
     ```json
     {
         "text": "Página oficial",
         "href": "https://url-documentacion-oficial.com"
     }
     ```

### B. Crear una nueva Vista (Nuevo apartado en el Navbar)

1. Crear la estructura `components/<nueva-vista>/common/assets/img/logo.svg` y `components/<nueva-vista>/common/assets/sidebar.json`.
2. Crear al menos un componente dentro de `components/<nueva-vista>/` y enlazarlo en el primer lugar de `sidebar.json`.
3. Registrar la vista en `components/common/assets/constants.json`:
   ```json
   "identificadorUnicoVista": {
       "topic": "Nombre en el Navbar",
       "basePath": "components/<nueva-vista>"
   }
   ```

---

## 4. Reglas de Estilo y Maquetación HTML

En todos los archivos `.html` de los componentes se deben respetar estrictamente estas convenciones visuales:

1. **Título principal del componente**:
   Siempre en la primera línea con la clase `title`:
   ```html
   <h1 class="title">Título Principal del Tema</h1>
   ```

2. **Bloques de código**:
   - Estructura obligatoria: `<div class="center-horizontal"><pre><code class="language-<lenguaje>">...</code></pre></div>`.
   - **IMPORTANTE (Indentación)**: Las etiquetas `<div class="center-horizontal">`, `<pre><code ...>` y `</code></pre>` **no deben tener tabulaciones a la izquierda** para evitar que Highlight.js renderice espacios en blanco de más en el bloque de código.
   - **IMPORTANTE (Escapado HTML)**: Dentro de `<code>`, escapar **siempre** los símbolos `<` y `>` como `&lt;` y `&gt;` (muy habitual en genéricos de Java como `ResponseEntity&lt;PetDTO&gt;`, `List&lt;Pet&gt;`, `Optional&lt;Pet&gt;` o en etiquetas XML de Maven como `&lt;dependency&gt;`).
   ```html
   <div class="center-horizontal">
   <pre><code class="language-java">
   public class Ejemplo {
       public ResponseEntity&lt;PetDTO&gt; obtener() {
           // ...
       }
   }
   </code></pre>
   </div>
   ```
   - **IMPORTANTE (Alineación estricta entre el código y la clase de lenguaje `language-<lenguaje>`)**:
     El valor indicado en `language-<lenguaje>` DEBE coincidir con total precisión con el lenguaje o formato real del fragmento de código.
     - **Por qué es crítico**: Highlight.js (tema Monokai) aplica gramáticas y esquemas de color específicos para cada analizador léxico. Si un fragmento es JSON, XML, YAML o SQL y se marca erróneamente como `language-java` (o viceversa), el resaltador interpreta mal los tokens y colorea con tonalidades incorrectas, discordantes o "colores feos".
     - **Mapeo exacto de lenguajes**:
       - `language-java`: Exclusivamente para clases, interfaces, records, métodos, anotaciones o código Java.
       - `language-xml`: Para archivos `pom.xml` de Maven o configuraciones XML.
       - `language-groovy`: Para scripts de Gradle (`build.gradle`).
       - `language-json`: Para cuerpos de petición/respuesta HTTP, payloads o estructuras JSON.
       - `language-yaml`: Para archivos `application.yml` o configuraciones YAML.
       - `language-properties`: Para archivos `application.properties` (`clave=valor`).
       - `language-bash`: Para comandos de terminal, shell o consola (`mvn clean install`, `curl`, `./gradlew`, `docker`).
       - `language-sql`: Para consultas y sentencias SQL (`SELECT`, `INSERT`, `UPDATE`, `CREATE TABLE`).
   - Lenguajes habituales para la clase: `language-java`, `language-xml`, `language-groovy`, `language-json`, `language-properties`, `language-yaml`, `language-bash`, `language-sql`.

3. **Tablas**:
   Deben llevar siempre las clases `table table-striped table-hover`:
   ```html
   <table class="table table-striped table-hover">
       <thead>
           <tr>
               <th scope="col">Columna 1</th>
               <th scope="col">Columna 2</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>Valor 1</td>
               <td>Valor 2</td>
           </tr>
       </tbody>
   </table>
   ```

4. **Imágenes y GIFs**:
   Deben llevar la clase `center-horizontal` y apuntar a la ruta desde la raíz del proyecto:
   ```html
   <img class="center-horizontal" src="components/<vista>/<contenido>/assets/img/ejemplo.png">
   ```

5. **Pies de figura / Textos explicativos (debajo de tablas, imágenes, diagramas)**:
   Usar un `<span>` con las clases `center-horizontal caption`:
   ```html
   <span class="center-horizontal caption">Descripción de la tabla o figura</span>
   ```

---

## 5. Estructura Didáctica y Estilo de las Explicaciones

Al redactar o completar cualquier componente (tomando como referencia `controlador-rest.html` y `dto.html` en `components/springboot/capas-principales/`), el contenido debe ser **exhaustivo, didáctico y práctico**, siguiendo esta estructura y nivel de detalle:

### 5.1. Qué es, para qué sirve, cuándo usarlo y cuándo NO usarlo
- **¿Qué es y para qué sirve?**: Empezar explicando de forma clara y directa qué es el concepto/capa/librería/herramienta que se aborda, qué problema resuelve dentro de la arquitectura y cuál es su funcionamiento base.
- **Analogía del mundo real**: Siempre que sea posible (especialmente en patrones de diseño, conceptos de concurrencia o herramientas de construcción como Gradle/Maven), incluir una breve analogía de la vida cotidiana (ej. torre de control para Singleton, robot de cocina para Gradle, mostrador de paquetería para Factory) que fije la intuición conceptual antes de entrar en código.
- **Caso de uso real estructurado (Contexto, El Problema y La Solución)**:
  - **Contexto**: Situación práctica o escenario del proyecto (ej. gestión de inventario, multicanal de notificaciones, conexión a BD).
  - **El Problema (Sin la solución)**: Qué consecuencias técnicas o fallos ocurren si se hace a mano o sin la herramienta/patrón.
  - **La Solución (Con la solución)**: Cómo la herramienta, capa o patrón resuelve el problema con elegancia.
- **¿Cuándo usarlo y cuándo NO usarlo?**: Incluir siempre un apartado o tabla comparativa detallando:
  - **Cuándo usarlo**: Escenarios ideales y casos donde aporta valor real.
  - **Cuándo NO usarlo**: Casos donde su uso es contraproducente, penaliza el rendimiento, rompe el diseño o existen alternativas mejores (por ejemplo, cuándo no usar `@Data` en entidades JPA con relaciones bidireccionales, cuándo no usar `LOOSE` en ModelMapper, cuándo no usar `ddl-auto=update` con Flyway, cuándo no abusar de patrones complejos como Abstract Factory para 2 clases sencillas, etc.).

### 5.2. Dependencias necesarias (Maven y Gradle)
- Siempre que el tema o las librerías tratadas requieran dependencias externas o starters específicos (por ejemplo, `spring-boot-starter-web`, `spring-boot-starter-validation`, `spring-boot-starter-security`, `jackson-databind`, `lombok`, `springfox`/`springdoc-openapi`, `modelmapper`, etc.):
  1. Indicar claramente **qué dependencia o librería es necesaria** y para qué funcionalidad se requiere.
  2. Incluir los bloques de código con lo que hay que añadir tanto en **Maven (`pom.xml` con `language-xml`)** como en **Gradle (`build.gradle` con `language-groovy`)**.

### 5.3. Explicación detallada de Anotaciones, Clases y Métodos
Cuando se expliquen anotaciones, interfaces o utilidades, **agruparlas por librería o propósito** mediante subtítulos `<h2>` (ej. *"Anotaciones propias de Spring Framework"*, *"Anotaciones de Jackson"*, *"Anotaciones de Javax/Jakarta Validation Constraints"*, *"Anotaciones para documentación Swagger"*, *"Anotaciones de Lombok"*).

Para **cada anotación o elemento** dentro de una lista `<ul>`, incluir siempre:
1. **Nombre en negrita**: `<li><b>@NombreAnotacion:</b> ...</li>`.
2. **Librería / Framework al que pertenece**: Especificar explícitamente si es propia de *Spring Framework*, *Jackson*, *Lombok*, *SpringFox / Swagger*, *Jakarta/Javax Validation*, *JPA*, etc.
3. **Paquete exacto**: Indicar el paquete completo donde se ubica (ej. *"se encuentra en el paquete `org.springframework.web.bind.annotation.RestController`"* o *"`com.fasterxml.jackson.annotation.JsonInclude`"*).
4. **Explicación funcional y comportamiento por defecto**:
   - Para qué sirve exactamente y qué problema soluciona.
   - Comportamiento por defecto (ej. por qué Spring bloquea CORS si no se usa `@CrossOrigin`, o cómo se llaman las propiedades del JSON por defecto si no se usa `@JsonProperty`).
   - Detalles de versión o evolución relevantes (ej. a partir de qué versión de Spring se introdujo o dejó de ser obligatorio `@Autowired` en constructores).
5. **Dónde se aplica y buenas prácticas**:
   - Indicar si se coloca sobre la clase, sobre un atributo, sobre un método, sobre el constructor o sobre un parámetro.
   - Explicar qué cambia según dónde se coloque (ej. `@CrossOrigin` a nivel de clase frente a nivel de método) y mencionar las recomendaciones de diseño (ej. inyección por constructor recomendada frente a inyección por atributo).
6. **Parámetros, opciones de configuración y Enums**:
   - Si la anotación recibe parámetros (`value`, `required`, `origin`, `ignoreUnknown`, `pattern`, `regexp`, etc.) o utiliza un `enum` (como `JsonInclude.Include` o `CascadeType`), **desglosar todas sus opciones en una sublista `<ul>`** explicando cada valor en detalle (`ALWAYS`, `NON_NULL`, `NON_ABSENT`, `NON_EMPTY`, `NON_DEFAULT`, etc.).
   - Incluir un pequeño ejemplo práctico de uso o combinación de rutas/parámetros (por ejemplo, mostrar conjuntamente la *Anotación previa*, la *Ruta HTTP* y la *Anotación en el parámetro*).

### 5.4. Organización por partes de la clase y Casos de Uso
En temas que representen componentes de código (como Controladores, Servicios, Entidades o DTOs), estructurar el documento de arriba a abajo siguiendo la anatomía real de la clase:
1. **Nivel de Clase / Cabecera**: Anotaciones de definición de clase + bloque de código de ejemplo.
2. **Atributos Globales / Dependencias**: Inyección de servicios, mappers, loggers (`SLF4J`) + bloque de código de ejemplo.
3. **Métodos / Operaciones**:
   - Explicar las anotaciones de nivel de método y parámetro.
   - Desglosar cada caso de uso en su propia subsección (`<h3>GET</h3>`, `<h3>POST</h3>`, `<h3>PATCH</h3>`, `<h3>DELETE</h3>`, etc.).
   - Antes de cada ejemplo de código, **explicar conceptualmente cuándo y cómo se usa** (por ejemplo, la diferencia entre buscar con un filtro por query param `/petshop/pet/all?age=4` frente a buscar un recurso por ID en la ruta `/petshop/pet/15`, qué códigos de estado HTTP devuelve y por qué).

### 5.5. Ejemplos y Contraejemplos completos y explicados
- **Incluir siempre Ejemplos (Buenas prácticas) y Contraejemplos (Malas prácticas / Errores comunes)**:
  - **Ejemplo (Cómo hacerlo bien)**: Código aplicando correctamente la librería, anotación o patrón.
  - **Contraejemplo (Cómo NO hacerlo / Qué problema evita)**: Código que muestra el antipatrón, el error frecuente o el código repetitivo/problemático que se produce al usar mal la herramienta (por ejemplo, bucles infinitos `StackOverflowError` con `@ToString` / `@Data` en relaciones JPA, sobrescritura de campos con `null` en un `PATCH` si no se configura `setSkipNullEnabled(true)` en ModelMapper, fugas de conexiones en Apache HttpClient si no se cierra `CloseableHttpResponse`, etc.), explicando claramente por qué falla y cómo lo corrige el ejemplo bueno.
- **Ningún ejemplo o contraejemplo de código debe quedar suelto o sin explicación**: Cada bloque `<pre><code>` debe tener una introducción o explicación que describa qué hace ese fragmento paso a paso (validaciones, llamadas al servicio, mapeo entre entidad y DTO, construcción de cabeceras `Location` con `ServletUriComponentsBuilder`, códigos de respuesta `ResponseEntity` y `HttpStatus`, etc.).
- **Demostración y salida por consola**: En patrones de diseño o scripts de comandos (Maven, Gradle, Java SE), acompañar la clase de prueba o comando con un bloque de salida esperada por consola comentada, demostrando qué ocurre cuando el código se ejecuta.
- **Dominio de ejemplo coherente**: Siempre que sea posible en las capas de Spring Boot / Java, mantener la coherencia con el dominio de ejemplo de la tienda de mascotas (`Pet`, `PetDTO`, `PetPatchDTO`, `PetController`, `PetService`, `PetRepository`) para que todos los apartados conecten entre sí.
- **No dejar `TODO:` pendientes**: Cuando se cree un componente nuevo o se pida completar uno existente, desarrollar todas las explicaciones de las anotaciones y de los ejemplos sin dejar marcadores `TODO:`.

### 5.6. Diagramas
- **Cuándo incluirlos**: Siempre que ayuden a entender el tema (arquitecturas, flujos entre capas o microservicios, jerarquías de clases, patrones de diseño, ciclos de vida).
- **Idioma**: Todo el texto del diagrama (títulos, nombres de cajas, etiquetas de flechas, leyenda) debe estar **en español**. Los nombres de clases, interfaces y métodos del código se mantienen tal cual están en Java.
- **Diagramas de clases (UML)**: Cada clase debe indicar **de qué tipo es** mediante un estereotipo visible en la propia caja:
  - `«interfaz»` para interfaces, `«clase abstracta»` para clases abstractas (con el nombre en cursiva), `«enumeración»` para enums, `«record»` para records y `«clase»` para las clases concretas normales.
  - Las flechas deben distinguir y etiquetar la relación: *implementa*, *extiende*, *usa / depende de*, *agregación* y *composición*.
- **Diagramas de arquitectura**: Cada caja debe indicar **qué es** con una etiqueta o estereotipo, por ejemplo: `«microservicio»`, `«API Gateway»`, `«servidor Eureka»`, `«base de datos»`, `«cola de mensajes (RabbitMQ)»`, `«cliente / front-end»`, `«servidor de configuración»`, `«capa de controladores»`, `«capa de servicio»`, `«capa de repositorio»`. Las flechas deben llevar la etiqueta del protocolo o acción (por ejemplo, *HTTP/REST*, *consulta SQL*, *publica mensaje*).
- **Leyenda**: Si el diagrama usa colores, formas o tipos de flecha con significado, incluir una pequeña leyenda dentro de la imagen explicando qué representa cada uno.
- **Formato y ubicación**: La web no carga ninguna librería de diagramas en el navegador (no usar bloques Mermaid dentro del `.html`). Se genera la imagen (preferiblemente `.svg`, o `.png`) y se guarda en `components/<vista>/<contenido>/assets/img/`, insertándola con el formato de imágenes de la sección 4 y su pie de figura.
- **Explicación asociada**: Tras cada diagrama, incluir una tabla de participantes (`table table-striped table-hover`) con el rol, el tipo (interfaz, clase abstracta, microservicio, etc.) y la responsabilidad de cada elemento, tal y como se hace en los ejemplos de `components/design-patterns/ejemplos/`.

### 5.7. Uso Obligatorio de Lombok en Ejemplos de Spring Boot
Todos los ejemplos de código Java en la sección de Spring Boot DEBEN utilizar **Project Lombok** para eliminar código repetitivo (*boilerplate*), empleando el conjunto completo y coherente de anotaciones que requiera cada tipo de clase:
- **Entidades JPA (`@Entity`)**:
  - Utilizar `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`.
  - Si se usa `@Builder`, incluir SIEMPRE `@NoArgsConstructor` (obligatorio por la especificación de persistencia JPA) y `@AllArgsConstructor` (requerido por Lombok para que `@Builder` compile).
  - En `@ToString` y `@EqualsAndHashCode`: en entidades relacionales con colecciones o relaciones bidireccionales (`@OneToMany`, `@ManyToOne`), excluir siempre las relaciones (`@ToString.Exclude`, `@EqualsAndHashCode.OnlyExplicitlyIncluded` con `@EqualsAndHashCode.Include` sobre el `@Id`) o no usar `@Data` para evitar bucles infinitos `StackOverflowError` y desincronizaciones de proxys de Hibernate.
- **DTOs / Clases de Datos (cuando no se usen Records de Java)**:
  - Usar `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder` (o `@Value` para inmutabilidad).
- **Servicios y Controladores**:
  - Inyección de dependencias por constructor: usar `@RequiredArgsConstructor` sobre la clase, declarando las dependencias como `private final`.
  - Logging: usar `@Slf4j` sobre la clase en lugar de instanciar manualmente `LoggerFactory.getLogger(...)`.
- **Prohibición de boilerplate**:
  - NO escribir getters, setters, constructores manuales o loggers manuales si pueden ser generados limpiamente por Lombok.

---

## 6. Comunicación del Asistente: Modo Caveman Permanente

Para **ahorrar tokens**, agilizar las interacciones y maximizar la ventana de contexto útil en todas las sesiones de trabajo, el agente DEBE seguir de forma obligatoria estas directrices de comunicación:

1. **Estilo Caveman (Cavernícola) por defecto**:
   - Responder siempre con frases cortas, directas, estilo telegráfico o cavernícola.
   - Eliminar saludos, despedidas, fórmulas de cortesía, preámbulos innecesarios y resúmenes redundantes.
2. **Máxima precisión técnica**:
   - Brevedad no significa imprecisión: conservar siempre nombres exactos de clases, métodos, comandos, paquetes, puertos y configuraciones.
3. **Enlaces clickables obligatorios**:
   - Incluir siempre enlaces clickables en formato Markdown con esquema `file:///` para cada archivo o símbolo creado, editado o mencionado (ej. `[archivo.html](file:///ruta/completa/archivo.html)`).
4. **Distinción entre Chat y Contenido de la Web**:
   - **En el chat con el usuario**: Usar siempre estilo Caveman conciso para ahorrar tokens.
   - **En los archivos `.html` de la web**: El contenido inyectado en los componentes debe ser **100% didáctico, exhaustivo, profesional y formal**, respetando rigurosamente todas las reglas de estructura de las secciones 4 y 5.

---

## 7. Uso Obligatorio y Automático de Skills del Proyecto (`.agents/skills/`)

El agente DEBE seleccionar, activar y aplicar de manera **100% automática, contextual y proactiva** (sin requerir que el usuario lo pida en el chat) la skill especializada adecuada de `.agents/skills/` según la naturaleza de cada tarea, **usando únicamente la que corresponda a cada ámbito y no todas a la vez indiscriminadamente**:
- **`java-expert`**: Usar en tareas de Java SE puro, sintaxis moderna (Java 17/21+), POO, records, pattern matching, concurrencia y streams.
- **`spring-boot-expert`**: Usar en arquitectura de Spring Boot, controladores, servicios, inyección por constructor, configuración y manejo de excepciones RFC 7807.
- **`spring-data-jpa-expert`**: Usar en persistencia relacional (JPA, Hibernate, PostgreSQL, particularidades de Oracle) o NoSQL (MongoDB), consultas, optimización N+1 y transacciones.
- **`testing-expert`**: Usar en pruebas unitarias, de integración, slice tests (`@DataJpaTest`, `@WebMvcTest`), mocks con Mockito, aserciones con AssertJ y Testcontainers.
- **Cualquier skill futura**: Usar según su especialidad declarada.

*Nota de combinación*: Si una tarea involucra varios ámbitos a la vez (por ejemplo, implementar persistencia con JPA y escribir su test de integración), se combinan de forma natural solo las skills pertinentes (`spring-data-jpa-expert` + `testing-expert`), sin forzar skills ajenas.



