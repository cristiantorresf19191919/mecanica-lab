import {createEnergyFault,actEnergyFault,energyFaultScore,faultCatalog} from './energy-faults.mjs';
import {repairPriorities} from './energy-repair-history.mjs';
export function createRepairExam(rows,random=Math.random){
 const id=crypto.randomUUID(),plan=repairPriorities(rows);
 const cases=Object.keys(faultCatalog).map((lab,index)=>{
  const options=plan.filter(p=>p.lab===lab);let draw=random()*options.reduce((n,p)=>n+1+p.priority,0);
  const target=options.find(p=>(draw-=1+p.priority)<0)||options.at(-1);
  const combined=options.every(p=>p.level==='intermittent')&&options.every(p=>rows.some(r=>r.lab===lab&&r.faults.includes(p.fault)&&r.level==='intermittent'&&r.score>=85));
  const level=combined?'combined':target.level;
  const s=createEnergyFault(lab,()=>faultCatalog[lab].findIndex(f=>f.id===target.fault)/2,level);
  s.diagnosedIds=[...s.faults];s.diagnosed=true;s.sourceExam=id;s.sourceCase=index;s.repairExam=true;s.steps=[];return s;
 });
 return {id,date:new Date().toISOString(),status:'active',cases};
}
export function repairExamAction(exam,index,action,choice){
 if(exam.status!=='active'||exam.cases.findIndex(c=>!c.done)!==index||!['repair','verify'].includes(action))return false;
 const s=exam.cases[index],before=[...s.repairedIds];
 actEnergyFault(s,action,choice);const event=s.events.at(-1);
 let explanation=s.log.at(-1);if(event.wrong&&action==='repair')explanation=before.includes(choice)?'Esta causa ya estaba corregida; repetir la intervención no cambia el circuito.':'Esta avería no estaba presente. La intervención no explica ni elimina los síntomas restantes.';if(event.wrong&&action==='verify')explanation='La verificación fue prematura: seguían pendientes '+s.faults.filter(f=>!s.repairedIds.includes(f)).map(f=>faultCatalog[s.lab].find(x=>x.id===f).label).join(', ')+'. Una ventana normal de una intermitencia no demuestra reparación.';
 s.steps.push({action,choice:choice||null,wrong:!!event.wrong,before,after:[...s.repairedIds],explanation});
 if(exam.cases.every(c=>c.done)){exam.status='finished';exam.finishedAt=new Date().toISOString();}
 return true;
}
export const repairExamScore=e=>Math.round(e.cases.reduce((n,c)=>n+energyFaultScore(c),0)/3);
export function validRepairExam(e){return e&&typeof e.id==='string'&&['active','finished'].includes(e.status)&&Array.isArray(e.cases)&&e.cases.length===3&&new Set(e.cases.map(c=>c.lab)).size===3&&e.cases.every(c=>faultCatalog[c.lab]&&['basic','combined','intermittent'].includes(c.level)&&Array.isArray(c.faults)&&c.faults.length&&c.faults.every(f=>faultCatalog[c.lab].some(x=>x.id===f))&&['events','log','steps','repairedIds','diagnosedIds'].every(k=>Array.isArray(c[k]))&&Number.isFinite(c.errors)&&c.hints===0)&& (e.status!=='finished'||e.cases.every(c=>c.done));}
