import assert from 'node:assert/strict';
import {repairSequenceAdvice} from '../dist/learn/workshop-repair-sequence.mjs';
import {newRepair,intervene} from '../dist/learn/workshop-repair-model.mjs';
for(const kind of ['mechanics','electronics','hydraulics','pneumatics']){const repair=newRepair({kind,fault:'combined'});intervene(repair,'alternate');intervene(repair,'alternate');const c={repair},before=JSON.stringify(c),a=repairSequenceAdvice(c);assert.deepEqual(a.actions.map(x=>x.type),['keep','repeated']);assert.deepEqual(a.added,['primary']);assert.equal(a.actions[0].recommendedStep,1);assert.equal(JSON.stringify(c),before);const lone=newRepair({kind,fault:'primary'});intervene(lone,'alternate');assert.equal(repairSequenceAdvice({repair:lone}).actions[0].type,'unrelated');}
console.log('PASS repeated versus unrelated repairs, preserved useful order, missing steps and immutable records');
