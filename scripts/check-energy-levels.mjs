import assert from 'node:assert/strict';
import {createEnergyFault,faultyEnergy,actEnergyFault,diagnosticSetup,verifyEnergyFault} from '../dist/concepts/energy-faults.mjs';
import {createEnergyResults} from '../dist/concepts/energy-results.mjs';
for(const id of ['transformload','opamp','relief']){
 const s=createEnergyFault(id,()=>0,'combined'),[a,b]=diagnosticSetup[id];
 actEnergyFault(s,'diagnose',s.faults[0]);actEnergyFault(s,'repair',s.faults[0]);assert(!verifyEnergyFault(s,a,b));actEnergyFault(s,'verify');assert(!s.done);
 actEnergyFault(s,'diagnose',s.faults[1]);actEnergyFault(s,'repair',s.faults[1]);actEnergyFault(s,'verify');assert(s.done);
 const i=createEnergyFault(id,()=>0,'intermittent');const on=faultyEnergy(i,a,b,.1),off=faultyEnergy(i,a,b,.8);assert.notDeepEqual(on.metrics,off.metrics);assert(!verifyEnergyFault(i,a,b));
 let data='[]';const storage={getItem:()=>data,setItem:(k,v)=>{data=v;}};const store=createEnergyResults(storage);store.save(s);store.save(s);assert.equal(store.all().length,1);assert.equal(createEnergyResults(storage).all()[0].score,85);assert.equal(store.stats().length,2);
 const blocked=createEnergyResults({getItem(){throw Error();},setItem(){throw Error();}});blocked.save(s);assert(blocked.warning());assert.equal(blocked.all().length,1);
}
console.log('PASS combined residual causes, intermittence, completion, deduplication, reload, statistics and storage fallback.');
