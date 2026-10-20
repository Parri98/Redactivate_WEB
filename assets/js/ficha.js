/* Render de las fichas. No se incluyen datos de contacto del inventario. */
'use strict';
window.REDACTIVATE_RENDER_FICHA = async function(id){
 const el=id=>document.getElementById(id), t=(tag,str,cls)=>{const x=document.createElement(tag);x.textContent=str;if(cls)x.className=cls;return x;};
 id=id||new URLSearchParams(window.location.search).get('id');
 const arr=await window.REDACTIVATE_LOAD_DATA();const row=arr.find(r=>r.id===id);
 if(!row){el('ficha-title').textContent='No se ha encontrado esta iniciativa';el('ficha-layout').innerHTML='<div class="ficha-notfound"><h2>La ficha no está disponible.</h2><p>Comprueba el enlace o vuelve al catálogo de buenas prácticas.</p><a href="index.html#iniciativas" class="btn btn-dark">Volver al buscador</a></div>';return;}
 document.title=row.titulo+' · Redactívate IAPH';el('ficha-title').textContent=row.titulo;el('ficha-breadcrumb-title').textContent=row.titulo;
 [[ 'ficha-year',row.anio||'No indicado'],['ficha-province',row.provincia||'No indicada'],['ficha-city',row.localidad||'No indicada'],['ficha-address',row.direccion||'Sin dirección concreta'],['ficha-original-topic',row.tematica_original||'Sin clasificación']].forEach(([id,val])=>el(id).textContent=val);
 const meta=el('ficha-meta');[row.anio?'Encuentro '+row.anio:'Edición sin indicar',row.localidad||'Localidad pendiente',row.provincia||'Provincia pendiente'].forEach(str=>meta.append(t('span',str)));
 const photo=el('ficha-photo');if(row.foto&&/^https?:\/\//.test(row.foto)){photo.classList.add('has-photo');const i=photo.querySelector('img');i.src=row.foto;i.alt='Fotografía de '+row.titulo;photo.querySelector('span')?.remove();}
 const description=el('ficha-description');if(row.descripcion){row.descripcion.split(/\n\s*\n/).filter(Boolean).forEach(s=>description.append(t('p',s.trim())));}else{description.append(t('p','Descripción pendiente de completar.','ficha-pending'));}
 const tags=el('ficha-tags');(row.tematicas||[]).forEach(x=>tags.append(t('span',x)));
 function linklist(id,items,empty){const node=el(id);if(items&&items.length){items.forEach((u,i)=>{if(!/^https?:\/\//.test(u))return;const li=document.createElement('li'),a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener noreferrer';let label;try{label=new URL(u).hostname.replace(/^www\./,'');}catch{label='Enlace externo';}a.append(t('strong','Recurso '+(i+1)+' ↗'),t('span',' · '+label));li.append(a);node.append(li);});}else if(empty){node.insertAdjacentElement('afterend',t('p',empty,'ficha-pending'));}}
 linklist('ficha-links',row.enlaces,'No se han facilitado enlaces complementarios.');
 linklist('ficha-publications',row.publicaciones);if(!row.publicaciones?.length)el('ficha-publications-empty').hidden=false;
 const location=[row.direccion,row.localidad,row.provincia,'España'].filter(Boolean).join(', ');
 const q=encodeURIComponent(location), url='https://www.google.com/maps?q='+q;
 el('ficha-load-map').addEventListener('click',()=>{el('ficha-map').src=url+'&output=embed';el('map-consent').hidden=true;});el('ficha-map-open').href=url;
 el('ficha-osm-open').href='https://www.openstreetmap.org/search?query='+q;
 el('ficha-map-note').textContent=row.direccion?'El mapa utiliza la dirección facilitada en el inventario. Es necesario confirmar que corresponde a la localización de la iniciativa.':'El mapa usa la localidad facilitada en el inventario y no representa una ubicación exacta de la experiencia.';
};
if(document.getElementById('ficha-layout'))window.REDACTIVATE_RENDER_FICHA();
