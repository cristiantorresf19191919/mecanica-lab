import assert from 'node:assert/strict';
import {createRepairExam,repairExamAction} from '../dist/concepts/repair-exam-model.mjs';
import {createRepairExamArchive,repairExamMastery} from '../dist/concepts/repair-exam-history.mjs';
const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},archive=createRepairExamArchive(storage);
const finish=()=>{const e=createRepairExam([],()=>0);for(let i=0;i<3;i++){for(const f of e.cases[i].faults)repairExamAction(e,i,'repair',f);repairExamAction(e,i,'verify');}return e;};
for(let i=0;i<3;i++){const e=finish();archive.add(e);archive.add(e);e.cases[0].errors=99;}
assert.equal(archive.all().length,3);assert.equal(archive.all()[0].cases[0].errors,0);assert(repairExamMastery(archive.all()).every(x=>x.status==='Consistente sin errores'));
assert.equal(createRepairExamArchive(storage).all().length,3);
const bad=finish();bad.cases[0].events.push({action:'repair',choice:'load',wrong:true,targets:['ratio']});archive.add(bad);const m=repairExamMastery(archive.all());assert.equal(m.find(x=>x.fault==='load').errors,1);assert.equal(m.find(x=>x.fault==='ratio').errors,0);
for(let i=0;i<52;i++)archive.add(finish());assert.equal(archive.all().length,50);
const fallback=createRepairExamArchive({getItem(){throw Error();},setItem(){throw Error();}});fallback.add(finish());assert.equal(fallback.all().length,1);assert(fallback.warning());
console.log('PASS archive dedupe, immutable snapshots, reload, 50 cap, per-cause mastery and attribution, storage fallback.');
