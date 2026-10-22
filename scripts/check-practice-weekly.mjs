import assert from 'node:assert/strict';
import {weeklyReport,nextWeekPlan,mondayOf} from '../dist/machines/practice-weekly.mjs';
const now=new Date(2026,9,22,12),r=(d,extra={})=>({id:String(d),signal:'i1',label:'Sensor a1',date:new Date(2026,9,d,10).toISOString(),resolved:true,points:80,errors:1,hints:0,revealed:false,...extra});
const state={goal:3,days:{'2026-10-21':{target:3,ids:['a','b','c']}}},rows=[r(18),r(19),r(22),r(23)];
const report=weeklyReport(rows,state,now);assert.equal(report.start,'2026-10-19');assert.equal(report.current.solved,2);assert.equal(report.previous.solved,1);assert.equal(report.current.mean,80);assert.equal(report.streak.streak,1);assert.equal(report.weaknesses[0].errors,2);
const plan=nextWeekPlan(rows.filter(r=>r.id!=='23'),now);assert.equal(plan.length,7);assert.equal(plan[0].date,'2026-10-26');assert.equal(plan[6].date,'2026-11-01');assert(plan.every(d=>d.signals.length<=3));assert(plan[0].signals.some(s=>s.id==='i1'));
assert.equal(mondayOf(new Date(2027,0,3)).getFullYear(),2026);assert.equal(weeklyReport([],state,now).current.mean,null);assert(nextWeekPlan([],now).every(d=>!d.signals.length));
const many=Array.from({length:5},(_,i)=>r(20,{id:'s'+i,signal:'s'+i}));const planned=nextWeekPlan(many,now);assert.equal(planned[0].signals.length,3);assert(planned[1].signals.some(s=>s.id==='s4'));
console.log('PASS partial-week/previous-week boundaries, future exclusion, no-data means, next-week/year rollover, day caps and deferred signals.');
