import {advanceWithPower,ambient} from './regulator-heat.mjs';
import {cycle,supplyMoment} from './supply-model.mjs';

const $=id=>document.getElementById(id);
const es=new URLSearchParams(location.search).get('lang')==='es';
const lang=es?'es':'en', t=(en,sp)=>es?sp:en;
const format=(v,n=1)=>v.toLocaleString(lang,{minimumFractionDigits:n,maximumFractionDigits:n});
document.documentElement.lang=lang;
$('back').textContent=t('← Rectifier lesson','← Lección del rectificador');
$('back').href=window.parent===window?'index.html?track=electronics&lesson=rectifier&lang='+lang:'experiment.html?lesson=rectifier&lang='+lang;
$('title').textContent=document.title=t('From the AC bridge to the 8 V load','Del puente de alterna a la carga de 8 V');
$('intro').textContent=t('Follow the capacitor voltage through one cycle, then advance the thermal clock. The chip heats according to the watts it dissipates across the entire waveform.','Sigue la tensión del condensador durante un ciclo y avanza el reloj térmico. El chip se calienta según la potencia media que disipa a lo largo de toda la onda.');
$('dip').textContent=t('Try dropout','Probar caída de tensión');
$('hot').textContent=t('Try overheating','Probar sobrecalentamiento');
$('reset').textContent=t('Reset bench','Reiniciar banco');
$('legend').textContent=t('Cyan = capacitor · Amber = load · Dashed = 9 V minimum input · White = 3D instant.','Cian = condensador · Ámbar = carga · Discontinua = mínimo de 9 V · Blanca = instante 3D.');
$('trial').textContent=t('In the dropout case, scrub from the peak to the valley. In the overheating case, use +30 s until the output cuts out. Attach the sink while hot and advance until 8 V returns.','En el caso de caída, recorre la onda del pico al valle. En el de sobrecalentamiento, pulsa +30 s hasta el corte. Coloca el disipador en caliente y avanza hasta recuperar los 8 V.');
$('assumptions').textContent=t('50 Hz AC, two 0.7 V diode drops and 1 V regulator dropout. Each trace shows a settled electrical cycle for the current protection state. When disconnected, an ideal capacitor holds the bridge peak. Air is at 25 °C. Shutdown at 125 °C, restart at 100 °C. Playback slows the electrical cycle to 8 s and advances thermal time at 10×.','Alterna de 50 Hz, dos caídas de 0,7 V en el puente y 1 V mínimo en el regulador. Cada traza muestra un ciclo eléctrico estabilizado para el estado térmico actual. Al cortar la carga, el condensador ideal conserva el pico del puente. Ambiente a 25 °C. Corte a 125 °C y rearme a 100 °C. Cada ciclo se reproduce en 8 s y el reloj térmico avanza a 10×.');
const titles=[t('Capacitor','Condensador'),t('Ripple, peak to peak','Rizado pico a pico'),t('Load voltage','Tensión de carga'),t('Load current','Corriente de carga'),t('Chip power now','Potencia instantánea del chip'),t('Chip power, cycle mean','Potencia media del chip'),t('Junction temperature','Temperatura de unión'),t('Thermal time','Tiempo térmico')];
const meters=titles.map(title=>{
  const cell=document.createElement('div'), name=document.createElement('small'),value=document.createElement('b');
  cell.className='reading';name.textContent=title;cell.append(name,value);$('meters').append(cell);return value;
});
const fresh=()=>({temperature:ambient,shutdown:false,time:0});
let thermal=fresh(),phase=.5,sink=false,playing=false,clock=0,view,values,on,off,lastState;
function settings(){
  values=[+$('input').value,.7,+$('cap').value,+$('load').value,1];
  on=cycle(values);off=cycle(values,true);
}
function scope(samples){
  const canvas=$('wave'),width=Math.max(260,Math.round(canvas.clientWidth)),height=150;
  if(canvas.width!==width)canvas.width=width;
  const ctx=canvas.getContext('2d'),left=42,right=width-12;
  const max=Math.max(10,values[0]),y=v=>120-95*v/max,x=u=>left+u*(right-left);
  ctx.clearRect(0,0,width,height);ctx.font='11px monospace';ctx.fillStyle='#c5dce2';
  ctx.fillText(max+' V',2,25);ctx.fillText('9 V',2,y(9)+3);ctx.fillText('0 V',2,122);
  ctx.fillText('0 ms',left,143);ctx.fillText('10 ms',x(.5)-15,143);ctx.fillText('20 ms',right-34,143);
  function rule(x1,y1,x2,y2,color){
    ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  }
  ctx.lineWidth=1;rule(left,120,right,120,'#526675');ctx.setLineDash([4,4]);
  rule(left,y(9),right,y(9),'#a1b4be');ctx.setLineDash([]);
  for(const [key,color] of [['output','#53dce9'],['loadVoltage','#f6ae58']]){
    ctx.lineWidth=2;ctx.strokeStyle=color;ctx.beginPath();
    samples.forEach((m,i)=>{if(i)ctx.lineTo(x(m.u),y(m[key]));else ctx.moveTo(x(m.u),y(m[key]));});ctx.stroke();
  }
  ctx.lineWidth=1;rule(x(phase),13,x(phase),125,'#fff');
}
function render(){
  const m=supplyMoment(values,phase,thermal.shutdown),trace=thermal.shutdown?off:on;
  lastState={...m,...thermal,sink};view?.draw(lastState);scope(trace.samples);
  $('vin').textContent=t('AC input peak','Pico de entrada CA')+' · '+format(values[0])+' V';
  $('capLabel').textContent=t('Capacitance','Capacitancia')+' · '+values[2]+' µF';
  $('res').textContent=t('Load resistance','Resistencia de carga')+' · '+values[3]+' Ω';
  $('cursor').value=Math.round(phase*1000);$('cursorLabel').textContent=t('Electrical instant','Instante eléctrico')+' · '+format(20*phase,2)+' ms';
  $('play').textContent=playing?t('Pause','Pausar'):t('Run both clocks','Activar ambos relojes');
  $('sink').textContent=sink?t('Remove heat sink','Quitar disipador'):t('Attach heat sink','Colocar disipador');$('sink').setAttribute('aria-pressed',String(sink));
  const status=thermal.shutdown?t('Thermal shutdown','Corte térmico'):m.margin<0?t('Voltage dropout','Caída por tensión insuficiente'):t('Delivering 8 V','Entregando 8 V');
  $('status').textContent=status;
  $('why').textContent=thermal.shutdown?t('Thermal protection has opened the output. Load current and chip dissipation fall to zero, while the unloaded capacitor holds its voltage.','La protección térmica cortó la salida. La corriente de carga y la potencia disipada caen a cero, mientras el condensador sin carga conserva su tensión.'):m.margin<0?t('The capacitor is below 9 V at this instant. The regulator loses the headroom it needs for 8 V. Follow the next crest to see whether it recovers.','En este instante el condensador está por debajo de 9 V. Falta margen para entregar 8 V. Sigue la próxima cresta para observar si se recupera.'):t('The capacitor supplies enough voltage for 8 V. The excess voltage multiplied by load current is the heat generated in the regulator.','El condensador tiene tensión suficiente para entregar 8 V. La tensión sobrante multiplicada por la corriente de carga es la potencia que calienta el regulador.');
  [format(m.output)+' V',format(m.ripple,2)+' V',format(m.loadVoltage,2)+' V',format(m.current*1000,0)+' mA',format(m.loss,2)+' W',format(trace.watts,2)+' W',format(thermal.temperature)+' °C',format(thermal.time)+' s'].forEach((value,i)=>meters[i].textContent=value);
}
function advance(seconds){thermal=advanceWithPower(thermal,seconds,on.watts,sink);}
function preset(hot){
  $('input').value=hot?20:12;$('cap').value=hot?2200:100;$('load').value=hot?32:100;
  thermal=fresh();sink=false;playing=false;phase=.5;settings();render();
}
$('hot').onclick=()=>preset(true);$('dip').onclick=$('reset').onclick=()=>preset(false);
$('input').oninput=$('cap').oninput=$('load').oninput=()=>{settings();render();};
$('step').onclick=()=>{advance(30);render();};
$('sink').onclick=()=>{sink=!sink;render();};
$('play').onclick=()=>{playing=!playing;clock=0;render();};
$('cursor').oninput=()=>{playing=false;phase=+$('cursor').value/1000;render();};
preset(false);
try{const {mount}=await import('./scene.mjs');view=mount($('stage'),'connected','power-supply',lang);render();}
catch(error){$('stage').textContent=t('3D unavailable. The scope and meters are ready.','3D no disponible. Puedes usar el osciloscopio y las lecturas.');console.error(error);}
let visible=true;
new IntersectionObserver(([e])=>{visible=e.isIntersecting;clock=0;}).observe(document.body);
function frame(now){
  if(!document.hidden && visible && now-clock>=65){
    if(playing && clock){
      const elapsed=Math.min((now-clock)/1000,.3);
      phase=(phase+elapsed/8)%1;advance(elapsed*10);render();
    }else view?.draw(lastState);
    clock=now;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
new ResizeObserver(()=>{scope((thermal.shutdown?off:on).samples);parent.postMessage({type:'foundation-height',height:document.body.scrollHeight},location.origin);}).observe(document.body);
