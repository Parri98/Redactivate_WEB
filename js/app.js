/* Redactívate · Archivo divulgativo. Sin dependencias ni backend. */
'use strict';

const editions = {
  '2018': {
    numeral:'I', count:'PRIMER ENCUENTRO', date:'7 y 8 de mayo · Sevilla',
    title:'Buenas prácticas en la activación del patrimonio cultural en el territorio',
    description:'La primera edición abrió un espacio de diálogo sobre participación ciudadana, innovación social y las iniciativas que movilizan el patrimonio desde lo local. El encuentro se celebró en el IAPH en Sevilla.',
    tags:['Buenas prácticas','Participación','Territorio'],
    links:[
      ['Programa (PDF)', 'https://repositorio.iaph.es/bitstream/11532/327676/2/I%20Encuentro%20Patrimonio%20de%20Proximidad_Programa_2018.pdf'],
      ['Convocatoria (PDF)', 'https://repositorio.iaph.es/bitstream/11532/327676/1/Convocatoria%20I%20Encuentro%20Patrimonio%20de%20Proximidad_2018.pdf'],
      ['Iniciativas seleccionadas', 'https://www.juntadeandalucia.es/organismos/iaph/areas/formacion-difusion/reactivate/paginas/listado-iniciativas-seleccionadas-iaph-2018.html']
    ]
  },
  '2021': {
    numeral:'II', count:'SEGUNDO ENCUENTRO', date:'19 y 20 de abril · En línea',
    title:'Los cuidados del patrimonio y su comunidad',
    description:'En un contexto marcado por la crisis sanitaria, el encuentro reflexionó sobre el patrimonio como vínculo social y las maneras en las que las comunidades cuidan su patrimonio y se cuidan mutuamente.',
    tags:['Cuidados','Educación','Memoria colectiva'],
    links:[
      ['Programa (PDF)', 'https://www.juntadeandalucia.es/export/drupaljda/2_Encuentro_Patrimonio_de_Proximidad_21.pdf'],
      ['Convocatoria (PDF)', 'https://www.juntadeandalucia.es/export/drupaljda/RED_ACTIVATE_2021.pdf'],
      ['Grupo evaluador (PDF)', 'https://www.juntadeandalucia.es/export/drupaljda/Redactivate_grupo_evaluador.pdf']
    ]
  },
  '2023': {
    numeral:'III', count:'TERCER ENCUENTRO', date:'8 y 9 de noviembre · Sevilla y en línea',
    title:'Educar desde el patrimonio',
    description:'La educación patrimonial —formal y no formal— protagonizó una edición centrada en la participación de las comunidades, la accesibilidad, la inclusión y el aprendizaje ligado a los territorios.',
    tags:['Educación patrimonial','Accesibilidad','Aprendizaje'],
    links:[
      ['Programa (PDF)', 'https://www.juntadeandalucia.es/sites/default/files/inline-files/2023/11/Programa_Redactivate_2023_v2.pdf'],
      ['Convocatoria (PDF)', 'https://www.juntadeandalucia.es/sites/default/files/inline-files/2023/10/CONVOCATORIA_REDACTIVATE_2023.pdf'],
      ['Relatoría (PDF)', 'https://repositorio.iaph.es/bitstream/11532/374918/2/Relatoria_Encuentro_IAPH_Redactivate_2023.pdf'],
      ['Vídeo de una sesión', 'https://www.youtube.com/watch?v=niAKPr0tWiE']
    ]
  },
  '2025': {
    numeral:'IV', count:'CUARTO ENCUENTRO', date:'11 y 12 de noviembre · Sevilla y en línea',
    title:'Creatividad, innovación y patrimonio. Nuevas miradas',
    description:'Una mirada a cómo las ideas, la creatividad y la innovación conectan comunidades, reinterpretan memorias y aportan nuevas soluciones para el patrimonio en el territorio.',
    tags:['Creatividad','Innovación','Comunidades'],
    links:[
      ['Programa (PDF)', 'assets/docs/REDACTIVATE_Programa_2025.pdf'],
      ['Convocatoria (PDF)', 'assets/docs/Convocatoria_Proyect_Redactivate_25_v2.pdf'],
      ['Relatoría (PDF)', 'assets/docs/Relatoria_Encuentro_IAPH_Redactivate_2025.pdf'],
      ['Vídeo de una sesión', 'https://www.youtube.com/watch?v=MYU28iRAB08']
    ]
  }
};

const programme = {
 '11':[
   ['09:00','Presentación','Apertura del IV Encuentro'],
   ['09:15','El patrimonio desde la creatividad y la innovación','Rafael Lamata y Carmen Casillas'],
   ['11:00','Innovando desde el patrimonio','Mesa redonda sobre innovación y derechos culturales'],
   ['12:30','Cápsulas de proyectos e iniciativas','Tartesos en Comunidad, Innovred y otras experiencias'],
   ['16:00','Innovación educativa, creatividad y patrimonio','Experiencias de centros educativos y dinámica participativa']
 ],
 '12':[
   ['09:00','Taller «Tejiendo la memoria»','Biblioteca del IAPH · Telaras de la Zubia'],
   ['11:00','Creando desde el patrimonio','Mesa redonda: Hilando el tiempo, Genalguacil y Artífex'],
   ['12:30','Cápsulas de proyectos e iniciativas','AZIMUTE, Silencio Editora, Festival PACO, PLANEA y otras'],
   ['16:00','Programa la colaboración expandida','José Ignacio Artillo Pabón'],
   ['16:30','Cápsulas de proyectos e iniciativas','Urban Sketchers Sevilla, Castellar, Antiguamente y CUCO'],
   ['17:45','Cierre creativo y conclusiones','Relatoría visual y colectiva'],
   ['19:00','Acción sonora: Music for territories','Ilaria Degradi · Claustro de Legos']
 ]
};

const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const norm=(s)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const programmeNode=document.querySelector('#schedule-list');
function changeDay(day){
  if(!programmeNode || !programme[day])return;
  programmeNode.replaceChildren(...programme[day].map(([time,title,desc])=>{
    const li=document.createElement('li');
    const hours=document.createElement('span');hours.textContent=time;
    const wrapper=document.createElement('div');const strong=document.createElement('strong');strong.textContent=title;
    const small=document.createElement('small');small.textContent=desc;
    wrapper.append(strong,small);li.append(hours,wrapper);return li;
  }));
  $$('.day-btn').forEach(btn=>{const selected=btn.dataset.day===day;btn.classList.toggle('active',selected);btn.setAttribute('aria-pressed',String(selected));});
}
$$('.day-btn').forEach(btn=>btn.addEventListener('click',()=>changeDay(btn.dataset.day)));

function changeEdition(year,focus=false){
  const e=editions[year];if(!e)return;
  document.querySelector('#edition-number').textContent=e.numeral;
  document.querySelector('#edition-count').textContent=e.count;
  document.querySelector('#edition-date').textContent=e.date;
  document.querySelector('#edition-art-year').textContent=year;
  document.querySelector('#edition-title').textContent=e.title;
  document.querySelector('#edition-description').textContent=e.description;
  document.querySelector('.edition-art').dataset.variant=year;
  const tags=document.querySelector('#edition-tags');tags.replaceChildren(...e.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
  const links=document.querySelector('#edition-links');links.replaceChildren(...e.links.map(([label,url])=>{const a=document.createElement('a');a.className='text-button';a.href=url;a.textContent=label+' ↗';a.target='_blank';a.rel='noopener noreferrer';return a;}));
  const panel=document.querySelector('#edition-panel');panel.setAttribute('aria-labelledby','tab-'+year);
  $$('.edition-tab').forEach(tab=>{const selected=tab.dataset.edition===year;tab.classList.toggle('active',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  if(focus){document.querySelector('#tab-'+year).focus();}
}
$$('.edition-tab').forEach(btn=>{
  btn.addEventListener('click',()=>changeEdition(btn.dataset.edition));
  btn.addEventListener('keydown',(evt)=>{
    const tabs=$$('.edition-tab');const i=tabs.indexOf(btn);let next;
    if(evt.key==='ArrowRight')next=(i+1)%tabs.length;
    else if(evt.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;
    else if(evt.key==='Home')next=0;
    else if(evt.key==='End')next=tabs.length-1;
    else return;
    evt.preventDefault();changeEdition(tabs[next].dataset.edition,true);
  });
});

const menuToggle=document.querySelector('.menu-toggle'), menu=document.querySelector('#main-nav');
function setMenu(open){menu.classList.toggle('open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');}
menuToggle.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
$$('#main-nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false);});
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
