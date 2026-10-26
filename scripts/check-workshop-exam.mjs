import assert from 'node:assert/strict';
import {newExam,grade,submit,examReady,expected,archiveExam,examEvidence,readExam,examKey} from '../dist/learn/workshop-exam-model.mjs';
import {required,sampleTimes,correctDiagnosis} from '../dist/learn/workshop-model.mjs';
import {reviewSchedule} from '../dist/learn/workshop-review.mjs';
const e=newExam([],()=>.1);assert.equal(e.cases.length,4);assert.equal(submit(e),false);const store=new Map(),storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};
for(const c of e.cases){c.readings.push({id:required[c.kind][0],time:.5,choice:null});storage.setItem(examKey,JSON.stringify(e));assert.ok(readExam(storage));c.readings=[];for(const time of sampleTimes(c))for(const id of required[c.kind])c.readings.push({id,time,choice:expected(c,id,time)});c.diagnosis=correctDiagnosis(c);assert.ok(examReady(c));assert.equal(grade(c).score,100);assert.ok(submit(e));}
assert.ok(e.finished);assert.equal(submit(e),false);archiveExam(storage,e);archiveExam(storage,e);assert.equal(examEvidence(storage).length,4);e.cases[0].readings[0].choice=!e.cases[0].readings[0].choice;e.cases[0].diagnosis='spark';assert.ok(grade(e.cases[0]).score<50);
const bad=newExam([],()=>.1);bad.cases=e.cases;bad.finished=new Date().toISOString();archiveExam(storage,bad);const evidence=examEvidence(storage);assert.equal(evidence.length,8);assert.ok(reviewSchedule(evidence).some(s=>s.kind==='mechanics'&&s.errors>0));
const inter=newExam([],()=>.1).cases[0];inter.fault='intermittent-primary';inter.diagnosis=correctDiagnosis(inter);inter.readings=required[inter.kind].map(id=>({id,time:.5,choice:false}));assert.equal(examReady(inter),false);
console.log('PASS four-case exam, no early submit, resume partial measurements, grading, finish gate, idempotent archive, review evidence and intermittent evidence requirements');
