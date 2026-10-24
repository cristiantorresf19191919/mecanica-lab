import {guidedProgress} from './repair-guided-progress.mjs';
import {faultCatalog} from './energy-faults.mjs';
import {createGuidedRepair,guidedScore} from './repair-guided.mjs';
const validIds=(lab,ids)=>Array.isArray(ids)&&ids.every(f=>faultCatalog[lab].some(x=>x.id===f));
function valid(r){return r&&typeof r.id==='string'&&r.done===true&&faultCatalog[r.lab]&&['basic','combined','intermittent'].includes(r.level)&&Number.isFinite(Date.parse(r.finishedAt))&&validIds(r.lab,r.faults)&&r.faults.length&&Array.isArray(r.steps)&&r.steps.every(s=>['repair','verify'].includes(s.action)&&validIds(r.lab,s.before)&&validIds(r.lab,s.after)&&(s.action!=='repair'||faultCatalog[r.lab].some(f=>f.id===s.choice))&&typeof s.correct==='boolean')&&Array.isArray(r.hintEvents)&&Number.isFinite(r.errors)&&Number.isFinite(r.hints);}
export function createGuidedHistory(storage){
 const key='mecanica.guided-repairs.v1';let rows=[],warning='';
 try{const saved=JSON.parse(storage.getItem(key)||'[]');if(!Array.isArray(saved))throw Error();rows=[...new Map(saved.filter(valid).map(r=>[r.id,r])).values()].sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt)).slice(-100);}catch{warning='No se pudo leer el historial guiado.';}
 return {all:()=>structuredClone(rows),warning:()=>warning,save(g){if(!valid(g)||rows.some(r=>r.id===g.id))return;rows.push({...structuredClone(g),score:guidedScore(g)});rows=rows.slice(-100);try{storage.setItem(key,JSON.stringify(rows));}catch{warning='El resultado guiado solo se conserva durante esta sesión.';}}};
}
export function guidedInterventions(rows){
 return Object.entries(faultCatalog).flatMap(([lab,fs])=>[...fs.map(f=>({action:'repair',choice:f.id,label:f.repair})),{action:'verify',choice:null,label:'Verificar todas las averías'}].map(item=>{
 const matches=s=>s.action===item.action&&(item.action==='verify'||s.choice===item.choice);
 const samples=rows.filter(r=>r.lab===lab).flatMap(r=>r.steps.filter(matches).map(step=>({row:r,step}))),errors=samples.filter(s=>!s.step.correct),hints=rows.filter(r=>r.lab===lab).reduce((n,r)=>n+r.hintEvents.filter(matches).length,0);
 const recent=samples.slice(-5),recentErrors=recent.filter(s=>!s.step.correct).length;
 return {...item,lab,n:samples.length,errors:errors.length,hints,recentErrors,priority:recentErrors*15+hints*3,kinds:{repeated:errors.filter(s=>s.step.kind==='repeated').length,unnecessary:errors.filter(s=>s.step.kind==='unnecessary').length,premature:errors.filter(s=>s.step.kind==='premature').length},source:errors.at(-1)||samples.at(-1)||null};
 })).filter(x=>x.n||x.hints).sort((a,b)=>b.priority-a.priority||b.errors-a.errors||a.label.localeCompare(b.label));
}
export function targetedGuidedRepair(item,rows=null){
 if(!item.source)return null;
 const {row,step}=item.source,g=createGuidedRepair(row);
 g.fixed=[...step.before];g.recommendedIds=[...g.fixed];g.reviewTarget={lab:item.lab,action:item.action,choice:item.choice,sourceId:row.id};
 if(rows){const p=guidedProgress(rows,item);g.level=p.level;g.adaptation=p.reason;
 if(p.level==='combined'){g.faults=faultCatalog[item.lab].map(f=>f.id);g.fixed=[];}
 else{const target=g.faults.includes(item.choice)?item.choice:g.faults[0];g.faults=[target];g.fixed=p.level==='basic'?step.before.filter(f=>f===target):[];}
 g.recommendedIds=[...g.fixed];}
 return g;
}
