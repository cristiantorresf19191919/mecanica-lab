import assert from 'node:assert/strict';
import {adaptiveExamPlan,examEvidence} from '../dist/concepts/guided-exam-adaptive.mjs';
import {createGuidedRepair,guidedChoose,guidedNext} from '../dist/concepts/repair-guided.mjs';
import {faultCatalog} from '../dist/concepts/energy-faults.mjs';
import {createGuidedExam} from '../dist/concepts/guided-exam-model.mjs';
function sample(lab,level='basic',wrong=false){const g=createGuidedRepair({lab,level,faults:faultCatalog[lab].map(f=>f.id)});g.guidedExam=crypto.randomUUID();if(wrong){guidedChoose(g,'verify');guidedNext(g);}for(const f of g.faults){guidedChoose(g,'repair',f);guidedNext(g);}guidedChoose(g,'verify');return g;}
assert(adaptiveExamPlan([],()=>0).every(p=>p.level==='basic'));
const rows=Object.keys(faultCatalog).flatMap(lab=>Array.from({length:3},()=>sample(lab)));
assert(adaptiveExamPlan(rows,()=>0).every(p=>p.level==='intermittent'&&p.faults.length===1));
const advanced=Object.keys(faultCatalog).flatMap(lab=>Array.from({length:3},()=>sample(lab,'intermittent')));
assert(adaptiveExamPlan(advanced,()=>0).every(p=>p.level==='combined'&&p.faults.length===2));
const fail=sample('transformload','combined',true),after=adaptiveExamPlan([...advanced,fail],()=>0)[0];assert.equal(after.level,'basic');assert.equal(after.target.action,'verify');
const practice=rows.map(r=>({...r,guidedExam:undefined,reviewTarget:{action:'verify'}}));assert(adaptiveExamPlan(practice,()=>0).every(p=>p.level==='basic'));
assert.equal(examEvidence(rows,[{cases:rows}]).length,rows.length);
const exam=createGuidedExam([],()=>0,[{cases:advanced}]);assert(exam.cases.every(c=>c.level==='combined'&&c.adaptiveEvidence.cleanExams===3));
const single=sample('opamp');single.faults=['rail'];single.steps=[{action:'repair',choice:'gain',correct:false,before:[],after:[],recommendedIds:['rail']}];single.errors=1;
assert.deepEqual(adaptiveExamPlan([single],()=>0).find(p=>p.lab==='opamp').faults,['rail']);
console.log('PASS cold start, exam-gated progression, combined coverage, regression after errors, archive deduplication and original-cause preservation');
