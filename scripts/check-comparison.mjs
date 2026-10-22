import assert from 'node:assert/strict';
import {buildComparison,differences} from '../dist/machines/comparison-model.mjs';
for(const kind of ['pressure','jam','sensor']){
 const e=buildComparison(kind);assert(e.first>0);assert(e.alarm>=e.first);assert(e.frames.at(-1).normal.complete);assert(e.frames.at(-1).fault.fault);
 for(const [i,p]of e.frames.entries()){assert.equal(p.normal.time,p.fault.time);if(i<e.first)assert.equal(differences(p.normal,p.fault).length,0);}
 assert(differences(e.frames[e.first].normal,e.frames[e.first].fault).length);
 assert.equal(e.frames[e.alarm].fault.q,false);assert.equal(e.frames[e.alarm].fault.qB,false);
 if(kind==='jam')assert(e.alarm>e.first);
 if(kind==='sensor'){assert(e.frames.some(p=>p.fault.x===1&&!p.fault.i1));assert(e.frames.some(p=>p.fault.x===1&&p.fault.i1));}
 console.log('PASS',kind,'first',e.first*.02,'alarm',e.alarm*.02);
}
