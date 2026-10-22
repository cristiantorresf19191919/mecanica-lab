import assert from 'node:assert/strict';
import {createRepair,advanceRepair,repairAction,repairScore,repairPair} from '../dist/machines/repair-model.mjs';
for(const kind of ['pressure','jam','sensor','pressureWave','combined']){
 const r=createRepair(kind);assert(r.fault.fault,kind);
 repairAction(r,'verify');assert(!r.done);assert.equal(repairScore(r),85);
 for(const cause of [...r.remaining])repairAction(r,cause);
 for(let i=0;i<150;i++)advanceRepair(r);
 assert(r.fault.fault);repairAction(r,'reset');assert(!r.fault.fault,kind);assert(!r.fault.run);
 repairAction(r,'start');for(let i=0;i<800;i++)advanceRepair(r);
 repairAction(r,'verify');assert(r.done,kind);assert.equal(r.fault.cycles,1);
 const pair=repairPair(r);assert.equal(pair.normal.time,pair.fault.time);assert(pair.fault.complete);
}
const r=createRepair('combined');repairAction(r,'pressure');assert.deepEqual(r.remaining,['i0']);repairAction(r,'hint');assert.equal(repairScore(r),90);repairAction(r,'pressure');assert.equal(repairScore(r),75);
console.log('Repair: five cases, retained faults, full-cycle verification, scoring and residual fault passed.');
