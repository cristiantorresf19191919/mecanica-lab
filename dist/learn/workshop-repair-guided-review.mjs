import {restoreGuided} from './workshop-repair-guided-history.mjs';
import {repairDay,shiftDay,repairMonth} from './workshop-repair-review.mjs';
export {repairDay,repairMonth};
export const guidedGoalKey='mecanica.workshop.guidedRepairGoal.v1';
export function readGuidedGoal(storage){const n=Number(storage.getItem(guidedGoalKey));return Number.isInteger(n)&&n>=1&&n<=5?n:2;}
export function guidedReviews(rows,now=new Date(),evidence=[]){
 const today=repairDay(now),groups=new Map(),activity={},seen=new Set();
 for(const raw of [...rows].sort((a,b)=>Date.parse(a.finished)-Date.parse(b.finished))){
  const r=restoreGuided(raw);if(!r||r.phase!=='complete'||!Number.isFinite(Date.parse(r.finished))||Date.parse(r.finished)>+now||seen.has(r.id))continue;seen.add(r.id);
  const day=repairDay(new Date(r.finished));
  for(const id of new Set(r.rounds.map(a=>a.id))){
   const key=r.user.kind+':'+id,decisions=r.rounds.filter(a=>a.id===id),clean=decisions.every(a=>a.useful&&!a.hint);
   if(!groups.has(key))groups.set(key,{key,kind:r.user.kind,id,days:new Map(),errors:0});
   const g=groups.get(key);g.days.set(day,(g.days.get(day)??true)&&clean);g.errors+=decisions.filter(a=>!a.useful).length;
   (activity[day]??=new Set()).add(key);
  }
 }
 const entries=[...groups.values()].map(g=>{let run=0,due=null,last=null;for(const [day,clean]of g.days){last=day;if(!clean){run=0;due=shiftDay(day,1);}else if(!due||day>=due){run++;due=shiftDay(day,[1,3,7,14,30][Math.min(run-1,4)]);}}return {key:g.key,kind:g.kind,id:g.id,last,due,run,errors:g.errors,overdue:due<today};}).sort((a,b)=>a.due.localeCompare(b.due)||b.errors-a.errors||a.key.localeCompare(b.key));
 // Exam errors advance reviews without granting practice or streak credit.
 const latest=new Map();for(const e of evidence){if(!Number.isFinite(Date.parse(e.finished))||Date.parse(e.finished)>+now)continue;const key=e.kind+':'+e.id;if(!latest.has(key)||Date.parse(e.finished)>Date.parse(latest.get(key).finished))latest.set(key,e);}
 for(const [key,e] of latest){const later=rows.some(r=>{const g=restoreGuided(r);return g?.phase==='complete'&&g.user.kind===e.kind&&g.rounds.some(a=>a.id===e.id)&&Date.parse(g.finished)>Date.parse(e.finished)&&Date.parse(g.finished)<=+now;});if(later)continue;const due=shiftDay(repairDay(new Date(e.finished)),1);let entry=entries.find(x=>x.key===key);if(!entry){entry={key,kind:e.kind,id:e.id,last:repairDay(new Date(e.finished)),due,run:0,errors:1};entries.push(entry);}else{entry.due=entry.due<due?entry.due:due;entry.run=0;}entry.examError=true;entry.overdue=entry.due<today;}
 entries.sort((a,b)=>a.due.localeCompare(b.due)||b.errors-a.errors||a.key.localeCompare(b.key));
 const counts=Object.fromEntries(Object.entries(activity).map(([day,keys])=>[day,keys.size]));let streak=0,cursor=counts[today]?today:shiftDay(today,-1);while(counts[cursor]){streak++;cursor=shiftDay(cursor,-1);}
 return {today,entries,counts,streak,completed:counts[today]||0};
}
