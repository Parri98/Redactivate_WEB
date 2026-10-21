#!/usr/bin/env python3
"""Añade fotografías a fichas del catálogo local de GitHub Pages.
Uso: python tools/anadir_fotos.py red-018 /ruta/imagen1.jpg /ruta/imagen2.jpg
Requiere Pillow: pip install Pillow
No edita ningún servidor Drupal ni WordPress.
"""
from pathlib import Path
from PIL import Image,ImageOps
import json,re,sys
base=Path(__file__).resolve().parents[1]
if len(sys.argv)<3:raise SystemExit('Uso: python tools/anadir_fotos.py red-018 imagen1.jpg [imagen2.jpg]')
record_id=sys.argv[1]
path=base/'assets/data/iniciativas.json'
items=json.loads(path.read_text(encoding='utf8'))
row=next((r for r in items if r['id']==record_id),None)
if row is None:raise SystemExit('No existe la ficha '+record_id)
dirpath=base/'assets/img/proyectos';dirpath.mkdir(parents=True,exist_ok=True)
for f in sys.argv[2:]:
 src=Path(f)
 if not src.is_file():raise SystemExit('No existe imagen: '+str(src))
 n=len(row.get('galeria',[]))+1;dst=dirpath/f'{record_id.replace("red-", "")}-{n:02d}.webp'
 if dst.exists():raise SystemExit('Destino ya existe, no se sobrescribe: '+str(dst))
 with Image.open(src) as raw:
  im=ImageOps.exif_transpose(raw)
  if im.mode=='RGBA':
   bg=Image.new('RGB',im.size,'white');bg.paste(im,mask=im.getchannel('A'));im=bg
  else:im=im.convert('RGB')
  im.thumbnail((1650,1250),Image.Resampling.LANCZOS)
  im.save(dst,'WEBP',quality=80,method=5)
 photo={'src':'assets/img/proyectos/'+dst.name,'nombre_archivo':src.name,'alt':'Imagen del proyecto '+row['titulo']}
 row.setdefault('galeria',[]).append(photo)
 row['foto']=row['galeria'][0]['src']
path.write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf8')
(base/'assets/js/datos.js').write_text('/* Datos locales para GitHub Pages. */\nwindow.REDACTIVATE_INICIATIVAS = '+json.dumps(items,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
print('Fotografías incorporadas a',row['titulo'],':',len(row['galeria']))
