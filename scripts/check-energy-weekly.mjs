import assert from 'node:assert/strict';
import {createEnergySpacing} from '../dist/concepts/energy-spacing.mjs';
import {energyWeekly} from '../dist/concepts/energy-weekly.mjs';
const store=createEnergySpacing({getItem:()=>null,setItem(){}});
const row=(id,date,score)=>({id,date:date+'T12:00:00',score,errors:1,hints:0,lab:'relief',level:'basic',faults:['pump'],events:[{wrong:true,targets:['pump']}]});
const rows=[row('old','2026-10-18',40),row('current','2026-10-19',85),row('later','2026-10-24',100)];store.sync(rows.slice(0,2));
const r=energyWeekly(rows,store,'2026-10-23');assert.equal(r.start,'2026-10-19');assert.equal(r.next,'2026-10-26');assert.equal(r.current.count,1);assert.equal(r.previous.mean,40);assert.equal(r.difficult[0].weekErrors,1);assert.equal(r.dates.length,7);assert(r.dates.every(d=>d.items.length<=3));assert.equal(new Set(r.dates.flatMap(d=>d.items.map(i=>i.lab+':'+i.fault))).size,6);
assert.equal(energyWeekly([],store,'2027-01-03').next,'2027-01-04');assert.equal(energyWeekly([],store,'2026-10-26').start,'2026-10-26');assert.equal(energyWeekly([],store,'2026-10-26').current.mean,null);
console.log('PASS weekly boundaries, partial/current versus previous, future exclusion, attribution, unique schedule and year transition.');
