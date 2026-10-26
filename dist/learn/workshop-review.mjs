import {required,faultModes} from './workshop-model.mjs';
import {adaptivePlan} from './workshop-adaptive.mjs';
export const goalKey='mecanica.workshop.dailyGoal.v1';
export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function addDays(key,n){const d=new Date(key+'T12:00:00');d.setDate(d.getDate()+n);return dayKey(d);}
export const skillKey=(kind,type,id)=>[kind,type,id].join(':');
const intervals=[1,3,7,14,30];
export function reviewSchedule(results,now=new Date()){
 const today=dayKey(now),skills=[];
 for(const kind of Object.keys(required)){
  const level=adaptivePlan(results,kind).level;
  const ids=[...required[kind].map(id=>({type:'measurement',id})),...faultModes.filter(f=>f==='primary'||f==='alternate'||f==='combined'&&level>=2||f.startsWith('intermittent-')&&level>=3).map(id=>({type:'diagnosis',id}))];
  for(const {type,id}of ids){const rows=results.filter(r=>r.kind===kind&&(type==='measurement'?r.readings.some(m=>m.id===id):r.fault===id)).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
   // One scheduling outcome per local day: any error on that day wins.
   const days=new Map();for(const r of rows){const day=dayKey(new Date(r.date));if(day>today)continue;const ok=r.hints<=1&&(type==='measurement'?r.readings.filter(m=>m.id===id).every(m=>m.correct):r.wrongDiagnosis===0);days.set(day,(days.get(day)??true)&&ok);}
   let run=0,due=today,last=null,errors=0;for(const [day,ok]of days){run=ok?run+1:0;if(!ok)errors++;last=day;due=addDays(day,ok?intervals[Math.min(run-1,intervals.length-1)]:1);}
   skills.push({key:skillKey(kind,type,id),kind,type,id,last,due,run,errors,seen:days.size,overdue:due<today});
  }
 }
 return skills.sort((a,b)=>a.due.localeCompare(b.due)||b.errors/Math.max(1,b.seen)-a.errors/Math.max(1,a.seen)||a.key.localeCompare(b.key));
}
export function practiceActivity(results,now=new Date()){
 const today=dayKey(now),counts={},seen=new Set();for(const r of results){if(seen.has(r.id))continue;seen.add(r.id);const day=dayKey(new Date(r.date));if(day<=today)counts[day]=(counts[day]??0)+1;}
 let cursor=counts[today]?today:addDays(today,-1),streak=0;while(counts[cursor]){streak++;cursor=addDays(cursor,-1);}return {counts,streak,today:counts[today]??0};
}
export function reviewPlan(results,entry,roll=.5){const plan=adaptivePlan(results,entry.kind,roll);const side=entry.type==='diagnosis'?(entry.id.includes('alternate')?'alternate':'primary'):({battery:'alternate',ground:'primary',input:roll<.5?'primary':'alternate',output:roll<.5?'primary':'alternate',speed:roll<.5?'primary':'alternate',flow:'alternate',leak:'primary',supply:'alternate',exhaust:'primary'})[entry.id];
 return {...plan,level:entry.type==='diagnosis'?(entry.id==='combined'?2:entry.id.startsWith('intermittent-')?3:1):plan.level,focus:entry.type==='measurement'?entry.id:plan.focus,fault:entry.type==='diagnosis'?entry.id:plan.level===3?'intermittent-'+side:plan.level===2?'combined':side};
}
