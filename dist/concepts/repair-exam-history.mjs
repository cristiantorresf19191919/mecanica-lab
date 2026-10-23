import {validRepairExam} from './repair-exam-model.mjs';
import {faultCatalog} from './energy-faults.mjs';
export function createRepairExamArchive(storage){
 const key='mecanica.repair-exams.v1';let rows=[],warning='';
 const valid=e=>validRepairExam(e)&&e.status==='finished'&&Number.isFinite(Date.parse(e.finishedAt));
 try{const saved=JSON.parse(storage.getItem(key)||'[]');if(!Array.isArray(saved))throw Error();rows=[...new Map(saved.filter(valid).map(e=>[e.id,e])).values()].sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt)).slice(-50);}catch{warning='No se pudo leer el archivo de exámenes de reparación.';}
 return {all:()=>structuredClone(rows),warning:()=>warning,add(e){if(!valid(e)||rows.some(r=>r.id===e.id))return;rows.push(structuredClone(e));rows.sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt));rows=rows.slice(-50);try{storage.setItem(key,JSON.stringify(rows));}catch{warning='Los exámenes nuevos solo se conservarán durante esta sesión.';}}};
}
export function repairExamMastery(exams){
 return Object.entries(faultCatalog).flatMap(([lab,fs])=>fs.map(f=>{
 const samples=[];for(const e of exams){const c=e.cases.find(c=>c.lab===lab);if(!c)continue;const mistakes=c.events.filter(ev=>ev.wrong&&(ev.choice?ev.choice===f.id:ev.targets?.includes(f.id))).length;if(c.faults.includes(f.id)||mistakes)samples.push({mistakes});}
 const recent=samples.slice(-3),clean=recent.filter(s=>!s.mistakes).length;
 return {lab,fault:f.id,label:f.label,n:samples.length,clean,recent:recent.length,errors:samples.reduce((n,s)=>n+s.mistakes,0),status:recent.length<3?'Falta evidencia':clean===3?'Consistente sin errores':clean>=2?'En progreso':'Necesita repaso'};
 })).filter(x=>x.n);
}
