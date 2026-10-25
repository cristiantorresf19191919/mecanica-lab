import assert from 'node:assert/strict';
import {createCase,frame,ignition,measure} from '../dist/autos/model.mjs';
import {comparisonValues,visibleDifferences,advancePair,steps} from '../dist/autos/comparison.mjs';
assert.equal(steps.length,7);
for(const fault of ['battery','ground','relay','spark','fuel','compression','charge']){
 const s=createCase('diagnosis');s.fault=fault;const r={...s,fault:null};ignition(s,'crank');ignition(r,'crank');const before=JSON.stringify([s,r]);
 const part={battery:'battery',ground:'drop',relay:'command',spark:'spark',fuel:'fuel',compression:'compression',charge:'charge'}[fault];
 if(fault!=='charge'){const m=comparisonValues(s,r,part);assert(m.valid);assert(m.different);}
 assert.equal(JSON.stringify([s,r]),before);
 const p=advancePair({actual:0,reference:0},frame(s),frame(r),.05);if(fault==='relay')assert.equal(p.actual,0);if(['battery','ground'].includes(fault))assert(p.actual<p.reference);else if(!['relay'].includes(fault))assert.equal(p.actual,p.reference);
 if(fault==='relay'){assert(!comparisonValues(s,r,'compression').valid);assert(measure(s,'compression').includes('necesita giro'));assert(!s.measured.includes('compression'));}
 ignition(s,'run');ignition(r,'run');assert(frame(r).running);assert.equal(comparisonValues(s,r,'charge').valid,fault==='charge');if(fault==='charge')assert(comparisonValues(s,r,'charge').different);
 s.repaired=true;ignition(s,'crank');ignition(r,'crank');assert.deepEqual(visibleDifferences(frame(s),frame(r)),[]);for(const step of steps.filter(x=>x.id!=='charge'))assert(!comparisonValues(s,r,step.id).different);
}
console.log('PASS reference purity, seven comparisons, synchronized time with independent response, no-spin validity and repaired convergence');
