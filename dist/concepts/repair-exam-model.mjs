import {createEnergyFault,actEnergyFault,energyFaultScore,faultCatalog} from './energy-faults.mjs';
import {repairPriorities} from './energy-repair-history.mjs';
export function repairExamEvidence(exams,lab){
 const unique=[...new Map(exams.filter(e=>validRepairExam(e)&&e.status==='finished').map(e=>[e.id,e])).values()].sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt));
 return faultCatalog[lab].map(f=>{
  const samples=unique.flatMap(e=>{const c=e.cases.find(x=>x.lab===lab);if(!c)return [];const errors=c.events.filter(ev=>ev.wrong&&(ev.choice?ev.choice===f.id:ev.targets?.includes(f.id))).length;return c.faults.includes(f.id)||errors?[{errors,level:c.level}]:[];}).slice(-3);
  const errors=samples.reduce((n,x)=>n+x.errors,0),clean=samples.length>=2&&errors===0;
  return {fault:f.id,n:samples.length,errors,priority:errors*4+(samples.length?0:2),level:clean?'intermittent':'basic',advanced:samples.length===3&&errors===0&&samples.some(x=>x.level==='intermittent'||x.level==='combined')};
 });
}
export function createRepairExam(rows,random=Math.random,exams=[]){
 const id=crypto.randomUUID(),plan=repairPriorities(rows);
 const cases=Object.keys(faultCatalog).map((lab,index)=>{
  const options=exams.length?repairExamEvidence(exams,lab):plan.filter(p=>p.lab===lab).map(p=>({...p,level:'basic',advanced:false}));let draw=random()*options.reduce((n,p)=>n+1+p.priority,0);
  const target=options.find(p=>(draw-=1+p.priority)<0)||options.at(-1);
  const combined=options.every(p=>p.advanced);
  const level=combined?'combined':target.level;
  const s=createEnergyFault(lab,()=>faultCatalog[lab].findIndex(f=>f.id===target.fault)/2,level);
  s.adaptation=!exams.length?'Sin exámenes previos: empieza con una causa estable.':combined?'Ambas causas tienen tres resultados recientes sin errores y experiencia intermitente: reto combinado.':target.level==='intermittent'?'Al menos dos resultados recientes sin errores atribuidos a esta causa: reto intermitente.':target.errors?'Refuerzo: '+target.errors+' errores atribuidos a esta causa en sus últimos '+target.n+' exámenes relevantes.':'Poca evidencia para esta causa: reto estable.';
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
