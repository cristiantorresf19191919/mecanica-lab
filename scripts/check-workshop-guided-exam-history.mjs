import assert from 'node:assert/strict';
import {newGuidedExam} from '../dist/learn/workshop-guided-exam-model.mjs';
import {guidedCaseErrors,guidedExamMastery} from '../dist/learn/workshop-guided-exam-history.mjs';
import {examIntervene,examMeasure,submitRepairCase} from '../dist/learn/workshop-repair-exam-model.mjs';
import {required} from '../dist/learn/workshop-model.mjs';
function exam(wrong=false){const e=newGuidedExam([],()=>.1);for(const c of e.cases){if(wrong)examIntervene(c,'alternate');examIntervene(c,'primary');for(const id of required[c.repair.kind])for(const time of [.5,1.25])examMeasure(c,id,time);submitRepairCase(e);}return e;}
const bad=exam(true),good=exam();assert.equal(guidedCaseErrors(bad.cases[0])[0].id,'alternate');assert.equal(guidedCaseErrors(good.cases[0]).length,0);
const g=guidedExamMastery([bad,good,exam()]);assert.equal(g.find(x=>x.key==='mechanics:primary').mastered,true);assert.equal(g.find(x=>x.key==='mechanics:alternate').correct,0);
const omitted=newGuidedExam([],()=>.1);assert.ok(guidedCaseErrors(omitted.cases[0]).some(e=>e.missing&&e.measurements));
const repeat=exam();repeat.cases[0].submitted=false;examIntervene(repeat.cases[0],'primary');assert.ok(guidedCaseErrors(repeat.cases[0]).some(e=>e.unnecessary===1&&e.measurements));
assert.deepEqual(guidedExamMastery([]),[]);assert.equal(guidedExamMastery([good])[0].mastered,false);
console.log('PASS omitted, unnecessary and measurement mistakes, per-case mastery, sample threshold and empty history');
const regressed=exam(true);regressed.cases[0].repair.actions.push({id:'primary',useful:false});
assert.equal(guidedExamMastery([good,exam(),regressed]).find(g=>g.key==='mechanics:primary').mastered,false);
const original=JSON.stringify(bad);guidedExamMastery([bad]);guidedCaseErrors(bad.cases[0]);assert.equal(JSON.stringify(bad),original);
