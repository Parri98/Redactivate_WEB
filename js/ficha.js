/* Ficha accesible, galería propia y mapa orientativo bajo petición. */
'use strict';
window.REDACTIVATE_RENDER_FICHA=async function(id){
 const el=k=>document.getElementById(k),text=(tag,str,cls)=>{const x=document.createElement(tag);x.textContent=str;if(cls)x.className=cls;return x;};
 id=id||new URLSearchParams(location.search).get('id');
 const arr=await window.REDACTIVATE_LOAD_DATA(),row=arr.find(r=>r.id===id);
 if(!row){el('ficha-title').textContent='No se ha encontrado esta iniciativa';el('ficha-layout').innerHTML='<div class="ficha-notfound"><h2>La ficha no está disponible.</h2><p>Comprueba el enlace o vuelve al catálogo de buenas prácticas.</p><a href="index.html#iniciativas" class="btn btn-dark">Volver al buscador</a></div>';return;}
 document.title=row.titulo+' · Redactívate IAPH';el('ficha-title').textContent=row.titulo;el('ficha-breadcrumb-title').textContent=row.titulo;
 [['ficha-year',row.anio||'No indicado'],['ficha-province',row.provincia||'No indicada'],['ficha-city',row.localidad||'No indicada'],['ficha-address',row.direccion||'Sin dirección concreta'],['ficha-original-topic',row.tematica_original||'Sin clasificación']].forEach(([k,v])=>el(k).textContent=v);
 [row.anio?'Encuentro '+row.anio:'Edición sin indicar',row.localidad||'Localidad pendiente',row.provincia||'Provincia pendiente'].forEach(str=>el('ficha-meta').append(text('span',str)));
 const description=el('ficha-description');if(row.descripcion){row.descripcion.split(/\n\s*\n/).filter(Boolean).forEach(s=>description.append(text('p',s.trim())));}else description.append(text('p','Descripción pendiente de completar.','ficha-pending'));
 (row.tematicas||[]).forEach(x=>el('ficha-tags').append(text('span',x)));
 function linklist(k,items,empty){const node=el(k);if(items&&items.length){items.forEach((u,i)=>{if(!/^https?:\/\//.test(u))return;const li=document.createElement('li'),a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener noreferrer';let label;try{label=new URL(u).hostname.replace(/^www\./,'');}catch{label='Enlace externo';}a.append(text('strong','Recurso '+(i+1)+' ↗'),text('span',' · '+label));li.append(a);node.append(li);});}else if(empty){node.insertAdjacentElement('afterend',text('p',empty,'ficha-pending'));}}
 linklist('ficha-links',row.enlaces,'No se han facilitado enlaces complementarios.');linklist('ficha-publications',row.publicaciones);if(!row.publicaciones?.length)el('ficha-publications-empty').hidden=false;
 if(row.nota_revision){let box=text('p',row.nota_revision,'ficha-pending');el('ficha-original-topic').parentElement?.append(box);}
 const pictures=row.galeria?.length?row.galeria:(row.foto?[{src:row.foto,alt:'Fotografía de '+row.titulo,nombre_archivo:''}]:[]);
 if(pictures.length){
  let hero=el('ficha-photo');hero.classList.add('has-photo');const i=hero.querySelector('img');i.src=pictures[0].src;i.alt=pictures[0].alt||'Imagen del proyecto '+row.titulo;hero.querySelector('span').textContent='Pulsar para ampliar';
  hero.setAttribute('role','button');hero.tabIndex=0;hero.setAttribute('aria-label','Ampliar fotografía de '+row.titulo);
  const gallery=el('ficha-gallery');gallery.hidden=false;const list=el('ficha-gallery-list');
  const dialog=el('ficha-photo-dialog'),large=el('ficha-dialog-image'),caption=el('ficha-dialog-caption');let current=0;
  function show(n){current=(n+pictures.length)%pictures.length;large.src=pictures[current].src;large.alt=pictures[current].alt||row.titulo;caption.textContent='Imagen '+(current+1)+' de '+pictures.length+' · '+row.titulo;}
  function open(n){show(n);if(!dialog.open)dialog.showModal();}
  const photoClick=()=>open(0);hero.addEventListener('click',photoClick);hero.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();photoClick();}});
  pictures.forEach((p,k)=>{const btn=document.createElement('button');btn.type='button';btn.className='ficha-gallery-thumb';btn.setAttribute('aria-label','Ampliar imagen '+(k+1)+' de '+pictures.length);const img=new Image();img.src=p.src;img.loading='lazy';img.alt=p.alt||row.titulo;btn.append(img);btn.addEventListener('click',()=>open(k));list.append(btn);});
  el('ficha-photo-previous').addEventListener('click',()=>show(current-1));el('ficha-photo-next').addEventListener('click',()=>show(current+1));el('ficha-photo-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);});
 }else el('ficha-gallery').hidden=true;
 const loc=[row.direccion,row.localidad,row.provincia,'España'].filter(Boolean).join(', '),q=encodeURIComponent(loc);
 const maps='https://www.google.com/maps?q='+q;
 el('ficha-map-open').href=maps;
 el('ficha-osm-open').href='https://www.openstreetmap.org/search?query='+q;
 const geo=row.geo,valid=geo&&Number.isFinite(geo.lat)&&Number.isFinite(geo.lng);
 el('ficha-map-note').textContent=valid?(geo.precision==='localidad'?'Ubicación orientativa del centro de la localidad. No representa la sede exacta del proyecto.':'Punto aproximado de referencia provincial, pendiente de georreferenciar.'): 'No se dispone de coordenadas para esta experiencia.';
 el('ficha-load-map').addEventListener('click',()=>{
  if(valid){let la=geo.lat,lo=geo.lng,d=.055;el('ficha-map').src=`https://www.openstreetmap.org/export/embed.html?bbox=${lo-d}%2C${la-d}%2C${lo+d}%2C${la+d}&layer=mapnik&marker=${la}%2C${lo}`;el('ficha-osm-open').href=`https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=12/${la}/${lo}`;}
  else el('ficha-map').src=maps+'&output=embed';
  el('map-consent').hidden=true;
 });
};
if(document.getElementById('ficha-layout'))window.REDACTIVATE_RENDER_FICHA();
