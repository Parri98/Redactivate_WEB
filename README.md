# Redactívate · Catálogo, mapas y fotografías

**Versión 3 · Prototipo web para revisión del IAPH · 21 de octubre de 2026**

Proyecto estático **HTML + CSS + JavaScript**, sin compilación ni instalación, preparado para GitHub Pages. Procede de la versión anterior y conserva la portada, el proyecto, las cuatro ediciones y la documentación del IV Encuentro (2025).

## Novedades de esta versión

- **107 fichas** importadas de `Encuentros Patrimonio de Proximidad.xlsx`, con los filtros por provincia, edición y seis temáticas establecidos en `Web_Redactivate.odt`.
- **Mapa interactivo** en la sección «Buscador»: cambiar entre tarjetas y mapa, filtrar con los mismos controles, pulsar puntos para ver títulos y acceder a fichas. Agrupa en un mismo marcador las experiencias de una localidad. Colores por edición; si coinciden varias, un color compartido.
- **Galerías fotográficas** en fichas con imágenes, con ampliación, flechas siguiente/anterior y teclado. Tarjetas con fotografía real cuando se ha facilitado.
- **82 imágenes de proyectos procesadas**: 81 vinculadas de forma provisional a **33 iniciativas**, una imagen de Palacio de Benamejí (Écija) pendiente de asignación, conservada en la carpeta de fotografías sin atribuirla a un proyecto distinto. Además, se conserva el logotipo/identidad gráfica anterior.
- Fotografías optimizadas en WebP; las originales proporcionadas por la persona usuaria **no se alteran**.
- `assets/data/inventario_fotografias.csv` relaciona cada archivo de origen con la ficha propuesta.
- `tools/anadir_fotos.py` permite ampliar las galerías de una ficha concreta sin rehacer la web.

## Cómo ver y publicar la web

1. Abre `index.html` en el navegador. Los listados y fichas funcionan con archivos locales. Para usar el mapa necesitas conexión a Internet, ya que Leaflet y las teselas OpenStreetMap se cargan al solicitarlo.
2. Para publicar en GitHub Pages: crea un repositorio, **sube el contenido descomprimido a la raíz** y activa **Settings → Pages → Deploy from a branch → main / (root)**.
3. Una ficha se comparte mediante `ficha.html?id=red-018`. El catálogo se abre en `index.html#iniciativas`. El mapa puede abrirse en `index.html#mapa`.

En `Redactivate_v3_Vista_Previa_Interactiva.html` (se entrega por separado) se incluyen estilos, datos, documentos y fotografías en un único archivo. Las fichas se abren allí sin abandonar la vista previa.

## Localización: límites y fuentes

**IMPORTANTE: el mapa es un prototipo exploratorio.** Los puntos se han consignado como referencias **aproximadas de localidad**, no se han contrastado como direcciones exactas de la iniciativa ni como coordenadas de un recurso patrimonial. Aunque el Excel disponga de direcciones, algunas pueden referirse al domicilio de una entidad participante y no al lugar de ejecución del proyecto.

Antes de la publicación oficial, deben comprobarse los 107 registros mediante el Nomenclátor Geográfico de Municipios y Entidades de Población del IGN, OpenStreetMap u otras fuentes institucionales. Fuente orientativa para verificación: https://centrodedescargas.cnig.es/CentroDescargas/catalogo.do?Serie=NGMEN .

OpenStreetMap y Leaflet se solicitan al hacer clic en **Explorar mapa**. El visor de cada ficha también requiere activación voluntaria. Los visitantes deben tener acceso a la información y a las fichas incluso si el mapa falla. Comprobar con Informática políticas CSP, recursos de terceros y avisos de privacidad.

## Actualización de imágenes

Se almacena cada iniciativa en `assets/data/iniciativas.json`; cada objeto puede tener:

```json
{"id":"red-018","foto":"assets/img/proyectos/018-01.webp","galeria":[{"src":"assets/img/proyectos/018-01.webp","nombre_archivo":"PACO1 (1).jpeg","alt":"Imagen del proyecto..."}]}
```

El catálogo de la web también está copiado en `assets/js/datos.js` para funcionar sin peticiones asíncronas. Si se edita el JSON a mano, **actualizar también `datos.js`**. Se recomienda utilizar el script `tools/anadir_fotos.py` con Python y Pillow para futuros lotes. No sobrescribas archivos de imágenes con el mismo nombre.

## WordPress / Drupal

La carpeta `wordpress-plugin/` incluye una **propuesta de código WordPress**, sin instalar ni verificar en el servidor del IAPH, para catalogar experiencias y servir metadatos mediante la API REST. Incluye localización y posibilidad de guardar URL de fotografías. No realiza automáticamente la subida de los archivos al gestor de medios. La integración con Drupal requiere autorización técnica, decisiones sobre origen de datos, dominios/CORS, seguridad, caché y adaptaciones de plantillas. **No confundir el prototipo de GitHub Pages con una integración ya realizada en Drupal.**

## Inventario editorial y derechos

Los años sin indicar, las descripciones ausentes, las publicaciones y algunas correspondencias de fotografías siguen pendientes. Consultar `REVISION_EDITORIAL.md`, `assets/data/inventario_fotografias.csv` y `assets/data/imagenes_pendientes.json`.

**Antes de publicar fotografías de personas y especialmente menores**, confirmar permisos, derechos de reproducción, créditos y autorizaciones de difusión que correspondan. No se incluyeron correos personales del Excel en las fichas públicas.

## Estructura

- `index.html` — portada, buscador, filtros, mapa, ediciones y recursos
- `ficha.html` — ficha individual, galería y mapa orientativo
- `assets/js/mapa.js` — mapa Leaflet/OpenStreetMap
- `assets/js/catalogo.js` — filtros y alternancia mapa/tarjetas
- `assets/js/ficha.js` — ficha, galería fotográfica y localización
- `assets/js/datos.js` — datos embebidos para HTML local
- `assets/data/iniciativas.json` — registros estructurados y georreferenciación de trabajo
- `assets/data/inventario_fotografias.csv` — relación foto ↔ proyecto
- `assets/data/imagenes_pendientes.json` — imágenes a revisar
- `assets/img/proyectos/` — fotografías optimizadas
- `assets/docs/` — PDFs de 2025
- `wordpress-plugin/` — borrador CMS para Informática
- `tools/anadir_fotos.py` — ayuda para nuevos lotes
