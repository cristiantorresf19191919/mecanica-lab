import assert from 'node:assert/strict';
import {createGuidedExam,guidedExamAct} from '../dist/concepts/guided-exam-model.mjs';
import {createExamArchive,retryExamDecision,examMastery} from '../dist/concepts/guided-exam-history.mjs';
import {guidedChoose,guidedNext} from '../dist/concepts/repair-guided.mjs';
let value=null;const storage={getItem:()=>value,setItem:(k,v)=>value=v};const a=createExamArchive(storage),e=createGuidedExam([],()=>0);
assert.equal(a.save(e),false);
for(let i=0;i<3;i++){guidedExamAct(e,i,'verify');guidedExamAct(e,i,'next');for(const f of e.cases[i].faults){guidedExamAct(e,i,'repair',f);guidedExamAct(e,i,'next');}guidedExamAct(e,i,'verify');}
assert(a.save(e));assert.equal(a.save(e),false);assert.equal(createExamArchive(storage).all().length,1);
const original=JSON.stringify(e),r=retryExamDecision(e,0,0);assert.notEqual(r.id,e.cases[0].id);assert.deepEqual(r.fixed,e.cases[0].steps[0].before);assert.equal(retryExamDecision(e,0,1),null);
for(const f of r.faults){guidedChoose(r,'repair',f);guidedNext(r);}guidedChoose(r,'verify');assert(r.done);assert.equal(JSON.stringify(e),original);
assert(examMastery([e]).some(x=>x.errors===1));assert(examMastery([e]).every(x=>!x.mastered));
const copy=a.all();copy[0].cases[0].fixed=[];assert.equal(JSON.stringify(a.all()[0]),original);
assert(createExamArchive({getItem:()=>'{'}).warning());const broken=createExamArchive({getItem:()=>null,setItem(){throw Error();}});broken.save(e);assert(broken.warning());assert.equal(broken.all().length,1);
console.log('PASS archive persistence, deduplication, immutable scores, retry snapshots, mastery and storage failures');
