import {tests} from './model.mjs';
import {validContext} from './guided-progress.mjs';
export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function addDays(day,n){const [y,m,d]=day.split('-').map(Number);return dayKey(new Date(y,m-1,d+n,12));}
export function recordDay(r){const date=new Date(r.completedAt||r.date);return Number.isNaN(date.getTime())?null:dayKey(date);}
export function spacingPlan(records,today=dayKey()){
 const sorted=records.slice().sort((a,b)=>String(a.completedAt||a.date).localeCompare(String(b.completedAt||b.date))),items=[];
 for(const id of Object.keys(tests)){let target=null,last=null,streak=0,interval=0,errors=0,lastCleanDay=null;
 for(const r of sorted){const events=r.log.filter(e=>e.choice===id),hints=(r.hintLog||[]).filter(h=>h.recommended?.includes(id));const remedial=(r.remediation||[]).find(e=>e.choice===id&&validContext(e.before));const relevant=events.length||r.reviewTest===id||hints.length||remedial;if(!relevant)continue;
 const candidate=remedial||events.slice().reverse().find(e=>validContext(e.before))||hints.find(e=>validContext(e.before));if(candidate)target={record:r.id,choice:id,before:candidate.before};
 const date=recordDay(r);if(!date)continue;
 const bad=remedial||events.some(e=>!e.correct)||hints.length||(r.reviewTest===id&&(r.hints>0||r.log.some(e=>!e.correct)));
 errors+=events.filter(e=>!e.correct).length;
 if(bad){streak=0;interval=0;last=date;}
 else if(r.status==='complete'){if(lastCleanDay!==date||streak===0)streak++;lastCleanDay=date;interval=[1,3,7,14,30][Math.min(streak-1,4)];last=date;}
 }
 if(target&&last){const due=addDays(last,interval);items.push({id,target,last,due,interval,streak,errors,overdue:due<today,ready:due<=today});}}
 return items.sort((a,b)=>a.due.localeCompare(b.due)||b.errors-a.errors);
}
export function activity(records,today=dayKey()){const days={},ids=new Set();for(const r of records){if(r.status!=='complete'||!r.reviewOf||ids.has(r.id))continue;const day=recordDay(r);if(!day||day>today)continue;ids.add(r.id);days[day]=(days[day]||0)+1;}let cursor=days[today]?today:addDays(today,-1),streak=0;while(days[cursor]){streak++;cursor=addDays(cursor,-1);}return {days,streak,today:days[today]||0};}
export function calendarDays(month){const [y,m]=month.split('-').map(Number),first=new Date(y,m-1,1,12),offset=(first.getDay()+6)%7,count=new Date(y,m,0,12).getDate();return [...Array(offset).fill(null),...Array.from({length:count},(_,i)=>dayKey(new Date(y,m-1,i+1,12)))];}
