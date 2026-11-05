import {advanceWithPower,ambient,trip,thermalResistanceFor} from './regulator-heat.mjs';
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
let challenge=null;
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
  const blind=challenge?.stage==='diagnose';
  lastState={...m,...thermal,sink,blind};view?.draw(lastState);scope(trace.samples);
  $('vin').textContent=t('AC input peak','Pico de entrada CA')+' · '+format(values[0])+' V';
  $('capLabel').textContent=t('Capacitance','Capacitancia')+' · '+values[2]+' µF';
  $('res').textContent=t('Load resistance','Resistencia de carga')+' · '+values[3]+' Ω';
  $('cursor').value=Math.round(phase*1000);$('cursorLabel').textContent=t('Electrical instant','Instante eléctrico')+' · '+format(20*phase,2)+' ms';
  $('play').textContent=playing?t('Pause','Pausar'):t('Run both clocks','Activar ambos relojes');
  $('sink').textContent=sink?t('Remove heat sink','Quitar disipador'):t('Attach heat sink','Colocar disipador');$('sink').setAttribute('aria-pressed',String(sink));
  const status=thermal.shutdown?t('Thermal shutdown','Corte térmico'):m.margin<0?t('Voltage dropout','Caída por tensión insuficiente'):t('Delivering 8 V','Entregando 8 V');
  $('status').textContent=blind?'Vout · '+format(m.loadVoltage,2)+' V':status;
  $('why').textContent=thermal.shutdown?t('Thermal protection has opened the output. Load current and chip dissipation fall to zero, while the unloaded capacitor holds its voltage.','La protección térmica cortó la salida. La corriente de carga y la potencia disipada caen a cero, mientras el condensador sin carga conserva su tensión.'):m.margin<0?t('The capacitor is below 9 V at this instant. The regulator loses the headroom it needs for 8 V. Follow the next crest to see whether it recovers.','En este instante el condensador está por debajo de 9 V. Falta margen para entregar 8 V. Sigue la próxima cresta para observar si se recupera.'):t('The capacitor supplies enough voltage for 8 V. The excess voltage multiplied by load current is the heat generated in the regulator.','El condensador tiene tensión suficiente para entregar 8 V. La tensión sobrante multiplicada por la corriente de carga es la potencia que calienta el regulador.');
  if(blind)$('why').textContent=t('Move the cursor between a crest and a trough. Advance the thermal clock and compare what changes.','Mueve el cursor entre una cresta y un valle. Avanza el reloj térmico y compara lo que cambia.');
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
$('surprise').textContent=t('Surprise fault','Avería sorpresa');
$('guessDip').textContent=t('Voltage dropout','Caída por tensión insuficiente');
$('guessHot').textContent=t('Overheating','Sobrecalentamiento');
$('verify').textContent=t('Test repair · 5 min','Probar reparación · 5 min');
$('exitCase').textContent=t('Return to free bench','Volver al banco libre');

function caseControls(){
  const active=Boolean(challenge),blind=challenge?.stage==='diagnose',done=challenge?.stage==='complete';
  $('challenge').hidden=!active;
  for(const id of ['dip','hot','reset','trial'])$(id).hidden=active;
  $('choices').hidden=!blind;
  $('verify').hidden=!active || blind || done;
  $('load').disabled=active;
  for(const id of ['input','cap','sink'])$(id).disabled=blind || done;
}
function startCase(){
  const hot=Math.random()<.5;
  const variants=hot?[[20,2200,32],[19,1500,30],[21,1800,36]]:[[12,100,100],[13,60,90],[12,80,120]];
  const [peak,cap,resistance]=variants[Math.floor(Math.random()*variants.length)];
  $('input').value=peak;$('cap').value=cap;$('load').value=resistance;
  settings();thermal=fresh();sink=false;playing=false;phase=.5;
  if(hot){
    // Enter at the first genuine protection trip during warm-up.
    while(!thermal.shutdown)advance(1);
  }else advance(60);
  challenge={hot,stage:'diagnose'};
  $('caseTitle').textContent=t('Service call · intermittent 8 V supply','Caso de taller · fuente de 8 V inestable');
  $('casePrompt').textContent=t('The load loses voltage. Inspect the scope, watts and temperature before choosing the cause of the original failure.','La carga pierde tensión. Examina las ondas, la potencia y la temperatura antes de elegir la causa de la avería inicial.');
  $('caseResult').textContent='';caseControls();render();
}
function diagnose(hot){
  if(challenge?.stage!=='diagnose')return;
  if(hot!==challenge.hot){
    $('caseResult').textContent=t('Check again. Does the output return at each crest, or stay off for an entire cycle while the chip cools?','Revisa la evidencia. ¿La salida vuelve en cada cresta o sigue apagada durante todo el ciclo mientras se enfría el chip?');
    return;
  }
  playing=false;
  challenge.stage='repair';
  $('caseResult').textContent=hot?t('Correct. The capacitor had enough voltage throughout the cycle, but the hot chip cut the output and its dissipation fell to zero.','Correcto. El condensador tenía tensión suficiente durante todo el ciclo, pero el chip caliente cortó la salida y dejó de disipar potencia.'):t('Correct. The output recovered at each crest. Between crests the capacitor fell below the 9 V this regulator needs.','Correcto. La salida se recuperaba en cada cresta. Entre crestas el condensador caía por debajo de los 9 V necesarios.');
  $('casePrompt').textContent=t('Repair the supply at the specified load. Change the capacitance, input voltage or heat sink, then run the five-minute test.','Repara la fuente con la carga indicada. Cambia la capacitancia, la tensión de entrada o el disipador y ejecuta la prueba de cinco minutos.');
  caseControls();render();
}
function verifyRepair(){
  if(challenge?.stage!=='repair')return;
  playing=false;advance(300);
  const minimumInput=values[0]-2*values[1]-on.samples[0].ripple;
  const minOutput=Math.min(8,Math.max(0,minimumInput-1));
  const steady=ambient+thermalResistanceFor(sink)*on.watts;
  const pass=minOutput>=8 && steady<trip && !thermal.shutdown;
  phase=on.samples.reduce((a,b)=>a.loadVoltage<=b.loadVoltage?a:b).u;
  const evidence=t('Warm-up +5 min. Minimum running output ','Calentamiento +5 min. Salida mínima en marcha ')+format(minOutput,3)+' V. '+t('Projected temperature in continuous operation ','Temperatura prevista en servicio continuo ')+format(steady)+' °C.';
  $('caseResult').textContent=evidence+' '+(pass?t('Repair verified. Scrub a complete cycle to inspect the 8 V trace.','Reparación verificada. Recorre un ciclo completo para inspeccionar la traza de 8 V.'):minOutput<8?t('The trough still needs more input voltage. Adjust the circuit and retest.','Aún falta tensión en el valle. Ajusta el circuito y repite la prueba.'):t('Thermal protection prevents continuous service. Reduce dissipation or improve cooling and retest.','La protección térmica impide el servicio continuo. Reduce la disipación o mejora la refrigeración y repite la prueba.'));
  if(pass){
    challenge.stage='complete';
    $('casePrompt').textContent=t('The repaired supply holds 8 V at the original load.','La fuente reparada mantiene 8 V con la carga original.');
  }
  caseControls();render();
}
$('surprise').onclick=startCase;
$('guessDip').onclick=()=>diagnose(false);$('guessHot').onclick=()=>diagnose(true);
$('verify').onclick=verifyRepair;
$('exitCase').onclick=()=>{challenge=null;caseControls();render();};
if(new URLSearchParams(location.search).get('mode')==='surprise')startCase();
else preset(false);
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
