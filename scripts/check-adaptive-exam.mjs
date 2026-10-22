import assert from 'node:assert/strict';
import {makeExam,examProfile} from '../dist/machines/weekly-exam.mjs';
import {buildComparison} from '../dist/machines/comparison-model.mjs';
const good=Array.from({length:3},()=>{const e=makeExam(()=>.4);e.answers=e.questions.map(q=>q.answer.id);e.status='finished';return e;});
assert.equal(examProfile([]).tier,'foundation');assert.equal(examProfile(good.slice(0,2)).tier,'intermediate');assert.equal(examProfile(good).tier,'advanced');
const e=makeExam(()=>.3,good);assert.equal(e.questions.length,6);assert(e.questions.some(q=>q.kind==='combined'&&q.answer.id==='i0'));assert(e.questions.some(q=>q.kind==='combined'&&q.answer.id==='ps'));
for(const kind of ['pressureWave','combined']){const m=buildComparison(kind);assert(m.alarm>0);assert(m.frames.at(-1).fault.fault);assert(m.frames.some(p=>p.fault.fault&&p.fault.pressureOK));if(kind==='combined'){assert(m.frames.some(p=>p.fault.x===0&&p.fault.i0));assert(m.frames.some(p=>p.fault.x===0&&!p.fault.i0));}}
const bad=good.map(e=>({...e,answers:e.questions.map(q=>q.options.find(o=>o.id!==q.answer.id).id)}));assert.equal(examProfile(bad).tier,'foundation');assert(Object.keys(examProfile(bad).errors).length);
console.log('PASS adaptive levels, downgrade, error targets, combined pressure/sensor evidence and retained intermittent pressure alarm.');
const targetHistory=good.map(e=>({...e,answers:e.questions.map(q=>q.answer.id==='q'?q.options.find(o=>o.id!==q.answer.id).id:q.answer.id)}));
const targeted=makeExam(()=>.6,targetHistory);assert(targeted.questions.some(q=>q.answer.id==='q'));
for(const q of e.questions){assert.equal(q.options.filter(o=>q.changes.some(c=>c.bank===q.bank&&c.id===o.id)).length,1);assert(q.options.some(o=>o.id===q.answer.id));}
console.log('PASS prior-error targeting and exactly one valid choice in advanced questions.');
