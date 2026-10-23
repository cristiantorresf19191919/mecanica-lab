import {createEnergyFault,faultCatalog} from './energy-faults.mjs';
import {nextEnergyReview} from './energy-adaptive.mjs';
// Exam evidence is separate from rehearsals: retrying a known case cannot unlock levels.
export function energyExamPlan(exams,lab){
 const history=[...new Map(exams.filter(e=>e.status==='finished').map(e=>[e.id,e])).values()].sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt));
 const items=faultCatalog[lab].map(f=>{
  const relevant=history.flatMap(e=>{const i=e.cases.findIndex(c=>c.lab===lab);if(i<0)return [];const c=e.cases[i],answer=e.answers[i]||[];return c.faults.includes(f.id)||answer.includes(f.id)?[{ok:c.faults.includes(f.id)===answer.includes(f.id),level:c.level}]:[];}).slice(-3);
  const errors=relevant.filter(r=>!r.ok).length;
  return {fault:f.id,n:relevant.length,errors,weight:1+errors*4+(relevant.length===0?2:0),proficient:relevant.length>=2&&errors===0,advanced:relevant.length>=3&&errors===0&&relevant.some(r=>r.level==='intermittent'||r.level==='combined')};
 });
 return {items,combined:items.every(x=>x.advanced)};
}
export function createEnergyExam(rows,random=Math.random,exams=[]){
 return {id:crypto.randomUUID(),date:new Date().toISOString(),status:'active',answers:[],cases:Object.keys(faultCatalog).map(lab=>{
  if(!exams.length){const c=createEnergyFault(lab,random,nextEnergyReview(rows,lab).level);c.adaptation='Primer examen disponible: nivel orientado por tu práctica previa.';return c;}
  const plan=energyExamPlan(exams,lab),total=plan.items.reduce((n,x)=>n+x.weight,0);let draw=random()*total;
  const target=plan.items.find(x=>(draw-=x.weight)<0)||plan.items.at(-1);
  const level=plan.combined?'combined':target.proficient?'intermittent':'basic';
  const index=faultCatalog[lab].findIndex(f=>f.id===target.fault);
  const c=createEnergyFault(lab,()=>index/faultCatalog[lab].length,level);
  c.adaptation=plan.combined?'Ambas causas acumulan tres respuestas correctas recientes y experiencia con intermitencias: reto combinado.':target.proficient?'Dos respuestas recientes correctas sin errores para esta causa: reto intermitente.':target.errors?'Refuerzo de una causa con '+target.errors+' errores entre sus últimas '+target.n+' respuestas relevantes.':'Exploración de una causa con poca evidencia: reto estable.';
  return c;
 })};
}
export function examCorrect(c,answer){return Array.isArray(answer)&&answer.length===c.faults.length&&c.faults.every(f=>answer.includes(f));}
export function finishEnergyExam(exam,store){if(exam.answers.length!==3)return false;exam.status='finished';exam.finishedAt??=new Date().toISOString();exam.cases.forEach((c,i)=>{const ok=examCorrect(c,exam.answers[i]);store.save({...c,id:exam.id+':'+i,done:true,finishedAt:exam.finishedAt,errors:ok?0:1,hints:0,events:ok?[]:[{action:'exam',wrong:true,targets:c.faults}],exam:true,examScore:ok?100:0});});return true;}
