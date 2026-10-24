import {validGuidedExam,guidedExamScore} from './guided-exam-model.mjs';
import {createGuidedRepair} from './repair-guided.mjs';
export function createExamArchive(storage){
 const key='mecanica.guided-exams.v1';let rows=[],warning='';
 const valid=e=>validGuidedExam(e)&&e.status==='finished'&&Number.isFinite(Date.parse(e.finishedAt))&&e.cases.every(c=>c.steps.length&&c.steps.every(s=>['repair','verify'].includes(s.action)&&typeof s.correct==='boolean'&&['before','after','recommendedIds'].every(k=>Array.isArray(s[k])&&s[k].every(f=>c.faults.includes(f)))));
 try{const data=JSON.parse(storage?.getItem(key)||'[]');if(!Array.isArray(data))throw Error();rows=data.filter(valid).filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i).sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt)).slice(-50);}catch{warning='No se pudo recuperar el historial de exámenes.';}
 return {all:()=>structuredClone(rows),warning:()=>warning,save(e){if(!valid(e)||rows.some(r=>r.id===e.id))return false;rows.push(structuredClone(e));rows=rows.slice(-50);try{storage.setItem(key,JSON.stringify(rows));}catch{warning='El historial solo se conservará durante esta sesión.';}return true;}};
}
export function retryExamDecision(exam,i,j){const c=exam.cases[i],step=c.steps[j];if(!step||step.correct)return null;const g=createGuidedRepair(c);g.fixed=[...step.before];g.recommendedIds=[...g.fixed];g.reviewTarget={lab:c.lab,action:step.action,choice:step.choice,sourceId:c.id};g.examRetry={examId:exam.id,step:j};return g;}
export function examMastery(exams){const groups=new Map();for(const e of exams)for(const c of e.cases)for(const s of c.steps){const key=c.lab+':'+s.action+':'+(s.choice||'');if(!groups.has(key))groups.set(key,{lab:c.lab,action:s.action,choice:s.choice,samples:[]});groups.get(key).samples.push(s.correct);}return [...groups.values()].map(g=>{const recent=g.samples.slice(-5);return {...g,total:g.samples.length,errors:g.samples.filter(x=>!x).length,recentCorrect:recent.filter(Boolean).length,recentN:recent.length,mastered:recent.length>=3&&recent.every(Boolean)};});}
export {guidedExamScore};
