import {levels,initialConfig,motor,modes,planetary,transmission,testLoad} from './gear-game-model.mjs';

const $=id=>document.getElementById(id);
const en=new URLSearchParams(location.search).get('lang')==='en';
const lang=en?'en':'es', t=(es,enText)=>en?enText:es;
const local=pair=>pair[Number(en)];
const fmt=(n,digits=0)=>n.toLocaleString(lang,{maximumFractionDigits:digits});
document.documentElement.lang=lang;
const storageKey='mecanica-gear-game-v1';
let completed=[];
try{
  const saved=JSON.parse(localStorage.getItem(storageKey));
  if(Array.isArray(saved))completed=levels.map(l=>l.id).filter(id=>saved.includes(id));
}catch{}
const text=(id,value)=>{$(id).textContent=value;};
text('heading',t('Taller de transmisión','Transmission workshop'));
text('kicker',t('7 misiones · Juego 3D','7 missions · 3D game'));
text('summary',t('Construye el tren, ponlo bajo carga y llega de un par de engranajes a una caja de cambios.','Build the gear train, put it under load, and work your way from two gears to a transmission.'));
text('lesson',t('Lecciones de engranajes','Gear lessons'));$('lesson').href='gears.html?lang='+lang;
text('language',en?'ES':'EN');$('language').href='?lang='+(en?'es':'en');
text('rpmLabel',t('Velocidad de salida','Output speed'));
text('torqueLabel',t('Par disponible','Available torque'));
text('ratioLabel',t('Relación de reducción','Reduction ratio'));
text('targetLabel',t('Carga de prueba','Test load'));
text('trackTitle',t('Recorrido de prueba','Test run'));
text('mathTitle',t('Sigue la potencia','Follow the power'));
text('limits',t('Modelo didáctico con motor de 1200 rpm y 12 N·m, pérdidas constantes y giros ralentizados. La caja automática usa un solo planetario y cambia según la carga.','Teaching model with a 1200 rpm, 12 N·m motor, constant losses and slowed rotation. The automatic uses one planetary set and shifts according to load.'));
$('stage').dataset.label=t('Banco 3D de engranajes. Arrastra para girar y usa la rueda para acercarte.','3D gear bench. Drag to orbit and scroll to zoom.');
text('reset',t('Reiniciar prueba','Reset test'));

const captions=[
  ['Entrada','Input','#66d3ff'],['Intermedio o elemento móvil','Intermediate or moving member','#56e2a5'],['Salida','Output','#ffba69']
];
for(const [es,label,color] of captions){
  const item=document.createElement('span'),dot=document.createElement('i');
  dot.style.backgroundColor=color;item.append(dot,t(es,label));$('legend').append(item);
}

const routeNames=[['Par','Torque'],['Velocidad','Speed'],['Ejes','Axles'],['Tren compuesto','Compound'],['Planetario','Planetary'],['Manual','Manual'],['Automática','Automatic']];
const gamePieces={
  lift:'<path d="M20 0v8l-9 5m9-5 9 5M9 14h22v17H9zM9 14l22 17M31 14 9 31"/>',
  fan:'<circle cx="20" cy="17" r="13"/><path d="M20 17c-12-3-8-12-1-9 3 1 3 6 1 9Zm0 0c9-8 14 0 8 5-3 2-6 0-8-5Zm0 0c3 12-6 13-8 6-1-4 3-6 8-6Z"/>',
  axles:'<circle cx="11" cy="21" r="7"/><circle cx="29" cy="12" r="7"/><path d="m13 14 11-5m-11 17 17-8"/>',
  compound:'<path d="M8 3h24v29H8zM9 9h22M20 9v11m-7 0h14m-14 1v5h14v-5"/>',
  planet:'<circle cx="20" cy="17" r="14"/><circle cx="20" cy="17" r="4"/><path d="m25 9 4 1m0 11-2 4m-15-4v-4"/>',
  manual:'<path d="M3 22v-8h23l7 6h4v7H3zM13 14l4-5h9l5 10H16"/><circle cx="10" cy="27" r="4"/><circle cx="30" cy="27" r="4"/>',
  auto:'<path d="M3 22v-8h23l7 6h4v7H3zM13 14l4-5h9l5 10H16"/><circle cx="10" cy="27" r="4"/><circle cx="30" cy="27" r="4"/>'
};
const planetNames=[
  ['Corona fija · Sol → portasatélites','Ring held · Sun → carrier'],
  ['Portasatélites fijo · Sol → corona','Carrier held · Sun → ring'],
  ['Sol fijo · Corona → portasatélites','Sun held · Ring → carrier'],
  ['Sol y corona unidos · Directa','Sun and ring locked · Direct']
];
const feedback={
  open:['Se cortó la transmisión. Revisa el acople.','The drive path is open. Check the connection.'],
  mount:['El giro llega al soporte equivocado. Mueve el eje.','The drive reaches the wrong mount. Move the axle.'],
  direction:['El eje gira en el sentido contrario al requerido.','The shaft turns in the wrong direction for this task.'],
  torque:['La carga supera el par disponible. Aumenta la reducción.','The load exceeds available torque. Try more reduction.'],
  rpm:['Hay fuerza suficiente, pero la salida gira demasiado despacio.','There’s enough torque, but the output is too slow.'],
  pass:['La carga se mueve.','The load is moving.']
};
let levelIndex=0,taskIndex=0,progress=0,config=initialConfig(),result;
let free=false,won=false,running=false,angle=0,arena,view='orbit',slow=false,needsClutchCycle=false;
const level=()=>levels[levelIndex];
const task=()=>level().tasks[taskIndex];
function refreshRoute(){
  let reachable=true;
  $('route').replaceChildren(...levels.map((entry,index)=>{
    const button=document.createElement('button'),number=document.createElement('span');
    const done=completed.includes(entry.id);
    number.textContent=(done?'✓ ':(!free&&!reachable?'▣ ':''))+String(index+1).padStart(2,'0');
    button.append(number,local(routeNames[index]));button.disabled=!free&&!reachable;
    button.dataset.complete=String(done);
    if(index===levelIndex)button.setAttribute('aria-current','step');
    button.onclick=()=>openLevel(index);
    reachable=reachable&&done;
    return button;
  }));
}
function choose(key,label,options,disabled=false){
  const row=document.createElement('label'),select=document.createElement('select');
  row.append(label,select);select.id='set-'+key;
  if(['mode','range'].includes(key))row.className='wide';
  for(const [value,name] of options)select.add(new Option(name,value));
  select.value=config[key];select.disabled=disabled;
  select.onchange=()=>{
    config[key]=typeof config[key]==='number'?Number(select.value):select.value;
    refresh(true);
  };
  $('config').append(row);
}
function toggle(key,label,action){
  const button=document.createElement('button');button.id='set-'+key;button.type='button';
  button.textContent=label;button.setAttribute('aria-pressed',String(Boolean(config[key])));
  button.onclick=action;$('config').append(button);
}
const teeth=[12,16,18,24,30,36,48].map(n=>[n,t(n+' dientes',n+' teeth')]);
function drawControls(){
  const kind=level().kind;$('config').replaceChildren();
  if(['pair','idler','compound'].includes(kind)){
    choose('driver',t('Piñón de entrada','Input pinion'),teeth);
    choose('driven',kind==='compound'?t('Rueda en eje común','Gear on shared shaft'):t('Rueda de salida','Driven gear'),teeth);
    if(kind==='idler'){
      toggle('insert',t(config.insert?'Quitar intermedio':'Añadir intermedio',config.insert?'Remove idler':'Insert idler'),()=>{config.insert=!config.insert;drawControls();refresh(true);$('set-insert').focus();});
      if(config.insert)choose('idler',t('Dientes del intermedio','Idler teeth'),teeth);
    }
    if(kind==='compound'){
      choose('stageDriver',t('Piñón en eje común','Pinion on shared shaft'),teeth);
      choose('stageDriven',t('Rueda final','Final driven gear'),teeth);
    }
    choose('mount',t('Posición del eje','Axle position'),[['inline',t('En línea','Inline')],['upper',t('Arriba','Upper')],['lower',t('Abajo','Lower')]]);
    choose('gap',t('Contacto final','Final mesh'),[[0,t('Engranado','Meshed')],[.55,t('Separado','Separated')]]);
  }else if(kind==='planet'||kind==='auto'){
    choose('sun',t('Dientes del sol','Sun teeth'),[[18,'18'],[24,'24'],[30,'30']]);
    choose('planet',t('Dientes por satélite','Teeth per planet'),[[18,'18'],[24,'24']]);
    if(kind==='planet')choose('mode',t('Configuración','Configuration'),modes.map((m,i)=>[m,local(planetNames[i])]));
    else choose('range',t('Selector','Selector'),[['L',t('L · Reducción fija','L · Hold low')],['D',t('D · Cambia con la carga','D · Shift with load')],['R',t('R · Reversa','R · Reverse')]]);
  }else{
    toggle('clutch',config.clutch?t('Acoplar embrague','Engage clutch'):t('Abrir embrague','Open clutch'),()=>{
      config.clutch=!config.clutch;needsClutchCycle=false;drawControls();refresh(true);$('set-clutch').focus();
    });
    choose('gear',t('Palanca','Gear lever'),[[0,t('Punto muerto','Neutral')],[1,'1'],[2,'2'],[3,'3'],[4,'4']],!config.clutch);
  }
}
function track(){
  const total=level().tasks.length,value=won?100:100*(taskIndex+progress)/total;
  $('trackRail').style.width=value+'%';$('trackToken').style.left=value+'%';
  text('trackDetail',fmt(Math.floor(value))+' %');
}
function showTask(){
  const q=task();
  text('target',en?q.en:q.es);
  const direction=q.direction===1?t(' · mismo sentido',' · same direction'):q.direction===-1?t(' · sentido contrario',' · opposite direction'):'';
  text('goal','≥ '+fmt(q.rpm)+' rpm · ≥ '+fmt(q.torque)+' N·m'+direction);
  const segments=level().tasks.map((item,i)=>{
    const span=document.createElement('span');span.textContent=en?item.en:item.es;
    span.setAttribute('aria-current',String(i===taskIndex));return span;
  });
  $('segments').replaceChildren(...segments);
}
function renderEquation(){
  const kind=level().kind;
  if(kind==='planet'||kind==='auto'){
    const p=planetary(config.sun,config.planet,result.mode);
    const layout=local(planetNames[modes.indexOf(result.mode)]);
    const gear=kind==='auto'?(result.mode==='carrierFixed'?'R':result.mode==='ringFixed'?'1':'2')+' · ':'';
    text('modeNote',gear+layout);
    text('equation','Zr = Zs + 2Zp = '+config.sun+' + 2 × '+config.planet+' = '+p.ringTeeth+' · Ns(ωs − ωc) + Nr(ωr − ωc) = 0');
    text('explanation',kind==='auto'
      ?t('En D, la caja mantiene directa cuando el par alcanza. En una rampa, el freno inmoviliza la corona y el portasatélites entrega más par a menos rpm.','In D, the box holds direct drive when it has enough torque. On a hill, the brake holds the ring and the carrier delivers more torque at lower rpm.')
      :t('En gris se ve el miembro fijo. Los satélites giran sobre sus ejes y, cuando se libera el portasatélites, también orbitan.','The held member is gray. The planets spin on their own shafts and orbit when the carrier is free.'));
  }else{
    const expression=result.stages.map(([a,b])=>b+' / '+a).join(' × ');
    text('equation',result.coupled?'i = '+expression+' = '+fmt(1/Math.abs(result.speed),2):t('Ruta abierta','Open drive path'));
    text('modeNote',kind==='manual'?(config.clutch?t('Embrague abierto. Selecciona la marcha.','Clutch open. Select a gear.'):t('Embrague acoplado','Clutch engaged')):result.speed?(result.speed>0?t('Salida en el mismo sentido','Output turns the same way'):t('Salida en sentido contrario','Output turns the opposite way')):'');
    const copy={
      compound:t('La rueda y el piñón centrales giran juntos. Multiplica las relaciones de ambas parejas.','The middle gear and pinion turn together. Multiply the ratios of the two pairs.'),
      idler:t('Los dientes del intermedio se cancelan en la relación total. El piñón intermedio cambia el recorrido y el sentido.','The idler tooth count cancels from the overall ratio. The idler changes the route and direction.'),
      manual:t('Todas las parejas permanecen engranadas. El manguito une una rueda al eje de salida.','All pairs stay in mesh. The sleeve locks one driven gear to the output shaft.')
    };
    text('explanation',copy[kind]??t('La misma fuerza tangencial actúa en el contacto. La rueda de mayor radio tiene más brazo de palanca y gira más despacio.','The same tangential force acts at the mesh. The larger gear has a longer lever arm and turns slower.'));
  }
}
function refresh(rebuild=false){
  result=transmission(level().kind,config,task());
  if(rebuild)arena?.setup(level().kind,config,result);
  text('rpm',fmt(result.rpm)+' rpm');text('torque',fmt(result.torque,1)+' N·m');text('ratio',result.speed?fmt(1/Math.abs(result.speed),2)+':1':'—');
  renderEquation();
  if(result.coupled){
    const suffix=' · '+t('Potencia disponible','Available power')+' '+fmt(result.torque*result.rpm*Math.PI/30)+' W';
    $('equation').append(suffix);
  }
  showTask();track();
  text('run',running?t('Pausar prueba','Pause test'):t('▶ Probar con carga','▶ Run under load'));
  if(running)text('feedback',local(feedback[testLoad(result,task(),config)]));
}
function openLevel(index){
  levelIndex=index;taskIndex=0;progress=0;angle=0;running=false;won=false;needsClutchCycle=false;
  config=initialConfig();text('stageCode',t('Misión','Mission')+' '+(index+1)+' / '+levels.length);
  text('mission',local(level().title));text('missionCopy',local(level().copy));
  $('trackToken').innerHTML='<svg viewBox="0 0 40 34" width="40" height="34" fill="#142337" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">'+gamePieces[level().id]+'</svg>';text('feedback',t('Ajusta las piezas y prueba la carga.','Set up the parts and test the load.'));
  $('run').disabled=false;$('next').hidden=true;refreshRoute();drawControls();refresh(true);
}
function clearOrAdvance(){
  if(taskIndex<level().tasks.length-1){
    taskIndex++;progress=0;
    if(level().kind!=='auto'){running=false;needsClutchCycle=level().kind==='manual';}
    refresh(true);
    if(!running)text('feedback',t('Nueva carga. Ajusta la configuración para continuar.','New load. Reconfigure for the next segment.'));
    return;
  }
  won=true;running=false;
  if(!free&&!completed.includes(level().id)){
    completed.push(level().id);try{localStorage.setItem(storageKey,JSON.stringify(completed));}catch{}
  }
  refreshRoute();refresh();$('run').disabled=true;
  text('feedback',levelIndex===levels.length-1?t('Recorrido completo. Ya probaste una transmisión automática bajo cargas distintas.','Run complete. You’ve tested an automatic transmission under changing loads.'):t('Misión completada. La transmisión cumplió la prueba.','Mission complete. The transmission passed the load test.'));
  if(levelIndex<levels.length-1){
    $('next').hidden=false;text('next',t('Siguiente misión →','Next mission →'));
  }
}

function updateMode(){
  $('sandbox').setAttribute('aria-pressed',String(free));
  text('sandbox',free?t('Volver a campaña','Return to campaign'):t('Modo libre','Free play'));
}
$('sandbox').onclick=()=>{free=!free;updateMode();openLevel(free?levelIndex:Math.max(0,levels.findIndex(l=>!completed.includes(l.id))));};
$('run').onclick=()=>{
  if(needsClutchCycle){text('feedback',t('Abre el embrague antes de intentar la siguiente marcha.','Open the clutch before attempting the next gear.'));return;}
  running=!running;refresh();
};
$('reset').onclick=()=>openLevel(levelIndex);
$('next').onclick=()=>openLevel(levelIndex+1);
const viewButtons=[];
for(const [id,label] of [['orbit',t('Perspectiva','Perspective')],['front',t('Frontal','Front')],['mesh',t('Ver dientes','Inspect teeth')]]){
  const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed',String(view===id));
  viewButtons.push([b,id]);b.onclick=()=>{view=id;for(const [button,key] of viewButtons)button.setAttribute('aria-pressed',String(view===key));arena?.setView(id);};$('views').append(b);
}
const slowButton=document.createElement('button');
slowButton.textContent=t('Giro lento','Slow rotation');slowButton.setAttribute('aria-pressed','false');
slowButton.onclick=()=>{slow=!slow;slowButton.setAttribute('aria-pressed',String(slow));};
$('views').append(slowButton);
const stepButton=document.createElement('button');stepButton.textContent=t('Paso','Step');
stepButton.onclick=()=>{running=false;angle+=Math.PI/90;arena?.draw(angle);refresh();};$('views').append(stepButton);
updateMode();openLevel(Math.max(0,levels.findIndex(l=>!completed.includes(l.id))));
try{
  const {gearArena}=await import('./gear-game-3d.mjs');
  arena=gearArena($('stage'));refresh(true);
}catch{
  const message=document.createElement('p');message.textContent=t('WebGL no disponible. Los controles, cálculos y misiones siguen funcionando.','WebGL is unavailable. The controls, calculations and missions still work.');$('stage').append(message);
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let last=0, visible=true;
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;}).observe(document.querySelector('main'));
function frame(now){
  const seconds=last?Math.min((now-last)/1000,.05):0;last=now;
  if(visible&&!document.hidden){
    if(running){
      const status=testLoad(result,task(),config);
      if(status!=='torque'&&!reduced.matches)angle+=seconds*(slow?.24:1.65);
      if(status==='pass'){
        const rate=Math.min(2,result.rpm/task().rpm)/3.2;
        progress=Math.min(1,progress+seconds*rate);track();
        if(progress>=1)clearOrAdvance();
      }
    }
    arena?.draw(angle);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
