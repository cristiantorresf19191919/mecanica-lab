import {faultCatalog} from './energy-faults.mjs';
import {guidedSpacingPlan} from './guided-spacing.mjs';
import {interventionSessions} from './repair-guided-progress.mjs';
export function examEvidence(practice,exams=[]){const map=new Map();for(const r of [...practice,...exams.flatMap(e=>e.cases)])if(r.done)map.set(r.id,r);return [...map.values()].sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt));}
export function adaptiveExamPlan(rows,random=Math.random){return Object.keys(faultCatalog).map(lab=>{
 const items=guidedSpacingPlan(rows).filter(p=>p.lab===lab).map(item=>{const recent=interventionSessions(rows,item).slice(-3);const errors=recent.filter(s=>!s.clean);return {...item,weight:errors.reduce((n,s)=>n+(s.row.guidedExam?4:2),0)+(recent.length?0:1),recent};});
 const best=Math.max(...items.map(x=>x.weight)),pool=items.filter(x=>x.weight===best),target=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
 const exams=rows.filter(r=>r.lab===lab&&r.guidedExam&&!r.reviewTarget).slice(-3),examClean=exams.length===3&&exams.every(r=>r.errors===0&&r.hints===0);
 const advanced=examClean&&items.every(item=>{const ss=item.recent;return ss.length===3&&ss.every(s=>s.clean)&&ss.some(s=>s.row.level==='intermittent'||s.row.level==='combined');});
 const level=advanced?'combined':examClean?'intermittent':'basic';
 const lastError=target.recent.filter(s=>!s.clean).at(-1)?.row;
 // Preserve the original cause when the error was an unnecessary intervention.
 const single=lastError?.faults?.[0]||target.choice||faultCatalog[lab][Math.min(1,Math.floor(random()*2))].id;
 return {lab,level,faults:level==='combined'?faultCatalog[lab].map(f=>f.id):[single],target:{action:target.action,choice:target.choice,label:target.label},reason:(target.weight>1?'Prioridad: errores recientes en '+target.label+'. ':'Se amplía la cobertura de intervenciones. ')+(advanced?'Tres exámenes limpios y consistencia en ambas reparaciones y verificación, con experiencia intermitente: dos causas simultáneas.':examClean?'Tres exámenes recientes de este laboratorio sin errores: ahora la avería aparece y desaparece.':'Una causa estable hasta completar tres exámenes recientes sin errores en este laboratorio.'),evidence:{examCount:exams.length,cleanExams:exams.filter(r=>r.errors===0&&r.hints===0).length,targetPriority:target.weight}};
 });}
