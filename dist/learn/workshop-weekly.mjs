import {dayKey,addDays,reviewSchedule,practiceActivity} from './workshop-review.mjs';
export function weekStart(day){const d=new Date(day+'T12:00:00');return addDays(day,-((d.getDay()+6)%7));}
const average=a=>a.length?a.reduce((n,x)=>n+x,0)/a.length:null;
function statistics(rows){const readings=rows.flatMap(r=>r.readings);return {count:rows.length,score:average(rows.map(r=>r.score)),accuracy:readings.length?100*readings.filter(r=>r.correct).length/readings.length:null,days:new Set(rows.map(r=>dayKey(new Date(r.date)))).size,reviews:rows.filter(r=>r.review).length};}
export function weeklySummary(results,now=new Date()){
 const today=dayKey(now),start=weekStart(today),priorStart=addDays(start,-7),priorEnd=addDays(today,-7),seen=new Set();
 const rows=results.filter(r=>{if(seen.has(r.id)||dayKey(new Date(r.date))>today)return false;seen.add(r.id);return true;});
 const current=rows.filter(r=>{const d=dayKey(new Date(r.date));return d>=start&&d<=today;}),previous=rows.filter(r=>{const d=dayKey(new Date(r.date));return d>=priorStart&&d<=priorEnd;});
 const groups=new Map();for(const r of current){for(const m of r.readings){const key=r.kind+':measurement:'+m.id;const g=groups.get(key)??{key,kind:r.kind,type:'measurement',id:m.id,total:0,errors:0};g.total++;g.errors+=Number(!m.correct);groups.set(key,g);}const key=r.kind+':diagnosis:'+r.fault,g=groups.get(key)??{key,kind:r.kind,type:'diagnosis',id:r.fault,total:0,errors:0};g.total++;g.errors+=Number(r.wrongDiagnosis>0);groups.set(key,g);}
 const hardest=[...groups.values()].filter(g=>g.errors>0).sort((a,b)=>b.errors/b.total-a.errors/a.total||b.errors-a.errors||a.key.localeCompare(b.key));
 return {today,start,end:addDays(start,6),priorStart,priorEnd,current:statistics(current),previous:statistics(previous),streak:practiceActivity(rows,now).streak,measurements:hardest.filter(g=>g.type==='measurement').slice(0,3),diagnoses:hardest.filter(g=>g.type==='diagnosis').slice(0,3)};
}
export function nextWeekPlan(results,goal=2,now=new Date()){
 const start=addDays(weekStart(dayKey(now)),7),end=addDays(start,6),capacity=Math.max(1,Math.min(10,Math.floor(Number(goal)||2)));const seen=new Set(),available=results.filter(r=>{if(seen.has(r.id)||dayKey(new Date(r.date))>dayKey(now))return false;seen.add(r.id);return true;});let remaining=reviewSchedule(available,now);const days=[];
 for(let i=0;i<7;i++){const day=addDays(start,i),eligible=remaining.filter(s=>s.due<=day).sort((a,b)=>Number(b.seen>0)-Number(a.seen>0)||b.errors/Math.max(1,b.seen)-a.errors/Math.max(1,a.seen)||a.due.localeCompare(b.due)||a.key.localeCompare(b.key));const entries=eligible.slice(0,capacity);days.push({day,entries});const keys=new Set(entries.map(e=>e.key));remaining=remaining.filter(e=>!keys.has(e.key));}
 return {start,end,days,backlog:remaining.filter(e=>e.due<=end).length,scheduled:days.reduce((n,d)=>n+d.entries.length,0)};
}
