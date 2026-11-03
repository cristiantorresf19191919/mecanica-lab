import {mountHistory} from './attempt-history.mjs';
import {compare,end,contact,manualPair} from './synchro-compare.mjs';
const $=id=>document.getElementById(id),en=new URLSearchParams(location.search).get('lang')==='en',t=(es,eng)=>en?eng:es,num=x=>x.toLocaleString(en?'en':'es',{maximumFractionDigits:1}),set=(el,val)=>{if(el.textContent!==val)el.textContent=val};
document.documentElement.lang=en?'en':'es';
for(const [id,es,eng] of [
 ['back','← Cambio 1.ª → 2.ª','← First → second'],['lang','EN','ES'],['tag','Banco comparativo / cámara lenta','Comparison bench / slow motion'],['title','¿Por qué rasca segunda?','Why does second gear grind?'],['intro','Mismo cambio, dos anillos. Sigue la rueda libre de segunda y el cubo que lleva el manguito.','Same shift, two rings. Follow the free second gear and the hub carrying the sleeve.'],['speed','Reproducción','Playback'],['timeline','Cursor común','Shared timeline'],['jump','Ver el intento de acople · 2,15 s','Inspect the engagement attempt · 2.15 s'],['waitLabel','Esperar a Δ = 0 en la caja desgastada','Wait for Δ = 0 in the worn gearbox'],['tag2','Lectura del banco','Bench observation'],['limits','Modelo ilustrativo: salida constante por inercia, velocidades en magnitud. Se prescribe la mitad de frenado en el cono desgastado; el choque solo se representa si además se permite un intento prematuro. Los tiempos no son valores de diagnóstico.','Illustrative model: coasting output at constant speed; readings are magnitudes. The worn cone has half the prescribed deceleration. Clash requires an early engagement attempt as well. These times are not diagnostic limits.']])set($(id),t(es,eng));
document.title=$('title').textContent+' · Mecánica Lab';$('back').href='upshift.html?lang='+(en?'en':'es');$('lang').href='?lang='+(en?'es':'en');
function add(tag,host,cls=''){const el=document.createElement(tag);el.className=cls;host.append(el);return el}
const benches=[t('Sincronizador sano','Healthy synchronizer'),t('Sincronizador desgastado','Worn synchronizer')].map((name,i)=>{
 const card=add('section',$('pair'),'glass'),head=add('div',card,'plate');add('strong',head).textContent=name;const state=add('small',head);
 const stage=add('div',card,'stage'),read=add('div',card,'comparison-read'),gap=add('b',read);
 const values=[t('Motor','Engine'),t('Primario','Input'),t('Salida / cubo','Output / hub'),t('Rueda de 2.ª','Second gear')].map(label=>{const row=add('div',read);add('span',row).textContent=label;return add('output',row)});
 return {card,state,stage,gap,values,rig:null}
});
let time=0,running=false,last=null,wait=false;
const captions=[
 ['Primera transmite','First gear drives','Ambas cajas parten a 900 rpm de motor y 300 rpm de salida. La rueda libre de segunda gira a 540 rpm.','Both start at 900 engine rpm and 300 output rpm. The free second gear turns at 540 rpm.'],
 ['El motor se separa','Engine disconnected','El embrague abre; el cubo sigue a la salida. Ahora el motor puede bajar de vueltas independientemente del primario.','The clutch opens; the hub follows the output. Engine speed can now fall independently of input speed.'],
 ['El cono frena la rueda','The cone slows the wheel','Los dos anillos empiezan con 240 rpm de diferencia. En el desgastado, la diferencia se cierra más despacio.','Both rings start with a 240 rpm mismatch. In the worn case the gap closes more slowly.'],
 ['Una caja ya está sincronizada','One gearbox is synchronized','En la sana, rueda y cubo ya coinciden. La desgastada aún necesita tiempo antes de que el manguito pueda acoplarse limpiamente.','Healthy wheel and hub speeds match. The worn unit still needs time before clean engagement.'],
 ['Los dientes se encuentran a distinta velocidad','The engagement teeth meet at different speeds','Sigue el manguito rojo: intenta entrar, toca los dientes de acoplamiento y retrocede. Ese contacto repetido produce el rascado. Los dientes grandes del par de engranajes siguen engranados.','Watch the red sleeve attempt to enter, touch the dog teeth and recoil. Repeated contact creates the grind. The large gear teeth remain in mesh.'],
 ['El manguito espera','The sleeve waits','Aunque hay diferencia de rpm, el manguito se mantiene atrás. Sin contacto prematuro entre dientes de acoplamiento no hay rascado.','A speed gap remains, but the sleeve stays back. Without premature dog-tooth contact there is no grind.'],
 ['El anillo termina de sincronizar','The ring finishes synchronizing','La segunda desgastada sigue libre mientras el cono reduce la diferencia restante.','The worn unit’s second gear remains free as cone friction closes the remaining gap.'],
 ['Ya puede entrar segunda','Second can now engage','Con rueda y cubo a 300 rpm, el manguito completa su recorrido sin choque. Después se vuelve a cerrar el embrague.','With wheel and hub both at 300 rpm, the sleeve completes its travel without clash. The clutch then re-engages.']
];
let manual=true,attempt=null;
const finish=()=>manual?Math.max(end,(attempt??0)+.6):end;
set($('modeLabel'),t('Modo','Mode'));set($('mode').options[0],t('Intento manual','Manual attempt'));set($('mode').options[1],t('Demostración','Demonstration'));set($('attempt'),t('Meter segunda ahora','Try second now'));set($('retry'),t('Nuevo intento','New attempt'));
function draw(){const fs=manual?manualPair(time,attempt):compare(time,wait);
 $('cursor').max=Math.round(finish()*1000);
 $('attempt').disabled=time<.9||attempt!==null;
 set($('instruction'),time<.9?t('Avanza hasta el cono (0,90 s) para intentar el acople.','Advance to cone contact (0.90 s) to try engagement.'):attempt===null?t('Pulsa durante la reproducción o elige el instante con el cursor.','Press during playback or choose the instant with the cursor.'):t('El cursor reproduce la misma decisión. Nuevo intento libera ambos manguitos.','Scrub to replay this decision. New attempt releases both sleeves.'));
benches.forEach((b,i)=>{const f=fs[i];b.card.classList.toggle('clash',!!f.clash);set(b.state,f.clash?t('Choque','Clash'):f.locked?(f.locked===1?'1 →':'2 →'):t('Libre','Free'));set(b.gap,'Δ '+num(f.delta)+' rpm');[f.engine.rpm,f.input.rpm,f.output,f.second].forEach((v,j)=>set(b.values[j],num(Math.abs(v))+' rpm'));b.rig?.label(f.clash?t('Dientes en choque','Dog-tooth clash'):[t('Embrague','Clutch'),t('Manguito','Sleeve'),t('Anillo','Ring'),t('Rueda de segunda','Second gear'),t('Manguito','Sleeve'),t('Embrague','Clutch'),t('Salida','Output')][f.phase]);b.rig?.draw(0,f)});
 const idx=time<.4?0:time<.9?1:time<1.9?2:time<contact?3:fs[1].clash?4:time<2.9?(wait?5:6):7;
 set($('event'),captions[idx][+en]);set($('detail'),captions[idx][2+(+en)]);if(manual){set($('event'),attempt===null||time<attempt?t('Elige cuándo intentar el acople','Choose when to attempt engagement'):t('Respuesta a tu intento','Response to your attempt'));set($('detail'),t('El modelo prueba el contacto aunque quede diferencia de velocidad. Un bloqueo eficaz impediría ese intento prematuro. Si rasca, el manguito retrocede y la marcha queda libre.','This model tests tooth contact even with a speed mismatch. Effective blocking would prevent premature contact. On clash the sleeve recoils and the gear stays free.'))}
 set($('time'),time.toLocaleString(en?'en':'es',{minimumFractionDigits:2,maximumFractionDigits:2})+' / '+num(finish())+' s');$('cursor').value=Math.round(time*1000);set($('play'),running?t('Ⅱ Pausar','Ⅱ Pause'):time>=finish()?t('↺ Repetir','↺ Replay'):t('▷ Reproducir','▷ Play'))}
function seek(v){time=v;running=false;last=null;draw()}
function clearAttempt(){attempt=null;$('replaySaved').hidden=true;set($('receipt'),'')}
$('mode').onchange=()=>{manual=$('mode').value==='manual';clearAttempt();$('manualControls').hidden=!manual;$('wait').parentElement.hidden=manual;$('jump').hidden=manual;seek(0)};
$('wait').parentElement.hidden=true;$('jump').hidden=true;
set($('historyLink'),t('Mis intentos · gráfica de rpm','My attempts · RPM chart'));
set($('replaySaved'),t('▷ Reproducir este intento','▷ Replay this attempt'));
function receipt(r){
 const stamp=(r.ms/1000).toLocaleString(en?'en':'es',{minimumFractionDigits:3,maximumFractionDigits:3});
 set($('receipt'),'#'+r.id+' · '+stamp+' s · '+r.banks.map((b,i)=>(i?t('Desgastado','Worn'):t('Sano','Healthy'))+': '+(b.clash?t('rasca','clash'):t('entra suave','smooth'))+' ('+num(b.wheel)+' / '+num(b.hub)+' rpm; Δ '+num(b.delta)+' rpm)').join(' · '));
 const clashes=r.banks.filter(b=>b.clash).length;
 $('receipt').append(' '+(clashes===0?t('Ambas ruedas ya giraban con su cubo: los dientes pudieron entrar sin golpe.','Both wheels already matched their hubs, so the teeth could engage cleanly.'):clashes===2?t('En ambas cajas la rueda todavía adelantaba al manguito; los dientes se tocaron antes de igualar velocidades.','In both boxes the wheel still overtook the sleeve, so the teeth touched before their speeds matched.'):t('Solo el anillo sano había igualado velocidades. En el otro banco, la rueda aún adelantaba al manguito al tocar los dientes.','Only the healthy ring had matched speeds. In the other box the wheel still overtook the sleeve when the teeth met.')));
 $('replaySaved').hidden=false;
}
const archive=mountHistory($('attemptHistory'),en,r=>{
 $('mode').value='manual';$('mode').onchange();attempt=r.ms/1000;receipt(r);seek(attempt);
 $('replaySaved').focus({preventScroll:true});$('receipt').scrollIntoView({block:'start'});
});
$('replaySaved').onclick=()=>{if(attempt===null)return;seek(Math.max(0,attempt-.25));running=true;last=null;draw()};
$('attempt').onclick=()=>{attempt=Math.round(time*1000)/1000;time=attempt;receipt(archive.save(attempt));running=true;last=null;draw()};
$('retry').onclick=()=>{clearAttempt();seek(.9)};
$('cursor').oninput=()=>seek(+$('cursor').value/1000);$('jump').onclick=()=>seek(contact);$('wait').onchange=()=>{wait=$('wait').checked;seek(time)};$('play').onclick=()=>{if(time>=finish())time=0;running=!running;last=null;draw()};draw();
try{const {bench}=await import('./model.mjs');for(const b of benches){b.rig=bench(b.stage);b.rig.setup(5,2,{step:1})}}catch{for(const b of benches)if(!b.rig)b.stage.textContent=t('3D no disponible. Lecturas activas.','3D unavailable. Readings remain active.')}
document.addEventListener('visibilitychange',()=>last=null);
function frame(now){if(!document.hidden){if(running&&last!==null){time=Math.min(finish(),time+(now-last)*.001*+$('rate').value);if(time>=finish())running=false}draw();last=now}requestAnimationFrame(frame)}requestAnimationFrame(frame);
