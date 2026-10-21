/* Mapa exploratorio de iniciativas. Los puntos representan CENTROS DE LOCALIDAD, no sedes exactas. */
'use strict';
window.REDACTIVATE_MAPA=(()=>{
 let map=null,layer=null,loading=null;
 const holder=document.getElementById('initiative-map'),status=document.getElementById('map-status');
 const colors={'2018':'#E6A04F','2021':'#4B9ABE','2023':'#A381B4','2025':'#0F9473'};
 function loadLeaflet(){
  if(window.L)return Promise.resolve();if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
   const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.append(css);
   const js=document.createElement('script');js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';js.onload=()=>window.L?resolve():reject(Error('Leaflet no disponible'));js.onerror=()=>reject(Error('Error de red al cargar Leaflet'));document.head.append(js);
  });return loading;
 }
 async function init(){
  await loadLeaflet();if(map)return;
  map=L.map(holder,{scrollWheelZoom:false,zoomControl:true}).setView([37.65,-4.76],7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(map);
  layer=L.featureGroup().addTo(map);
  status.textContent='Ubicaciones municipales aproximadas. No son coordenadas exactas de las iniciativas.';
  setTimeout(()=>map.invalidateSize(),50);
 }
 function update(items){
  if(!map||!layer)return;
  layer.clearLayers();let missing=0;
  const grouped=new Map();
  for(const p of items){
   const g=p.geo;if(!g||!Number.isFinite(Number(g.lat))||!Number.isFinite(Number(g.lng))){missing++;continue;}
   const key=[Number(g.lat).toFixed(3),Number(g.lng).toFixed(3)].join('/');
   if(!grouped.has(key))grouped.set(key,{g,entries:[],name:p.localidad||p.provincia});
   grouped.get(key).entries.push(p);
  }
  for(const {g,entries,name} of grouped.values()){
   const uniqueYears=[...new Set(entries.map(p=>p.anio))];
   const col=uniqueYears.length===1?(colors[uniqueYears[0]]||'#617A6B'):'#285F54';
   const marker=L.circleMarker([Number(g.lat),Number(g.lng)],{radius:Math.min(19,8+entries.length*1.1),color:'#fff',weight:2.5,fillColor:col,fillOpacity:.95});
   const popup=document.createElement('div');popup.className='map-popup';
   const h=document.createElement('h3');h.textContent=name||'Localidad por verificar';popup.append(h);
   const p=document.createElement('p');p.textContent=entries.length+' '+(entries.length===1?'iniciativa':'iniciativas')+' · Ubicación municipal orientativa';popup.append(p);
   const ul=document.createElement('ul');for(const v of entries){const li=document.createElement('li'),a=document.createElement('a');a.href='ficha.html?id='+encodeURIComponent(v.id);a.textContent=(v.anio?v.anio+' · ':'')+v.titulo;li.append(a);ul.append(li);}popup.append(ul);
   marker.bindPopup(popup,{maxWidth:350,minWidth:220});marker.addTo(layer);
  }
  if(grouped.size){map.fitBounds(layer.getBounds().pad(.18),{maxZoom:9,animate:false});}
  else{map.setView([37.65,-4.76],7);}
  setTimeout(()=>map.invalidateSize(),50);
  status.textContent=items.length+' iniciativas · '+grouped.size+' puntos municipales aproximados'+(missing?' · '+missing+' pendientes de situar':'')+'. Los proyectos de una misma localidad comparten marcador.';
 }
 return {init,update};
})();
