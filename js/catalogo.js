/* Catálogo enlazado a fichas, galería y mapa visible en la portada. */
'use strict';
(async()=>{
 const source=await window.REDACTIVATE_LOAD_DATA(), entries=Array.isArray(source)?source:[];
 const grid=document.querySelector('#catalogue-grid'); if(!grid)return;
 const count=document.querySelector('#catalogue-count'), search=document.querySelector('#catalogue-query'),
 province=document.querySelector('#catalogue-prov'),year=document.querySelector('#catalogue-year'),
 topic=document.querySelector('#catalogue-topic'),sort=document.querySelector('#catalogue-sort'),
 more=document.querySelector('#catalogue-more'), form=document.querySelector('#catalogue-form');
 const mapStatus=document.getElementById('map-status');
 const topics=['Innovación y creatividad','Educación patrimonial','Implicación de la comunidad','Inclusividad y diversidad','Investigación aplicada al territorio','Sostenibilidad y trayectoria'];
 const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const txt=(tag,content,cls)=>{const e=document.createElement(tag);e.textContent=content;if(cls)e.className=cls;return e;};
 function addOptions(sel,values){values.forEach(val=>{const el=document.createElement('option');el.value=val;el.textContent=val;sel.append(el);});}
 addOptions(province,[...new Set(entries.map(x=>x.provincia).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es')));
 addOptions(year,['2025','2023','2021','2018','Sin año indicado']);addOptions(topic,topics);
 let visible=12, mapReady=false, mapFailed=false;
 function filtered(){
  const q=normalize(search.value),pr=province.value,yr=year.value,tp=topic.value;
  const rows=entries.filter(x=>(!pr||x.provincia===pr)&&(!yr||(yr==='Sin año indicado'?!x.anio:x.anio===yr))&&(!tp||(x.tematicas||[]).includes(tp))&&(!q||normalize([x.titulo,x.descripcion,x.localidad,x.provincia,x.tematica_original,x.anio].join(' ')).includes(q)));
  if(sort.value==='az')rows.sort((a,b)=>a.titulo.localeCompare(b.titulo,'es'));
  else if(sort.value==='province')rows.sort((a,b)=>a.provincia.localeCompare(b.provincia,'es')||a.titulo.localeCompare(b.titulo,'es'));
  else rows.sort((a,b)=>(Number(b.anio)||0)-(Number(a.anio)||0)||a.titulo.localeCompare(b.titulo,'es'));
  return rows;
 }
 function card(p){
  const el=document.createElement('article');el.className='catalogue-card';
  const link=document.createElement('a');link.className='catalogue-card-main';link.href='ficha.html?id='+encodeURIComponent(p.id);link.setAttribute('aria-label','Consultar ficha: '+p.titulo);
  const img=document.createElement('div');img.className='catalogue-placeholder';
  if(p.foto){img.classList.add('has-project-photo');const i=new Image();i.src=p.foto;i.alt='Imagen del proyecto '+p.titulo;i.loading='lazy';img.append(i);}
  else{const graphic=new Image();graphic.src='assets/img/grafica-redactivate.webp';graphic.alt='';graphic.loading='lazy';img.append(graphic,txt('span','Fotografía pendiente','catalogue-placeholder-caption'));}
  const body=document.createElement('div');body.className='catalogue-card-content';
  const over=document.createElement('div');over.className='catalogue-card-over';over.append(txt('span',(p.provincia||'Por confirmar')+(p.localidad?', '+p.localidad:''),'catalogue-location'),txt('span',p.anio||'Año por confirmar','catalogue-year'));
  const desc=txt('p',p.descripcion?p.descripcion.replace(/\s+/g,' ').slice(0,170)+(p.descripcion.length>170?'…':''):'Descripción pendiente de completar.','catalogue-desc');
  const tags=document.createElement('div');tags.className='catalogue-tags';(p.tematicas||[]).slice(0,2).forEach(t=>tags.append(txt('span',t)));
  const foot=txt('span',p.galeria?.length?'Ver ficha y fotografías ↗':'Ver ficha de la experiencia ↗','catalogue-visit');
  body.append(over,txt('h3',p.titulo),desc,tags,foot);link.append(img,body);el.append(link);return el;
 }
 function render(reset=false){
  if(reset)visible=12;
  const rows=filtered();
  grid.replaceChildren(...rows.slice(0,visible).map(card));
  if(!rows.length)grid.append(txt('p','No se encontraron iniciativas con los filtros seleccionados. Prueba con otros criterios.','catalogue-empty'));
  count.textContent=rows.length+' '+(rows.length===1?'iniciativa encontrada':'iniciativas encontradas')+' de '+entries.length+' registradas';
  more.hidden=rows.length<=visible;
  if(mapReady)window.REDACTIVATE_MAPA?.update(rows);
  else if(!mapFailed && mapStatus){mapStatus.textContent='Preparando mapa interactivo…';}
 }
 async function ensureMap(){
  if(mapReady||mapFailed||!window.REDACTIVATE_MAPA?.init)return;
  if(mapStatus)mapStatus.textContent='Preparando mapa interactivo…';
  try{
   await window.REDACTIVATE_MAPA.init();
   mapReady=true;
   render();
  }catch(e){
   mapFailed=true;
   if(mapStatus)mapStatus.textContent='No se pudo cargar el mapa. Comprueba la conexión a Internet.';
   console.error(e);
  }
 }
 for(const el of [search,province,year,topic,sort])el.addEventListener(el===search?'input':'change',()=>render(true));
 more.addEventListener('click',()=>{visible+=12;render();});
 form.addEventListener('reset',()=>{sort.value='recent';requestAnimationFrame(()=>render(true));});
 form.addEventListener('submit',e=>e.preventDefault());
 window.addEventListener('hashchange',()=>{if(location.hash==='#mapa')document.getElementById('mapa')?.scrollIntoView({behavior:'smooth',block:'start'});});
 render(true);
 ensureMap();
 if(location.hash==='#mapa')document.getElementById('mapa')?.scrollIntoView({behavior:'smooth',block:'start'});
})();
