# Redactívate · Buscador de buenas prácticas patrimoniales

**Versión 2 · Prototipo para el Instituto Andaluz del Patrimonio Histórico (IAPH)**

Web responsive desarrollada en HTML, CSS y JavaScript, preparada para publicarse en GitHub Pages y para su posible adaptación como frontend dentro del portal institucional en Drupal. Conserva la parte divulgativa de Redactívate y añade un **buscador documental de 107 iniciativas**, con fichas individuales.

## Alcance de los requisitos

**Primer nivel — `index.html`, sección «Buscador».** Introducción, campo de búsqueda libre, filtro por provincia (selector dinámico que admite futuras iniciativas nacionales), filtro por año de edición (2018, 2021, 2023, 2025 y «Sin año indicado») y filtro por seis descriptores:

1. Innovación y creatividad.
2. Educación patrimonial.
3. Implicación de la comunidad.
4. Inclusividad y diversidad.
5. Investigación aplicada al territorio.
6. Sostenibilidad y trayectoria.

La lista admite clasificación y carga progresiva. Cada iniciativa conduce al **segundo nivel**.

**Segundo nivel — `ficha.html?id=red-001`.** Título, espacio de fotografía, temática/descriptores, resumen o descripción procedente del Excel, enlaces complementarios, espacio de publicaciones y localización mediante Google Maps (carga voluntaria) y enlace a OpenStreetMap. La ficha indica cuando el punto es aproximado. Fotografías y publicaciones vacías se muestran como pendientes, nunca como datos inventados.

Se conserva la presentación general del proyecto, la cronología de las cuatro ediciones y los documentos de 2025 que se proporcionaron anteriormente.

## Datos importados

El inventario deriva de `Encuentros Patrimonio de Proximidad.xlsx`:

| Edición | Fichas |
|---|---:|
| 2018 | 32 |
| 2021 | 19 |
| 2023 | 23 |
| 2025 | 26 |
| Sin año en origen | 7 |
| **Total** | **107** |

- `assets/data/iniciativas.json` contiene las 107 fichas en un formato de intercambio.
- `assets/js/datos.js` ofrece la misma información sin necesitar un servidor de datos; por tanto `index.html` y `ficha.html` funcionan localmente.
- **No se han exportado los correos personales** presentes en el Excel porque no forman parte de las fichas solicitadas.
- Se respetan las localidades, los años y las descripciones del archivo de origen, aunque existan datos por revisar. Las etiquetas temáticas se han normalizado a los seis descriptores solicitados, conservando el texto original en cada registro.
- La información complementaria contiene enlaces http(s) reconocibles. Se excluyen rutas locales `file://` y textos sin URL verificable. No se garantiza que todos los enlaces externos estén activos o autorizados para su publicación.

Consulta `REVISION_EDITORIAL.md` antes de autorizar su publicación institucional.

## Publicación en GitHub Pages

1. Descomprime el ZIP y copia el contenido de esta carpeta a la **raíz** del repositorio (`index.html` debe quedar en la raíz).
2. En GitHub entra en **Settings → Pages → Deploy from a branch**, selecciona rama `main` y carpeta `/ (root)`.
3. La web quedará accesible en la URL de GitHub Pages de ese repositorio. La ruta `ficha.html?id=red-001` sirve para abrir una ficha concreta.

No necesita npm, base de datos ni compilación. Para abrirla localmente, puedes hacer doble clic en `index.html`. También puedes usar `python -m http.server 8000`.

## Integración con WordPress y Drupal

El documento `Web_Redactivate.odt` plantea **gestionar contenidos en WordPress y mostrarlos en el portal corporativo Drupal**. Son dos sistemas distintos: la integración definitiva requiere decidir quién será el propietario de los datos, contar con permisos técnicos y definir una sincronización o API entre ambos. Este ZIP **no instala ni modifica WordPress o Drupal**.

Incluimos una **base técnica opcional** en `wordpress-plugin/redactivate-catalogo.php` (borrador sujeto a revisión de Informática):

- Tipo de contenido WordPress «Buenas prácticas» con fotografía destacada, título, descripción y campos de localidad, dirección, enlaces y publicaciones.
- Taxonomías editables de provincia, edición y temática.
- Endpoint público de solo lectura `GET /wp-json/redactivate/v1/iniciativas` para que un frontend Drupal pueda obtener las fichas.
- Importación inicial de los 107 registros en **borrador** mediante WP-CLI, para validación antes de publicarlos.

**Flujo técnico propuesto:** `Excel → importación WordPress → validación editorial → API REST/sincronización aprobada por Informática → visualización en Drupal`.

Si se elige la vía de API REST, el archivo `assets/js/config.js` permite especificar `window.REDACTIVATE_API_URL`. Con esa URL, el catálogo intenta obtener los datos actualizados de WordPress; si falla, utiliza el inventario estático. **La seguridad, CORS, integración con plantillas Drupal, caché y protección de datos deben aprobarse e implementarse por el equipo técnico institucional.** Como alternativa, WordPress puede exportar un JSON periódico para su alojamiento y consumo dentro de Drupal, sin CORS externo.

Para importar registros en un WordPress de pruebas tras instalar/activar el plugin:

```bash
wp redactivate importar /ruta/absoluta/iniciativas.json
```

Revisar los borradores, sus clasificaciones y las imágenes antes de hacerlos públicos. El módulo no ha sido probado dentro de una instalación WordPress institucional.

## Mapa y privacidad

Se muestra una **localización orientativa por dirección o municipio** del inventario; no se inventan coordenadas ni se afirma que los datos proporcionados correspondan al lugar exacto de la experiencia. Por privacidad, el mapa embebido de Google no carga hasta que la persona pulsa el botón para activarlo. Hay un enlace a OpenStreetMap como alternativa. Para uso oficial, se recomienda que Informática determine un proveedor cartográfico y revise accesibilidad, cookies y privacidad.

## Estructura de archivos

```
index.html                      # Portada, historia, buscador, programa y recursos
ficha.html                      # Plantilla del segundo nivel
assets/css/styles.css           # Identidad visual de Redactívate
assets/css/catalogo.css        # Diseño del catálogo y las fichas
assets/js/app.js                # Interactividad general de ediciones y programa
assets/js/catalogo.js           # Buscador, filtros, tarjetas y paginación
assets/js/ficha.js              # Datos y mapa de fichas
assets/js/datos.js              # Datos locales de las 107 iniciativas
assets/js/config.js             # Configuración opcional de API
assets/js/fuente.js             # Selección entre API y datos locales
assets/data/iniciativas.json    # Fuente intercambiable e importable
assets/img/                    # Recursos gráficos proporcionados
assets/docs/                   # Materiales PDF de 2025
wordpress-plugin/              # Propuesta WordPress para Informática
REVISION_EDITORIAL.md           # Informe de campos y datos pendientes
```

**Estado:** prototipo funcional de frontend y modelo de integración WordPress; pendiente de validación editorial, de permisos de uso y de despliegue oficial en el IAPH.
