import assert from 'node:assert/strict';
import {createRepairHistory,repairPriorities} from '../dist/concepts/energy-repair-history.mjs';
import {createExamRepair,applyExamRepair} from '../dist/concepts/energy-exam-repair.mjs';
const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},h=createRepairHistory(storage);
for(let i=0;i<3;i++){const r=createExamRepair({id:'x',status:'finished',cases:[{lab:'opamp',level:'basic',faults:['gain']}]},0);applyExamRepair(r,'repair','gain');applyExamRepair(r,'verify');h.save(r.state);h.save(r.state);}
assert.equal(h.all().length,3);assert.equal(createRepairHistory(storage).all().length,3);
assert.equal(repairPriorities(h.all()).find(x=>x.fault==='gain').level,'intermittent');
const bad=createExamRepair({id:'y',status:'finished',cases:[{lab:'opamp',level:'basic',faults:['gain']}]},0);applyExamRepair(bad,'repair','rail');applyExamRepair(bad,'hint');applyExamRepair(bad,'repair','gain');applyExamRepair(bad,'verify');h.save(bad.state);
assert.equal(repairPriorities(h.all()).find(x=>x.fault==='rail').errors,1);assert.equal(repairPriorities(h.all()).find(x=>x.fault==='gain').level,'basic');
const clone=h.all();clone[0].score=0;assert.equal(h.all()[0].score,100);
const legacy={...h.all()[0],id:'old',exam:false,sourceExam:'e'};const migrated=createRepairHistory(storage,[legacy,{...legacy,id:'retry',events:[{action:'retry'}]}]);assert.equal(migrated.all().length,5);assert.equal(createRepairHistory(storage,[legacy]).all().length,5);
const fallback=createRepairHistory({getItem(){throw Error();},setItem(){throw Error();}});fallback.save(bad.state);assert.equal(fallback.all().length,1);assert(fallback.warning());
console.log('PASS persistence, dedupe, migration, retry exclusion, attribution, priority, level adjustment, immutable records and fallback.');
