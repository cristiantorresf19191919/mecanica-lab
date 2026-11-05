import {cycle,supplyMoment} from './supply-model.mjs';
import {advanceWithPower,trip} from './regulator-heat.mjs';
import {drawSupplyScope} from './supply-scope.mjs';
const $=id=>document.getElementById(id);
const lang=new URLSearchParams(location.search).get('lang')==='es'?'es':'en';
const t=(en,es)=>lang==='es'?es:en;
const fmt=(value,digits=1)=>value.toLocaleString(lang,{minimumFractionDigits:digits,maximumFractionDigits:digits});
document.documentElement.lang=lang;
$('back').textContent=t('← Combined fault','← Avería combinada');$('back').href='power-supply.html?mode=combined&lang='+lang;
$('heading').textContent=document.title=t('Which fault does each repair leave behind?','¿Qué avería queda después de cada reparación?');
$('intro').textContent=t('Both supplies start at the same 125 °C cutoff with a 20 V peak input and a 20 Ω load. The first repair happens at 0 s and the second at 300 s. The chip keeps its temperature when a part changes.','Ambas fuentes parten del mismo corte a 125 °C, con entrada de 20 V de pico y carga de 20 Ω. La primera reparación ocurre a los 0 s y la segunda a los 300 s. El chip conserva su temperatura al cambiar una pieza.');
$('key').textContent=t('Cyan: capacitor voltage · Amber: load voltage · Dashed: 9 V required input · White: shared scope cursor. Replay advances thermal time at 10× and shows one electrical cycle in 8 s.','Cian: tensión del condensador · Ámbar: tensión de carga · Discontinua: entrada mínima de 9 V · Blanca: cursor común. El reloj térmico avanza a 10× y cada ciclo eléctrico se muestra en 8 s.');
const cutoff={shutdown:true,temperature:trip,time:0};
function circuit(cap){
  const values=[20,.7,cap,20,1];
  return {values,on:cycle(values),off:cycle(values,true)};
}
const small=circuit(150),large=circuit(1500);
let seconds=60,phase=.554,playing=false,last=0;
const panels=[true,false].map(capFirst=>{
  const panel=$('panel').content.firstElementChild.cloneNode(true);
  document.querySelector('main').append(panel);
  panel.querySelector('h2').textContent=capFirst?t('Capacitor first','Condensador primero'):t('Heat sink first','Disipador primero');
  const first=capFirst?large:small;
  const atSecond=advanceWithPower(cutoff,300,first.on.watts,!capFirst);
  return {panel,capFirst,first,atSecond};
});
function render(){
  $('time').value=Math.round(seconds);$('phase').value=Math.round(phase*1000);
  $('timeLabel').textContent=seconds<0?t('Before either repair','Antes de reparar'):t('Thermal time','Tiempo térmico')+' · '+fmt(seconds,0)+' s';
  $('phaseLabel').textContent=t('Electrical instant','Instante eléctrico')+' · '+fmt(20*phase,2)+' ms';
  $('play').textContent=playing?t('Pause both','Pausar ambos'):t('Play both','Reproducir ambos');
  for(const p of panels){
    const {panel,capFirst,first,atSecond}=p;
    const before=seconds<0,both=seconds>=300;
    const circuit=before?small:both?large:first;
    const sink=both||(!before&&!capFirst);
    const state=before?cutoff:advanceWithPower(both?atSecond:cutoff,both?seconds-300:seconds,circuit.on.watts,sink);
    const m=supplyMoment(circuit.values,phase,state.shutdown);
    const trace=state.shutdown?circuit.off:circuit.on;
    p.frame={...m,...state,sink};p.view?.draw(p.frame);
    drawSupplyScope(panel.querySelector('canvas.scope'),trace.samples,phase,20);
    panel.querySelector('small').textContent=circuit.values[2]+' µF · '+(sink?t('Fins attached','Con disipador'):t('Bare regulator','Sin disipador'));
    panel.querySelector('.meters').textContent=fmt(m.loadVoltage,2)+' V · '+fmt(m.loss,2)+' W '+t('now','ahora')+' · '+fmt(trace.watts,2)+' W '+t('cycle mean','media del ciclo')+' · '+fmt(state.temperature)+' °C';
    const summary=before?t('Both faults present. The hot regulator has opened the output.','Ambas averías presentes. El regulador caliente ha cortado la salida.'):both?t('Both repairs fitted.','Ambas reparaciones aplicadas.'):capFirst?t('Overheating remains. The larger capacitor covers the trough, but the bare regulator repeatedly trips.','Persiste el sobrecalentamiento. El condensador sostiene el valle, pero el regulador sin disipador vuelve a cortarse.'):t('Dropout remains. The fins cool the chip, but the small capacitor still discharges below 9 V between crests.','Persiste la caída de tensión. Las aletas enfrían el chip, pero el condensador pequeño aún baja de 9 V entre crestas.');
    const now=state.shutdown?t('Output disconnected while the chip cools.','Salida desconectada mientras se enfría el chip.'):m.margin<0?t('Output dipping at this instant.','La salida cae en este instante.'):t('Delivering 8 V at this instant.','Entrega 8 V en este instante.');
    panel.querySelector('.result').textContent=summary+' '+now;
  }
}
function jump(time){playing=false;seconds=time;render();}
for(const [time,label] of [[-1,t('Before repairs','Antes de reparar')],[60,t('After first fix · 60 s','Primera reparación · 60 s')],[300,t('Apply second fix','Aplicar segunda reparación')],[600,t('Final check · 600 s','Prueba final · 600 s')]]){
  const button=document.createElement('button');button.textContent=label;button.onclick=()=>jump(time);$('jumps').append(button);
}
$('time').oninput=()=>jump(+$('time').value);
$('phase').oninput=()=>{playing=false;phase=+$('phase').value/1000;render();};
$('play').onclick=()=>{if(seconds>=600)seconds=-1;playing=!playing;last=0;render();};
render();
try{
  const {mount}=await import('./scene.mjs');
  for(const p of panels)p.view=mount(p.panel.querySelector('.stage'),'connected','power-supply',lang);
}catch(error){for(const p of panels)if(!p.view)p.panel.querySelector('.stage').textContent=t('3D unavailable. Use the scope and meters below.','3D no disponible. Usa la gráfica y las lecturas.');console.error(error);}
render();
let visible=true;
new IntersectionObserver(([e])=>{visible=e.isIntersecting;last=0;}).observe(document.body);
function frame(now){
  if(visible&&!document.hidden&&now-last>=80){
    if(playing&&last){
      const elapsed=Math.min((now-last)/1000,.3);seconds=Math.min(600,Math.max(0,seconds)+10*elapsed);
      phase=(phase+elapsed/8)%1;if(seconds>=600)playing=false;render();
    }else for(const p of panels)p.view?.draw(p.frame);
    last=now;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
new ResizeObserver(()=>{render();parent.postMessage({type:'foundation-height',height:document.body.scrollHeight},location.origin);}).observe(document.body);
