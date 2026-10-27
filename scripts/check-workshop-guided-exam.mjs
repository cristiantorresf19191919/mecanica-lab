import assert from 'node:assert/strict';
import {newGuidedExam,saveGuidedExam,loadGuidedExams,guidedExamEvidence} from '../dist/learn/workshop-guided-exam-model.mjs';
import {examIntervene,examMeasure,submitRepairCase,repairExamGrade} from '../dist/learn/workshop-repair-exam-model.mjs';
import {required} from '../dist/learn/workshop-model.mjs';
import {guidedReviews} from '../dist/learn/workshop-repair-guided-review.mjs';
import {guidedWeekly} from '../dist/learn/workshop-repair-guided-weekly.mjs';
const map=new Map(),store={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)},e=newGuidedExam([],()=>.1);
assert.ok(e.cases.every(c=>c.repair.fault==='primary'));saveGuidedExam(store,e);assert.equal(guidedExamEvidence(store).length,0);
for(let i=0;i<4;i++){const c=e.cases[i];if(i===0)examIntervene(c,'alternate');examIntervene(c,'primary');for(const id of required[c.repair.kind])for(const time of [.5,1.25])examMeasure(c,id,time);submitRepairCase(e);}
e.finished='2026-10-27T12:00:00Z';saveGuidedExam(store,e);saveGuidedExam(store,e);assert.equal(loadGuidedExams(store).length,1);assert.equal(repairExamGrade(e.cases[0]).score,85);
const evidence=guidedExamEvidence(store);assert.equal(evidence.length,1);assert.equal(evidence[0].id,'alternate');const now=new Date('2026-10-27T18:00:00Z'),r=guidedReviews([],now,evidence);assert.equal(r.entries[0].due,'2026-10-28');assert.equal(r.completed,0);assert.equal(r.streak,0);assert.equal(guidedWeekly([],2,now,evidence).plan.scheduled,1);
console.log('PASS guided exam creation, separate persistence, deferred evidence, grading and review adjustment without activity credit');
assert.equal(map.has('mecanica.workshop.repairExam.v1'),false);
const missed=newGuidedExam([],()=>.9);for(let i=0;i<4;i++)submitRepairCase(missed);missed.finished='2026-10-27T13:00:00Z';saveGuidedExam(store,missed);const all=guidedExamEvidence(store);assert.ok(all.some(x=>x.kind==='hydraulics'&&x.id==='alternate'));
