import assert from 'node:assert/strict';
import {createExam,examMeasure,submitCase,examRecords} from '../dist/autos/exam-model.mjs';
import {recommendation} from '../dist/autos/guided.mjs';
import {spacingPlan} from '../dist/autos/spacing.mjs';
let e=createExam(()=>.3);assert.equal(new Set(e.cases.map(c=>c.s.fault)).size,3);assert.ok(e.cases.every(c=>c.s.fault!=='charge'));assert.deepEqual(examRecords(e),[]);
for(let i=0;i<3;i++){const c=e.cases[i];while(recommendation(c.s).choices.length)examMeasure(e,recommendation(c.s).choices[0]);const n=c.log.length;examMeasure(e,c.log[0].choice);assert.equal(c.log.length,n);submitCase(e,c.s.fault);}assert.equal(e.done,true);assert.ok(e.cases.every(c=>c.score===100));assert.ok(examRecords(e).every(r=>!r.remediation.length));
e=createExam(()=>.4);for(let i=0;i<3;i++)submitCase(e,'battery');assert.ok(e.cases.some(c=>c.score===40));assert.ok(spacingPlan(examRecords(e)).length);assert.ok(examRecords(e).every(r=>r.log.length===0));const count=e.index;assert.equal(submitCase(e,'fuel'),false);assert.equal(e.index,count);
console.log('PASS unique no-start faults, no early results, useful alternative paths, duplicate measurements, scoring, final lock and causal review scheduling without invented choices');
