import assert from 'node:assert/strict';
import {newGuidedExam,guidedExamPlan} from '../dist/learn/workshop-guided-exam-model.mjs';
import {examIntervene,examMeasure,submitRepairCase} from '../dist/learn/workshop-repair-exam-model.mjs';
import {required} from '../dist/learn/workshop-model.mjs';
function passed(fault='primary'){const e=newGuidedExam([],()=>.1);for(const c of e.cases){c.repair.fault=fault;for(const id of fault==='combined'?['alternate','primary']:[fault])examIntervene(c,id);for(const id of required[c.repair.kind])for(const time of [.5,1.25])examMeasure(c,id,time);submitRepairCase(e);}e.finished='2026-10-26T12:00:00Z';return e;}
const now=new Date('2026-10-27T18:00:00Z');const singles=Array.from({length:3},()=>passed()),advanced=Array.from({length:3},()=>passed('combined'));
assert.equal(guidedExamPlan([], 'mechanics',.1,now).level,1);
assert.equal(guidedExamPlan(singles,'mechanics',.1,now).level,2);
assert.equal(guidedExamPlan([...singles,...advanced],'mechanics',.1,now).level,3);
assert.equal(guidedExamPlan([singles[0],singles[0],singles[0]],'mechanics',.1,now).level,1);
assert.equal(guidedExamPlan(singles.map(e=>({...e,guidedExam:false})),'mechanics',.1,now).level,1);
const bad=passed();bad.cases[0].repair.fixed=[];bad.cases[0].repair.actions=[];bad.cases[0].observations=[];bad.finished='2026-10-27T10:00:00Z';const bad2={...structuredClone(bad),id:crypto.randomUUID()};const plan=guidedExamPlan([...singles,...advanced,bad,bad2],'mechanics',.1,now);assert.equal(plan.level,1);assert.equal(plan.focus,'evidence');assert.ok(plan.weights.primary>plan.weights.alternate);assert.equal(guidedExamPlan([...singles,...advanced,bad],'electronics',.1,now).level,3);
const exam=newGuidedExam([...singles,...advanced],()=>.99,now);assert.equal(exam.cases[0].repair.fault,'intermittent-alternate');assert.deepEqual(JSON.parse(JSON.stringify(exam)).cases[0].plan,exam.cases[0].plan);
console.log('PASS guided-only evidence, progressive levels, regression, weighted weaknesses, deduplication, workshop independence and frozen plans');
