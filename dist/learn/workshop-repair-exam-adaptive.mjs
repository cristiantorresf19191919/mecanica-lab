import {newRepairExam,validRepairExam,repairExamGrade} from './workshop-repair-exam-model.mjs';
import {newRepair,intervene} from './workshop-repair-model.mjs';
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0;
export function repairExamPlan(exams,kind,roll=.5,now=new Date()){
 const seen=new Set(),rows=[];for(const e of [...exams].filter(e=>validRepairExam(e)&&e.finished&&!e.retryOf&&Date.parse(e.finished)<=now.getTime()).sort((a,b)=>Date.parse(a.finished)-Date.parse(b.finished))){if(seen.has(e.id))continue;seen.add(e.id);const c=e.cases.find(c=>c.repair.kind===kind);if(c)rows.push({c,g:repairExamGrade(c)});}
 const recent=rows.slice(-5),score=mean(recent.map(x=>x.g.score)),verified=mean(recent.map(x=>Number(x.g.verified))),secure=recent.length>=3&&score>=85&&verified>=.8,advanced=recent.filter(x=>x.c.repair.fault==='combined'||x.c.repair.fault.startsWith('intermittent-'));
 const level=secure?(advanced.length>=3&&mean(advanced.map(x=>x.g.score))>=85&&mean(advanced.map(x=>Number(x.g.verified)))>=.8?3:2):1;
 const weights={primary:1,alternate:1};let missing=0,unnecessary=0,remaining=0;
 for(const {c,g}of rows.slice(-12)){for(const side of g.remaining){weights[side]+=3;remaining++;}for(const a of c.repair.actions.filter(a=>!a.useful)){weights[a.id]+=2;unnecessary++;}if(!g.evidence)missing++;}
 const side=Math.max(0,Math.min(.999999,roll))<weights.primary/(weights.primary+weights.alternate)?'primary':'alternate';
 return {level,fault:level===2?'combined':level===3?'intermittent-'+side:side,count:recent.length,score:Math.round(score),verified:Math.round(verified*100),focus:missing>=Math.max(unnecessary,remaining)&&missing?'evidence':remaining>=unnecessary&&remaining?'remaining':unnecessary?'unnecessary':'coverage',weights};
}
export function newAdaptiveRepairExam(exams,random=Math.random,now=new Date()){const e=newRepairExam(()=>0);for(const c of e.cases){c.plan=repairExamPlan(exams,c.repair.kind,random(),now);c.repair=newRepair({kind:c.repair.kind,fault:c.plan.fault});}return e;}
export function interventionReplay(c,step){const r=newRepair(c.repair);for(const a of c.repair.actions.slice(0,Math.max(0,Math.min(c.repair.actions.length,step))))intervene(r,a.id);return r;}
