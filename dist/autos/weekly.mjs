import {addDays,recordDay,spacingPlan,activity,dayKey} from './spacing.mjs';
import {tests} from './model.mjs';
export function weekStart(day){const [y,m,d]=day.split('-').map(Number);return addDays(day,-((new Date(y,m-1,d,12).getDay()+6)%7));}
export function weeklyReview(records,today=dayKey(),goal=2){
 const unique=[...new Map(records.map(r=>[r.id,r])).values()].filter(r=>recordDay(r)&&recordDay(r)<=today);
 const start=weekStart(today),next=addDays(start,7),end=addDays(next,6);
 const inRange=(a,b)=>unique.filter(r=>recordDay(r)>=a&&recordDay(r)<=b);
 const summarize=rows=>{const complete=rows.filter(r=>r.status==='complete'),events=complete.flatMap(r=>r.log);return {completed:complete.length,reviews:complete.filter(r=>r.reviewOf).length,average:complete.length?Math.round(complete.reduce((n,r)=>n+r.score,0)/complete.length):null,correct:events.filter(e=>e.correct).length,choices:events.length,days:new Set(complete.map(recordDay)).size};};
 const rows=inRange(start,today),current=summarize(rows),previous=summarize(inRange(addDays(start,-7),addDays(today,-7)));
 const weak=Object.keys(tests).map(id=>({id,diagnosis:rows.filter(r=>(r.remediation||[]).some(e=>e.choice===id)).length,wrong:rows.flatMap(r=>r.log).filter(e=>e.choice===id&&!e.correct).length,hints:rows.flatMap(r=>r.hintLog||[]).filter(h=>h.recommended?.includes(id)).length})).filter(x=>x.wrong||x.hints||x.diagnosis).sort((a,b)=>(b.wrong+b.hints+b.diagnosis)-(a.wrong+a.hints+a.diagnosis));
 const days=Array.from({length:7},(_,i)=>({day:addDays(next,i),items:[]}));
 const plan=spacingPlan(unique,today).filter(p=>p.due<=end).sort((a,b)=>a.due.localeCompare(b.due)||b.errors-a.errors);
 const capacity=Math.max(1,Math.min(7,Math.floor(goal)||2));
 const overflow=[];
 for(const item of plan){const slot=days.find(d=>d.day>=item.due&&d.items.length<capacity);if(slot)slot.items.push(item);else overflow.push(item);}
 return {start,today,next,end,current,previous,weak,days,overflow,streak:activity(unique,today).streak};
}
