import {comparisons} from './comparisons.mjs';
import {foundations} from './content.mjs';import {state} from './model.mjs';
const $=id=>document.getElementById(id),p=new URLSearchParams(location.search),id=foundations[p.get('lesson')]?p.get('lesson'):'torque',d=foundations[id],lang=p.get('lang')==='es'?'es':'en',en=lang==='en',t=(es,en)=>lang==='es'?es:en,fmt=v=>new Intl.NumberFormat(lang,{maximumFractionDigits:2}).format(v);
document.documentElement.lang=lang;let values=d.controls.map(c=>c.value),u=0,playing=false,view=null,last=0,visible=true,cut=true,saved=null;
$('orbit').textContent=t('Arrastra para girar · pellizca para acercar','Drag to orbit · pinch to zoom');$('cut').textContent=t('Corte abierto','Cutaway');$('cut').hidden=!['engine','press','pneumatic','motor','hydraulic'].includes(d.kind);$('reset').textContent=t('Restablecer','Reset');$('capture').textContent=t('Guardar lectura A','Save reading A');$('timeLabel').textContent=t('Recorre el experimento','Scrub the experiment');
const limitations={lever:t('Fuerza estática; la longitud visual del brazo sigue el control. No simula aceleración ni deformación.','Static force; visual arm length follows the control. No acceleration or deformation simulation.'),thermal:t('Modelo térmico concentrado: ambiente 20 °C, capacidad térmica 1000 J/K. La aguja es temperatura; no muestra movimiento mecánico.','Lumped thermal model: ambient 20 °C, heat capacity 1000 J/K. The indicator shows temperature, not mechanical motion.'),gas:t('Muestra sellada isotérmica: pV = 2 bar·L. Atmósfera aproximada 1 bar. Puntos esquemáticos, no simulación molecular.','Sealed isothermal sample: pV = 2 bar·L. Atmosphere approximated as 1 bar. Schematic dots, not molecular simulation.'),circuit:t('Circuito ideal de enseñanza. Puntos = sentido de corriente convencional; velocidad visual normalizada, no velocidad de electrones. Arranque: carga resistiva fija 0,05 Ω, sin fuerza contraelectromotriz.','Ideal teaching circuit. Dots = conventional current direction; visual speed is normalized, not electron speed. Starting model: fixed 0.05 Ω resistive load, no back EMF.'),motor:t('Motor idealizado de dos polos. Tres señales equilibradas normalizadas. La animación recorre un ciclo eléctrico lentamente; no reproduce las rpm físicas.','Idealised two-pole motor. Three balanced normalized signals. Animation shows one electrical cycle slowly, not physical rpm.'),opamp:t('Ganancia ideal con límites ±12 V. Un operacional real puede necesitar margen respecto a sus alimentaciones. Columnas = magnitud de tensión; consulta el signo en la onda.','Ideal gain with ±12 V limits. A real op amp may need headroom from its rails. Columns = voltage magnitude; read polarity in the wave.'),relief:t('Presión impuesta para explorar apertura; rampa ideal de 0 a 100 % entre ajuste y 1,2×ajuste. Bomba 6 L/min. No resuelve equilibrio con una carga real.','Imposed pressure to explore opening; ideal 0–100% ramp from setting to 1.2×setting. Pump 6 L/min. Does not solve equilibrium with a real load.'),hydraulic:t('Carrera 100 mm, fuente ideal de caudal, sin compresibilidad ni transitorios. Al llegar al tope, el ciclo se reinicia; no se modela el circuito de fin de carrera. Área variable expresada en lecturas; geometría esquemática fija.','100 mm stroke, ideal flow source, no compressibility or transients. At the end, the cycle restarts; end-stop circuitry is not modelled. Variable area is shown in readings; schematic geometry stays fixed.'),pneumatic:t('Diámetro 40 mm, vástago 20 mm. Fuerza sin fricción. Movimiento prescrito para ver rutas: no representa la velocidad real ni se detiene por carga. Los colores indican suministro y escape, no presión absoluta.','40 mm bore, 20 mm rod. Force excludes friction. Prescribed motion shows paths: it is not actual speed and does not stall under load. Colours indicate supply/exhaust, not absolute pressure.'),press:t('Líquido ideal sin fugas. Área de entrada 2 cm². Mismo volumen desplazado; se desprecia rozamiento y compresibilidad.','Ideal leak-free liquid. Input area 2 cm². Equal displaced volume; ignores friction and compressibility.'),engine:t('Ciclo ideal de 720°, sin adelantos de válvula. Animación ralentizada a un ciclo cada 8 s; rpm solo determina la lectura de ciclos/s.','Ideal 720° cycle, no valve timing advance. Animation slowed to one cycle per 8 s; rpm only determines the cycles/s reading.'),gears:t('Pareja ideal, entrada 18 dientes, sin pérdidas. La animación muestra una vuelta de entrada por ciclo visual.','Ideal pair, 18-tooth input, no losses. Animation shows one input turn per visual cycle.')};$('limit').textContent=limitations[d.kind]+t(' Reproducción normalizada: un recorrido visual en 8 s; no es tiempo físico salvo el tiempo indicado en las lecturas.',' Normalized playback: one visual traversal in 8 s; not physical time except where specified in readings.');
const trial = comparisons[id];
$('pairQuestion').textContent = trial.question[lang];
const changedControl = trial.first.findIndex((value, i) => value !== trial.second[i]);
function conditionLabel(letter, values, phase) {
  const description = changedControl < 0
    ? t('Recorrido', 'Cycle') + ' ' + Math.round(100 * phase) + '%'
    : d.controls[changedControl].label[lang] + ' · ' + fmt(values[changedControl]);
  return letter + ' · ' + description;
}
$('conditionA').textContent = conditionLabel('A', trial.first, trial.phaseA);
$('conditionB').textContent = conditionLabel('B', trial.second, trial.phaseB);
function markCondition(condition) {
  for (const name of ['A', 'B']) {
    $('condition' + name).setAttribute('aria-pressed', String(condition === name));
  }
  $('pairReason').textContent = condition === 'B' ? trial.explanation[lang] : '';
}
function showCondition(name) {
  playing = false;
  values = [...(name === 'A' ? trial.first : trial.second)];
  u = name === 'A' ? trial.phaseA : trial.phaseB;
  saved = state(id, [...trial.first], trial.phaseA);
  $('captureStatus').textContent = t('Referencia A del experimento', 'Experiment reference A');
  markCondition(name);
  controls();
  draw();
}
$('conditionA').onclick = () => showCondition('A');
$('conditionB').onclick = () => showCondition('B');
markCondition(null);
if (d.kind === 'pneumatic') {
  $('orbit').textContent = t('Cian: empuje de A · Ámbar: empuje contrario de B. Arrastra para girar.',
    'Cyan shows force from A. Amber shows opposing force from B. Drag to orbit.');
}
if (id === 'flow') {
  $('cut').hidden = true;
  $('limit').textContent = t(
    'Cilindro ideal de 100 mm. El área determina el diámetro del cilindro y el volumen de aceite determina la altura. Un recorrido visual muestra 2 s de llenado.',
    'Ideal 100 mm cylinder. Area sets the bore diameter and oil volume sets fill height. One visual traversal shows 2 s of filling.'
  );
}
if (id === 'fourstroke' || id === 'ac' || id === 'threephase') {
  $('limit').textContent = id === 'fourstroke'
    ? t('Ciclo ideal de 720°. A 1200 rpm, dos vueltas físicas duran 0,1 s y se reproducen en 8 s. Duplicar las rpm duplica también la velocidad visual.',
        'Ideal 720° cycle. At 1200 rpm two physical revolutions take 0.1 s and play in 8 s. Doubling rpm also doubles the playback speed.')
    : t('A 50 Hz un ciclo físico dura 20 ms y se reproduce en 8 s. Duplicar la frecuencia duplica también la velocidad visual.',
        'At 50 Hz one physical cycle lasts 20 ms and plays in 8 s. Doubling frequency also doubles the playback speed.');
}
function playbackRate() {
  if (id === 'fourstroke') return values[0] / 1200;
  if (id === 'ac') return values[1] / 50;
  if (id === 'threephase') return values[0] / 50;
  return 1;
}
function controls(){ $('controls').replaceChildren(...d.controls.map((c,i)=>{const label=document.createElement('label'),span=document.createElement('span'),input=document.createElement('input');input.type='range';Object.assign(input,{min:c.min,max:c.max,step:c.step,value:values[i]});input.dataset.index=i;span.textContent=c.label[lang]+' · '+fmt(values[i]);input.setAttribute('aria-label',c.label[lang]);input.oninput=()=>{markCondition(null);values[i]=+input.value;span.textContent=c.label[lang]+' · '+fmt(values[i]);draw()};label.append(span,input);return label}));}
const signal=['ac','threephase','rectifier','opamp'].includes(id);$('scope').hidden=!signal;
if (id === 'threephase') {
  $('traceChoice').hidden = false;
  $('traceChoice').querySelector('span').textContent = t('Osciloscopio','Oscilloscope');
  $('traceMode').add(new Option(t('Corrientes de devanado','Winding currents'), 'current'));
  $('traceMode').add(new Option(t('Fuente en estrella · tensiones','Star source · voltages'), 'voltage'));
  $('traceMode').onchange = draw;
}
let filterLegend;
if(id==='rectifier'){
  const heatLink=document.createElement('a');
  heatLink.href='regulator-heat.html?lang='+lang;
  heatLink.className='heat-link';
  heatLink.textContent=t('Explorar el calor del regulador y añadir un disipador →','Explore regulator heating and attach a heat sink →');
  const connected=heatLink.cloneNode();
  connected.href='power-supply.html?lang='+lang;
  connected.textContent=t('Banco conectado · Rizado, potencia y temperatura →','Connected bench · Ripple, power and temperature →');
  const fault=heatLink.cloneNode();
  fault.href=connected.href+'&mode=surprise';
  fault.textContent=t('Diagnosticar una avería sorpresa de la fuente →','Diagnose a surprise power supply fault →');
  document.querySelector('.guided-pair').before(connected,fault,heatLink);
  $('orbit').textContent=t('Las bandas de C siguen la tensión filtrada. La barra junto a la carga indica la salida y su marca metálica señala 8 V. REG cambia de verde a naranja al perder regulación.','Bands on C follow the filtered voltage. The bar beside the load shows output, with a metal tick at 8 V. REG turns from green to orange in dropout.');
  $('limit').textContent=t('Modelo en régimen periódico a 50 Hz. Regulador lineal idealizado de 8 V con caída mínima fija de 1 V, sin corriente de reposo ni límites térmicos. Un recorrido abarca 20 ms.','Settled cycles at 50 Hz. The model uses an 8 V linear regulator with a fixed 1 V dropout, zero quiescent current and no thermal limits. One sweep spans 20 ms.');
  filterLegend=document.createElement('p');
  $('scope').after(filterLegend);
}
function filterPhase(m){
  const label=!values[2]?t('Sin condensador','Capacitor disconnected'):m.output===0?t('Sin tensión','No voltage'):m.bridgeCurrent===0?t('El condensador alimenta la carga','Capacitor supplies load'):m.capCurrent>1e-8?t('El puente recarga el condensador','Bridge recharges capacitor'):t('Puente alimentando la carga','Bridge feeding load');
  const mode=m.margin>=0?t('Regulación a 8 V','Holding 8 V'):t('Margen insuficiente','In dropout');
  return fmt(20*u)+' ms · '+label+(m.enabled?' · '+mode:'');
}
// Wave shapes change with the controls. Only the time cursor moves during playback.
const traceLayer = document.createElement('canvas');
let traceKey = '';
function plot() {
  if (!signal) return;
  const canvas = $('scope');
  const width = Math.max(280, Math.round(canvas.clientWidth));
  const left = 36, right = width - 12, span = right - left;
  const voltageMode = id === 'threephase' && $('traceMode').value === 'voltage';
  const key = [width, voltageMode, ...values].join('/');
  if (traceKey !== key) {
    traceKey = key;
    canvas.width = traceLayer.width = width;
    traceLayer.height = canvas.height;
    const ctx = traceLayer.getContext('2d');
    const regulatorOn=id==='rectifier' && values[4];
    if(filterLegend)filterLegend.textContent=regulatorOn
      ?t('Cian: filtro · Ámbar: carga regulada · Línea discontinua: mínimo de 9 V a la entrada.','Cyan: filtered input · Amber: regulated load · Dashed line: 9 V minimum input.')
      :t('Cian: puente sin filtro · Ámbar: carga filtrada con regulador puenteado.','Cyan: bare bridge · Amber: filtered load with regulator bypassed.');
    const limit = id === 'threephase' ? (voltageMode ? 18 : 1)
      : regulatorOn ? Math.max(10,values[0]) : id === 'opamp' ? Math.max(12, values[0]) : values[0];
    const unit = id === 'threephase' && !voltageMode ? ' p.u.' : ' V';
    const colors = ['#53dce9', '#f6ae58', '#b7a1ef'];
    ctx.strokeStyle = '#39505f';
    ctx.beginPath();
    ctx.moveTo(left, id==='rectifier'?125:75);
    ctx.lineTo(right, id==='rectifier'?125:75);
    ctx.stroke();
    ctx.fillStyle = '#b8ceda';
    ctx.font = '11px monospace';
    ctx.fillText((id==='rectifier'?'0–':'±') + fmt(limit) + unit, 4, 14);
    ctx.fillText(id==='rectifier'?'0 – 20 ms':id === 'ac' ? '0 – 100 ms' : t('Un ciclo · fase →', 'One cycle · phase →'), left, 143);
    const samples = Array.from({length: 241}, (_, i) => {
      const phase = i / 240 * (id === 'ac' ? values[1] * .1 : 1);
      return state(id, values, phase);
    });
    if(regulatorOn){
      const thresholdY=125-9/limit*100;
      ctx.save();
      ctx.setLineDash([5,4]);
      ctx.strokeStyle='#a6b5c4';
      ctx.beginPath();ctx.moveTo(left,thresholdY);ctx.lineTo(right,thresholdY);ctx.stroke();ctx.restore();
    }
    const labels = id === 'threephase' ? (voltageMode ? ['VA','VB','VA−VB'] : ['IA','IB','IC'])
      : id==='rectifier'?(regulatorOn?['Vcap','Vout']:['Vrect','Vload']):id === 'ac' ? ['Vin'] : ['Vin','Vout'];
    labels.forEach((label, index) => {
      ctx.strokeStyle = ctx.fillStyle = colors[index];
      ctx.fillText(label, width - labels.length * 40 + index * 40, 14);
      ctx.beginPath();
      samples.forEach((sample, i) => {
        let value = index === 0 ? sample.input : sample.output;
        if (id === 'threephase') {
          value = voltageMode ? (index === 2 ? sample.lineVoltage : sample.phaseVoltages[index]) : sample.currents[index];
        }
        const x = left + i / 240 * span;
        if(id==='rectifier'){
          const traces=regulatorOn?[sample.output,sample.loadVoltage]:[sample.bare,sample.output];
          value=traces[index];
        }
        const y = id==='rectifier'?125-value/limit*100:75-value/limit*52;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, canvas.height);
  ctx.drawImage(traceLayer, 0, 0);
  const cursor = left + u / (id === 'ac' ? values[1] * .1 : 1) * span;
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(cursor, 20);
  ctx.lineTo(cursor, 130);
  ctx.stroke();
}
function comparison(m){if(!saved)return;const root=$('comparison');root.replaceChildren();const table=document.createElement('table'),head=document.createElement('tr');for(const title of [t('Magnitud','Quantity'),'A',t('Ahora','Now')]){const th=document.createElement('th');th.textContent=title;head.append(th)}table.append(head);m.read.forEach((r,i)=>{const tr=document.createElement('tr');for(const txt of [r[lang],fmt(saved.read[i].value)+' '+r.unit,fmt(r.value)+' '+r.unit]){const td=document.createElement('td');td.textContent=txt;tr.append(td)}table.append(tr)});root.append(table);}
function draw(){const m=state(id,values,u);view?.draw(m);$('readings').replaceChildren(...m.read.map(r=>{const el=document.createElement('div');el.className='reading';const small=document.createElement('small'),b=document.createElement('b');small.textContent=r[lang];b.textContent=fmt(r.value)+' '+r.unit;el.append(small,b);return el}));$('time').value=u*1000;$('play').textContent=playing?t('Pausar','Pause'):t('Reproducir','Play');$('phase').textContent=id==='rectifier'?filterPhase(m):id==='fourstroke'?[t('Admisión','Intake'),t('Compresión','Compression'),t('Expansión','Power'),t('Escape','Exhaust')][m.phase]:d.kind==='pneumatic'?m.paths.join(' · '):Math.round(u*100)+' %';plot(m);comparison(m);window.foundationDebug=()=>({id,values:[...values],u,state:m,has3D:!!view,playing});}
$('time').oninput=()=>{markCondition(null);playing=false;u=+$('time').value/1000;draw()};$('play').onclick=()=>{markCondition(null);playing=!playing;last=0;draw()};$('cut').onclick=()=>{cut=!cut;view?.cut(cut);$('cut').setAttribute('aria-pressed',String(cut));draw()};$('reset').onclick=()=>{markCondition(null);values=d.controls.map(c=>c.value);u=0;playing=false;saved=null;$('comparison').replaceChildren();$('captureStatus').textContent='';controls();draw()};$('capture').onclick=()=>{saved=state(id,values,u);$('captureStatus').textContent=t('A guardada al ','A saved at ')+Math.round(u*100)+' %. '+t('Cambia una condición y compara.','Change one condition and compare.');draw()};
new IntersectionObserver(([e])=>{visible=e.isIntersecting;last=0}).observe($('stage'));matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{playing=false;draw()});
controls();try{const {mount}=await import('./scene.mjs');view=mount($('stage'),d.kind,id,lang)}catch(e){$('stage').textContent=t('3D no disponible. Puedes usar los controles y lecturas.','3D unavailable. Controls and readings still work.');console.error(e)}draw();let lastDraw=0;function tick(now){if(playing&&visible&&!document.hidden){if(last)u=(u+Math.min((now-last)/1000,.1)*playbackRate()/8)%1;last=now;}else last=0;if(visible&&!document.hidden&&now-lastDraw>40){draw();lastDraw=now}requestAnimationFrame(tick)}requestAnimationFrame(tick);
new ResizeObserver(()=>parent.postMessage({type:'foundation-height',height:document.body.scrollHeight},location.origin)).observe(document.body);
