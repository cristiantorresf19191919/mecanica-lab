import {advance,ambient,readings} from './regulator-heat.mjs';
const $=id=>document.getElementById(id);
const es=new URLSearchParams(location.search).get('lang')==='es';
const t=(en,spanish)=>es?spanish:en;
const lang=t('en','es');
document.documentElement.lang=lang;
const number=(v,digits=1)=>v.toLocaleString(lang,{minimumFractionDigits:digits,maximumFractionDigits:digits});
$('title').textContent=document.title=t('Why does an 8 V regulator heat up?','¿Por qué se calienta un regulador de 8 V?');
$('back').textContent=t('← Return to the ripple experiment','← Volver al experimento de rizado');
$('back').href=window.parent===window?'index.html?track=electronics&lesson=rectifier&lang='+lang:'experiment.html?lesson=rectifier&lang='+lang;
$('intro').textContent=t('Set the DC voltage at the regulator input and choose a load. Watch the chip temperature as you run time forward or attach the fins.','Ajusta la tensión continua a la entrada del regulador y elige la carga. Observa la temperatura del chip al avanzar el tiempo o colocar las aletas.');
$('trial').textContent=t('Try 16 V and 32 Ω. Advance 30 s at a time until protection cuts the output. Attach the heat sink while hot and keep advancing to see when 8 V returns.','Prueba 16 V y 32 Ω. Avanza de 30 en 30 s hasta que la protección corte la salida. Coloca el disipador en caliente y sigue avanzando para ver cuándo vuelven los 8 V.');
$('assumptions').textContent=t('This bench isolates heating with a steady DC input. The teaching model uses 25 °C air, 1 V dropout, a thermal capacity of 1.5 J/°C and thermal resistance of 75 °C/W bare or 18 °C/W with fins. Protection switches off at 125 °C and restarts at 100 °C.','Este banco aísla el calentamiento con una entrada continua constante. El modelo usa aire a 25 °C, caída mínima de 1 V, capacidad térmica de 1,5 J/°C y resistencia térmica de 75 °C/W sin disipador o 18 °C/W con aletas. La protección corta a 125 °C y rearma a 100 °C.');
const connected=document.createElement('a');
connected.className='heat-link';
connected.href='power-supply.html?lang='+lang;
connected.textContent=t('Connect the rectifier and capacitor →','Conectar el puente y el condensador →');
$('back').after(connected);
const fresh=()=>({temperature:ambient,time:0,shutdown:false});
let state=fresh(),sink=false,playing=false,view,visualState,last=0;
const titles=[t('Load voltage','Tensión de carga'),t('Load current','Corriente de carga'),t('Power to load','Potencia en la carga'),t('Heat in regulator','Calor en el regulador'),t('Junction temperature','Temperatura de unión'),t('Thermal time','Tiempo térmico')];
const meters=titles.map(title=>{
  const cell=document.createElement('div'),label=document.createElement('small'),value=document.createElement('b');
  cell.className='reading';label.textContent=title;cell.append(label,value);$('meters').append(cell);return value;
});
function render(){
  const vin=+$('input').value, resistance=+$('load').value;
  const m=readings(vin,resistance,state.shutdown);
  $('vin').textContent=t('Regulator input','Entrada del regulador')+' · '+number(vin)+' V';
  $('res').textContent=t('Load resistance','Resistencia de carga')+' · '+resistance+' Ω';
  $('status').textContent=state.shutdown?t('Thermal shutdown','Protección térmica activa'):m.output<8?t('Voltage dropout','Tensión de entrada insuficiente'):t('Delivering 8 V','Entregando 8 V');
  $('play').textContent=playing?t('Pause','Pausar'):t('Run · 10×','Reproducir · 10×');
  $('sink').textContent=sink?t('Remove heat sink','Quitar disipador'):t('Attach heat sink','Colocar disipador');
  $('sink').setAttribute('aria-pressed',String(sink));
  $('reset').textContent=t('Reset bench','Reiniciar banco');
  const values=[number(m.output)+' V',number(m.current*1000,0)+' mA',number(m.loadPower,2)+' W',number(m.loss,2)+' W',number(state.temperature)+' °C',number(state.time)+' s'];
  values.forEach((value,i)=>meters[i].textContent=value);
  const equation='('+number(vin)+' V − '+number(m.output)+' V) × '+number(m.current,3)+' A = '+number(m.loss,2)+' W. ';
  $('why').textContent=equation+(state.shutdown?t('Protection opened the output. The chip now cools until restart.','La protección abrió la salida. El chip se enfría hasta el rearme.'):t('This power warms the chip. The fins give heat an easier path to the air.','Esta potencia calienta el chip. Las aletas facilitan el paso de calor al aire.'));
  visualState={...state,...m,sink};
  view?.draw(visualState);
}
function advanceTime(seconds){state=advance(state,seconds,+$('input').value,+$('load').value,sink);render();}
$('sink').onclick=()=>{sink=!sink;render();};
$('step').onclick=()=>advanceTime(30);
$('play').onclick=()=>{playing=!playing;last=0;render();};
$('reset').onclick=()=>{state=fresh();playing=false;sink=false;$('input').value=16;$('load').value=32;render();};
$('input').oninput=$('load').oninput=render;
let visible=true;
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;}).observe(document.body);
function frame(now){
  if(!document.hidden && visible && now-last>=80){
    if(playing && last) advanceTime(Math.min((now-last)/1000,.3)*10);
    else view?.draw(visualState);
    last=now;
  }
  requestAnimationFrame(frame);
}
render();
try{const {mount}=await import('./scene.mjs');view=mount($('stage'),'heat-bench','regulator-heat',lang);}
catch(error){$('stage').textContent=t('3D unavailable. The meters and controls are ready.','3D no disponible. Puedes usar los controles y las lecturas.');console.error(error);}
requestAnimationFrame(frame);
new ResizeObserver(()=>parent.postMessage({type:'foundation-height',height:document.body.scrollHeight},location.origin)).observe(document.body);
