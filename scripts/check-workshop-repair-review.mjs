import assert from 'node:assert/strict';
import {newRepair,intervene,captureRepair,verifyRepair} from '../dist/learn/workshop-repair-model.mjs';
import {required,sampleTimes} from '../dist/learn/workshop-model.mjs';
import {repairReviews,repairDay,shiftDay,repairMonth,readRepairGoal} from '../dist/learn/workshop-repair-review.mjs';
function row(id,day,hints=0){const r={...newRepair({kind:'mechanics',fault:'primary'}),id,hints,finished:day+'T17:00:00Z'};intervene(r,'primary');for(const id of required[r.kind])for(const time of sampleTimes(r))captureRepair(r,id,time);verifyRepair(r);return r;}
const now=new Date('2026-10-26T20:00:00Z');const rows=[row('a','2026-10-24'),row('b','2026-10-25'),row('c','2026-10-26')];let model=repairReviews(rows,now);assert.equal(model.entries[0].due,'2026-11-02');assert.equal(model.streak,3);assert.equal(model.completed,1);
model=repairReviews([...rows,row('d','2026-10-26'),rows[2]],now);assert.equal(model.entries[0].run,3);assert.equal(model.completed,1);
model=repairReviews([...rows,row('bad','2026-10-26',3)],now);assert.equal(model.entries[0].due,'2026-10-27');assert.equal(model.entries[0].run,0);
model=repairReviews(rows.slice(0,2),now);assert.equal(model.streak,2);assert.equal(model.completed,0);
model=repairReviews([rows[0],row('future','2026-10-28')],now);assert.equal(model.streak,0);assert.equal(model.entries[0].due,'2026-10-25');assert.ok(model.entries[0].overdue);
assert.equal(repairDay(new Date('2026-10-27T04:59:00Z')),'2026-10-26');assert.equal(repairDay(new Date('2026-10-27T05:00:00Z')),'2026-10-27');assert.equal(shiftDay('2026-12-31',1),'2027-01-01');assert.equal(repairMonth('2026-11').length,42);assert.equal(repairMonth('2026-11')[0],'2026-10-26');assert.equal(readRepairGoal({getItem:()=>99}),2);assert.equal(readRepairGoal({getItem:()=>3}),3);assert.deepEqual(repairReviews([],now).entries,[]);
console.log('PASS spaced intervals, difficult-day reset, same-day deduplication, unique goals, streak grace/gaps, future exclusion, Bogotá midnight and month boundaries');
