import assert from 'node:assert/strict';
import {faultCatalog,diagnosticSetup,createEnergyFault,faultyEnergy,actEnergyFault,verifyEnergyFault,energyFaultScore} from '../dist/concepts/energy-faults.mjs';
import {calculate} from '../dist/concepts/models.mjs';
for(const id of Object.keys(faultCatalog))for(const random of [()=>0,()=>.99]){
 const s=createEnergyFault(id,random),[a,b]=diagnosticSetup[id],n=calculate(id,id,a,b,.5),f=faultyEnergy(s,a,b,.5);
 assert.notDeepEqual(n.metrics,f.metrics,id+': visible symptom');assert(!verifyEnergyFault(s,a,b));
 actEnergyFault(s,'verify');assert(!s.done);assert.equal(energyFaultScore(s),85);
 actEnergyFault(s,'hint');assert.equal(energyFaultScore(s),75);
 actEnergyFault(s,'repair',faultCatalog[id].find(x=>x.id!==s.fault).id);assert(!s.repaired);
 actEnergyFault(s,'diagnose',s.fault);actEnergyFault(s,'repair',s.fault);assert(s.repaired);assert(verifyEnergyFault(s,a,b));actEnergyFault(s,'verify');assert(s.done);assert.equal(energyFaultScore(s),60);
 const before=structuredClone(s);actEnergyFault(s,'hint');assert.deepEqual(s,before);
}
console.log('PASS six faults: symptoms, incorrect repair, hints, scoring, full sweep verification and terminal state.');
