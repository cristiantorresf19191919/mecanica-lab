import assert from 'node:assert/strict';
import {createRepairExam,repairExamAction,repairExamScore,validRepairExam} from '../dist/concepts/repair-exam-model.mjs';
import {createRepairHistory} from '../dist/concepts/energy-repair-history.mjs';
const e=createRepairExam([],()=>0);assert(validRepairExam(e));assert.equal(new Set(e.cases.map(c=>c.lab)).size,3);
assert.equal(repairExamAction(e,0,'hint'),false);assert.equal(repairExamAction(e,1,'verify'),false);
for(let i=0;i<3;i++){const c=e.cases[i];repairExamAction(e,i,'verify');assert.equal(c.errors,1);assert.equal(c.done,false);for(const f of c.faults)repairExamAction(e,i,'repair',f);repairExamAction(e,i,'verify');}
assert.equal(e.status,'finished');assert.equal(repairExamScore(e),85);assert(validRepairExam(JSON.parse(JSON.stringify(e))));assert.equal(repairExamAction(e,0,'repair','ratio'),false);
const h=createRepairHistory({getItem:()=>null,setItem(){}});e.cases.forEach(c=>{h.save(c);h.save(c);});assert.equal(h.all().length,3);assert(h.all().every(r=>r.score===85));
const combined=createRepairExam([],()=>0);combined.cases[0].faults=['ratio','load'];combined.cases[0].diagnosedIds=['ratio','load'];combined.cases[0].level='combined';repairExamAction(combined,0,'repair','load');repairExamAction(combined,0,'verify');assert.equal(combined.cases[0].done,false);assert.deepEqual(combined.cases[0].steps[0].before,[]);assert.deepEqual(combined.cases[0].steps[0].after,['load']);repairExamAction(combined,0,'repair','ratio');repairExamAction(combined,0,'verify');assert.equal(combined.cases[0].done,true);
console.log('PASS surprise coverage, no hints, ordered cases, penalties, final gate, resume, partial repair snapshots and deduplicated result storage.');
