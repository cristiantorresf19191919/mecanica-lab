import {adaptivePlan} from './workshop-adaptive.mjs';
const mean=a=>a.length?a.reduce((n,x)=>n+x,0)/a.length:0;
export function examPlan(results,kind,roll=.5){
 const seen=new Set(),ordered=results.filter(r=>{if(r.kind!==kind||seen.has(r.id)||!Number.isFinite(Date.parse(r.date)))return false;seen.add(r.id);return true;}).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
 const exams=ordered.filter(r=>r.source==='exam'),recent=exams.slice(-5),readings=recent.flatMap(r=>r.readings);
 const score=mean(recent.map(r=>r.score)),accuracy=mean(readings.map(r=>Number(r.correct))),diagnosisAccuracy=mean(recent.map(r=>Number(r.wrongDiagnosis===0)));
 const secure=recent.length>=3&&score>=85&&accuracy>=.85&&diagnosisAccuracy>=.8;
 const advanced=recent.filter(r=>r.fault==='combined'||r.fault.startsWith('intermittent-'));
 const level=secure?(advanced.length>=3&&mean(advanced.map(r=>r.score))>=85?3:2):1;
 const targetRows=exams.length?exams:ordered.filter(r=>r.source!=='exam-retry');
 const target=adaptivePlan(targetRows,kind,roll),side=roll<target.primaryWeight/(target.primaryWeight+target.alternateWeight)?'primary':'alternate';
 return {level,fault:level===2?'combined':level===3?'intermittent-'+side:side,focus:target.focus,examCount:recent.length,score:Math.round(score),accuracy:Math.round(accuracy*100),diagnosisAccuracy:Math.round(diagnosisAccuracy*100),source:exams.length?'exam':targetRows.length?'practice':'new',primaryWeight:target.primaryWeight,alternateWeight:target.alternateWeight};
}
