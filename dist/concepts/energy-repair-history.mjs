import {faultCatalog,energyFaultScore} from './energy-faults.mjs';
const valid=r=>r&&typeof r.id==='string'&&faultCatalog[r.lab]&&['basic','combined','intermittent'].includes(r.level)&&Array.isArray(r.faults)&&r.faults.length&&r.faults.every(f=>faultCatalog[r.lab].some(x=>x.id===f))&&Array.isArray(r.events)&&Number.isFinite(Date.parse(r.date))&&Number.isFinite(r.score)&&r.score>=0&&r.score<=100;
export function createRepairHistory(storage,legacy=[]){
 const key='mecanica.energy-repairs.v1';let rows=[],warning='';
 try{const saved=JSON.parse(storage.getItem(key)||'[]');if(!Array.isArray(saved))throw Error();rows=saved.filter(valid).slice(-100);}catch{warning='No se pudo leer el historial de reparaciones.';}
 const add=r=>{if(!valid(r)||rows.some(x=>x.id===r.id))return;rows.push(structuredClone(r));rows.sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));rows=rows.slice(-100);try{storage.setItem(key,JSON.stringify(rows));}catch{warning='Las reparaciones nuevas solo se conservan durante esta sesión.';}};
 for(const r of legacy)if(!r.exam&&r.sourceExam&&r.events.some(e=>e.action==='verify'&&!e.wrong))add(r);
 return {all:()=>structuredClone(rows),warning:()=>warning,save(s){if(s.done)add({...s,date:s.finishedAt,score:energyFaultScore(s)});}};
}
export function repairPriorities(rows){
 return Object.entries(faultCatalog).flatMap(([lab,fs])=>fs.map(f=>{
 const relevant=rows.filter(r=>r.lab===lab&&(r.faults.includes(f.id)||r.events.some(e=>e.wrong&&e.choice===f.id))).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
 const recent=relevant.slice(-3);let errors=0,hints=0;
 for(const r of recent)for(const e of r.events){const targeted=e.choice?e.choice===f.id:e.targets?.includes(f.id);if(targeted&&e.wrong)errors++;if(e.action==='hint'&&e.targets?.includes(f.id))hints++;}
 const clean=recent.length>=3&&errors===0&&hints===0;
 return {lab,fault:f.id,label:f.label,n:relevant.length,errors,hints,level:clean?'intermittent':'basic',priority:errors*15+hints*10+(recent.length?0:5),reason:errors?'Refuerza las intervenciones y comprobaciones que te costaron más.':hints?'Practica hasta resolver sin ayuda.':clean?'Tres prácticas recientes sin dificultades atribuidas: prueba una intermitencia.':'Construye evidencia con una avería estable.'};
 })).sort((a,b)=>b.priority-a.priority||a.n-b.n);
}
