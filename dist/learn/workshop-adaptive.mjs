import {required} from './workshop-model.mjs';
const mean=a=>a.length?a.reduce((n,v)=>n+v,0)/a.length:0;
export function adaptivePlan(results,kind,roll=.5){
 const rows=results.filter(r=>r.kind===kind).slice(-12),recent=rows.slice(-5);
 const accurate=recent.flatMap(r=>r.readings),accuracy=mean(accurate.map(r=>Number(r.correct)));
 const score=mean(recent.map(r=>r.score));
 const secure=recent.length>=3&&score>=85&&accuracy>=.85&&mean(recent.map(r=>r.hints))<=1;
 const advanced=recent.filter(r=>r.fault==='combined'||r.fault?.startsWith('intermittent-'));
 const level=secure?(advanced.length>=3&&mean(advanced.map(r=>r.score))>=85?3:2):1;
 const stats=required[kind].map(id=>{const a=rows.flatMap(r=>r.readings).filter(r=>r.id===id);return {id,count:a.length,errors:a.filter(r=>!r.correct).length,rate:a.length?a.filter(r=>!r.correct).length/a.length:0};}).sort((a,b)=>b.rate-a.rate||b.errors-a.errors);
 const focus=stats[0].id;
 const sides={mechanics:{primary:['ground'],alternate:['battery']},electronics:{primary:['input','output'],alternate:['input','output']},hydraulics:{primary:['leak','speed'],alternate:['flow','speed']},pneumatics:{primary:['exhaust'],alternate:['supply']}}[kind];
 const weight=side=>{const a=rows.filter(r=>r.fault===side||r.fault==='intermittent-'+side||r.fault==='combined');return 1+3*mean(a.map(r=>Math.min(1,r.wrongDiagnosis)))+2*mean(stats.filter(r=>sides[side].includes(r.id)).map(r=>r.rate));};
 const primaryWeight=weight('primary'),alternateWeight=weight('alternate');
 const side=Math.max(0,Math.min(.999999,roll))<primaryWeight/(primaryWeight+alternateWeight)?'primary':'alternate';
 return {level,focus,stats,recentCount:recent.length,score:Math.round(score),accuracy:Math.round(accuracy*100),fault:level===2?'combined':level===3?'intermittent-'+side:side,primaryWeight,alternateWeight};
}
