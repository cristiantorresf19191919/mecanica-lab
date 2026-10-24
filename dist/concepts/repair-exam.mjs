import {renderGuidedWeekly} from './guided-weekly.mjs';
import {createGuidedSpacing,guidedSpacingRows,guidedSpacingPlan,startSpacedGuided} from './guided-spacing.mjs';
import {renderEnergyCalendar} from './energy-calendar-ui.mjs';
import {renderGuidedProgress} from './repair-guided-progress.mjs';
import {createGuidedHistory,guidedInterventions,targetedGuidedRepair} from './repair-guided-history.mjs';
import {createGuidedRepair,guidedScore,guidedChoose,guidedHint,guidedNext} from './repair-guided.mjs';
import {sequenceSnapshot,renderSequence} from './repair-sequence.mjs';
import {createRepairExamArchive,repairExamMastery} from './repair-exam-history.mjs';
import {createExamRepair,applyExamRepair} from './energy-exam-repair.mjs';
import {createRepairExam,repairExamAction,repairExamScore,validRepairExam} from './repair-exam-model.mjs';
import {createRepairHistory} from './energy-repair-history.mjs';
import {createRepairSpacing,repairSpacingRows} from './energy-repair-spacing.mjs';
import {createEnergyResults} from './energy-results.mjs';
import {createEnergySpacing} from './energy-spacing.mjs';
import {faultCatalog,energyFaultScore} from './energy-faults.mjs';
let storage;try{storage=localStorage;}catch{}
const results=createEnergyResults(storage),history=createRepairHistory(storage,results.all()),spacing=createRepairSpacing(storage),general=createEnergySpacing(storage),key='mecanica.repair-exam.v1';
const archive=createRepairExamArchive(storage);const guidedHistory=createGuidedHistory(storage);const guidedSpacing=createGuidedSpacing(storage);let inspected=null,retry=null,guided=null;const shown=()=>inspected||exam;
let exam=null,selected=0,ready=false,reviewIds=[],reviewStep=null,sequence=null,warning='';
try{const saved=JSON.parse(storage.getItem(key)||'null');if(validRepairExam(saved))exam=saved;}catch{warning='No se pudo recuperar el examen anterior.';}
const host=document.querySelector('#repairExam'),frame=document.querySelector('#lab'),names={transformload:'Transformador',opamp:'Operacional',relief:'Hidráulica'};
function persist(){try{storage.setItem(key,JSON.stringify(exam));}catch{warning='Este examen solo se conserva durante esta sesión.';}}
function saveResults(){if(exam?.status!=='finished')return;archive.add(exam);for(const c of exam.cases){history.save(c);results.save(c);}spacing.sync(repairSpacingRows(history.all()));general.sync(results.all());}
function send(){if(!ready)return;if(guided){frame.contentWindow.postMessage({type:'energy-exam-case',faults:guided.faults,level:guided.level,repairedIds:guided.phase==='question'?guided.fixed:guided.recommendedIds,primaryRepairedIds:guided.fixed,paused:guided.phase==='question'},location.origin);return;}if(!shown())return;const c=retry?.state||shown().cases[selected];frame.contentWindow.postMessage({type:'energy-exam-case',faults:c.faults,level:c.level,repairedIds:sequence?sequenceSnapshot(c,sequence.index).recommendedIds:retry||shown().status==='active'?c.repairedIds:reviewIds,...(sequence?{primaryRepairedIds:sequenceSnapshot(c,sequence.index).user}:{})},location.origin);}
function view(i,ids=[],step=null,comparison=null){sequence=comparison;reviewStep=step;selected=i;reviewIds=[...ids];frame.hidden=false;const url='index.html?id='+(guided||retry?.state||shown().cases[i]).lab+'&exam=1';if(frame.getAttribute('src')===url)send();else{ready=false;frame.src=url;}render();}
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;if(e.data?.type==='energy-exam-ready'){ready=true;send();render();}if(e.data?.type==='concept-height'&&Number.isFinite(e.data.height))frame.style.height=Math.max(700,Math.min(14000,e.data.height))+'px';});
function render(){if(guided?.done)guidedHistory.save(guided);renderArchive();renderGuidedHistory();host.replaceChildren();const el=(tag,text,parent=host)=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;};const button=(text,fn,parent=host)=>{const b=el('button',text,parent);b.onclick=fn;return b;};
 for(const w of [warning,history.warning(),results.warning(),spacing.warning()])if(w)el('p',w);
 if(guided){renderGuided(el,button);return;}
 if(retry){renderRetry(el,button);return;}
 if(inspected)button('Volver al examen actual',()=>{inspected=null;if(exam)view(exam.status==='active'?Math.max(0,exam.cases.findIndex(c=>!c.done)):0);else{frame.hidden=true;render();}});
 if(!shown()){el('p','100 puntos por caso; −15 por intervención innecesaria o verificación prematura, mínimo 0. La nota final es la media de los tres. El examen prioriza errores anteriores y aumenta el nivel con resultados consistentes. Los repasos conocidos no desbloquean niveles de examen. Los resultados ajustan el plan al terminar.');button('Comenzar examen de reparación',()=>{exam=createRepairExam(history.all(),Math.random,archive.all());persist();view(0);});return;}
 if(!inspected&&exam.status==='active'){
 const c=exam.cases[selected];el('h2','Caso '+(selected+1)+' / 3 · '+names[c.lab]);el('p','Sin pistas ni corrección detallada hasta terminar. Las intervenciones representan reparaciones con el equipo aislado. −15 puntos por intervención innecesaria o verificación prematura.');
 const last=c.steps.at(-1);el('p',last?(last.action==='verify'?'Todavía hay averías pendientes. Observa las diferencias antes de continuar.':'Intervención registrada. Observa cómo respondió el banco B.'):'Examina ambos bancos y elige tu primera intervención.');
 const act=(action,choice)=>{repairExamAction(exam,selected,action,choice);persist();if(exam.status==='finished'){saveResults();view(0);}else if(c.done)view(exam.cases.findIndex(s=>!s.done));else{send();render();}};
 for(const f of faultCatalog[c.lab]){const b=button(f.repair,()=>act('repair',f.id));b.dataset.examRepair=f.id;b.disabled=!ready;}
 const verify=button('Verificar y avanzar',()=>act('verify'));verify.dataset.examVerify='';verify.disabled=!ready;return;
 }
 const reviewed=shown();el('h2','Examen terminado · '+repairExamScore(reviewed)+'/100');el('p','Resultados guardados por separado de tus exámenes de diagnóstico. Tus errores y verificaciones prematuras ya ajustan el plan de repaso.');
 reviewed.cases.forEach((c,i)=>{const card=el('article','');card.className='repair-case';el('h3',names[c.lab]+' · '+energyFaultScore(c)+'/100 · '+c.errors+' errores',card);el('p',c.adaptation||'Examen anterior a la selección adaptativa.',card);el('p',c.faults.map(f=>faultCatalog[c.lab].find(x=>x.id===f).label).join(' + '),card);for(const f of c.faults)el('p',faultCatalog[c.lab].find(x=>x.id===f).explain,card);
 if(c.errors>0){const b=button('Repetir este caso con errores',()=>{retry=createExamRepair(reviewed,i);view(i);},card);b.dataset.retryRepairCase=i;}const guide=button('Practicar con guía',()=>{guided=createGuidedRepair(c);view(i);},card);guide.dataset.guidedCase=i;const compare=button('Comparar mi secuencia con la recomendada',()=>view(i,[],null,{index:0}),card);compare.dataset.compareSequence=i;button('Comparar caso original',()=>view(i),card);button('Ver reparación completa',()=>view(i,c.faults),card);
 for(const [j,step] of c.steps.entries()){el('p','Paso '+(j+1)+' · '+(step.action==='verify'?'Comprobación':faultCatalog[c.lab].find(f=>f.id===step.choice)?.repair||'Intervención')+' · '+(step.wrong?'−15 puntos. ':'Correcto. ')+step.explanation,card);button('Antes del paso '+(j+1),()=>view(i,step.before,{index:j,phase:'before'}),card);button('Después del paso '+(j+1),()=>view(i,step.after,{index:j,phase:'after'}),card);}
 });el('h3','Comparación seleccionada · '+names[reviewed.cases[selected].lab]);if(!sequence)el('p','A es la referencia; B reproduce las causas restantes en este paso. Usa la pausa y la velocidad de los bancos para observar las intermitencias.');if(sequence){const section=el('section','');renderSequence(section,reviewed.cases[selected],sequence.index,n=>view(selected,[],null,{index:n}));button('Volver a referencia normal',()=>view(selected));}
 if(reviewStep){const c=reviewed.cases[selected],j=reviewStep.index,step=c.steps[j];el('h4','Paso '+(j+1)+' · '+(reviewStep.phase==='before'?'Antes de intervenir':'Después de intervenir'));el('p',step.explanation);button('Paso anterior',()=>{const k=Math.max(0,j-1);view(selected,c.steps[k].before,{index:k,phase:'before'});}).disabled=j===0;button('Paso siguiente',()=>{const k=Math.min(c.steps.length-1,j+1);view(selected,c.steps[k].after,{index:k,phase:'after'});}).disabled=j===c.steps.length-1;}
 const link=el('a','Ver mi plan de repaso actualizado');link.href='energy-exam.html?v=repair-weekly#repairHistory';button('Nuevo examen de reparación',()=>{inspected=null;exam=createRepairExam(history.all(),Math.random,archive.all());persist();view(0);});
}
function renderGuided(el,button){
 const g=guided;if(guidedHistory.warning())el('p',guidedHistory.warning());el('h2','Reparación guiada · '+names[g.lab]);el('p','Puntuación: '+guidedScore(g)+'/100 · '+g.errors+' errores · '+g.hints+' pistas. −15 por error, −10 por pista; un orden alternativo válido no resta.');
 el('p','Cada pregunta empieza con el mismo estado en ambos bancos. A muestra tu elección y B la recomendación para ese estado. Al completar se guarda en tu historial guiado, sin cambiar las notas del examen. Un intento sin terminar se pierde al salir o recargar.');
 if(g.reviewTarget)el('p','Repaso personalizado según tu historial. Los retos estables conservan el contexto relevante de tu decisión; los niveles superiores comienzan con las averías activas.');if(g.adaptation)el('p','Nivel '+({basic:'estable',intermittent:'intermitente',combined:'combinado'}[g.level])+': '+g.adaptation);el('h3',g.phase==='question'?'Bancos en pausa · ¿qué intervención harías ahora?':g.done?'Práctica terminada':'Compara las consecuencias');const feedback=el('p',g.feedback);feedback.setAttribute('role','status');
 if(g.phase==='question'){
 for(const f of faultCatalog[g.lab]){const b=button(f.repair,()=>{guidedChoose(g,'repair',f.id);send();render();});b.dataset.guidedChoice=f.id;b.disabled=!ready;}
 const verify=button('Verificar todas las averías',()=>{guidedChoose(g,'verify');send();render();});verify.dataset.guidedVerify='';verify.disabled=!ready;
 const hint=button('Pedir pista (−10)',()=>{guidedHint(g);render();});hint.dataset.guidedHint='';hint.disabled=!ready||g.hintUsed;
 }else{
 const r=g.recommendation;el('p','Recomendación: '+(r.action==='verify'?'Verificar todas las averías':faultCatalog[g.lab].find(f=>f.id===r.choice).repair)+'.');el('p',g.done?'Ambos bancos muestran ahora el sistema reparado.':'Observa las lecturas y las piezas en movimiento. La siguiente pregunta vuelve a pausar ambos bancos desde el estado que dejaste tú.');
 if(!g.done){const next=button('Siguiente decisión · pausar',()=>{guidedNext(g);send();render();});next.dataset.guidedNext='';}
 else el('p','Resolviste todas las causas y completaste la verificación. Puntuación final: '+guidedScore(g)+'/100. Resultado registrado en el historial guiado.');
 }
 button('Salir del modo guiado',()=>{guided=null;if(shown())view(shown().status==='active'?Math.max(0,shown().cases.findIndex(c=>!c.done)):selected);else{frame.hidden=true;render();}});
}
function renderRetry(el,button){
 const c=retry.state;el('h2','Repaso del caso · '+names[c.lab]);el('p','Mismas averías y nivel que el original. La puntuación de práctica no reemplaza la nota del examen.');el('p','Puntuación: '+energyFaultScore(c)+'/100 · −15 por error · −10 por pista');el('p',c.log.at(-1)||'Observa ambos bancos y elige una reparación.');
 const act=(action,choice)=>{applyExamRepair(retry,action,choice);if(c.done){history.save(c);results.save(c);spacing.sync(repairSpacingRows(history.all()));general.sync(results.all());}send();render();};
 for(const f of faultCatalog[c.lab]){const b=button(f.repair,()=>act('repair',f.id));b.dataset.retryFault=f.id;b.disabled=!ready||c.done;}
 const hint=button('Pedir pista (−10)',()=>act('hint'));hint.disabled=!ready||c.done;const check=button('Comprobar reparación',()=>act('verify'));check.dataset.retryVerify='';check.disabled=!ready||c.done;
 if(c.done)el('p','Práctica guardada y plan actualizado. La nota original permanece intacta.');
 button('Volver a la revisión',()=>{retry=null;view(selected);});el('p','El resultado completado se guarda en este navegador; un repaso en curso se pierde al salir o recargar.');
}
function renderGuidedHistory(){
 let root=document.querySelector('#guidedHistory');if(!root){root=document.createElement('section');root.id='guidedHistory';host.before(root);}root.replaceChildren();
 const add=(tag,text,parent=root)=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;};
 add('h2','Tu progreso en reparación guiada');const guidedExamLink=add('a','Examen semanal del modo guiado →');guidedExamLink.href='guided-exam.html';add('p','Hasta 100 prácticas completadas en este navegador. Las sesiones anteriores a este historial no se pueden recuperar. Las notas de examen permanecen intactas.');if(guidedHistory.warning())add('p',guidedHistory.warning());
 const rows=guidedHistory.all();guidedSpacing.sync(guidedSpacingRows(rows));renderGuidedWeekly(root,{rows,store:guidedSpacing,begin:item=>{guided=startSpacedGuided(item,rows);retry=null;view(0);host.scrollIntoView({block:'start'});}});renderEnergyCalendar(root,{store:guidedSpacing,rows:[],plan:guidedSpacingPlan(rows),kind:'guided',onGoalChange:render,begin:item=>{guided=startSpacedGuided(item,rows);retry=null;view(0);host.scrollIntoView({block:'start'});}});if(!rows.length){add('p','Completa una práctica con guía para descubrir qué decisiones conviene repasar.');return;}
 const details=add('details','');add('summary','Resultados · '+rows.length+' prácticas',details);
 for(const r of [...rows].reverse()){add('p',new Date(r.finishedAt).toLocaleString('es-CO')+' · '+names[r.lab]+' · '+({basic:'básico',combined:'combinado',intermittent:'intermitente'}[r.level])+' · '+guidedScore(r)+'/100 · '+r.errors+' errores · '+r.hints+' pistas'+(r.guidedExam?' · Examen guiado':r.reviewTarget?' · Repaso personalizado':''),details);}
 renderGuidedProgress(root,rows,guidedInterventions(rows));add('h3','Intervenciones que conviene practicar');add('p','Se priorizan los errores en las últimas cinco decisiones de cada intervención. Las pistas se atribuyen a la acción sugerida. El reto ajusta causas y nivel a tu progreso: estable para reforzar, intermitente al consolidar y combinado con evidencia en ambas reparaciones y la verificación. No es una prueba sorpresa.');
 for(const item of guidedInterventions(rows)){
 add('p',names[item.lab]+' · '+item.label+' · '+item.errors+'/'+item.n+' decisiones con error · '+item.hints+' pistas · '+item.recentErrors+' errores recientes.');if(item.errors)add('p',item.kinds.repeated+' reparaciones repetidas · '+item.kinds.unnecessary+' intervenciones sobre causas ausentes · '+item.kinds.premature+' verificaciones prematuras.');
 if(item.source){const b=add('button',item.errors?'Repasar esta decisión':'Practicar de nuevo');b.dataset.guidedReview=item.lab+':'+(item.choice||'verify');b.onclick=()=>{guided=targetedGuidedRepair(item,rows);retry=null;view(0);host.scrollIntoView({block:'start'});};}
 }
}
function renderArchive(){
 let root=document.querySelector('#repairExamHistory');if(!root){root=document.createElement('section');root.id='repairExamHistory';host.before(root);}root.replaceChildren();
 const add=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;root.append(n);return n;};
 add('h2','Historial de exámenes de reparación');add('p','Hasta 50 exámenes completos en este navegador. Se recupera el último examen disponible; los intentos antiguos sobrescritos no se pueden reconstruir. Los repasos no cambian estas notas.');if(archive.warning())add('p',archive.warning());
 const rows=archive.all();if(!rows.length){add('p','Termina un examen para comenzar tu historial.');return;}
 for(let i=rows.length-1;i>=0;i--){const e=rows[i],score=repairExamScore(e),previous=rows[i-1];add('p',new Date(e.finishedAt).toLocaleString('es-CO')+' · '+score+'/100'+(previous?' · '+(score-repairExamScore(previous))+' puntos frente al anterior':'')+' · '+e.cases.filter(c=>c.errors>0).length+' casos con errores');add('p',e.cases.map(c=>names[c.lab]+': '+({basic:'básico',combined:'combinado',intermittent:'intermitente'}[c.level])).join(' · '));const meter=add('meter','');meter.max=100;meter.value=score;meter.setAttribute('aria-label','Nota '+score+' de 100');const b=add('button','Revisar examen');b.dataset.repairArchive=e.id;b.onclick=()=>{retry=null;guided=null;inspected=e;view(0);host.scrollIntoView({block:'start'});};}
 add('p','Las notas pueden corresponder a dificultades distintas. La diferencia por sí sola no demuestra mejora.');add('h3','Qué averías vas consolidando');add('p','Últimos tres exámenes relevantes por causa. Se cuentan intervenciones incorrectas y comprobaciones prematuras sobre causas pendientes; una comprobación puede afectar varias causas. Tres resultados sin errores indican consistencia, no certifican dominio.');
 for(const m of repairExamMastery(rows))add('p',names[m.lab]+' · '+m.label+' · '+m.clean+'/'+m.recent+' recientes sin errores · '+m.errors+' errores acumulados · '+m.status);
}
if(exam){saveResults();view(exam.status==='active'?Math.max(0,exam.cases.findIndex(c=>!c.done)):0);}else render();
window.repairExamDebug=()=>({exam,selected,ready,reviewIds,reviewStep,sequence,inspected,retry,guided});
