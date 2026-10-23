import {createRepairExam,repairExamAction,repairExamScore,validRepairExam} from './repair-exam-model.mjs';
import {createRepairHistory} from './energy-repair-history.mjs';
import {createRepairSpacing,repairSpacingRows} from './energy-repair-spacing.mjs';
import {createEnergyResults} from './energy-results.mjs';
import {createEnergySpacing} from './energy-spacing.mjs';
import {faultCatalog,energyFaultScore} from './energy-faults.mjs';
let storage;try{storage=localStorage;}catch{}
const results=createEnergyResults(storage),history=createRepairHistory(storage,results.all()),spacing=createRepairSpacing(storage),general=createEnergySpacing(storage),key='mecanica.repair-exam.v1';
let exam=null,selected=0,ready=false,reviewIds=[],warning='';
try{const saved=JSON.parse(storage.getItem(key)||'null');if(validRepairExam(saved))exam=saved;}catch{warning='No se pudo recuperar el examen anterior.';}
const host=document.querySelector('#repairExam'),frame=document.querySelector('#lab'),names={transformload:'Transformador',opamp:'Operacional',relief:'Hidráulica'};
function persist(){try{storage.setItem(key,JSON.stringify(exam));}catch{warning='Este examen solo se conserva durante esta sesión.';}}
function saveResults(){if(exam?.status!=='finished')return;for(const c of exam.cases){history.save(c);results.save(c);}spacing.sync(repairSpacingRows(history.all()));general.sync(results.all());}
function send(){if(!ready||!exam)return;const c=exam.cases[selected];frame.contentWindow.postMessage({type:'energy-exam-case',faults:c.faults,level:c.level,repairedIds:exam.status==='active'?c.repairedIds:reviewIds},location.origin);}
function view(i,ids=[]){selected=i;reviewIds=[...ids];frame.hidden=false;const url='index.html?id='+exam.cases[i].lab+'&exam=1';if(frame.getAttribute('src')===url)send();else{ready=false;frame.src=url;}render();}
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;if(e.data?.type==='energy-exam-ready'){ready=true;send();render();}if(e.data?.type==='concept-height'&&Number.isFinite(e.data.height))frame.style.height=Math.max(700,Math.min(14000,e.data.height))+'px';});
function render(){host.replaceChildren();const el=(tag,text,parent=host)=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;};const button=(text,fn,parent=host)=>{const b=el('button',text,parent);b.onclick=fn;return b;};
 for(const w of [warning,history.warning(),results.warning(),spacing.warning()])if(w)el('p',w);
 if(!exam){el('p','100 puntos por caso; −15 por intervención innecesaria o verificación prematura, mínimo 0. La nota final es la media de los tres. Los resultados ajustan el plan al terminar.');button('Comenzar examen de reparación',()=>{exam=createRepairExam(history.all());persist();view(0);});return;}
 if(exam.status==='active'){
 const c=exam.cases[selected];el('h2','Caso '+(selected+1)+' / 3 · '+names[c.lab]);el('p','Sin pistas ni corrección detallada hasta terminar. Las intervenciones representan reparaciones con el equipo aislado. −15 puntos por intervención innecesaria o verificación prematura.');
 const last=c.steps.at(-1);el('p',last?(last.action==='verify'?'Todavía hay averías pendientes. Observa las diferencias antes de continuar.':'Intervención registrada. Observa cómo respondió el banco B.'):'Examina ambos bancos y elige tu primera intervención.');
 const act=(action,choice)=>{repairExamAction(exam,selected,action,choice);persist();if(exam.status==='finished'){saveResults();view(0);}else if(c.done)view(exam.cases.findIndex(s=>!s.done));else{send();render();}};
 for(const f of faultCatalog[c.lab]){const b=button(f.repair,()=>act('repair',f.id));b.dataset.examRepair=f.id;b.disabled=!ready;}
 const verify=button('Verificar y avanzar',()=>act('verify'));verify.dataset.examVerify='';verify.disabled=!ready;return;
 }
 el('h2','Examen terminado · '+repairExamScore(exam)+'/100');el('p','Resultados guardados por separado de tus exámenes de diagnóstico. Tus errores y verificaciones prematuras ya ajustan el plan de repaso.');
 exam.cases.forEach((c,i)=>{const card=el('article','');card.className='repair-case';el('h3',names[c.lab]+' · '+energyFaultScore(c)+'/100 · '+c.errors+' errores',card);el('p',c.faults.map(f=>faultCatalog[c.lab].find(x=>x.id===f).label).join(' + '),card);for(const f of c.faults)el('p',faultCatalog[c.lab].find(x=>x.id===f).explain,card);
 button('Comparar caso original',()=>view(i),card);button('Ver reparación completa',()=>view(i,c.faults),card);
 for(const [j,step] of c.steps.entries()){el('p','Paso '+(j+1)+' · '+(step.action==='verify'?'Comprobación':faultCatalog[c.lab].find(f=>f.id===step.choice)?.repair||'Intervención')+' · '+(step.wrong?'−15 puntos. ':'Correcto. ')+step.explanation,card);button('Antes del paso '+(j+1),()=>view(i,step.before),card);button('Después del paso '+(j+1),()=>view(i,step.after),card);}
 });el('h3','Comparación seleccionada · '+names[exam.cases[selected].lab]);el('p','A es la referencia; B reproduce las causas restantes en este paso. Usa la pausa y la velocidad de los bancos para observar las intermitencias.');
 const link=el('a','Ver mi plan de repaso actualizado');link.href='energy-exam.html?v=repair-weekly#repairHistory';button('Nuevo examen de reparación',()=>{exam=createRepairExam(history.all());persist();view(0);});
}
if(exam){saveResults();view(exam.status==='active'?Math.max(0,exam.cases.findIndex(c=>!c.done)):0);}else render();
window.repairExamDebug=()=>({exam,selected,ready,reviewIds});
