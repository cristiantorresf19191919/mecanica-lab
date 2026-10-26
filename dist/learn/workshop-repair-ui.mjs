import {newRepair,repairState,repairScore,intervene,captureRepair,verifyRepair,causes} from './workshop-repair-model.mjs';
import {required,sampleTimes,snapshot} from './workshop-model.mjs';
import {caseInfo} from './workshop-content.mjs';
import {alternate} from './workshop-challenges.mjs';
export function mountRepair({language,current,changed,measure,reading}){
 const root=document.createElement('section');root.id='repairChallenge';root.className='challenge-panel repair-challenge';document.querySelector('#banks').before(root);
 const sessions=new Map();let active=null,message='';const t=(es,en)=>language()==='es'?es:en,local=x=>x[language()];
 const key=()=>{const e=current();return e?.finished?e.id+':'+e.index:null;};
 const state=()=>active===key()?sessions.get(active):null;
 const button=(label,id,fn)=>{const b=add('button',label);b.dataset.repair=id;b.onclick=fn;return b;};
 const add=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;root.append(e);return e;};
 const actionLabel=(r,id)=>local(id==='primary'?caseInfo[r.kind].fix:alternate[r.kind].fix);
 function refresh(){changed();}
 function render(){root.replaceChildren();const e=current();root.hidden=!e?.finished;if(root.hidden){active=null;return;}add('h2',t('Taller de reparación después del examen','Post-exam repair workshop'));const r=state();
 if(!r){add('p',t('Elige qué corregir primero, repite las mediciones y comprueba el ciclo completo. La nota del examen no cambia.','Choose what to fix first, repeat measurements, then check the full cycle. Your exam grade stays unchanged.'));button(t('Reparar este caso','Repair this case'),'start',()=>{active=key();if(!sessions.has(active))sessions.set(active,newRepair(e.cases[e.index]));message=sessions.get(active).verified?'verified':'';measure(.5);refresh();});return;}
 add('p',t('A = referencia sana · B = estado después de tus intervenciones. Cada corrección reinicia el ensayo; no es una reparación con el equipo en marcha.','A = healthy reference · B = state after your interventions. Each correction restarts the test; this is not repair on running equipment.'));
 add('strong',t('Puntuación de reparación: ','Repair score: ')+repairScore(r)+'/100'+(r.verified?t(' · Verificado',' · Verified'):t(' · Provisional',' · Provisional')));
 add('p',t('−15 por intervención innecesaria · −5 por pista · −10 por verificación fallida. Ambos órdenes son válidos. El progreso se conserva al cambiar idioma o caso durante esta visita.','−15 per unnecessary intervention · −5 per hint · −10 per failed verification. Either repair order is valid. Progress survives language and case changes during this visit.'));
 add('h3',t('1 · Elige una intervención','1 · Choose an intervention'));
 for(const id of ['primary','alternate'])button(actionLabel(r,id)+(r.fixed.includes(id)?' ✓':''),id,()=>{const useful=intervene(r,id);message=useful?'fixed':'unnecessary';if(useful)measure(0);refresh();}).disabled=r.verified||r.fixed.includes(id);
 button(t('Pista (−5)','Hint (−5)'),'hint',()=>{r.hints++;message='hint';refresh();}).disabled=r.verified;
 if(message==='hint'){const left=causes(r).filter(x=>!r.fixed.includes(x));add('p',left.length?t('Revisa la medición que justifica: ','Review the measurement supporting: ')+actionLabel(r,left[0])+t('. Compara A y B; en intermitencias revisa 0,5 y 1,25.','. Compare A and B; for intermittent faults check 0.5 and 1.25.'):t('Las correcciones están aplicadas. Repite todas las mediciones y verifica el ciclo.','Corrections are applied. Repeat every measurement and verify the cycle.'));}
 const messages={fixed:t('Corrección aplicada. Repite todas las pruebas; otra causa puede seguir activa.','Correction applied. Repeat all tests; another cause may remain active.'),unnecessary:t('Esa intervención no elimina ninguna causa pendiente. Usa las mediciones para elegir.','That intervention removes no remaining cause. Use measurements to choose.'),missing:t('Faltan mediciones posteriores a la última corrección. No se descontaron puntos.','Measurements since the last correction are missing. No points deducted.'),remaining:t('Aún hay diferencias durante el ciclo. Una lectura normal aislada no demuestra reparación.','Differences remain during the cycle. One normal reading does not prove repair.'),verified:t('Verificado: todas las mediciones y 800 muestras del ciclo coinciden con A. Todos los fallos del modelo están resueltos.','Verified: all measurements and 800 cycle samples match A. All model faults are resolved.')};
 const status=add('p',messages[message]||'');status.setAttribute('role','status');
 add('h3',t('2 · Mide después de corregir','2 · Measure after repairing'));
 for(const time of sampleTimes(r))for(const id of required[r.kind]){const captured=r.readings.some(x=>x.id===id&&x.time===time);button(local(caseInfo[r.kind].tests[id])+' · t = '+time+(captured?' ✓':''),'measure-'+id+'-'+time,()=>{captureRepair(r,id,time);measure(time,id);refresh();});if(captured)add('p','A: '+reading(snapshot({...repairState(r),time},true),id)+' · B: '+reading(snapshot({...repairState(r),time}),id));}
 button(t('3 · Verificar todos los fallos','3 · Verify all faults'),'verify',()=>{message=verifyRepair(r);refresh();}).disabled=r.verified;
 if(r.actions.length){add('h3',t('Tus intervenciones, en orden','Your interventions, in order'));r.actions.forEach((a,i)=>add('p',(i+1)+'. '+actionLabel(r,a.id)+' · '+t(a.useful?'Causa corregida':'Sin efecto necesario',a.useful?'Cause corrected':'Unnecessary')));}
 button(t('Ver el caso original del examen','View original exam case'),'exit',()=>{active=null;message='';measure(.5);refresh();});
 }
 return {render,state:()=>state()?repairState(state()):null,active:()=>Boolean(state())};
}
