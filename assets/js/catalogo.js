/* Catálogo de buenas prácticas · edición HTML/JS para GitHub y preparación de integración CMS */
'use strict';
(async()=>{
 const source=await window.REDACTIVATE_LOAD_DATA();
 const entries=Array.isArray(source)?source:[];
 const grid=document.querySelector('#catalogue-grid');if(!grid)return;
 const count=document.querySelector('#catalogue-count');
 const search=document.querySelector('#catalogue-query');
 const province=document.querySelector('#catalogue-prov');
 const year=document.querySelector('#catalogue-year');
 const topic=document.querySelector('#catalogue-topic');
 const sort=document.querySelector('#catalogue-sort');
 const more=document.querySelector('#catalogue-more');
 const form=document.querySelector('#catalogue-form');
 const topics=['Innovación y creatividad','Educación patrimonial','Implicación de la comunidad','Inclusividad y diversidad','Investigación aplicada al territorio','Sostenibilidad y trayectoria'];
 const normal=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const text=(tag,content,cls)=>{const e=document.createElement(tag);e.textContent=content;if(cls)e.className=cls;return e;};
 const addOptions=(sel,arr)=>{arr.forEach(val=>{const el=document.createElement('option');el.value=val;el.textContent=val;sel.append(el);});};
 addOptions(province,[...new Set(entries.map(x=>x.provincia).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es')));
 addOptions(year,['2025','2023','2021','2018','Sin año indicado']);addOptions(topic,topics);
 let visible=12;
 function filtered(){
  const q=normal(search.value),pr=province.value,yr=year.value,tp=topic.value;
  const rows=entries.filter(x=>(!pr||x.provincia===pr)&&(!yr||(yr==='Sin año indicado'?!x.anio:x.anio===yr))&&(!tp||x.tematicas.includes(tp))&&(!q||normal([x.titulo,x.descripcion,x.localidad,x.provincia,x.tematica_original,x.anio].join(' ')).includes(q)));
  if(sort.value==='az')rows.sort((a,b)=>a.titulo.localeCompare(b.titulo,'es'));
  else if(sort.value==='province')rows.sort((a,b)=>a.provincia.localeCompare(b.provincia,'es')||a.titulo.localeCompare(b.titulo,'es'));
  else rows.sort((a,b)=>(Number(b.anio)||0)-(Number(a.anio)||0)||a.titulo.localeCompare(b.titulo,'es'));
  return rows;
 }
 function card(p){
  const el=document.createElement('article');el.className='catalogue-card';
  const link=document.createElement('a');link.className='catalogue-card-main';link.href='ficha.html?id='+encodeURIComponent(p.id);link.setAttribute('aria-label','Consultar ficha: '+p.titulo);
  const img=document.createElement('div');img.className='catalogue-placeholder';
  if(p.foto){let i=document.createElement('img');i.src=p.foto;i.alt='Imagen de la iniciativa '+p.titulo;i.loading='lazy';img.replaceChildren(i);}
  else {const graphic=document.createElement('img');graphic.src='assets/img/grafica-redactivate.webp';graphic.alt='';graphic.loading='lazy';img.append(graphic,text('span','Fotografía pendiente','catalogue-placeholder-caption'));}
  const body=document.createElement('div');body.className='catalogue-card-content';
  const over=document.createElement('div');over.className='catalogue-card-over';over.append(text('span',p.provincia+(p.localidad?', '+p.localidad:''),'catalogue-location'),text('span',p.anio||'Año por confirmar','catalogue-year'));
  const h=text('h3',p.titulo);
  let desc=text('p',p.descripcion? p.descripcion.replace(/\s+/g,' ').slice(0,195)+(p.descripcion.length>195?'…':'') : 'Descripción pendiente de completar.','catalogue-desc');
  const tags=document.createElement('div');tags.className='catalogue-tags';p.tematicas.slice(0,2).forEach(t=>tags.append(text('span',t)));
  const foot=text('span','Ver ficha de la experiencia ↗','catalogue-visit');body.append(over,h,desc,tags,foot);link.append(img,body);el.append(link);return el;
 }
 function render(reset=false){if(reset)visible=12;const rows=filtered();grid.replaceChildren(...rows.slice(0,visible).map(card));
  if(!rows.length)grid.append(text('p','No se encontraron iniciativas con los filtros seleccionados. Prueba con otros criterios.','catalogue-empty'));
  count.textContent=rows.length+' '+(rows.length===1?'iniciativa encontrada':'iniciativas encontradas')+' de '+entries.length+' registradas';more.hidden=rows.length<=visible;
 }
 [search,province,year,topic,sort].forEach(el=>el.addEventListener(el===search?'input':'change',()=>render(true)));
 more.addEventListener('click',()=>{visible+=12;render();});
 form.addEventListener('reset',()=>{sort.value='recent';requestAnimationFrame(()=>render(true));});
 form.addEventListener('submit',e=>e.preventDefault());
 render(true);
})();
