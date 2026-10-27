import {validRepair} from './workshop-repair-history.mjs';
import {repairScore} from './workshop-repair-model.mjs';
export const repairGoalKey='mecanica.workshop.repairGoal.v1';
export const reviewZone='America/Bogota';
export function repairDay(date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:reviewZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
export function shiftDay(day,n){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function repairReviews(rows,now=new Date(),evidence=[]){
 const today=repairDay(now),groups=new Map(),activity={},seen=new Set();
 for(const r of [...rows].sort((a,b)=>Date.parse(a.finished)-Date.parse(b.finished))){if(!validRepair(r)||!r.verified||!Number.isFinite(Date.parse(r.finished))||Date.parse(r.finished)>now.getTime()||seen.has(r.id))continue;seen.add(r.id);const day=repairDay(new Date(r.finished)),key=r.kind+':'+r.fault;if(!groups.has(key))groups.set(key,{key,kind:r.kind,fault:r.fault,days:new Map()});const g=groups.get(key),clean=repairScore(r)>=90&&r.hints<=1&&!r.failedChecks&&r.actions.every(a=>a.useful);g.days.set(day,(g.days.get(day)??true)&&clean);(activity[day]??=new Set()).add(key);}
 const entries=[...groups.values()].map(g=>{let run=0,due=today,last=null,errors=0;for(const [day,clean]of g.days){run=clean?run+1:0;if(!clean)errors++;last=day;due=shiftDay(day,clean?[1,3,7,14,30][Math.min(run-1,4)]:1);}return {key:g.key,kind:g.kind,fault:g.fault,last,due,run,errors,overdue:due<today};}).sort((a,b)=>a.due.localeCompare(b.due)||b.errors-a.errors||a.key.localeCompare(b.key));
 // Exam mistakes affect due dates, never activity or streak credit.
 const latest=new Map();for(const e of evidence){if(!Number.isFinite(Date.parse(e.finished))||Date.parse(e.finished)>now.getTime())continue;const key=e.kind+':'+e.fault;if(!latest.has(key)||Date.parse(e.finished)>Date.parse(latest.get(key).finished))latest.set(key,e);}
 for(const [key,e]of latest){if(e.score===100&&e.verified)continue;const afterPractice=rows.some(r=>r.verified&&r.kind===e.kind&&r.fault===e.fault&&Date.parse(r.finished)>Date.parse(e.finished)&&Date.parse(r.finished)<=now.getTime());if(afterPractice)continue;const due=shiftDay(repairDay(new Date(e.finished)),1);let entry=entries.find(x=>x.key===key);if(!entry){entry={key,kind:e.kind,fault:e.fault,last:repairDay(new Date(e.finished)),due,run:0,errors:1};entries.push(entry);}else{entry.due=entry.due<due?entry.due:due;entry.run=0;}entry.examScore=e.score;entry.overdue=entry.due<today;}
 entries.sort((a,b)=>a.due.localeCompare(b.due)||b.errors-a.errors||a.key.localeCompare(b.key));
 const counts=Object.fromEntries(Object.entries(activity).map(([day,keys])=>[day,keys.size]));let streak=0,cursor=counts[today]?today:shiftDay(today,-1);while(counts[cursor]){streak++;cursor=shiftDay(cursor,-1);}return {today,entries,counts,streak,completed:counts[today]||0};
}
export function repairMonth(month){const start=month+'-01',weekday=new Date(start+'T12:00:00Z').getUTCDay();return Array.from({length:42},(_,i)=>shiftDay(start,i-(weekday+6)%7));}
export function readRepairGoal(storage){const n=Number(storage.getItem(repairGoalKey));return Number.isInteger(n)&&n>=1&&n<=5?n:2;}
