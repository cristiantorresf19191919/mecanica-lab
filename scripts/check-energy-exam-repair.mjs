import assert from 'node:assert/strict';
import {createExamRepair,applyExamRepair} from '../dist/concepts/energy-exam-repair.mjs';
import {faultCatalog,energyFaultScore,verifyEnergyFault,diagnosticSetup} from '../dist/concepts/energy-faults.mjs';
for(const lab of Object.keys(faultCatalog))for(const level of ['basic','combined','intermittent']){
 const faults=faultCatalog[lab].map(f=>f.id).slice(0,level==='combined'?2:1);
 const exam={id:'exam',status:'finished',cases:[{lab,level,faults}]},original=JSON.stringify(exam),r=createExamRepair(exam,0);
 applyExamRepair(r,'verify');assert.equal(r.state.done,false);assert.equal(energyFaultScore(r.state),85);
 applyExamRepair(r,'hint');assert.equal(energyFaultScore(r.state),75);
 for(const [i,f] of [...faults].reverse().entries()){
 applyExamRepair(r,'repair',f);
 if(i<faults.length-1)assert.equal(verifyEnergyFault(r.state,...diagnosticSetup[lab]),false);
 }
 assert.equal(verifyEnergyFault(r.state,...diagnosticSetup[lab]),true);
 applyExamRepair(r,'verify');assert.equal(r.state.done,true);assert.equal(energyFaultScore(r.state),75);
 const terminal=JSON.stringify(r);applyExamRepair(r,'hint');assert.equal(JSON.stringify(r),terminal);
 assert.equal(JSON.stringify(exam),original);
}
const r=createExamRepair({id:'x',status:'finished',cases:[{lab:'opamp',level:'basic',faults:['gain']}]},0);
applyExamRepair(r,'repair','rail');assert.equal(r.state.repairedIds.length,0);assert.equal(r.state.errors,1);
console.log('PASS all labs/levels, partial repair, reverse order, penalties, full verification, immutable exam and terminal guard.');
