import assert from 'node:assert/strict';
import {guidedWeekly} from '../dist/learn/workshop-repair-guided-weekly.mjs';
import {newGuidedRepair,chooseGuidedRepair,nextGuidedRepair,guidedHint} from '../dist/learn/workshop-repair-guided.mjs';
let serial=0;function row(day,kind='mechanics',wrong=false,hint=false){const g={...newGuidedRepair({repair:{kind,fault:'primary',actions:[]}}),id:'w'+serial++,key:'x',finished:day+'T17:00:00Z'};if(wrong){chooseGuidedRepair(g,'alternate');nextGuidedRepair(g);}if(hint)guidedHint(g);chooseGuidedRepair(g,'primary');nextGuidedRepair(g);return g;}
const now=new Date('2026-10-27T18:00:00Z');
let s=guidedWeekly([],2,now);assert.equal(s.current.average,null);assert.equal(s.delta,null);assert.equal(s.plan.start,'2026-11-02');assert.equal(s.plan.end,'2026-11-08');assert.equal(s.plan.scheduled,0);
const previous=row('2026-10-20'),a=row('2026-10-26','mechanics',true),b=row('2026-10-27','electronics',false,true),future=row('2026-10-28');
s=guidedWeekly([previous,a,b,b,future,{...a,id:'incomplete',phase:'question'}],1,now);
assert.equal(s.current.count,2);assert.equal(s.previous.count,1);assert.equal(s.delta,-10);assert.equal(s.streak,2);assert.equal(s.current.hints,1);assert.equal(s.current.unnecessary,1);assert.equal(s.hardest[0].id,'alternate');assert.equal(s.hardest[1].kind,'electronics');assert.equal(s.plan.days[0].entries[0].id,'alternate');
const entries=s.plan.days.flatMap(d=>d.entries);assert.equal(new Set(entries.map(e=>e.key)).size,entries.length);assert.ok(s.plan.days.every(d=>d.entries.length<=1&&d.entries.every(e=>e.due<=d.day)));assert.equal(s.plan.scheduled,3);
assert.equal(guidedWeekly([a,b],3,now).plan.days[0].entries.length,3);
assert.equal(guidedWeekly([a],2,new Date('2026-10-26T04:59:00Z')).start,'2026-10-19');
console.log('PASS same-weekday comparison, empty states, scores, streak, weak interventions, capacity, unique due scheduling and date boundaries');
const all=['mechanics','electronics','hydraulics','pneumatics'].map(kind=>{const g={...newGuidedRepair({repair:{kind,fault:'combined',actions:[]}}),id:'all-'+kind,key:'x',finished:'2026-10-27T17:00:00Z'};chooseGuidedRepair(g,'alternate');nextGuidedRepair(g);chooseGuidedRepair(g,'primary');nextGuidedRepair(g);return g;});
const full=guidedWeekly(all,1,now);assert.equal(full.plan.scheduled,7);assert.equal(full.plan.backlog,1);assert.equal(full.current.average,100);
