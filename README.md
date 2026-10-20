# Redactívate · Patrimonio de Proximidad

Web informativa **estática y responsive**, lista para publicar con **GitHub Pages**, sobre los encuentros Redactívate del Instituto Andaluz del Patrimonio Histórico (IAPH).

## Contenidos

- Presentación y objetivos del proyecto.
- Línea de tiempo interactiva de las **cuatro ediciones verificadas**: 2018, 2021, 2023 y 2025.
- Resumen navegable del programa de 11 y 12 de noviembre de 2025.
- Selección documental de iniciativas con búsqueda y filtros por temática.
- Programas, convocatoria y relatoría de 2025 incluidos en la web para su consulta.
- Enlaces oficiales a documentos históricos de 2018, 2021 y 2023.
- Contacto y materiales gráficos del IAPH correspondientes a la edición de 2025.

La convocatoria de 2025 aparece **como documento histórico**, no como inscripción vigente. No se anuncian ediciones ni convocatorias posteriores no confirmadas.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `redactivate`.
2. Sube **todo el contenido de esta carpeta a la raíz del repositorio**, manteniendo `index.html` junto a la carpeta `assets/`. También puedes subir el ZIP descomprimido.
3. En el repositorio entra en **Settings → Pages**.
4. En **Build and deployment** selecciona **Deploy from a branch**; elige `main` y `/ (root)` y pulsa **Save**.
5. Cuando GitHub termine la publicación, la URL será habitualmente `https://TU-USUARIO.github.io/redactivate/` (según el nombre exacto del repositorio).

No requiere Node, React, servidor, compilación ni base de datos. Para probarla localmente, abre `index.html` en el navegador o utiliza un servidor HTTP local:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000/`.

## Estructura

```
index.html
assets/
  css/styles.css              # diseño adaptable
  js/app.js                   # datos, filtros y navegación
  img/                        # gráfica, identidad y material visual
  docs/                       # documentos de 2025
README.md
```

## Actualizar y ampliar

- **Ediciones:** modifica el objeto `editions` de `assets/js/app.js` con años, títulos, descripciones y enlaces verificados.
- **Programa por días:** modifica el objeto `programme` de `assets/js/app.js`.
- **Iniciativas:** modifica el array `projects` de `assets/js/app.js`.
- **Contacto, textos principales y secciones:** modifica `index.html`.
- **Diseño y colores:** modifica `assets/css/styles.css`.

Se recomienda validar nuevos contenidos, fotografías y autorizaciones de uso con el equipo responsable antes de convertir este prototipo en una web institucional.

## Documentación y procedencia

Las fechas y temáticas históricas proceden de [la página oficial de Redactívate](https://www.juntadeandalucia.es/organismos/iaph/areas/formacion-difusion/reactivate.html) y de los documentos enlazados por el IAPH. Los PDFs de 2025 y la gráfica de la portada proceden de los archivos facilitados para este proyecto. La ilustración «La mirada creativa del patrimonio» se reproduce como extracto de la relatoría de 2025, con crédito a La Mari Muriel. Los logos en el pie reflejan **la identidad institucional impresa en 2025**, no una actualización gráfica posterior.

Enlaces adicionales:

- [Repositorio de Activos Digitales del IAPH, Redactívate](https://repositorio.iaph.es/handle/11532/326411)
- [Portal Redactívate de la Junta de Andalucía](https://www.juntadeandalucia.es/organismos/iaph/areas/formacion-difusion/reactivate.html)

**Estado:** prototipo divulgativo listo para publicar técnicamente; pendiente de revisión editorial/institucional si se utiliza como web oficial.
