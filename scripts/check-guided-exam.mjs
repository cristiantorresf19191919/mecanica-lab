import assert from 'node:assert/strict';
import {createGuidedExam,guidedExamAct,guidedExamScore,validGuidedExam} from '../dist/concepts/guided-exam-model.mjs';
import {createGuidedHistory} from '../dist/concepts/repair-guided-history.mjs';
const e=createGuidedExam([],()=>0);assert(validGuidedExam(e));assert.equal(new Set(e.cases.map(c=>c.lab)).size,3);assert.equal(guidedExamAct(e,0,'hint'),false);assert.equal(guidedExamAct(e,1,'repair','gain'),false);
for(let i=0;i<3;i++){guidedExamAct(e,i,'verify');assert.equal(e.cases[i].phase,'feedback');assert.equal(guidedExamAct(e,i,'repair',e.cases[i].faults[0]),false);guidedExamAct(e,i,'next');for(const f of e.cases[i].faults){guidedExamAct(e,i,'repair',f);guidedExamAct(e,i,'next');}guidedExamAct(e,i,'verify');}
assert.equal(e.status,'finished');assert.equal(guidedExamScore(e),85);assert(validGuidedExam(JSON.parse(JSON.stringify(e))));assert.equal(guidedExamAct(e,0,'next'),false);
const h=createGuidedHistory({getItem:()=>null,setItem(){}});for(const c of e.cases){h.save(c);h.save(c);}assert.equal(h.all().length,3);assert(h.all().every(c=>c.guidedExam===e.id));assert.deepEqual(e.cases[0].steps[0].before,[]);assert.equal(e.cases[0].steps[0].recommendedIds.length,1);
console.log('PASS three-lab coverage, no hints, pause/feedback gating, scoring, persistence schema, delayed completion, review snapshots and deduplicated guided results.');
