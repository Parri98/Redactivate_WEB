# Redactívate · Revisión editorial pendiente (versión 3)

La versión de trabajo incluye 107 iniciativas del Excel y 82 fotografías de proyectos aportadas en ocho lotes.

| Revisión | Estado |
|---|---|
| Total de iniciativas | 107 |
| Con año de edición consignado | 100 |
| Sin año | 7 |
| Con descripción | 103 |
| Sin descripción | 4 |
| Con publicaciones bibliográficas específicas en el Excel | 0 |
| Imágenes vinculadas provisionalmente | 81 |
| Fichas con fotografías | 33 |
| Imágenes por vincular | 1 |

## Revisión fotográfica

Las fotos se han asociado provisionalmente mediante los nombres de archivo. Se recomienda confirmar las relaciones de imágenes con los proyectos de **INNOVRED**, **Antiguamente / Museo de La Rinconada**, **La Zubia** y **Artífex**, especialmente cuando pertenecen a actividades compartidas.

La fotografía `Foto Palacio Benamejí. Écija_Fundación Ciudades Medias del Centro de Andalucía.jpg` se ha conservado como `assets/img/proyectos/pendiente-ecija-palacio-benameji.webp`, sin asociarla al «Museo de la Ciudad de Antequera», porque no hay correspondencia inequívoca en el inventario.

**Derechos:** confirmar copyright, autorización de publicación de fotos de menores y personas identificables, acreditaciones y licencias de las imágenes, incluida la documentación del IAPH y demás entidades participantes.

## Campos y datos que necesitan confirmación

- **Año ausente (7):** Más Drama, Castillo de la Caba (Aldeire), ABP La Jaula, Los cuidados del patrimonio y su comunidad (CEIP Andrés Segovia), Los Aljibes de Jairán y el Flamenco, Mapeando, El jardín arqueológico (IES Jorge Juan).
- **Descripción ausente (4):** Los cuidados del patrimonio y su comunidad, Los Aljibes de Jairán y el Flamenco, Mapeando y Centro San Miguel.
- **Castellar:** el Excel señalaba `Provincia = Castellar` y `Localidad = Cádiz`; para facilitar el mapa se ha propuesto `Provincia = Cádiz` y `Localidad = Castellar de la Frontera` en la copia de trabajo, con una nota editorial en su ficha. Confirmar con el equipo responsable.
- **Georreferenciación:** todas las posiciones se han configurado como aproximaciones municipales **no verificadas como lugares exactos de proyecto**. Comprobar coordenadas oficiales antes de incluirlas en una web corporativa, especialmente las experiencias de varios municipios.
- **Publicaciones:** el inventario no distinguía un campo bibliográfico verificable. Completar enlaces de artículos, actas y otros materiales si existen.
- **Recursos externos:** comprobar vigencia de las URL del Excel; el prototipo no garantiza que los enlaces públicos estén activos.
- **Datos personales:** no incorporar correos de participantes sin una finalidad y base de legitimación adecuadas.

## Próximos lotes

Mantener un registro por foto, nombre original, ID de iniciativa, autorización, autor y pie de imagen. Puede añadirse cada nueva imagen a la ficha mediante `tools/anadir_fotos.py`. Es necesario regenerar la vista previa HTML independiente tras cambios, pero no el proyecto web normal.
