import {mountRepairWeekly} from './workshop-repair-weekly-ui.mjs';
import {mountRepairReviews} from './workshop-repair-review-ui.mjs';
import {repairDraftKey,validRepair,loadRepairHistory,archiveRepair,repairStrengths} from './workshop-repair-history.mjs';
import {newRepair,repairState,repairScore,intervene,captureRepair,verifyRepair,causes} from './workshop-repair-model.mjs';
import {required,sampleTimes,snapshot} from './workshop-model.mjs';
import {caseInfo} from './workshop-content.mjs';
import {alternate} from './workshop-challenges.mjs';
export function mountRepair({language,current,changed,measure,reading}){
 const root=document.createElement('section');root.id='repairChallenge';root.className='challenge-panel repair-challenge';document.querySelector('#banks').before(root);
 const sessions=new Map();let active=null,message='',saveError=false;try{const saved=JSON.parse(localStorage.getItem(repairDraftKey)||'{}');for(const [k,r]of Object.entries(saved.sessions||{}))if(validRepair(r))sessions.set(k,r);active=typeof saved.active==='string'?saved.active:null;}catch{saveError=true;}const t=(es,en)=>language()==='es'?es:en,local=x=>x[language()];
 const key=()=>{const e=current();return e?.finished?e.id+':'+e.index:null;};
 const state=()=>active===key()?sessions.get(active):null;
 const button=(label,id,fn)=>{const b=add('button',label);b.dataset.repair=id;b.onclick=fn;return b;};
 const add=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;root.append(e);return e;};
 const actionLabel=(r,id)=>local(id==='primary'?caseInfo[r.kind].fix:alternate[r.kind].fix);
 const archive=document.createElement('section');archive.id='repairHistory';archive.className='challenge-panel';document.querySelector('main').append(archive);
 const fresh=c=>({...newRepair(c),id:crypto.randomUUID(),started:new Date().toISOString()});
 function persist(){try{for(const r of sessions.values())if(r.verified){r.finished ||=new Date().toISOString();archiveRepair(localStorage,r);}localStorage.setItem(repairDraftKey,JSON.stringify({active,sessions:Object.fromEntries([...sessions].slice(-40))}));saveError=false;}catch{saveError=true;}}
 function refresh(){persist();changed();}
 const faultName=r=>{const primary={mechanics:'ground',electronics:'clipping',hydraulics:'leak',pneumatics:'restriction'},a=local(caseInfo[r.kind].options[primary[r.kind]]),b=local(alternate[r.kind].label);return (r.fault.startsWith('intermittent-')?t('Intermitente: ','Intermittent: '):'')+(r.fault==='combined'?a+' + '+b:r.fault.endsWith('alternate')?b:a);};
 function launch(g){active=key();sessions.set(active,fresh(g));message='';measure(.5);refresh();root.scrollIntoView({block:'start'});}
 const reviews=mountRepairReviews({language,host:archive,faultName,launch,onGoalChange:()=>weekly.render(),available:()=>Boolean(current()?.finished)});
 const weekly=mountRepairWeekly({language,host:archive,faultName,launch,available:()=>Boolean(current()?.finished)});
 function history(){archive.replaceChildren();const put=(tag,text,host=archive)=>{const n=document.createElement(tag);n.textContent=text;host.append(n);return n;};
 put('h2',t('Historial de reparaciones','Repair history'));put('p',t('Últimas 100 reparaciones verificadas en este navegador. La nota del examen permanece intacta. Las comparaciones agrupan el mismo taller y configuración de fallo; los casos combinados no atribuyen el error a una sola causa.','Latest 100 verified repairs in this browser. Exam grades stay unchanged. Comparisons group the same workshop and fault configuration; combined cases do not attribute an error to a single cause.'));
 let rows=[];try{rows=loadRepairHistory(localStorage);}catch{saveError=true;}
 reviews.render(rows);weekly.render(rows);
 if(saveError){put('p',t('No se pudo leer o guardar el historial. La sesión sigue en memoria.','History could not be read or saved. Your session remains in memory.')).setAttribute('role','status');const retry=put('button',t('Reintentar guardar','Retry saving'));retry.onclick=refresh;}
 if(!rows.length){put('p',t('Completa y verifica una reparación para comenzar tu historial.','Complete and verify a repair to start your history.'));return;}

 const groups=repairStrengths(rows);put('h3',t('Qué practicar · primero lo que más cuesta','What to practise · hardest first'));put('p',t('Prioridad según la nota media de los últimos tres intentos del mismo caso. Las barras comparan tu primer intento y el más reciente. Un único resultado todavía no demuestra dominio.','Priority uses the average score of the latest three attempts at the same case. Bars compare your first and latest attempts. One result does not yet establish mastery.'));
 for(const g of groups){const card=put('article','');card.className='repair-progress-card';put('h4',local(caseInfo[g.kind].title)+' · '+faultName(g),card);put('p',g.count+' '+t(g.count===1?'intento · media reciente ':'intentos · media reciente ',g.count===1?'attempt · recent average ':'attempts · recent average ')+g.mean+'/100',card);
 for(const [name,value]of [[t('Primero','First'),g.first],[t('Último','Latest'),g.latest]]){const label=put('label',name+' '+value+'/100',card),meter=put('meter','',label);meter.min=0;meter.max=100;meter.value=value;meter.setAttribute('aria-label',name+' '+value+'/100');}
 put('p',t('Últimos tres: ','Latest three: ')+g.unnecessary+t(' intervenciones innecesarias · ',' unnecessary interventions · ')+g.hints+t(' pistas · ',' hints · ')+g.failedChecks+t(' verificaciones fallidas',' failed verifications'),card);
 const b=put('button',t('Practicar esta avería','Practise this fault'),card);b.dataset.repairPractice=g.key;b.disabled=!current()?.finished;b.onclick=()=>launch(g);}
 if(!current()?.finished)put('p',t('Termina o abre un examen completado para practicar sin interrumpir una evaluación.','Finish or open a completed exam to practise without interrupting an assessment.'));
 const details=put('details','');put('summary',t('Comparar todos mis resultados','Compare all my results'),details);for(const r of [...rows].reverse()){put('p',new Date(r.finished).toLocaleString(language())+' · '+local(caseInfo[r.kind].title)+' · '+faultName(r)+' · '+repairScore(r)+'/100',details);}
 }

 function render(){history();root.replaceChildren();const e=current();root.hidden=!e?.finished;if(root.hidden){active=null;return;}add('h2',t('Taller de reparación después del examen','Post-exam repair workshop'));const r=state();
 if(!r){add('p',t('Elige qué corregir primero, repite las mediciones y comprueba el ciclo completo. La nota del examen no cambia.','Choose what to fix first, repeat measurements, then check the full cycle. Your exam grade stays unchanged.'));button(t('Reparar este caso','Repair this case'),'start',()=>{active=key();if(!sessions.has(active))sessions.set(active,fresh(e.cases[e.index]));message=sessions.get(active).verified?'verified':'';measure(.5);refresh();});return;}
 add('p',t('A = referencia sana · B = estado después de tus intervenciones. Cada corrección reinicia el ensayo; no es una reparación con el equipo en marcha.','A = healthy reference · B = state after your interventions. Each correction restarts the test; this is not repair on running equipment.'));
 if(saveError)add('p',t('No se pudo guardar. Usa Reintentar guardar en el historial.','Could not save. Use Retry saving in history.'));
 add('strong',t('Puntuación de reparación: ','Repair score: ')+repairScore(r)+'/100'+(r.verified?t(' · Verificado',' · Verified'):t(' · Provisional',' · Provisional')));
 add('p',t('−15 por intervención innecesaria · −5 por pista · −10 por verificación fallida. Ambos órdenes son válidos. El progreso y los resultados se guardan en este navegador; puedes recargar y continuar.','−15 per unnecessary intervention · −5 per hint · −10 per failed verification. Either repair order is valid. Progress and results are saved in this browser; reload to resume.'));
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
